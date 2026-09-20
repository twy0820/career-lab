# 定时任务目录

两个脚本，由 GitHub Actions 每天自动跑（见 `.github/workflows/cron.yml`）。

## 本地手动跑

```bash
python cron/fetch_contests.py
python cron/generate_projects.py
```

## 加新的竞赛源

打开 `cron/fetch_contests.py`，在 `SOURCES` 列表里加一个函数：

```python
def source_牛客():
    return [{
        "id": "nowcoder-xxx",
        "name": "...",
        "host": "牛客",
        "category": "编程竞赛",
        "level": "国内",
        "regStart": "2026-09-20",
        "regEnd": "2026-10-20",
        "contestStart": "...",
        "contestEnd": "...",
        "tags": ["..."],
        "summary": "...",
        "registrationUrl": "...",
        "officialUrl": "...",
        "note": "",
        "recurring": False,
    }]

SOURCES.append(source_牛客)
```

字段对齐 `src/data/types.ts` 的 `IContest`。

## LLM 生成项目（可选）

在 GitHub 仓库 Settings → Secrets 配三个变量：
- `LLM_API_KEY`
- `LLM_BASE_URL`
- `LLM_MODEL`

不配也没关系，脚本会跳过，不会报错。
