#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_projects.py — 根据前沿需求，用 LLM 自动生成新模拟项目草稿。

需要环境变量：
  LLM_API_KEY   大模型 API Key（OpenAI 兼容）
  LLM_BASE_URL  例如 https://ark.cn-beijing.volces.com/api/v3
  LLM_MODEL     例如 doubao-pro-32k

没配 Key 时脚本直接退出（不报错），方便本地无 Key 也能跑 CI。

输出：cron/generated-projects.json（人工审核后再合入 src/data/projects.ts）
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "cron" / "generated-projects.json"

PROMPT = """你是资深技术面试官。请根据 2026 年当下企业最需要的技能，生成 2 个新的"企业实战模拟项目"草稿。
要求：
- 面向 0 基础到中级大学生，难度 2-3
- 覆盖当下热门方向（RAG/Agent/全栈/数据/前端工程化 任选）
- 每个项目给：id, title, company, role, stack, summary, background, duration, difficulty, category, skills（对应技能 id）
- 输出严格 JSON 数组，不要解释。
"""


def call_llm() -> str:
    key = os.getenv("LLM_API_KEY")
    base = os.getenv("LLM_BASE_URL", "https://ark.cn-beijing.volces.com/api/v3")
    model = os.getenv("LLM_MODEL", "doubao-pro-32k")
    if not key:
        print("[skip] 未配置 LLM_API_KEY，跳过生成", file=sys.stderr)
        return ""
    body = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": PROMPT}],
        "temperature": 0.7,
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{base}/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.loads(r.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


def main() -> int:
    text = call_llm()
    if not text:
        return 0
    # 简单提取 JSON 块
    if "```" in text:
        text = text.split("```")[1].replace("json", "", 1).strip()
    try:
        projects = json.loads(text)
    except Exception as e:
        print(f"[warn] LLM 返回不是合法 JSON：{e}", file=sys.stderr)
        return 0
    OUT.write_text(
        json.dumps({"generatedAt": datetime.now(timezone.utc).isoformat(), "projects": projects},
                    ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[ok] 生成 {len(projects)} 个项目草稿 → {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
