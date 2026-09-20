import { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronRight, BookMarked } from 'lucide-react';
import { DICTIONARY } from '@/lib/tutor';

// 按 id 前缀粗分大类，便于浏览
function categoryOf(id: string): string {
  if (['d-pandas','d-numpy','d-matplotlib','d-stats','d-hypothesis','d-window'].includes(id)) return '数据科学';
  if (['d-llm','d-rag','d-embedding','d-prompt','d-funcall','d-agent','d-vector-db','d-pytorch','d-gradient','d-mlflow'].includes(id)) return 'AI / 大模型';
  if (['d-select','d-join','d-groupby','d-sql-index','d-sqlalchemy'].includes(id)) return '数据库 / SQL';
  if (['d-git-basic','d-git-branch','d-linux','d-pip','d-pkg','d-readme','d-env','d-docker','d-nginx','d-cloud','d-cicd','d-pytest','d-lint','d-logging'].includes(id)) return '工程化 / 部署';
  if (['d-html','d-css','d-js','d-react','d-react-hooks','d-router','d-http','d-fastapi','d-jwt','d-https'].includes(id)) return '前后端';
  if (['d-complexity','d-array','d-binary','d-recursion','d-sliding','d-dfs','d-leetcode'].includes(id)) return '算法';
  if (['d-resume','d-interview','d-cv','d-ab'].includes(id)) return '求职 / 业务';
  return 'Python 基础';
}

const CAT_ORDER = [
  'Python 基础',
  '数据科学',
  'AI / 大模型',
  '数据库 / SQL',
  '工程化 / 部署',
  '前后端',
  '算法',
  '求职 / 业务',
];

export default function DictionaryPage() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const list = kw
      ? DICTIONARY.filter(
          (e) =>
            e.title.toLowerCase().includes(kw) ||
            e.meaning.toLowerCase().includes(kw) ||
            e.aliases.some((a) => a.toLowerCase().includes(kw)),
        )
      : DICTIONARY;
    return list;
  }, [q]);

  const byCat = useMemo(() => {
    const m = new Map<string, typeof DICTIONARY>();
    for (const e of filtered) {
      const c = categoryOf(e.id);
      if (!m.has(c)) m.set(c, []);
      m.get(c)!.push(e);
    }
    return CAT_ORDER.filter((c) => m.has(c)).map((c) => ({
      cat: c,
      items: m.get(c)!,
    }));
  }, [filtered]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4 flex items-center gap-3">
        <BookMarked className="h-7 w-7 text-amber-400" />
        <div>
          <h1 className="text-2xl font-bold">喵喵字典</h1>
          <p className="text-sm text-muted-foreground">
            全部 {DICTIONARY.length} 个词条，按"是什么 / 怎么用 / 搭配 / 场景 / 坑"组织。点词条展开。
          </p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜：变量 / git / SQL / RAG / React ..."
          className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-400"
        />
      </div>

      {byCat.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">没找到匹配的词条</div>
      )}

      {byCat.map(({ cat, items }) => (
        <div key={cat} className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-500">
            {cat} · {items.length}
          </h2>
          <div className="space-y-2">
            {items.map((e) => {
              const isOpen = open === e.id;
              return (
                <div key={e.id} className="rounded-lg border bg-card">
                  <button
                    onClick={() => setOpen(isOpen ? null : e.id)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-accent/50"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <span className="font-medium">{e.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {e.aliases.slice(0, 3).join(' / ')}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t px-4 py-3 text-sm space-y-3">
                      <section>
                        <div className="font-semibold text-amber-500">是什么</div>
                        <p className="mt-1">{e.meaning}</p>
                      </section>
                      <section>
                        <div className="font-semibold text-amber-500">固定写法</div>
                        <pre className="mt-1 overflow-x-auto rounded bg-slate-950 p-3 text-xs text-emerald-300">
                          {e.fixedUsage}
                        </pre>
                      </section>
                      <section>
                        <div className="font-semibold text-amber-500">哪些能换</div>
                        <p>{e.variants}</p>
                      </section>
                      <section>
                        <div className="font-semibold text-amber-500">常见搭配</div>
                        <div className="mt-1 space-y-2">
                          {e.patterns.map((p, i) => (
                            <div key={i} className="rounded border p-2">
                              <div className="text-xs font-semibold">{p.name}</div>
                              <pre className="mt-1 overflow-x-auto rounded bg-slate-950 p-2 text-xs text-emerald-300">
                                {p.code}
                              </pre>
                              <div className="mt-1 text-xs text-muted-foreground">{p.note}</div>
                            </div>
                          ))}
                        </div>
                      </section>
                      <section>
                        <div className="font-semibold text-amber-500">怎么和别的拼起来</div>
                        <p>{e.combos}</p>
                      </section>
                      <section>
                        <div className="font-semibold text-amber-500">用在哪</div>
                        <ul className="list-disc pl-5">{e.scenarios.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      </section>
                      <section>
                        <div className="font-semibold text-rose-400">新手坑</div>
                        <p>{e.pitfalls}</p>
                      </section>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
