// 每课动手练习的参考答案 / 示范 + 举一反三。
// key = lessonId。若 lessons.ts 已自带 practiceAnswer/practiceVariants 则优先用 lessons 里的。
export interface ILessonPracticeAnswer {
  answer: string;
  variants: { name: string; note: string }[];
}

export const LESSON_PRACTICE: Record<string, ILessonPracticeAnswer> = {
  'python-0': {
    answer: `# 参考答案：把这三行拼起来跑一遍
names = ["张三", "李四"]
for n in names:
    print("你好，" + n)
print("共", len(names), "人")
# 运行：
# 你好，张三
# 你好，李四
# 共 2 人`,
    variants: [
      { name: '举一反三 1', note: '把 list 换成 dict {"name":"王五","age":20}，用 for k,v in d.items() 遍历打印。' },
      { name: '举一反三 2', note: '写一个函数 greet_all(names)，把上面逻辑封进去，调用两次。' },
    ],
  },
  'python-1': {
    answer: `# 参考答案：写一个 Student 类
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score
    def level(self):
        return "及格" if self.score >= 60 else "不及格"
s = Student("小明", 55)
print(s.name, s.level())   # 小明 不及格`,
    variants: [
      { name: '举一反三 1', note: '再加一个 avg(other) 方法，返回两个学生平均分。' },
      { name: '举一反三 2', note: '建一个 venv 并 pip install requests，把这一步命令写进 README。' },
    ],
  },
  'python-2': {
    answer: `# 参考答案：用 requests 拿一个公开接口
import requests
r = requests.get("https://api.github.com/zen", timeout=10)
print(r.status_code, r.text)`,
    variants: [
      { name: '举一反三 1', note: '换成 repos/OWNER/REPO 接口，打印 stargazers_count。' },
      { name: '举一反三 2', note: '把 url 放进环境变量 GITHUB_URL，用 os.getenv 读，而不是写死。' },
    ],
  },
  'python-3': {
    answer: `# 参考答案：故意制造一个 KeyError 并修好
data = {"username": "tom"}
try:
    print(data["user_name"])
except KeyError as e:
    print("键名错了，真实键：", list(data.keys()))`,
    variants: [
      { name: '举一反三 1', note: '把 KeyError 换成 ValueError，用 int("abc") 触发并接住。' },
      { name: '举一反三 2', note: '练习“改一处跑一次”：故意写错一个字段名，复制报错去搜索修复。' },
    ],
  },
  'java-0': {
    answer: `// 参考答案：Cart.java
public class Cart {
    public static void main(String[] args) {
        java.util.Map<String,Integer> p = new java.util.HashMap<>();
        p.put("书", 30); p.put("笔", 5);
        System.out.println(p.get("书") + p.get("笔")); // 35
    }
}`,
    variants: [
      { name: '举一反三 1', note: '把 Map 换成 List<String>，add 三个商品再 for 打印。' },
      { name: '举一反三 2', note: '用 try-catch 包住 10/0，打印“除零了”。' },
    ],
  },
  'java-1': {
    answer: `// 参考答案：面向接口
interface Discount { double apply(double p); }
class PercentOff implements Discount {
    public double apply(double p){ return p * 0.8; }
}
public class Main {
    public static void main(String[] a){
        Discount d = new PercentOff();
        System.out.println(d.apply(100)); // 80.0
    }
}`,
    variants: [
      { name: '举一反三 1', note: '再写一个 FullReduction(满100减20) 实现 Discount，切换它。' },
      { name: '举一反三 2', note: '写一段 main 证明：左边类型是 Discount，右边换实现，调用代码不变。' },
    ],
  },
  'java-2': {
    answer: `// 参考答案：线程池跑 10 个任务
import java.util.concurrent.*;
public class P {
  public static void main(String[] a){
    ExecutorService pool = Executors.newFixedThreadPool(4);
    for (int i=0;i<10;i++) pool.submit(() -> System.out.println("run"));
    pool.shutdown();
  }
}`,
    variants: [
      { name: '举一反三 1', note: '把池大小改成 2，观察输出节奏变化。' },
      { name: '举一反三 2', note: '在循环里 new String("x") 一百万次，体会为什么别在热路径疯狂 new。' },
    ],
  },
  'java-3': {
    answer: `// 参考答案：最小 Spring Boot 接口
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() { return "hi"; }
}
// 启动后 curl http://localhost:8080/hello 应返回 hi`,
    variants: [
      { name: '举一反三 1', note: '再加一个 GET /sum?a=1&b=2 返回 a+b。' },
      { name: '举一反三 2', note: '把返回包成统一体 {code:0,data:...}。' },
    ],
  },
  'cpp-0': {
    answer: `// 参考答案：编译运行指针
int main(){
  int a = 10;
  int* p = &a;
  *p = 20;
  printf("%d", a); // 20
}
// g++ t.cpp -o t && ./t`,
    variants: [
      { name: '举一反三 1', note: '用 new int[3] 开数组，赋值后 delete[]。' },
      { name: '举一反三 2', note: '故意把 delete[] 写成 delete，用 ASan 编译看报错。' },
    ],
  },
  'cpp-1': {
    answer: `// 参考答案：vector + sort
#include <bits/stdc++.h>
int main(){
  vector<int> v={3,1,4,1,5};
  sort(v.begin(),v.end());
  for(int x:v) cout<<x<<" "; // 1 1 3 4 5
}`,
    variants: [
      { name: '举一反三 1', note: '加 greater<int>() 变降序。' },
      { name: '举一反三 2', note: '用 set 对这组数去重后输出。' },
    ],
  },
  'cpp-2': {
    answer: `# 参考答案：用 ASan 找越界
g++ main.cpp -o main -std=c++17 -g -fsanitize=address
./main   # 越界行会被精确指出`,
    variants: [
      { name: '举一反三 1', note: '把越界改成 a[10] 写后用 ASan 定位行号。' },
      { name: '举一反三 2', note: '用 -O2 重新编译交题版本。' },
    ],
  },
  'cpp-3': {
    answer: `// 参考答案：优先队列取最大
#include <bits/stdc++.h>
int main(){
  priority_queue<int> pq;
  for(int x:{3,1,5}) pq.push(x);
  cout<<pq.top(); // 5
}`,
    variants: [
      { name: '举一反三 1', note: '用 greater<int> 改成每次取最小。' },
      { name: '举一反三 2', note: '用 queue 做一次 1 2 3 的先进先出打印。' },
    ],
  },
  'go-0': {
    answer: `package main
import "fmt"
func main(){
  ch := make(chan string, 2)
  go func(){ ch <- "a" }()
  go func(){ ch <- "b" }()
  fmt.Println(<-ch, <-ch) // a b
}`,
    variants: [
      { name: '举一反三 1', note: '起 3 个 goroutine，channel 收 3 个结果。' },
      { name: '举一反三 2', note: '把缓冲去掉，观察为何会死锁。' },
    ],
  },
  'go-1': {
    answer: `package main
import ("fmt";"net/http")
func hi(w http.ResponseWriter, r *http.Request){
  fmt.Fprintf(w, "你好 %s", r.URL.Query().Get("name"))
}
func main(){ http.HandleFunc("/hi", hi); http.ListenAndServe(":8080", nil) }`,
    variants: [
      { name: '举一反三 1', note: '加一个 GET /sum?a=1&b=2 返回和。' },
      { name: '举一反三 2', note: '用 curl 测一下两个接口。' },
    ],
  },
  'go-2': {
    answer: `// math.go
package calc
func Add(a,b int)int{return a+b}
// math_test.go
func TestAdd(t *testing.T){
  if Add(2,3)!=5 { t.Error("2+3=5") }
}
// 运行: go test ./...`,
    variants: [
      { name: '举一反三 1', note: '加一个边界用例 Add(0,0)==0。' },
      { name: '举一反三 2', note: '把断言改错跑一次，看失败信息。' },
    ],
  },
  'go-3': {
    answer: `func Logger(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
    log.Println(r.URL.Path); next.ServeHTTP(w, r)
  })
}
// 用 r.Use(Logger) 挂载`,
    variants: [
      { name: '举一反三 1', note: '写一个限流器：qps>100 直接 429。' },
      { name: '举一反三 2', note: '写一个鉴权中间件，没有 token 返回 401。' },
    ],
  },
  'algo-0': {
    answer: `# 参考答案：判断复杂度
# 一层循环 O(n)，两层嵌套 O(n²)，二分 O(log n)
def has_duplicate(arr):
    seen = set()
    for x in arr:      # O(n)
        if x in seen: return True
        seen.add(x)
    return False
# 整体 O(n)，比双重循环 O(n²) 快`,
    variants: [
      { name: '举一反三 1', note: '把上面用双重循环写一遍，对比运行次数。' },
      { name: '举一反三 2', note: '分析“对 n 个数冒泡排序”是几阶复杂度。' },
    ],
  },
  'algo-1': {
    answer: `# 参考答案：两数之和
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target-x], i]
        seen[x] = i
print(two_sum([2,7,11,15], 9))  # [0,1]`,
    variants: [
      { name: '举一反三 1', note: '改成统计数组中每个数出现几次（用 dict）。' },
      { name: '举一反三 2', note: '用滑动窗口求最长无重复子串长度。' },
    ],
  },
  'algo-2': {
    answer: `# 参考答案：二叉树层序 BFS
from collections import deque
def level_order(root):
    q = deque([root]); res = []
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft(); level.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        res.append(level)
    return res`,
    variants: [
      { name: '举一反三 1', note: '改成 DFS 先序遍历（递归）。' },
      { name: '举一反三 2', note: '用 BFS 求无权图从起点到终点的最短步数。' },
    ],
  },
  'algo-3': {
    answer: `# 参考答案：爬楼梯 DP
def climb(n):
    if n <= 2: return n
    dp = [0]*(n+1)
    dp[1]=1; dp[2]=2
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
print(climb(5))  # 8`,
    variants: [
      { name: '举一反三 1', note: '改成打家劫舍：相邻不能拿，求最大。' },
      { name: '举一反三 2', note: '把空间优化成两个变量，不用整个 dp 数组。' },
    ],
  },
  'sql-0': {
    answer: `-- 参考答案
SELECT city, COUNT(*) AS cnt
FROM users
WHERE created_at >= '2026-01-01'
GROUP BY city
HAVING cnt > 5
ORDER BY cnt DESC;`,
    variants: [
      { name: '举一反三 1', note: '只查 score<60 的人，按 score 升序。' },
      { name: '举一反三 2', note: '把 COUNT(*) 改成 AVG(age) 看每城平均年龄。' },
    ],
  },
  'sql-1': {
    answer: `-- 参考答案：左连接保留所有用户
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;`,
    variants: [
      { name: '举一反三 1', note: '只查有订单的用户，改成 INNER JOIN。' },
      { name: '举一反三 2', note: '给 orders(user_id) 建索引并用 EXPLAIN 验证。' },
    ],
  },
  'sql-2': {
    answer: `-- 参考答案：转账事务
BEGIN;
UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
    variants: [
      { name: '举一反三 1', note: '把 COMMIT 改成 ROLLBACK，观察钱是否回去。' },
      { name: '举一反三 2', note: '在 UPDATE 后加一句 WHERE balance >= 100，防止透支。' },
    ],
  },
  'sql-3': {
    answer: `-- 参考答案：联合索引最左前缀
CREATE INDEX idx_user_time ON orders(user_id, created_at);
-- 命中: WHERE user_id=? AND created_at>?
-- 不命中: WHERE created_at>?`,
    variants: [
      { name: '举一反三 1', note: '用 EXPLAIN 看两条查询分别走没走索引。' },
      { name: '举一反三 2', note: '如果高频查询是按 status，联合索引该怎么设计？' },
    ],
  },
  'redis-0': {
    answer: `# 参考答案：用 ZSet 做排行榜
ZADD rank 95 "alice" 88 "bob" 100 "zoe"
ZREVRANGE rank 0 2 WITHSCORES
# 输出: zoe 100 / alice 95 / bob 88`,
    variants: [
      { name: '举一反三 1', note: '用 HSET 存一个商品的 name/price/stock。' },
      { name: '举一反三 2', note: '用 SET 做当天已签到用户去重。' },
    ],
  },
  'redis-1': {
    answer: `# 参考答案：缓存雪崩缓解（过期加随机）
EXPIRE product:1 3600 + random(0, 300)
# 让同一批 key 的过期时间错开 5 分钟`,
    variants: [
      { name: '举一反三 1', note: '说出穿透/击穿/雪崩分别用什么手段。' },
      { name: '举一反三 2', note: '热点 key 过期瞬间如何用互斥锁只放一个请求回源。' },
    ],
  },
  'redis-2': {
    answer: `# 参考答案：概念题
# RDB=定时快照，AOF=写命令日志
# 主从复制 + 哨兵 = 高可用（主挂自动提升从）
# 生产用混合持久化`,
    variants: [
      { name: '举一反三 1', note: '为什么 Redis 不能当唯一数据源？' },
      { name: '举一反三 2', note: '读多写少时为什么把读打到从节点？' },
    ],
  },
  'redis-3': {
    answer: `# 参考答案：更新商品缓存的正确顺序
1. UPDATE products SET price=99 WHERE id=1
2. DEL cache:product:1
# 下次读自动回源重建`,
    variants: [
      { name: '举一反三 1', note: '为什么“先删缓存再更 DB”会导致脏数据？' },
      { name: '举一反三 2', note: '缓存和 DB 短暂不一致怎么靠过期时间兜底？' },
    ],
  },
  'vector-0': {
    answer: `# 参考答案：理解语义相似度
# "苹果手机" 与 "华为手机" 向量夹角小 → 余弦相似度高
# 与 "今天天气" 夹角大 → 相似度低
# 这就是为什么关键词搜不到"苹果 iPhone"`,
    variants: [
      { name: '举一反三 1', note: '举一个用 LIKE 搜不到但向量能搜到的例子。' },
      { name: '举一反三 2', note: '余弦相似度取值范围是多少？1 和 0 各代表什么？' },
    ],
  },
  'vector-1': {
    answer: `# 参考答案：ANN 为什么快
# 精确检索：100万条全算一遍，O(n)
# ANN(HNSW)：建图只跳相邻节点，O(log n)
# 牺牲约 5% 召回换 100 倍速度`,
    variants: [
      { name: '举一反三 1', note: '为什么生产不用暴力全量计算？' },
      { name: '举一反三 2', note: '准确率略降在业务上为什么可接受？' },
    ],
  },
  'vector-2': {
    answer: `# 参考答案：文档切块
for doc in docs:
    chunks = cut(doc, size=500, overlap=50)
    for c in chunks:
        insert(embed(c), c, source=doc.title)
# 重叠 50 字防止句子被腰斩`,
    variants: [
      { name: '举一反三 1', note: '块切太大和太小分别有什么问题？' },
      { name: '举一反三 2', note: '为什么块之间要留 overlap？' },
    ],
  },
  'linux-0': {
    answer: `# 参考答案
pwd          # 我在哪
cd ../..     # 上两层
ls -la       # 看全部文件
ps aux | grep python   # 找 python 进程`,
    variants: [
      { name: '举一反三 1', note: '用 tail -100 app.log > out.txt 把日志尾部落地。' },
      { name: '举一反三 2', note: '用 | 把 ls 的结果交给 wc -l 数文件数。' },
    ],
  },
  'linux-1': {
    answer: `#!/bin/bash
# backup.sh
count=$(ls *.log | wc -l)
echo "备份 $count 个日志"
tar czf /tmp/logs.tar.gz *.log`,
    variants: [
      { name: '举一反三 1', note: '加一行：只有 count>0 才打包。' },
      { name: '举一反三 2', note: '用 crontab -e 配成每天凌晨 2 点跑。' },
    ],
  },
  'linux-2': {
    answer: `# 参考答案：后台常驻 + 跟日志
nohup python main.py > app.log 2>&1 &
systemctl status nginx
journalctl -u nginx -f`,
    variants: [
      { name: '举一反三 1', note: '程序挂了第一步该看什么？' },
      { name: '举一反三 2', note: 'nohup ... & 里的 & 和 nohup 各起什么作用？' },
    ],
  },
  'git-0': {
    answer: `# 参考答案
git status
git add .
git commit -m "feat: 完成登录页"
git log --oneline`,
    variants: [
      { name: '举一反三 1', note: '只把 login.py 存成一次提交。' },
      { name: '举一反三 2', note: '用 git diff 看改了什么再提交。' },
    ],
  },
  'git-1': {
    answer: `# 参考答案
git switch -c feature/login
# 改完 commit 几次
git switch main
git merge feature/login
# 冲突就编辑 <<<<<<< 标记，解决后 git add`,
    variants: [
      { name: '举一反三 1', note: '搞砸了怎么删掉分支而不影响 main？' },
      { name: '举一反三 2', note: '合并冲突时 <<<<<<< ======= >>>>>>> 三行分别是什么？' },
    ],
  },
  'git-2': {
    answer: `# 参考答案：把练习 push 到公开 GitHub
git push origin feature/login
# 在 GitHub 网页发 Pull Request → 选 review 人 → Merge`,
    variants: [
      { name: '举一反三 1', note: '为什么要把代码放到公开 GitHub？' },
      { name: '举一反三 2', note: '直推 main 为什么会被企业仓库拦截？' },
    ],
  },
  'spring-0': {
    answer: `// 参考答案：构造器注入
@Service
public class OrderService {
    private final PayService payService;
    public OrderService(PayService p) { this.payService = p; }
}`,
    variants: [
      { name: '举一反三 1', note: '为什么字段注入不如构造器注入好测试？' },
      { name: '举一反三 2', note: '换成另一个 PayService 实现，业务代码要改几处？' },
    ],
  },
  'spring-1': {
    answer: `@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
    public Result create(@Valid @RequestBody OrderDTO dto){
        return Result.ok(new Order());
    }
}`,
    variants: [
      { name: '举一反三 1', note: '加一个 GET /api/orders/{id} 详情接口。' },
      { name: '举一反三 2', note: '为什么要包统一 Result 而不是直接返回实体？' },
    ],
  },
  'spring-2': {
    answer: `@Transactional
public void pay(Long orderId) {
    orderMapper.updateStatus(orderId, "PAID");
    payMapper.record(orderId);
    // 抛异常则上面也回滚
}`,
    variants: [
      { name: '举一反三 1', note: '同类自调用 this.pay() 为什么会让事务失效？' },
      { name: '举一反三 2', note: '检查异常默认回滚吗？怎么配置？' },
    ],
  },
  'spring-3': {
    answer: `# 参考答案：画关系图
用户 → 网关(鉴权/限流) → 订单服务 / 支付服务
                ↑ 都在注册中心登记`,
    variants: [
      { name: '举一反三 1', note: '订单服务怎么知道支付服务在哪台机器？' },
      { name: '举一反三 2', note: '网关做哪三件事？' },
    ],
  },
  'fastapi-0': {
    answer: `# 参考答案：列方法-路径表
GET    /orders     列表
POST   /orders     创建
GET    /orders/1   详情
PUT    /orders/1   修改
DELETE /orders/1   删除`,
    variants: [
      { name: '举一反三 1', note: '401 和 403 有什么区别？' },
      { name: '举一反三 2', note: '200/400/404/500 各代表什么？' },
    ],
  },
  'fastapi-1': {
    answer: `from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
class Item(BaseModel):
    name: str
    price: float
@app.post("/items")
def create(item: Item):
    return {"id": 1, **item.model_dump()}`,
    variants: [
      { name: '举一反三 1', note: '访问 /docs 看自动生成的接口文档。' },
      { name: '举一反三 2', note: '传 price="abc" 看 Pydantic 返回的 422。' },
    ],
  },
  'fastapi-2': {
    answer: `app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_credentials=True,
)`,
    variants: [
      { name: '举一反三 1', note: '为什么 allow_origins=["*"] 不能直接上线？' },
      { name: '举一反三 2', note: '谁拦了跨域请求——浏览器还是后端？' },
    ],
  },
  'fastapi-3': {
    answer: `class AskReq(BaseModel):
    question: str
@app.post("/ask")
def ask(req: AskReq):
    chunks = search(req.question)
    ans = llm(chunks, req.question)
    return {"answer": ans, "refs": chunks}`,
    variants: [
      { name: '举一反三 1', note: '为什么要把 refs 一起返回？' },
      { name: '举一反三 2', note: '资料里没有答案时应该让模型怎么说？' },
    ],
  },
  'docker-0': {
    answer: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]`,
    variants: [
      { name: '举一反三 1', note: '为什么 COPY requirements.txt 要放在 COPY . . 前面？' },
      { name: '举一反三 2', note: 'docker build 和 docker run 各做什么？' },
    ],
  },
  'docker-1': {
    answer: `services:
  web:
    build: .
    ports: ["8000:8000"]
    depends_on: [db]
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: "123456"`,
    variants: [
      { name: '举一反三 1', note: 'docker compose up -d 和 down 各做什么？' },
      { name: '举一反三 2', note: '为什么 MySQL 必须挂 volume，否则会怎样？' },
    ],
  },
  'docker-2': {
    answer: `# 参考答案：三件套关系
Deployment → 管 3 个 Pod 副本（挂了自动补）
Service    → 固定入口，请求轮询到这 3 个 Pod`,
    variants: [
      { name: '举一反三 1', note: 'Pod 的 IP 会变，Service 怎么保证访问不变？' },
      { name: '举一反三 2', note: '把副本数从 3 改成 10 意味着什么？' },
    ],
  },
  'dist-0': {
    answer: `# 参考答案：并发安全
synchronized(lock) { count++; }
# 不加锁时 count++ 是“读-改-写”三步，多线程互相覆盖`,
    variants: [
      { name: '举一反三 1', note: '为什么 count++ 不是原子操作？' },
      { name: '举一反三 2', note: '超卖问题的根源是什么？' },
    ],
  },
  'dist-1': {
    answer: `# 参考答案：消息队列链路
用户下单 → 订单服务 → 发 MQ → 立即返回
MQ → 库存服务 / 短信服务 慢慢消费`,
    variants: [
      { name: '举一反三 1', note: 'MQ 怎么起到削峰作用？' },
      { name: '举一反三 2', note: '为什么消费端必须做幂等？' },
    ],
  },
  'dist-2': {
    answer: `# 参考答案：CAP
# 网络分区(P)必发生，所以在 CP / AP 间选
# 多数互联网业务选 AP + 最终一致`,
    variants: [
      { name: '举一反三 1', note: '银行转账为什么要强一致？' },
      { name: '举一反三 2', note: '电商下单短暂库存不一致为什么能接受？' },
    ],
  },
  'dist-3': {
    answer: `# 参考答案：秒杀链路
1. 网关限流
2. Redis 预减库存（lua 原子）
3. 发 MQ → DB 异步落库`,
    variants: [
      { name: '举一反三 1', note: '为什么不能直接打 DB 扣库存？' },
      { name: '举一反三 2', note: 'Redis 预减为什么要用 lua 保证原子？' },
    ],
  },
  'ds-0': {
    answer: `import numpy as np
a = np.array([1,2,3,4])
print(a * 2)        # [2 4 6 8]
print(a[a > 2])     # [3 4]`,
    variants: [
      { name: '举一反三 1', note: '用向量化把 (a-mean)/std 一次算完。' },
      { name: '举一反三 2', note: '为什么不用 Python for 逐元素算？' },
    ],
  },
  'ds-1': {
    answer: `df.groupby("dt")["uid"].nunique()   # 每日 UV
df.groupby("city")["amount"].sum()  # 每城总额`,
    variants: [
      { name: '举一反三 1', note: 'PV 和 UV 分别用什么聚合函数？' },
      { name: '举一反三 2', note: '缺失值在 groupby 前应该先怎么处理？' },
    ],
  },
  'ds-2': {
    answer: `# 参考答案：标题即结论
# 趋势→折线 / 对比→柱状 / 占比→饼或堆叠条 / 分布→直方图
# 标题写“9月UV环比涨18%”`,
    variants: [
      { name: '举一反三 1', note: '为什么坐标轴要从 0 开始？' },
      { name: '举一反三 2', note: '双轴图为什么容易误导？' },
    ],
  },
  'ds-3': {
    answer: `# 参考答案：报告四段
1. 结论：9月UV涨18%
2. 数据：渠道A贡献主要增量
3. 归因：上线了XX活动
4. 建议：渠道A预算+20%，预计再涨10%`,
    variants: [
      { name: '举一反三 1', note: '为什么“继续优化体验”不是好建议？' },
      { name: '举一反三 2', note: '为什么报告第一句必须是结论？' },
    ],
  },
  'ml-0': {
    answer: `# 参考答案：特征预处理
城市 → OneHot: [1,0] / [0,1]
年龄 → 标准化: (x-mean)/std
缺失值 → 用均值或 0 填充`,
    variants: [
      { name: '举一反三 1', note: '不做标准化为什么收入会压过年龄？' },
      { name: '举一反三 2', note: '类别基数很大（如城市几百个）OneHot 有什么问题？' },
    ],
  },
  'ml-1': {
    answer: `from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier()
model.fit(X_train, y_train)
print(model.predict(X_test))`,
    variants: [
      { name: '举一反三 1', note: '为什么表格数据优先 GBDT 而非深度学习？' },
      { name: '举一反三 2', note: '逻辑回归先跑出来是干什么用的？' },
    ],
  },
  'ml-2': {
    answer: `from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring="roc_auc")
print(scores.mean())`,
    variants: [
      { name: '举一反三 1', note: '为什么不平衡数据看准确率会被骗？' },
      { name: '举一反三 2', note: '为什么要做 5 折交叉而不是只跑一次？' },
    ],
  },
  'ml-3': {
    answer: `# 参考答案：建模五步
1. 读数据看分布
2. 清洗 + 编码
3. train_test_split
4. fit + predict
5. 出指标报告`,
    variants: [
      { name: '举一反三 1', note: '为什么先跑 baseline 再调参？' },
      { name: '举一反三 2', note: '数据没洗干净就调参会怎样？' },
    ],
  },
  'dl-0': {
    answer: `loader = DataLoader(ds, batch_size=32, shuffle=True)
for x, y in loader:
    # 训练一步`,
    variants: [
      { name: '举一反三 1', note: 'batch_size 大会怎样、小会怎样？' },
      { name: '举一反三 2', note: '为什么训练时要 shuffle？' },
    ],
  },
  'dl-1': {
    answer: `opt.zero_grad()
loss = loss_fn(model(x), y)
loss.backward()
opt.step()`,
    variants: [
      { name: '举一反三 1', note: '忘了 zero_grad() 会怎样？' },
      { name: '举一反三 2', note: 'loss 不下降可能是什么原因？' },
    ],
  },
  'dl-2': {
    answer: `torch.save(model.state_dict(), "m.pt")
model.load_state_dict(torch.load("m.pt"))
model.eval()
with torch.no_grad():
    pred = model(x)`,
    variants: [
      { name: '举一反三 1', note: 'eval() 和 no_grad() 各做什么？' },
      { name: '举一反三 2', note: '为什么存 state_dict 而不是整个 model？' },
    ],
  },
  'dl-3': {
    answer: `from transformers import AutoTokenizer, AutoModel
tok = AutoTokenizer.from_pretrained("模型名")
mdl = AutoModel.from_pretrained("模型名")`,
    variants: [
      { name: '举一反三 1', note: '为什么不建议从零训练大模型？' },
      { name: '举一反三 2', note: '预训练 + 微调解决了什么？' },
    ],
  },
  'llm-0': {
    answer: `# 参考答案：写一个结构化 Prompt
你是客服助手，只答订单问题。
输出严格 JSON：{"answer":"...","need_human":bool}
用户问题：{input}`,
    variants: [
      { name: '举一反三 1', note: '为什么要给 JSON schema 而不是自由文本？' },
      { name: '举一反三 2', note: '改 Prompt 后为什么要固定测试用例回归？' },
    ],
  },
  'llm-1': {
    answer: `chunks = 文档按 500 字 + 50 字重叠切
for c in chunks:
    db.insert(embed(c), c, source=标题)`,
    variants: [
      { name: '举一反三 1', note: '块太大和太小各有什么问题？' },
      { name: '举一反三 2', note: '重叠 50 字是为了解决什么？' },
    ],
  },
  'llm-2': {
    answer: `chunks = vdb.search(question, top_k=3)
prompt = f"根据资料回答：{chunks}\\n问题：{question}"
answer = llm(prompt)`,
    variants: [
      { name: '举一反三 1', note: '为什么 RAG 能减少幻觉？' },
      { name: '举一反三 2', note: 'top_k 设大了/小了各会怎样？' },
    ],
  },
  'llm-3': {
    answer: `tools = [{"name":"get_order","params":{"id":"string"}}]
# 模型决定调 get_order，程序执行后把结果再喂回`,
    variants: [
      { name: '举一反三 1', note: '模型自己能连数据库吗？谁执行工具？' },
      { name: '举一反三 2', note: 'Function Calling 为什么就是 Agent 的核心？' },
    ],
  },
  'deploy-0': {
    answer: `app = FastAPI()
model = load_model()   # 启动时一次
@app.post("/predict")
def predict(x): return model(x)`,
    variants: [
      { name: '举一反三 1', note: '为什么不能在路由函数里 load_model？' },
      { name: '举一反三 2', note: '模型常驻内存有什么好处？' },
    ],
  },
  'deploy-1': {
    answer: `# 参考答案：概念
# vLLM = 连续批处理，吞吐翻几倍
# 量化 INT8/INT4 = 权重变小，显存减半，精度略损`,
    variants: [
      { name: '举一反三 1', note: 'vLLM 为什么快？是模型变小了吗？' },
      { name: '举一反三 2', note: '量化牺牲了什么、换来了什么？' },
    ],
  },
  'deploy-2': {
    answer: `# 参考答案：监控三件
P95 延迟（看最慢的 5%）
QPS（每秒请求数）
效果定期回归评测`,
    variants: [
      { name: '举一反三 1', note: '为什么平均延迟会骗你？' },
      { name: '举一反三 2', note: '什么是数据漂移，为什么要定期回归？' },
    ],
  },
  'web-0': {
    answer: `<div class="layout" style="display:grid;grid-template-columns:200px 1fr">
  <aside>侧边栏</aside>
  <main>主内容</main>
</div>`,
    variants: [
      { name: '举一反三 1', note: '1fr 是什么意思？' },
      { name: '举一反三 2', note: '块级 div 和行内 span 有什么区别？' },
    ],
  },
  'web-1': {
    answer: `.card-list{grid-template-columns:1fr}
@media (min-width:768px){
  .card-list{grid-template-columns:1fr 1fr}
}`,
    variants: [
      { name: '举一反三 1', note: '断点 768px 是什么意思？' },
      { name: '举一反三 2', note: '为什么不用做两个网站？' },
    ],
  },
  'web-2': {
    answer: `button.onclick = async () => {
  const r = await fetch("/api/data");
  const d = await r.json();
  console.log(d);
};`,
    variants: [
      { name: '举一反三 1', note: '忘了 await 会拿到什么？' },
      { name: '举一反三 2', note: 'fetch 失败为什么要 try/catch？' },
    ],
  },
  'vue-0': {
    answer: `const count = ref(0)
<button @click="count++">{{ count }}</button>
<!-- 改: count.value = 10 -->`,
    variants: [
      { name: '举一反三 1', note: 'JS 里为什么要写 count.value？' },
      { name: '举一反三 2', note: 'v-for 为什么要写 :key？' },
    ],
  },
  'vue-1': {
    answer: `// 子
const props = defineProps({ title: String })
const emit = defineEmits(['done'])
// 父
<Child :title="t" @done="onDone" />`,
    variants: [
      { name: '举一反三 1', note: '子组件能直接改 props 吗？为什么？' },
      { name: '举一反三 2', note: '父子通信数据流是单向还是双向？' },
    ],
  },
  'vue-2': {
    answer: `export const useUser = defineStore('user', () => ({ name: '' }))
// 任意组件:
const user = useUser(); user.name = '张三'`,
    variants: [
      { name: '举一反三 1', note: '什么是 prop drilling，怎么用 Pinia 解决？' },
      { name: '举一反三 2', note: 'Pinia 适合存什么样的状态？' },
    ],
  },
  'react-0': {
    answer: `function Card({ title, children }) {
  return <div className="card"><h3>{title}</h3>{children}</div>
}`,
    variants: [
      { name: '举一反三 1', note: 'JSX 里为什么写 className 而不是 class？' },
      { name: '举一反三 2', note: 'props 是只读还是可改？' },
    ],
  },
  'react-1': {
    answer: `const [count, setCount] = useState(0);
useEffect(() => {
  const t = setInterval(() => setCount(c => c+1), 1000);
  return () => clearInterval(t);
}, []);`,
    variants: [
      { name: '举一反三 1', note: '为什么不能直接 count++？' },
      { name: '举一反三 2', note: 'useEffect 里的 return 函数干什么用？' },
    ],
  },
  'react-2': {
    answer: `# 参考答案：路由表
/skills   → <SkillsPage/>
/projects → <ProjectsPage/>
# 侧边栏切换 = 换路由，URL 跟着变`,
    variants: [
      { name: '举一反三 1', note: '什么是 SPA 单页应用？' },
      { name: '举一反三 2', note: '小项目和大项目的全局状态分别用什么？' },
    ],
  },
  'review-0': {
    answer: `# 参考答案：重构命名
# 差: uc, d()
# 好: userCount, calcDiscount()
# 注释写“为什么”，不写“做了什么”`,
    variants: [
      { name: '举一反三 1', note: '为什么变量名要见名知意？' },
      { name: '举一反三 2', note: '函数超过多少行该考虑拆分？' },
    ],
  },
  'review-1': {
    answer: `test("正常: 100打8折=80", ...)
test("边界: 0元=0", ...)
test("异常: 负价报错", ...)`,
    variants: [
      { name: '举一反三 1', note: '为什么边界用例最容易出 bug？' },
      { name: '举一反三 2', note: '覆盖率 100% 就等于没 bug 吗？' },
    ],
  },
  'review-2': {
    answer: `# 参考答案：提意见话术
“这块很好地解决了 X”
“这里如果 Y 很大会不会有问题？要不改成 Z？”`,
    variants: [
      { name: '举一反三 1', note: '为什么不能只说“有问题”？' },
      { name: '举一反三 2', note: 'Code Review 对事还是对人？' },
    ],
  },
  'docs-0': {
    answer: `作为 用户
我想 创建订单
以便 买到东西
AC: 1.选商品下单 2.订单生成 3.看到状态`,
    variants: [
      { name: '举一反三 1', note: '为什么“界面美观”不能当验收标准？' },
      { name: '举一反三 2', note: '用户故事三段怎么写？' },
    ],
  },
  'docs-1': {
    answer: `# 技术方案四段
1. 背景  2. 方案(含图)  3. 影响面  4. 风险&回滚`,
    variants: [
      { name: '举一反三 1', note: '为什么必须写回滚方案？' },
      { name: '举一反三 2', note: '直接开写代码前漏掉哪一步最危险？' },
    ],
  },
  'docs-2': {
    answer: `结果: 上线晚2天
归因: 第三方接口延期，没留缓冲
改进: 下次排期预留2天缓冲（我负责）`,
    variants: [
      { name: '举一反三 1', note: '为什么“大家辛苦了”不是好复盘？' },
      { name: '举一反三 2', note: '改进项为什么必须有人和时间？' },
    ],
  },
  'agile-0': {
    answer: `# 站会三问
1. 昨天完成了什么
2. 今天计划做什么
3. 有什么阻碍`,
    variants: [
      { name: '举一反三 1', note: '站会为什么不能开成汇报大会？' },
      { name: '举一反三 2', note: '看板 To Do/Doing/Done 怎么用？' },
    ],
  },
  'agile-1': {
    answer: `# 大: “学会数据分析”
# 小: “用pandas读CSV并groupby统计UV，3天完成”`,
    variants: [
      { name: '举一反三 1', note: '怎么判断一个任务够不够小？' },
      { name: '举一反三 2', note: '“完成模块开发”为什么不是好任务？' },
    ],
  },
  'agile-2': {
    answer: `结论: X已完成
数据: 进度60%
下一步: 明天做Y
风险: 卡在Z，试了A/B，想找人讨论`,
    variants: [
      { name: '举一反三 1', note: '为什么汇报第一句要给结论？' },
      { name: '举一反三 2', note: '卡住时硬扛三天和早暴露，哪个更专业？' },
    ],
  },
};
