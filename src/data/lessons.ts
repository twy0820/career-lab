// EXPORTS: LESSONS, LESSON_BY_ID, BEGINNER_TRACK（新手主线推荐顺序）
// 每门技能的每一步都对应一节课：学完讲解 → 做动手练习 → 自检 → 标记完成。
import type { ILesson } from './types';

export const LESSONS: ILesson[] = [
  // ==================== Python ====================
  {
    id: 'python-0',
    goal: '能独立写出「读取文件 → 处理数据 → 输出结果」的小脚本，理解变量、函数与流程控制。',
    minutes: 180,
    teach: [
      { type: 'p', text: 'Python 是一门“读起来像英语”的语言。先记三件事：① 缩进就是代码块（不要混用 Tab 和空格）；② 一切皆对象，变量只是名字；③ 先写能跑的，再写优雅的。' },
      { type: 'code', text: `# 1) 变量与流程控制
price = 99.5
if price > 100:
    print("贵了")
elif price > 50:
    print("还行")
else:
    print("划算")

# 2) 函数与数据结构
def total(items, discount=0.9):
    s = sum(x["price"] for x in items)
    return round(s * discount, 2)

cart = [{"name": "书", "price": 30}, {"name": "笔", "price": 5}]
print(total(cart))` },
      { type: 'p', text: '常用内置类型要熟：list（可变序列）、dict（键值对）、tuple（不可变）、set（去重）。文件读取用 with open(...) as f 自动关文件；读 JSON 用 import json；出错用 try/except 兜住，不要裸 except。' },
      { type: 'note', text: '新手最常踩的坑：== 与 = 混淆、缩进不一致、可变默认参数（def f(x=[])）。遇到报错先看最后一行，再往上找你自己写的文件和行号。' },
    ],
    practice: '写一个 score.py：输入若干名同学的姓名和分数（可以先写死在列表里），输出平均分、最高分是谁、不及格（<60）名单，结果保存到 result.txt。',
    checklist: ['能说清 list 和 dict 各自适合存什么', '函数默认参数怎么写', 'with open 为什么能自动关文件'],
  },
  {
    id: 'python-1',
    goal: '会用类组织代码，并用虚拟环境 + requirements 管理项目依赖。',
    minutes: 150,
    teach: [
      { type: 'p', text: '类是把“数据 + 操作数据的方法”打包在一起的模具。新手阶段先会三种：__init__ 初始化、self 指代自己、继承复用。不要一上来就设计复杂继承体系。' },
      { type: 'code', text: `class Order:
    def __init__(self, order_id, amount):
        self.order_id = order_id
        self.amount = amount
    def discount(self, rate):
        return round(self.amount * rate, 2)

o = Order("A1", 200)
print(o.discount(0.8))  # 160.0` },
      { type: 'p', text: '工程化三件套：① 每个项目一个虚拟环境（python -m venv .venv，Windows 下 .venv\\Scripts\\activate）；② 依赖写进 requirements.txt（pip freeze > requirements.txt）；③ 函数和公共类拆到模块里，主入口写 if __name__ == "__main__":。' },
      { type: 'note', text: '类型注解（def add(a: int, b: int) -> int:）不是必须，但团队代码里几乎都有——它让读代码的人一眼知道参数类型，面试也常被问。' },
    ],
    practice: '把上一课的 score.py 重构成类：class Report，方法 add(name, score)、average()、fail_list()，并建一个虚拟环境装一个 requests 包。',
    checklist: ['self 在方法里指什么', '虚拟环境解决什么问题', 'requirements.txt 怎么生成'],
  },
  {
    id: 'python-2',
    goal: '会用 requests 调一个公开接口，并用 json 解析返回数据。',
    minutes: 120,
    teach: [
      { type: 'p', text: '真实工作里一半的 Python 活是“从一个地方拿数据，处理完交给另一个地方”。requests.get(url) 发 HTTP 请求，r.json() 直接把返回体变成 Python 字典/列表。' },
      { type: 'code', text: `import requests
r = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
data = r.json()
print(data["stargazers_count"])

# 带参数和请求头
r = requests.get(url, params={"q": "react"}, headers={"User-Agent": "my-lab"})` },
      { type: 'p', text: '三个必须注意：① 永远带 timeout，不然接口挂了你的程序就卡死；② 网络请求可能失败，用 try/except requests.RequestException 包起来；③ 分页接口要循环累加，注意 rate limit。' },
      { type: 'note', text: '在公司内网调用接口常常需要 Token（放在请求头 Authorization: Bearer xxx），Token 不要硬编码进代码，放环境变量 os.getenv("TOKEN")。' },
    ],
    practice: '用 requests 调一个你喜欢的公开 API（GitHub 仓库、或任何免费 JSON 接口），把返回里你关心的 3 个字段整理成表格打印出来，错误时打印“请求失败”。',
    checklist: ['timeout 为什么必须加', 'r.json() 和 r.text 区别', 'Token 为什么不能硬编码'],
  },
  {
    id: 'python-3',
    goal: '把前三节串成一个小任务，并在项目实战中完成「用户行为分析平台」的数据任务。',
    minutes: 200,
    teach: [
      { type: 'p', text: '到这一步你已经具备：写脚本、组织模块、调接口。去「项目实战 → 增长实验室」跟着任务做：读一份行为日志 CSV，用 dict 统计 DAU、人均时长，输出分析结论。' },
      { type: 'note', text: '这一节没有新知识，重点是把“卡住→报错→查文档→修好”的循环跑一遍。真实工作就是这个循环，只是时间更长、代码更多。' },
    ],
    practice: '进入项目实战「增长实验室 · 用户行为分析平台」，完成阶段一里的全部任务卡片。',
    checklist: ['能独立把一个需求拆成函数', '报错时知道先看哪几行', '能把结果写成别人看得懂的输出'],
  },

  // ==================== Java ====================
  {
    id: 'java-0',
    goal: '能写一个带 main 方法的 Java 程序，理解基本类型、集合与异常。',
    minutes: 240,
    teach: [
      { type: 'p', text: 'Java 是“先写类型，再写逻辑”的语言。每个文件一个 public 类，入口是 public static void main(String[] args)。编译：javac 生成 .class，运行：java 类名。' },
      { type: 'code', text: `import java.util.*;
public class Cart {
    public static void main(String[] args) {
        List<String> items = new ArrayList<>();
        items.add("书"); items.add("笔");
        Map<String, Integer> price = new HashMap<>();
        price.put("书", 30);
        int total = 0;
        for (String s : items) total += price.get(s);
        System.out.println("合计：" + total);
    }
}` },
      { type: 'p', text: '集合框架是 Java 的基本功：List（有序可重复，用 ArrayList）、Set（不重复，用 HashSet）、Map（键值对，用 HashMap）。Java 8 的 stream 能让集合操作写得很短：list.stream().filter(x->x>10).count()。' },
      { type: 'note', text: '编译错误别慌：从第一个错误往下改，改完重新编译。System.out.println 是最朴素的调试。' },
    ],
    practice: '写一个 Cart.java：添加 3 个商品（名称+价格），用 Map 存价格，计算总价并打印；练习用 stream 筛出价格 > 50 的商品。',
    checklist: ['ArrayList 和 HashMap 分别什么时候用', '== 和 equals() 区别（对象比较用 equals）', '异常 try-catch 基本结构'],
  },
  {
    id: 'java-1',
    goal: '理解封装、继承、接口，能说清单例、工厂、策略三个常用设计模式。',
    minutes: 200,
    teach: [
      { type: 'p', text: '面向对象三句话：封装把数据藏起来只暴露方法；继承复用父类；接口定义“能做什么”不管“怎么做”。新手别过度设计——先有接口思维就够。' },
      { type: 'code', text: `interface Pay { void pay(int yuan); }
class WxPay implements Pay { public void pay(int y){ System.out.println("微信付"+y); } }
class AliPay implements Pay { public void pay(int y){ System.out.println("支付宝付"+y); } }
// 调用方面向接口，换支付方式不用改调用代码
Pay p = new WxPay(); p.pay(100);` },
      { type: 'p', text: '三个面试高频模式：单例（全局只有一个实例，如配置）、工厂（根据类型 new 出不同实现）、策略（把可变部分抽成接口，运行时替换）。Spring 的大量功能都建立在“面向接口”上。' },
    ],
    practice: '用接口 + 两个实现写一个「折扣策略」：满减、打折两种，调用方传入策略计算最终价格。画出类图。',
    checklist: ['接口和抽象类区别', '为什么面向接口而不是面向实现', '单例的意义'],
  },
  {
    id: 'java-2',
    goal: '理解 JVM 内存分区、GC 做什么，以及线程池的基本用法。',
    minutes: 180,
    teach: [
      { type: 'p', text: '面试常问：堆（存对象，GC 管这里）、栈（方法调用栈）、方法区（类信息）。GC 自动回收不用的对象——你只要知道“别无谓创建大对象、别在循环里 new 字符串”。' },
      { type: 'code', text: `// 不要自己 new Thread，用线程池
ExecutorService pool = Executors.newFixedThreadPool(8);
for (int i=0;i<10;i++){
    pool.submit(() -> System.out.println(Thread.currentThread().getName()));
}
pool.shutdown();` },
      { type: 'p', text: '并发三件套：多线程执行任务用线程池；多线程共享数据要加锁（synchronized）；常见并发问题是“超卖”“重复扣库存”。这些在后面的订单项目里会真实遇到。' },
    ],
    practice: '写一个程序用线程池并行下载 5 个网页内容并统计每个大小；故意不加锁跑一个 counter 看看结果对不对。',
    checklist: ['GC 负责哪块内存', '为什么不建议每次 new Thread', 'synchronized 锁住的是什么'],
  },
  {
    id: 'java-3',
    goal: '进入「订单系统重构」项目，在真实任务里完成第一个 Spring Boot 接口。',
    minutes: 240,
    teach: [
      { type: 'p', text: '到这里 Java 语法已经够上手项目了。Spring Boot 的角色是“帮你把 Web 服务搭好”：加依赖、写一个 @RestController、启动 main 类，就能通过 http 访问你的方法。' },
      { type: 'note', text: '项目里会带你装 JDK17 + IntelliJ IDEA + MySQL。别一开始纠结原理，先把接口跑起来（能 curl 通），再回头理解为什么。' },
    ],
    practice: '进入项目实战「星链商城 · 订单系统重构」，完成阶段一的环境准备和需求文档。',
    checklist: ['JDK 和 JRE 区别', 'Spring Boot 一个接口怎么写', '怎么用 curl 测自己的接口'],
  },

  // ==================== C/C++ ====================
  {
    id: 'cpp-0',
    goal: '理解指针、引用、栈和堆，能写带动态内存的 C++ 程序。',
    minutes: 240,
    teach: [
      { type: 'p', text: '指针存的是地址。int* p = &a; 表示 p 指向 a 的地址，*p 就是 a 本身。引用 int& r = a; 是别名。栈上变量函数结束自动释放，堆上 new 出来的要 delete。' },
      { type: 'code', text: `#include <iostream>
using namespace std;
int main(){
  int a = 10;
  int* p = &a;
  *p = 20;            // a 变成 20
  int* arr = new int[5];
  arr[0] = 1;
  delete[] arr;       // 必须配对
  cout << a << endl;
  return 0;
}` },
      { type: 'note', text: '最常见的 bug：忘记 delete（内存泄漏）、delete 后继续用（野指针）、数组越界。现代 C++ 推荐用智能指针 unique_ptr 自动管理，竞赛里手动 new/delete 足够。' },
    ],
    practice: '写一个程序：new 一个长度 10 的 int 数组，填入 1~10 并求和打印，最后 delete。再写一个函数接受 int* 并修改其指向的值。',
    checklist: ['& 和 * 分别什么意思', '栈和堆谁管谁', 'new[] 和 delete[] 为什么要配对'],
  },
  {
    id: 'cpp-1',
    goal: '会用 STL 的 vector/map/algorithm，组织多文件工程。',
    minutes: 200,
    teach: [
      { type: 'p', text: 'STL 就是“别人写好的轮子”：vector 是变长数组，map/set 是红黑树，unordered_map 是哈希。algorithm 里的 sort/find/reverse 直接用，不要自己造轮子。' },
      { type: 'code', text: `#include <vector>
#include <algorithm>
vector<int> v = {3,1,4,1,5};
sort(v.begin(), v.end());              // 升序
sort(v.begin(), v.end(), greater<int>()); // 降序
// 常用：去重
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());` },
      { type: 'p', text: '多文件：声明放 .h，实现放 .cpp，用 #pragma once 防重复包含。命令行编译：g++ main.cpp util.cpp -o main -std=c++17 -O2。竞赛直接用 g++ 命令行就够，不用急着学 CMake。' },
    ],
    practice: '读入 n 个整数，用 vector 存，去重后升序输出；再练习用 unordered_map 统计每个数字出现次数。',
    checklist: ['sort 默认升序怎么改成降序', 'vector 和数组的区别', '#pragma once 干嘛的'],
  },
  {
    id: 'cpp-2',
    goal: '会用 g++ 编译选项和 gdb 定位崩溃/错误答案。',
    minutes: 150,
    teach: [
      { type: 'p', text: '两个编译选项必记：-g 生成调试信息（配 gdb 用）；-fsanitize=address 自动查越界和内存错误，竞赛查 bug 神器。常见未定义行为（UB）：数组越界、未初始化变量、除零——不一定当场报错，但是 WA 常客。' },
      { type: 'code', text: `g++ main.cpp -o main -std=c++17 -O2 -Wall
g++ main.cpp -o main -std=c++17 -g -fsanitize=address
# gdb 里：break 行号 / run / next / print 变量 / bt` },
      { type: 'note', text: '做题调试三板斧：① 小数据手工模拟对不对；② 加 printf 打印中间变量；③ 开 ASan 跑一遍。不要一上来就猜，让工具说话。' },
    ],
    practice: '故意写一个数组越界的程序，用 -fsanitize=address 跑，看它报出的行号；再用 gdb 在 main 处打断点单步执行一次。',
    checklist: ['-O2 和 -g 各自作用', 'ASan 能查什么', 'UB 为什么可怕'],
  },
  {
    id: 'cpp-3',
    goal: '在算法模拟赛题里用 C++ 实现一个数据结构。',
    minutes: 240,
    teach: [
      { type: 'p', text: 'C++ 在算法竞赛里的优势是 STL 全 + 速度快。先把 vector、sort、栈、队列、优先队列（priority_queue）用熟，大部分签到题就够了。' },
      { type: 'note', text: '去「竞赛练兵 → 算法挑战赛」，按赛题要求实现，写完先过样例再提交，把提交截图和代码放进仓库。' },
    ],
    practice: '进入「竞赛练兵」，完成 a1 算法赛题并提交方案与仓库链接。',
    checklist: ['priority_queue 默认大顶堆', '栈和队列各有什么用', '怎么判断一道题该用什么数据结构'],
  },

  // ==================== Go ====================
  {
    id: 'go-0',
    goal: '理解 goroutine/channel 并发模型，能写一个并发小程序。',
    minutes: 180,
    teach: [
      { type: 'p', text: 'Go 的杀手锏是并发：go f() 启动一个 goroutine（比线程轻得多），channel 用来在 goroutine 之间传数据。不要“通过共享内存通信”，要“通过通信共享内存”。' },
      { type: 'code', text: `package main
import "fmt"
func worker(id int, ch chan string) {
    ch <- fmt.Sprintf("worker %d done", id)
}
func main() {
    ch := make(chan string, 3)
    for i := 1; i <= 3; i++ { go worker(i, ch) }
    for i := 1; i <= 3; i++ { fmt.Println(<-ch) }
}` },
      { type: 'p', text: '基础语法快速过：:= 短变量声明、切片 slice（变长数组）、map、struct 当结构体、interface 是隐式实现（不用写 implements）。错误用 error 返回值，不要 try/catch。' },
    ],
    practice: '写一个程序并发下载 3 个 URL 并打印状态码，用 channel 收集结果。',
    checklist: ['goroutine 和线程区别', '带缓冲 channel 什么意思', 'Go 怎么处理错误'],
  },
  {
    id: 'go-1',
    goal: '用 net/http 写一个最简单的 Web 服务。',
    minutes: 150,
    teach: [
      { type: 'p', text: 'Go 标准库自带 HTTP 能力，一行 http.HandleFunc 注册路由，ListenAndServe 起服务。这和 Python 的 Flask 思路一样，只是更贴近底层。' },
      { type: 'code', text: `package main
import ("fmt"; "net/http")
func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello %s", r.URL.Query().Get("name"))
}
func main() {
    http.HandleFunc("/hello", hello)
    http.ListenAndServe(":8080", nil)
}` },
    ],
    practice: '起一个 8080 服务，访问 /hello?name=测试 返回 “Hello 测试”，用浏览器或 curl 验证。',
    checklist: ['Handler 函数签名', '怎么读 query 参数', 'ListenAndServe 阻塞吗'],
  },
  {
    id: 'go-2',
    goal: '会 go module 管理依赖，写一个有单元测试的包。',
    minutes: 120,
    teach: [
      { type: 'p', text: 'go mod init 项目名 初始化依赖管理；go get 拉依赖。测试是 Go 的原生能力：写 foo_test.go，func TestXxx(t *testing.T)，go test 跑。' },
      { type: 'code', text: `// math.go
func Add(a, b int) int { return a + b }
// math_test.go
func TestAdd(t *testing.T){
    if Add(2,3) != 5 { t.Error("2+3 should be 5") }
}` },
    ],
    practice: '给你之前的程序抽一个包，写两个测试用例（正常 + 边界），跑 go test 全绿。',
    checklist: ['go.mod 干嘛的', '测试文件名规则', 't.Error 和 t.Fatal 区别'],
  },
  {
    id: 'go-3',
    goal: '在「竞赛报名系统」项目里实现一个限流中间件。',
    minutes: 200,
    teach: [
      { type: 'p', text: '限流就是“单位时间内最多处理 N 个请求”，常见用令牌桶/计数器。项目里会带你用 Go 写一个中间件，超阈值直接返回 429。' },
      { type: 'note', text: '进入项目「极客汇 · 竞赛报名系统」跟着阶段任务做，重点理解中间件怎么把“通用逻辑”从业务里抽出来。' },
    ],
    practice: '进入「极客汇 · 竞赛报名系统」，完成阶段二的限流任务。',
    checklist: ['什么是中间件', '429 状态码含义', '限流为什么必要'],
  },

  // ==================== 算法 ====================
  {
    id: 'algo-0',
    goal: '会用大 O 估算复杂度，掌握数组/链表/栈/队列的基本操作。',
    minutes: 200,
    teach: [
      { type: 'p', text: '大 O 描述“数据量变大时，耗时涨多快”：O(1) 常数、O(log n) 很快、O(n) 线性、O(n log n) 排序级、O(n²) 双重循环、O(2ⁿ) 爆炸。面试官问复杂度就是在问这个。' },
      { type: 'code', text: `# 常见复杂度直觉
for i in range(n): ...            # O(n)
for i in range(n):
  for j in range(n): ...          # O(n^2)
i = 1; while i < n: i *= 2        # O(log n)` },
      { type: 'p', text: '四种结构：数组随机访问 O(1) 插入慢；链表插入快访问慢；栈后进先出（括号匹配）；队列先进先出（BFS）。先在纸上手写一遍，再写代码。' },
    ],
    practice: 'LeetCode 简单题：20 有效的括号（栈）、206 反转链表（链表）、933 最近请求次数（队列）。每道先想复杂度再写。',
    checklist: ['O(n) 和 O(n log n) 谁快', '栈用来解决什么问题', '数组中间插入为什么慢'],
  },
  {
    id: 'algo-1',
    goal: '掌握哈希表用法和常见字符串套路。',
    minutes: 180,
    teach: [
      { type: 'p', text: '哈希表把“查找”从 O(n) 降到 O(1)。看到“出现几次”“是否存在”“两数之和”，第一反应就是哈希表。Python 用 dict/set，Java 用 HashMap/HashSet，C++ 用 unordered_map。' },
      { type: 'code', text: `# 两数之和：边遍历边查另一半在不在表中
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i` },
      { type: 'note', text: '字符串题常用技巧：双指针（头尾/快慢）、滑动窗口（求最长/最短连续子串）。先把两数之和、最长无重复子串两道经典题吃透。' },
    ],
    practice: 'LeetCode：1 两数之和、3 无重复字符的最长子串（滑动窗口）。要求自己不看题解写出来。',
    checklist: ['哈希表为什么查找是 O(1)', '滑动窗口适合什么题', '两数之和时间复杂度'],
  },
  {
    id: 'algo-2',
    goal: '能手写二叉树遍历，会用 DFS/BFS 解图和搜索题。',
    minutes: 200,
    teach: [
      { type: 'p', text: '树是特殊的图。二叉树三种遍历（前/中/后序）先写递归版，再写栈的迭代版。DFS 用栈/递归，适合一条路走到黑；BFS 用队列，适合按层遍历、求最短步数。' },
      { type: 'code', text: `# 二叉树层序遍历 BFS
from collections import deque
def level_order(root):
    q, res = deque([root]), []
    while q:
        node = q.popleft()
        res.append(node.val)
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return res` },
    ],
    practice: 'LeetCode：104 二叉树最大深度（DFS）、102 层序遍历（BFS）、200 岛屿数量（DFS 染色）。',
    checklist: ['DFS 和 BFS 分别用什么结构', '递归三要素（终止/拆解/返回）', '层序遍历为什么适合求最短路径'],
  },
  {
    id: 'algo-3',
    goal: '理解动态规划“状态定义 + 转移方程”的套路。',
    minutes: 240,
    teach: [
      { type: 'p', text: 'DP 三步：① 定义 dp[i] 是什么意思；② 写转移方程 dp[i] = max/min(dp[i-1], ...)；③ 确定遍历顺序和初始值。经典题：爬楼梯、打家劫舍、最长公共子序列、01 背包。' },
      { type: 'code', text: `# 爬楼梯：dp[i] = dp[i-1] + dp[i-2]
def climb(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n+1):
        a, b = b, a + b
    return b` },
      { type: 'note', text: '新手学 DP 不要一上来就 hard 题。把爬楼梯 → 打家劫舍 → 最长递增子序列这三道按顺序写明白，DP 就入门了。' },
    ],
    practice: 'LeetCode：70 爬楼梯、198 打家劫舍、322 零钱兑换。每道先写暴力递归，再优化成 DP。',
    checklist: ['dp[i] 的含义怎么定', '怎么想到转移方程', 'DP 和递归的关系'],
  },

  // ==================== SQL ====================
  {
    id: 'sql-0',
    goal: '能写增删改查、聚合分组、排序分页的完整 SQL。',
    minutes: 150,
    teach: [
      { type: 'p', text: 'SQL 分四类：DDL（建表 CREATE）、DML（增删改 INSERT/UPDATE/DELETE）、DQL（查询 SELECT）、权限。90% 工作在 DQL。' },
      { type: 'code', text: `-- 查每个城市的用户数，按数量倒序，取前 10
SELECT city, COUNT(*) AS cnt
FROM users
WHERE created_at >= '2026-01-01'
GROUP BY city
HAVING COUNT(*) > 5
ORDER BY cnt DESC
LIMIT 10;` },
      { type: 'p', text: '子句顺序要背熟：SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT。WHERE 行前过滤，HAVING 组后过滤。' },
    ],
    practice: '装一个 MySQL（或用在线 SQL 环境），建一张 users 表插 10 行数据，写出“每个城市男生人数”的查询。',
    checklist: ['WHERE 和 HAVING 区别', 'COUNT(*) 和 COUNT(列) 区别', 'GROUP BY 后 SELECT 能写什么'],
  },
  {
    id: 'sql-1',
    goal: '会写 JOIN 多表查询，理解索引为什么能加速。',
    minutes: 180,
    teach: [
      { type: 'p', text: 'JOIN 把多张表按关联键拼起来：INNER JOIN 只留两边都匹配的；LEFT JOIN 保留左表全部。写之前先想“我要哪几列、从哪几表、怎么连”。' },
      { type: 'code', text: `SELECT o.id, u.name, o.amount
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.amount > 100;` },
      { type: 'p', text: '索引像书的目录：在 WHERE/JOIN/ORDER BY 用到的列上建索引，查询从全表扫描 O(n) 变成 O(log n)。但索引不是越多越好——写操作会变慢、占空间。用 EXPLAIN 看执行计划。' },
    ],
    practice: '建 orders 表关联 users 表，写一个“每个用户的订单总金额”的 JOIN + GROUP BY 查询；给 user_id 加索引并用 EXPLAIN 看变化。',
    checklist: ['INNER 和 LEFT JOIN 区别', '索引为什么快', 'EXPLAIN 看什么'],
  },
  {
    id: 'sql-2',
    goal: '理解事务 ACID 和隔离级别，知道锁是怎么回事。',
    minutes: 150,
    teach: [
      { type: 'p', text: '事务是“一组操作要么全成功要么全失败”：转账——扣 A 钱加 B 钱，中间断电不能只做一半。ACID 四个字母：原子性、一致性、隔离性、持久性。' },
      { type: 'code', text: `BEGIN;
UPDATE account SET balance = balance - 100 WHERE id=1;
UPDATE account SET balance = balance + 100 WHERE id=2;
COMMIT;  -- 或 ROLLBACK;` },
      { type: 'note', text: '面试高频：脏读/不可重复读/幻读分别是什么，MySQL 默认隔离级别 RR 怎么解决。不用背得一字不差，能举“两个窗口同时改同一条数据”的例子讲清楚即可。' },
    ],
    practice: '开两个 MySQL 窗口，同时更新同一行观察锁等待；把转账 SQL 写一遍并手动 ROLLBACK 一次。',
    checklist: ['事务失败怎么办', 'RR 和 RC 区别', '为什么需要隔离级别'],
  },
  {
    id: 'sql-3',
    goal: '在订单项目里设计索引并优化一条慢 SQL。',
    minutes: 180,
    teach: [
      { type: 'p', text: '项目里订单表会很大，按用户+时间查订单是高频。你要设计联合索引 (user_id, created_at)，并理解最左前缀原则。' },
      { type: 'note', text: '进入「星链商城」项目阶段二，按任务要求写建表语句和索引设计文档。' },
    ],
    practice: '完成「星链商城 · 订单系统重构」阶段二的数据库设计任务。',
    checklist: ['最左前缀原则', '什么是慢查询', '联合索引和单列索引怎么选'],
  },

  // ==================== Redis ====================
  {
    id: 'redis-0',
    goal: '熟悉五种基本数据结构及各自适用场景。',
    minutes: 120,
    teach: [
      { type: 'p', text: 'Redis 是内存 KV 库，快是因为数据在内存。五种结构：String（缓存对象/计数）、Hash（存对象字段）、List（消息队列/时间线）、Set（去重/标签）、ZSet（排行榜）。' },
      { type: 'code', text: `SET user:1:name "Tom"
HSET product:1 stock 100 price 99
ZADD rank 95 "alice" 88 "bob"
ZREVRANGE rank 0 2 WITHSCORES   # 取前3名` },
    ],
    practice: '本地装 Redis（或用在线模拟器），用 ZSet 实现一个简单排行榜：插入 5 个分数，取出前三名。',
    checklist: ['Redis 为什么快', 'List 和 ZSet 区别', 'String 和 Hash 怎么选'],
  },
  {
    id: 'redis-1',
    goal: '理解缓存穿透/击穿/雪崩及应对方案。',
    minutes: 120,
    teach: [
      { type: 'p', text: '三大经典问题：穿透（查不存在的 key，每次都打 DB → 布隆过滤器/空值缓存）；击穿（热点 key 过期瞬间大量请求打 DB → 互斥锁/逻辑不过期）；雪崩（大量 key 同时过期 → 过期时间加随机抖动）。' },
      { type: 'note', text: '这三个词面试必问。记住“问题现象 + 一个解决办法”就够，不用背所有方案细节。' },
    ],
    practice: '用自己的话写一段（100 字内）：什么是缓存击穿，怎么解决？然后对照教材修正。',
    checklist: ['穿透和击穿的区别', '雪崩怎么缓解', '缓存为什么要设过期'],
  },
  {
    id: 'redis-2',
    goal: '了解持久化 RDB/AOF 和主从高可用概念。',
    minutes: 90,
    teach: [
      { type: 'p', text: 'RDB 是定时快照（恢复快但可能丢数据），AOF 是写命令日志（更安全但文件大）。生产常用混合持久化。主从复制 + 哨兵实现高可用，这是“知道概念即可”的级别。' },
    ],
    practice: '在笔记里画出：客户端 → 主 Redis → 从 Redis 的结构图，标注读/写分别打到谁。',
    checklist: ['RDB 和 AOF 取舍', '主从用来解决什么', '哨兵做什么'],
  },
  {
    id: 'redis-3',
    goal: '在订单项目里设计一个缓存 + 降级方案。',
    minutes: 150,
    teach: [
      { type: 'note', text: '进入「星链商城」项目，阶段三会要求你设计“商品详情先查 Redis，没有再查 DB 并回填”的缓存逻辑。' },
    ],
    practice: '完成「星链商城」阶段三的缓存设计任务，并把方案写进技术文档。',
    checklist: ['缓存更新策略（先更 DB 还是先删缓存）', '缓存和 DB 不一致怎么办', '什么是服务降级'],
  },

  // ==================== 向量数据库 ====================
  {
    id: 'vector-0',
    goal: '理解什么是 Embedding 向量和相似度。',
    minutes: 90,
    teach: [
      { type: 'p', text: 'Embedding 是把一段文本/图片变成一串数字（比如 1024 维），意思相近的文本向量距离也近。算相似度最常用余弦相似度：夹角越小越相似。' },
      { type: 'code', text: `# 概念示意
"苹果手机" -> [0.12, -0.83, ..., 0.41]  # 1024 维
"华为手机" -> [0.10, -0.79, ..., 0.38]  # 距离近
"今天天气" -> [-0.55, 0.21, ..., -0.10] # 距离远` },
    ],
    practice: '在脑子里回答：为什么不能用数据库 LIKE 查“相似语义”，而要向量？写三行解释。',
    checklist: ['Embedding 是什么', '余弦相似度衡量什么', '为什么关键词搜索不等于语义搜索'],
  },
  {
    id: 'vector-1',
    goal: '了解 ANN 近似最近邻索引思路（HNSW/IVF）。',
    minutes: 90,
    teach: [
      { type: 'p', text: '库里存了几百万条向量，每次全量算相似度太慢。ANN 索引“近似”地找最近邻，快 100 倍，准确率略降但够用。HNSW 是现在最常用的图索引——知道“建图 + 跳着找”这个直觉即可。' },
    ],
    practice: '读一遍 Milvus/Chroma 任一文档的“索引选型”章节，记录 IVF 和 HNSW 各自适合什么数据量。',
    checklist: ['ANN 近似在哪', '为什么不用精确计算', 'HNSW 解决什么问题'],
  },
  {
    id: 'vector-2',
    goal: '在「RAG 助手」项目里完成文档入库与检索。',
    minutes: 150,
    teach: [
      { type: 'note', text: '进入「智答 · RAG 助手」项目，你会把一份企业文档切块、向量化、入库，然后输入问题检索出最相关的 3 段。这是 RAG 的核心一步。' },
    ],
    practice: '完成「智答 · 企业知识库 RAG 助手」阶段二的向量化入库任务。',
    checklist: ['文档为什么要切块', 'chunk 大小怎么定', '检索 top_k 是什么意思'],
  },

  // ==================== Linux ====================
  {
    id: 'linux-0',
    goal: '熟练文件、进程、网络、权限四类常用命令。',
    minutes: 120,
    teach: [
      { type: 'code', text: `# 文件
ls -lah  cd  pwd  cp -r  mv  rm  mkdir -p
# 查看文件
cat  less  tail -f app.log  grep -rn "TODO" src/
# 进程与端口
ps aux | grep java   top   kill -9 12345
netstat -tlnp | grep 8080
# 权限与管道
chmod +x run.sh     ls -l | grep ".log"` },
      { type: 'p', text: '管道 | 把前一个命令的输出当后一个的输入：ps aux | grep java > 日志。重定向 > 写文件、>> 追加。这两件事是命令行的灵魂。' },
    ],
    practice: '在 WSL/云服务器/容器里：找当前目录最大的 5 个文件；找出占用 8080 端口的进程；把 app.log 的最后 100 行存到 out.txt。',
    checklist: ['tail -f 干嘛用', '| 和 > 区别', '怎么查谁在监听某端口'],
  },
  {
    id: 'linux-1',
    goal: '能写简单 Shell 脚本做自动化。',
    minutes: 120,
    teach: [
      { type: 'code', text: `#!/bin/bash
count=$(ls *.log | wc -l)
echo "日志文件数：$count"
for f in *.log; do
  if [ $(wc -l < "$f") -gt 1000 ]; then
    echo "大日志：$f"
  fi
done` },
      { type: 'p', text: '脚本三要素：变量（$var 或 ${var}）、if 条件（[ -f 文件 ]）、for 循环。写完 chmod +x 加执行权限，用 crontab -e 配定时任务。' },
    ],
    practice: '写一个 backup.sh：把当前目录的 .log 文件打包成 logs.tar.gz 放到 /tmp；用 crontab 让它每天凌晨 2 点跑。',
    checklist: ['变量怎么取值', 'crontab 五个星位什么意思', '&& 和 || 在 shell 里'],
  },
  {
    id: 'linux-2',
    goal: '知道服务怎么常驻、怎么看日志、怎么开端口。',
    minutes: 90,
    teach: [
      { type: 'code', text: `systemctl status nginx
systemctl restart nginx
journalctl -u nginx -f      # 跟日志
# 防火墙放行
ufw allow 8080` },
      { type: 'p', text: '生产上你的程序不能“关了终端就停”，要用 systemd 托管或 nohup。出问题先看日志：程序自己打的 + journalctl。' },
    ],
    practice: '把你之前写的 HTTP 服务用 nohup 后台跑起来，curl 验证它在跑，再 kill 掉。',
    checklist: ['nohup 干嘛', 'systemctl 三个子命令', '服务挂了第一步看什么'],
  },

  // ==================== Git ====================
  {
    id: 'git-0',
    goal: '掌握 add/commit/log/diff/reset 基本循环。',
    minutes: 90,
    teach: [
      { type: 'code', text: `git init
git add .
git commit -m "feat: 完成首页"
git log --oneline          # 看历史
git diff                   # 看未暂存改动
git status                 # 看当前状态
git reset --soft HEAD~1    # 撤销上次 commit，保留改动` },
      { type: 'p', text: '先在本地把这个循环练熟：改文件 → add → commit。commit message 写成“feat: 加了什么/修复了什么”，别只写“update”。' },
    ],
    practice: '建一个本地仓库，做 3 次提交（每次加一个文件），用 git log 看历史，故意改错一次再用 git diff 看差异。',
    checklist: ['工作区/暂存区/本地库关系', 'git diff 看什么', '--soft 和 --hard 区别'],
  },
  {
    id: 'git-1',
    goal: '会开分支、合并、解决冲突。',
    minutes: 120,
    teach: [
      { type: 'code', text: `git checkout -b feature/login   # 开新分支
git checkout main
git merge feature/login        # 合并
# 冲突时：编辑冲突文件（<<<<<<<），解决后
git add . && git commit` },
      { type: 'p', text: '团队流程：main 是稳定分支，每人开 feature 分支干活，做完合回 main。rebase 比 merge 历史更干净，新手先用 merge 不丢人。冲突不可怕——打开冲突标记，手动选保留谁。' },
    ],
    practice: '开一个 fix/bug 分支改同一行代码，切回 main 改同一行，再合并制造冲突，手动解决。',
    checklist: ['分支的意义', '冲突标记长什么样', 'merge 和 rebase 区别'],
  },
  {
    id: 'git-2',
    goal: '熟悉团队 PR/MR 协作流程。',
    minutes: 90,
    teach: [
      { type: 'p', text: '真实流程：fork/克隆 → 建分支 → 提交 → push 到远程 → 在 GitHub/GitLab 发 Pull Request → 同事 review → 讨论修改 → 合并。每个项目实战都会走一遍这个流程。' },
      { type: 'note', text: '从现在起，你做的每个练习都 push 到自己的 GitHub 公开仓库——这就是简历上的“项目地址”。' },
    ],
    practice: '把你之前的任意一个练习项目 push 到 GitHub 新建仓库，确认仓库是公开的。',
    checklist: ['PR 是谁合并谁', '为什么要用分支而不是直推 main', 'commit message 规范怎么写'],
  },

  // ==================== Spring ====================
  {
    id: 'spring-0',
    goal: '理解 IoC 和依赖注入，会写第一个 Bean。',
    minutes: 120,
    teach: [
      { type: 'p', text: 'IoC（控制反转）一句话：你不 new 对象，Spring 容器帮你 new 好、需要时自动塞进来（@Autowired / 构造器注入）。好处是换实现只要改一处。' },
      { type: 'code', text: `@Service
public class OrderService {
    private final PayService payService;
    public OrderService(PayService payService) { this.payService = payService; }
}` },
    ],
    practice: '用 Spring Initializr 建一个项目，写一个 @Service，再在另一个类里构造器注入它。',
    checklist: ['IoC 解决什么问题', 'Bean 是什么', '构造器注入比字段注入好在哪'],
  },
  {
    id: 'spring-1',
    goal: '写一个带参数校验和统一异常的 REST 接口。',
    minutes: 150,
    teach: [
      { type: 'code', text: `@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
    public Result create(@Valid @RequestBody OrderDTO dto) { ... }
}
// 统一返回 {code, message, data}
// 统一异常 @RestControllerAdvice 捕获 MethodArgumentNotValidException` },
      { type: 'p', text: '企业里接口不直接返回实体，而是包装成统一 Result；参数校验用 @Valid + @NotNull；异常全局处理，不把堆栈抛给前端。' },
    ],
    practice: '写一个 POST /api/orders 接口，接收金额（@Min(0.01)），校验失败返回统一错误 JSON。',
    checklist: ['@RestController 和 @Controller 区别', '为什么要统一返回体', '@Valid 怎么触发校验'],
  },
  {
    id: 'spring-2',
    goal: '会集成 MyBatis/JPA 操作数据库，知道声明式事务。',
    minutes: 150,
    teach: [
      { type: 'code', text: `@Transactional
public void pay(Long orderId) {
    orderMapper.updateStatus(orderId, "PAID");
    payMapper.record(...);
    // 任一异常抛出，整个事务回滚
}` },
      { type: 'p', text: 'MyBatis 写 SQL、JPA 写方法名自动生成。新手从 MyBatis 上手更直观。@Transactional 标在方法上，方法成功提交、异常回滚。' },
    ],
    practice: '在订单项目里写一个 Mapper 接口 + XML，完成按 id 查订单；加 @Transactional 写支付方法。',
    checklist: ['@Transactional 什么时候生效', 'MyBatis 是什么', '事务失效场景（同类自调用）'],
  },
  {
    id: 'spring-3',
    goal: '了解微服务三大件：注册中心、网关、配置中心。',
    minutes: 90,
    teach: [
      { type: 'p', text: '微服务把大应用拆成小服务。服务 A 不知道服务 B 在哪，所以要有“注册中心”（大家上线来登记）；“网关”统一入口做鉴权路由；“配置中心”集中管配置。知道概念和为什么拆即可，这是中高级内容。' },
    ],
    practice: '画一张微服务架构图：用户 → 网关 → 订单服务/支付服务 → DB，并标注注册中心的位置。',
    checklist: ['为什么要拆微服务', '注册中心干嘛', '网关解决什么'],
  },

  // ==================== FastAPI ====================
  {
    id: 'fastapi-0',
    goal: '理解 REST、HTTP 状态码和接口鉴权基本概念。',
    minutes: 90,
    teach: [
      { type: 'p', text: 'REST 风格：URL 表资源（/orders），用 HTTP 方法表操作（GET 查、POST 建、PUT 改、DELETE 删）。状态码：200 成功、400 参数错、401 没登录、403 没权限、404 不存在、500 服务错。' },
    ],
    practice: '给自己列一个“订单接口清单”：GET /orders、POST /orders、GET /orders/{id}，写出每个的请求参数和返回。',
    checklist: ['GET 和 POST 区别', '401 和 403 区别', 'REST 是什么风格'],
  },
  {
    id: 'fastapi-1',
    goal: '用 FastAPI 写出第一个带自动文档的接口。',
    minutes: 120,
    teach: [
      { type: 'code', text: `from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
class Item(BaseModel):
    name: str
    price: float
@app.post("/items")
def create_item(item: Item):
    return {"id": 1, **item.model_dump()}` },
      { type: 'p', text: 'FastAPI 自动生成接口文档：启动后访问 /docs 就是 Swagger 页面。Pydantic 模型既做参数校验又做文档，这是它比 Flask 快的原因。' },
    ],
    practice: 'pip install fastapi uvicorn，写一个 POST /items 接口，启动后打开 /docs 试调一次。',
    checklist: ['Pydantic 做什么', '/docs 是什么', 'uvicorn 干嘛用'],
  },
  {
    id: 'fastapi-2',
    goal: '处理 CORS 跨域，让前端能调你的接口。',
    minutes: 60,
    teach: [
      { type: 'code', text: `from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产改成具体域名
    allow_methods=["*"],
)` },
      { type: 'note', text: '前端 5173 调后端 8000 被浏览器拦是常态，加 CORS 中间件即可。生产环境 allow_origins 不要写 *。' },
    ],
    practice: '给你的 FastAPI 加 CORS，用浏览器页面 fetch 一次自己的接口确认不跨域报错。',
    checklist: ['跨域是谁拦的', 'allow_origins 生产怎么配', '中间件是什么'],
  },
  {
    id: 'fastapi-3',
    goal: '在 RAG 项目里封装一个问答 API。',
    minutes: 150,
    teach: [
      { type: 'note', text: '进入「智答 · RAG 助手」项目，你会把“检索 + 调大模型回答”封装成 POST /ask，传入问题返回答案和引用片段。' },
    ],
    practice: '完成「智答」阶段三的接口封装任务，用 /docs 自测。',
    checklist: ['请求体怎么设计', '流式返回是什么', '错误怎么返回'],
  },

  // ==================== Docker ====================
  {
    id: 'docker-0',
    goal: '会写一个 Dockerfile 把 Python 应用打包成镜像。',
    minutes: 120,
    teach: [
      { type: 'code', text: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]` },
      { type: 'p', text: '镜像就是“带运行环境的安装包”，容器是镜像跑起来的进程。Dockerfile 每一行生成一层，能利用缓存。' },
    ],
    practice: '给你之前的 FastAPI 写 Dockerfile，docker build 后 docker run 起容器，从宿主机 curl 通。',
    checklist: ['镜像和容器区别', 'Dockerfile 常用指令', '为什么 COPY requirements.txt 放前面'],
  },
  {
    id: 'docker-1',
    goal: '用 Compose 一键启动“应用 + 数据库”。',
    minutes: 120,
    teach: [
      { type: 'code', text: `# docker-compose.yml
services:
  web:
    build: .
    ports: ["8000:8000"]
    depends_on: [db]
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: 123456
    volumes: ["db_data:/var/lib/mysql"]` },
      { type: 'p', text: 'compose 把多个服务写成一个文件，docker compose up -d 一键起。volumes 做数据持久化，否则容器删了数据就没了。' },
    ],
    practice: '把你的应用 + MySQL 写成 compose 文件，一条命令把整套环境拉起来。',
    checklist: ['depends_on 干嘛', 'volume 解决什么', 'docker compose down -v 会怎样'],
  },
  {
    id: 'docker-2',
    goal: '了解 K8s 核心概念：Pod/Deployment/Service。',
    minutes: 90,
    teach: [
      { type: 'p', text: 'K8s 是“自动管很多容器”的系统。Pod 是最小调度单位（包着你的容器），Deployment 管“跑几个副本、怎么升级”，Service 给 Pod 一个固定访问入口。面试问 K8s 知道这三个 + 为什么需要（自动扩缩容、自愈）即可。' },
    ],
    practice: '在笔记里画：Deployment 管理 3 个 Pod，Service 把请求轮询到这 3 个 Pod。',
    checklist: ['Pod 和容器关系', 'Deployment 解决什么', 'Service 为什么必要'],
  },

  // ==================== 分布式 ====================
  {
    id: 'dist-0',
    goal: '理解并发安全和限流的基本思路。',
    minutes: 120,
    teach: [
      { type: 'p', text: '并发安全：多线程改同一个变量会出错（count++ 不是原子操作）。解决：加锁或用原子类。限流：QPS 太高会压垮系统，要在入口限住，常见算法有令牌桶、漏桶。' },
    ],
    practice: '用你熟悉的语言写一个计数器：1000 个 goroutine/线程各 +1000 次，看不加锁结果是不是 1000000。',
    checklist: ['count++ 为什么不原子', '限流解决什么', '线程池大小怎么估'],
  },
  {
    id: 'dist-1',
    goal: '知道消息队列解决什么问题。',
    minutes: 90,
    teach: [
      { type: 'p', text: '消息队列（Kafka/RabbitMQ）在两个服务之间插一条“缓冲带”：订单服务发个消息就返回，库存服务慢慢消费。好处：异步、削峰、解耦。坏处：多了一个要维护的组件、可能重复消费。' },
    ],
    practice: '举一个你熟悉的业务（比如“下单后发短信”），说明为什么用消息队列比同步调用好。',
    checklist: ['消息队列三个好处', '什么是削峰', '重复消费怎么办'],
  },
  {
    id: 'dist-2',
    goal: '理解 CAP 定理和最终一致性。',
    minutes: 90,
    teach: [
      { type: 'p', text: 'CAP：一致性 C、可用性 A、分区容错 P 三者最多满足两个。分布式系统网络一定会分区（P 必选），所以在 CP（一致性优先，如 ZooKeeper）和 AP（可用优先，如 Eureka）之间取舍。大多数业务选 AP + 最终一致。' },
    ],
    practice: '用“下单减库存”举例：为什么不要求“强一致”，而接受“短暂不一致，最终一致”。',
    checklist: ['CAP 哪三个', '为什么 P 必选', '最终一致什么意思'],
  },
  {
    id: 'dist-3',
    goal: '在秒杀系统模拟里输出一版完整设计方案。',
    minutes: 200,
    teach: [
      { type: 'note', text: '进入「极客汇 · 竞赛报名系统」或「竞赛练兵 a4 系统设计」，按“限流 → 库存预热到 Redis → 异步下单 → DB 最终扣减”思路写设计文档。' },
    ],
    practice: '完成「竞赛报名系统」阶段三的压测与优化任务，并输出设计文档。',
    checklist: ['秒杀为什么不能直接打 DB', 'Redis 预减库存', '如何防止超卖'],
  },

  // ==================== 数据分析 ====================
  {
    id: 'ds-0',
    goal: '用 Numpy 做向量化计算，摆脱 Python 慢循环。',
    minutes: 120,
    teach: [
      { type: 'code', text: `import numpy as np
a = np.array([1,2,3,4])
print(a * 2)              # [2 4 6 8]，整体运算
print(a[a > 2])           # 布尔索引 [3 4]
print(a.mean(), a.sum())` },
      { type: 'p', text: 'Numpy 把循环下沉到 C 层，比 Python for 快几十倍。核心：数组 + 广播 + 布尔索引。别写 for 循环处理数值，先想“能不能整体算”。' },
    ],
    practice: '用 Numpy 生成 10000 个随机数，计算大于平均值的个数、标准差，对比 Python 列表写法。',
    checklist: ['向量化是什么', '布尔索引怎么用', '广播规则'],
  },
  {
    id: 'ds-1',
    goal: '用 Pandas 完成一份数据的清洗与分组统计。',
    minutes: 150,
    teach: [
      { type: 'code', text: `import pandas as pd
df = pd.read_csv("user_event.csv")
df = df.drop_duplicates()
df["dt"] = pd.to_datetime(df["dt"]).dt.date
print(df.groupby("dt")["uid"].nunique())   # 每日 UV
print(df["duration"].fillna(0))` },
      { type: 'p', text: '数据清洗三板斧：dropna/drop_duplicates 去脏、astype/to_datetime 改类型、fillna 补缺。分析靠 groupby + agg。' },
    ],
    practice: '找一份公开 CSV（比如 Kaggle 上的电商行为数据），完成：去重、补缺失、按日统计 UV 和人均时长。',
    checklist: ['groupby 后怎么聚合', 'UV 和 PV 区别', '缺失值怎么处理'],
  },
  {
    id: 'ds-2',
    goal: '用图表把结论讲清楚，而不是只甩数字。',
    minutes: 120,
    teach: [
      { type: 'p', text: '图表选择：趋势用折线、对比用柱状、占比用饼/条、分布用直方图/箱线图。原则：一张图只讲一个结论，标题直接写结论（如“9 月 UV 环比涨 18%”而不是“UV 趋势”）。' },
    ],
    practice: '把上一课的日 UV 数据画成折线图，标题写成结论句，附两句话解释涨跌原因。',
    checklist: ['什么情况用柱状/折线', '为什么标题要写结论', '图表不能说谎的底线'],
  },
  {
    id: 'ds-3',
    goal: '在「行为分析平台」项目里产出一份分析报告。',
    minutes: 200,
    teach: [
      { type: 'note', text: '进入「增长实验室 · 用户行为分析平台」，阶段要求你输出：DAU 趋势、留存曲线、异常波动定位、两条可执行建议。' },
    ],
    practice: '完成「增长实验室」阶段三的分析报告任务。',
    checklist: ['留存怎么算', '怎么定位异常波动', '建议怎么写才不像废话'],
  },

  // ==================== 机器学习 ====================
  {
    id: 'ml-0',
    goal: '理解特征工程：数值/类别特征怎么进模型。',
    minutes: 120,
    teach: [
      { type: 'p', text: '模型只吃数字。类别特征（城市、性别）要编码：低基数用 OneHot，高基数用 Target/Embedding。数值特征要归一化/标准化（让不同量级在同一刻度）。缺失值用均值/中位数/单独标记列。' },
    ],
    practice: '拿一份表格数据，把“性别、城市”两列做 OneHot，把“年龄”做标准化，写出处理后矩阵的形状。',
    checklist: ['为什么要归一化', 'OneHot 适合什么', '缺失值怎么办'],
  },
  {
    id: 'ml-1',
    goal: '理解线性回归、逻辑回归、树模型和集成的直觉。',
    minutes: 120,
    teach: [
      { type: 'p', text: '线性/逻辑回归是 baseline，先跑通再谈优化；树模型（决策树）能处理非线性、可解释；随机森林/GBDT（XGBoost/LightGBM）是表格数据的王，Kaggle 表格赛几乎标配。' },
    ],
    practice: '用 sklearn 对一份数据跑 LogisticRegression 和 RandomForest，对比准确率，不需要调参。',
    checklist: ['逻辑回归是分类还是回归', '树模型为什么可解释', '随机森林是什么集成思路'],
  },
  {
    id: 'ml-2',
    goal: '会用交叉验证和评估指标判断模型好坏。',
    minutes: 120,
    teach: [
      { type: 'p', text: '分类不止看 accuracy：不平衡数据要看 AUC、精确率、召回率。交叉验证把数据折几份轮流当验证集，结果更稳。过拟合（训练好测试差）：加正则、减特征、拿更多数据。' },
    ],
    practice: '用 train_test_split + cross_val_score 跑一次，记录 5 折平均 AUC，并解释为什么不只用 accuracy。',
    checklist: ['AUC 衡量什么', '过拟合表现', '为什么要交叉验证'],
  },
  {
    id: 'ml-3',
    goal: '在模拟赛题里完成一版完整建模流程。',
    minutes: 200,
    teach: [
      { type: 'note', text: '进入「竞赛练兵 a2 数据挖掘模拟」，从读数据→特征→训练→评估→写结论走完整一遍。' },
    ],
    practice: '完成 a2 数据挖掘赛题并提交你的方案和代码。',
    checklist: ['建模流程几步', '什么时候换模型', '结论怎么写'],
  },

  // ==================== PyTorch ====================
  {
    id: 'dl-0',
    goal: '会创建 Tensor、用 Dataset/DataLoader 读数据。',
    minutes: 120,
    teach: [
      { type: 'code', text: `import torch
x = torch.randn(3, 4)
y = torch.zeros(3, 4)
# Dataset 包装后 DataLoader 分批
loader = torch.utils.data.DataLoader(dataset, batch_size=32, shuffle=True)` },
      { type: 'p', text: 'Tensor 就是能算梯度的多维数组。Dataset 定义“一条数据怎么取”，DataLoader 负责“批量打乱送进模型”。新手先别自己写 Dataset，用现成的 ImageFolder/TensorDataset。' },
    ],
    practice: '建一个 1000×10 的随机数据集，用 DataLoader 按 32 一批迭代，打印一个 batch 的 shape。',
    checklist: ['Tensor 和 numpy 数组关系', 'batch_size 影响什么', 'shuffle 干嘛'],
  },
  {
    id: 'dl-1',
    goal: '搭一个最简单的 MLP 并写训练循环。',
    minutes: 150,
    teach: [
      { type: 'code', text: `model = torch.nn.Sequential(
  torch.nn.Linear(10, 64), torch.nn.ReLU(),
  torch.nn.Linear(64, 2))
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = torch.nn.CrossEntropyLoss()
for x, y in loader:
    opt.zero_grad()
    loss = loss_fn(model(x), y)
    loss.backward()
    opt.step()` },
      { type: 'p', text: '训练循环五步：清零梯度 → 前向算 loss → 反向传播 → 优化器更新。照抄就行，先跑通再理解每一步。' },
    ],
    practice: '用 MNIST 或随机数据训练一个两层 MLP，跑 5 个 epoch 观察 loss 下降。',
    checklist: ['为什么要 zero_grad', 'loss.backward() 干嘛', 'lr 是什么'],
  },
  {
    id: 'dl-2',
    goal: '会保存/加载模型，做一次推理。',
    minutes: 90,
    teach: [
      { type: 'code', text: `torch.save(model.state_dict(), "model.pt")
model.load_state_dict(torch.load("model.pt"))
model.eval()
with torch.no_grad():
    pred = model(x)` },
      { type: 'p', text: '训完存权重，部署时 eval() 关 dropout、no_grad() 不算梯度省显存。' },
    ],
    practice: '把上一个模型存盘，重新加载后对一条新数据做预测，打印类别。',
    checklist: ['保存的是整个模型还是参数', 'eval() 干嘛', 'no_grad 为什么省显存'],
  },
  {
    id: 'dl-3',
    goal: '理解注意力机制直觉，会调用预训练模型。',
    minutes: 120,
    teach: [
      { type: 'p', text: 'Transformer 的核心是自注意力：每个词和句子里所有词算相关度，加权汇总。新手不用手搓 Transformer，会用 HuggingFace 预训练模型即可：from transformers import AutoModel, AutoTokenizer。' },
    ],
    practice: '用 transformers 加载一个开源中文模型，对一句话生成 embedding 向量。',
    checklist: ['自注意力在做什么', '预训练模型为什么好用', 'tokenizer 干嘛'],
  },

  // ==================== 大模型应用 ====================
  {
    id: 'llm-0',
    goal: '会写结构化、可评估的 Prompt。',
    minutes: 120,
    teach: [
      { type: 'code', text: `你是一个客服助手。请根据用户问题，只回答与订单相关的内容。
输出 JSON：{"answer": "...", "need_human": true/false}
用户问题：{user_input}` },
      { type: 'p', text: 'Prompt 三要素：角色、任务、输出格式。要 JSON 就明确给 schema，要稳定就给 1-2 个例子（few-shot）。每次改 Prompt 都要固定几条测试用例，看有没有变差。' },
    ],
    practice: '写一个“提取订单号”的 Prompt，要求只输出 JSON，测 5 个不同问题看稳定性。',
    checklist: ['few-shot 是什么', '怎么让大模型稳定输出 JSON', '怎么评估 Prompt 好坏'],
  },
  {
    id: 'llm-1',
    goal: '掌握文档切块与 Embedding 入库流程。',
    minutes: 120,
    teach: [
      { type: 'p', text: 'RAG 第一步：把文档按固定长度（如 500 token）+ 重叠（50 token）切块，每块用 Embedding 模型转成向量，连同原文一起存进向量库。切块太大检索不准，太小上下文不全。' },
    ],
    practice: '用一段长文档，按 500 字切块，打印有几块、每块前 30 字。',
    checklist: ['为什么要切块', '重叠为什么必要', '元数据（来源/标题）为什么要存'],
  },
  {
    id: 'llm-2',
    goal: '把“检索 → 拼 Prompt → 生成答案”跑通。',
    minutes: 150,
    teach: [
      { type: 'code', text: `# 伪代码
chunks = vector_db.search(question, top_k=3)
prompt = f"根据以下资料回答：{chunks}\n问题：{question}"
answer = llm.generate(prompt)` },
      { type: 'p', text: 'RAG 核心循环：问题向量化 → 向量库取 top_k 相关片段 → 拼进 Prompt → 让模型基于资料回答。引用来源就是把 chunks 的元数据一起返回。' },
    ],
    practice: '在「智答 · RAG 助手」项目阶段三完成这个问答链路，让它基于你给的文档回答。',
    checklist: ['RAG 解决什么问题', '为什么能减少幻觉', 'top_k 怎么调'],
  },
  {
    id: 'llm-3',
    goal: '理解 Function Calling / Agent 的基本模式。',
    minutes: 120,
    teach: [
      { type: 'p', text: 'Function Calling：你告诉模型“你有哪些工具（查天气/查订单）”，模型自己决定调用哪个、传什么参数，你的程序执行后把结果交回给模型继续。Agent 就是“模型-工具-模型”的循环。' },
    ],
    practice: '设计一个“查订单状态”工具：描述它的名字、参数、返回，让模型在用户问“我的订单到哪了”时调用它。',
    checklist: ['工具调用是谁决定调哪个', 'Agent 和单次问答区别', '循环怎么终止'],
  },

  // ==================== 模型部署 ====================
  {
    id: 'deploy-0',
    goal: '把模型包成一个 HTTP 推理服务。',
    minutes: 120,
    teach: [
      { type: 'p', text: '推理服务 = FastAPI 包装 predict：POST /predict 接收输入，模型在启动时加载一次（不要每次请求重新加载），GPU 上 batch 推理。' },
    ],
    practice: '把你训好的模型用 FastAPI 包成 /predict 接口，curl 测一次。',
    checklist: ['模型为什么启动时加载', '怎么看显存占用', 'batch 为什么快'],
  },
  {
    id: 'deploy-1',
    goal: '了解推理加速：vLLM、量化、批处理。',
    minutes: 90,
    teach: [
      { type: 'p', text: '大模型推理慢主要在“逐 token 生成”。vLLM 用 PagedAttention 把请求拼一起批处理；量化（INT8/INT4）把模型变小、显存降一半，精度略损。知道概念和为什么即可。' },
    ],
    practice: '在笔记里对比：同样一张卡，vLLM 比原生 transformers 快在哪（一句话）。',
    checklist: ['量化是什么', '连续批处理为什么提速', '显存瓶颈在哪'],
  },
  {
    id: 'deploy-2',
    goal: '知道上线后要监控哪些指标。',
    minutes: 60,
    teach: [
      { type: 'p', text: '三个核心：延迟（P95 响应时间）、吞吐（QPS）、效果（人工抽检/自动评测）。线上效果会随数据漂移变差，要有定期评测和回归。' },
    ],
    practice: '给你的推理服务加一个 /health 健康检查接口，返回当前是否正常、最近错误数。',
    checklist: ['P95 是什么', '为什么要监控效果', '数据漂移是什么'],
  },

  // ==================== Web 基础 ====================
  {
    id: 'web-0',
    goal: '用语义标签搭出页面骨架，用 Flex/Grid 布局。',
    minutes: 120,
    teach: [
      { type: 'code', text: `<header>页头</header>
<main>
  <article>正文</article>
</main>
<footer>页脚</footer>
/* 三栏布局 */
.layout { display: grid; grid-template-columns: 200px 1fr; }` },
      { type: 'p', text: '语义标签不是为了好看，是为了“屏幕阅读器和搜索引擎知道你是什么”。盒模型：content + padding + border + margin。Flex 一维，Grid 二维。' },
    ],
    practice: '手写一个个人主页：导航 + 左侧边栏 + 主内容 + 页脚，用 Grid 布局，不引任何框架。',
    checklist: ['盒模型组成', 'Flex 和 Grid 分别什么时候用', '语义标签有什么好处'],
  },
  {
    id: 'web-1',
    goal: '写响应式页面和简单交互。',
    minutes: 120,
    teach: [
      { type: 'code', text: `/* 手机单列，桌面两列 */
.card-list { display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) {
  .card-list { grid-template-columns: 1fr 1fr; }
}` },
      { type: 'p', text: '响应式 = 同一套代码在手机/桌面都好看。媒体查询是最基础手段。' },
    ],
    practice: '把上一课的个人主页改成响应式：手机上侧边栏变横向。',
    checklist: ['媒体查询写法', '移动端优先是什么意思', 'viewport 干什么'],
  },
  {
    id: 'web-2',
    goal: '会用 JS 操作 DOM、发请求、处理异步。',
    minutes: 150,
    teach: [
      { type: 'code', text: `document.querySelector("#btn").addEventListener("click", async () => {
  const r = await fetch("/api/data");
  const data = await r.json();
  document.querySelector("#out").textContent = JSON.stringify(data);
});` },
      { type: 'p', text: '三件事：选元素、监听事件、fetch 拿数据。async/await 让异步代码读起来像同步。' },
    ],
    practice: '做一个按钮：点击后 fetch 一个公开接口，把结果渲染成列表显示在页面上。',
    checklist: ['addEventListener 干嘛', 'async/await 解决什么', 'fetch 怎么处理错误'],
  },

  // ==================== Vue ====================
  {
    id: 'vue-0',
    goal: '掌握模板语法和指令。',
    minutes: 90,
    teach: [
      { type: 'code', text: `<template>
  <h2>{{ title }}</h2>
  <button v-if="show" @click="count++">点我 {{ count }}</button>
  <ul>
    <li v-for="item in list" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
<script setup>
import { ref } from 'vue'
const title = ref('你好')
const count = ref(0)
const list = ref([{id:1,name:'a'}])
</script>` },
      { type: 'p', text: 'Vue 3 用 <script setup> 写法。ref 包一个响应式变量，模板里自动解包。指令：v-if 显隐、v-for 列表、@事件、:属性。' },
    ],
    practice: '用 Vue SFC 写一个计数器 + 待办列表（添加/删除）。',
    checklist: ['ref 为什么要 .value', 'v-if 和 v-show 区别', ':key 为什么必要'],
  },
  {
    id: 'vue-1',
    goal: '组件化：props 入、emit 出、插槽。',
    minutes: 120,
    teach: [
      { type: 'code', text: `<!-- Child -->
<script setup>
const props = defineProps({ title: String })
const emit = defineEmits(['done'])
</script>
<!-- Parent 用 -->
<Child :title="t" @done="onDone" />` },
      { type: 'p', text: '组件是“自定义标签”。父传子用 props，子通知父用 emit。插槽 slot 让父能往子组件里塞内容。' },
    ],
    practice: '把待办列表拆成 TodoItem 子组件，父组件传 item、子组件 emit 删除事件。',
    checklist: ['props 和 emit 方向', 'slot 干嘛', '组件通信还有什么方式'],
  },
  {
    id: 'vue-2',
    goal: '接 Pinia 状态管理和 Vue Router。',
    minutes: 120,
    teach: [
      { type: 'p', text: '组件多了后，共享状态（登录用户、主题）放 Pinia，不用一层层传。Vue Router 管页面跳转，和后端路由一一对应。' },
    ],
    practice: '建一个最简 Vue 项目（npm create vite@latest），加两个页面路由和一个 Pinia store 存用户名。',
    checklist: ['Pinia 解决什么', '动态路由是什么', '路由懒加载'],
  },

  // ==================== React ====================
  {
    id: 'react-0',
    goal: '写函数组件、用 Props 传数据、理解 JSX。',
    minutes: 90,
    teach: [
      { type: 'code', text: `function Card({ title, children }) {
  return <div className="card"><h3>{title}</h3>{children}</div>
}
// 用：<Card title="订单 123">状态：待支付</Card>` },
      { type: 'p', text: '组件就是返回 UI 的函数。JSX 里写 className 而不是 class。Props 是函数参数，只读。this 类组件不用学，函数组件是现在主流。' },
    ],
    practice: '写一个 Button 组件，接收 variant 属性决定颜色，在父组件里用三次。',
    checklist: ['JSX 为什么用 className', 'Props 能改吗', 'children 是什么'],
  },
  {
    id: 'react-1',
    goal: '掌握 useState/useEffect 两个核心 Hook。',
    minutes: 120,
    teach: [
      { type: 'code', text: `const [count, setCount] = useState(0);
useEffect(() => {
  const t = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(t);
}, []);` },
      { type: 'p', text: 'useState 存会变的状态；useEffect 处理“渲染之外的事”（订阅、定时器、请求），返回函数是清理。依赖数组 [] 表示只在挂载后跑一次。' },
    ],
    practice: '写一个计数器：点按钮 +1；另写一个 useEffect 每秒更新当前时间显示。',
    checklist: ['useState 返回什么', 'useEffect 清理函数干嘛', '依赖数组什么时候写'],
  },
  {
    id: 'react-2',
    goal: '了解状态管理、路由和构建工具。',
    minutes: 90,
    teach: [
      { type: 'p', text: '小项目 useState 够用；大项目用 Zustand/Redux。路由用 React Router。工程用 Vite 构建——你现在看到的这个网站就是这个栈。' },
    ],
    practice: '浏览这个网站的侧边栏，思考：这是几个页面、用什么路由切的？不需要写代码。',
    checklist: ['什么时候需要全局状态', 'React Router 做什么', 'Vite 是什么'],
  },

  // ==================== 工程素养 ====================
  {
    id: 'review-0',
    goal: '让你的代码“别人看得懂”。',
    minutes: 60,
    teach: [
      { type: 'p', text: '命名见意（userCount 不要用 uc）；一个函数只做一件事，超过 20 行考虑拆；注释写“为什么”，不写“做了什么”（代码自己会说）。坏注释示例：// i 加 1。' },
    ],
    practice: '把你之前写的最长的一个函数读一遍，改名、拆分，提交一个 refactor commit。',
    checklist: ['什么时候该写注释', '函数多长该拆', '坏命名例子'],
  },
  {
    id: 'review-1',
    goal: '会写有价值的单元测试。',
    minutes: 120,
    teach: [
      { type: 'p', text: '测试三件事：正常输入、边界输入（0/空/超大）、异常输入。别测“代码怎么写的”，要测“行为是什么”。覆盖率不是目的，关键路径有测试才是。' },
    ],
    practice: '给一个计算折扣的函数写 3 个测试：正常、0 元、负价报错。',
    checklist: ['边界用例有哪些', '为什么不测实现细节', '覆盖率重要吗'],
  },
  {
    id: 'review-2',
    goal: '学会 Review 别人代码时给建设性意见。',
    minutes: 60,
    teach: [
      { type: 'p', text: 'Review 不是挑刺：先说“这段解决了什么”，再说“这里会不会有问题”。对事不对人，附建议方案（“要不改成 X？”）。' },
    ],
    practice: '找同学/网上的开源 PR，写下一条具体的 review 意见（带建议）。',
    checklist: ['review 的目的', '怎么说不伤人', '发现 bug 怎么提'],
  },

  // ==================== 技术文档 ====================
  {
    id: 'docs-0',
    goal: '把模糊需求拆成可验收的任务。',
    minutes: 90,
    teach: [
      { type: 'p', text: '用户故事模板：作为 X，我想 Y，以便 Z。验收标准（AC）： Given-When-Then 或可勾选项。关键是把“做一个订单系统”拆成“用户能创建订单/取消订单/看到订单状态”这种一条条可验收的事。' },
    ],
    practice: '把“做一个待办 App”拆成 5 条用户故事，每条写 3 条验收标准。',
    checklist: ['验收标准怎么写', '什么是边界', '模糊需求怎么追问'],
  },
  {
    id: 'docs-1',
    goal: '写一份技术方案：背景/方案/影响面/风险。',
    minutes: 90,
    teach: [
      { type: 'p', text: '技术方案四段式：① 背景（为什么要做）② 方案（怎么做，画个图）③ 影响面（改了哪些模块）④ 风险与回滚（出问题怎么办）。别上来就写代码，先写这段。' },
    ],
    practice: '给你在做的项目写一页技术方案（背景+方案图+风险），用 Markdown 存仓库 docs/ 目录。',
    checklist: ['方案文档四段式', '为什么要写风险', '图为什么重要'],
  },
  {
    id: 'docs-2',
    goal: '写一份有用的复盘：结论、数据、改进项。',
    minutes: 60,
    teach: [
      { type: 'p', text: '复盘三问：结果怎样（数据）、为什么（归因）、下次怎么做（action items，谁、什么时候）。不要写成流水账，也不要写成检讨会。' },
    ],
    practice: '在完成第一个项目阶段后，按“结果/归因/改进”写半页复盘。',
    checklist: ['复盘和总结区别', 'action item 要素', '怎么写归因不甩锅'],
  },

  // ==================== 敏捷协作 ====================
  {
    id: 'agile-0',
    goal: '理解迭代和站会节奏。',
    minutes: 60,
    teach: [
      { type: 'p', text: '敏捷不是“开会”，是“小步快跑”：一个迭代（1-2 周）做一批事，每天站会三句话——昨天做了什么、今天做什么、有什么卡住。看板上分 To Do/Doing/Done。' },
    ],
    practice: '把你本周的学习任务列成看板三列，每天更新一次 Doing。',
    checklist: ['站会三句话', '迭代多长合适', '看板分几列'],
  },
  {
    id: 'agile-1',
    goal: '把大目标拆成“2 天能做完”的小任务。',
    minutes: 60,
    teach: [
      { type: 'p', text: '拆任务的标准：能在一个迭代里完成、能演示、能验收。“学 Python”太大，“写一个带函数和文件读写的 score.py 并测通”才够小。' },
    ],
    practice: '把“学会数据分析”拆成 6 个可在一周内完成的小任务。',
    checklist: ['任务多大算合适', '怎么拆才算可验收', '怎么避免任务过大'],
  },
  {
    id: 'agile-2',
    goal: '会汇报进展和暴露风险。',
    minutes: 60,
    teach: [
      { type: 'p', text: '汇报公式：结论先行 + 数据支撑 + 下一步 + 风险求助。卡住不要硬扛三天——越早暴露越多人能帮。“我卡在 X，试了 A/B 不行，想找 Y 讨论”是专业的求助。' },
    ],
    practice: '用这个公式写一段 100 字的“本周学习进展汇报”发给自己。',
    checklist: ['结论为什么要先行', '什么时候该求助', '求助怎么说才专业'],
  },
];

