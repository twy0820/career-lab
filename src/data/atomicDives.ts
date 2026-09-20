// 原子级深讲（分段持续追加）：比 lessonDeepDives.ts 更细，逐符号拆解。
// key = lessonId。LessonDialog 会优先展示这里的条目，再合并基础版，按 id 去重。
import type { ILessonDeepDive } from './types';

export const ATOMIC_DIVES: Record<string, ILessonDeepDive[]> = {
  // ==================== python-0 ====================
  'python-0': [
    {
      id: 'py0-var-assign',
      point: '变量与赋值：price = 99.5 到底发生了什么',
      formalDef:
        '把这一行拆成两半：= 右边先算出来一个值（99.5，一个小数），左边是给这个值起的名字（price）。= 不是“等于”，而是“把右边的值贴到左边的名字上”。变量不是盒子，更像一张写着名字的便利贴，贴在某个值上；换个值就是把便利贴撕下来贴到新值上。',
      fixed: `名字 = 值        # 把右边的值，贴到左边这个名字上
price = 99.5      # 现在 price 这个名字指着 99.5
price = 120       # 重新贴：price 现在指着 120`,
      variable: '左边起什么名、右边放什么值都可变。= 这个符号固定表示“赋值”。',
      examples: [
        {
          code: `price = 99.5
print(price)
price = 120          # 不是“price 等于 120”，是“改成 120”
print(price)`,
          output: `99.5
120`,
          note: '同一个名字可以反复贴到不同值上。',
        },
        {
          code: `a = 1
b = a        # 把 a 现在指着的值（1）贴给 b
a = 99
print(a, b)  # a 改了，b 不受影响`,
          output: `99 1`,
          note: 'b = a 是把“a 当前的值”抄一份给 b，不是让 b 永远跟着 a。',
        },
      ],
      rookie: '把 = 当成数学里的“等于”——其实它是“贴标签/赋值”。判断两个值是否相等要用两个等号 ==。',
      realWorld: '读数据时 price = row["price"]、name = row["name"]，全是这种“把右边的值贴到左边名字上”。',
    },
    {
      id: 'py0-if-elif',
      point: 'if / elif / else：条件判断怎么一层一层问',
      formalDef:
        'if 后面跟一个“真/假”的条件，条件成立（True）就执行缩进里的代码；elif 是“否则如果”，在上一个不成立时再问一句；else 是“以上都不成立”的兜底。程序从上往下问，碰到第一个成立的就执行它那一块，然后整段结束。',
      fixed: `if 条件1:        ← 末尾冒号
    条件1成立时做的事
elif 条件2:      ← 只有条件1不成立才轮到它
    条件2成立时做的事
else:            ← 以上都不成立
    兜底做的事`,
      variable: '条件写什么、里面做什么都可变；elif 可以有多个也可以没有，else 也可以没有。',
      examples: [
        {
          code: `price = 99.5
if price > 100:        # 99.5 > 100？假
    print("贵了")
elif price > 50:       # 99.5 > 50？真 → 走这里
    print("还行")
else:
    print("划算")`,
          output: `还行`,
          note: '第一个 if 不成立，才轮到 elif；一旦 elif 成立，后面的 else 就不再看。',
        },
        {
          code: `# 比较符号：> 大于  < 小于  >= 大于等于  <= 小于等于
# == 相等  != 不等
x = 10
print(x == 10, x != 10, x >= 5)`,
          output: `True False True`,
          note: '== 是“问等不等”，= 是“赋值”，两个长得像但完全不同。',
        },
      ],
      rookie: '在 if 那一行末尾忘了冒号 : → SyntaxError；或者下一行忘了缩进。看到 SyntaxError 先检查这两点。',
      realWorld: '订单金额判断、分数及格判断、接口返回码判断，全是 if/elif/else 一层层问。',
    },
    {
      id: 'py0-def',
      point: 'def 函数：把一段操作打包，起个名字，随时调用',
      formalDef:
        'def 是 define（定义）的缩写。def total(items, discount=0.9): 的意思是：“我定义一个叫 total 的工具，用它的时候要给它 items，discount 不给就默认 0.9”。函数体（缩进的部分）在你调用 total(...) 之前不会执行；return 是“算完把结果交出去”，交出去后函数就结束。',
      fixed: `def 函数名(参数1, 参数2=默认值):
    做一些事
    return 结果          ← 把结果交还给调用处`,
      variable: '函数名、参数、默认值、return 什么都可变；def、括号、冒号、return 这些关键字固定。',
      examples: [
        {
          code: `def total(items, discount=0.9):   # discount 不给就用 0.9
    s = sum(x["price"] for x in items)
    return round(s * discount, 2)

cart = [{"name": "书", "price": 30}, {"name": "笔", "price": 5}]
print(total(cart))        # discount 用默认 0.9
print(total(cart, 0.8))   # 手动传 0.8`,
          output: `31.5
28.0`,
          note: '默认参数 discount=0.9 只在你不传它时生效。',
        },
        {
          code: `def add(a, b):
    return a + b
r = add(3, 5)     # 调用：把 3 给 a、5 给 b，拿回结果 8
print(r)`,
          output: `8`,
          note: '调用就是“把参数塞进去，把 return 的结果接出来”。',
        },
      ],
      rookie: '① 定义了不调用，函数体一次都不会跑；② 写了 return 却没接结果（直接 total(cart) 不 print），就拿不到返回值；③ 默认参数别用 list/dict（见 py0-mutable-default）。',
      realWorld: '把“读文件→清洗→统计→输出”每一步各写成一个函数，主流程一行行调用，这就是真实脚本的样子。',
    },
    {
      id: 'py0-list-dict',
      point: 'list / dict / tuple / set：四种容器分别装什么',
      formalDef:
        'list 是有顺序、可改的一列值，用序号取（序号从 0 开始）；dict 是“名字→值”的键值对，用名字取；tuple 写了就不能改（常用来固定一组值）；set 自动去重、不讲顺序。',
      fixed: `列表 list:  [值1, 值2]            取: 列表[0]   加: 列表.append(值)
字典 dict:  {"键": 值}             取: 字典["键"] 改: 字典["键"]=新值
元组 tuple: (值1, 值2)            取: 元组[0]    不能改
集合 set:   {值1, 值2}            自动去重`,
      variable: '里面放什么、放几个都可变；方括号/花括号/圆括号决定它是哪种容器。',
      examples: [
        {
          code: `names = ["张三", "李四", "王五"]   # list
print(names[0], names[2])
names.append("赵六")

user = {"name": "张三", "age": 20}     # dict
print(user["name"])
user["age"] = 21`,
          output: `张三 王五
张三`,
          note: 'list 用序号（从 0），dict 用键名。',
        },
        {
          code: `seen = {1, 2, 2, 3, 3, 3}   # set 自动去重
print(seen)
row = ("北京", 2026)             # tuple 固定一组值
print(row[0])`,
          output: `{1, 2, 3}
北京`,
          note: 'tuple 一旦写好就不能改，适合表示“不会变的一组”。',
        },
      ],
      rookie: 'list 序号从 0 开始，names[2] 是第三个不是第二个；dict 取不存在的键会 KeyError，先用 if "键" in d 判断。',
      realWorld: 'CSV 每一行常表示成 dict（列名→值），所有行放一个 list 里——这就是最常见的数据形态。',
    },
    {
      id: 'py0-with-open',
      point: 'with open(...) as f：读文件为什么能自动关',
      formalDef:
        'open("result.txt", "w") 是“打开文件”，返回一个文件对象 f。普通写法打开后必须 f.close()，忘了就会占用资源。with ... as f 是“用完自动关门”：缩进块里随便读写，块一结束 Python 自动帮你 close，哪怕中间报错也会关。',
      fixed: `读:  with open("文件路径", "r", encoding="utf-8") as f:
         内容 = f.read()
写:  with open("文件路径", "w", encoding="utf-8") as f:
         f.write("要写的内容")`,
      variable: '文件名、"r"读/"w"写、写什么内容都可变；with...as f 和缩进块是固定套路。',
      examples: [
        {
          code: `# 写文件：把结果存到 result.txt
with open("result.txt", "w", encoding="utf-8") as f:
    f.write("平均分: 80.3\\n")
    f.write("不及格: 张三\\n")`,
          output: `# result.txt 里现在有两行`,
          note: '\\n 是换行；encoding="utf-8" 防止中文乱码。',
        },
        {
          code: `# 读文件：一行行读
with open("result.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())`,
          output: `平均分: 80.3
不及格: 张三`,
          note: 'for line in f 逐行读；strip() 去掉行尾换行。',
        },
      ],
      rookie: '① 写中文不加 encoding="utf-8" 在 Windows 上常乱码；② "w" 会直接覆盖原文件，想追加用 "a"；③ 不用 with 又忘了 close，文件可能没真正写进去。',
      realWorld: '读日志 CSV、把分析结果写成 txt/md 报告，全是 with open 这套。',
    },
    {
      id: 'py0-try-except',
      point: 'try / except：出错时别让整个程序崩',
      formalDef:
        'try 里放“可能出错的代码”；万一真出错，程序不会直接崩，而是跳到 except 里你写的兜底代码。裸 except: 会把所有错都吞掉（包括你想知道的 bug），所以要写明抓哪类错。',
      fixed: `try:
    可能出错的代码
except 错误类型:
    出错时执行的兜底`,
      variable: '抓什么错、兜底做什么都可变；try/except 结构固定。',
      examples: [
        {
          code: `try:
    n = int("abc")        # "abc" 转不成整数，会报错
except ValueError:
    print("转整数失败，给个默认值 0")
    n = 0
print(n)`,
          output: `转整数失败，给个默认值 0
0`,
          note: 'int("abc") 会抛 ValueError，被 except 接住。',
        },
        {
          code: `# 反例：裸 except 会吞掉所有错，别这么写
try:
    do_something()
except:
    pass          # 出了什么错你完全不知道`,
          output: `# 调试时根本看不出哪里坏了`,
          note: '要么写明 except ValueError，要么 except Exception as e: print(e) 把错误打出来。',
        },
      ],
      rookie: 'except 后面不写类型（裸 except）→ 把所有错误都藏起来，出了 bug 查不到。',
      realWorld: '读文件、调接口、解析 JSON 都可能失败，外层套 try/except 保证一条数据坏了不拖垮整个批处理。',
    },
    {
      id: 'py0-mutable-default',
      point: '坑：可变默认参数 def f(x=[]) 为什么危险',
      formalDef:
        '默认值 [] 在函数定义时只创建一次，之后每次调用都共用同一个 list。你往里面 append，下次调用它还在——这就是“可变默认参数”坑。解决办法：默认值用 None，函数内部再新建。',
      fixed: `# 危险写法
def f(x=[]):
    x.append(1)
    return x

# 安全写法
def f(x=None):
    if x is None:
        x = []
    x.append(1)
    return x`,
      variable: '业务逻辑可变；“默认值用 None，内部新建”这个写法固定。',
      examples: [
        {
          code: `def bad(x=[]):
    x.append(1)
    return x
print(bad())   # [1]
print(bad())   # [1, 1]  ← 你以为是新的空 list，其实还是那个`,
          output: `[1]
[1, 1]`,
          note: '两次调用共用了同一个默认 list。',
        },
        {
          code: `def good(x=None):
    if x is None:
        x = []
    x.append(1)
    return x
print(good())   # [1]
print(good())   # [1]  ← 每次都是新 list`,
          output: `[1]
[1]`,
          note: '默认参数永远别用 []/{}，用 None。',
        },
      ],
      rookie: '面试高频题：“为什么默认参数别用可变对象”——答案就是上面这个共享问题。',
      realWorld: '写工具函数时记住：默认值写 None，函数体内 if x is None: x = []。',
    },
  ],

  // ==================== python-1 ====================
  'python-1': [
    {
      id: 'py1-class',
      point: 'class 类：把“数据 + 操作数据的方法”打包成一个模具',
      formalDef:
        'class Order 是造一种叫 Order 的“模具”；o = Order("A1", 200) 是按模具捏出一个具体的“东西”（实例）。__init__ 是捏东西时自动跑的初始化函数，负责把传进来的参数存到这个东西身上；self 就是“这个东西自己”，self.amount 表示“把 200 存在这个实例身上的 amount 字段”。',
      fixed: `class 类名:
    def __init__(self, 参数):     # 捏实例时自动跑
        self.字段 = 参数           # 把数据存到自己身上
    def 方法(self, 参数):          # 这个类能干的事
        return self.字段 * 参数

实例 = 类名(参数)                  # 按模具捏一个具体的`,
      variable: '类名、字段名、方法名、方法逻辑都可变；class、__init__、self 这套结构固定。',
      examples: [
        {
          code: `class Order:
    def __init__(self, order_id, amount):
        self.order_id = order_id    # 存到自己身上
        self.amount = amount
    def discount(self, rate):
        return round(self.amount * rate, 2)

o = Order("A1", 200)     # __init__ 自动跑，self.amount=200
print(o.order_id)        # 取身上存的数据
print(o.discount(0.8))   # 调身上的方法`,
          output: `A1
160.0`,
          note: 'o.xxx 取自己身上的数据；o.方法() 调自己的能力。',
        },
        {
          code: `# 同一个模具捏两个不同的实例，互不干扰
o1 = Order("A1", 200)
o2 = Order("A2", 500)
print(o1.amount, o2.amount)`,
          output: `200 500`,
          note: '每个实例各存各的数据，self 指当前调用它的那个实例。',
        },
      ],
      rookie: '方法第一个参数必须写 self（调用时不用传，Python 自动把实例自己传进去）；忘了 self 就存不住数据。',
      realWorld: 'Report 类管一份报告，Order 类管一个订单，User 类管一个用户——把“这个东西有哪些数据、能干哪些事”写进一个类，代码就不乱。',
    },
    {
      id: 'py1-venv',
      point: '虚拟环境 venv：为什么每个项目要单独装包',
      formalDef:
        'pip install 会把包装到你电脑全局环境里。项目多了，A 项目要 requests 2.x、B 项目要 requests 2.30，就打架。venv（virtual environment）就是给每个项目单独建一个“隔离小房间”，这个项目装的包只在这个房间里，不影响别人。',
      fixed: `# 建一个叫 .venv 的小房间（每个项目建一次）
python -m venv .venv

# 进入小房间（Windows）
.venv\\Scripts\\activate

# 之后 pip install 的包，都只在这个小房间里
pip install requests`,
      variable: '小房间名字（.venv）可改；命令固定。',
      examples: [
        {
          code: `# 建完、激活后，命令行前面会出现 (.venv)
# (.venv) PS> pip install requests
# (.venv) PS> pip list     # 只看这个项目装了什么`,
          output: `# 退出小房间: deactivate`,
          note: '看到命令行前面有 (.venv) 就说明你在小房间里。',
        },
      ],
      rookie: '忘了激活就 pip install → 包装到全局去了；换台电脑跑不起来，因为别人没装这些包。',
      realWorld: '公司每个项目一个 venv/conda 环境，这是基本工程习惯。',
    },
    {
      id: 'py1-requirements',
      point: 'requirements.txt：把项目依赖清单存下来',
      formalDef:
        'requirements.txt 是一个文本文件，里面写着“这个项目需要哪些包、什么版本”。pip freeze > requirements.txt 把当前小房间里装的所有包导出成这份清单；别人拿到项目，pip install -r requirements.txt 就能一键装齐，不用一个一个猜。',
      fixed: `# 导出当前装的包到清单
pip freeze > requirements.txt

# 别人拿到项目后一键装齐
pip install -r requirements.txt`,
      variable: '文件名固定 requirements.txt；命令固定。',
      examples: [
        {
          code: `# requirements.txt 长这样：
requests==2.31.0
pandas==2.2.2`,
          output: `# 别人跑 pip install -r requirements.txt 就装这两个、这个版本`,
          note: '把这个文件跟着代码一起提交，别人才能复现你的环境。',
        },
      ],
      rookie: '只把代码发出去不发 requirements.txt → 别人跑起来报 ModuleNotFoundError。',
      realWorld: 'Git 提交时必须带上 requirements.txt（或 pyproject.toml）。',
    },
  ],

  // ==================== python-2 ====================
  'python-2': [
    {
      id: 'py2-get',
      point: 'requests.get(url)：从网址拿数据的每一步',
      formalDef:
        'requests.get(url) 做的事：向那个网址发起一次 HTTP 请求，等对方回应，把回应包回来放在 r 里。r.status_code 是状态码（200=成功，404=找不到，500=服务器炸了）；r.text 是返回的原始文本；r.json() 是把返回的 JSON 文本自动翻译成 Python 的 dict/list。',
      fixed: `import requests
r = requests.get(url, timeout=10)   # 发请求，最多等 10 秒
data = r.json()                     # 把返回体变成字典/列表`,
      variable: 'url、timeout 秒数、取哪个字段都可变；get/url/json 这套固定。',
      examples: [
        {
          code: `import requests
r = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
print(r.status_code)
data = r.json()
print(data["stargazers_count"])`,
          output: `200
(一个数字，如 58000)`,
          note: 'r.json() 直接拿到字典，再用 ["键"] 取值。',
        },
        {
          code: `# r.text 是原始文本字符串，r.json() 是翻译后的字典
r = requests.get(url, timeout=10)
print(type(r.text))    # str
print(type(r.json()))   # dict`,
          output: `<class 'str'>
<class 'dict'>`,
          note: '返回是 JSON 就用 r.json()；不是 JSON（比如网页 HTML）就用 r.text。',
        },
      ],
      rookie: '不带 timeout：对方接口一挂，你的程序永远卡在那一行。永远带 timeout。',
      realWorld: '调公司接口、抓公开数据，全是 get(url) → json() → 取字段 这一套。',
    },
    {
      id: 'py2-params-headers',
      point: 'params 和 headers：带参数、带身份去请求',
      formalDef:
        '网址后面 ?q=react 这种查询串，不用手拼，放 params 里 requests 自动拼；headers 是附加请求头，比如 User-Agent 告诉对方“我是谁”，Authorization 放 Token 证明你有权限。',
      fixed: `requests.get(url, params={"键": 值}, headers={"头名": "值"})
# 自动变成: url?键=值，并在请求头里带上 headers`,
      variable: 'params/headers 里放什么都可变。',
      examples: [
        {
          code: `r = requests.get(
    "https://api.github.com/search/repositories",
    params={"q": "react", "sort": "stars"},
    headers={"User-Agent": "my-lab"},
    timeout=10,
)`,
          output: `# 实际请求的网址:
# https://api.github.com/search/repositories?q=react&sort=stars`,
          note: 'params 自动拼成 ?q=react&sort=stars。',
        },
      ],
      rookie: '把 Token 直接写死在代码里、然后提交到 GitHub → Token 泄露，别人能冒充你。放环境变量。',
      realWorld: '公司接口几乎都要 headers={"Authorization": f"Bearer {token}"}。',
    },
    {
      id: 'py2-token-env',
      point: 'Token 放环境变量 os.getenv：别把密码写进代码',
      formalDef:
        'os.getenv("TOKEN") 是“从运行环境里读一个叫 TOKEN 的变量”。把密钥/Token 放代码里，一旦代码上传到 GitHub 就泄露；放环境变量，代码里只写名字，真正的值在你电脑/服务器环境里，跟着代码走不到仓库里。',
      fixed: `import os, requests
token = os.getenv("TOKEN")          # 从环境读，不写死
headers = {"Authorization": f"Bearer {token}"}
requests.get(url, headers=headers, timeout=10)`,
      variable: '变量名 TOKEN 可改；os.getenv 读取方式固定。',
      examples: [
        {
          code: `# 运行前先在终端设置（Windows PowerShell）:
# $env:TOKEN="sk-xxxx"
token = os.getenv("TOKEN")
if token is None:
    raise SystemExit("没设 TOKEN 环境变量")
print("读到长度:", len(token))`,
          output: `读到长度: 8`,
          note: '代码里看不到真正的 Token，只有 os.getenv("TOKEN")。',
        },
      ],
      rookie: '在代码里写 token = "sk-xxxx" 然后 push 到 GitHub → 几小时内就被扫描机器人盗用。',
      realWorld: '所有密钥（数据库密码、API Key、Token）都走环境变量或配置文件，绝不进 Git。',
    },
  ],

  // ==================== python-3 ====================
  'python-3': [
    {
      id: 'py3-read-error',
      point: '报错怎么读：先看最后一行，再找你自己的文件',
      formalDef:
        'Python 报错信息最后一行是“错误类型 + 原因”，往上几行是它在哪一行炸的。先看最后一行知道是什么错，再找堆栈里第一个你自己写的文件名（不是 requests/os 这种库文件）对应的行号——那就是你的锅。',
      fixed: `# 看到这种报错，从上往下找你自己的文件名:
# Traceback (most recent call last):
#   File "xxx", line 1, in <module>
#   File "score.py", line 12, in <module>   ← 你的文件、第 12 行
# KeyError: 'price'                             ← 最后一行: 错误类型+原因`,
      variable: '错的内容不同；读法固定：最后一行看类型，自己文件那行看位置。',
      examples: [
        {
          code: `# 假设 score.py 第 12 行写:
print(row["price"])`,
          output: `KeyError: 'price'
# 意思: row 这个字典里没有 "price" 这个键`,
          note: 'KeyError=键不存在；IndexError=序号越界；NameError=名字没定义；TypeError=类型不对。',
        },
      ],
      rookie: '一看到 Traceback 就慌——它其实是给你指路的：最后一行说什么错，自己文件那行就是出错位置。',
      realWorld: '真实工作 80% 时间是在读报错、改 bug，这是核心技能不是支线。',
    },
    {
      id: 'py3-split-func',
      point: '把一个需求拆成函数：先写流程，再填细节',
      formalDef:
        '拿到“统计 DAU、人均时长”这种需求，别一上来就写细节。先在脑子里列三步：读数据 → 按规则统计 → 输出结果，每步写成一个函数；再逐个填内部实现。主流程就变成几行调用，出问题知道是哪一步的事。',
      fixed: `def load_rows(path): ...        # 第一步: 读
def stats(rows): ...           # 第二步: 算
def report(result): ...        # 第三步: 输出

# 主流程:
rows = load_rows("log.csv")
result = stats(rows)
report(result)`,
      variable: '具体函数名、业务逻辑可变；“读→算→输出”三段拆分固定。',
      examples: [
        {
          code: `# 反例: 全写在一坨, 出 bug 不知道哪坏
# 正例: 拆成小函数, 每个只管一件事
def load_rows(path): return [...]
def stats(rows): return {"dau": 100}
def report(r): print(r)`,
          output: `# 主流程三行, 一眼看懂在干嘛`,
          note: '一个函数只做一件事，出问题先单独测这个函数。',
        },
      ],
      rookie: '把所有逻辑写进一个大函数 → 报错时不知道哪步错。',
      realWorld: '团队代码都是“薄主流程 + 一堆小函数”，方便测试、复用、改。',
    },
  ],

  // ==================== java-0 ====================
  'java-0': [
    {
      id: 'ja0-main',
      point: 'public static void main(String[] args)：这个入口为什么长这样',
      formalDef:
        'Java 程序必须从一个 main 方法开始跑。逐块拆：public 是“公开的”；static 是“不用 new 对象就能直接调用”；void 是“这个方法不返回任何东西”；main 是固定名字（JVM 就认这个）；String[] args 是命令行传给程序的参数。文件名 Cart.java 必须和 public 类名 Cart 一模一样。',
      fixed: `public class 文件名 {
    public static void main(String[] args) {
        // 你的代码从这里开始跑
    }
}`,
      variable: '类名（要和文件名一致）、main 里写什么都可变；public static void main(String[] args) 这串照抄。',
      examples: [
        {
          code: `// Cart.java
public class Cart {
    public static void main(String[] args) {
        System.out.println("你好 Java");
    }
}`,
          output: `# 编译: javac Cart.java  →  生成 Cart.class
# 运行: java Cart         →  打印 你好 Java`,
          note: 'javac 是编译器，把 .java 变成 .class；java 是运行器，跑这个类。注意运行时只写类名 Cart，不带 .class。',
        },
      ],
      rookie: '① 文件名和 public 类名大小写不一致 → 编译错；② main 写成 Main 或少了 static → JVM 找不到入口。',
      realWorld: '每个 Java 程序都从这串 main 开始；Spring Boot 项目里它被框架包成了启动类。',
    },
    {
      id: 'ja0-list-map',
      point: 'ArrayList 和 HashMap：List 和 Map 分别怎么用',
      formalDef:
        'List 是一串有顺序、可重复的元素，用 ArrayList 实现；Map 是“键→值”的字典，用 HashMap 实现。尖括号 <String> / <String,Integer> 是泛型，告诉它这个集合里装的是什么类型的东西——避免装错类型。',
      fixed: `List<String> 名字 = new ArrayList<>();   加: .add(元素)   取: .get(序号)
Map<String,Integer> m = new HashMap<>();  存: .put(键,值)  取: .get(键)`,
      variable: '尖括号里的类型、放什么数据都可变；new ArrayList<>()/HashMap<>() 这套写法固定。',
      examples: [
        {
          code: `List<String> items = new ArrayList<>();
items.add("书");
items.add("笔");
System.out.println(items.get(0));   // 序号从 0

Map<String,Integer> price = new HashMap<>();
price.put("书", 30);
System.out.println(price.get("书"));`,
          output: `书
30`,
          note: 'List 用序号取，Map 用键名取。',
        },
        {
          code: `int total = 0;
for (String s : items) total += price.get(s);
System.out.println("合计：" + total);`,
          output: `合计：30`,
          note: 'for (类型 x : 集合) 是“把集合里每个元素依次叫 x”的简写。',
        },
      ],
      rookie: '取 Map 不存在的键会返回 null（不是报错），后面再用就 NPE；先 containsKey 判断。',
      realWorld: '订单里商品列表用 List，商品名→价格用 Map，是最常见搭配。',
    },
    {
      id: 'ja0-equals',
      point: '== 和 equals()：为什么对象比较要用 equals',
      formalDef:
        '== 对基本类型（int 等）比的是值；但对对象比的是“是不是同一个地址”（同一个 new 出来的东西）。两个 new 出来的内容一样的字符串，== 也可能 false。equals() 比的是“内容是不是一样”。',
      fixed: `基本类型(int)用 == 比值
对象(String等)用 equals() 比内容
"abc".equals(s)   ← 把字面量放左边，防止 s 是 null`,
      variable: '比较的内容可变；基本类型用 ==、字符串用 equals 这个规则固定。',
      examples: [
        {
          code: `String a = new String("hi");
String b = new String("hi");
System.out.println(a == b);        // 两个不同的 new，地址不同
System.out.println(a.equals(b));  // 内容都是 hi`,
          output: `false
true`,
          note: '== 比地址，equals 比内容。',
        },
      ],
      rookie: '用 == 比较两个 String → 内容明明一样却判 false，经典 bug。永远用 equals 比字符串。',
      realWorld: '判断用户名、订单状态、支付结果，全部用 equals。',
    },
    {
      id: 'ja0-stream',
      point: 'stream().filter(...).count()：集合的流水线写法',
      formalDef:
        'stream() 把集合变成一条流水线：filter(条件) 是筛掉不满足的，count() 数剩下几个。括号里 x -> x>10 是“拿每个元素 x，判断它是否大于 10”的 lambda 写法。',
      fixed: `集合.stream()
    .filter(x -> 条件)      // 只留满足条件的
    .count()               // 数数 / .collect(...) 收集`,
      variable: '条件、最后用 count 还是 collect 都可变。',
      examples: [
        {
          code: `List<Integer> nums = List.of(3, 12, 20, 5);
long cnt = nums.stream().filter(x -> x > 10).count();
System.out.println(cnt);`,
          output: `2`,
          note: '>10 的是 12、20，共 2 个。',
        },
      ],
      rookie: '以为 filter 会改原集合——它返回新流，原集合不变。',
      realWorld: '订单项目里“筛出未支付订单”“统计大于阈值的金额”都用 stream。',
    },
  ],

  // ==================== java-1 ====================
  'java-1': [
    {
      id: 'ja1-interface',
      point: 'interface 接口：只规定“能做什么”，不管“怎么做”',
      formalDef:
        'interface Pay 是一份“能力约定”：凡是会支付的类，都必须有一个 pay(int) 方法。WxPay、AliPay 用 implements Pay 签字说“我会支付”，然后各自写自己的 pay 实现。调用方只认 Pay 这个接口，不关心你是微信还是支付宝。',
      fixed: `interface 接口名 { 返回类型 方法名(参数); }
class 实现类 implements 接口名 {
    public 返回类型 方法名(参数) { 具体怎么做 }
}`,
      variable: '接口名、方法、有几个实现类都可变；implements 这套固定。',
      examples: [
        {
          code: `interface Pay { void pay(int yuan); }
class WxPay implements Pay {
    public void pay(int y) { System.out.println("微信付" + y); }
}
class AliPay implements Pay {
    public void pay(int y) { System.out.println("支付宝付" + y); }
}
Pay p = new WxPay();   // 调用方只认 Pay
p.pay(100);`,
          output: `微信付100`,
          note: '把 new WxPay() 换成 new AliPay()，调用代码一行不改。',
        },
      ],
      rookie: '把调用写死成 WxPay wx = new WxPay() → 换支付宝就要改调用代码。面向接口 Pay 就不用改。',
      realWorld: 'Spring 里到处是接口：UserService、OrderService，换实现只改配置。',
    },
    {
      id: 'ja1-strategy',
      point: '策略模式：把“会变的那部分”抽成接口，运行时换',
      formalDef:
        '折扣有“满减”“打折”两种，以后还会加“优惠券”。把“怎么算折扣”抽成一个接口 DiscountStrategy，每种算法一个实现；下单时把想用的策略传进去，调用方不关心具体算法。这就是策略模式。',
      fixed: `interface DiscountStrategy { double calc(double price); }
class 满减 implements DiscountStrategy { ... }
class 打折 implements DiscountStrategy { ... }
// 用的时候传哪个就用哪个
double final = strategy.calc(100);`,
      variable: '有几种折扣策略就写几个实现；调用时传哪个都可变。',
      examples: [
        {
          code: `interface DiscountStrategy { double calc(double p); }
class 满减 implements DiscountStrategy {
    public double calc(double p) { return p >= 100 ? p - 20 : p; }
}
class 打折 implements DiscountStrategy {
    public double calc(double p) { return p * 0.8; }
}
DiscountStrategy s = new 满减();
System.out.println(s.calc(120));`,
          output: `100.0`,
          note: '想换打折就把 new 满减() 换成 new 打折()，调用代码不变。',
        },
      ],
      rookie: '用一大堆 if-else 判断“满减还是打折” → 每加一种就改主流程。抽成接口就只加一个类。',
      realWorld: '支付方式、计价规则、消息推送渠道，都是策略模式。',
    },
    {
      id: 'ja1-singleton',
      point: '单例：全局只造一个实例',
      formalDef:
        '有些东西整个程序只该有一个（配置、连接池），造多个浪费。单例就是把构造方法私有，对外只给一个已经造好的实例，谁要用都拿这同一个。',
      fixed: `class Config {
    private static final Config INSTANCE = new Config();
    private Config() {}                 // 外面 new 不了
    public static Config get() { return INSTANCE; }
}`,
      variable: '类名、字段可变；“私有构造 + 静态返回唯一实例”这个套路固定。',
      examples: [
        {
          code: `Config a = Config.get();
Config b = Config.get();
System.out.println(a == b);   // 是同一个`,
          output: `true`,
          note: '两次拿到的是同一个对象。',
        },
      ],
      rookie: '把构造方法写成 public → 外面能随便 new，就不叫单例了。',
      realWorld: 'Spring 默认的 Bean 就是单例；自己写单例要注意线程安全。',
    },
  ],

  // ==================== java-2 ====================
  'java-2': [
    {
      id: 'ja2-jvm',
      point: '堆 / 栈 / 方法区：JVM 内存三块各放什么',
      formalDef:
        '栈：方法调用时的临时变量（基本类型、对象引用），方法一结束就清；堆：new 出来的对象都在这，GC 自动回收这里没人用的；方法区：类的信息、常量。面试就记“堆存对象、栈管调用、GC 管堆”。',
      fixed: `栈: 方法里的局部变量, 用完即清
堆: new 出来的对象, GC 自动回收
方法区: 类信息、常量`,
      variable: '—',
      examples: [
        {
          code: `Order o = new Order();
// o 这个引用在栈上, new Order() 这个对象在堆上`,
          output: `# 对象用完没人引用 → GC 回收, 你不用手动 free`,
          note: '你不用 delete，GC 帮你收。',
        },
      ],
      rookie: '在循环里不停 new 大对象 → 堆很快占满，GC 频繁，程序变卡。',
      realWorld: '内存泄漏排查、GC 调优是后端中级以上面试题。',
    },
    {
      id: 'ja2-pool',
      point: '线程池：为什么别每次 new Thread',
      formalDef:
        'new Thread().start() 是现招人现干活，招/辞都贵，任务多了系统扛不住。线程池是先招好固定数量的工人（线程）排队领活干，活干完不辞退、接着等下一个，省掉反复创建销毁的开销。',
      fixed: `ExecutorService pool = Executors.newFixedThreadPool(8);  // 8个工人
pool.submit(() -> { 要并行干的活 });                         // 领一个活
pool.shutdown();                                            // 都干完了关门`,
      variable: '线程数、提交什么任务都可变。',
      examples: [
        {
          code: `ExecutorService pool = Executors.newFixedThreadPool(8);
for (int i = 0; i < 10; i++) {
    pool.submit(() -> System.out.println(Thread.currentThread().getName()));
}
pool.shutdown();`,
          output: `# 10 个任务分给 8 个线程跑, 而不是开 10 个线程`,
          note: '() -> ... 是 lambda，把要并行的活扔给线程池。',
        },
      ],
      rookie: '高并发里 new 一万个 Thread → 系统直接崩。用线程池控住最大并发数。',
      realWorld: '下载、查数据库、调下游接口，都丢线程池并行。',
    },
    {
      id: 'ja2-sync',
      point: 'synchronized：多线程同时改一个数为什么会错',
      formalDef:
        '两个线程同时 counter++，读-改-写三步可能交叠，结果就少加了。synchronized 像给这段代码上锁：同一时刻只放一个线程进去，其他排队。锁住的就是这把“钥匙”对应的对象。',
      fixed: `synchronized (对象) {
    // 同一时刻只有一个线程能进来
    counter++;
}`,
      variable: '锁哪个对象、临界区代码都可变。',
      examples: [
        {
          code: `// 不加锁: 1000个线程各+1, 结果可能不到1000
// 加锁:
synchronized (this) { counter++; }`,
          output: `# 加锁后结果一定是 1000`,
          note: '锁保证“读-改-写”这几步是原子的，不会被插队。',
        },
      ],
      rookie: '以为 counter++ 是一步——其实是读、加、写三步，会被另一个线程打断。',
      realWorld: '扣库存、加余额、超卖问题，本质都是这个。',
    },
  ],

  // ==================== java-3 ====================
  'java-3': [
    {
      id: 'ja3-jdk-jre',
      point: 'JDK 和 JRE：装哪个、分别是干嘛的',
      formalDef:
        'JRE 是“能跑 Java 程序的环境”（含 JVM）；JDK 是“JRE + 开发工具（javac 编译器等）”。你要写代码、编译，就得装 JDK；只是跑别人打包好的程序，装 JRE 就行。现在发行版一般都给 JDK。',
      fixed: `JRE = 跑 Java 程序 (含 JVM)
JDK = JRE + 开发工具(javac 等)   ← 写代码装这个`,
      variable: '—',
      examples: [
        {
          code: `# 装完 JDK 后终端验证:
java -version
javac -version`,
          output: `# 两个都能出版本号, 说明装对了`,
          note: '只装 JRE 没有 javac，编译不了。',
        },
      ],
      rookie: '装了 JRE 想编译 → 找不到 javac。开发一定装 JDK。',
      realWorld: '公司统一用 LTS 版本（如 JDK17），别追最新。',
    },
    {
      id: 'ja3-curl',
      point: 'curl 测自己写的接口：不打开页面怎么验证',
      formalDef:
        'Spring Boot 起在 8080 端口后，curl http://localhost:8080/xxx 就是“模拟浏览器发一个请求”，把服务器返回打印出来。能看到返回内容，就说明接口通了。',
      fixed: `curl http://localhost:8080/订单/123
# 带参数/头:
curl -H "Content-Type: application/json" http://localhost:8080/订单`,
      variable: 'URL、参数可变。',
      examples: [
        {
          code: `curl http://localhost:8080/order/1`,
          output: `{"orderId":"A1","amount":200}`,
          note: '看到 JSON 返回，说明接口写对了。',
        },
      ],
      rookie: '服务没启动就 curl → 连不上，先确认 main 类跑起来了。',
      realWorld: '后端自测第一利器，Postman 只是它的图形版。',
    },
  ],

  // ==================== cpp-0 ====================
  'cpp-0': [
    {
      id: 'cp0-amp-star',
      point: '& 和 *：地址、指针、解引用到底在说什么',
      formalDef:
        '把内存想成一排有门牌号的储物柜。int a = 10; 在某个柜子放了 10。&a 是“取 a 这个柜子的门牌号”（地址）；int* p 是“一个专门存门牌号的变量（指针）”；p = &a 是把 a 的门牌号存进 p；*p 是“按这个门牌号打开柜子”，所以 *p = 20 就是把 a 改成 20。',
      fixed: `&a   → 取 a 的地址(门牌号)
int* p = &a;  → p 存着 a 的门牌号
*p   → 按门牌号打开柜子, 访问/修改 a`,
      variable: '变量名可变；& 取地址、*p 解引用这两个符号固定。',
      examples: [
        {
          code: `int a = 10;
int* p = &a;   // p 存了 a 的地址
*p = 20;       // 按地址改, a 变成 20
cout << a;`,
          output: `20`,
          note: '*p 和 a 是同一个柜子，改一个另一个跟着变。',
        },
        {
          code: `int& r = a;   // r 是 a 的别名(引用), 不是另一个柜子
r = 30;
cout << a;`,
          output: `30`,
          note: '引用 int& 就是起别名，不用 * 也能直接改原变量。',
        },
      ],
      rookie: '把 int* p 里的 * 当成“乘法”——在类型旁它表示“这是个指针”；在 *p 里它表示“解引用”。',
      realWorld: '函数想在内部改外面的变量，就传它的地址或引用。',
    },
    {
      id: 'cp0-new-delete',
      point: 'new / delete：堆上手动申请和释放内存',
      formalDef:
        '函数里普通变量在“栈”上，函数一结束自动清；new int[5] 是在“堆”上申请一大块内存，不会自动清，你必须手动 delete[] 告诉系统“我用完了”。new[] 必须配 delete[]，new 必须配 delete。',
      fixed: `int* arr = new int[5];   // 堆上申请 5 个 int
arr[0] = 1;
delete[] arr;            // 配对释放, 不能忘
arr = nullptr;           // 好习惯: 释放后别再用`,
      variable: '数组长度、放什么值可变；new[]/delete[] 配对固定。',
      examples: [
        {
          code: `int* arr = new int[3];
arr[0]=1; arr[1]=2; arr[2]=3;
cout << arr[0] << arr[1] << arr[2];
delete[] arr;`,
          output: `123`,
          note: 'new[] 和 delete[] 都要带中括号。',
        },
      ],
      rookie: '① 忘了 delete[] → 内存泄漏；② delete[] 后还访问 arr → 野指针/未定义行为；③ 越界写 arr[5]。',
      realWorld: '竞赛里手动 new/delete 够用；工程里用 unique_ptr 自动管理，不用记着删。',
    },
  ],

  // ==================== cpp-1 ====================
  'cpp-1': [
    {
      id: 'cp1-vector',
      point: 'vector：会自动变长的数组',
      formalDef:
        '普通数组 int a[5] 长度固定；vector<int> v 是“长度自动伸缩的数组”，v.push_back(x) 在尾巴加一个，v[i] 按序号取，v.size() 看长度。不用自己管内存。',
      fixed: `vector<int> v = {3, 1, 4};   // 初始化
v.push_back(5);               // 尾巴加
v[i]                          // 按序号取
v.size()                      // 长度`,
      variable: '元素类型、放什么都可变。',
      examples: [
        {
          code: `vector<int> v = {3,1,4,1,5};
v.push_back(9);
cout << v.size() << " " << v[0];`,
          output: `6 3`,
          note: 'push_back 后 size 从 5 变 6。',
        },
      ],
      rookie: 'v[i] 越界不会报错（未定义行为），但会读到垃圾值。循环边界用 v.size()。',
      realWorld: '竞赛里装读入的数据、答案，首选 vector。',
    },
    {
      id: 'cp1-sort',
      point: 'sort 升降序与去重：algorithm 里的现成轮子',
      formalDef:
        'sort(v.begin(), v.end()) 把 vector 原地排成升序；加第三个参数 greater<int>() 变成降序。去重固定套路：先排序，再 unique 把重复的挪到末尾，最后 erase 删掉末尾那截。',
      fixed: `sort(begin, end)                 // 升序
sort(begin, end, greater<int>()) // 降序
// 去重:
sort(...);
v.erase(unique(begin, end), end);`,
      variable: '对谁排序、升/降可变；去重四步固定。',
      examples: [
        {
          code: `vector<int> v = {3,1,4,1,5};
sort(v.begin(), v.end());
// 现在: 1 1 3 4 5
v.erase(unique(v.begin(), v.end()), v.end());
// 现在: 1 3 4 5`,
          output: `1 3 4 5`,
          note: 'unique 只把相邻重复挪走，所以必须先 sort。',
        },
      ],
      rookie: '不排序直接 unique → 去不干净，因为它只去相邻重复。',
      realWorld: '统计个数用 unordered_map，排序去重用 sort+unique。',
    },
    {
      id: 'cp1-compile',
      point: 'g++ 怎么编译：一条命令跑起来',
      formalDef:
        'g++ main.cpp -o main 是“把 main.cpp 编译链接成可执行文件 main”。-std=c++17 指定语言标准；-O2 开优化（跑得快）；多文件就把多个 .cpp 都列上。',
      fixed: `g++ 源文件.cpp -o 输出名 -std=c++17 -O2
# 多文件:
g++ main.cpp util.cpp -o main -std=c++17 -O2`,
      variable: '源文件、输出名可变。',
      examples: [
        {
          code: `g++ main.cpp -o main -std=c++17 -O2
./main            # 运行(Linux/Mac)
main.exe          # 运行(Windows)`,
          output: `# 打印程序结果`,
          note: '-o 后面是你想要的可执行文件名。',
        },
      ],
      rookie: '漏 -std=c++17 → 有些新语法不认。',
      realWorld: '竞赛只用命令行 g++，不用急着学 CMake/IDE。',
    },
  ],

  // ==================== cpp-2 ====================
  'cpp-2': [
    {
      id: 'cp2-asan',
      point: 'ASan 与 -g：查内存 bug 的两个编译开关',
      formalDef:
        '编译时加 -fsanitize=address（ASan），程序跑起来会自动盯内存：数组越界、用了已释放的内存、野指针，它直接在出错那行停下并报行号。-g 是把调试信息编进去，配 gdb 单步用。',
      fixed: `g++ main.cpp -o main -g -fsanitize=address -std=c++17
./main    # 越界/野指针会当场报出第几行`,
      variable: '—',
      examples: [
        {
          code: `int* a = new int[3];
a[5] = 1;     // 越界! 数组只有下标0,1,2`,
          output: `# 开 ASan 跑: AddressSanitizer: heap-buffer-overflow on address ...
# main.cpp:3 在 main()`,
          note: '它直接告诉你越界在哪一行。',
        },
      ],
      rookie: '只加 -O2 不加调试开关 → 越界不报错但结果莫名其妙(WA)。竞赛查 bug 三板斧第一板。',
      realWorld: '本地调试永远带 -g -fsanitize=address，交评测前再用 -O2。',
    },
    {
      id: 'cp2-ub',
      point: '未定义行为(UB)：为什么不一定报错却是 WA 常客',
      formalDef:
        '数组越界、用未初始化变量、除零，都叫“未定义行为”：C++ 标准说程序随便怎么表现都行——可能不报错、可能算对、可能随机错。最难调。预防：边界写对、变量先初始化、除零前判断。',
      fixed: `# 三种常见 UB:
a[5] = 1;          // 越界, 数组没那么长
int x; cout<<x;   // x 没初始化, 是垃圾值
int z = 10/0;     // 除零`,
      variable: '—',
      examples: [
        {
          code: `int* a = new int[3];
a[100] = 1;   // 不报错, 但踩坏了别的内存`,
          output: `# 有时结果对, 有时莫名其妙错, 这就是 UB`,
          note: '别赌它“碰巧对”，老老实实把下标控制在 0..size-1。',
        },
      ],
      rookie: '本地跑对、交上去 WA → 八成是 UB，开 ASan 查。',
      realWorld: '竞赛 WA 很多不是算法错，而是这种隐藏 UB。',
    },
  ],

  // ==================== cpp-3 ====================
  'cpp-3': [
    {
      id: 'cp3-pq',
      point: 'priority_queue：默认大顶堆，怎么取最大',
      formalDef:
        'priority_queue<int> 默认是“大顶堆”：每次 top() 拿到当前最大的，pop() 删掉它。想取最小的小顶堆要写 vector<int>, greater<int>>。它内部自动维护顺序，插入/取顶都快。',
      fixed: `priority_queue<int> pq;                 // 大顶堆, top() 最大
priority_queue<int, vector<int>, greater<int>> pq2; // 小顶堆, top() 最小`,
      variable: '存什么类型可变；greater 换成 less 或不加就是大顶堆。',
      examples: [
        {
          code: `priority_queue<int> pq;
pq.push(3); pq.push(1); pq.push(5);
cout << pq.top();   // 当前最大
pq.pop();
cout << pq.top();`,
          output: `5
3`,
          note: 'push 后堆自动排好，top 永远是最大。',
        },
      ],
      rookie: '以为默认小顶堆——C++ 是反的，默认大顶堆。',
      realWorld: 'TopK 问题（找前 K 大）直接用堆，不用全排序。',
    },
    {
      id: 'cp3-stack-queue',
      point: '栈和队列：先进后出 vs 先进先出',
      formalDef:
        '栈 stack 像一摞盘子：只能从顶上放/取，后进的先出（LIFO）；队列 queue 像排队：先来先服务，先进先出（FIFO）。括号匹配用栈，BFS 遍历用队列。',
      fixed: `stack<int> s;   s.push(x); s.top(); s.pop();   // 后进先出
queue<int> q;   q.push(x); q.front(); q.pop();  // 先进先出`,
      variable: '存什么可变。',
      examples: [
        {
          code: `stack<int> s;
s.push(1); s.push(2); s.push(3);
cout << s.top();   // 最后放的 3 在最上面
queue<int> q;
q.push(1); q.push(2);
cout << q.front();  // 最早来的 1`,
          output: `3
1`,
          note: '栈取最后进的，队列取最先进的。',
        },
      ],
      rookie: '把栈当队列用（想用最早的元素）→ 错，栈只能拿最新的。',
      realWorld: '括号匹配、函数调用栈用 stack；广度优先搜索 BFS 用 queue。',
    },
  ],

  // ==================== go-0 ====================
  'go-0': [
    {
      id: 'go0-goroutine',
      point: 'go f()：一句话开一个轻量并发',
      formalDef:
        '普通函数 f() 是“等它跑完才往下走”；go f() 是“不等它，开一个叫 goroutine 的轻量执行体自己去跑 f，主程序继续往下”。goroutine 比线程轻得多（初始栈只有几 KB），开几千个都没问题。',
      fixed: `go f()        // 开一个 goroutine 跑 f, 不等待
go func(){...}()  // 直接开一个匿名函数`,
      variable: '跑什么函数可变。',
      examples: [
        {
          code: `go worker(1, ch)   // 不等 worker 跑完, 立刻继续
go worker(2, ch)
go worker(3, ch)
// 三个 worker 同时在跑`,
          output: `# 三个 worker 并发执行, 谁先跑完不一定`,
          note: 'go 后面跟函数调用就开并发。',
        },
      ],
      rookie: 'main 跑完程序就退出，goroutine 还没跑完就被杀掉——所以要等（用 channel 或 WaitGroup）。',
      realWorld: '每个下载任务开一个 goroutine，是 Go 高并发的基本单位。',
    },
    {
      id: 'go0-channel',
      point: 'channel：goroutine 之间传数据的管道',
      formalDef:
        'channel 是一根类型化的管道。ch <- x 是“把 x 塞进管道”；<-ch 是“从管道取一个出来”。make(chan string, 3) 是建一根能装 3 个 string 的管道（带缓冲）。它用来在 goroutine 之间传结果，而不是大家抢同一块内存。',
      fixed: `ch := make(chan 类型, 缓冲大小)
ch <- 值      // 塞进去
值 := <-ch    // 取出来`,
      variable: '类型、缓冲大小可变。',
      examples: [
        {
          code: `ch := make(chan string, 3)
ch <- "a"
ch <- "b"
fmt.Println(<-ch)   // 先塞的先取`,
          output: `a`,
          note: '带缓冲=管道能先存几个，塞的人不用立刻等取的人。',
        },
        {
          code: `for i := 1; i <= 3; i++ { go worker(i, ch) }
for i := 1; i <= 3; i++ { fmt.Println(<-ch) }  // 等三个结果都到`,
          output: `worker 1 done
worker 2 done
worker 3 done`,
          note: '主程序从管道取 3 次，刚好等三个 goroutine 都完成。',
        },
      ],
      rookie: '忘了从 channel 取 → 塞进去的 goroutine 永远卡住（死锁）。',
      realWorld: '“通过通信共享内存”——goroutine 之间靠 channel 传数据，不靠加锁抢变量。',
    },
    {
      id: 'go0-error',
      point: 'Go 的错误：用返回值，没有 try/catch',
      formalDef:
        'Go 不用 try/catch。可能出错的函数多返回一个 error 值：if err != nil 就说明出错了，你必须显式处理。这逼你每一步都想“失败了怎么办”。',
      fixed: `result, err := doSomething()
if err != nil {
    // 出错了, 处理它
    return err
}
// 没出错, 用 result`,
      variable: '—',
      examples: [
        {
          code: `f, err := os.Open("a.txt")
if err != nil {
    fmt.Println("打不开:", err)
    return
}
defer f.Close()`,
          output: `# 打不开时打印原因, 不崩`,
          note: 'Go 里错误是普通值，必须 if err != nil 接住。',
        },
      ],
      rookie: '用 _ 把 err 扔掉（f, _ := os.Open）→ 出错了你完全不知道。',
      realWorld: 'Go 代码里到处是 if err != nil，这是它的风格。',
    },
  ],

  // ==================== go-1 ====================
  'go-1': [
    {
      id: 'go1-http',
      point: 'net/http：三行写一个 Web 服务',
      formalDef:
        'http.HandleFunc("/hello", hello) 是“把网址 /hello 绑到 hello 这个函数”；ListenAndServe(":8080", nil) 是“在 8080 端口开始监听请求”。每个请求来，Go 自动调一次 hello，参数 w 用来写回响应，r 是请求本身。',
      fixed: `func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "你好")     // 往响应里写
}
func main() {
    http.HandleFunc("/hello", hello)
    http.ListenAndServe(":8080", nil)   // 阻塞, 一直服务
}`,
      variable: '路由路径、处理逻辑可变。',
      examples: [
        {
          code: `func hello(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")   // 取 ?name=xxx
    fmt.Fprintf(w, "Hello %s", name)
}
// 访问 http://localhost:8080/hello?name=测试`,
          output: `Hello 测试`,
          note: 'r.URL.Query().Get("name") 就是读 URL 里的 ?name=。',
        },
      ],
      rookie: 'ListenAndServe 是阻塞的（不会返回），别在它后面写以为会执行的代码。',
      realWorld: 'Go 写微服务，标准库就够起一个 HTTP 服务。',
    },
  ],

  // ==================== go-2 ====================
  'go-2': [
    {
      id: 'go2-test',
      point: 'go test：原生单元测试怎么写',
      formalDef:
        '测试文件名必须叫 xxx_test.go；测试函数必须叫 TestXxx(t *testing.T)。里面调用你写的函数，断言结果对不对，不对就 t.Error。go test 自动找到所有这种函数并跑。',
      fixed: `// math.go
func Add(a, b int) int { return a + b }

// math_test.go
func TestAdd(t *testing.T) {
    if Add(2, 3) != 5 {
        t.Error("2+3 应该等于 5")
    }
}`,
      variable: '函数名、断言内容可变；文件名和 Test 前缀规则固定。',
      examples: [
        {
          code: `func TestAdd(t *testing.T) {
    if Add(2,3) != 5 { t.Error("错") }
}
# 命令: go test`,
          output: `ok  your/project  0.00s   ← 全绿
# 失败会打印哪个 Test 挂了、期望值/实际值`,
          note: '一个 TestXxx 就是一个用例。',
        },
      ],
      rookie: '测试函数名不叫 TestXxx（小写 testAdd）→ go test 找不到，白写。',
      realWorld: 'Go 强调“测试和代码放一起”，go test 是标配。',
    },
    {
      id: 'go2-mod',
      point: 'go.mod：项目依赖清单',
      formalDef:
        'go mod init 项目名 会生成一个 go.mod 文件，里面写着“这个项目叫什么、用哪个 Go 版本、依赖哪些第三方包”。go get 加依赖时它自动更新。它就像 Python 的 requirements.txt + 包名。',
      fixed: `go mod init lab      # 初始化, 生成 go.mod
go get github.com/xxx/pkg  # 拉依赖, 自动写进 go.mod
go mod tidy          # 整理依赖`,
      variable: '项目名可变。',
      examples: [
        {
          code: `# go.mod 长这样:
module lab
go 1.22`,
          output: `# 别人拿到代码 go mod download 就能装齐依赖`,
          note: 'go.mod 要跟着代码提交。',
        },
      ],
      rookie: '不 init 就 import 第三方包 → 找不到模块。',
      realWorld: '每个 Go 项目根目录必有一个 go.mod。',
    },
  ],

  // ==================== go-3 ====================
  'go-3': [
    {
      id: 'go3-middleware',
      point: '中间件：把“通用逻辑”从业务里抽出来',
      formalDef:
        '每个请求都要做的事（记日志、鉴权、限流），不想在每个接口函数里写一遍。中间件就是“包住一层”：请求先过中间件（检查通过才放行给真正的接口），响应再原路返回。限流就是中间件数请求数，超了直接返回 429。',
      fixed: `func 限流(下一步 http.Handler) http.Handler {
    return func(w, r) {
        if 超过阈值 { 返回 429; return }
        下一步.ServeHTTP(w, r)   // 放行
    }
}`,
      variable: '中间件里检查什么可变。',
      examples: [
        {
          code: `# 数到第 101 个请求就拒:
if count > 100 {
    w.WriteHeader(429)   // Too Many Requests
    return
}`,
          output: `# 429 = 你请求太频繁了, 慢点再来`,
          note: '429 是 HTTP 标准的“太多请求”状态码。',
        },
      ],
      rookie: '把限流写进每个接口 → 重复难维护。抽成中间件包一层，一次写处处用。',
      realWorld: '日志、鉴权、限流、CORS 都是中间件。',
    },
  ],

  // ==================== algo-0 ====================
  'algo-0': [
    {
      id: 'al0-bigO',
      point: '大 O：从代码一眼看出快慢',
      formalDef:
        '大 O 说的是“数据量 n 变大 10 倍时，耗时大约变多少倍”，不关心具体几秒，只看增长趋势。一层 for n 次 → O(n)；两层嵌套 for n 次 → O(n²)；每次 i 翻倍 → O(log n)。',
      fixed: `for i in range(n): ...                 # O(n)
for i: for j: ...                      # O(n²)
i=1; while i<n: i*=2                  # O(log n)
# 排序本身是 O(n log n)`,
      variable: '—',
      examples: [
        {
          code: `# O(n): 遍历一遍
for x in nums: print(x)

# O(n²): 双层遍历
for i in nums:
    for j in nums: ...

# O(log n): 每次砍掉一半
i = 1
while i < 1000: i *= 2`,
          output: `# n=10亿时:
# O(n) 要10亿次, O(log n) 只要30次, O(n²) 算不完`,
          note: 'log n 增长极慢，n 再大也只要几十次。',
        },
      ],
      rookie: '以为机器快就不管复杂度 → n=1000 时 O(n²)=100万次还行，n=10万就是100亿次，直接超时。',
      realWorld: '面试写代码前先报复杂度：“我用哈希表，O(n)”。',
    },
    {
      id: 'al0-arr-linked',
      point: '数组中间插入为什么慢',
      formalDef:
        '数组在内存里是连续紧挨着的。要在中间插一个，后面所有元素都得往后挪一格，n 个元素就要动 n 次 → O(n)。按序号取却很快（直接算地址）→ O(1)。链表相反：插入只要改个箭头 O(1)，但要从头一个个找 O(n)。',
      fixed: `数组: 按下标取 O(1), 中间插入 O(n) (后面全要挪)
链表: 插入 O(1), 按下标取 O(n) (要从头走)`,
      variable: '—',
      examples: [
        {
          code: `a = [1,2,3,4]
a.insert(0, 99)   # 在最前面插
# [99,1,2,3,4] 后面4个都得往后挪一位`,
          output: `# 插中间/头部慢, 插尾部快`,
          note: '要频繁按下标取用数组；要频繁插入头尾用链表/双端队列。',
        },
      ],
      rookie: '频繁在数组头部插入 → 每次都挪全表，O(n²)。',
      realWorld: 'Python list 尾部 append 很快；头部插入别用 list，用 deque。',
    },
  ],

  // ==================== algo-1 ====================
  'algo-1': [
    {
      id: 'al1-two-sum',
      point: '两数之和：哈希表把 O(n²) 降到 O(n)',
      formalDef:
        '暴力法是两层循环配对（O(n²)）。哈希表法：边遍历边把“见过的数→它的下标”存进 dict；走到 x 时，查“target - x 在不在见过的表里”，在就配对成功。查 dict 是 O(1)，整体 O(n)。',
      fixed: `seen = {}
for i, x in enumerate(nums):
    if (target - x) in seen:        # 另一半见过吗
        return [seen[target-x], i]
    seen[x] = i                     # 记下这个数和它的位置`,
      variable: '—',
      examples: [
        {
          code: `nums=[2,7,11,15], target=9
# i=0 x=2: seen 空, 存 2->0
# i=1 x=7: 9-7=2 在 seen! 返回 [0,1]`,
          output: `[0, 1]`,
          note: '关键：不预存所有，而是边走边存，查“另一半”。',
        },
      ],
      rookie: '两数之和写成双重循环 → 能过但 O(n²)，面试不推荐。',
      realWorld: '“出现几次”“是否存在”“配对”这类题先想哈希表。',
    },
    {
      id: 'al1-window',
      point: '滑动窗口：求最长/最短连续子串的套路',
      formalDef:
        '窗口是一段连续区间 [左指针, 右指针]。右指针往右扩，直到“不合法”（如出现重复），就把左指针往右缩，缩到重新合法。整个过程窗口只滑一遍，O(n)，不用暴力枚举所有子串。',
      fixed: `左=0
for 右 in 字符串:
    把右指针字符加进窗口
    while 窗口不合法:
        左指针右移
    更新答案`,
      variable: '合法性条件、答案怎么更新可变。',
      examples: [
        {
          code: `# 无重复字符最长子串: "abcabcbb"
# 右指针滑, 遇到重复字符就把左指针移到重复处之后`,
          output: `# 最长 "abc" 长度 3`,
          note: '窗口只整体往右滑，不回头，所以 O(n)。',
        },
      ],
      rookie: '求最长连续子串就暴力枚举所有子串 → O(n²)，用滑动窗口 O(n)。',
      realWorld: '子串/子数组最长最短、定长窗口求和，都是滑动窗口。',
    },
  ],

  // ==================== algo-2 ====================
  'algo-2': [
    {
      id: 'al2-dfs-bfs',
      point: 'DFS 与 BFS：一条路走到黑 vs 一层一层扫',
      formalDef:
        'DFS（深度优先）用递归/栈，从一个点一直往深处走，走不通再回头，适合“把连通区域走遍”（如数岛屿）；BFS（广度优先）用队列，按距离一层一层往外扩，适合“求最短步数/层数”（如层序遍历、迷宫最短路）。',
      fixed: `DFS: 栈/递归  →  一条路走到底再回头
BFS: 队列     →  一层层往外扩`,
      variable: '—',
      examples: [
        {
          code: `# BFS 层序遍历: 队列里每一层就是树的一层
q = [root]
while q:
    node = q.popleft()
    if node.left: q.append(node.left)
    if node.right: q.append(node.right)`,
          output: `# 队列先放完上层, 再放下层, 天然按层`,
          note: '求“最短几步”用 BFS，因为它第一次到达某点时一定是最短。',
        },
      ],
      rookie: '求最短路径用 DFS 会绕远路；用 BFS 第一次到就是最短。',
      realWorld: '数岛屿用 DFS 染色；二叉树层序、扩散问题用 BFS。',
    },
    {
      id: 'al2-recursion',
      point: '递归三要素：终止、拆解、返回',
      formalDef:
        '写递归先想三件事：① 什么时候停（终止条件，如节点为空返回）；② 大问题怎么拆成小问题（如先递归左子树再右子树）；③ 每层返回什么。树的题 80% 靠这三句话。',
      fixed: `def f(节点):
    if 节点为空: return 0        # ① 终止
    左 = f(节点.left)             # ② 拆成左子问题
    右 = f(节点.right)            #    和右子问题
    return max(左, 右) + 1       # ③ 合并返回`,
      variable: '怎么拆、返回什么按题定。',
      examples: [
        {
          code: `# 二叉树最大深度
def depth(root):
    if root is None: return 0
    return 1 + max(depth(root.left), depth(root.right))`,
          output: `# 叶子节点深度 0, 每层+1`,
          note: '别在脑子里展开所有层，相信“子问题已经算对”。',
        },
      ],
      rookie: '忘了写终止条件 → 无限递归栈溢出。',
      realWorld: '树、图、分治，递归是默认写法。',
    },
  ],

  // ==================== algo-3 ====================
  'algo-3': [
    {
      id: 'al3-dp',
      point: '动态规划：状态定义 + 转移方程',
      formalDef:
        'DP 三步：① 定义 dp[i] 是什么（如“到第 i 阶有几种走法”）；② 写转移方程——dp[i] 怎么由前面的 dp 推出来；③ 定初始值和遍历顺序。本质是“把大问题拆成重叠子问题，记住结果不重复算”。',
      fixed: `# 爬楼梯: dp[i] = dp[i-1] + dp[i-2]
dp[1]=1; dp[2]=2
for i in 3..n:
    dp[i] = dp[i-1] + dp[i-2]`,
      variable: '状态定义、转移方程按题定。',
      examples: [
        {
          code: `# 爬楼梯: 一次能走1或2阶, 到第n阶有几种走法
def climb(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n+1):
        a, b = b, a + b     # 滚动更新, 省掉整个数组
    return b`,
          output: `# climb(5) = 8`,
          note: 'dp[i] 只依赖前两项, 用两个变量滚动就行。',
        },
      ],
      rookie: '先定义错 dp[i] 是什么，后面全错。第一步永远是说清“dp[i] 代表什么”。',
      realWorld: '爬楼梯→打家劫舍→最长子序列→背包，按顺序刷就入门。',
    },
  ],

  // ==================== sql-0 ====================
  'sql-0': [
    {
      id: 'sq0-clause-order',
      point: 'SELECT 子句顺序：背下来就不会写乱',
      formalDef:
        'SQL 子句有固定先后，写错顺序直接报错。背：SELECT 要哪些列 → FROM 哪张表 → WHERE 行前过滤 → GROUP BY 按谁分组 → HAVING 组后过滤 → ORDER BY 排序 → LIMIT 取前几。执行顺序和书写顺序不同：先 FROM 取表，再 WHERE 筛行，再 GROUP BY 分组……',
      fixed: `SELECT 列, 聚合函数
FROM 表
WHERE 行过滤条件
GROUP BY 分组列
HAVING 组过滤条件
ORDER BY 排序列 DESC
LIMIT 10;`,
      variable: '列、条件、分组都可变；七步顺序固定。',
      examples: [
        {
          code: `SELECT city, COUNT(*) AS cnt
FROM users
WHERE created_at >= '2026-01-01'   -- 先筛 2026 后的行
GROUP BY city                     -- 再按城市分组
HAVING COUNT(*) > 5               -- 再筛“人数>5”的组
ORDER BY cnt DESC
LIMIT 10;`,
          output: `# 先逐行过滤, 再分组, 再过滤组, 再排序, 再取前10`,
          note: 'WHERE 在分组前筛行，HAVING 在分组后筛组，别混。',
        },
      ],
      rookie: '把 HAVING 写在 GROUP BY 前面、或把行过滤写进 HAVING → 报错或结果错。',
      realWorld: '90% 的报表查询就是这套七步。',
    },
    {
      id: 'sq0-count',
      point: 'COUNT(*) 与 COUNT(列)、GROUP BY 能写什么',
      formalDef:
        'COUNT(*) 数行数（包括某列为 NULL 的行）；COUNT(列) 只数该列不为 NULL 的行。GROUP BY city 之后，SELECT 里只能写“分组列”或“聚合函数（COUNT/SUM/MAX）”，不能随便选一个没分组的列——因为每组里那列有多个值，不知道选哪个。',
      fixed: `SELECT city, COUNT(*)     -- city 是分组列, COUNT 是聚合, 合法
FROM users GROUP BY city;
-- 非法: SELECT city, name ...   -- name 没分组也没聚合, 每组多个name`,
      variable: '—',
      examples: [
        {
          code: `SELECT city, COUNT(*) AS cnt
FROM users
GROUP BY city;`,
          output: `北京 120
上海 98`,
          note: '每行是“一个城市 + 它的人数”。',
        },
      ],
      rookie: 'GROUP BY 后 SELECT 里写了非分组列 → 报错或取到随机值。',
      realWorld: 'COUNT(*) 是报表里最常用的聚合。',
    },
  ],

  // ==================== sql-1 ====================
  'sql-1': [
    {
      id: 'sq1-join',
      point: 'JOIN：两张表怎么按键拼起来',
      formalDef:
        'orders 表有 user_id（谁买的），users 表有 id 和 name。两张表本来分开，JOIN 就是按 o.user_id = u.id 把同一用户的订单和姓名拼到一行。INNER JOIN 只保留两边都对得上的；LEFT JOIN 保留左表全部，右表对不上就填 NULL。',
      fixed: `SELECT o.id, u.name, o.amount
FROM orders o          -- 左表起别名 o
JOIN users u           -- 右表起别名 u
  ON o.user_id = u.id  -- 靠这一列相等拼起来`,
      variable: '哪两表、连接键、要哪些列可变。',
      examples: [
        {
          code: `-- 订单表: (id, user_id, amount)
-- 用户表: (id, name)
SELECT o.id, u.name, o.amount
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.amount > 100;`,
          output: `# 每一行: 订单号 + 下单人名 + 金额`,
          note: 'ON 后面就是“两张表靠哪一列连起来”。',
        },
        {
          code: `# LEFT JOIN: 左表全保留, 右表没匹配填 NULL
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
# 没下过单的用户也会出现, amount 是 NULL`,
          output: `# 想知道“哪些用户没下单”用 LEFT JOIN 找 NULL`,
          note: 'INNER 是交集，LEFT 是左表全留。',
        },
      ],
      rookie: '该用 LEFT JOIN 却用 INNER → 没下单的用户凭空消失。',
      realWorld: '订单报表几乎都要 JOIN 用户表/商品表。',
    },
    {
      id: 'sq1-index',
      point: '索引：像书目录，怎么就变快了',
      formalDef:
        '没索引时，WHERE user_id=5 要从第一行扫到最后一行（全表扫描 O(n)）。在 user_id 上建索引，就像书有了目录，直接翻到第 5 个用户（O(log n)）。EXPLAIN 看查询有没有真用上索引。',
      fixed: `CREATE INDEX idx_user ON orders(user_id);
EXPLAIN SELECT * FROM orders WHERE user_id = 5;`,
      variable: '在哪列建索引按查询模式定。',
      examples: [
        {
          code: `# 建索引前: type=ALL (全表扫, 慢)
# 建索引后: type=ref (走索引, 快)
EXPLAIN SELECT ... WHERE user_id = 5;`,
          output: `# EXPLAIN 的 key 列显示用到了哪个索引`,
          note: '高频 WHERE / JOIN / ORDER BY 的列才值得建索引。',
        },
      ],
      rookie: '索引不是越多越好——每次 INSERT/UPDATE 都要维护索引，写多了反而慢。',
      realWorld: '慢查询先 EXPLAIN 看是不是没走索引。',
    },
  ],

  // ==================== sql-2 ====================
  'sql-2': [
    {
      id: 'sq2-txn',
      point: '事务 BEGIN/COMMIT/ROLLBACK：要么全成要么全败',
      formalDef:
        '事务把一组 SQL 包成一个“原子操作”：BEGIN 开始，中间做的修改都先暂存；COMMIT 才真正落盘；中途任何一步出错就 ROLLBACK，把这次暂存全部撤销。转账——扣 A 加 B，绝不能只做一半。',
      fixed: `BEGIN;
UPDATE account SET balance = balance - 100 WHERE id=1;
UPDATE account SET balance = balance + 100 WHERE id=2;
COMMIT;      -- 都成功才提交
-- 或 ROLLBACK;  -- 出错就撤销全部`,
      variable: '—',
      examples: [
        {
          code: `BEGIN;
UPDATE ... id=1;   -- 扣钱
UPDATE ... id=2;   -- 加钱
-- 假设第二条挂了:
ROLLBACK;          -- 第一条的扣款也撤销, 钱没少`,
          output: `# ROLLBACK 后两行都没生效, 账户恢复原样`,
          note: 'ACID：原子性(全成或全败)、一致性、隔离性、持久性。',
        },
      ],
      rookie: '不包事务，扣钱成功、加钱失败就丢钱了。',
      realWorld: '转账、下单扣库存、支付，全部包在事务里。',
    },
  ],

  // ==================== sql-3 ====================
  'sql-3': [
    {
      id: 'sq3-leftmost',
      point: '联合索引与最左前缀：(user_id, created_at) 怎么生效',
      formalDef:
        '联合索引 (user_id, created_at) 是“先按 user_id 排、同 user_id 内再按 created_at 排”。最左前缀原则：查询必须从最左列 user_id 开始用，索引才生效；跳过 user_id 直接按 created_at 查，这个索引用不上。',
      fixed: `INDEX (user_id, created_at)
能用: WHERE user_id=?
能用: WHERE user_id=? AND created_at=?
用不上: WHERE created_at=?   -- 跳过了最左列 user_id`,
      variable: '索引列顺序按最常查的条件排。',
      examples: [
        {
          code: `-- 高频查询: WHERE user_id=? AND created BETWEEN ? AND ?
-- 索引就建 (user_id, created_at), 两个条件都走索引`,
          output: `# 把最常用的过滤列放最左边`,
          note: '最左列没出现在 WHERE 里，整个联合索引失效。',
        },
      ],
      rookie: '把索引列顺序建反、或查询跳过最左列 → 建了索引却全表扫。',
      realWorld: '订单表 (user_id, created_at) 是经典联合索引。',
    },
  ],

  // ==================== redis-0 ====================
  'redis-0': [
    {
      id: 'r0-five',
      point: 'Redis 五种结构：String/Hash/List/Set/ZSet 各存什么',
      formalDef:
        'Redis 是把数据放内存里的 KV 库（所以快）。五种“值”的形态：String 一个 key 对应一个值（缓存对象、计数）；Hash 一个 key 对应多个字段（存对象，如商品的 stock/price）；List 有序可重复列表（消息队列/时间线）；Set 自动去重无序（标签）；ZSet 带分数的有序集合（排行榜）。',
      fixed: `SET 键 值                        # String
HSET 键 字段 值                   # Hash: 一个对象多个字段
LPUSH/LPOP 键 值                  # List
SADD 键 值                        # Set 去重
ZADD 键 分数 成员                 # ZSet 按分数排`,
      variable: '键、值、字段都可变。',
      examples: [
        {
          code: `SET user:1:name "Tom"
HSET product:1 stock 100 price 99
ZADD rank 95 "alice" 88 "bob"
ZREVRANGE rank 0 2 WITHSCORES   # 分数从高到低取前3`,
          output: `1) "alice"  95
2) "bob"    88`,
          note: 'ZREVRANGE=倒序区间, 排行榜专用。',
        },
      ],
      rookie: '存一个对象却拆成一堆 String key（user:1:name, user:1:age...）→ 不如用一个 Hash 一个 key。',
      realWorld: '排行榜用 ZSet，缓存整对象用 String(JSON)，计数用 String INCR。',
    },
  ],

  // ==================== redis-1 ====================
  'redis-1': [
    {
      id: 'r1-penetrate',
      point: '穿透 / 击穿 / 雪崩：三个易混词各是什么',
      formalDef:
        '穿透：查一个“根本不存在”的数据，缓存里永远没有，每次请求都打到数据库。击穿：某个超热点 key 在过期的瞬间，几千个请求同时发现缓存没有，全打到数据库。雪崩：一大批 key 同一时刻同时过期，一瞬间全打到数据库。',
      fixed: `穿透: 查不存在的数据 → 布隆过滤器/缓存空值
击穿: 热点key过期瞬间   → 互斥锁/逻辑不过期
雪崩: 大量key同时过期   → 过期时间加随机抖动`,
      variable: '—',
      examples: [
        {
          code: `# 缓存常见写法:
val = GET(key)
if val is None:
    val = DB.query(key)
    SET key val EX 3600 + 随机秒数   # 雪崩: 加随机防同时过期`,
          output: `# 加随机: 3600 + random(0,300), 错开过期`,
          note: '击穿是“一个热点同时被打”，雪崩是“一片同时过期”。',
        },
      ],
      rookie: '三个词背混——抓现象：穿透=查不存在，击穿=一个热点挂，雪崩=一片同时挂。',
      realWorld: '面试必问，每个能说清现象+一个解法即可。',
    },
  ],

  // ==================== redis-2 ====================
  'redis-2': [
    {
      id: 'r2-rdb-aof',
      point: 'RDB 与 AOF：Redis 怎么持久化',
      formalDef:
        'Redis 在内存里，断电就没。RDB 是“定时给内存拍个快照存盘”——恢复快，但两次快照之间的数据会丢。AOF 是“把每条写命令追加记日志”——断电后重放日志更安全，但文件大。生产常用两者混合。',
      fixed: `RDB: 定时快照, 恢复快, 可能丢最近数据
AOF: 写命令日志, 更安全, 文件大`,
      variable: '—',
      examples: [
        {
          code: `# 知道概念即可, 不用背配置`,
          output: `# 主从+哨兵: 主写从读, 主挂了哨兵自动推一个从上位`,
          note: '主从解决读压力和高可用，哨兵负责自动切换。',
        },
      ],
      rookie: '以为 Redis 在内存就不会丢数据——宕机/断电会丢，所以要持久化。',
      realWorld: '面试问到“Redis 持久化”答 RDB/AOF 取舍即可。',
    },
  ],

  // ==================== redis-3 ====================
  'redis-3': [
    {
      id: 'r3-cache',
      point: '缓存读写：先查 Redis，没有再查库并回填',
      formalDef:
        '读流程：先查 Redis，有就直接返回；没有就查数据库，查到后写回 Redis（设过期）再返回。更新流程：先更新数据库，再删除缓存（不是更新缓存），下次读自然回填。这样缓存和数据库不容易不一致。',
      fixed: `读: 查Redis → 没有 → 查DB → 写回Redis → 返回
写: 更新DB → 删除缓存(下次读再回填)`,
      variable: '—',
      examples: [
        {
          code: `val = GET("product:1")
if val is None:
    val = DB.get_product(1)
    SET "product:1" val EX 600   # 回填, 10分钟过期`,
          output: `# 第二次读就命中缓存了`,
          note: '写操作后删缓存而不是更缓存，能降低不一致窗口。',
        },
      ],
      rookie: '先删缓存再更数据库 → 别的请求在你两步之间读到旧值。更安全是“先更库再删缓存”。',
      realWorld: '商品详情、用户信息都是这个缓存模式。',
    },
  ],

  // ==================== vector-0 ====================
  'vector-0': [
    {
      id: 'v0-embedding',
      point: 'Embedding 与余弦相似度：怎么把“语义”变成数字',
      formalDef:
        'Embedding 是把一段文本用模型变成一长串数字（如 1024 维向量）。意思相近的句子，向量方向也相近。余弦相似度算两个向量夹角：夹角越小、值越接近 1，就越相似。所以“苹果手机”和“华为手机”距离近，和“今天天气”距离远。',
      fixed: `"句子" -> [0.12, -0.83, ..., 0.41]   # 1024个数字
余弦相似度: 两向量夹角越小越相似, 接近1=很像`,
      variable: '—',
      examples: [
        {
          code: `"苹果手机" -> [0.12, -0.83, ...]
"华为手机" -> [0.10, -0.79, ...]   # 很像
"今天天气" -> [-0.55, 0.21, ...]   # 不相关`,
          output: `# 向量库返回: 和查询最像的几段`,
          note: 'LIKE 只能匹配字面关键词，向量能匹配“语义相近”。',
        },
      ],
      rookie: '以为数据库 LIKE 能搜“意思差不多”——它只能匹配字面上的词，搜不到换了说法的相似内容。',
      realWorld: 'RAG 就是“问题向量化→在向量库里找最像的文档片段→交给大模型回答”。',
    },
  ],

  // ==================== vector-1 ====================
  'vector-1': [
    {
      id: 'v1-ann',
      point: 'ANN 近似最近邻：几百万向量怎么搜得动',
      formalDef:
        '库里有几百万条向量，每次都和查询算一遍余弦相似度（精确）太慢。ANN（近似最近邻）用索引“跳着找”，只比较最可能近的几百条，速度快百倍，准确率略降但够用。HNSW 是最常用的图索引：把相似点连成图，找近邻就沿着图跳。',
      fixed: `精确搜索: 全量算相似度, 慢但准
ANN索引(HNSW/IVF): 近似找, 快100倍, 略损失精度`,
      variable: '—',
      examples: [
        {
          code: `# 直觉: 不挨个翻, 而是建一张"谁和谁近"的图
# 从入口点出发, 每次跳到更像的邻居, 直到最近`,
          output: `# 几百万向量里几百毫秒返回 top_k`,
          note: '“近似”是为了换速度，业务上够用。',
        },
      ],
      rookie: '数据量小（几千条）时不用上复杂索引，精确算也很快。',
      realWorld: 'Milvus/Qdrant/Chroma 都内置 HNSW/IVF 索引。',
    },
  ],

  // ==================== vector-2 ====================
  'vector-2': [
    {
      id: 'v2-chunk',
      point: '文档切块与 top_k：RAG 入库检索两步',
      formalDef:
        '一篇长文档不能整篇向量化（太长、抓不住重点），要切成小块 chunk（如 300~500 字），每块单独向量化入库。检索时把问题向量化，在库里找最像的 k 块，k 就是 top_k（如 top 3）。',
      fixed: `长文档 → 切成 chunk → 每个chunk向量化入库
问题向量化 → 库里找最像的 top_k 块 → 喂给大模型`,
      variable: 'chunk 大小、top_k 可按效果调。',
      examples: [
        {
          code: `# 一篇 5000 字文档切成 15 个块
# 用户问问题, 检索出最相关的 3 块(top_k=3)`,
          output: `# 把这3块原文 + 问题一起给大模型回答`,
          note: '块太大召回不准，太小丢上下文，一般 300-500 字起步调。',
        },
      ],
      rookie: '整段长文档直接向量化 → 语义被稀释，检索不到重点。',
      realWorld: '所有 RAG 产品都是“切块→入库→检索 top_k→拼 prompt”。',
    },
  ],

  // ==================== linux-0 ====================
  'linux-0': [
    {
      id: 'lx0-pipe',
      point: '管道 | 与重定向 >：命令行的灵魂',
      formalDef:
        '| 把前一个命令的输出，直接变成后一个命令的输入（“接水管”）。> 把命令的输出写进文件（覆盖），>> 追加进文件。ps aux | grep java 就是“先列出所有进程，再从中筛出带 java 的”。',
      fixed: `命令A | 命令B      # A的输出当B的输入
命令A > 文件      # 输出写进文件(覆盖)
命令A >> 文件     # 追加进文件`,
      variable: '—',
      examples: [
        {
          code: `ps aux | grep java     # 找java进程
netstat -tlnp | grep 8080  # 找监听8080的进程
tail -100 app.log > out.txt  # 最后100行存到out.txt`,
          output: `# 一步步把命令拼起来用`,
          note: '| 是“接水管”，> 是“导向文件”。',
        },
      ],
      rookie: '用 > 时忘了它会覆盖原文件，重要文件先备份。',
      realWorld: 'grep|awk|sort 三连是日志分析日常。',
    },
    {
      id: 'lx0-tailf',
      point: 'tail -f：实时盯着日志增长',
      formalDef:
        'tail 默认看文件最后几行；tail -f（follow）是“跟着文件走”，有新内容写进来就立刻打印到屏幕。服务出问题时开一个窗口 tail -f app.log，就能实时看它在打什么。',
      fixed: `tail -f app.log     # 实时滚动显示新日志
grep -rn "关键词" src/  # 递归搜哪个文件哪行有这个词`,
      variable: '—',
      examples: [
        {
          code: `tail -f app.log
# 程序每打一行日志, 屏幕就立刻多一行
# Ctrl+C 退出`,
          output: `# 实时滚动, 不用反复打开文件`,
          note: '查线上报错第一招。',
        },
      ],
      rookie: 'cat 整个大文件 → 刷屏卡死。看末尾用 tail，翻页用 less。',
      realWorld: '部署完服务先 tail -f 看有没有报错。',
    },
  ],

  // ==================== linux-1 ====================
  'linux-1': [
    {
      id: 'lx1-shell',
      point: 'Shell 脚本：变量、if、for 怎么写',
      formalDef:
        'Shell 脚本是把一串命令写进 .sh 文件批量跑。变量取值用 $var；命令结果取进变量用 $(命令)；if [ 条件 ]；for f in *.log 遍历。写完 chmod +x 加执行权限。',
      fixed: `#!/bin/bash
count=$(ls *.log | wc -l)     # 命令结果给变量
for f in *.log; do
  if [ -f "$f" ]; then echo "$f"; fi
done`,
      variable: '—',
      examples: [
        {
          code: `count=$(ls *.log | wc -l)
echo "日志文件数: $count"`,
          output: `日志文件数: 5`,
          note: '$() 里的命令先跑, 结果塞进 count。',
        },
      ],
      rookie: 'if [ ... ] 里 [ 和 ] 两边必须有空格，否则报错。',
      realWorld: '备份、清理日志、批量跑任务都写成 .sh。',
    },
    {
      id: 'lx1-cron',
      point: 'crontab：五个星位怎么排定时任务',
      formalDef:
        'crontab -e 编辑定时任务。每行五段时间：分 时 日 月 周，后面跟要跑的命令。五个星代表“任意”。每天凌晨 2 点跑 backup.sh 就是 0 2 * * *。',
      fixed: `分 时 日 月 周   命令
0   2  *  *  *   /path/backup.sh    # 每天2:00
*/5 *  *  *  *   某命令              # 每5分钟`,
      variable: '时间和命令按需求填。',
      examples: [
        {
          code: `# 每天凌晨2点打包日志
0 2 * * * /home/me/backup.sh`,
          output: `# 到点系统自动跑, 不用人盯着`,
          note: '路径要写绝对路径。',
        },
      ],
      rookie: '命令里用了相对路径/环境变量 → cron 下找不到。写绝对路径。',
      realWorld: '定时备份、定时跑报表脚本。',
    },
  ],

  // ==================== linux-2 ====================
  'linux-2': [
    {
      id: 'lx2-nohup',
      point: 'nohup / systemd：让程序后台常驻',
      formalDef:
        '直接 ./server 跑，一关终端程序就死。nohup ./server & 是“忽略挂断信号，关了终端也继续跑”。生产更规范的是 systemd（systemctl start/restart/status）托管，开机自启、崩了自动拉起来。',
      fixed: `nohup ./server &          # 关终端也继续
systemctl status nginx      # 看状态
systemctl restart nginx     # 重启
journalctl -u nginx -f      # 跟服务日志`,
      variable: '—',
      examples: [
        {
          code: `nohup ./server > server.log 2>&1 &
# 输出都写进 server.log, 程序后台跑`,
          output: `# 关掉终端它还在跑`,
          note: '& 放后台, nohup 防挂断。',
        },
      ],
      rookie: '前台跑服务然后关终端 → 别人访问不到。生产用 systemd。',
      realWorld: '服务挂了第一步：systemctl status 看状态，journalctl -u 看日志。',
    },
  ],

  // ==================== git-0 ====================
  'git-0': [
    {
      id: 'g0-loop',
      point: '工作区/暂存区/本地库：add 和 commit 在干嘛',
      formalDef:
        '你改文件的地方叫工作区；git add 把改动放进“暂存区”（下次要提交的清单）；git commit 把暂存区的内容正式存成本地库的一个版本。三个区：改 → add 暂存 → commit 存档。',
      fixed: `git add .            # 改动放进暂存区
git commit -m "说明"  # 暂存区存成一个版本
git status           # 看现在三个区什么状态
git diff             # 看还没 add 的改动`,
      variable: '—',
      examples: [
        {
          code: `# 改了 main.py
git add main.py        # 加入暂存
git commit -m "feat: 加了登录"  # 存档`,
          output: `# 历史多了一个版本`,
          note: 'commit message 写清改了什么, 别写 update。',
        },
      ],
      rookie: '改完直接 commit 不 add → 新文件没进去。养成 add . 再 commit。',
      realWorld: '这个循环每天做几十次。',
    },
    {
      id: 'g0-reset',
      point: 'git reset --soft/--hard：撤销 commit 的区别',
      formalDef:
        'git reset HEAD~1 是回到上一个版本。--soft 只撤 commit、改动还留在暂存区（最安全）；--mixed（默认）撤 commit 和暂存、改动留在工作区；--hard 连改动一起丢掉（危险，别乱用来路不明的代码）。',
      fixed: `git reset --soft HEAD~1   # 撤commit, 改动保留
git reset --hard HEAD~1   # 撤commit+改动全丢(危险)`,
      variable: '—',
      examples: [
        {
          code: `# 刚 commit 发现写错信息, 想重写:
git reset --soft HEAD~1
# 代码还在, 重新 add/commit`,
          output: `# --hard 会把没提交的改动也删光`,
          note: '没把握用 --soft，--hard 三思。',
        },
      ],
      rookie: '随手 --hard → 没提交的代码全没了。',
      realWorld: 'commit 写错信息/还没写完，用 --soft 撤回来改。',
    },
  ],

  // ==================== git-1 ====================
  'git-1': [
    {
      id: 'g1-branch',
      point: '分支与冲突：怎么开分支、怎么解决冲突',
      formalDef:
        '分支就是“抄一条平行历史”，在 feature 分支上改不影响 main。git checkout -b feature/login 新开并切过去；改完切回 main，git merge feature/login 把它合回来。如果两个人改了同一行，Git 不知道听谁的，就在文件里留下 <<<<<<< 冲突标记，你手动选保留谁，再 add/commit。',
      fixed: `git checkout -b feature/login   # 开新分支并切过去
git checkout main               # 切回主分支
git merge feature/login         # 合并进来
# 冲突文件里手动选:
<<<<<<< HEAD
main的版本
=======
feature的版本
>>>>>>> feature/login`,
      variable: '—',
      examples: [
        {
          code: `# 两个分支都改了第3行
# Git 在文件里插入 <<<<<<< ======= >>>>>>>
# 删掉标记, 留正确的, 然后:
git add .
git commit`,
          output: `# 冲突解决完就合好了`,
          note: '冲突不可怕, 打开文件选保留谁即可。',
        },
      ],
      rookie: '怕冲突就不敢用分支——冲突是正常协作, 手动选完就行。',
      realWorld: 'main 永远是稳定版, 新功能都在 feature 分支做。',
    },
  ],

  // ==================== git-2 ====================
  'git-2': [
    {
      id: 'g2-pr',
      point: 'PR/MR 流程：push 之后怎么合并',
      formalDef:
        '本地 commit 后，git push 把分支推到远程（GitHub/GitLab）。然后在网页上发 Pull Request：请求“把我的分支合进 main”。同事 review 提意见，你改完再 push，最后由人点 Merge 合并到 main。',
      fixed: `git push origin feature/login
# 网页上: New Pull Request → review → Merge`,
      variable: '—',
      examples: [
        {
          code: `git checkout -b feature/login
# 改代码...
git add . && git commit -m "feat: 登录"
git push origin feature/login`,
          output: `# 然后去网页发 PR, 等同事合并`,
          note: 'PR 是“请别人审完再合”, 不是自己直接 push 到 main。',
        },
      ],
      rookie: '直接在 main 上开发并直推 → 别人 review 都没有。开分支发 PR。',
      realWorld: '所有公司都走 PR 流程, 这就是简历里“团队协作经验”。',
    },
  ],

  // ==================== spring-0 ====================
  'spring-0': [
    {
      id: 'sp0-ioc',
      point: 'IoC 与依赖注入：你不 new，Spring 帮你塞',
      formalDef:
        '以前你要在 OrderService 里自己 new PayService()。IoC（控制反转）是反过来：这些对象（叫 Bean）由 Spring 容器统一创建和管理；你需要 PayService 时，Spring 自动把它“塞”进来（构造器注入）。好处：换支付实现时只改一处，代码不写死。',
      fixed: `@Service                          // 标注这是一个 Bean, 交给容器管
public class OrderService {
    private final PayService payService;
    public OrderService(PayService payService) {  // 构造器: 容器自动把 payService 传进来
        this.payService = payService;
    }
}`,
      variable: '—',
      examples: [
        {
          code: `// 你不用写: PayService p = new WxPay();
// 只声明构造参数, Spring 会把它找到并传进来`,
          output: `# 想换成 AliPay, 只需让容器注册另一个实现, 业务代码不改`,
          note: 'Bean = 被 Spring 容器管理的对象。',
        },
      ],
      rookie: '字段上 @Autowired 是把依赖写死在类里；构造器注入更易测、不可变，团队推荐。',
      realWorld: 'Spring 全家桶都建立在 IoC 上，Service/Mapper 全是 Bean。',
    },
  ],

  // ==================== spring-1 ====================
  'spring-1': [
    {
      id: 'sp1-rest',
      point: '@RestController 与统一返回体：企业接口长什么样',
      formalDef:
        '@RestController 标注这个类专门处理 HTTP 请求；@PostMapping("/orders") 把 POST /orders 绑到一个方法。企业里不直接返回实体，而是包装成统一 Result{code,message,data}，前端好判断成功失败。@Valid 触发参数校验，校验失败抛异常，由全局 @RestControllerAdvice 统一接住返回错误 JSON。',
      fixed: `@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
    public Result create(@Valid @RequestBody OrderDTO dto) { ... }
}`,
      variable: '—',
      examples: [
        {
          code: `# 返回统一长这样:
{"code":0,"message":"ok","data":{"id":1}}
# 参数金额 @Min(0.01) 传了 -1 时:
{"code":400,"message":"金额必须大于0"}`,
          output: `# 前端永远按 code 判断, 不用 try/catch 读堆栈`,
          note: '@RequestBody 把 JSON 请求体转成 DTO 对象。',
        },
      ],
      rookie: '把异常堆栈直接抛给前端 → 既不专业又泄露信息。全局处理成统一错误 JSON。',
      realWorld: '公司所有接口都是统一 Result + 全局异常。',
    },
  ],

  // ==================== spring-2 ====================
  'spring-2': [
    {
      id: 'sp2-tx',
      point: '@Transactional：标在方法上的声明式事务',
      formalDef:
        '@Transactional 标在方法上，Spring 自动给它包一层事务：方法正常跑完就 COMMIT；方法里抛异常就 ROLLBACK。这样“改订单状态 + 记支付流水”要么都成、要么都回滚。注意：同类内部直接 this.调用 不会生效（要走代理）。',
      fixed: `@Transactional
public void pay(Long orderId) {
    orderMapper.updateStatus(orderId, "PAID");
    payMapper.record(...);
    // 任一步抛异常 → 整个回滚
}`,
      variable: '—',
      examples: [
        {
          code: `# 两步: 改订单 + 记流水
# 如果记流水那步抛异常, 改订单也被回滚`,
          output: `# 不会出现“订单已付但没流水”`,
          note: '默认只对 RuntimeException/Error 回滚。',
        },
      ],
      rookie: '在同一个类里 A() 调 B()，B 上的 @Transactional 不生效——因为没经过 Spring 代理。',
      realWorld: '支付、下单、转账方法必加 @Transactional。',
    },
  ],

  // ==================== spring-3 ====================
  'spring-3': [
    {
      id: 'sp3-micro',
      point: '微服务三大件：注册中心 / 网关 / 配置中心',
      formalDef:
        '大应用拆成多个小服务后：服务 B 的地址会变，所以要有“注册中心”——每个服务上线来登记自己地址，A 找 B 时去注册中心问；“网关”是统一大门，所有请求先进网关做鉴权、路由；“配置中心”集中管所有服务的配置，改一处不用重启各服务。',
      fixed: `用户 → 网关(鉴权/路由) → 订单服务 / 支付服务
              ↑ 都向注册中心登记自己地址
        配置中心集中管各服务配置`,
      variable: '—',
      examples: [
        {
          code: `# 知道为什么拆即可:
# 注册中心: 服务找服务
# 网关: 统一入口
# 配置中心: 集中配置`,
          output: `# 这是中高级内容, 面试答出“解决什么问题”即可`,
          note: '新手先把单体 Spring Boot 写熟。',
        },
      ],
      rookie: '一上来就学 Nacos/Sentinel 全套 → 容易晕。先理解“为什么需要”。',
      realWorld: '大厂后端都是微服务架构。',
    },
  ],

  // ==================== fastapi-0 ====================
  'fastapi-0': [
    {
      id: 'fa0-rest',
      point: 'REST 与状态码：URL 表资源、动词表操作',
      formalDef:
        'REST 风格：URL 表示“资源”（/orders 订单），HTTP 方法表示“操作”：GET 查、POST 建、PUT 改、DELETE 删。状态码告诉你结果：200 成功、400 你参数错、401 你没登录、403 你没权限、404 资源不存在、500 我服务器错了。',
      fixed: `GET    /orders      查列表
POST   /orders      新建
GET    /orders/{id} 查单个
PUT    /orders/{id} 修改
DELETE /orders/{id} 删除`,
      variable: '—',
      examples: [
        {
          code: `GET  /orders/1   → 200 {订单}     # 找到了
GET  /orders/999 → 404            # 不存在
POST /orders 缺参数 → 400         # 你参数错
没token访问       → 401           # 没登录`,
          output: `# 401=没登录, 403=登录了但没权限`,
          note: '按状态码排错：4xx 是你请求的问题, 5xx 是我服务的问题。',
        },
      ],
      rookie: '把所有操作都做成 POST /getOrder、/createOrder → 不是 REST 风格。用 HTTP 动词。',
      realWorld: '所有后端接口都遵循这套。',
    },
  ],

  // ==================== fastapi-1 ====================
  'fastapi-1': [
    {
      id: 'fa1-pydantic',
      point: 'Pydantic 与 /docs：FastAPI 为什么自带文档',
      formalDef:
        'class Item(BaseModel): name: str; price: float 是声明“这个接口接收的数据长什么样”。FastAPI 据此自动做参数校验、自动生成接口文档。启动后访问 /docs 就是 Swagger 试调页面，不用额外工具就能测接口。uvicorn 是跑这个 app 的服务器。',
      fixed: `class Item(BaseModel):
    name: str
    price: float

@app.post("/items")
def create_item(item: Item):
    return {"id": 1, **item.model_dump()}`,
      variable: '—',
      examples: [
        {
          code: `# 传 {"name":"笔"} 但 price 缺了:
# FastAPI 自动返回 422 + 缺了哪个字段`,
          output: `# 打开 http://localhost:8000/docs
# 网页上点 Try it out 就能直接调`,
          note: '不用 Postman, /docs 就是现成调试页。',
        },
      ],
      rookie: '改完代码要重启 uvicorn 才生效——加 --reload 参数会自动重载。',
      realWorld: '写后端先把 /docs 调通，前端再对接。',
    },
  ],

  // ==================== fastapi-2 ====================
  'fastapi-2': [
    {
      id: 'fa2-cors',
      point: 'CORS 跨域：浏览器为什么拦你的接口',
      formalDef:
        '前端跑在 5173 端口、后端在 8000，浏览器出于安全默认不允许网页跨端口调接口（跨域）。这不是后端报错，是浏览器拦的。在后端加 CORSMiddleware，声明“允许哪些来源访问”，浏览器就放行。生产 allow_origins 要写具体域名，别用 *。',
      fixed: `app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://你的前端域名"],  # 本地可先用 ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)`,
      variable: '—',
      examples: [
        {
          code: `# 浏览器控制台报 "Access-Control-Allow-Origin" 就是跨域
# 后端加上面的中间件即解决`,
          output: `# 前端 fetch 不再被浏览器拦`,
          note: '中间件=包在最外层, 每个请求先过它。',
        },
      ],
      rookie: 'allow_origins=["*"] 直接上生产 → 任何网站都能调你的接口，不安全。',
      realWorld: '前后端分离项目必配 CORS。',
    },
  ],

  // ==================== fastapi-3 ====================
  'fastapi-3': [
    {
      id: 'fa3-ask',
      point: '封装 /ask：把检索+大模型变成一个接口',
      formalDef:
        'RAG 接口就一件事：接收问题 → 检索最相关文档片段 → 把片段+问题拼进给大模型 → 返回答案。POST /ask 收 {question}，返回 {answer, sources}。流式返回（SSE/StreamingResponse）是让答案一个字一个字吐出来，像 ChatGPT 那样打字。',
      fixed: `@app.post("/ask")
def ask(body: AskReq):
    chunks = 检索(body.question)
    answer = 调大模型(拼prompt(chunks, body.question))
    return {"answer": answer, "sources": chunks}`,
      variable: '—',
      examples: [
        {
          code: `# 请求: {"question": "报销标准是多少"}
# 返回: {"answer":"...","sources":["文档第3节"]}`,
          output: `# 错误时统一返回 {"detail":"..."} 而不是堆栈`,
          note: '错误也走统一格式, 别把异常抛给前端。',
        },
      ],
      rookie: '直接把整个检索过程暴露成好几个接口 → 前端难用。一个 /ask 全包。',
      realWorld: '所有 RAG 产品对外就是一个问答接口。',
    },
  ],

  // ==================== docker-0 ====================
  'docker-0': [
    {
      id: 'dk0-dockerfile',
      point: 'Dockerfile：把应用和环境一起打包',
      formalDef:
        '镜像 =“带运行环境的安装包”；容器 = 镜像跑起来的一个进程。Dockerfile 是“怎么造这个镜像”的说明书：FROM 选基础系统、WORKDIR 设工作目录、COPY 把代码拷进去、RUN 装依赖、CMD 启动命令。每一行生成一层，会缓存。',
      fixed: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]`,
      variable: '—',
      examples: [
        {
          code: `# 为什么先 COPY requirements.txt 再 COPY . .:
# 依赖很少变, 放前面能命中缓存, 改了代码不用重装依赖`,
          output: `# docker build -t myapp .
# docker run -p 8000:8000 myapp`,
          note: '-p 8000:8000 把容器8000映射到本机8000。',
        },
      ],
      rookie: '把 COPY . . 放最前面 → 每次改代码都重装依赖，build 慢。',
      realWorld: '后端交付都是“给个镜像”，到哪都能跑。',
    },
  ],

  // ==================== docker-1 ====================
  'docker-1': [
    {
      id: 'dk1-compose',
      point: 'docker compose：一键起“应用+数据库”',
      formalDef:
        '一个项目常要同时跑应用和数据库。compose 把这几个服务写进一个 yml，docker compose up -d 一键全起。depends_on 表示启动顺序；volumes 把容器里的数据目录映射到宿主机——否则容器删了数据就没了。',
      fixed: `services:
  web:
    build: .
    ports: ["8000:8000"]
    depends_on: [db]
  db:
    image: mysql:8
    volumes: ["db_data:/var/lib/mysql"]`,
      variable: '—',
      examples: [
        {
          code: `docker compose up -d     # 后台起所有服务
docker compose down       # 停掉(保留数据)
docker compose down -v    # 连数据卷一起删(危险!)`,
          output: `# 以前要手动起 MySQL+应用, 现在一条命令`,
          note: '-v 会把数据库数据也删掉, 别随便用。',
        },
      ],
      rookie: '数据库数据写在容器里，down 重建后数据全没 → 必须挂 volume。',
      realWorld: '本地开发一律 compose 一键起整套环境。',
    },
  ],

  // ==================== docker-2 ====================
  'docker-2': [
    {
      id: 'dk2-k8s',
      point: 'K8s 三件套：Pod / Deployment / Service',
      formalDef:
        'K8s 是“自动管很多容器”的系统。Pod 是最小单位，包着你的一个容器；Deployment 管“跑几个副本、怎么滚动升级、挂了自动拉起”；Service 给一组 Pod 一个固定入口（IP 会变，Service 不变），把请求轮询到多个副本。',
      fixed: `Deployment: 声明“跑3个副本, 版本从v1升到v2”
Pod: 真正跑容器的最小单元
Service: 固定入口, 把请求分给3个Pod`,
      variable: '—',
      examples: [
        {
          code: `# 一个Pod挂了, Deployment自动再起一个新的(自愈)
# 流量大了, 自动从3个扩到10个(扩缩容)`,
          output: `# 知道这三个+“自愈/扩缩容”即可`,
          note: '这是中高级内容, 面试答出概念即可。',
        },
      ],
      rookie: '一开始就写 YAML 学 K8s → 先理解 Pod/Deployment/Service 各管什么。',
      realWorld: '生产容器几乎都跑在 K8s 上。',
    },
  ],

  // ==================== dist-0 ====================
  'dist-0': [
    {
      id: 'dt0-atomic',
      point: 'count++ 为什么不是原子操作',
      formalDef:
        'count++ 看起来一步，实际是三步：读 count 当前值、加 1、写回去。两个线程同时读到 5，各自写成 6，就少加了一次。这就是并发不安全。解决：加锁（同一时刻只一个线程进）或用原子类。',
      fixed: `# count++ 拆开:
temp = count   # 读
temp = temp+1  # 加
count = temp   # 写
# 两个线程交错, 结果就少`,
      variable: '—',
      examples: [
        {
          code: `# 1000线程各+1000次, 不加锁结果<1000000
# 加锁后 = 1000000`,
          output: `# 不是1000000就说明有并发丢失`,
          note: '这就是超卖/重复扣库存的根因。',
        },
      ],
      rookie: '以为一行操作就是原子的——count++/x+=1 都不是。',
      realWorld: '库存、余额、计数必须加锁或用原子操作。',
    },
  ],

  // ==================== dist-1 ====================
  'dist-1': [
    {
      id: 'dt1-mq',
      point: '消息队列：异步、削峰、解耦',
      formalDef:
        '下单后发短信，如果同步调短信接口，用户得等短信发完才能看到下单成功。插一条消息队列：订单服务发个“已下单”消息就立刻返回，短信服务自己慢慢消费。好处：异步（用户不等）、削峰（突然一万单先排队慢慢处理）、解耦（订单不直接依赖短信服务）。',
      fixed: `下单服务 → [消息队列] → 短信服务/库存服务
好处: 异步 / 削峰 / 解耦`,
      variable: '—',
      examples: [
        {
          code: `# 秒杀1万请求同时来:
# 全部打进消息队列排队, 库存服务按自己速度消费
# 不会一下把数据库打崩`,
          output: `# 这就是“削峰”`,
          note: '代价: 多了个要维护的组件, 且可能重复消费要幂等。',
        },
      ],
      rookie: '忘了“可能重复消费” → 同一条消息消费两次导致重复发短信。消费端要做幂等。',
      realWorld: 'Kafka/RabbitMQ 在订单、通知、日志场景无处不在。',
    },
  ],

  // ==================== dist-2 ====================
  'dist-2': [
    {
      id: 'dt2-cap',
      point: 'CAP 与最终一致性：三个最多选两个',
      formalDef:
        '分布式系统里：C 一致性（大家看到一样的数据）、A 可用性（每个请求都有响应）、P 分区容错（网络断了还能扛）。网络一定会断，所以 P 必选；于是在 C 和 A 间二选一。大多数业务选 AP（优先可用），接受“短暂不一致，过一会儿就一致”——这就是最终一致性。',
      fixed: `C 一致 + A 可用 + P 分区容错, 三者最多取两个
P 必选 → CP(强一致, 如ZK) 或 AP(可用, 多数业务)`,
      variable: '—',
      examples: [
        {
          code: `# 下单减库存: 不要求“所有人瞬间看到同数”
# 接受“晚几百毫秒, 最终大家看到的库存一致”`,
          output: `# 这就是最终一致, 用性能换可用`,
          note: '银行转账要强一致, 普通业务用最终一致。',
        },
      ],
      rookie: '什么都要强一致 → 性能差、系统复杂。按业务重要性选。',
      realWorld: '微服务分布式事务多用最终一致 + 本地消息表。',
    },
  ],

  // ==================== dist-3 ====================
  'dist-3': [
    {
      id: 'dt3-seckill',
      point: '秒杀设计：限流 + Redis预减库存 + 异步下单',
      formalDef:
        '秒杀直接打数据库会被瞬间压垮。标准思路：① 入口限流，挡住超出承受能力的请求；② 库存预热到 Redis，扣减在 Redis 做（快），DB 不被碰；③ 下单请求丢消息队列异步处理；④ 最后 DB 做最终扣减，用乐观锁防超卖。',
      fixed: `请求 → 限流 → Redis预减库存 → 消息队列 → 异步下单 → DB最终扣减`,
      variable: '—',
      examples: [
        {
          code: `# Redis 里: DECR stock
# 扣完<0就回滚, 绝不把请求打到DB`,
          output: `# 超卖? Redis预减+乐观锁, 库存到0就不卖`,
          note: 'Redis 扛住读和扣减, DB 只做少量最终落库。',
        },
      ],
      rookie: '秒杀直接 SELECT 库存再 UPDATE → 高并发必超卖。',
      realWorld: '秒杀/抢券/报名抢位都是这套架构。',
    },
  ],

  // ==================== ds-0 ====================
  'ds-0': [
    {
      id: 'ds0-vector',
      point: 'Numpy 向量化：别写 for 循环，整体算',
      formalDef:
        'Python for 循环很慢；Numpy 把数组操作下沉到 C 层，一次算一整列。a*2 是“数组每个元素都乘 2”，不用写循环；a[a>2] 是布尔索引——把满足条件的元素挑出来。',
      fixed: `import numpy as np
a = np.array([1,2,3,4])
a * 2          # [2 4 6 8] 整体乘
a[a > 2]       # [3 4]    挑出大于2的
a.mean()       # 平均值`,
      variable: '—',
      examples: [
        {
          code: `a = np.array([1,2,3,4])
print(a * 2)
print(a[a > 2])`,
          output: `[2 4 6 8]
[3 4]`,
          note: 'a[a>2] 里 a>2 先算出一个 True/False 掩码, 再用它挑元素。',
        },
      ],
      rookie: '用 Python for 循环逐元素算 → 慢几十倍。数值先想整体运算。',
      realWorld: '处理十万行数据时，向量化和 for 差几个数量级。',
    },
  ],

  // ==================== ds-1 ====================
  'ds-1': [
    {
      id: 'ds1-pandas',
      point: 'Pandas：读 CSV → 清洗 → groupby 统计',
      formalDef:
        'DataFrame 像一张 Excel 表。read_csv 读进来；drop_duplicates 去重、fillna 补缺、to_datetime 转时间类型。分析靠 groupby：按某列分组后对另一列聚合。nunique 是“去重后个数”（UV），count 是“行数”（PV）。',
      fixed: `df = pd.read_csv("a.csv")
df = df.drop_duplicates()
df["dt"] = pd.to_datetime(df["dt"]).dt.date
df.groupby("dt")["uid"].nunique()   # 每日UV`,
      variable: '—',
      examples: [
        {
          code: `# 一行数据访问: uid=1 来5次
# UV(去重人数)=1, PV(总访问次数)=5
df.groupby("dt")["uid"].nunique()  # 每天有多少不同人`,
          output: `# 这就是 DAU/UV 的算法`,
          note: 'nunique=去重计数, 普通count不去重。',
        },
      ],
      rookie: '把 NaN 当 0 算进平均 → 结果偏低。先看 fillna 策略。',
      realWorld: '数据分析日常就是 read → 清洗 → groupby → 画图。',
    },
  ],

  // ==================== ds-2 ====================
  'ds-2': [
    {
      id: 'ds2-chart',
      point: '图表选型：一张图只讲一个结论',
      formalDef:
        '趋势（随时间变）用折线；类别对比用柱状；占比用饼/条；分布用直方图。关键原则：标题直接写结论（“9 月 UV 环比涨 18%”），而不是“UV 趋势”。看图的人 3 秒内就要拿到你的观点。',
      fixed: `趋势→折线   对比→柱状   占比→饼图   分布→直方图`,
      variable: '—',
      examples: [
        {
          code: `# 标题写结论, 不写名词
# 差: "用户趋势"
# 好: "9月DAU环比涨18%, 主要来自自然新增"`,
          output: `# 一张图配一句解释`,
          note: '纵轴不从0开始会夸大差异, 别误导。',
        },
      ],
      rookie: '一张图塞太多信息 → 看不懂。一张图一个结论。',
      realWorld: '汇报、数据看板都按“结论先行”写标题。',
    },
  ],

  // ==================== ds-3 ====================
  'ds-3': [
    {
      id: 'ds3-report',
      point: '分析报告：DAU、留存、异常、可执行建议',
      formalDef:
        '一份分析报告四件套：DAU/趋势（大盘怎么变）、留存（新用户留不留）、异常定位（哪天突然涨/跌、为什么）、两条可执行建议。留存=第N天还回来的人 / 首日来的人。建议要具体到“谁、做什么、预期效果”，别写“加强运营”。',
      fixed: `DAU趋势 + 留存曲线 + 异常那天为什么 + 2条可执行建议`,
      variable: '—',
      examples: [
        {
          code: `# 废话建议: "加强用户运营"
# 可执行建议: "下周把新用户引导第3步改成一键完成, 预计次日留存+3%"`,
          output: `# 有动作、有责任人、有预期`,
          note: '数据结论要落到行动上。',
        },
      ],
      rookie: '只甩数字不说结论和建议 → 报告没人看。',
      realWorld: '增长/数据分析岗的日常产出就是这种报告。',
    },
  ],

  // ==================== ml-0 ====================
  'ml-0': [
    {
      id: 'ml0-feature',
      point: '特征工程：模型只吃数字，类别怎么转',
      formalDef:
        '模型只认数字。类别特征（城市、性别）不能直接喂，要编码：性别这种少量类别用 OneHot（每类变一列 0/1）；年龄这种数值不同量级要标准化（减均值除标准差，拉到同一刻度）。缺失值用均值/中位数填，或单独加一列“是否缺失”。',
      fixed: `类别(少)→OneHot   数值→标准化   缺失→均值填/加标记列`,
      variable: '—',
      examples: [
        {
          code: `# 性别: 男/女 → 两列 [1,0] / [0,1]
# 年龄: 0-100 → 标准化后大致在[-3,3]`,
          output: `# 处理后是一个纯数字矩阵, 形状 (样本数, 特征数)`,
          note: '不归一化, 量级大的特征会主导模型。',
        },
      ],
      rookie: '把城市名当数字1/2/3喂 → 模型误以为2>1有大小关系。类别要 OneHot。',
      realWorld: 'Kaggle 比赛 70% 功夫在特征工程。',
    },
  ],

  // ==================== ml-1 ====================
  'ml-1': [
    {
      id: 'ml1-model',
      point: '模型选型：逻辑回归 baseline + 树模型',
      formalDef:
        '先跑最简单的 LogisticRegression 当 baseline，再上 RandomForest/XGBoost。逻辑回归是线性分界，可解释；树模型按规则一层层分叉，能处理非线性。表格数据上 XGBoost/LightGBM 基本是王。',
      fixed: `先 LogisticRegression(简单baseline)
再 RandomForest / XGBoost(表格数据主力)`,
      variable: '—',
      examples: [
        {
          code: `# sklearn 三行:
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier()
model.fit(X_train, y_train)`,
          output: `# 先跑通, 不用上来就调参`,
          note: '逻辑回归=分类(名字带回归但干分类)。',
        },
      ],
      rookie: '一上来就上深度学习 → 表格数据上反而不如树模型，还慢。',
      realWorld: '表格竞赛/业务建模首选 LightGBM。',
    },
  ],

  // ==================== ml-2 ====================
  'ml-2': [
    {
      id: 'ml2-cv',
      point: '评估指标与交叉验证：accuracy 不够看',
      formalDef:
        '数据不平衡（99% 是负例）时，全猜负也有 99% accuracy，所以要看 AUC、精确率、召回率。交叉验证把数据折成 5 份，轮流 4 份训练 1 份验证，平均下来更稳。训练集准、测试集差就是过拟合。',
      fixed: `cross_val_score(model, X, y, cv=5, scoring="roc_auc")
# 训练好测试差 = 过拟合 → 加正则/减特征/加数据`,
      variable: '—',
      examples: [
        {
          code: `# 100个骗子/1万正常人, 全猜正常也99%准
# 但骗子一个没抓到 → 要看召回率/AUC`,
          output: `# 别只看 accuracy`,
          note: 'AUC 越大越好, 1=完美, 0.5=瞎猜。',
        },
      ],
      rookie: '在测试集上调模型 → 等于考试抄答案，上线就崩。',
      realWorld: '模型上线前必须交叉验证 + 留出测试集。',
    },
  ],

  // ==================== ml-3 ====================
  'ml-3': [
    {
      id: 'ml3-flow',
      point: '完整建模流程：读→特征→训练→评估→结论',
      formalDef:
        '固定五步：读数据 → 做特征 → 训 baseline → 交叉验证评估 → 写结论。不要一上来就堆复杂模型。baseline 跑通后，再看是特征不够还是模型不行。',
      fixed: `读数据 → 特征工程 → 训baseline → 交叉验证 → 结论`,
      variable: '—',
      examples: [
        {
          code: `# 流程跑一遍比换10个模型有用`,
          output: `# 结论: 哪个模型在什么指标上多少分, 下一步优化方向`,
          note: '竞赛和真实建模都是这五步。',
        },
      ],
      rookie: '换模型比来换去不看特征 → 上限被特征卡死。',
      realWorld: '数据挖掘比赛/业务建模都按这个流程交。',
    },
  ],

  // ==================== dl-0 ====================
  'dl-0': [
    {
      id: 'dl0-tensor',
      point: 'Tensor 与 DataLoader：数据怎么喂进模型',
      formalDef:
        'Tensor 就是能算梯度的多维数组（和 numpy 数组几乎一样，只是能在 GPU 上算）。Dataset 定义“一条数据怎么取”；DataLoader 把它按 batch_size 打包、打乱(shuffle)，一批一批喂给模型。',
      fixed: `loader = DataLoader(dataset, batch_size=32, shuffle=True)
for x, y in loader:   # 每次拿到32条`,
      variable: '—',
      examples: [
        {
          code: `x = torch.randn(3, 4)   # 3行4列的随机tensor
# batch_size=32: 模型一次看32条, 不是一条一条`,
          output: `# x.shape 看形状, 是debug第一招`,
          note: 'shuffle=True 每个epoch打乱, 防模型记顺序。',
        },
      ],
      rookie: '一次把全部数据塞进模型 → 显存爆。用 DataLoader 分批。',
      realWorld: '新手先用 TensorDataset/ImageFolder，别手搓 Dataset。',
    },
  ],

  // ==================== dl-1 ====================
  'dl-1': [
    {
      id: 'dl1-loop',
      point: '训练循环五步：照抄先跑通',
      formalDef:
        '每次迭代固定五步：zero_grad() 清掉上次梯度 → 把 x 给模型算出预测 → 对比 y 算 loss → backward() 反向传播算梯度 → step() 优化器更新权重。先照抄跑通，loss 在降就对。',
      fixed: `opt.zero_grad()
loss = loss_fn(model(x), y)
loss.backward()
opt.step()`,
      variable: '—',
      examples: [
        {
          code: `# 为什么 zero_grad: 梯度默认会累加, 不清就叠加错
for x, y in loader:
    opt.zero_grad()
    loss = loss_fn(model(x), y)
    loss.backward()
    opt.step()`,
          output: `# loss 随着 epoch 下降说明在学`,
          note: 'lr(学习率)太大震荡, 太小学得慢, 常用1e-3。',
        },
      ],
      rookie: '忘了 zero_grad → 梯度累加，模型根本不收敛。',
      realWorld: '所有 PyTorch 训练都是这五步循环。',
    },
  ],

  // ==================== dl-2 ====================
  'dl-2': [
    {
      id: 'dl2-save',
      point: '保存加载与推理：训完怎么用',
      formalDef:
        'torch.save(model.state_dict(), "model.pt") 存的是权重参数（不是整个模型代码）。部署时 load 回来、eval() 关掉 dropout 等训练专属层、no_grad() 不算梯度（省显存、提速），再做预测。',
      fixed: `torch.save(model.state_dict(), "model.pt")
model.load_state_dict(torch.load("model.pt"))
model.eval()
with torch.no_grad(): pred = model(x)`,
      variable: '—',
      examples: [
        {
          code: `# 推理阶段一定要 eval + no_grad`,
          output: `# 不然 dropout 还在随机, 结果不稳定且占显存`,
          note: '存 state_dict 不存整个 model 是推荐做法。',
        },
      ],
      rookie: '推理时忘了 eval() → dropout 让每次预测都不一样。',
      realWorld: '训完存权重，部署服务加载一次常驻。',
    },
  ],

  // ==================== dl-3 ====================
  'dl-3': [
    {
      id: 'dl3-attention',
      point: '自注意力与预训练模型：会调就行',
      formalDef:
        '自注意力：句子里每个词都和其他所有词算“相关度”，按相关度加权汇总——这样“苹果”和“手机”能互相注意到。新手不用手搓 Transformer，用 HuggingFace：AutoTokenizer 把文本切成 token 再转数字，AutoModel 加载预训练权重直接用。',
      fixed: `from transformers import AutoModel, AutoTokenizer
tok = AutoTokenizer.from_pretrained("模型名")
model = AutoModel.from_pretrained("模型名")`,
      variable: '—',
      examples: [
        {
          code: `# tokenizer: 把 "我爱你" → [我,爱,你] → 数字id
# model: 输出每个词的向量(embedding)`,
          output: `# 预训练模型在海量文本上训过, 拿来即用`,
          note: 'tokenizer 和 model 必须配对用。',
        },
      ],
      rookie: '试图从零训一个大模型 → 没那卡和数据。先用预训练的。',
      realWorld: 'BERT/GPT 类都是加载预训练模型微调或直接用。',
    },
  ],

  // ==================== llm-0 ====================
  'llm-0': [
    {
      id: 'll0-prompt',
      point: '写稳定 Prompt：角色 + 任务 + 输出格式',
      formalDef:
        '好 Prompt 三要素：你是谁（角色）、做什么（任务）、输出长什么样（格式）。要 JSON 就明确给 schema；要更稳就给 1-2 个例子（few-shot）。改 Prompt 后要用固定几条测试用例回归，别改完不知道有没有变差。',
      fixed: `你是一个客服助手。
只回答订单相关内容。
输出严格 JSON: {"answer": "...", "need_human": true/false}
用户问题: {user_input}`,
      variable: '—',
      examples: [
        {
          code: `# 只说"帮我处理问题" → 模型自由发挥
# 加上"输出JSON schema + 一个例子" → 稳定很多`,
          output: `# few-shot: 给1-2个输入→输出示例, 模型照猫画虎`,
          note: '要 JSON 就明确"只输出JSON, 不要别的话"。',
        },
      ],
      rookie: 'Prompt 靠感觉改 → 改好改坏不知道。固定测试集回归。',
      realWorld: 'LLM 应用大部分工作就是调 Prompt + 评估集。',
    },
  ],

  // ==================== llm-1 ====================
  'llm-1': [
    {
      id: 'll1-chunk',
      point: '文档切块：为什么要切、为什么留重叠',
      formalDef:
        '长文档整篇向量化会稀释语义，所以切成 chunk（如 500 token），每块单独向量化。块之间留一点重叠（如 50 token），防止一句话被从中间切断、上下文丢失。每块还要存元数据（来自哪个文档/章节），方便回答时引用来源。',
      fixed: `长文档 → 500字一块, 块间重叠50字 → 每块向量化入库
每块存: 向量 + 原文 + 来源`,
      variable: '—',
      examples: [
        {
          code: `# 重叠: [0-500], [450-950]... 中间50字重复
# 防止关键句刚好被切在两块中间`,
          output: `# 块大检索不准, 块小上下文不够, 边调边试`,
          note: '存元数据=回答时能说"出自哪份文档"。',
        },
      ],
      rookie: '块太大整文档塞进去 → 检索找不准；不重叠 → 句子被腰斩。',
      realWorld: '所有 RAG 入库第一步都是切块。',
    },
  ],

  // ==================== llm-2 ====================
  'llm-2': [
    {
      id: 'll2-rag',
      point: 'RAG 主循环：检索 → 拼 Prompt → 生成',
      formalDef:
        '用户问问题：① 问题也向量化；② 在向量库找最像的 top_k 块；③ 把这些块原文塞进 Prompt（"根据以下资料回答"）；④ 让大模型基于资料回答。因为答案限定在你给的资料里，它瞎编（幻觉）就少了——这就是 RAG。',
      fixed: `chunks = vector_db.search(问题, top_k=3)
prompt = f"根据资料回答: {chunks}\n问题: {问题}"
answer = llm.generate(prompt)`,
      variable: '—',
      examples: [
        {
          code: `# 不RAG: 模型凭记忆瞎编
# RAG: 只让它基于你给的3段回答, 来源可查`,
          output: `# top_k=3 找3段, 太多引入噪音, 太少不够用`,
          note: '这就是RAG减少幻觉的原理。',
        },
      ],
      rookie: '检索 top_k 给 20 → 把不相关的也塞进去，模型被带偏。',
      realWorld: '企业知识库问答都是这个循环。',
    },
  ],

  // ==================== llm-3 ====================
  'llm-3': [
    {
      id: 'll3-agent',
      point: 'Function Calling / Agent：让模型自己决定调工具',
      formalDef:
        '你告诉模型"你有这些工具"（名字、用途、参数），用户提问时模型自己判断该用哪个、传什么参数；你的程序真的去执行那个工具（查订单/查天气），把结果交回模型，模型再接着回答。这样"模型→工具→模型"循环就是 Agent。',
      fixed: `你有工具: get_order(order_id)
用户: "我订单到哪了"
模型决定: 调 get_order(参数=...)
程序执行 → 结果交回 → 模型组织语言回答`,
      variable: '—',
      examples: [
        {
          code: `# 模型不是直接编答案, 而是先调你给的工具拿真实数据`,
          output: `# 循环直到模型觉得信息够了, 给出最终答案`,
          note: '谁决定调哪个? 模型自己决定, 你只提供工具描述。',
        },
      ],
      rookie: '把工具结果直接当最终答案 → 应该让模型基于结果组织成自然语言。',
      realWorld: '智能客服、查订单/查天气的助手都是 Function Calling。',
    },
  ],

  // ==================== deploy-0 ====================
  'deploy-0': [
    {
      id: 'dp0-serve',
      point: '推理服务：模型启动时加载一次',
      formalDef:
        '把模型包成 FastAPI：POST /predict 收输入。关键：模型在服务启动时加载一次常驻内存，绝不能每个请求都重新 load（慢死）。GPU 上攒一批再一起推理（batch）更快。',
      fixed: `app启动时: model = load()   # 只加载一次
每个请求: pred = model.predict(x)  # 复用`,
      variable: '—',
      examples: [
        {
          code: `# 反例: 每个请求 torch.load() → 慢
# 正例: 全局加载一次, 请求复用`,
          output: `# /predict 收到输入立刻推理返回`,
          note: 'batch 把多个请求凑一起算, GPU利用率高。',
        },
      ],
      rookie: '每个请求加载模型 → QPS 极低。启动时加载。',
      realWorld: '模型上线都是常驻服务 + /predict 接口。',
    },
  ],

  // ==================== deploy-1 ====================
  'deploy-1': [
    {
      id: 'dp1-accelerate',
      point: '推理加速：vLLM、量化、连续批处理',
      formalDef:
        '大模型慢在逐 token 生成。vLLM 用 PagedAttention 把多个请求拼一起连续批处理（不用等一个跑完）；量化（INT8/INT4）把权重从 16 位压到 8/4 位，显存降一半、速度快，精度略损。知道为什么即可。',
      fixed: `vLLM: 连续批处理, 多个请求一起跑
量化: 权重INT4/INT8, 省显存提速`,
      variable: '—',
      examples: [
        {
          code: `# 原生transformers一次只跑一个请求
# vLLM把一堆请求拼一起, GPU不闲着`,
          output: `# 同样一张卡, 吞吐高很多倍`,
          note: '显存主要被模型权重和KV缓存占着。',
        },
      ],
      rookie: '自己用 transformers 跑生产 → 慢且贵。上 vLLM/TGI。',
      realWorld: '开源大模型部署几乎都用 vLLM。',
    },
  ],

  // ==================== deploy-2 ====================
  'deploy-2': [
    {
      id: 'dp2-monitor',
      point: '上线监控：延迟、吞吐、效果',
      formalDef:
        '三个核心：延迟（P95，95% 请求在多久内返回）、吞吐（每秒请求数 QPS）、效果（线上数据会随时间漂移，模型效果会变差，要定期评测）。再加 /health 健康检查。',
      fixed: `延迟 P95   吞吐 QPS   效果 定期评测   + /health`,
      variable: '—',
      examples: [
        {
          code: `# P95=200ms: 95%的请求在200ms内, 5%更慢
# 数据漂移: 线上输入变了, 模型效果悄悄变差`,
          output: `# 所以要有定期抽检/回归评测`,
          note: 'P95 比平均更能反映真实用户体验。',
        },
      ],
      rookie: '只看平均延迟 → 长尾用户卡得要死你不知道。看 P95/P99。',
      realWorld: '模型上线不是终点，监控和再训练是长期事。',
    },
  ],

  // ==================== web-0 ====================
  'web-0': [
    {
      id: 'w0-box',
      point: '盒模型与 Flex/Grid：元素怎么排位置',
      formalDef:
        '每个 HTML 元素都是一个盒子：content（内容）+ padding（内边距）+ border（边框）+ margin（外边距）。Flex 管一维（一行或一列），Grid 管二维（像表格那样行列）。布局先想用 Flex 还是 Grid。',
      fixed: `display: flex;          /* 一维: 横向排 */
display: grid;          /* 二维: 行列 */
grid-template-columns: 200px 1fr;  /* 左200, 右占满 */`,
      variable: '—',
      examples: [
        {
          code: `/* 左栏固定200, 右栏填满剩下 */
.layout { display: grid; grid-template-columns: 200px 1fr; }`,
          output: `# 1fr = 剩余空间一份`,
          note: '一行东西用Flex, 整页骨架用Grid。',
        },
      ],
      rookie: '乱用 margin 调位置 → 盒模型没搞懂。先想 padding 还是 margin。',
      realWorld: '整个页面骨架用 Grid，导航栏用 Flex。',
    },
  ],

  // ==================== web-1 ====================
  'web-1': [
    {
      id: 'w1-media',
      point: '响应式与媒体查询：手机和桌面都好看',
      formalDef:
        '响应式是同一套代码在手机竖屏和桌面横屏都好看。媒体查询 @media (min-width:768px) 是“屏幕宽超过768时才应用这些样式”。移动端优先：先写手机单列，桌面再放宽成多列。',
      fixed: `/* 先写手机: 一列 */
.card-list { display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) {
  .card-list { grid-template-columns: 1fr 1fr; }  /* 桌面两列 */
}`,
      variable: '—',
      examples: [
        {
          code: `# 手机: 一行一个卡片
# 屏幕变宽到768: 一行两个`,
          output: `# 一套代码自适应`,
          note: 'viewport 标签让网页按设备宽度渲染, 别写死宽度。',
        },
      ],
      rookie: '写死固定宽度 → 手机上要左右滑动。用百分比/fr。',
      realWorld: '现在所有页面都要手机自适应。',
    },
  ],

  // ==================== web-2 ====================
  'web-2': [
    {
      id: 'w2-fetch',
      point: 'JS 三件事：选元素、监听、fetch 异步取数据',
      formalDef:
        'querySelector 选元素；addEventListener("click", ...) 监听点击；fetch 发网络请求。fetch 返回 Promise（不是立刻有结果），用 async/await 让它读起来像同步：await fetch(...) 等它回来，再 await r.json()。',
      fixed: `btn.addEventListener("click", async () => {
  const r = await fetch("/api/data");
  const data = await r.json();
  out.textContent = JSON.stringify(data);
});`,
      variable: '—',
      examples: [
        {
          code: `// await 就是"等这个完成再往下走"
// 不然直接拿 r.json() 会是个 Promise 不是数据`,
          output: `# 点按钮 → 请求 → 把结果写到页面上`,
          note: 'fetch 404/500 不算报错, 要手动看 r.ok。',
        },
      ],
      rookie: '忘了 await → 拿到的是 Promise 对象不是数据。',
      realWorld: '按钮调接口、渲染列表，前端基本功。',
    },
  ],

  // ==================== vue-0 ====================
  'vue-0': [
    {
      id: 'vu0-ref',
      point: 'ref 与模板指令：Vue 最常用的几个',
      formalDef:
        'ref(0) 包一个响应式变量：它变了页面自动更新。JS 里要 .value 取/改（count.value++），模板里直接 {{ count }} 自动解包。指令：v-if 显示隐藏、v-for 循环列表、@click 绑事件、:title 绑属性。',
      fixed: `const count = ref(0)          // JS里用 count.value
<button @click="count++">      // 模板里直接用
<li v-for="item in list" :key="item.id">`,
      variable: '—',
      examples: [
        {
          code: `const title = ref('你好')
// JS里改: title.value = '新的'
// 模板自动跟着变
<h2>{{ title }}</h2>`,
          output: `# 改.value, 页面自动更新`,
          note: 'v-for 必须加 :key, 帮 Vue 高效复用列表项。',
        },
      ],
      rookie: 'JS 里写 count++ 而不是 count.value++ → 报错。模板里才省略 .value。',
      realWorld: 'Vue 业务页面 80% 是 ref + v-if/v-for。',
    },
  ],

  // ==================== vue-1 ====================
  'vue-1': [
    {
      id: 'vu1-props',
      point: '组件通信：props 入、emit 出',
      formalDef:
        '组件是自定义标签。父组件传数据给子组件用 props（defineProps）；子组件想通知父组件做某事，用 emit（defineEmits）触发一个事件，父组件监听 @事件。数据方向：父→子靠 props，子→父靠 emit。',
      fixed: `// 子组件:
const props = defineProps({ title: String })
const emit = defineEmits(['done'])
// 父组件用:
<Child :title="t" @done="onDone" />`,
      variable: '—',
      examples: [
        {
          code: `# 父传 item 给子, 子点删除时 emit('delete', id)
# 父监听 @delete="handleDelete"`,
          output: `# 子组件不直接改父数据, 只发事件让父改`,
          note: 'props 是只读的, 子组件别改它。',
        },
      ],
      rookie: '子组件直接改 props → 反数据流混乱。用 emit 通知父。',
      realWorld: 'TodoItem 列表、表单组件都是这套。',
    },
  ],

  // ==================== vue-2 ====================
  'vue-2': [
    {
      id: 'vu2-pinia',
      point: 'Pinia 与路由：跨组件共享状态',
      formalDef:
        'props 一层层传太麻烦时，把共享状态（登录用户、主题）放 Pinia 这个全局仓库，任何组件直接取。Vue Router 管“哪个 URL 显示哪个页面”，和后端路由对应。',
      fixed: `// store: 全局一份登录用户
// 任何组件: useUserStore().name
// router: /home → Home页, /about → About页`,
      variable: '—',
      examples: [
        {
          code: `# 登录用户名存Pinia, 导航栏和个人页都能直接读
# 不用一层层props传`,
          output: `# 路由切换不刷新整页, 体验好`,
          note: '小项目用props, 大项目才上Pinia。',
        },
      ],
      rookie: '什么都塞全局 store → 没必要。只放真跨组件共享的。',
      realWorld: 'Vue 中大型项目标配 Pinia + Router。',
    },
  ],

  // ==================== react-0 ====================
  'react-0': [
    {
      id: 'r0-jsx',
      point: '函数组件与 JSX：React 怎么写',
      formalDef:
        '组件就是一个返回 UI 的函数。JSX 里写 HTML 但有两个区别：① class 要写成 className（class 是 JS 保留字）；② 用 {} 嵌 JS 表达式。Props 是函数参数，只读。children 是标签中间夹的内容。',
      fixed: `function Card({ title, children }) {
  return <div className="card"><h3>{title}</h3>{children}</div>
}
// 用: <Card title="订单123">状态:待支付</Card>`,
      variable: '—',
      examples: [
        {
          code: `# <Card title="x">中间内容</Card>
# title 是props, "中间内容" 是 children`,
          output: `# props 只读, 别在组件里改它`,
          note: 'className 不是 class。',
        },
      ],
      rookie: 'JSX 里写 class → React 不认，要写 className。',
      realWorld: 'React 项目全是函数组件，不用学类组件。',
    },
  ],

  // ==================== react-1 ====================
  'react-1': [
    {
      id: 'r1-hooks',
      point: 'useState / useEffect：React 两个核心 Hook',
      formalDef:
        'useState(0) 返回 [当前值, 改它的函数]：const [count, setCount] = useState(0)，改状态用 setCount(n)，React 自动重渲染。useEffect 处理“渲染之外的事”（定时器、请求、订阅），第二个参数 [] 表示只在挂载后跑一次；return 的函数是清理（如清定时器）。',
      fixed: `const [count, setCount] = useState(0);
useEffect(() => {
  const t = setInterval(() => setCount(c => c+1), 1000);
  return () => clearInterval(t);   // 清理
}, []);`,
      variable: '—',
      examples: [
        {
          code: `# 点按钮: setCount(count+1) → React重渲染
# useEffect: 组件挂载后启动定时器, 卸载时清掉`,
          output: `# 依赖数组[]=只跑一次, [count]=每次count变都跑`,
          note: '改状态必须用 setCount, 不能直接 count++。',
        },
      ],
      rookie: '直接改 count++ → 页面不更新。必须用 setCount。',
      realWorld: '所有 React 组件都靠这两个 Hook。',
    },
  ],

  // ==================== react-2 ====================
  'react-2': [
    {
      id: 'r2-router',
      point: '全局状态与路由：什么时候上工具库',
      formalDef:
        '小项目 useState 就够；多个组件共享同一状态（登录用户）才用 Zustand/Redux。React Router 根据 URL 显示不同页面。Vite 是开发/构建工具（你现在这个网站就是 Vite 跑的）。',
      fixed: `小项目: useState
跨组件共享: Zustand/Redux
页面切换: React Router
构建: Vite`,
      variable: '—',
      examples: [
        {
          code: `# 侧边栏点不同项 → URL变 → Router渲染不同页面`,
          output: `# 这就是SPA: 不刷新整页切换`,
          note: '别一上来就Redux, 先看是不是真需要。',
        },
      ],
      rookie: '小项目硬上 Redux → 过度设计。useState 够用就别加。',
      realWorld: 'React 现代栈: Vite + Router + (Zustand)。',
    },
  ],

  // ==================== review-0 ====================
  'review-0': [
    {
      id: 'rv0-clean',
      point: '代码可读性：命名、拆分、注释',
      formalDef:
        '命名见意（userCount 别用 uc）；一个函数只做一件事，超过 20 行考虑拆；注释写“为什么这么做”，不写“这行在加1”（代码自己会说）。',
      fixed: `好: userCount, isPaid
坏: uc, flag1
注释写为什么: // 这里必须乘0.9, 因为...
别写: // i 加1`,
      variable: '—',
      examples: [
        {
          code: `# 好命名让人不用翻实现就知道在干嘛`,
          output: `# 三个月后你自己也看得懂`,
          note: '坏代码不是不能跑, 是别人不敢改。',
        },
      ],
      rookie: '注释逐行解释代码 → 代码一改注释就错。注释讲意图。',
      realWorld: '团队代码 review 第一看可读性。',
    },
  ],

  // ==================== review-1 ====================
  'review-1': [
    {
      id: 'rv1-test',
      point: '单元测试：正常/边界/异常三类用例',
      formalDef:
        '测一个函数写三类：正常输入、边界（0、空、超大）、异常（该报错的输入）。测“行为是什么”（输入X应得Y），不测“代码怎么写的”。覆盖率不是目的，关键路径有测试才重要。',
      fixed: `# 折扣函数:
正常: 100元打8折=80
边界: 0元=0
异常: 负价应报错`,
      variable: '—',
      examples: [
        {
          code: `# 别测"函数里用了几个if"
# 要测"给它什么输入, 它返回什么"`,
          output: `# 改实现时测试不报错=没改坏行为`,
          note: '边界最容易出bug, 必测。',
        },
      ],
      rookie: '追求100%覆盖率写无用测试 → 维护负担。测关键路径。',
      realWorld: '重构有测试才敢动手。',
    },
  ],

  // ==================== review-2 ====================
  'review-2': [
    {
      id: 'rv2-review',
      point: 'Code Review：对事不对人，带建议',
      formalDef:
        'Review 不是挑刺。结构：先说这段解决了什么 → 再说哪里可能有问题 → 给具体建议（“要不改成 X？”）。对代码不对人。',
      fixed: `先肯定: "这段把支付流程理清楚了"
再提问: "这里空指针会吗?"
带方案: "要不加个 if null 判断?"`,
      variable: '—',
      examples: [
        {
          code: `# 差: "这写得什么垃圾"
# 好: "这里如果 row 为 null 会 NPE, 要不加个判空?"`,
          output: `# 对方容易接受, 也给了解法`,
          note: '发现bug要给复现/建议, 不是只说"这里错了"。',
        },
      ],
      rookie: 'Review 当成批评 → 气氛变差。它是帮代码变好。',
      realWorld: 'PR 上每条评论都该是可执行的建议。',
    },
  ],

  // ==================== docs-0 ====================
  'docs-0': [
    {
      id: 'dc0-userstory',
      point: '用户故事与验收标准：把模糊需求拆成可验收',
      formalDef:
        '用户故事模板：作为 X，我想 Y，以便 Z。验收标准（AC）写可勾选项：“给定...当...那么...”或列点。关键是把“做个订单系统”拆成“用户能创建/取消/查看状态”这种一条条能验的事。',
      fixed: `作为 用户, 我想 取消未支付订单, 以便 释放库存
验收:
- 未支付订单可取消
- 已支付不可取消
- 取消后状态变为已取消`,
      variable: '—',
      examples: [
        {
          code: `# 模糊: "做个订单系统"
# 拆成可验收的一条条故事`,
          output: `# 每条都能勾"做到没做到"`,
          note: '模糊需求多问一句: 什么算做完了?',
        },
      ],
      rookie: '只写“实现订单功能” → 开发完对不上预期。先写验收标准。',
      realWorld: '产品给需求、开发拆任务，都用这套。',
    },
  ],

  // ==================== docs-1 ====================
  'docs-1': [
    {
      id: 'dc1-design',
      point: '技术方案四段式：背景/方案/影响/风险',
      formalDef:
        '写代码前先写方案：① 背景（为什么要做）② 方案（怎么做，画个架构图）③ 影响面（改了哪些模块）④ 风险与回滚（出问题怎么撤）。',
      fixed: `背景: 为什么现在要做
方案: 怎么做(附架构图)
影响面: 动了哪些模块
风险: 出问题怎么回滚`,
      variable: '—',
      examples: [
        {
          code: `# 一页文档说清, 评审通过再动手`,
          output: `# 不写风险=没想到失败怎么办`,
          note: '一张图胜过千言, 架构图必画。',
        },
      ],
      rookie: '上来就写代码 → 做完发现方向错了。先方案后代码。',
      realWorld: '中大型功能先过技术评审。',
    },
  ],

  // ==================== docs-2 ====================
  'docs-2': [
    {
      id: 'dc2-retro',
      point: '复盘三问：结果/归因/改进项',
      formalDef:
        '复盘不是流水账也不是检讨：① 结果怎样（用数据）② 为什么（归因，对事不对人）③ 下次怎么做（action item：谁、什么时候、做什么）。',
      fixed: `结果: 这次上线后错误率2%
归因: 压测没覆盖并发场景
改进: 下周前加并发压测, 张三负责`,
      variable: '—',
      examples: [
        {
          code: `# 有数据、有原因、有负责人和时间`,
          output: `# 不是"这次没做好下次注意"`,
          note: '归因别甩锅个人, 找流程/机制问题。',
        },
      ],
      rookie: '复盘写成检讨 → 下次还犯。写成 action item 才算数。',
      realWorld: '每个项目结束开复盘会。',
    },
  ],

  // ==================== agile-0 ====================
  'agile-0': [
    {
      id: 'ag0-standup',
      point: '迭代与站会：小步快跑',
      formalDef:
        '敏捷不是开会，是小步快跑：一个迭代（1-2周）做一批事；每天站会三句——昨天做了什么、今天做什么、有什么卡住。看板分 To Do/Doing/Done。',
      fixed: `站会三问:
1. 昨天完成了什么
2. 今天计划做什么
3. 有什么阻碍`,
      variable: '—',
      examples: [
        {
          code: `# 看板: To Do → Doing → Done, 谁在做什么一眼可见`,
          output: `# 别让任务一直堆在 Doing`,
          note: '站会只讲三句, 细节会后聊。',
        },
      ],
      rookie: '站会开成汇报大会讲细节 → 浪费时间。三句话。',
      realWorld: '互联网研发主流节奏。',
    },
  ],

  // ==================== agile-1 ====================
  'agile-1': [
    {
      id: 'ag1-split',
      point: '拆任务：多大算够小',
      formalDef:
        '好任务标准：一个迭代能做完、能演示、能验收。“学 Python”太大；“写个带函数和文件读写的 score.py 并测通”才够小。拆到 2-3 天能做完。',
      fixed: `# 大: "学会数据分析"
# 小: "用pandas读CSV并groupby统计UV, 3天完成"`,
      variable: '—',
      examples: [
        {
          code: `# 3天做不完=还要再拆`,
          output: `# 能演示才算完成`,
          note: '拆到可演示、可验收为止。',
        },
      ],
      rookie: '任务写“完成模块开发”→ 两周后不知道做到哪。',
      realWorld: '排期全靠拆任务颗粒度。',
    },
  ],

  // ==================== agile-2 ====================
  'agile-2': [
    {
      id: 'ag2-report',
      point: '汇报公式：结论先行 + 风险求助',
      formalDef:
        '汇报公式：结论先行 + 数据支撑 + 下一步 + 风险求助。卡住别硬扛三天，越早暴露越多能帮。“我卡在 X，试了 A/B 不行，想找 Y 讨论”是专业求助。',
      fixed: `结论: X已完成/卡住
数据: 进度60%
下一步: 明天做Y
风险: 卡在Z, 试了A/B, 想找人讨论`,
      variable: '—',
      examples: [
        {
          code: `# 第一句给结论, 别先讲一堆背景`,
          output: `# 带尝试过的方案去求助, 不是空手问"怎么办"`,
          note: '暴露问题不丢人, 藏到上线才丢人。',
        },
      ],
      rookie: '先说背景最后才说结论 → 听的人早烦了。第一句就结论。',
      realWorld: '周报、向上汇报都按这个公式。',
    },
  ],
};
