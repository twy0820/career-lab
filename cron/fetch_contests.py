#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_contests.py — 定时拉取公开竞赛/项目机会，合并进 public/data/competitions.json

设计：
  - 每个 source 是一个函数，返回 list[dict]（字段对齐 IContest）
  - 脚本读现有 competitions.json 作为 base，按 id 去重合并
  - 新数据放在前面，旧数据保留
  - 失败的 source 不影响其他 source

本地跑：
  python cron/fetch_contests.py

GitHub Actions：每天 09:00 自动跑，commit 回仓库。
"""
from __future__ import annotations

import json
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Dict, List

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "data" / "competitions.json"
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")


def http_get(url: str, timeout: int = 15) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "CareerLab-Cron/1.0 (student training platform)",
            "Accept": "application/json,text/html;q=0.5",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", errors="replace")


# ---------- 数据源：每个 source 返回 list[IContest] ----------

def source_kaggle() -> List[Dict]:
    """Kaggle 公开竞赛列表（无需登录的公开页）。
    注意：Kaggle 没有完全稳定的公开 JSON，这里用 HTML 列表做轻量解析；
    如果失败就返回空列表，不影响其他源。"""
    try:
        html = http_get("https://www.kaggle.com/competitions")
    except Exception as e:
        print(f"[kaggle] 跳过：{e}", file=sys.stderr)
        return []
    # 轻量解析：找 /competitions/<slug> 链接
    import re
    slugs = set(re.findall(r"/competitions/([a-zA-Z0-9_\-]+)", html))
    out = []
    for slug in list(slugs)[:20]:
        if slug in ("new", "search", "list"):
            continue
        out.append({
            "id": f"live-kaggle-{slug}",
            "name": slug.replace("-", " ").title(),
            "host": "Kaggle",
            "category": "数据AI",
            "level": "国际",
            "regStart": TODAY,
            "regEnd": "2099-12-31",
            "contestStart": TODAY,
            "contestEnd": "2099-12-31",
            "tags": ["Kaggle", "数据科学"],
            "summary": "Kaggle 公开竞赛（自动抓取，详情见官网）",
            "registrationUrl": f"https://www.kaggle.com/competitions/{slug}",
            "officialUrl": f"https://www.kaggle.com/competitions/{slug}",
            "note": "由定时任务自动同步",
            "recurring": False,
        })
    return out


def source_leetcode_weekly() -> List[Dict]:
    """LeetCode 周赛（固定每周日，recurring）。"""
    return [{
        "id": "live-lc-weekly",
        "name": "LeetCode 周赛 / 双周赛",
        "host": "LeetCode",
        "category": "编程竞赛",
        "level": "国际",
        "regStart": TODAY,
        "regEnd": "2099-12-31",
        "contestStart": TODAY,
        "contestEnd": "2099-12-31",
        "tags": ["算法", "周赛"],
        "summary": "每周固定节奏的算法竞赛，适合日常保持手感。",
        "registrationUrl": "https://leetcode.com/contest/",
        "officialUrl": "https://leetcode.com/contest/",
        "note": "常驻，每周自动开赛",
        "recurring": True,
    }]


def source_seed_existing() -> List[Dict]:
    """读现有文件作为 base，保证脚本永远不会清空数据。"""
    if not OUT.exists():
        return []
    try:
        return json.loads(OUT.read_text(encoding="utf-8"))
    except Exception:
        return []


SOURCES: List[Callable[[], List[Dict]]] = [
    source_seed_existing,
    source_kaggle,
    source_leetcode_weekly,
]


def main() -> int:
    merged: Dict[str, Dict] = {}
    for src in SOURCES:
        try:
            items = src() or []
        except Exception as e:
            print(f"[source {src.__name__}] 失败：{e}", file=sys.stderr)
            continue
        for it in items:
            cid = it.get("id")
            if not cid:
                continue
            # 新数据覆盖旧数据（同 id）
            merged[cid] = it

    out = list(merged.values())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[ok] 共 {len(out)} 条竞赛，写入 {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