export const LESSON_BY_ID: Record<string, ILesson> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l])
);

// 新手主线：0 基础小白按这个顺序学，学完就进项目
export const BEGINNER_TRACK: { skillId: string; stepIndex: number; why: string }[] = [
  { skillId: 'git', stepIndex: 0, why: '先学会版本管理，之后所有代码都能存' },
  { skillId: 'linux', stepIndex: 0, why: '命令行是工程师的日常工具' },
  { skillId: 'python', stepIndex: 0, why: '0 基础首选语言，语法友好' },
  { skillId: 'python', stepIndex: 1, why: '把脚本组织成像样的小工程' },
  { skillId: 'algo', stepIndex: 0, why: '笔试面试第一关' },
  { skillId: 'sql', stepIndex: 0, why: '后端/数据都要用' },
  { skillId: 'docs', stepIndex: 0, why: '进项目前先学会写需求' },
  { skillId: 'llm', stepIndex: 0, why: 'AI 时代必备的 Prompt 能力' },
];

// 进阶主线：新手主线毕业后走这条，冲能写完整后端/AI 服务的程度
export const ADVANCED_TRACK: { skillId: string; stepIndex: number; why: string }[] = [
  { skillId: 'sql', stepIndex: 1, why: 'JOIN + 索引，后端查数据必备' },
  { skillId: 'sql', stepIndex: 2, why: '事务与隔离级别，面试高频' },
  { skillId: 'java', stepIndex: 1, why: '面向对象与设计模式' },
  { skillId: 'spring', stepIndex: 0, why: 'IoC 与依赖注入' },
  { skillId: 'spring', stepIndex: 1, why: '写企业级 REST 接口' },
  { skillId: 'fastapi', stepIndex: 1, why: 'Python 也能快速出接口' },
  { skillId: 'docker', stepIndex: 0, why: '把服务打包成镜像' },
  { skillId: 'redis', stepIndex: 1, why: '缓存三大问题与方案' },
  { skillId: 'dist', stepIndex: 1, why: '消息队列：异步削峰解耦' },
  { skillId: 'llm', stepIndex: 2, why: '把 RAG 主循环跑通' },
  { skillId: 'deploy', stepIndex: 0, why: '把模型/服务包成推理 API' },
  { skillId: 'review', stepIndex: 1, why: '会写单元测试，代码才敢改' },
];

