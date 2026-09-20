#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_mocks.py — 每周一次，根据本周前沿动态，用 LLM 自动生成新的模拟项目和模拟竞赛。

需要环境变量：
  LLM_API_KEY
  LLM_BASE_URL
  LLM_MODEL

输出：
  public/data/mock-library.json  = {
    "generatedAt": "...",
    "projects": [...],
    "contests": [...]
  }

前端启动时 merge 这个文件到静态数据里。
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "data" / "mock-library.json"

PROMPT = """你是资深技术面试官 + 竞赛教练。现在是 2026 年。请根据本周最新的企业招聘需求、技术趋势和竞赛热点，生成：

1. 3 个新的"企业实战模拟项目"草稿
2. 2 个新的"模拟竞赛"草稿

要求：
- 紧跟当下最热方向：RAG / Agent / 多模态 / 全栈 / 数据工程 / 前端工程化 / 云原生 / AI Infra 等
- 难度覆盖入门~进阶（difficulty: 1-4）
- 每个项目字段：id(唯一,以 gen-proj- 开头), title, company, role, stack[], summary, background, duration, difficulty, category, skills[](技能 id: python/java/cpp/go/algo/sql/redis/vector/linux/git/spring/fastapi/docker/dist/ds/ml/dl/llm/deploy/web/vue/react/review 中选), phases[](每个阶段 {name, goal, tasks: [{name, xp: 50}]})
- 每个竞赛字段：id(唯一,以 gen-arc- 开头), name, host, category, level, regStart(今天), regEnd, contestStart, contestEnd, tags[], summary, registrationUrl, officialUrl, recurring=false
- 难度 -> 所需等级：(difficulty-1)*3+1
- 严格输出 JSON：{"projects": [...], "contests": [...]}，不要解释，不要 markdown 代码块。
"""


def call_llm() -> str:
    key = os.getenv("LLM_API_KEY")
    base = os.getenv("LLM_BASE_URL", "https://ark.cn-beijing.volces.com/api/v3")
    model = os.getenv("LLM_MODEL", "doubao-pro-32k")
    if not key:
        print("[skip] 未配置 LLM_API_KEY，跳过", file=sys.stderr)
        return ""
    body = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": PROMPT}],
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
    text = call_llm()
    if not text:
        # 没配 Key 也写一个空文件，保证前端不会 404
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
