// 宝典式专项深讲：从「正式定义 → 固定语法 → 可变部分 → 带运行结果的递进示例 → 坑 → 实战搭配」。
// key = lessonId。目标是像字典一样：知道它是什么，更知道怎么和别的零件拼起来用、拼完出什么结果。
import type { ILessonDeepDive } from './types';

export const LESSON_DEEP_DIVES: Record<string, ILessonDeepDive[]> = {
  // ============ Python ============
  'python-0': [
    {
      id: 'py0-indent',
      point: '缩进：为什么它就是代码块，怎么和 if/for/函数配合',
      formalDef:
        '在 Python 中，缩进（一行开头的空白）不是排版习惯，而是语法的一部分：它决定「哪些行从属于上一行」。同一层逻辑必须用相同数量的空格（规范是 4 个）。',
      fixed: `if 条件:        ← 这行末尾有冒号 :，表示“下面要开一个块”
    属于 if 的行   ← 缩进 4 个空格
    属于 if 的行   ← 必须和上一行缩进一致`,
      variable:
        '冒号后面的“条件”是可变的（True/False、比较表达式、变量）；缩进的行数是可变的。但“冒号 + 下一行必须缩进”这个规则是固定的。',
      examples: [
        {
          code: `age = 20
if age >= 18:
    print("成年")
    print("可以进入")
print("永远执行")`,
          output: `成年
可以进入
永远执行`,
          note: '前两行缩进了，属于 if；第三行顶格，不属于 if。',
        },
        {
          code: `for i in [1, 2, 3]:
    print(i * 10)
print("循环结束")`,
          output: `10
20
30
循环结束`,
          note: 'for 同样靠缩进圈定循环体。',
        },
      ],
      rookie:
        '把 if 下一行顶格写、或缩进数不一致 → 报 IndentationError。看到这个错就去数缩进；Tab 和空格不要混用。',
      realWorld: '真实代码缩进层层嵌套：if 里套 for，for 里套 if，每深一层多缩进 4 空格。',
    },
    {
      id: 'py0-list-dict',
      point: 'list 与 dict：什么时候用哪个，放进去怎么取出来',
      formalDef:
        'list 是有顺序、可重复的一列值，用序号（从 0 开始）取；dict 是键值对集合，用“键”这个名字取对应的值。',
      fixed: `列表:  [值1, 值2, 值3]          取值:  列表[序号]
字典:  {"键1": 值1, "键2": 值2}   取值:  字典["键"]`,
      variable: '方括号/大括号里能放什么都可变。list 用 append() 加；dict 用 字典[新键]=新值 加。',
      examples: [
        {
          code: `names = ["张三", "李四", "王五"]
print(names[0], names[1])
names.append("赵六")`,
          output: `张三 李四
['张三', '李四', '王五', '赵六']`,
          note: '序号从 0 开始。append 永远加在最后。',
        },
        {
          code: `rows = [
    {"name": "张三", "score": 90},
    {"name": "李四", "score": 55},
]
for r in rows:
    print(r["name"], r["score"])`,
          output: `张三 90
李四 55`,
          note: '接口返回的 JSON 基本都是 list[dict]。',
        },
      ],
      rookie: '用 dict 时键没加引号会被当成变量名；list 下标别越界。',
      realWorld: '一群同类东西用 list；一个东西的多个属性用 dict。list[dict] 是 90% 业务数据的形状。',
    },
    {
      id: 'py0-function',
      point: '函数：def 是怎么把“一段操作”打包成可调用的盒子',
      formalDef:
        '函数是一段有名字的、可重复执行的代码块。调用它的名字时把输入传进去，它按步骤跑完并把结果交出来（return）。',
      fixed: `def 函数名(参数1, 参数2):
    ...做一些事...
    return 结果       ← 没有 return 就返回 None
调用:  函数名(值1, 值2)`,
      variable: '函数名、参数个数、里面做的事都可变；固定的是 def 骨架 + return。',
      examples: [
        {
          code: `def add(a, b):
    return a + b
print(add(3, 5), add(100, 2))`,
          output: `8 102`,
          note: '调用时 3 进 a、5 进 b，return 把结果送出来。',
        },
        {
          code: `def greet(name="同学"):
    return "你好，" + name
print(greet(), greet("小明"))`,
          output: `你好，同学
你好，小明`,
          note: '传了就用传的，没传就用默认值。',
        },
      ],
      rookie: '写了 def 却忘写 return → 返回 None；调用漏括号 add() 才会执行。',
      realWorld: '真实项目把读文件/清洗/统计/导出各写成一个函数，主程序按顺序调用。',
    },
    {
      id: 'py0-file',
      point: 'with open：为什么读文件不用手动 close',
      formalDef:
        'with open(路径, 模式) as f 会在离开缩进块时自动关闭文件。"r" 读、"w" 写、"a" 追加，中途报错也会自动关。',
      fixed: `with open("a.txt", "r", encoding="utf-8") as f:
    text = f.read()
# 离开这里文件已自动关闭`,
      variable: '路径、模式、读完后怎么处理都可变；with...as... 这套固定。',
      examples: [
        {
          code: `with open("result.txt", "w", encoding="utf-8") as f:
    f.write("平均分：80.0\\n")
print("已写入")`,
          output: `已写入
# result.txt：平均分：80.0`,
          note: '"w" 覆盖旧文件；"a" 追加。encoding 必须 utf-8，否则中文乱码。',
        },
      ],
      rookie: '不写 encoding="utf-8" 在 Windows 读中文乱码；用 "w" 前确认别覆盖重要文件。',
      realWorld: '数据脚本第一步读 CSV、最后一步写结果，with open 每天都用。',
    },
    {
      id: 'py0-try',
      point: 'try/except：出错时不让程序直接崩',
      formalDef:
        'try 里放可能出错的代码，except 捕获指定错误，程序不崩，按你写的方式处理。不要裸 except。',
      fixed: `try:
    可能出错的代码
except 错误类型:
    出错后怎么办`,
      variable: 'try 里放什么、捕获什么错误都可变。',
      examples: [
        {
          code: `try:
    n = int("abc")
except ValueError:
    print("不是数字，按 0 处理")
    n = 0
print(n)`,
          output: `不是数字，按 0 处理
0`,
          note: 'int("abc") 抛 ValueError 被接住，程序继续。',
        },
      ],
      rookie: '裸 except: 会吞掉所有错误，排查不到问题。只 except 你预期的错误。',
      realWorld: '调接口、读文件、解析 JSON 都要 try/except，否则一个坏数据搞崩整批处理。',
    },
  ],

  'python-1': [
    {
      id: 'py1-self',
      point: '类与 self：__init__ 里那些 self.xxx 到底存了什么',
      formalDef:
        '类是造对象的模具。__init__ 是造对象时自动执行的初始化；self 代表“这个对象自己”，self.xxx 把传入数据贴到对象身上，以后一直记着。',
      fixed: `class 类名:
    def __init__(self, 参数...):
        self.属性 = 参数
造对象:  对象 = 类名(参数...)   访问:  对象.属性`,
      variable: '类名、属性、__init__ 接几个参数都可变；固定的是第一个参数永远写 self。',
      examples: [
        {
          code: `class Order:
    def __init__(self, oid, amount):
        self.oid = oid
        self.amount = amount
a = Order("A1", 200); b = Order("A2", 500)
print(a.oid, a.amount, b.oid, b.amount)`,
          output: `A1 200 A2 500`,
          note: 'a、b 各自记着自己的数据，互不干扰。',
        },
      ],
      rookie: '方法里想用自己的数据却漏写 self. → 取不到值。永远记住用对象自己的数据要加 self.。',
      realWorld: 'Django 模型、ORM 一条记录，都是“一个对象存一行字段”。',
    },
    {
      id: 'py1-venv',
      point: '虚拟环境：为什么每个项目都要单独建一个',
      formalDef:
        'venv 是给某个项目专属的、独立的 Python 安装目录。不同项目装不同版本的包互不影响。',
      fixed: `python -m venv .venv
.venv\\Scripts\\activate.ps1        # 激活（命令行前出现 (.venv)）
pip install 包名
pip freeze > requirements.txt`,
      variable: '箱子名、装哪些包都可变；固定流程是建一次→每终端先激活→再装→导出清单。',
      examples: [
        {
          code: `# 别人拿到你的项目：
python -m venv .venv
.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt`,
          output: `# 一键装齐一模一样的环境`,
          note: 'requirements.txt 就是依赖清单。',
        },
      ],
      rookie: '没激活就 pip install，包装到系统全局，项目 import 不到。',
      realWorld: '一个项目一个 venv + requirements.txt 是协作基本卫生。',
    },
    {
      id: 'py1-main',
      point: 'if __name__ == "__main__"：一个词一个词拆给你看',
      formalDef:
        '先把每个零件拆开：① .py 文件就是一个装着 Python 代码的记事本，文件名叫 report.py；② “运行 report.py” 就是让 Python 从上到下把这个文件里的代码执行一遍；③ import report 是把别的文件 report.py 里的函数“借过来用”，借的那一刻 Python 也会把 report.py 从上到下执行一遍；④ __name__ 是 Python 自动给每个文件准备好的一个内置变量——当这个文件是“被直接运行的那个”时，__name__ 的值就等于字符串 "__main__"；当它是“被别人 import 的”时，__name__ 等于它自己的文件名 report。⑤ if __name__ == "__main__": 这一句就是在问：“现在是不是我本人被直接运行？”——是的话才执行下面的代码，只是被别人 import 时就不执行。',
      fixed: `report.py 这个文件里写：
def run():
    print("跑分析")

if __name__ == "__main__":   ← 问：现在是直接运行本文件吗？
    run()                     ← 是的话才跑这行`,
      variable:
        'if 下面调用哪个函数（main/run）可变；上面那串 if __name__... 照抄别动，它就是个“开关”。',
      examples: [
        {
          code: `# 情况一：直接运行这个文件
# 命令行里敲：python report.py
# Python 把 report.py 从顶读到底：
#   def run() 只是“登记”一个函数，不打印
#   走到 if：__name__ 现在等于 "__main__" → 条件成立
#   于是执行 run()`,
          output: `跑分析`,
          note: '你自己运行这个文件时走这条路径，所以能看到结果。',
        },
        {
          code: `# 情况二：在另一个文件 main.py 里 import 它
# main.py 写：
import report
print("main 开始")
# 然后运行：python main.py`,
          output: `跑分析      ← import 的那一刻 report.py 被读了一遍
main 开始`,
          note: '有了 if 那行后，report.py 里 run() 被 if 挡住，import 时不会自动跑；只有 main.py 主动 report.run() 时才跑。',
        },
        {
          code: `# 想亲眼看看 __name__ 是什么，在 report.py 最上面加一句：
print("现在 __name__ =", __name__)`,
          output: `# python report.py：
# 现在 __name__ = __main__
# 被 main.py import 时：
# 现在 __name__ = report`,
          note: '同一个文件、两种运行方式下 __name__ 的值不一样，这行开关就是靠这个值工作的。',
        },
      ],
      rookie:
        '把会立刻执行的代码（如 print("开始")）直接写在文件顶层、不加 if 这行——别人 import 你的文件时它会莫名其妙自动跑。把启动代码放进 if __name__ 里，就能被 import 而不自动执行。',
      realWorld:
        '每个可独立运行的脚本底部都有这行：既能被别的文件 import 复用函数，又能单独跑起来。',
    },
    {
      id: 'py1-typehint',
      point: '类型注解：def average(scores: list[float]) -> float 每个符号都讲',
      formalDef:
        '逐块拆：def 是“定义函数”的关键字；average 是函数名；( ) 里放参数；scores 是参数名；冒号后的 list[float] 是提示——告诉读代码的人和编辑器：scores 是“装浮点数的 list”；) -> float 再提示：函数算完会返回一个浮点数。它只是提示，Python 运行时不强制检查，但团队都写，方便别人一眼看懂。',
      fixed: `def 函数名(参数名: 参数类型提示) -> 返回值类型提示:
    return 结果

例子:
def average(scores: list[float]) -> float:
    return sum(scores) / len(scores)`,
      variable:
        '函数名、参数名、类型名（int/str/list/你自己的类）都能换；冒号提示类型、箭头提示返回值这套写法固定。',
      examples: [
        {
          code: `# 逐字读这一行：
def average(scores: list[float]) -> float:
# │   │       │      │         │        │
# │   │       │      │         │        └─ 返回一个 float
# │   │       │      │         └─ “是浮点数”
# │   │       │      └─ “一个 list”
# │   │       └─ 参数名叫 scores
# │   └─ 函数名叫 average
# └─ 定义函数`,
          output: `# 调用 average([90.5, 80.0, 70.5])
# sum=241.0, len=3 → 返回 80.333...（一个 float）`,
          note: 'list[float] 读作“装 float 的列表”；换成 list[int] 就是装整数的列表。',
        },
        {
          code: `# 再看两个常见写法
def add(a: int, b: int) -> int:      # 两个整数，返回整数
    return a + b
name: str = "小明"                    # 变量也能提示：name 是字符串`,
          output: `# add(3, 5) 返回 8（int）
# 编辑器看到 add 会提示“要传两个整数”`,
          note: '变量后面也能写 : 类型，和函数参数是同一个冒号语法。',
        },
      ],
      rookie:
        '以为写了类型 Python 就会强制检查——不会，运行时不看它；要严格检查得另装 mypy。',
      realWorld:
        '读别人的项目全靠这些提示猜参数该传什么；面试常问“为什么用类型注解”——答案是可读性 + 编辑器提示 + 重构安全。',
    },
    {
      id: 'py1-import',
      point: 'import 到底在干嘛：怎么用别人写好的现成代码',
      formalDef:
        '你自己写的函数只能在自己文件里用。想用到别人写好的（Python 自带的、或装来的）工具，就用 import 把那个“工具箱”搬进来。import requests 之后，requests.get 就是在调用 requests 这个工具箱里的 get 工具。',
      fixed: `import 工具箱名              # 整个搬进来，用 工具箱名.功能()
from 工具箱 import 某个功能  # 只搬一个功能，直接用 某个功能()`,
      variable: '搬哪个工具箱、用哪个功能都可变。',
      examples: [
        {
          code: `import math            # 搬 Python 自带的数学工具箱
print(math.sqrt(16))    # math.根号(16)`,
          output: `4.0`,
          note: 'math 是工具箱名，sqrt 是里面的工具，中间用点 . 连接。',
        },
        {
          code: `from math import sqrt   # 只搬 sqrt 这一个工具
print(sqrt(16))          # 就不用再写 math. 了`,
          output: `4.0`,
          note: '两种写法效果一样，看团队习惯。',
        },
      ],
      rookie: '忘了 import 就直接用 requests.get → NameError: 名字没定义。凡是没在本文件定义的名字，都得先 import。',
      realWorld: '爬虫要 import requests，画图要 import matplotlib，数据分析要 import pandas——第一步永远是先 import 工具箱。',
    },
  ],

  'python-2': [
    {
      id: 'py2-http',
      point: 'requests.get：从网址拿数据的固定套路',
      formalDef:
        'requests.get(url) 发 HTTP 请求，返回 Response 对象。r.status_code 看成功与否，r.json() 把 JSON 自动转成 dict/list。',
      fixed: `import requests
r = requests.get(url, params={...}, timeout=10)
data = r.json()
data["字段名"]`,
      variable: 'url、params、关注哪些字段都可变；固定是 get + timeout + 判状态码 + json()。',
      examples: [
        {
          code: `r = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
print(r.status_code)
print(r.json()["stargazers_count"])`,
          output: `200
60000+`,
          note: '200 成功；.json() 后 data 就是普通 dict。',
        },
      ],
      rookie: '不加 timeout 服务器卡死程序一直挂；不判状态码就 .json()，404/500 会抛错。',
      realWorld: '爬虫、调接口、拉数据全是：get→判断→json()→循环取字段。',
    },
    {
      id: 'py2-token',
      point: 'Token 与环境变量：密钥为什么不能写死',
      formalDef:
        '调需要登录的接口把 Token 放进请求头 Authorization。Token 是密码级东西，不能写进代码（push 到 GitHub 就泄露），要放环境变量。',
      fixed: `import os, requests
token = os.getenv("MY_TOKEN")
r = requests.get(url, headers={"Authorization": f"Bearer {token}"}, timeout=10)`,
      variable: 'Token 名、url 可变；固定是从环境变量读 + 放进 Authorization 头。',
      examples: [
        {
          code: `# 终端设:  $env:MY_TOKEN="abc123"
token = os.getenv("MY_TOKEN")
print("Token 长度:", len(token))`,
          output: `Token 长度: 6`,
          note: '换电脑/部署改环境变量即可，代码不动。',
        },
      ],
      rookie: 'token = "sk-xxx" 写进代码并 push 到 GitHub，等于把家门钥匙贴门外。',
      realWorld: '公司内网接口、OpenAI、各类 SaaS API 都用这一套，.gitignore 忽略 .env。',
    },
  ],

  'python-3': [
    {
      id: 'py3-loop',
      point: '真实工作的循环：卡住 → 报错 → 查文档 → 修好',
      formalDef:
        '写项目不是一次写对，而是“跑一下→看错在哪→改→再跑”的循环。会读报错、会搜索、敢小步改，比“会背语法”更重要。',
      fixed: `1. 跑一下看完整报错（最后一行 + 自己文件的行号）
2. 复制报错关键句去搜索 / 问 AI
3. 小步修改，改一处跑一次`,
      variable: '具体报错每次不同；这个排错流程固定。',
      examples: [
        {
          code: `KeyError: 'user_name'
# 排查：data 里到底有什么键
print(list(data.keys()))`,
          output: `['username', 'age']   ← 是 username 不是 user_name`,
          note: '打印真实键名，立刻发现自己拼错了。',
        },
      ],
      rookie: '一报错就整段重写、或瞎改十处，越改越乱。一次只改一处、跑一次。',
      realWorld: '资深工程师 80% 时间在排错，这正是项目实战要练的肌肉记忆。',
    },
  ],

  // ============ Java ============
  'java-0': [
    {
      id: 'java0-main',
      point: 'public static void main：为什么每个程序都要抄这一长串',
      formalDef:
        'Java 规定一个文件一个 public 类且文件名同名；JVM 启动第一个找 main；static 表示不用 new 对象就能直接跑——刚启动还没有任何对象。',
      fixed: `public class 类名 {
    public static void main(String[] args) {
        System.out.println("开始");
    }
}`,
      variable: '类名、大括号里写什么可变；main 这行照抄。',
      examples: [
        {
          code: `// 文件必须叫 Cart.java
public class Cart {
    public static void main(String[] args) {
        System.out.println("合计：" + 100);
    }
}`,
          output: `合计：100`,
          note: '文件名和 public class 大小写必须一致。',
        },
      ],
      rookie: '文件名和类名大小写不一致、漏分号，编译报错。从第一个错误往下改。',
      realWorld: '真实 Spring Boot 里 main 藏在框架里，但这是理解“程序从哪开始”的起点。',
    },
    {
      id: 'java0-collection',
      point: 'List / Map / Set：Java 集合三兄弟什么时候用',
      formalDef:
        'List 有序可重复（ArrayList）、Set 不重复（HashSet）、Map 键值对（HashMap）。对应 Python 的 list、set、dict。',
      fixed: `List<String> a = new ArrayList<>();     a.add("书"); a.get(0);
Map<String,Integer> m = new HashMap<>(); m.put("书", 30); m.get("书");
Set<String> s = new HashSet<>();          s.add("a");`,
      variable: '装什么类型、加什么元素都可变。',
      examples: [
        {
          code: `Map<String,Integer> price = new HashMap<>();
price.put("书", 30); price.put("笔", 5);
int total = price.get("书") + price.get("笔");
System.out.println(total);`,
          output: `35`,
          note: 'put 存、get 取，键不存在 get 返回 null。',
        },
      ],
      rookie: '== 比对象比的是地址，内容比较用 equals()。',
      realWorld: '订单列表用 List、商品价格表用 Map、去重用 Set。',
    },
    {
      id: 'java0-trycatch',
      point: 'try-catch：异常怎么接住',
      formalDef:
        'try 放可能出错的代码，catch 捕获并处理，finally 不管出不出错都执行（常用来关资源）。',
      fixed: `try {
    可能抛异常的代码
} catch (Exception e) {
    e.printStackTrace();
}`,
      variable: 'catch 什么异常、怎么处理都可变。',
      examples: [
        {
          code: `try {
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("除零了");
}`,
          output: `除零了`,
          note: '10/0 抛 ArithmeticException 被接住，程序继续。',
        },
      ],
      rookie: 'catch 只打印却不处理，等于没接；生产别把堆栈直接抛给用户。',
      realWorld: '文件读写、网络请求、数据库操作都要 try-catch 或向上抛。',
    },
  ],

  'java-1': [
    {
      id: 'java1-interface',
      point: '接口与多态：为什么面向接口而不是面向实现',
      formalDef:
        '接口只定义“能做什么”，不管怎么做。多个类实现同一接口，调用方只认接口，换实现不用改调用代码。',
      fixed: `interface Pay { void pay(int yuan); }
class WxPay implements Pay { ... }
Pay p = new WxPay();   // 左边接口，右边实现
p.pay(100);`,
      variable: '接口名、实现类、具体逻辑都可变；固定是“左边写接口，右边 new 实现”。',
      examples: [
        {
          code: `Pay p = new WxPay(); p.pay(100);
p = new AliPay();     // 换实现，调用代码不变
p.pay(100);`,
          output: `微信付100
支付宝付100`,
          note: '业务层只依赖 Pay，今天微信明天支付宝都不用改它。',
        },
      ],
      rookie: '变量类型写具体类 WxPay p = new WxPay()，就失去多态，换实现要到处改。',
      realWorld: 'Spring 大量功能建立在面向接口上，面试必问。',
    },
    {
      id: 'java1-strategy',
      point: '策略模式：把“会变的那部分”抽成接口',
      formalDef:
        '把算法/行为抽成接口，运行时传入不同实现。满减、打折就是两个折扣策略，计算总价时选一个。',
      fixed: `interface Discount { double apply(double price); }
class PercentOff implements Discount { ... }
double final = discount.apply(price);`,
      variable: '有几种策略就写几个实现；新增策略不改老代码。',
      examples: [
        {
          code: `Discount d = new PercentOff(0.8);
System.out.println(d.apply(100));`,
          output: `80.0`,
          note: '同一个 apply()，传不同实现结果不同。',
        },
      ],
      rookie: '用一大堆 if-else 判断“满减还是打折”，每加一种促销就改主逻辑。',
      realWorld: '支付方式、计价规则、消息渠道都是策略模式。',
    },
  ],

  'java-2': [
    {
      id: 'java2-pool',
      point: '线程池：为什么不要每次 new Thread',
      formalDef:
        'new Thread 每次新建线程开销大且数量失控。线程池预先建好一批线程复用，submit 任务排队执行。',
      fixed: `ExecutorService pool = Executors.newFixedThreadPool(8);
pool.submit(() -> 任务());
pool.shutdown();`,
      variable: '池大小、任务内容都可变；submit + shutdown 固定。',
      examples: [
        {
          code: `ExecutorService pool = Executors.newFixedThreadPool(8);
for (int i = 0; i < 10; i++) {
    pool.submit(() -> System.out.println(Thread.currentThread().getName()));
}
pool.shutdown();`,
          output: `pool-1-thread-1 ...（8 个线程轮流跑 10 个任务）`,
          note: '线程复用，不为每个任务都新开线程。',
        },
      ],
      rookie: '自己 new Thread 几百个把机器压垮；生产用 ThreadPoolExecutor 显式设参数。',
      realWorld: 'Web 服务器处理每个请求就靠线程池。',
    },
    {
      id: 'java2-gc',
      point: 'JVM 堆与栈：GC 到底在回收什么',
      formalDef:
        'new 出来的对象在堆上（GC 自动回收）；方法调用的局部变量在栈上（方法结束自动弹）。别在循环里疯狂 new 大对象。',
      fixed: `# 面试记三句：
堆 = 存对象，GC 管
栈 = 方法调用栈，局部变量
方法区 = 类信息`,
      variable: '写业务时基本不用手动管内存。',
      examples: [
        {
          code: `for (int i = 0; i < 1_000_000; i++) {
    String s = new String("x");
}`,
          output: `# 每秒产生大量临时对象，GC 频繁，程序变慢`,
          note: '能用常量就别 new。',
        },
      ],
      rookie: '以为 Java 不用管内存就可以随便 new——GC 也有成本。',
      realWorld: '线上 GC 频繁导致卡顿，靠 jstat/jmap 分析，是高级面试点。',
    },
  ],

  'java-3': [
    {
      id: 'java3-springboot',
      point: 'Spring Boot 第一个接口：加个注解就能被访问',
      formalDef:
        'Spring Boot 帮你把 Web 服务器、路由都配好。写一个 @RestController 类，方法上加 @GetMapping，启动后用 http 就能调用。',
      fixed: `@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() { return "hi"; }
}
# 访问 http://localhost:8080/hello`,
      variable: '路径、返回内容可变。',
      examples: [
        {
          code: `curl http://localhost:8080/hello`,
          output: `hi`,
          note: 'curl 是命令行发请求的工具，测接口最快。',
        },
      ],
      rookie: '写完接口不启动主类、或端口被占用，curl 不通。先确认应用真起来了。',
      realWorld: '企业后端 90% 是 Spring Boot，一个 @RestController 就是一组接口。',
    },
  ],

  // ============ C++ ============
  'cpp-0': [
    {
      id: 'cpp0-compile',
      point: '编译：g++ 这一步到底在干嘛',
      formalDef:
        'Python 边读边跑；C++ 先用 g++ 把 .cpp 翻译成机器直接执行的 .exe，以后跑那个 .exe 所以快。',
      fixed: `g++ 源码.cpp -o 产物.exe
./产物.exe`,
      variable: '源码名、产物名可变；先编译再运行固定。',
      examples: [
        {
          code: `g++ hello.cpp -o hello.exe
./hello.exe`,
          output: `你好，世界`,
          note: '改了代码必须重新 g++，再跑才是新结果。',
        },
      ],
      rookie: '改完直接跑旧 .exe，发现“没变”——忘了重新编译。',
      realWorld: '面试手写算法用 C++ 因为快；大型工程用 CMake，底层就是 g++。',
    },
    {
      id: 'cpp0-ptr',
      point: '指针与引用：* 和 & 到底指什么',
      formalDef:
        '指针存的是地址：int* p = &a 表示 p 里存着 a 的地址，*p 就是 a 本身。引用 int& r = a 是 a 的别名。',
      fixed: `int a = 10;
int* p = &a;   // &a 取地址
*p = 20;       // *p 解引用，改的是 a`,
      variable: '变量名可变；& 取地址、* 解引用 这两个用法固定。',
      examples: [
        {
          code: `int a = 10;
int* p = &a;
*p = 20;
cout << a;`,
          output: `20`,
          note: '改 *p 等于改 a，因为 p 指向 a。',
        },
      ],
      rookie: '把 * 和 & 的两种含义搞混：声明里 int* p 的 * 表示“这是指针”，代码里 *p 的 * 表示“解引用”。',
      realWorld: '数组传参、链表树节点都靠指针；现代 C++ 用智能指针自动管理。',
    },
    {
      id: 'cpp0-new',
      point: 'new / delete：堆内存为什么要配对',
      formalDef:
        '栈上变量函数结束自动释放；new 出来的在堆上，必须手动 delete 配对。数组 new[] 就要 delete[]。',
      fixed: `int* arr = new int[5];
arr[0] = 1;
delete[] arr;            // 必须配对`,
      variable: '开多大数组可变；new[] 和 delete[] 必须成对。',
      examples: [
        {
          code: `int* p = new int(10);
cout << *p;
delete p;`,
          output: `10`,
          note: '单个 new 配 delete，数组 new[] 配 delete[]，写错是未定义行为。',
        },
      ],
      rookie: 'new[] 却 delete（不带[]）、delete 后继续用（野指针）、数组越界，是 C++ 三大经典 bug。',
      realWorld: '竞赛里手动 new/delete 足够；工程里用 unique_ptr 让编译器自动释放。',
    },
  ],

  'cpp-1': [
    {
      id: 'cpp1-vector',
      point: 'STL vector / sort：别自己造轮子',
      formalDef:
        'vector 是变长数组，自动扩容；algorithm 里的 sort/find 直接用，不要手写排序。',
      fixed: `#include <vector>
#include <algorithm>
vector<int> v = {3,1,4,1,5};
sort(v.begin(), v.end());                       // 升序
sort(v.begin(), v.end(), greater<int>());       // 降序`,
      variable: '装什么类型、排什么都可变。',
      examples: [
        {
          code: `vector<int> v = {3,1,4,1,5};
sort(v.begin(), v.end());
for (int x : v) cout << x << " ";`,
          output: `1 1 3 4 5`,
          note: 'sort 默认升序；加 greater<int>() 变降序。',
        },
      ],
      rookie: '自己手写冒泡/快排浪费时间还容易错——比赛和工作都直接调 sort。',
      realWorld: '90% 算法题排序去重都靠 STL：sort + unique + erase 三连。',
    },
  ],

  'cpp-2': [
    {
      id: 'cpp2-asan',
      point: '编译选项：-g、-O2、-fsanitize=address',
      formalDef:
        '-g 生成调试信息配 gdb；-O2 优化让程序变快；-fsanitize=address 自动检查越界/内存错误，查 bug 神器。',
      fixed: `g++ main.cpp -o main -std=c++17 -O2           # 交题用
g++ main.cpp -o main -std=c++17 -g -fsanitize=address  # 查 bug 用`,
      variable: '文件名可变；这两组选项背下来即可。',
      examples: [
        {
          code: `int* a = new int[3];
a[10] = 1;   // 越界`,
          output: `==ERROR: AddressSanitizer: stack-buffer-overflow ...
# 还直接告诉你是第几行`,
          note: '肉眼难找的越界，ASan 一跑就报出行号。',
        },
      ],
      rookie: 'O2 优化下未定义行为可能“有时对有时错”，别靠运气，先开 ASan 查干净。',
      realWorld: '竞赛和工程都用：O2 交题，ASan 调试，gdb 单步。',
    },
  ],

  'cpp-3': [
    {
      id: 'cpp3-ds',
      point: '栈 / 队列 / 优先队列：什么时候用哪个',
      formalDef:
        '栈后进先出（括号匹配、DFS）；队列先进先出（BFS）；优先队列每次弹出最大/最小元素（Top-K）。',
      fixed: `stack<int> st;       st.push(x); st.top(); st.pop();
queue<int> q;        q.push(x);  q.front(); q.pop();
priority_queue<int> pq;   // 默认大顶堆`,
      variable: '装什么类型、做什么题可变。',
      examples: [
        {
          code: `priority_queue<int> pq;
pq.push(3); pq.push(1); pq.push(5);
cout << pq.top(); pq.pop();
cout << pq.top();`,
          output: `53`,
          note: '默认大顶堆：每次 top() 都是当前最大的。要最小用 greater<int>。',
        },
      ],
      rookie: '要“最小”却用了默认大顶堆，结果反过来。',
      realWorld: 'Top-K、任务调度、Dijkstra 最短路都靠优先队列。',
    },
  ],

  // ============ Go ============
  'go-0': [
    {
      id: 'go0-goroutine',
      point: 'goroutine 与 channel：Go 的并发模型',
      formalDef:
        'go f() 启动一个极轻量协程；channel 用来在协程间传数据。口号：不要通过共享内存通信，要通过通信共享内存。',
      fixed: `ch := make(chan string, 3)
go func() { ch <- "结果" }()
msg := <-ch`,
      variable: '传什么类型、起几个协程都可变。',
      examples: [
        {
          code: `ch := make(chan string, 2)
go func(){ ch <- "a" }()
go func(){ ch <- "b" }()
fmt.Println(<-ch, <-ch)`,
          output: `a b`,
          note: '两个协程并行跑，主协程从 channel 收两个结果。',
        },
      ],
      rookie: '无缓冲 channel 发送和接收必须同时就绪，否则死锁。先写带缓冲 make(chan T, n)。',
      realWorld: '高并发后端用 goroutine 同时处理几百上千请求，比 Java 线程省资源。',
    },
  ],

  'go-1': [
    {
      id: 'go1-http',
      point: 'net/http：标准库一行起 Web 服务',
      formalDef:
        'http.HandleFunc 注册“路径→处理函数”，ListenAndServe 阻塞启动。处理函数签名固定：func(w http.ResponseWriter, r *http.Request)。',
      fixed: `func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "你好 %s", r.URL.Query().Get("name"))
}
func main() {
    http.HandleFunc("/hello", hello)
    http.ListenAndServe(":8080", nil)
}`,
      variable: '路径、返回内容可变；函数签名和 ListenAndServe 固定。',
      examples: [
        {
          code: `# 访问 http://localhost:8080/hello?name=小明`,
          output: `你好 小明`,
          note: 'r.URL.Query().Get("name") 读 ?name= 后的值。',
        },
      ],
      rookie: 'ListenAndServe 是阻塞的——它后面的代码不会执行。',
      realWorld: 'Go 后端、微服务网关大量用 net/http 或在它之上的 gin。',
    },
  ],

  'go-2': [
    {
      id: 'go2-test',
      point: 'go test：原生写单元测试',
      formalDef:
        '测试文件名必须以 _test.go 结尾，函数以 Test 开头，参数 t *testing.T。go test 自动找出来跑。',
      fixed: `// math.go
func Add(a, b int) int { return a + b }
// math_test.go
func TestAdd(t *testing.T) {
    if Add(2, 3) != 5 { t.Error("2+3 应该是 5") }
}`,
      variable: '测什么函数、断言写什么都可变。',
      examples: [
        {
          code: `$ go test ./...`,
          output: `ok   myapp  0.3s`,
          note: '失败会打印哪个用例、实际值 vs 期望。',
        },
      ],
      rookie: '测试函数不以 Test 开头、文件不叫 *_test.go，go test 根本不跑。',
      realWorld: 'Go 社区把测试当一等公民，go test 是 CI 核心命令。',
    },
  ],

  'go-3': [
    {
      id: 'go3-middleware',
      point: '中间件：把通用逻辑从业务里抽出来',
      formalDef:
        '中间件包在处理函数外面，在业务前后统一做日志、鉴权、限流。请求先过中间件再到业务。',
      fixed: `func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Println(r.URL.Path)
        next.ServeHTTP(w, r)
    })
}`,
      variable: '中间件做什么可变；“包一层、调 next”这个模式固定。',
      examples: [
        {
          code: `# 限流：超 100 QPS 直接返回 429
if qps > 100 { w.WriteHeader(429); return }
next.ServeHTTP(w, r)`,
          output: `# 超限请求被中间件拦下，业务函数没机会跑`,
          note: '限流、鉴权这种“每个接口都要做”的事就该放中间件。',
        },
      ],
      rookie: '在每个业务函数里复制粘贴一份鉴权代码——该抽中间件了。',
      realWorld: 'gin/echo 的 middleware 机制就是这个，后端必考。',
    },
  ],

  // ============ 算法 ============
  'algo-0': [
    {
      id: 'al0-complexity',
      point: '时间复杂度 O(n)：数据量变大，代码慢几倍',
      formalDef:
        '时间复杂度描述数据量 n 变大时执行次数怎么增长：O(1) 固定、O(n) 成正比、O(n²) n乘n、O(log n) 每翻一倍只多一步。',
      fixed: `一层循环      → O(n)
两层嵌套      → O(n²)
每次砍半/二分 → O(log n)`,
      variable: '判断方法固定：数循环层数、是否每次砍半。',
      examples: [
        {
          code: `for a in data:
    for b in data:
        compare(a, b)`,
          output: `# n=1000 → 100万次；n=10000 → 1亿次`,
          note: 'n 大了双重循环就崩，这就是要优化的信号。',
        },
      ],
      rookie: '测试数据少看不出差别，上线百万数据直接超时。',
      realWorld: '大厂面试第一问就是复杂度，一条 O(n²) 慢 SQL 能拖垮服务。',
    },
    {
      id: 'al0-stack-queue',
      point: '栈与队列：括号匹配和 BFS 为什么用它们',
      formalDef:
        '栈后进先出（LIFO），适合“最近的先处理”（括号匹配、DFS）；队列先进先出（FIFO），适合先来先服务（BFS）。',
      fixed: `栈: push 入, pop 出最近       队列: push 入, shift 出最早
Python 用 list 当栈, 用 deque 当队列`,
      variable: '装什么元素可变。',
      examples: [
        {
          code: `s = []
for ch in "()":
    if ch == "(": s.append(ch)
    else: s.pop()`,
          output: `# 栈空且处理完 = 合法`,
          note: '遇到右括号，最近的左括号必须配对，正是栈的特性。',
        },
      ],
      rookie: '用 list.pop(0) 当队列（O(n)），数据大了慢；队列用 deque.popleft()。',
      realWorld: '浏览器前进后退、函数调用栈、消息队列都是这两种结构。',
    },
  ],

  'algo-1': [
    {
      id: 'al1-hashmap',
      point: '哈希表：把查找从 O(n) 降到 O(1)',
      formalDef:
        '哈希表用键直接定位存储位置，查“在不在/出现几次”是常数时间。看到“两数之和、出现几次、去重”就用 dict/set。',
      fixed: `seen = {}
for i, x in enumerate(nums):
    if target - x in seen:
        return [seen[target-x], i]
    seen[x] = i`,
      variable: '“边遍历边查表”的套路固定。',
      examples: [
        {
          code: `two_sum([2,7,11,15], 9)`,
          output: `[0, 1]   # 2+7=9`,
          note: '遍历到 7 时，查 9-7=2 在不在——在，就是答案。',
        },
      ],
      rookie: '两数之和用双重循环 O(n²)，没想到边遍历边查表。',
      realWorld: '去重、计数、缓存都靠哈希表，是工程和面试最高频结构。',
    },
    {
      id: 'al1-sliding-window',
      point: '滑动窗口：求最长/最短连续子串',
      formalDef:
        '左右两个指针维护一个区间：右指针扩大、左指针在不满足条件时收缩，一趟遍历求最值。',
      fixed: `left = 0
for right in range(n):
    加入 right
    while 窗口不满足:
        移出 left; left += 1
    更新答案`,
      variable: '窗口条件、求最长还是最短可变。',
      examples: [
        {
          code: `# 最长无重复字符子串 "abcabcbb"`,
          output: `3   # 最长 "abc"`,
          note: '右指针走，遇到重复就把左指针挪到重复字符之后。',
        },
      ],
      rookie: '对每个起点重新扫一遍 O(n²)。滑动窗口每个元素最多进/出一次，O(n)。',
      realWorld: '子串/子数组最值、定长窗口统计都是滑动窗口。',
    },
  ],

  'algo-2': [
    {
      id: 'al2-dfs-bfs',
      point: 'DFS 与 BFS：什么时候用递归栈，什么时候用队列',
      formalDef:
        'DFS 一条路走到黑（递归或栈），适合遍历所有路径、连通块；BFS 按层扩散（队列），适合求最短步数、层序遍历。',
      fixed: `q = deque([root])
while q:
    node = q.popleft()
    if node.left: q.append(node.left)
    if node.right: q.append(node.right)`,
      variable: '遍历什么图/树可变；BFS 用队列、DFS 用递归/栈 固定。',
      examples: [
        {
          code: `# 二叉树 [3,9,20,null,null,15,7] 层序`,
          output: `[[3], [9,20], [15,7]]`,
          note: '队列保证先遍历完一层再下一层。',
        },
      ],
      rookie: '求最短步数却用 DFS 绕远。无权图最短路用 BFS。',
      realWorld: '地图寻路、拓扑排序、树的各种遍历全靠这俩。',
    },
  ],

  'algo-3': [
    {
      id: 'al3-dp',
      point: '动态规划：状态定义 + 转移方程',
      formalDef:
        'DP 三步：①定义 dp[i] 是什么 ②写转移方程 ③定初始值和遍历顺序。把大问题拆成重叠的小问题。',
      fixed: `# 爬楼梯 dp[i] = dp[i-1] + dp[i-2]
dp[1]=1; dp[2]=2
for i in range(3, n+1):
    dp[i] = dp[i-1] + dp[i-2]`,
      variable: 'dp 含义、转移方程随题变；三步套路固定。',
      examples: [
        {
          code: `climb(5)`,
          output: `8   # 到第5阶有8种走法`,
          note: '到第 i 阶 = 从 i-1 跨一步 + 从 i-2 跨两步。',
        },
      ],
      rookie: '上来就写 hard 题。先爬楼梯→打家劫舍→最长递增子序列顺下来就入门。',
      realWorld: '背包、编辑距离、股票问题都是 DP，面试高频拉分点。',
    },
  ],

  // ============ SQL ============
  'sql-0': [
    {
      id: 'sql0-select',
      point: 'SELECT 查询：怎么把“我要什么数据”翻译成一句话',
      formalDef:
        'SELECT 列 FROM 表 WHERE 条件：SELECT 要哪些列、FROM 从哪张表、WHERE 只留满足的行。思路是先定表→筛行→取列。',
      fixed: `SELECT 列1, 列2
FROM 表名
WHERE 条件
GROUP BY 列
ORDER BY ... DESC
LIMIT 10;`,
      variable: '列名、表名、条件都可变；子句顺序固定。',
      examples: [
        {
          code: `SELECT city, COUNT(*) AS cnt
FROM users
GROUP BY city
ORDER BY cnt DESC
LIMIT 3;`,
          output: `长沙 120
北京 88
上海 75`,
          note: 'GROUP BY 分组，COUNT 每组多少行，ORDER BY 倒序，LIMIT 取前 3。',
        },
      ],
      rookie: '等号是一个 = 不是 ==；字符串要单引号；子句顺序别写乱。',
      realWorld: '数据分析师每天写的就是这种 SQL。',
    },
    {
      id: 'sql0-where-having',
      point: 'WHERE 和 HAVING：先筛行还是先筛组',
      formalDef:
        'WHERE 在分组前过滤原始行；HAVING 在 GROUP BY 后过滤分组。先用 WHERE 砍数据，再用 HAVING 筛聚合结果。',
      fixed: `WHERE 行级条件（分组前）
GROUP BY 列
HAVING 聚合条件（如 COUNT(*) > 5）`,
      variable: '具体条件可变；位置固定。',
      examples: [
        {
          code: `SELECT city, COUNT(*) c
FROM users
WHERE created_at >= '2026-01-01'
GROUP BY city
HAVING c > 5;`,
          output: `# 两步过滤，结果又准又快`,
          note: 'HAVING 里能用 COUNT(*)，WHERE 里不行。',
        },
      ],
      rookie: '把聚合条件写进 WHERE 报错——聚合只能在 HAVING。',
      realWorld: '真实报表 SQL 几乎都有 WHERE + GROUP BY + HAVING。',
    },
  ],

  'sql-1': [
    {
      id: 'sql1-join',
      point: 'JOIN：怎么把多张表拼起来',
      formalDef:
        'JOIN 按关联键把多表拼成宽表。INNER JOIN 只留两边都匹配的；LEFT JOIN 保留左表全部，右表没匹配补 NULL。',
      fixed: `SELECT o.id, u.name, o.amount
FROM orders o
JOIN users u ON o.user_id = u.id;`,
      variable: '连哪几张表、ON 条件都可变。',
      examples: [
        {
          code: `SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;`,
          output: `张三 200
李四 NULL   ← 李四没订单`,
          note: '要“所有人哪怕没订单”用 LEFT JOIN；只要有订单的用 INNER。',
        },
      ],
      rookie: '忘了写 ON 条件得到笛卡尔积（行数爆炸）。JOIN 必须带 ON。',
      realWorld: '订单关联用户、商品、支付，后端报表全靠多表 JOIN。',
    },
    {
      id: 'sql1-index',
      point: '索引：为什么加个目录查询就变快',
      formalDef:
        '索引像书的目录，在 WHERE/JOIN 用的列上建索引，查找从全表扫描 O(n) 变 O(log n)。但写会变慢、占空间。',
      fixed: `CREATE INDEX idx_user ON orders(user_id);
EXPLAIN SELECT ...;   -- 看有没有用到索引`,
      variable: '建哪列可变。',
      examples: [
        {
          code: `EXPLAIN SELECT * FROM orders WHERE user_id = 1;`,
          output: `# type=ref 且 key=idx_user → 走了索引
# type=ALL → 全表扫描，慢`,
          note: '看 type 和 key 两列就知道走没走索引。',
        },
      ],
      rookie: '每列都建索引，insert/update 变慢。只为高频查询列建。',
      realWorld: '慢 SQL 三板斧：EXPLAIN → 加索引 → 改写 SQL。',
    },
  ],

  'sql-2': [
    {
      id: 'sql2-tx',
      point: '事务 ACID：转账为什么要么全成功要么全失败',
      formalDef:
        '事务是一组操作，BEGIN 开始、COMMIT 提交、ROLLBACK 回滚。转账：扣 A 加 B，中间断电不能只做一半。',
      fixed: `BEGIN;
UPDATE account SET balance = balance - 100 WHERE id=1;
UPDATE account SET balance = balance + 100 WHERE id=2;
COMMIT;   -- 或 ROLLBACK;`,
      variable: '里面几条 SQL 可变；BEGIN/COMMIT 包裹固定。',
      examples: [
        {
          code: `BEGIN;
UPDATE account SET balance = balance - 100 WHERE id=1;
ROLLBACK;`,
          output: `# id=1 的钱没少，事务被撤销`,
          note: 'ROLLBACK 把 BEGIN 之后的改动全部撤销，像游戏读档。',
        },
      ],
      rookie: '两个写操作忘了包事务，第二个失败时第一个已提交，钱对不上。',
      realWorld: '转账、下单扣库存、支付全在事务里；Spring 的 @Transactional 就是这个。',
    },
  ],

  'sql-3': [
    {
      id: 'sql3-left-prefix',
      point: '最左前缀：联合索引怎么才生效',
      formalDef:
        '联合索引 (user_id, created_at) 像先按姓名排再按年龄排。查询必须用到最左边那列才可能走索引。',
      fixed: `INDEX(user_id, created_at)
能命中: WHERE user_id=? AND created_at>?
命不中: WHERE created_at>?   -- 跳过最左列`,
      variable: '列顺序按查询频率设计。',
      examples: [
        {
          code: `WHERE user_id=? AND created_at BETWEEN ? AND ?`,
          output: `# 命中联合索引，毫秒级`,
          note: '把高频出现的列放最左边。',
        },
      ],
      rookie: '索引建了却没生效，EXPLAIN 一看——查询没带最左列。',
      realWorld: '订单表按 (user_id, created_at) 建联合索引是标准做法。',
    },
  ],

  // ============ Redis ============
  'redis-0': [
    {
      id: 'redis0-datatype',
      point: '五种结构：String/Hash/List/Set/ZSet 各管什么',
      formalDef:
        'Redis 是内存 KV 库所以快。String 缓存/计数；Hash 存对象字段；List 时间线/队列；Set 去重标签；ZSet 带分数排行榜。',
      fixed: `SET user:1:name "Tom"
HSET product:1 stock 100
ZADD rank 95 "alice" 88 "bob"
ZREVRANGE rank 0 2 WITHSCORES`,
      variable: '键名、存什么都可变。',
      examples: [
        {
          code: `ZADD rank 95 "alice" 88 "bob" 100 "zoe"
ZREVRANGE rank 0 2 WITHSCORES`,
          output: `zoe 100
alice 95
bob 88`,
          note: '按分数从高到低取前 2，就是排行榜。',
        },
      ],
      rookie: '用 String 存整个 JSON 改个字段要全量读改写，用 Hash 才能单字段改。',
      realWorld: '排行榜、在线用户数、缓存商品详情都用 Redis。',
    },
  ],

  'redis-1': [
    {
      id: 'redis1-cache',
      point: '穿透 / 击穿 / 雪崩：缓存三大经典问题',
      formalDef:
        '穿透=查不存在的 key 每次打 DB（布隆过滤器/空值缓存）；击穿=热点 key 失效瞬间大量请求打 DB（加锁/逻辑不过期）；雪崩=大量 key 同时过期（过期时间加随机抖动）。',
      fixed: `# 雪崩缓解：过期时间加随机
EXPIRE key 3600 + random(0,300)`,
      variable: '具体方案可变；“现象+一个办法”记住即可。',
      examples: [
        {
          code: `# 击穿：热点 key 过期时只放一个请求查 DB`,
          output: `# 其它请求等锁，DB 只被打一次`,
          note: '防止千万请求同时冲到数据库。',
        },
      ],
      rookie: '三个词混着背：穿透=查不存在，击穿=热点过期，雪崩=集体过期。',
      realWorld: '面试必问；真实高并发系统都按这三条设计缓存。',
    },
  ],

  'redis-2': [
    {
      id: 'redis2-persistence',
      point: 'RDB / AOF 与主从：Redis 怎么不丢数据',
      formalDef:
        'RDB 定时快照（恢复快、可能丢数据）；AOF 把每条写命令记日志（更安全、文件大）。主从复制 + 哨兵实现高可用。',
      fixed: `写 → 主节点 → 异步同步给从节点
读 → 可以打到从节点`,
      variable: '知道概念即可。',
      examples: [
        {
          code: `# 主节点挂了，哨兵把某个从节点提升为新主`,
          output: `# 整个集群继续服务`,
          note: '这就是“高可用”。',
        },
      ],
      rookie: '把 Redis 当唯一存储——它是缓存，重要数据要落 DB。',
      realWorld: '生产用混合持久化 + 主从 + 哨兵，面试“了解即可”级别。',
    },
  ],

  'redis-3': [
    {
      id: 'redis3-update',
      point: '缓存更新：先更 DB 还是先删缓存',
      formalDef:
        '推荐“先更新数据库，再删除缓存”。因为缓存有过期时间兜底，删了下次读再回源。别“更新缓存”，直接删更简单。',
      fixed: `1. UPDATE products SET ...
2. DEL cache:product:123`,
      variable: '具体业务可变；“先 DB 后删缓存”顺序固定。',
      examples: [
        {
          code: `# 为什么不更新缓存而是删？`,
          output: `# 删了下次读自动重建，逻辑更简单`,
          note: '短暂不一致是允许的，最终一致即可。',
        },
      ],
      rookie: '先删缓存再更 DB，中间被读就把旧值又写回缓存，长期不一致。',
      realWorld: '商品详情、用户资料缓存都按这套更新策略。',
    },
  ],

  // ============ 向量数据库 ============
  'vector-0': [
    {
      id: 'vec0-embedding',
      point: 'Embedding 与余弦相似度：语义相近怎么算',
      formalDef:
        'Embedding 把文本变成一串数字（如 1024 维），意思相近的文本向量夹角小。余弦相似度算夹角，越接近 1 越相似。',
      fixed: `"苹果手机" -> [0.12, -0.83, ...]
"华为手机" -> [0.10, -0.79, ...]   # 夹角小，相似
"今天天气" -> [-0.55, 0.21, ...]   # 夹角大，不相似`,
      variable: '向量维度、内容可变；“近=相似”思想固定。',
      examples: [
        {
          code: `# 为什么不能用 LIKE？
LIKE "%手机%" 只匹配字面，“苹果 iPhone”搜不到`,
          output: `# 向量知道“iPhone”和“手机”语义近`,
          note: '关键词搜字面，向量搜意思。',
        },
      ],
      rookie: '以为向量是“把字编号”——它是把语义压缩成坐标，AI 训练出来的。',
      realWorld: 'RAG、推荐、语义搜索都靠 Embedding + 相似度。',
    },
  ],

  'vector-1': [
    {
      id: 'vec1-ann',
      point: 'ANN：为什么不逐条算相似度',
      formalDef:
        '库里几百万条向量，全量算太慢。ANN 建索引“近似”地找最近邻，快 100 倍，准确率略降但够用。HNSW 是建图跳着找。',
      fixed: `# 精确：query 和每条都算一遍 → O(n)，慢
# ANN：建图索引只跳相邻节点 → O(log n)，快`,
      variable: '选 HNSW 还是 IVF 看数据量。',
      examples: [
        {
          code: `# 100 万条向量，ANN 检索只要几毫秒`,
          output: `# 牺牲一点点准确率换百倍速度`,
          note: '近似 = 接受极少量漏召回，换速度。',
        },
      ],
      rookie: '以为“近似”是缺点——准确率 95% 但快 100 倍，是划算的交易。',
      realWorld: 'Milvus/Chroma/pgvector 内部都在跑 HNSW/IVF。',
    },
  ],

  'vector-2': [
    {
      id: 'vec2-chunk',
      point: '文档切块：为什么不能整篇塞进去',
      formalDef:
        '长文档切成小块（如 500 token）再向量化入库。切太大检索不准、太小上下文不全；块之间留重叠（50 token）防止句子被切断。',
      fixed: `for 文档 in 文档集:
    chunks = 按 500 字 + 50 字重叠切块
    for c in chunks:
        入库(向量(c), 原文=c, 元数据=来源)`,
      variable: '块大小、重叠按内容调。',
      examples: [
        {
          code: `# 一篇 2000 字文档 → 切成 4 块`,
          output: `块1[0:500] 块2[450:950] ...  # 重叠50字`,
          note: '重叠保证跨块句子不被腰斩。',
        },
      ],
      rookie: '整篇文档当一块，检索时把无关内容也带进来，答案质量差。',
      realWorld: 'RAG 第一步就是切块入库，chunk 大小是调参关键。',
    },
  ],

  // ============ Linux ============
  'linux-0': [
    {
      id: 'lx0-path',
      point: '路径符号：~ . .. 怎么 cd 不迷路',
      formalDef:
        '~ 家目录、. 当前目录、.. 上一层、/ 开头是绝对路径。pwd 看现在在哪，ls 看里面有啥。',
      fixed: `pwd; ls; cd 目标; cd ..; cd ~; cd -`,
      variable: '目标文件夹名可变。',
      examples: [
        {
          code: `pwd
cd ../Documents
pwd`,
          output: `/home/twy/Downloads
/home/twy/Documents`,
          note: '.. 往上一层，再进 Documents。',
        },
      ],
      rookie: '路径打错用 Tab 自动补全，别手敲全名。',
      realWorld: '服务器没图形界面，cd/ls/pwd 是每日基本功。',
    },
    {
      id: 'lx0-pipe',
      point: '管道与重定向：| 和 > 到底干嘛',
      formalDef:
        '管道 | 把前一个命令的输出当后一个的输入；> 写文件（覆盖），>> 追加。这是命令行的灵魂。',
      fixed: `命令A | 命令B     # A的结果给B
命令 > 文件       # 覆盖写
命令 >> 文件      # 追加写`,
      variable: '串哪些命令可变。',
      examples: [
        {
          code: `ps aux | grep java
tail -100 app.log > out.txt`,
          output: `# 第一行：进程列表筛出java
# 第二行：日志最后100行存进out.txt`,
          note: '| 串多个命令；> 落地到文件。',
        },
      ],
      rookie: '> 和 >> 搞混，> 直接覆盖掉原文件。追加用 >>。',
      realWorld: 'ps|grep、grep -rn、日志分析全靠管道。',
    },
  ],

  'linux-1': [
    {
      id: 'lx1-script',
      point: 'Shell 脚本：变量、if、for 怎么写',
      formalDef:
        '第一行 #!/bin/bash 指定解释器；变量 $var 取值；[ -f 文件 ] 判断；for 遍历。写完 chmod +x 加执行权限。',
      fixed: `#!/bin/bash
count=$(ls *.log | wc -l)
echo "日志数：$count"
for f in *.log; do
  if [ -f "$f" ]; then echo "$f"; fi
done`,
      variable: '处理什么文件、判断条件可变。',
      examples: [
        {
          code: `# backup.sh
tar czf /tmp/logs.tar.gz *.log`,
          output: `# /tmp/logs.tar.gz 就是打包好的日志`,
          note: 'crontab -e 配上每天凌晨跑。',
        },
      ],
      rookie: 'if [ ... ] 里方括号两边必须有空格，= 两边不能有空格，是 shell 最常见语法坑。',
      realWorld: '定时备份、日志清理、部署脚本都是 shell。',
    },
  ],

  'linux-2': [
    {
      id: 'lx2-systemd',
      point: 'systemd 与日志：怎么让服务常驻、出问题看哪',
      formalDef:
        'nohup/systemd 让程序关了终端还在跑；systemctl status/restart 管服务；journalctl -u 跟这个服务的日志。',
      fixed: `systemctl status nginx
systemctl restart nginx
journalctl -u nginx -f`,
      variable: '服务名可变。',
      examples: [
        {
          code: `nohup python main.py > app.log 2>&1 &`,
          output: `# 后台跑，输出写进 app.log，关终端也不停`,
          note: '& 后台、nohup 免疫挂断。',
        },
      ],
      rookie: '程序挂了先猜不看日志。第一步永远看日志。',
      realWorld: '生产服务全由 systemd 托管，挂了 systemctl restart 重启。',
    },
  ],

  // ============ Git ============
  'git-0': [
    {
      id: 'git0-snapshot',
      point: 'add / commit：快照怎么拍，为什么分两步',
      formalDef:
        'commit 给整个项目拍一张存档。git add 挑改动进暂存区，git commit 按下快门写说明。',
      fixed: `git add .
git commit -m "feat: 完成首页"
git log --oneline`,
      variable: 'add 哪些文件、说明写什么可变。',
      examples: [
        {
          code: `git add src/login.py
git commit -m "fix: 验证码刷新失败"`,
          output: `# 暂存区只有这一个文件，commit 只记它`,
          note: '分两步是为了精确挑选哪些进这次存档。',
        },
      ],
      rookie: 'message 写“update”等于没写。feat:/fix: 前缀让历史可读。',
      realWorld: '一天 commit 十几次，出问题能精确回退。',
    },
    {
      id: 'git0-diff',
      point: 'git diff / status / reset：看改动、看状态、撤销提交',
      formalDef:
        'git status 看当前改了啥；git diff 看未暂存的具体差异；git reset --soft HEAD~1 撤销最近一次 commit 但保留改动。',
      fixed: `git status
git diff
git reset --soft HEAD~1`,
      variable: '看什么、撤几次可变。',
      examples: [
        {
          code: `git diff`,
          output: `# - 红色：删掉的行
# + 绿色：新增的行`,
          note: 'commit 前看一眼 diff，确认没把调试代码提上去。',
        },
      ],
      rookie: 'git reset --hard 会丢掉改动，慎用；--soft 只撤提交保留文件。',
      realWorld: '每天 status/diff 几十次，是写代码的呼吸。',
    },
  ],

  'git-1': [
    {
      id: 'git1-branch',
      point: '分支与冲突：为什么不在 main 上写',
      formalDef:
        '分支是从 main 复制的平行线，搞砸删掉不影响主线；多人改同一行合并会产生冲突标记，手动选保留谁。',
      fixed: `git switch -c feature/login
# 改完...
git switch main && git merge feature/login
# 冲突：编辑含 <<<<<<< 的文件，解决后 git add`,
      variable: '分支名可变。',
      examples: [
        {
          code: `<<<<<<< HEAD
我的版本
=======
对方版本
>>>>>>> feature/login`,
          output: `# 删掉标记，只留要的那版`,
          note: '冲突不可怕，就是让你二选一。',
        },
      ],
      rookie: '怕冲突就不开分支，结果 main 被改崩。冲突打开标记手动解决即可。',
      realWorld: '一个需求一个 feature 分支，发 PR review 后合 main。',
    },
  ],

  'git-2': [
    {
      id: 'git2-pr',
      point: 'PR/MR 流程：团队协作怎么走',
      formalDef:
        '克隆→建分支→提交→push 到远程→在 GitHub/GitLab 发 Pull Request→同事 review→讨论修改→合并。',
      fixed: `git push origin feature/login
# 网页上点 New Pull Request → 选 review 人 → Merge`,
      variable: '仓库、分支名可变。',
      examples: [
        {
          code: `# 从现在起，每个练习都 push 到自己的公开 GitHub`,
          output: `# 这个仓库链接就是简历上的“项目地址”`,
          note: '面试官会直接看你的 GitHub 提交记录。',
        },
      ],
      rookie: '代码只在自己电脑，面试官看不到。公开仓库 = 在线作品集。',
      realWorld: '大厂全部走 PR + 代码评审，直推 main 会被拦。',
    },
  ],

  // ============ Spring ============
  'spring-0': [
    {
      id: 'sp0-ioc',
      point: 'IoC / 依赖注入：你不 new，Spring 帮你塞',
      formalDef:
        '控制反转：对象不由你 new，而是 Spring 容器创建并在需要时自动注入。用构造器注入，换实现只改一处。',
      fixed: `@Service
public class OrderService {
    private final PayService payService;
    public OrderService(PayService p) { this.payService = p; }
}`,
      variable: '注入哪些服务可变。',
      examples: [
        {
          code: `# 本来要 new WxPay()，现在写构造器它就进来了
# 换成 AliPay，只改一行实现类`,
          output: `# 业务代码完全不动`,
          note: '这就是“面向接口+注入”的好处。',
        },
      ],
      rookie: '字段注入（@Autowired 贴字段）能跑但难测试，团队推荐构造器注入。',
      realWorld: 'Spring 全家桶核心就是 IoC。',
    },
  ],

  'spring-1': [
    {
      id: 'sp1-rest',
      point: 'REST 接口与统一返回：@RestController 怎么写',
      formalDef:
        '@RestController 标记接口类，@GetMapping/@PostMapping 映射路径。企业不直接返回实体，而包成统一 {code,message,data}。',
      fixed: `@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
    public Result create(@Valid @RequestBody OrderDTO dto) { ... }
}`,
      variable: '路径、方法、入参可变。',
      examples: [
        {
          code: `POST /api/orders  body: {"amount": 99.5}`,
          output: `{"code":0,"message":"ok","data":{"id":1}}`,
          note: '前端只认 code==0，失败看 message。',
        },
      ],
      rookie: '直接把数据库实体抛给前端，字段泄露且难扩展。包 Result 统一格式。',
      realWorld: '企业后端 100% 用统一返回体 + @RestControllerAdvice 全局异常。',
    },
  ],

  'spring-2': [
    {
      id: 'sp2-tx',
      point: '@Transactional：声明式事务怎么用',
      formalDef:
        '标在方法上，方法正常结束就提交，抛异常就回滚。把多个写操作包在一个方法里，要么全成功要么全失败。',
      fixed: `@Transactional
public void pay(Long orderId) {
    orderMapper.updateStatus(...);
    payMapper.record(...);  // 这里抛异常 → 上面也回滚
}`,
      variable: '方法里做什么可变。',
      examples: [
        {
          code: `# record() 抛异常 → updateStatus 也被撤销`,
          output: `# 数据库回到调用前状态`,
          note: '不用手动 BEGIN/COMMIT，注解帮你做。',
        },
      ],
      rookie: '同类内部自调用 this.pay() 会让 @Transactional 失效（绕过代理）。',
      realWorld: '支付、下单、转账方法都加 @Transactional。',
    },
  ],

  'spring-3': [
    {
      id: 'sp3-micro',
      point: '微服务三大件：注册中心、网关、配置中心',
      formalDef:
        '服务多了互相找不到：注册中心管“谁上线了”，网关做统一入口鉴权限流，配置中心集中管配置。知道为什么拆即可。',
      fixed: `用户 → 网关 → 订单服务 / 支付服务
                ↑ 都在注册中心登记`,
      variable: '画对关系图即可。',
      examples: [
        {
          code: `# 订单服务要调支付，不问“支付在哪台机器”`,
          output: `# 去注册中心查一下，地址变了也不怕`,
          note: '服务发现 = 电话号码簿。',
        },
      ],
      rookie: '一上来就学写微服务中间件，新手先理解“为什么需要”。',
      realWorld: '中大厂后端架构基础概念，面试问“为什么拆”。',
    },
  ],

  // ============ FastAPI ============
  'fastapi-0': [
    {
      id: 'fa0-rest',
      point: 'REST 风格与状态码：URL 和方法怎么对应',
      formalDef:
        'URL 表资源（/orders），HTTP 方法表操作：GET 查、POST 建、PUT 改、DELETE 删。200 成功、400 参数错、401 没登录、403 没权限、404 不存在、500 服务错。',
      fixed: `GET    /orders      列表
POST   /orders      创建
GET    /orders/1    详情
PUT    /orders/1    修改
DELETE /orders/1    删除`,
      variable: '资源名可变；方法和路径风格固定。',
      examples: [
        {
          code: `# 401 vs 403
401: 没登录 → 去登录
403: 登录了但没权限 → 别再试了`,
          output: `# 前端据状态码弹不同提示`,
          note: '记混了前后端联调会猜半天。',
        },
      ],
      rookie: '用 POST 干所有事、返回 200 但 body 写“失败”，不是 REST。用对状态码。',
      realWorld: '写接口前先列这张方法-路径表，前端才能对齐。',
    },
  ],

  'fastapi-1': [
    {
      id: 'fa1-app',
      point: 'FastAPI 第一个接口：Pydantic 自动校验',
      formalDef:
        '定义 Pydantic 模型描述请求体长什么样，FastAPI 自动校验类型并生成 /docs 文档。不用手写校验和文档。',
      fixed: `from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
class Item(BaseModel):
    name: str
    price: float
@app.post("/items")
def create(item: Item):
    return {"id": 1, **item.model_dump()}`,
      variable: '模型字段、路径可变。',
      examples: [
        {
          code: `# 访问 http://localhost:8000/docs`,
          output: `# 自动出现 Swagger 页面，点一下就能调接口`,
          note: '这是 FastAPI 比 Flask 快的原因：自动文档+校验。',
        },
      ],
      rookie: 'price 传字符串它自动 422 报错——这就是 Pydantic 在帮你校验。',
      realWorld: 'AI 应用后端、数据服务现在首选 FastAPI。',
    },
  ],

  'fastapi-2': [
    {
      id: 'fa2-cors',
      point: 'CORS 跨域：浏览器为什么拦你的接口',
      formalDef:
        '前端 5173 调后端 8000，端口不同就是跨域，浏览器默认拦。加 CORSMiddleware 声明允许哪些来源即可。',
      fixed: `app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_credentials=True,
)`,
      variable: '允许哪个来源可变。',
      examples: [
        {
          code: `# 开发用 *，生产改成具体前端域名`,
          output: `# allow_origins=["*"] 上线是安全隐患`,
          note: '谁被拦的？浏览器，不是后端。',
        },
      ],
      rookie: 'allow_origins=["*"] 直接上线，等于允许任何网站调你的接口。',
      realWorld: '前后端分离必配 CORS，是联调第一坑。',
    },
  ],

  'fastapi-3': [
    {
      id: 'fa3-ask',
      point: 'POST /ask：把 RAG 问答封装成接口',
      formalDef:
        '请求体传问题，后端做“检索相关片段→拼 Prompt→调大模型→返回答案和引用”。流式返回用 StreamingResponse。',
      fixed: `class AskReq(BaseModel):
    question: str
@app.post("/ask")
def ask(req: AskReq):
    chunks = search(req.question)
    ans = llm.generate(chunks, req.question)
    return {"answer": ans, "refs": chunks}`,
      variable: '检索逻辑、模型调用可变。',
      examples: [
        {
          code: `POST /ask  {"question": "报销流程是什么"}`,
          output: `{"answer":"...", "refs":["员工手册p3"]}`,
          note: '把引用一起返回，用户能溯源。',
        },
      ],
      rookie: '直接让大模型回答公司内部问题，它没见过就瞎编。RAG 给它资料。',
      realWorld: '企业知识库助手的标准后端就是这一个 /ask 接口。',
    },
  ],

  // ============ Docker ============
  'docker-0': [
    {
      id: 'docker0-img',
      point: 'Dockerfile：每一行在干嘛',
      formalDef:
        'FROM 选基础镜像，WORKDIR 设工作目录，COPY 拷文件，RUN 装依赖，CMD 启动命令。每行生成一层，顺序影响缓存。',
      fixed: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]`,
      variable: '用什么基础镜像、拷哪些文件可变。',
      examples: [
        {
          code: `# 为什么 COPY requirements.txt 放前面？`,
          output: `# 依赖没变就用缓存，改代码不用重装依赖，build 快`,
          note: '把“少变的层”放上面。',
        },
      ],
      rookie: 'COPY . . 放最前面，改一行代码就重装全部依赖，build 巨慢。',
      realWorld: '每个后端服务都有一份 Dockerfile，是部署入口。',
    },
  ],

  'docker-1': [
    {
      id: 'docker1-compose',
      point: 'Compose：一键起应用 + 数据库',
      formalDef:
        'docker-compose.yml 把多个服务写成一个文件，docker compose up -d 一键全起。volumes 做数据持久化，否则容器删了数据就没。',
      fixed: `services:
  web: { build: ".", ports: ["8000:8000"], depends_on: [db] }
  db:  { image: mysql:8, environment: {MYSQL_ROOT_PASSWORD: 123456} }`,
      variable: '有哪些服务、端口映射可变。',
      examples: [
        {
          code: `docker compose up -d
docker compose down       # 停（数据保留）
docker compose down -v    # 停并删数据卷（谨慎）`,
          output: `# 一条命令拉起整个开发环境`,
          note: '新同事 clone 后 up 一下就能跑。',
        },
      ],
      rookie: '不挂 volume，MySQL 容器一删数据全没。生产数据必须挂卷。',
      realWorld: '本地开发环境标配 compose，告别手动装 MySQL。',
    },
  ],

  'docker-2': [
    {
      id: 'docker2-k8s',
      point: 'Pod / Deployment / Service：K8s 三件套',
      formalDef:
        'Pod 包着你的容器（最小调度单位）；Deployment 管“跑几个副本、怎么滚动升级”；Service 给 Pod 一个固定访问入口（Pod 会换 IP）。',
      fixed: `Deployment → 管 3 个 Pod 副本
Service    → 固定入口，请求轮询到这 3 个 Pod`,
      variable: '知道关系图即可。',
      examples: [
        {
          code: `# 一个 Pod 挂了，Deployment 自动再起一个`,
          output: `# 这就是“自愈”；访问方永远找 Service`,
          note: '扩容就是把副本数从 3 改成 10。',
        },
      ],
      rookie: '新手不用会写 YAML，先把这张图讲清楚就够面试。',
      realWorld: '生产容器编排几乎都是 K8s，高级后端概念。',
    },
  ],

  // ============ 分布式 ============
  'dist-0': [
    {
      id: 'd0-concurrent',
      point: '并发安全：count++ 为什么会出错',
      formalDef:
        'count++ 看似一步，实际是“读-改-写”三步，多线程同时做会互相覆盖。解决：加锁 synchronized 或用原子类。',
      fixed: `# 不加锁：1000线程各+1000，结果常小于 1000000
synchronized(lock) { count++; }`,
      variable: '锁对象可变。',
      examples: [
        {
          code: `# 线程A读到0，线程B也读到0，各自+1写回都是1`,
          output: `# 少了一次累加`,
          note: '这就是“超卖/重复扣库存”的根源。',
        },
      ],
      rookie: '以为加了变量就线程安全。共享可变状态必须同步。',
      realWorld: '秒杀扣库存、计数服务都要处理并发安全。',
    },
  ],

  'dist-1': [
    {
      id: 'd1-mq',
      point: '消息队列：异步、削峰、解耦',
      formalDef:
        '在两个服务间插一条缓冲带：订单服务发个消息就返回，库存/短信服务慢慢消费。好处异步、削峰、解耦；代价是要维护、可能重复消费。',
      fixed: `用户下单 → 订单服务 → 发消息到 MQ → 立即返回
MQ → 库存服务消费 / 短信服务消费`,
      variable: '用什么 MQ、做什么消费可变。',
      examples: [
        {
          code: `# 秒杀 1 万请求：MQ 先接住，库存服务按自己速度消费`,
          output: `# 不会瞬间把 DB 打垮（削峰）`,
          note: '下单后发短信不该让用户等短信发完。',
        },
      ],
      rookie: '忘了处理“重复消费”，结果一条通知发两遍。消费端要做幂等。',
      realWorld: 'Kafka/RabbitMQ 是中大型后端标配。',
    },
  ],

  'dist-2': [
    {
      id: 'd2-cap',
      point: 'CAP 与最终一致：为什么不强求实时一致',
      formalDef:
        '一致性 C、可用性 A、分区容错 P 三者最多占两个。网络一定会分区（P 必选），所以在 CP 和 AP 间选。多数业务选 AP + 最终一致。',
      fixed: `# 下单减库存：
# 强一致=下单时立刻锁住全链路（慢、易挂）
# 最终一致=先下单成功，后台慢慢对齐（快、短暂不一致）`,
      variable: '知道取舍即可。',
      examples: [
        {
          code: `# 用户付完款，库存晚 1 秒才扣准，业务能接受`,
          output: `# 换取更高可用和更快响应`,
          note: '银行转账才要强一致，电商大多最终一致。',
        },
      ],
      rookie: '以为“一致性必须实时”——多数互联网业务短暂不一致是可接受的工程取舍。',
      realWorld: '分布式系统设计面试必谈 CAP 和最终一致。',
    },
  ],

  'dist-3': [
    {
      id: 'd3-seckill',
      point: '秒杀设计：限流 + Redis 预减 + 异步下单',
      formalDef:
        '直接打 DB 必崩。正确链路：入口限流→库存预热到 Redis→Redis 预减→发 MQ 异步下单→DB 最终落库。',
      fixed: `1. 网关限流（令牌桶）
2. Redis 预减库存（lua 保证原子）
3. 发 MQ → 服务慢慢写 DB`,
      variable: '具体组件可换，思路固定。',
      examples: [
        {
          code: `# 1 万人抢 100 件：`,
          output: `# Redis 拦下第 101 个之后的请求，DB 只写 100 条`,
          note: '绝不让所有请求直接打 DB。',
        },
      ],
      rookie: '库存直接 UPDATE ... WHERE stock>0，高并发下超卖。用 Redis 原子扣减挡在前面。',
      realWorld: '双11秒杀、抢票都是这套架构，系统设计高频题。',
    },
  ],

  // ============ 数据分析 ============
  'ds-0': [
    {
      id: 'ds0-numpy',
      point: '向量化：为什么别用 for 循环算数值',
      formalDef:
        'Numpy 把循环下沉到 C 层，a*2 是对整个数组同时算，比 Python for 快几十倍。核心：数组 + 广播 + 布尔索引。',
      fixed: `import numpy as np
a = np.array([1,2,3,4])
a * 2                  # 整体 [2 4 6 8]
a[a > 2]               # 布尔索引 [3 4]`,
      variable: '数组内容、运算可变。',
      examples: [
        {
          code: `a = np.array([1,2,3,4])
print(a[a > 2])`,
          output: `[3 4]`,
          note: '不用写 for，直接 a[a>2] 就筛出来了。',
        },
      ],
      rookie: '用 for 循环逐元素算，又慢又啰嗦。先想“能不能整体算”。',
      realWorld: '特征工程、矩阵运算底层都是 numpy。',
    },
  ],

  'ds-1': [
    {
      id: 'ds1-pandas',
      point: 'groupby：按天/按类别统计怎么做',
      formalDef:
        'groupby 把相同键的行分组，再对每组聚合（sum/mean/nunique）。这是数据分析最高频操作。',
      fixed: `df.groupby("dt")["uid"].nunique()   # 每天 UV
df.groupby("city")["amount"].sum()  # 每城总额`,
      variable: '按哪列分、聚合什么可变。',
      examples: [
        {
          code: `# 每日 UV`,
          output: `dt          uid
2026-09-01  1234
2026-09-02  1567`,
          note: 'nunique 去重计数（UV），count 是行数（PV）。',
        },
      ],
      rookie: 'PV 用 count、UV 用 nunique，别搞反。缺失值先 fillna/dropna。',
      realWorld: 'DAU/留存/漏斗全靠 groupby 三兄弟。',
    },
  ],

  'ds-2': [
    {
      id: 'ds2-chart',
      point: '图表选型：趋势/对比/占比各用什么图',
      formalDef:
        '趋势用折线、对比用柱状、占比用饼/堆叠条、分布用直方图。一张图只讲一个结论，标题直接写结论句。',
      fixed: `时间趋势 → 折线
类别对比 → 柱状
构成占比 → 饼/堆叠条
数据分布 → 直方图/箱线图`,
      variable: '数据换图不换选型原则。',
      examples: [
        {
          code: `# 标题写“9月UV环比涨18%”，别写“UV趋势”`,
          output: `# 读者一眼知道结论，图只是证据`,
          note: '标题即结论。',
        },
      ],
      rookie: '为了好看用 3D 饼图、双轴瞎叠，图表说谎。坐标轴从 0 开始。',
      realWorld: '数据分析师的产出是“让老板 3 秒看懂”的图。',
    },
  ],

  'ds-3': [
    {
      id: 'ds3-report',
      point: '分析报告：结论 + 数据 + 建议',
      formalDef:
        '报告不是堆图表，是“发生了什么（数据）→ 为什么（归因）→ 怎么办（建议）”。建议要具体可执行。',
      fixed: `1. 结论先行：9月UV涨18%
2. 数据支撑：哪几个渠道涨的
3. 归因：xx活动带来的
4. 建议：继续投放X，预算+20%`,
      variable: '具体业务可变。',
      examples: [
        {
          code: `# 差建议：“加强用户运营”
# 好建议：“把XX渠道预算从1万提到2万，预计再涨10%”`,
          output: `# 好建议有数字、有动作`,
          note: '老板要的是“下一步做什么”。',
        },
      ],
      rookie: '报告写成长篇数据罗列，没有结论。第一句必须是结论。',
      realWorld: '增长/数据岗每周写这种报告，决定预算怎么花。',
    },
  ],

  // ============ 机器学习 ============
  'ml-0': [
    {
      id: 'ml0-feature',
      point: '特征工程：类别/数值怎么喂给模型',
      formalDef:
        '模型只吃数字。类别（城市/性别）做 OneHot 编码；数值做标准化（不同量级拉到同一刻度）；缺失值用均值/0/单独标记。',
      fixed: `城市[北京,上海] → 两列 0/1 (OneHot)
年龄[18,35]    → 减均值除标准差 (标准化)`,
      variable: '用哪种编码看类别基数。',
      examples: [
        {
          code: `# 性别 男/女 → [1,0] / [0,1]`,
          output: `# 不做标准化，量级1万的“收入”会盖过年龄`,
          note: '标准化后各特征在同一起跑线。',
        },
      ],
      rookie: '直接把“城市”写成字符串让模型学。必须先编码成数字。',
      realWorld: '“数据和特征决定上限”，特征工程占建模 70% 时间。',
    },
  ],

  'ml-1': [
    {
      id: 'ml1-model',
      point: '线性/树/XGBoost：表格数据用哪个',
      formalDef:
        '逻辑回归是 baseline 先跑通；决策树可解释但易过拟合；随机森林/GBDT（XGBoost、LightGBM）是表格数据王者，Kaggle 表格赛标配。',
      fixed: `from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier()
model.fit(X_train, y_train)`,
      variable: '先用 LR 再用 RF/LGBM 对比。',
      examples: [
        {
          code: `# 先 LogisticRegression 出基线 0.78
# 换 RandomForest → 0.85`,
          output: `# 树模型自动抓非线性，不用手工造特征`,
          note: '别一上来用深度学习做表格。',
        },
      ],
      rookie: '小数据上深度学习打不过 XGBoost。表格问题优先 GBDT。',
      realWorld: '风控、CTR 预估几乎都是 LightGBM/XGBoost。',
    },
  ],

  'ml-2': [
    {
      id: 'ml2-metric',
      point: 'AUC 与交叉验证：模型好不好怎么看',
      formalDef:
        '不平衡数据光看准确率会被骗（全猜多数类也有 95%）。看 AUC、精确率、召回率。交叉验证把数据折几份轮流当验证集，结果更稳。',
      fixed: `from sklearn.model_selection import cross_val_score
cross_val_score(model, X, y, cv=5, scoring="roc_auc")`,
      variable: '折数、指标可变。',
      examples: [
        {
          code: `# 样本 95% 是正常、5% 欺诈`,
          output: `# 全猜正常准确率 95%，但一个欺诈没抓到（AUC 很低）`,
          note: '不平衡要看召回/AUC，别被准确率骗。',
        },
      ],
      rookie: '只看测试集一次分数就上线。跑 5 折交叉，分数稳定才可信。',
      realWorld: '模型上线前必须做交叉验证 + 不平衡指标分析。',
    },
  ],

  'ml-3': [
    {
      id: 'ml3-flow',
      point: '建模完整流程：读数据→特征→训练→评估',
      formalDef:
        '固定五步：读数据、清洗特征、训练基线模型、交叉验证评估、写结论。先跑通再优化，别一上来调参。',
      fixed: `1. read_csv 看分布
2. 清洗 + 编码
3. train_test_split
4. fit + predict
5. report 指标`,
      variable: '数据集、模型可变；流程固定。',
      examples: [
        {
          code: `# 第一次别急着调参，先跑通 baseline`,
          output: `# baseline 0.7 → 加特征 0.78 → 换模型 0.85`,
          note: '每一步都知道为什么涨。',
        },
      ],
      rookie: '在数据没清洗时就疯狂调参。先把脏数据洗干净。',
      realWorld: 'Kaggle/数据竞赛/甲方建模项目都是这套流程。',
    },
  ],

  // ============ PyTorch ============
  'dl-0': [
    {
      id: 'dl0-tensor',
      point: 'Tensor 与 DataLoader：怎么把数据喂给模型',
      formalDef:
        'Tensor 是能自动求梯度的多维数组（和 numpy 数组几乎一样）。Dataset 定义“一条数据怎么取”，DataLoader 负责按 batch 批量打乱送进模型。',
      fixed: `loader = DataLoader(ds, batch_size=32, shuffle=True)
for x, y in loader:
    # x 是一批 32 条`,
      variable: 'batch 大小、是否打乱可变。',
      examples: [
        {
          code: `# 1000 条数据 batch_size=32`,
          output: `# 每轮 32 条，共约 32 批；shuffle 让每轮顺序不同`,
          note: '大 batch 训练快，但占显存。',
        },
      ],
      rookie: '自己写 for 循环一条条喂，又慢又难训。用 DataLoader。',
      realWorld: '所有 PyTorch 项目都从 DataLoader 开始。',
    },
  ],

  'dl-1': [
    {
      id: 'dl1-loop',
      point: '训练循环五步：照抄就能跑',
      formalDef:
        '每批：清零梯度→前向算 loss→反向传播→优化器更新。这五步顺序固定，是所有深度学习训练的骨架。',
      fixed: `opt.zero_grad()              # 1. 清梯度
loss = loss_fn(model(x), y)  # 2. 前向
loss.backward()              # 3. 反向求梯度
opt.step()                   # 4. 更新参数`,
      variable: '模型、loss 函数、优化器可变；五步顺序固定。',
      examples: [
        {
          code: `# loss 曲线：从 2.3 逐步降到 0.4`,
          output: `# 没降就是学习率/数据有问题`,
          note: 'loss 必须整体趋势下降。',
        },
      ],
      rookie: '忘了 opt.zero_grad()，梯度会累加，训不出来。',
      realWorld: 'CNN/Transformer 训练循环都长这样。',
    },
  ],

  'dl-2': [
    {
      id: 'dl2-save',
      point: '保存加载与推理：训完怎么用',
      formalDef:
        '训完存 model.state_dict()（只存权重）；部署时 load 回来，调 eval() 关 dropout，用 torch.no_grad() 推理省显存。',
      fixed: `torch.save(model.state_dict(), "m.pt")
model.load_state_dict(torch.load("m.pt"))
model.eval()
with torch.no_grad(): pred = model(x)`,
      variable: '文件名、模型可变。',
      examples: [
        {
          code: `# eval() 后 dropout 关闭，输出稳定`,
          output: `# no_grad 不算梯度，推理快一半`,
          note: '训练和推理用不同开关。',
        },
      ],
      rookie: '存整个 model 而不是 state_dict，跨版本加载报错。官方推荐只存权重。',
      realWorld: '模型部署的标准第一步。',
    },
  ],

  'dl-3': [
    {
      id: 'dl3-hf',
      point: '自注意力与 HuggingFace：别手搓，会用就行',
      formalDef:
        '自注意力：每个词和句子里所有词算相关度加权汇总，这是 Transformer 的核心。新手别手搓，用 HuggingFace 预训练模型即可。',
      fixed: `from transformers import AutoTokenizer, AutoModel
tok = AutoTokenizer.from_pretrained("模型名")
mdl = AutoModel.from_pretrained("模型名")`,
      variable: '换不同预训练模型名即可。',
      examples: [
        {
          code: `# 加载中文模型，一句话变 embedding`,
          output: `# 预训练模型已经在海量数据上学好，微调即用`,
          note: '这就是为什么大模型“拿来就能用”。',
        },
      ],
      rookie: '想从零训练一个大模型——你没那么多卡和数据。用预训练 + 微调。',
      realWorld: 'RAG、分类、摘要的底座都是 HF 预训练模型。',
    },
  ],

  // ============ 大模型应用 ============
  'llm-0': [
    {
      id: 'llm0-prompt',
      point: 'Prompt 三要素：角色、任务、输出格式',
      formalDef:
        '好 Prompt 三件套：你是谁（角色）、做什么（任务）、输出成什么样（格式）。要 JSON 就给 schema，要稳定就给 1-2 个示例（few-shot）。',
      fixed: `你是客服助手。
只回答订单相关内容。
输出严格 JSON：{"answer":"...","need_human":true/false}
用户问题：{input}`,
      variable: '角色、任务、输出格式可变。',
      examples: [
        {
          code: `# 不给格式 → 模型自由发挥，前后不一致
# 给了 JSON schema → 每次都能被程序解析`,
          output: `# 工程上 Prompt 的目标是“稳定可解析”`,
          note: '改 Prompt 要固定几条测试用例回归。',
        },
      ],
      rookie: '把模型当聊天机器人随便问，结果不可控。工程 Prompt 要结构化。',
      realWorld: '所有 LLM 应用的入口都是一份精心设计的 Prompt。',
    },
  ],

  'llm-1': [
    {
      id: 'llm1-embed',
      point: '切块与入库：RAG 第一步',
      formalDef:
        '文档按固定长度（如 500 token）+ 重叠（50 token）切块，每块用 Embedding 模型转向量，连同原文和元数据存进向量库。',
      fixed: `chunks = 文档按 500 字 + 50 字重叠切
for c in chunks:
    db.insert(向量(c), 原文=c, 来源=标题)`,
      variable: '块大小按内容调。',
      examples: [
        {
          code: `# 块太大 → 检索进无关内容；太小 → 上下文不全`,
          output: `# 500 token + 50 重叠是常用起点`,
          note: '重叠防止句子被腰斩。',
        },
      ],
      rookie: '整篇文档一块入库，检索精度极差。先切块。',
      realWorld: 'RAG 数据处理流水线的核心。',
    },
  ],

  'llm-2': [
    {
      id: 'llm2-rag',
      point: 'RAG 循环：检索→拼 Prompt→生成',
      formalDef:
        '问题向量化→向量库取 top_k 相关片段→把片段拼进 Prompt→让模型基于资料回答。引用来源就是把片段元数据一起返回。',
      fixed: `chunks = vdb.search(question, top_k=3)
prompt = f"根据资料回答：{chunks}\\n问题：{question}"
answer = llm(prompt)`,
      variable: 'top_k、资料模板可变。',
      examples: [
        {
          code: `# 资料里没有，模型会说“根据资料无法回答”`,
          output: `# 而不是瞎编——这就是减少幻觉`,
          note: '让它基于给定资料答，而非凭记忆。',
        },
      ],
      rookie: '直接让大模型回答公司内部问题，它没见过就瞎编。RAG 给它资料。',
      realWorld: '企业知识库助手的标准链路。',
    },
  ],

  'llm-3': [
    {
      id: 'llm3-fc',
      point: 'Function Calling：让模型自己决定调工具',
      formalDef:
        '你告诉模型有哪些工具及参数，模型自己判断该调哪个、传什么参数；你的程序执行工具，把结果交回模型继续。这个循环就是 Agent。',
      fixed: `tools = [{name:"get_order", params:{id:"string"}}]
# 模型: "要调 get_order"
result = 执行工具(参数)
# 把 result 再喂回模型生成人话`,
      variable: '定义哪些工具可变。',
      examples: [
        {
          code: `用户: "我的订单到哪了？"`,
          output: `# 模型自己选 get_order 并填好订单号，程序去查，结果返回`,
          note: '模型不直接回答，而是“决定调用哪个函数”。',
        },
      ],
      rookie: '以为 Agent 是模型自己连数据库——它只是输出“要调什么”，真正执行的是你的代码。',
      realWorld: 'Copilot、AI 客服、自动订票都靠 Function Calling。',
    },
  ],

  // ============ 部署 ============
  'deploy-0': [
    {
      id: 'dp0-service',
      point: '推理服务：为什么模型启动时加载一次',
      formalDef:
        '推理服务 = FastAPI 包装 predict。模型在启动时加载一次常驻内存，每个请求直接用它，而不是每次请求都重新加载。',
      fixed: `app = FastAPI()
model = load_model()   # 启动时一次
@app.post("/predict")
def predict(x): return model(x)`,
      variable: '模型、输入可变。',
      examples: [
        {
          code: `# 每次请求都 load_model() → 慢且崩`,
          output: `# 启动加载一次 → 每个请求几十毫秒`,
          note: '模型加载是重活，别放请求里。',
        },
      ],
      rookie: '在路由函数里 load_model，每个请求重载，吞吐骤降。',
      realWorld: '所有 ML 部署服务都这么写。',
    },
  ],

  'deploy-1': [
    {
      id: 'dp1-vllm',
      point: 'vLLM 与量化：大模型怎么加速',
      formalDef:
        '大模型慢在逐 token 生成。vLLM 用 PagedAttention 把多个请求拼一起批处理；量化（INT8/INT4）把权重变小、显存降一半，精度略损。',
      fixed: `# 知道概念：
vLLM = 连续批处理，吞吐翻几倍
量化 = FP32→INT8，显存减半`,
      variable: '知道为什么即可。',
      examples: [
        {
          code: `# 一张 A100 跑原生 transformers 几 QPS`,
          output: `# 换 vLLM 能到几十 QPS`,
          note: '不是模型变小，是调度变聪明。',
        },
      ],
      rookie: '以为量化是“压缩图片”——它是把数字精度从 32 位降到 8 位换显存。',
      realWorld: '线上大模型推理几乎都用 vLLM/TensorRT-LLM。',
    },
  ],

  'deploy-2': [
    {
      id: 'dp2-monitor',
      point: '上线监控：P95、QPS、效果漂移',
      formalDef:
        '延迟看 P95（95% 请求在它以下完成）；吞吐看 QPS；效果随时间会因数据漂移变差，要定期自动评测回归。',
      fixed: `P95 延迟   # 不是平均值，是“最慢的那批”
QPS       # 每秒请求数
效果评测  # 定期跑测试集`,
      variable: '指标阈值按业务定。',
      examples: [
        {
          code: `# 平均 100ms 但 P95 2s → 少数用户很卡`,
          output: `# 老板看平均值会错过严重问题`,
          note: 'P95/P99 比平均值重要。',
        },
      ],
      rookie: '只看平均延迟，长尾用户体验灾难。',
      realWorld: 'SRE/后端上线必配监控告警。',
    },
  ],

  // ============ Web ============
  'web-0': [
    {
      id: 'web0-box',
      point: '盒模型与 Flex/Grid：布局怎么来的',
      formalDef:
        '每个元素是个盒子：content + padding + border + margin。Flex 管一维（一排），Grid 管二维（行列）。',
      fixed: `.layout { display: grid; grid-template-columns: 200px 1fr; }
/* Flex: display: flex; gap: 8px; */`,
      variable: '列宽、方向可变。',
      examples: [
        {
          code: `<div class="layout">
  <aside>侧边栏</aside>
  <main>主内容</main>
</div>`,
          output: `# 左边200px固定，右边占满剩余`,
          note: '1fr 表示“剩下的都给我”。',
        },
      ],
      rookie: '用 margin 硬调位置，一改全乱。用 Flex/Grid 自动排。',
      realWorld: '所有网页布局本质是这两套。',
    },
  ],

  'web-1': [
    {
      id: 'web1-responsive',
      point: '媒体查询：同一套代码手机/桌面都好看',
      formalDef:
        '响应式 = 根据屏幕宽度切换样式。@media 定义在“屏幕宽于某值”时套用什么布局。',
      fixed: `.card-list { grid-template-columns: 1fr; }        /* 手机单列 */
@media (min-width: 768px) {
  .card-list { grid-template-columns: 1fr 1fr; }    /* 桌面两列 */
}`,
      variable: '断点 768px 可调。',
      examples: [
        {
          code: `# 手机宽<768 → 一列；拉宽到桌面 → 两列`,
          output: `# 同一个网址自动适配`,
          note: '不用做两个网站。',
        },
      ],
      rookie: '写死 px 宽度，手机上横向滚动。用相对单位 + 媒体查询。',
      realWorld: '移动端优先是现在的默认写法。',
    },
  ],

  'web-2': [
    {
      id: 'web2-fetch',
      point: 'fetch 与 async/await：前端怎么拿数据',
      formalDef:
        'fetch 发请求，await 等它回来，再 .json() 解析。async/await 让异步代码读起来像同步。',
      fixed: `const r = await fetch("/api/data");
const data = await r.json();
el.textContent = JSON.stringify(data);`,
      variable: '请求哪个接口、渲染到哪可变。',
      examples: [
        {
          code: `button.onclick = async () => {
  const r = await fetch("/api/data");
  const d = await r.json();
  console.log(d);
};`,
          output: `# 点按钮 → 请求 → 把结果打出来`,
          note: '没 await 会先拿到 Promise 而非数据。',
        },
      ],
      rookie: '忘了 await，拿到的是 Promise 对象。fetch 失败要 try/catch。',
      realWorld: '前端所有数据加载都是这三段。',
    },
  ],

  // ============ Vue ============
  'vue-0': [
    {
      id: 'vue0-ref',
      point: 'ref 与指令：Vue3 响应式怎么写',
      formalDef:
        'ref() 包一个响应式变量，模板里自动解包（不用 .value），JS 里改要 .value。指令 v-if 显隐、v-for 循环、@ 事件、: 绑定属性。',
      fixed: `const count = ref(0)
<button @click="count++">{{ count }}</button>
<li v-for="item in list" :key="item.id">{{ item.name }}</li>`,
      variable: '变量名、模板内容可变。',
      examples: [
        {
          code: `count.value = 10   // JS里改要.value
// 模板里 {{ count }} 自动变 10`,
          output: `# 一改页面自动更新`,
          note: '模板免 .value，脚本里要。',
        },
      ],
      rookie: 'JS 里写 count = 10 而不是 count.value = 10，页面不更新。',
      realWorld: 'Vue3 所有页面都这么写。',
    },
  ],

  'vue-1': [
    {
      id: 'vue1-props',
      point: 'props / emit：父子组件怎么通信',
      formalDef:
        '父传子用 props（defineProps），子通知父用 emit（defineEmits）。数据像水流：父→子靠 props，子→父靠事件。',
      fixed: `// 子组件
const props = defineProps({ title: String })
const emit = defineEmits(['done'])
// 父组件
<Child :title="t" @done="onDone" />`,
      variable: '传什么、发什么事件可变。',
      examples: [
        {
          code: `# 点子组件里的删除按钮 → emit('delete', id)`,
          output: `# 父组件 @delete 接住并从列表删`,
          note: '子组件不直接改父数据，只发消息。',
        },
      ],
      rookie: '在子组件里直接改 props，违反单向数据流。子只能 emit。',
      realWorld: '任何组件库都靠 props/emit 设计 API。',
    },
  ],

  'vue-2': [
    {
      id: 'vue2-pinia',
      point: 'Pinia 与路由：共享状态和页面跳转',
      formalDef:
        '组件多了，登录用户这种全局状态放 Pinia store，不用一层层传；Vue Router 管 URL 和页面的对应。',
      fixed: `export const useUser = defineStore('user', () => ({ name: '' }))
const user = useUser(); user.name = '张三'`,
      variable: '存什么状态可变。',
      examples: [
        {
          code: `# 任何组件改 user.name，所有用到的地方自动更新`,
          output: `# 不用一层层 props 传`,
          note: '这就是“全局状态管理”。',
        },
      ],
      rookie: '所有状态从根组件一层层 props 传（prop drilling），三层就痛苦。用 Pinia。',
      realWorld: '中大型 Vue 应用标配 Pinia + Router。',
    },
  ],

  // ============ React ============
  'react-0': [
    {
      id: 'rct0-jsx',
      point: 'JSX 与 Props：组件就是返回 UI 的函数',
      formalDef:
        '组件是个函数，接收 props（只读参数），返回 JSX。JSX 里写 className 不是 class，用 {} 嵌表达式。',
      fixed: `function Card({ title, children }) {
  return <div className="card"><h3>{title}</h3>{children}</div>
}
// 用：<Card title="订单1">状态</Card>`,
      variable: '传什么 props 可变。',
      examples: [
        {
          code: `<Button variant="danger">删除</Button>
// 组件里根据 variant 决定颜色`,
          output: `# 同一个组件传不同 props 出不同样式`,
          note: '组件复用靠 props。',
        },
      ],
      rookie: '在 JSX 里写 class= → 不生效，要写 className。',
      realWorld: 'React 整个生态都是组件树。',
    },
  ],

  'react-1': [
    {
      id: 'rct1-hooks',
      point: 'useState / useEffect：状态和副作用',
      formalDef:
        'useState 存会变的状态（改它触发重渲染）；useEffect 处理渲染之外的事（定时器、请求），返回函数做清理。',
      fixed: `const [count, setCount] = useState(0);
useEffect(() => {
  const t = setInterval(() => setCount(c => c+1), 1000);
  return () => clearInterval(t);
}, []);`,
      variable: '存什么、做什么副作用可变。',
      examples: [
        {
          code: `# 点按钮 setCount(c=>c+1)`,
          output: `# count 变 → 组件自动重新渲染`,
          note: '别直接改 count，要用 setCount。',
        },
      ],
      rookie: '忘记写清理函数，组件卸载后定时器还在跑（内存泄漏）。',
      realWorld: '几乎每个 React 组件都用这两个 Hook。',
    },
  ],

  'react-2': [
    {
      id: 'rct2-router',
      point: '路由与全局状态：React 怎么拼多页应用',
      formalDef:
        'React Router 管 URL 和页面组件的对应；小项目 useState 够，大项目用 Zustand/Redux 存全局状态。Vite 负责构建。',
      fixed: `# /skills → <SkillsPage/>
# /projects → <ProjectsPage/>`,
      variable: '页面、路由表可变。',
      examples: [
        {
          code: `# 你现在看到的侧边栏切换，就是在换路由`,
          output: `# URL 变了，页面跟着变`,
          note: '这就是 SPA 单页应用。',
        },
      ],
      rookie: '用条件渲染手搓页面切换，URL 都不变。用 React Router。',
      realWorld: '企业 React 应用 = Vite + Router + 状态管理。',
    },
  ],

  // ============ 工程素养 ============
  'review-0': [
    {
      id: 'rv0-naming',
      point: '可读性：命名和拆分',
      formalDef:
        '命名见意（userCount 不要 uc）；一个函数只做一件事，超 20 行考虑拆；注释写“为什么”，不写“做了什么”（代码自己会说）。',
      fixed: `# 差: uc, d()
# 好: userCount, calcDiscount()
# 坏注释: // i 加 1
# 好注释: // 边界为空时默认0`,
      variable: '具体名可变。',
      examples: [
        {
          code: `# 注释“为什么这样做”才值钱`,
          output: `# 三个月后你会感谢当时的自己`,
          note: '代码讲怎么做，注释讲为什么。',
        },
      ],
      rookie: '变量名 a、b、tmp，一周后自己都看不懂。',
      realWorld: '读代码时间远多于写代码，可读性是职业素养。',
    },
  ],

  'review-1': [
    {
      id: 'rv1-test',
      point: '单元测试：测正常、边界、异常',
      formalDef:
        '测试三类用例：正常输入、边界输入（0/空/超大）、异常输入。测行为不测实现，覆盖率不是目的，关键路径有测试才是。',
      fixed: `test("正常: 100打8折=80", ...)
test("边界: 0元返回0", ...)
test("异常: 负价报错", ...)`,
      variable: '业务逻辑可变。',
      examples: [
        {
          code: `# 改了老代码，测试全绿才敢上线`,
          output: `# 测试是“安全网”`,
          note: '没测试的重构等于赌博。',
        },
      ],
      rookie: '只测“正常能跑”，边界一塌糊涂。边界用例最容易出 bug。',
      realWorld: '企业 CI 强制跑测试，不过不让合并。',
    },
  ],

  'review-2': [
    {
      id: 'rv2-review',
      point: 'Code Review：怎么提建设性意见',
      formalDef:
        'Review 不是挑刺：先说这段解决了什么，再说哪里可能有问题，对事不对人，附建议方案（“要不改成 X？”）。',
      fixed: `“这块很好地解决了 X”
“这里如果 Y 很大会不会有问题？要不改成 Z？”`,
      variable: '具体意见可变。',
      examples: [
        {
          code: `# 差: “这写的什么垃圾”
# 好: “数据量大时这个循环可能慢，建议用字典统计”`,
          output: `# 给出方案，而不是只批评`,
          note: '让作者舒服地接受改进。',
        },
      ],
      rookie: '只说“有问题”不说怎么改，作者无法行动。',
      realWorld: '大厂每个 PR 都要评审，会 review 也是能力。',
    },
  ],

  // ============ 技术文档 ============
  'docs-0': [
    {
      id: 'doc0-story',
      point: '用户故事与验收标准：把模糊需求拆清楚',
      formalDef:
        '用户故事模板：作为 X，我想 Y，以便 Z。验收标准（AC）是一条条可勾选的、可判定对错的条件。',
      fixed: `作为 用户
我想 创建订单
以便 买到想要的东西
AC: 1.选商品后能下单 2.订单生成 3.看到状态`,
      variable: '具体故事可变。',
      examples: [
        {
          code: `# 模糊: “做个待办App”`,
          output: `# 拆成: 能添加/完成/删除待办，每条3条可验收`,
          note: '能写成勾选项才算清楚。',
        },
      ],
      rookie: '验收标准写“界面美观”——没法判断。要写可验证的。',
      realWorld: '产品经理的需求就是这么拆成开发任务的。',
    },
  ],

  'docs-1': [
    {
      id: 'doc1-design',
      point: '技术方案四段式：背景/方案/影响面/风险',
      formalDef:
        '写方案不是上来就写代码：①背景为什么做 ②方案怎么做（画个图）③影响面改了哪些模块 ④风险与回滚出问题怎么办。',
      fixed: `1. 背景
2. 方案（含架构图）
3. 影响面
4. 风险 & 回滚`,
      variable: '具体内容可变。',
      examples: [
        {
          code: `# 只写“用Redis缓存”不写风险，出问题谁负责？`,
          output: `# 风险段写“缓存挂了直接打DB”的降级方案`,
          note: '想到最坏情况。',
        },
      ],
      rookie: '直接开始写代码，事后发现影响了别的模块。先写方案再动手。',
      realWorld: '中大型改动前都要过技术评审。',
    },
  ],

  'docs-2': [
    {
      id: 'doc2-retro',
      point: '复盘：结果/归因/改进',
      formalDef:
        '复盘三问：结果怎样（数据）、为什么（归因）、下次怎么做（action：谁、什么时候）。不是流水账也不是检讨会。',
      fixed: `结果: 上线晚2天
归因: 第三方接口延期，没提前留缓冲
改进: 下次排期预留2天缓冲（我负责）`,
      variable: '具体事件可变。',
      examples: [
        {
          code: `# 差: “这次大家辛苦了”
# 好: “下次X月前加一个依赖检查清单”`,
          output: `# action 必须有人、有时间`,
          note: '没人没时间的改进等于没说。',
        },
      ],
      rookie: '复盘写成检讨甩锅。对事不对人，聚焦下次怎么避免。',
      realWorld: '每个项目结束都开复盘，沉淀经验。',
    },
  ],

  // ============ 敏捷 ============
  'agile-0': [
    {
      id: 'ag0-standup',
      point: '站会与迭代：小步快跑',
      formalDef:
        '一个迭代（1-2周）做一批事；每天站会三句：昨天做了什么、今天做什么、有什么卡住。看板分 To Do/Doing/Done。',
      fixed: `站会三问:
1. 昨天完成了什么
2. 今天计划做什么
3. 有什么阻碍`,
      variable: '迭代长度按团队定。',
      examples: [
        {
          code: `# 看板: To Do → Doing → Done`,
          output: `# 谁在做什么一眼可见`,
          note: '别让任务一直堆在 Doing。',
        },
      ],
      rookie: '站会开成汇报大会讲细节。站会只讲三句，问题会后聊。',
      realWorld: '互联网研发主流节奏。',
    },
  ],

  'agile-1': [
    {
      id: 'ag1-split',
      point: '拆任务：怎么算“够小”',
      formalDef:
        '好任务：一个迭代能做完、能演示、能验收。“学 Python”太大，“写一个带函数和文件读写的 score.py 并测通”才够小。',
      fixed: `# 大: “学会数据分析”
# 小: “用pandas读CSV并groupby统计UV，3天完成”`,
      variable: '具体任务可变。',
      examples: [
        {
          code: `# 3天做不完 = 还要再拆`,
          output: `# 能演示才算完成`,
          note: '拆到“2-3天能做完”为标准。',
        },
      ],
      rookie: '任务写“完成模块开发”，两周后不知道做到哪。',
      realWorld: '敏捷排全靠拆任务的颗粒度。',
    },
  ],

  'agile-2': [
    {
      id: 'ag2-report',
      point: '汇报公式：结论先行 + 风险求助',
      formalDef:
        '汇报公式：结论先行 + 数据支撑 + 下一步 + 风险求助。卡住别硬扛三天，越早暴露越多人能帮。',
      fixed: `结论: X已完成/卡住
数据: 进度60%
下一步: 明天做Y
风险: 卡在Z，试了A/B，想找人讨论`,
      variable: '具体内容可变。',
      examples: [
        {
          code: `# 专业求助: “我卡在X，试了A/B不行，想找Y讨论”`,
          output: `# 不是“做不出来”，而是带着尝试求助`,
          note: '暴露问题不丢人，藏到上线才丢人。',
        },
      ],
      rookie: '先说一堆背景最后才说结论，听的人早烦了。第一句就给结论。',
      realWorld: '向上汇报、周报都按这个公式写。',
    },
  ],
};