export interface ITrackItem {
  skillId: string;
  stepIndex: number;
  why: string;
}
export interface ISideTrack {
  id: string;
  name: string;
  blurb: string;
  items: ITrackItem[];
}
// 支线方向：按就业兴趣选一条深耕
export const SIDE_TRACKS: ISideTrack[] = [
  {
    id: 'frontend',
    name: '前端工程方向',
    blurb: '想做 Web 前端 / 全栈界面：HTML/CSS/JS → Vue/React → 工程化',
    items: [
      { skillId: 'web', stepIndex: 0, why: '语义标签与 Flex/Grid 布局' },
      { skillId: 'web', stepIndex: 2, why: 'DOM 操作与 fetch 异步' },
      { skillId: 'vue', stepIndex: 0, why: 'Vue3 模板与响应式' },
      { skillId: 'vue', stepIndex: 1, why: '组件化 props/emit' },
      { skillId: 'react', stepIndex: 0, why: 'JSX 与组件' },
      { skillId: 'react', stepIndex: 1, why: 'useState/useEffect' },
    ],
  },
  {
    id: 'data',
    name: '数据分析方向',
    blurb: '想做数据分析师 / 数据挖掘：Pandas → 可视化 → 建模',
    items: [
      { skillId: 'ds', stepIndex: 0, why: 'Numpy 向量化计算' },
      { skillId: 'ds', stepIndex: 1, why: 'Pandas 清洗与 groupby' },
      { skillId: 'ds', stepIndex: 2, why: '用图表讲清结论' },
      { skillId: 'sql', stepIndex: 0, why: '复杂查询与聚合' },
      { skillId: 'ml', stepIndex: 0, why: '特征工程' },
      { skillId: 'ml', stepIndex: 1, why: '树模型与 baseline' },
    ],
  },
  {
    id: 'ai',
    name: 'AI 应用方向',
    blurb: '想做大模型应用 / Agent：Prompt → RAG → 推理部署',
    items: [
      { skillId: 'llm', stepIndex: 0, why: '结构化 Prompt' },
      { skillId: 'llm', stepIndex: 1, why: '文档切块与向量化入库' },
      { skillId: 'llm', stepIndex: 2, why: 'RAG 主循环' },
      { skillId: 'vector', stepIndex: 0, why: 'Embedding 与相似度' },
      { skillId: 'dl', stepIndex: 0, why: 'Tensor 与数据加载' },
      { skillId: 'deploy', stepIndex: 0, why: '模型包成推理服务' },
    ],
  },
  {
    id: 'algo',
    name: '算法竞赛方向',
    blurb: '想刷 LeetCode / 打 ACM：复杂度 → 数据结构 → DP',
    items: [
      { skillId: 'algo', stepIndex: 0, why: '复杂度与基础结构' },
      { skillId: 'algo', stepIndex: 1, why: '哈希表与双指针' },
      { skillId: 'algo', stepIndex: 2, why: 'DFS/BFS 与树' },
      { skillId: 'algo', stepIndex: 3, why: '动态规划' },
      { skillId: 'cpp', stepIndex: 0, why: '指针与内存' },
      { skillId: 'cpp', stepIndex: 1, why: 'STL 与编译' },
    ],
  },
];