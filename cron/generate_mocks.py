#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_mocks.py — 每周一次，根据本周前沿动态，用 LLM 自动生成新的模拟项目和模拟竞赛。

需要环境变量：
  LLM_API_KEY
  LLM_BASE_URL
  LLM_MODEL

输出：
  public/data/mock-library.json
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "data" / "mock-library.json"

# 静态项目最多到 p50，静态竞赛最多到 a30；下周从这之后接着编
BASE_PROJ = 50
BASE_ARC = 30


def read_existing_ids():
    if not OUT.exists():
        return BASE_PROJ, BASE_ARC
    try:
        data = json.loads(OUT.read_text(encoding="utf-8"))
        mp = BASE_PROJ
        ma = BASE_ARC
        for p in data.get("projects", []):
            m = re.match(r"p(\d+)", str(p.get("id", "")))
            if m:
                mp = max(mp, int(m.group(1)))
        for c in data.get("contests", []):
            m = re.match(r"a(\d+)", str(c.get("id", "")))
            if m:
                ma = max(ma, int(m.group(1)))
        return mp, ma
    except Exception:
        return BASE_PROJ, BASE_ARC


def build_prompt(proj_start: int, arc_start: int) -> str:
    return f"""你是资深技术面试官 + 竞赛教练。现在是 2026 年。请根据本周最新的企业招聘需求、技术趋势和竞赛热点，生成：

1. 3 个新的"企业实战模拟项目"草稿
2. 2 个新的"模拟竞赛"草稿

要求：
- 紧跟当下最热方向：RAG / Agent / 多模态 / 全栈 / 数据工程 / 前端工程化 / 云原生 / AI Infra 等
- 难度覆盖入门~进阶（difficulty: 1-4）
- 项目 id 必须是 p{proj_start}、p{proj_start+1}、p{proj_start+2} 这种递增格式
- 竞赛 id 必须是 a{arc_start}、a{arc_start+1} 这种递增格式
- 每个项目字段：id, title, company, role, stack[], summary, background, duration, difficulty, category, skills[](技能 id: python/java/cpp/go/algo/sql/redis/vector/linux/git/spring/fastapi/docker/dist/ds/ml/dl/llm/deploy/web/vue/react/review 中选), phases[](每个阶段 {{name, goal, tasks: [{{name, xp: 50}}]}})
- 每个竞赛字段：id, name, host, category, level, regStart(今天), regEnd, contestStart, contestEnd, tags[], summary, registrationUrl, officialUrl, recurring=false
- 严格输出 JSON：{{"projects": [...], "contests": [...]}}，不要解释，不要 markdown 代码块。
"""


def call_llm(prompt: str) -> str:
    key = os.getenv("LLM_API_KEY")
    base = os.getenv("LLM_BASE_URL", "https://ark.cn-beijing.volces.com/api/v3")
    model = os.getenv("LLM_MODEL", "doubao-pro-32k")
    if not key:
        print("[skip] 未配置 LLM_API_KEY", file=sys.stderr)
        return ""
    body = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.8,
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{base}/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"[warn] LLM 调用失败：{e}", file=sys.stderr)
        return ""
    return data["choices"][0]["message"]["content"]


def main() -> int:
    max_proj, max_arc = read_existing_ids()
    prompt = build_prompt(max_proj + 1, max_arc + 1)
    text = call_llm(prompt)

    if not text:
        OUT.parent.mkdir(parents=True, exist_ok=True)
        OUT.write_text(
            json.dumps({"generatedAt": None, "projects": [], "contests": []}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return 0

    if "```" in text:
        text = text.split("```")[1].replace("json", "", 1).strip()
    try:
        data = json.loads(text)
    except Exception as e:
        print(f"[warn] LLM 返回不是 JSON：{e}", file=sys.stderr)
        return 0

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "projects": data.get("projects", []),
            "contests": data.get("contests", []),
        }, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[ok] 生成 {len(data.get('projects', []))} 项目 + {len(data.get('contests', []))} 竞赛")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
