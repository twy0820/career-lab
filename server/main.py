"""实战工场 CareerLab 后端 — V2 起步版

提供：
  - GET  /api/health        健康检查
  - POST /api/auth/login     以昵称登录，返回 token（V2 简化版：无密码，仅用于演示进度同步）
  - GET  /api/progress       拉取某 token 对应用户的进度
  - PUT  /api/progress       保存进度（全量覆盖）
  - POST /api/ai/explain     AI 答疑试点（占位：未配置 LLM key 时返回模板提示）

运行：uvicorn server.main:app --reload --port 8000
"""
from __future__ import annotations

import json
import sqlite3
import time
import uuid
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "careerlab.db"

app = FastAPI(title="CareerLab API", version="2.0.0")


# ---------- DB ----------
def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with db() as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS users (
                token TEXT PRIMARY KEY,
                nickname TEXT NOT NULL,
                created_at REAL NOT NULL
            )"""
        )
        conn.execute(
            """CREATE TABLE IF NOT EXISTS progress (
                token TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                updated_at REAL NOT NULL
            )"""
        )


@app.on_event("startup")
def _startup() -> None:
    init_db()


# ---------- Schemas ----------
class LoginIn(BaseModel):
    nickname: str = Field(min_length=1, max_length=12)


class LoginOut(BaseModel):
    token: str
    nickname: str


class ProgressIn(BaseModel):
    data: dict[str, Any]


class AiExplainIn(BaseModel):
    topic: str
    question: str


# ---------- Auth dep ----------
def auth_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="missing bearer token")
    return authorization.split(" ", 1)[1].strip()


# ---------- Routes ----------
@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"ok": True, "service": "careerlab-api", "ts": int(time.time())}


@app.post("/api/auth/login", response_model=LoginOut)
def login(body: LoginIn) -> LoginOut:
    # V2 简化：昵称相同则复用 token，否则新建
    with db() as conn:
        row = conn.execute(
            "SELECT token FROM users WHERE nickname = ? ORDER BY created_at DESC LIMIT 1",
            (body.nickname,),
        ).fetchone()
        if row:
            token = row["token"]
        else:
            token = uuid.uuid4().hex
            conn.execute(
                "INSERT INTO users(token, nickname, created_at) VALUES (?,?,?)",
                (token, body.nickname, time.time()),
            )
    return LoginOut(token=token, nickname=body.nickname)


@app.get("/api/progress")
def get_progress(token: str = Depends(auth_token)) -> dict[str, Any]:
    with db() as conn:
        row = conn.execute(
            "SELECT data, updated_at FROM progress WHERE token = ?", (token,)
        ).fetchone()
    if not row:
        return {"data": None, "updated_at": 0}
    return {"data": json.loads(row["data"]), "updated_at": row["updated_at"]}


@app.put("/api/progress")
def put_progress(body: ProgressIn, token: str = Depends(auth_token)) -> dict[str, Any]:
    payload = json.dumps(body.data, ensure_ascii=False)
    now = time.time()
    with db() as conn:
        conn.execute(
            """INSERT INTO progress(token, data, updated_at) VALUES (?,?,?)
               ON CONFLICT(token) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at""",
            (token, payload, now),
        )
    return {"ok": True, "updated_at": now}


@app.post("/api/ai/explain")
def ai_explain(body: AiExplainIn) -> dict[str, Any]:
    """AI 答疑试点占位。

    接入真实 LLM 时：把 topic 相关的文档片段作为上下文，调用大模型 API，
    返回 answer 与 citations。当前未配置 key，返回教学引导模板。
    """
    return {
        "mode": "stub",
        "answer": (
            f"关于「{body.topic}」：这是 AI 导师试点接口。当前后端未配置 LLM API Key，"
            "请在 server/main.py 的 ai_explain 中接入你选择的大模型（建议做 RAG：先检索课程库再生成）。"
        ),
        "question": body.question,
    }


@app.get("/api")
def root() -> dict[str, str]:
    return {"docs": "/docs", "health": "/api/health"}
