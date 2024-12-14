# 核心概念

教程 ：Nodejs 全栈开发之 nodejs 高级编程 https://www.bilibili.com/video/BV1sA41137qw

✅**Nodejs 最常应用的两个模块：文件系统和网络模块**✅

::: details 评论-讲的真心可以
讲的真心可以，我是 70 集一集不差的看过来，每一行代码敲过来的，每一个图示用 processon 画出来，然后笔记是用 markdown 记下来的。花了 4 天时间，速度 1.5 倍速看，也是不够专注，零零散散的时间看，这个视频看似干瘪的枯燥的敲代码，上来一通说，但是这个视频是针对特定需求，专门拔高的人看，从源码的解读到模拟实现，每一集还对 node 致以尊敬，很多编程的思想也在视频中得以体现，感觉 70 集也只能说了 node 的三分之一还要少一点，但是总体的思想基本说清楚了，从 nodejs 学习计算机系统原理，又很系统的讲述了 node，相辅相成，看这视频的确需要一点门槛，很多人都是拿来主义，所以播放量少，但是绝对是好视频，后面的网络模块感觉还未说完，里面的内容真的可以在来 70 集，所以很棒～后续的 deno 开放更多的接口，如果很多借口延用 node，这个视频是可以通用的，点赞，收藏！up 主牛逼～

--
P43 大家注意一下，老师这里是按照 10 版本讲的，但是在 11 版本后，Node.js 的微任务执行时机已经和浏览器保持一致了，即 每一个宏任务执行前，都要优先清空微任务。
老师这里的 10 版本，是在宏任务队列切换前，才会去清空微任务

--
讲的挺好的，看了几本书，基本上讲的内容排布跟朴老师的深入浅出有点像，估计在补充一点，基础 node 这一块估计就讲完了。

--
讲的不错。学习《深入浅出 nodejs》,在异步 IO 这一块课本讲得太深抓不住重点，看了这个视频豁然开朗。看完视频，再看一遍书效果很好。
:::

::: details 核心
重要思想：事件驱动
:::

## Nodejs 架构

- 异步 io 事件驱动
- nodejs 底层 libuv 库，
- nodejs 单线程，指的是主线程是单线程的；而在 libv 库 存在 多个线程，然后配合事件循环，来处理不同的事件回调函数。

架构图：

- Builtin modules 胶水层，用于找到 c/c++底层封装的方法。
- V8： 执行 js 代码，提供桥梁接口。创建了执行上下文环境和作用域等。
- Livuv：事件循环、事件队列、异步 IO。
- 第三方模块：zlib、http、c-ares 等

**nodejs 核心三层：**

- 最底层：Natives modules 核心模块
- 中间层：Node c/c++ Bindings
- 上面层：V8、libuv、c-ares、http、zlib....

## Nodejs 是什么

### bs 架构

![1](/assets/images/nodejs1.png)

### IO 密集型--Nodejs 异步 IO、事件驱动、单线程

- IO 是计算机操作过程中最缓慢的环节。数据读写操作比较慢。
- 如果串行请求中包含长时间等待的 IO 行为，那后续任务就会等待。
- 那其它高级语言解决，是通过高并发，采用多线程多进程方式。

- Reactor 模式，单线程完成多线程工作，也被叫做应答者模式，就是原来是客人来餐馆，直接服务员配合点餐，然后后面再来的客户等待；现在是服务只服务下单，客户来了看菜单点餐，选好后呼叫服务员下单。
- 避免多个线程之间，上下文切换时，考虑的状态保存，时间消耗，以及状态锁等问题。
- nodejs 正式结合了 Reactor 模式，再结合 js 本身单线程事件驱动架构和异步编程特性，让单线程避免阻塞，从而- 使用异步非阻塞 IO 来更好的使用 CPU 资源。并且实现高并发请求处理。

如果是 CPU 密集型的，Nodejs 并不适合，Nodejs 更适合 IO 密集型高并发请求。

## Nodejs 异步 IO

![2](/assets/images/nodejs2.png)

通过 libuv 库实现，libuv 底层对不同平台进行封装支持，有了跨平台特性。

IO 分为：

- Network I/O （TCP、UDP、TTY、PIPE…）这块 libuv 对不同系统跨平台封装。
- File I/O
- DNS OPS
- User Code
- 就是所有与操作系统交互的行为，都是 I/O。

### IO 理解

- 在计算机中，输入/输出（即 IO）。计算机接收指令，执行计算，输出结果。
- IO 密集指，频繁接收指令。
- CPU 密集，指一个指令，需要占用大量的 CPU 运算。

### Nodejs 异步 IO 实现过程-事件循环

![3](/assets/images/nodejs3.png)

Nodejs 代码执行周期角度进行介绍异步 IO 实现

**✅ 运行 Nodejs 脚本，有异步操作，可以是网络 IO（依赖底层的 libuv 接口）、文件 IO（Nodejs 自己实现线程池），不管是哪种处理方式，都会有返回结果，然后入队 Event Queue 事件（任务）队列。等待事件循环执行回调。这就是 Nodejs 实现异步 IO 操作简单过程。事件循环 event loop 是在 nodejs 主线程完成的**

异步 IO 总结：

- IO 是应用程序的瓶颈所在
- 异步 IO 提高性能，不采用原地等待结果返回
- IO 操作属于操作系统级别，平台都有对应实现
- Nodejs 单线程配合事件驱动架构及 libuv 实现了非阻塞异步 IO

## Nodejs 事件驱动架构

非 IO 的异步操作，如 settimeout

**✅ 异步 IO、eventloop、事件循环**

- 当 libuv 接收到一个异步操作请求后，首先多路分解器进行工作，找到当前平台环境下，可用 IO 处理接口，然后等待 IO 操作结束后，将相应的事件添加到事件队列，最后按一定的顺序在事件队列中取出相应的事件，再交给主线程来进行执行。

**事件驱动：**

- 解决了 Nodejs 中由异步非阻塞操作，所带来数据最终获取的问题。
- 具体是 Nodejs 内置了 events 模块。
- 类似订阅发布模式

**EventEmitter**

```js
const EventEmitter = require("events");
// note: EventEmitter 是一个类，可被继承、实例化。
class CusTomEvent extends EventEmitter {}
```

## Nodejs 单线程（重要可重复看）

- Nodejs 使用 JS 实现高效可伸缩的高性能 Web 服务
- 其它常见 web 服务都是用多线程或多进程实现的。
- 那单线程如何实现高并发呢？

**单线程如何实现高并发呢？**

- Nodejs 底层通过 异步非阻塞 IO 、事件循环、 事件驱动架构图、配合事件回调通知，来实现非阻塞调用，以及做到并发。
- 具体表现是，代码中如果存在多个请求，是无需等待的。等待 libuv 库完成工作，按照顺序执行相应的回调。
- 这样单线程就完成了，多线程的工作。
- **这里单线程指的是主线程是单线程的，而不是说 Nodejs 只有主线程。js 代码是通过 v8 来执行的，v8 中只有一个主线程来执行 js 代码。这也是平日说的单线程。但在 libuv 库中存在一个线程池的。✅**

**libuv 库中的线程**

- 默认是 4 个线程（Network IO 1 个 + Thread Pool 里的 3 个）
- 异步可分为三种：网络 IO、非网络 IO、非 IO
- 针对网络 IO 操作，libuv 库会调用当前平台对应的 IO 接口进行处理
- 另外 2 中 IO 异步操作，就会使用线程池中的线程进行处理
- 如果 4 个线程不够用，可以修改默认配置，来增加默认的线程数量，但这个一般是用不到的。
  ![2](/assets/images/nodejs2.png)

优点：使用单线程做到了，多线程能够做到的事情。这样减少了线程间切换的 CPU 开销和内存同步开销等这样的问题。也提高了安全。

缺点：在处理 CPU 密集型任务，就会过多占用 CPU，这样后面的逻辑就必须等待了。而且单线程也无法体现出多核 cpu 的优势。当然这些问题，在 Nodejs 后续版本中都给出了解决方案。

### 单线程遇到 CPU 密集型，也就是遇到计算型耗时操作时，对后续代码影响

Nodejs 虽然是单线程的机制，但使用它配合异步 IO 和事件循环，就可以实现高并发的请求。

1. Nodejs 单线程指的是运行 js 代码的主线程是单线程的，也就是 v8 引擎专门来执行 js 代码的那部分是单线程的。
2. 但在 libuv 库里有存放多个线程的线程池的。
3. Nodejs 单线程也决定了它不适合处理 CPU 密集型的任务的。（sleepTime 长时间占用 CPU）

```js
const http = require("http");

// 增加延迟，让代码休眠，来模拟密集型计算，通过死循环模拟阻塞
function sleepTime(time) {
  const sleep = Date.now() + time * 1000; // 延迟 time 秒
  while (Date.now() < sleep) {} // 循环模拟时间消耗
  return;
}

// 时间消耗4s
sleepTime(4);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello World!",
    })
  );
});

server.listen(8080, () => {
  console.log("服务启动了");
});
```

## Nodejs 应用场景

1. IO 密集型高并发请求（因为非阻塞异步 IO 操作）

2. Nodejs 作为中间层

![4](/assets/images/nodejs4.png)

3. 操作数据库提供 API 服务

4. 实时聊天应用程序

5. 前端工程化

6. Nodejs 更适合 IO 密集型任务，不适合 CPU 密集型场景。

## Nodejs 实现 API 服务

note 和示例在 node-project 里： examples/web/a

## Nodejs 全局对象

- 与浏览器平台的 window 不完全相同
- Nodejs 全局对象上挂载许多属性
- 全局对象是 JavaScript 中的特殊对象，可以再 Nodejs 环境全局访问的，无需定义。
- Nodejs 中全局对象是 global
- Global 的根本作用就是作为全局变量的宿主
- Nodejs 全局变量：import export `__dirname` 等属性和方法。
- 全局对象可以看做是全局变量的宿主

常见全局变量：

- `__filename`: 返回正在执行脚本的绝对路径
- `__dirname`: 返回正在执行脚本所在目录
- timer 类函数：执行顺序与时间循环间的关系
- process：提供与当前进程互动的接口
- require：实现模块的加载
- module、exports：处理模块的导出

**✅global globalThis this 区别：**

函数里 this 指向，是在函数运行时确定的。当单独执行时，指向全局变量。

- 3 和 4 函数里全局变量就是函数所在作用域的全局变量 global。
- 2 模块的 this 没有被指向 global

```js
console.log(global);
// 1 true
// 2 false
// 3 true
// 4 true
console.log(1, globalThis === global); // true
console.log(2, this === global); // false
(function () {
  console.log(3, this === global); // true
})();
function test() {
  console.log(4, this === global); // true
}
test();
```

**✅ 模块与全局变量**

- 在 Nodejs 环境，每个 j 文件都是独立的模块
- 可以认为，每个 js 文件被执行的时候，最外层都包裹在了 ()() 自调用的函数里
- 在调用或执行文件时，会往自执行函数里传几个固定参数，比如：require、export、`__dirname`等。
- 这也是为什么，在文件里能直接使用这几个全局变量的原因。
- 这也是 Nodejs 模块加载机制的流程。

## 全局变量 process

process 是全局变量，无须 require 可直接使用

功能分为两部分说明：获取进程信息、执行进程操作（内置事件、子进程、进程通信）。

**1. 资源：cpu 内存**

```js
// 内存
const fs = require("fs"); // 相当于导入进来fs模块，那已使用内存heapUsed会增加
Buffer.alloc(1000); // arrayBuffers 缓冲区大小。用来存放？
console.log(process.memoryUsage());
// {
//   rss: 32456704, // 常驻内存，硬件设备的内存
//   heapTotal: 4128768, // 当前脚本任务申请的总内存
//   heapUsed: 2728024, // 当前脚本任务实际使用的内存
//   external: 1079432, // Nodejs环境中，表示底层c或c++核心模块占据的内存大小，默认生效或已被加载的
//   arrayBuffers: 10507 // 独立空间大小，不占用v8所占用的内存。
// }

// cpu
console.log(process.cpuUsage());
// {
//   user: 23847, // 用户占用
//   system: 4592 // 系统占用
// }
```

**2. 运行环境：运行目录、node 环境、cpu 架构、用户华宁、系统平台**

```js
// 当前工作目录 current work dir 缩写
console.log(process.cwd());
// /Users/xx/xxx/nodejs-projects/examples

// 当前Nodejs版本
console.log(process.version);
// v21.5.0

// 当前更多环境版本信息：v8、libuv等
console.log(process.versions);
// {
//   node: '21.5.0',
//   acorn: '8.11.2',
//   ada: '2.7.4',
//   ares: '1.20.1',
//   base64: '0.5.1',
//   brotli: '1.0.9',
//   cjs_module_lexer: '1.2.2',
//   cldr: '44.0',
//   icu: '74.1',
//   llhttp: '9.1.3',
//   modules: '120',
//   napi: '9',
//   nghttp2: '1.58.0',
//   nghttp3: '0.7.0',
//   ngtcp2: '0.8.1',
//   openssl: '3.0.12+quic',
//   simdjson: '3.6.2',
//   simdutf: '4.0.4',
//   tz: '2023c',
//   undici: '5.28.2',
//   unicode: '15.1',
//   uv: '1.47.0',
//   uvwasi: '0.0.19',
//   v8: '11.8.172.17-node.18',
//   zlib: '1.3-22124f5'
// }

// 当前cpu架构
console.log(process.arch);
// arm64

// 当前环境变量
console.log(process.env.NODE_ENV);

// 当前系统环境变量
// console.log(process.env.PATH);

// 当前管理员目录
console.log(process.env.USERPROFILE);

// 当前系统平台
console.log(process.platform);
// darwin
```

**3. 运行状态：启动参数、进程 PID、运行时间**

```js
// 命令行参数
console.log(process.argv);
// 命令： npx node ./process/a.js 1 2
// 返回：数组
// [
//   '/usr/local/bin/node', // 参数index[0]，node命令完整路径
//   '/Users/xxxx/learn/nodejs-projects/examples/process/a.js', // 参数index[1]，当前执行脚本的文件
//   '1', // 参数index[2]
//   '2' // 参数index[3]
// ]

// 快速拿到第一个值
console.log(process.argv0);
// 命令：npx node ./process/a.js 1 2
// 打印：node

// 拿到 --harmony 参数
console.log(process.execArgv);
// 命令：npx node --harmony ./process/a.js 1 2
// 打印：[ '--harmony' ]

// PID当前系统重占据的唯一id，内存上唯一的id，如果是个长时间脚本，在任务管理器可以看到。
console.log(process.pid);
// 命令：npx node ./process/a.js
// 打印：5588

// 运行时间，脚本开始时间到结束时间，统计运行时长
console.log(process.uptime());

// 脚本执行完后，进程会被自动回收，内存会被释放。
```

**4. 事件监听：**

```js
// 退出事件，脚本文件执行完后触发
process.on("exit", (code) => {
  // 只支持同步，不能异步
  console.log("exit ", code);
});
// 退出前事件
process.on("beforeExit", (code) => {
  // 即可同步，也可异步
  console.log("beforeExit ", code);
});
console.log("执行完了");
// 打印：
// 执行完了
// beforeExit  0
// exit  0

// 手动退出脚本执行
process.exit();
// 打印：没有打印 beforeExit
// 执行完了
// exit  0
```

**5. 标准：输出 输入 错误（流和管道操作）**

标准输出 stdout， 在终端面板输出，它也继承了流操作，可写 write 操作 ✅

```js
// 示例1：
console.log = function (data) {
  // 写入流
  process.stdout.write("---" + data + "\n");
};

console.log(11);
console.log(22);
// ---11
// ---22

// 示例2：
const fs = require("fs");
const path = require("path");

// 创建一个可读流
fs.createReadStream(path.join(__dirname + "/test.txt"))
  // 管道，流向下一个环节，下一个环节是 stdout 标准输出，✅标准输出在终端面板上，即写到终端面板上，也是继承了流。
  .pipe(process.stdout);

// 打印：hello nodejs%
```

标准输出 stdin，✅ 在终端面板输入

```js
// 示例1：
process.stdin.pipe(process.stdout);
// 控制台：
// 输入：123
// 打印：123

// 示例2：
// 设置输入内容编码，避免乱码
process.stdin.setEncoding("utf-8");
// 输入事件监听（事件驱动）
process.stdin.on("readable", () => {
  // 从标准输入读取数据，把标准输入里拿到数据，在放到标准输出里显示
  let chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write("data " + chunk);
  }
});

// 控制台：
// 输入：hello stdin
// 回车：
// 打印：data hello stdin
```

## 内置模块 path

用于处理文件/目录的路径

```js
// 下面示例测试文件位置：/Users/xx/xx/nodejs-projects/examples/path/index.js

/**
 * 1 basename() 获取路径中的基础名称
 * 返回path路径最后一部分
 */
console.log(__filename);
console.log(path.basename(__filename)); // 返回文件名加后缀
console.log(path.basename(__filename, ".js")); // 能匹配后缀，则返回文件名并省略后缀
console.log(path.basename(__filename, ".css")); // 没能匹配后缀，则返回默认的，和不传一样
console.log(path.basename("/a/b/c")); // 返回path路径最后一部分，可以是文件或是目录
console.log(path.basename("/a/b/c/")); // 如果最后一位是目录分隔符，自动忽略
// 打印:
// /Users/xx/xx/nodejs-projects/examples/path/index.js
// index.js
// index
// index.js
// c
// c

/**
 * 2 dirname() 获取路径名称
 * 返回path路径最后一部分的上层目录所在路径
 */
console.log(path.dirname(__filename));
console.log(path.dirname("/a/b/c"));
console.log(path.dirname("/a/b/c/")); // 如果最后一位是目录分隔符，自动忽略
// /Users/xx/xx/nodejs-projects/examples/path
// /a/b
// /a/b

/**
 * 3 extname() 获取路径中扩展名称
 * 返回path路径相应文件的后缀名
 */
console.log(path.extname(__filename));
console.log(path.extname("/a/b")); // 没有扩展名，则返回空
console.log(path.extname("/a/b/c.html.js.css")); // 只匹配最后一个点扩展名
console.log(path.extname("/a/b/c.html.js.")); // 只匹配到了最后一个点
// .js
//
// .css
// .

/**
 * 4 parse() 解析路径
 * 接受字符串路径，返回路径解析对象，包含：root dir base ext name
 */
console.log(path.parse("/a/b/c/index.html"));
// {
//   root: '/',
//   dir: '/a/b/c', // 最后部分的上一部分
//   base: 'index.html', // 路径最后一个部分内容
//   ext: '.html', // 扩展后缀
//   name: 'index' // 名称不带后缀
// }
console.log(path.parse("/a/b/c"));
console.log(path.parse("/a/b/c/")); // 最后加/的和不加的返回的一样
// {
//   root: '/',
//   dir: '/a/b',  // 最后部分的上一部分
//   base: 'c',  // 路径最后一个部分内容
//   ext: '',
//   name: 'c'
// }
console.log(path.parse("./a/b/c")); // 相对路径
// {
//   root: '',
//   dir: './a/b',  // 最后部分的上一部分
//   base: 'c',  // 路径最后一个部分内容
//   ext: '',
//   name: 'c'
// }

/**
 * 5 format() 序列化路径
 */
const obj = path.parse("/a/b/c/index.html");
console.log(path.format(obj));
// 打印：/a/b/c/index.html

/**
 * 6 isAbsolute() 判断路径是否为绝对路径
 */
console.log(path.isAbsolute("foo"));
console.log(path.isAbsolute("/foo"));
console.log(path.isAbsolute("///foo")); // 多个/会自动化处理
console.log(path.isAbsolute(""));
console.log(path.isAbsolute("."));
console.log(path.isAbsolute("../bar"));
// 打印：
// false
// true
// true
// false
// false
// false

/**
 * 7 join() 拼接多个路径片段
 * 把路径片段从后往前进行拼接
 */
console.log(path.join("a/b", "c", "index.html"));
console.log(path.join("/a/b", "c", "index.html"));
console.log(path.join("/a/b", "c", "../", "index.html")); // 从后往前
console.log(path.join("/a/b", "c", "./", "index.html"));
console.log(path.join("/a/b", "c", "", "index.html")); // 自动忽略空字符串路径片段
console.log(path.join("")); // 路径片段长度为0，返回. 代表当前目录
console.log(path.join("a", "b", "/c", "//d"));
// 打印：
// a/b/c/index.html
// /a/b/c/index.html
// /a/b/index.html
// /a/b/c/index.html
// /a/b/c/index.html
// .
// a/b/c/d

/**
 * 8 normalize() 规范化路径
 * 和window有差异
 */
console.log(path.normalize("a/b/c/d"));
console.log(path.normalize("a///b/c../d")); // 点点不会被格式化掉
console.log(path.normalize("a//\\b/c/d"));
console.log(path.normalize("a//\b/c/d")); // \b 当做转义字符，会被格式化掉
console.log(path.normalize("")); // 返回.
// 打印：
// a/b/c/d
// a/b/c../d
// a/\b/c/d
// a/c/d
// .

/**
 * 9 resolve() 绝对路径
 * 就是为了得到绝对路径
 * 我的理解：从后往前进行拼接，如果遇到路径分隔符，则拼接结束；如果都没遇到则拼接(当前工作目录绝对路径)
 * 支持../ 往上退一层
 */
console.log(path.resolve()); // 返回当前工作目录的决定路径
console.log(path.resolve("a", "b")); //
console.log(path.resolve("a", "/b")); // 有路径分隔符
console.log(path.resolve("/a", "b")); // 有路径分隔符
console.log(path.resolve("/a", "/b")); // 有路径分隔符
console.log(path.resolve("index.html"));
// 打印：
// /Users/xx/learn/nodejs-projects/examples/a/b/c
// /Users/xx/learn/nodejs-projects/examples/a/b/c/d/e
// /Users/xx/learn/nodejs-projects/examples
// /Users/xx/learn/nodejs-projects/examples/a/b
// /b
// /a/b
// /b
// /Users/xx/learn/nodejs-projects/examples/index.html
```

## 全局变量 Buffer

- 一般称为 Buffer 缓冲区
- Buffer 让 JavaScript 可以操作 二进制
- 二进制数据、流操作、Buffer

Nodejs 平台下 JavaScript 可实现 IO 操作，IO 行为操作的就是二进制数据。

- Stream 流操作并非 Nodejs 独创，可以当做一种数据类型，也是可以存储数据，但它可以分段。当进行大数据传输时就可以使用流操作，可以避免短时间内占用内存过大的情况。
- 流操作配合管道实现数据分段传输。

程序运行就会传输数据传输，数据的端到端传输会有生产者和消费者。中间使用流加管道进行链接。
也会有一些问题，当数据生产速度，无法满足数据消费速度；或者数据消费速度比生产速度慢许多。就会产生数据等待的过程。
产生等待时数据存放在哪？那等待过程，多出来的数据，或者不够一次消费的数据，它们被存放到哪里呢。这时候就该 Buffer 了。✅

Nodejs 中 Buffer 是一片内存空间

- 一般 Nodejs 代码是由 v8 引起执行完成的，按道理所有内存消耗都是 v8 引擎的堆内存。而 Buffer 是 V8 之外的一片内存空间。它的大小不占据 V8 堆内存大小的。
- Buffer 空间申请不是由 Nodejs 来完成的，但使用层面空间分配，由编写的 js 代码控制的，因此在空间回收的时候，还由 v8 的 GC 管理和回收。

Buffer 总结：

- 无须 require 的一个全局变量
- 实现 Nodejs 平台下的二进制数据操作。
- 不占用 V8 堆内存大小的内存空间，直接 c++层面进行分配
- 内存的使用由 Nodejs 来进行控制，由 V8 的 GC 回收。
- 一般配合 Stream 流使用，充当数据缓冲区。✅（文件读写流操作等会用到 Buffer）

![5](/assets/images/nodejs5.png)

### 创建 Buffer

Buffer 是 Nodejs 内置类

如何创建 Buffer 实例

- alloc: 创建指定字节大小的 buffer
- allocUnsafe: 创建指定字节大小的 buffer （不安全）
- from：接受数据，创建 buffer；创建已有大小的内存空间，大小是由数据决；
- 不建议 new 直接创建实例，给到的权限太大了

```js
const buf1 = Buffer.alloc(10);
console.log(buf1);
// 面板打印内存占用，00都会换算成16进制。
// <Buffer 00 00 00 00 00 00 00 00 00 00>

const buf2 = Buffer.allocUnsafe(10);
// 内存空间里面不能保证实时回收，比如一些垃圾区域没有在使用了，由于空间数据存在，里面数据还是在的，但的确也没有对象再指向它做引用。
// 有可能在一瞬间把这样的空间拿回来了，完了就去创建了一个新的空间给Buffer。
console.log(buf2);
// 打印：
// <Buffer 08 00 00 00 01 00 00 00 00 00>

const buf3 = Buffer.alloc(10, 1);
console.log(buf3);
// 打印：
// <Buffer 01 01 01 01 01 01 01 01 01 01>

// 第1个参数：字符串、数组、Buffer
// 第2个参数编码类型：默认utf-8、base64等
const buf4 = Buffer.from("hello");
console.log(buf4);
// <Buffer 68 65 6c 6c 6f>

// base64
const buf6 = Buffer.from("hello", "base64");
console.log(buf6);
// <Buffer 85 e9 65> // 字节和上面默认的不一样

const buf5 = Buffer.from([1, 2, 3]);
console.log(buf5);
// <Buffer 01 02 03>

const buf6 = Buffer.from("好");
console.log(buf6);
console.log(buf6.toString());
// <Buffer e5 a5 bd>
// 好

// 使用16进制，前面加0x
// 通过16进制把汉字存进去，当然直接存字符串'好'是最便捷的，这里只做167进制存放到Buffer演示
// 通常元素值，用十进制数值或字符串就行，这里这做演示。
const buf7 = Buffer.from([0xe5, 0xa5, 0xbd]);
console.log(buf7);
console.log(buf7.toString());
// <Buffer e5 a5 bd>
// 好

// from 方法第1个参数是 Buffer
const buf8 = Buffer.alloc(3); // 3个字节的空间
const buf81 = Buffer.from(buf8);
console.log(buf8);
console.log(buf81);
// 那内存空间是共享的，还是独立的?
buf8[0] = 1;
console.log(buf8);
console.log(buf81);
// 结论：并不是共享空间，而是拷贝出独立空间✅
```

### Buffer 实例方法

- fill: 使用数据填充 buffer，返回填充后的 buffer
- write：向 buffer 中写入数据
- toString: 从 buffer 中提取数据，按指定编码格式展示数据
- slice：截取指定长度的 buffer 数据
- indexOf：在 buffer 中查找 buffer 数据是否存在，返回布尔值
- copy：对 buffer 中数据进行拷贝

```js
/**
 * fill()
 * 如果填入长度小于定义长度（如下面6），则会反复填直到填满
 * 如果填入长度大于定义长度（如下面6），则会至多写满（6个字节）
 * 第2个参数是指，从buffer下标哪个位置开始写入，包括该下标
 * 第3个参数是指，从buffer下标哪个位置结束写入，不包括该下标
 */
let buf1 = Buffer.alloc(6); // 长度是6个字节
// buf1.fill("123");
// buf1.fill("1234567");
// buf1.fill("123", 1);
// buf1.fill("123", 1, 3);
buf1.fill(123);
console.log(buf1);
console.log(buf1.toString());
// *fill("123")小于定义长度
// <Buffer 31 32 33 31 32 33>
// 123123

// *fill("1234567")大于定义长度
// <Buffer 31 32 33 34 35 36>
// 123456

// *fill("123", 1)从下标1位置开始写入
// <Buffer 00 31 32 33 31 32>
// 12312

// *fill("123", 1, 3)从下标1位置开始写入，到下标3为止结束
// <Buffer 00 31 32 00 00 00>
// 12

// *fill(123) 传入数值，16进制是7b，转成字符串 {
// <Buffer 7b 7b 7b 7b 7b 7b>
// {{{{{{
```

```js
/**
 * write()
 * 如果填入长度小于定义长度（如下面6），有多少就写多少
 * 第2个参数是指，从buffer下标哪个位置开始写入，包括该下标
 * 第3个参数是指，要写入的长度
 */
let buf = Buffer.alloc(6); // 长度是6个字节
// buf.write("123");
// buf.write("123", 1);
// buf.write("123", 1, 2);
buf.write("123", 1, 4);

console.log(buf);
console.log(buf.toString());
// *write("123") 小于定义长度
// <Buffer 31 32 33 00 00 00>
// 123

// *write("123", 1) 第2个参数
// <Buffer 00 31 32 33 00 00>
// 123

// *write("123", 1, 2) 写入长度2
// <Buffer 00 31 32 00 00 00>
// 12

// *write("123", 1, 4) 写入长度4
// <Buffer 00 31 32 33 00 00>
// 123
```

```js
/**
 * toString()
 * 指定字符编码格式，提取数据
 * 第1个参数是，编码格式，默认 utf-8
 * 第2个参数是，从buffer下标哪个位置开始截取
 * 第3个参数是，从buffer下标哪个位置开始截取，长度是从最开始位置算起
 */
const buf = Buffer.from("你好老铁"); // 一个中文占用3个字节
console.log(buf);
console.log(buf.toString());
console.log(buf.toString("utf-8", 3)); // 中文字符要3的倍数，否则会乱码
console.log(buf.toString("utf-8", 3, 9));
// <Buffer e4 bd a0 e5 a5 bd e8 80 81 e9 93 81>
// 你好老铁
// 好老铁
// 好老
```

```js
/**
 * slice()
 * 截取数据
 * 第1个参数是，从buffer下标哪个位置开始截取
 * 第2个参数是，从buffer下标哪个位置结束截取，不包含该下标位置
 * 可以为负数，代表从后确定截取位置
 */
const buf = Buffer.from("你好老铁"); // 一个中文占用3个字节
const b1 = buf.slice(3);
console.log(b1);
console.log(b1.toString());
const b2 = buf.slice(3, 6);
console.log(b2);
console.log(b2.toString());
const b3 = buf.slice(-3);
console.log(b3);
console.log(b3.toString());
// <Buffer e5 a5 bd e8 80 81 e9 93 81>
// 好老铁
// <Buffer e5 a5 bd>
// 好
// <Buffer e9 93 81>
// 铁
```

```js
/**
 * indexOf()
 * 查找目标buffer，返回查找到第1个下标的位置，没找到返回-1
 * 第2个参数是指，从buffer下标哪个位置开始查找
 * 英文是单字节
 * 一个中文占用3个字节
 */
const buf = Buffer.from("hello老铁, hello老七, hello老八");
console.log(buf);
console.log(buf.indexOf("老"));
console.log(buf.indexOf("老", 6));
console.log(buf.indexOf("老九"));
// 5
// 18
// -1
```

```js
/**
 * copy()
 * 从一个数据源，拷贝到目标buffer里
 * 拷贝源是，调用copy的buffer，buf2
 * 写入源是，copy的第1个参数，buf1
 * copy的第2个参数是指，从写入容器的哪个位置开始写入
 * copy的第3个参数是指，从拷贝数据源的哪个位置开始读取，包括该下标
 * copy的第4个参数是指，从拷贝数据源的哪个位置结束读取，不包括该下标
 */
const buf1 = Buffer.alloc(6);
const buf2 = Buffer.from("老铁");
// 将buf2的数据拷贝到buf1里
// buf2.copy(buf1); // 老铁
// buf2.copy(buf1, 3); // 老
// buf2.copy(buf1, 3, 3); // 铁
buf2.copy(buf1, 3, 3, 6); // 铁
console.log(buf2.toString());
console.log(buf1.toString());
```

### Buffer 静态方法

- concat 将多个 buffer 拼接成一个新的 buffer
- isBuffer 判断当前数据是否为 buffer
-

```js
/**
 * concat()
 * 第2个参数，指定长度
 */
const buf1 = Buffer.from("hello");
const buf2 = Buffer.from("老铁");
const buf3 = Buffer.concat([buf1, buf2]);
const buf4 = Buffer.concat([buf1, buf2], 8);
console.log(buf3);
console.log(buf3.toString());
console.log(buf4);
console.log(buf4.toString());
// <Buffer 68 65 6c 6c 6f e8 80 81 e9 93 81>
// hello老铁
// <Buffer 68 65 6c 6c 6f e8 80 81>
// hello老

/**
 * isBuffer()
 * 返回布尔值
 */
const buf = Buffer.from("hello");
console.log(Buffer.isBuffer(buf)); // true
console.log(Buffer.isBuffer("123")); // false

/**
 * byteLength()
 */
const len = Buffer.byteLength("hello老铁");
console.log(len); // 11 = 5 + 3 * 2
```

一个 buffer 创建后，所占据内存空间大小是固定的，无法进行修改，长度也就是固定的。

自定义 Buffer 之 split

## FS 模块

Buffer、Stream 与 FS 有什么关系？

- Buffer 和 Stream 操作的一般都是二进制数据。
- FS 是内置核心模块，提供文件系统操作的 API。文件和目录的创建、删除、查询、读取写入等。
- 如果要操作文件的二进制数据，就需要用到 FS 模块。而在这个过程中 Buffer 和 Stream 又是紧密联系的。

![6](/assets/images/nodejs6.png)

FS 模块结构：

- FS 基本操作
- FS 常用 API

前置知识：权限位、标识符、文件描述符

- 权限位：用户对于文件所具备的操作权限
  - r 读权限，由八进制 4 表示
  - w 写权限，由八进制 2 表示
  - x 执行权限，由八进制 1 表示
  - 不具备权限，由八进制 0 表示
  - 用户分类：文件所有者、文件所属组、其它用户，每个用户都有权限分配。
  - 777 代表所有权限
  - 查看目录权限：ls -al

```
drwxr-xr-x@  7 xxxxxx  staff  224  9 10 09:44 ..
-rw-r--r--   1 xxxxxx  staff  295  9 13 23:05 README.md
drwxr-xr-x@  3 xxxxxx  staff   96  9 20 09:21 buffer

类 unix 系统一切皆是文件

[d][文件所有者][文件所属组][其它用户] ✅
[d][rwx][rwx][rwx]

d 代表文件夹
后面 rwx 为一组
遇到rwx代表满级权限，遇到-代表不具备权限
```

- 标识符：Nodejs 中 flag 表示对文件操作方式（**表示以什么方式打开文件** ✅）

  - r: 表示可读
  - w: 表示可写
  - s: 表示同步
  - +: 加上操作，一般是读写操作
  - x:
  - a: 表示追加操作
  - 可组合使用
  - r+ 打开文件用于读写。
  - w+ 打开文件用于读写，将流定位到文件的开头。如果文件不存在则创建文件。
  - a 打开文件用于写入，将流定位到文件的末尾。如果文件不存在则创建文件。
  - a+ 打开文件用于读写，将流定位到文件的末尾。如果文件不存在则创建文件。

- 文件描述符：fd 就是操作系统分配给被打开文件的标识
  - fd 系统里文件唯一标识

### 文件读写拷贝

- readFile: 从指定文件中读取数据
- writeFile: 向指定文件中写入数据
- appendFile: 追加方式向指定文件中写入数据
- copyFile: 将某个文件中数据拷贝至另一文件
- watchFile: 对指定文件进行监控

```js
const fs = require("fs");
const path = require("path");

// Nodejs里回调函数参数，遵循错误优先，如果涉及错误第一个参数通常是err ✅
// 一次性操作，都是全部拿出来到内存里操作，不适合大内存文件操作 ✅

// readFile
fs.readFile(path.resolve("fs/a/data.txt"), "utf-8", (err, data) => {
  console.error(err);
  if (!err) {
    console.log(data);
  }
  // null
  // hello 老铁
});

// writeFile
// 默认是覆盖写操作
// 如果第1个参数路径不存在，就执行创建文件并写入操作
fs.writeFile(path.resolve("fs/a/data.txt"), "hello nodejs1", (err, data) => {
  console.error(err);
  if (!err) {
    fs.readFile(path.resolve("fs/a/data.txt"), "utf-8", (err, data) => {
      console.log(data);
    });
  }
  // null
  // hello nodejs1
});
// writeFile
// 第3个参数，可配置写入方式
fs.writeFile(
  path.resolve("fs/a/data.txt"),
  "123",
  {
    mode: 438, // 权限类，十进制操作权限：可读可写不可执行
    flag: "r+", // 操作方式，默认w+ 清空并写入，当前设置为r+ 直接写入 ✅
    encoding: "utf-8",
  },
  (err, data) => {
    console.error(err);
    if (!err) {
      fs.readFile(path.resolve("fs/a/data.txt"), "utf-8", (err, data) => {
        console.log(data);
      });
    }
    // null
    // 123lo nodejs1
  }
);

// appendFile
// 第3个参数，可配置写入方式
fs.appendFile(
  path.resolve("fs/a/data.txt"),
  "hello appendFile",
  (err, data) => {
    console.error("写入成功");
  }
);

// copyFile
// 第3个参数，可配置写入方式
fs.copyFile(
  path.resolve("fs/a/data.txt"),
  path.resolve("fs/a/abc.txt"),
  (err, data) => {
    console.error("拷贝成功");
  }
);

// watchFile
// 测试：直接在data.txt修改并保存
fs.watchFile(
  path.resolve("fs/a/data.txt"),
  {
    interval: 20, // 每20毫秒监控下文件是否发生变化
  },
  (curr, prev) => {
    // curr和prev都是Stats类包含很多文件信息
    // mtime 修改时间 modify
    console.log(curr);
    if (curr.mtime !== prev.mtime) {
      console.log("文件已修改");
      // 取消监控文件
      fs.unwatchFile(path.resolve("fs/a/data.txt"));
    }
  }
);
```

### 文件打开与关闭

readFile 和 writeFile 是将文件一次性读取写入到内存中，对于大体积文件，会占用内存较高，不合理。

open 和 close 是边读边写，边写边读的操作方式。文件的打开、读取、写入、关闭看做是各自独立的环节。

```js
const fs = require("fs");
const path = require("path");

// open
fs.open(path.resolve("data.txt"), "r", (err, fd) => {
  // 'r' 文件操作标识符
  console.log(fd); // 14 文件唯一标识
});

// close
fs.open(path.resolve("data.txt"), "r", (err, fd) => {
  console.log(fd);
  fs.close(fd, (err) => {
    console.log("close 成功");
  });
});
```

### 大文件读写操作

![7](/assets/images/nodejs7.png)

上图说明，假设数据传输场景是磁盘读写：

- A 文件数据要想拷贝到 B 文件当中，默认情况需要内存做中转，如果是一次性操作，就会存在内存占满并溢出的潜在问题。
- 因此更推荐的是，用中间暂存区，一点一点的读取，然后再一点一点写入，而这个中间暂存区就是 Buffer。
- 两点信息：单独处理文件打开、读取、写入、关闭更有益；单独处理读取和写入操作时一般都伴随 Buffer 使用。

```js
/**
 * fs.read() 读操作就是将数据从磁盘文件中读取出来，写入到Buffer中，读就是写的意思。
 * fd 定位当前被打开的文件
 * buf 用于表示当前缓冲区
 * offset 表示当前从 buf 的哪个位置开始执行写入
 * length 表示当前次写入的长度
 * position 表示当前从文件的哪个位置开始读取
 * 正常缓冲区大小，能放的下要读取的内容的，否则会有语法报错。
 */
const buf = Buffer.alloc(10); // 暂存区
// data.txt 内容：1234567890
fs.open("data.txt", "r", (err, rfd) => {
  console.log(rfd);
  // 第1个参数fd，rfd
  // 第2个参数buf，buf
  // 第3个参数offset，从buf哪个字节位置开始写
  // 第4个参数length，要写的长度
  // 第5个参数position，从rdf文件哪个字节位置开始读取
  fs.read(rfd, buf, 1, 3, 2, (err, readBytes, data) => {
    console.log(readBytes); // 当前读取多少字节
    console.log(data); // 最终 buf 里的数据 data
    console.log(data.toString()); // 默认 utf-8
    fs.close(wfd); // 关闭当前文件操作符，减少内存占用，否则每open一次就是fd+1
  });
});

// 14
// 3
// <Buffer 00 33 34 35 00 00 00 00 00 00>
// 345
```

```js
const fs = require("fs");

/**
 * fs.write() 写操作，将缓冲区里的内容写入到磁盘文件中。先从缓冲区读出来，然后再写的操作。
 */
const buf = Buffer.from("1234567890"); // 暂存区里的数值内容，方便测试字节
// w 写
fs.open("bbb.txt", "w", (err, wfd) => {
  console.log(wfd);
  // 第1个参数fd，wfd bbb.txt
  // 第2个参数buf，buf 存放数据缓冲区
  // 第3个参数offset，从buf哪个字节位置开始读
  // 第4个参数length，要写的字节长度
  // 第5个参数position，从bbb.txt文件哪个字节位置开始写入，一般是0，不加则是末尾位置
  fs.write(wfd, buf, 1, 4, 0, (err, written, buffer) => {
    console.log("written: ", written); // 当前写入字节数
    fs.close(wfd); // 关闭当前文件操作符，减少内存占用，否则每open一次就是fd+1
  });
});

// written: 4
// bbb.txt 内容：2345
```

有了这俩读写操作，就可以进行大文件边读边写操作了。

### 文件拷贝自定义实现

copyFile 的实现是基于 readFile 和 writeFile 读写操作，不适合操作大体积文件。

```js
/**
 * 自定义拷贝方法
 * 01 打开a文件，利用 read 将数据保存到 buffer 暂存起来
 * 02 打开b文件，利用 write 将buffer 中的数据写入到b文件中
 */
let buf = Buffer.alloc(10); // 10字节长度，每次读取字节的数量，大文件会进行多次读写，利用buffer作为缓冲，减少内存占用
// 01 打开指定的a文件
fs.open("a.txt", "r", (err, rfd) => {
  // 02 从打开的a文件中读取数据
  fs.read(rfd, buf, 0, 10, 0, (err, readBytes) => {
    // 03 打开b文件，用于执行数据写入操作
    fs.open("b.txt", "w", (err, wfd) => {
      // 04 将buffer 中的数据写入到 b.txt当中
      fs.write(wfd, buf, 0, 10, 0, (err, written) => {
        console.log("写入成功");
      });
    });
  });
});

/**
 * 自定义拷贝方法（优化open）
 */
let buf = Buffer.alloc(10);
// 01 打开指定的a文件
fs.open("a.txt", "r", (err, rfd) => {
  // 03 打开b文件，用于执行数据写入操作
  fs.open("b.txt", "w", (err, wfd) => {
    // 02 从打开的a文件中读取数据
    fs.read(rfd, buf, 0, 10, 0, (err, readBytes) => {
      // 04 将buffer 中的数据写入到 b.txt当中
      fs.write(wfd, buf, 0, 10, 0, (err, written) => {
        console.log("写入成功");
      });
    });
  });
});

/**
 * 自定义拷贝方法（数据完全拷贝）✅
 * 通过递归方式读写
 * 边度编写，利用buffer作为缓冲区，减少内存消耗
 * 针对这种常用，更好的方法是流操作，在后面
 */
let buf = Buffer.alloc(10);
const BUFFER_SIZE = buf.length; // 缓冲区长度
let readOffset = 0; // 每次读取时偏移量
fs.open("a.txt", "r", (err, rfd) => {
  fs.open("b.txt", "a+", (err, wfd) => {
    function next() {
      fs.read(rfd, buf, 0, BUFFER_SIZE, readOffset, (err, readBytes) => {
        if (!readBytes) {
          // 如果条件成立，说明内容已经读取完毕
          fs.close(rfd, () => {});
          fs.close(wfd, () => {});
          console.log("拷贝完成");
          return;
        }
        // readOffset 每次加上实际读取到的字节长度
        readOffset += readBytes;
        // write 第4个参数，前面读几个这里就写几个
        // write 第5个参数，开始写入的位置，不加则是末尾位置写
        fs.write(wfd, buf, 0, readBytes, (err, written) => {
          console.log("写入字节长度：", readBytes);
          next();
        });
      });
    }
    // 初始执行
    next();
  });
});
// 测试：
// 写入字节长度： 10
// 写入字节长度： 10
// 写入字节长度： 6
// 拷贝完成
```

### 目录操作 API

- access: 判断文件或目录是否具有操作权限
- stat： 获取目录及文件信息
- mkdir：创建目录
- rmdir：删除目录
- readdir：读取目录中内容
- unlink： 删除指定文件

```js
// access
fs.access("a.txt", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("有操作权限");
  }
});

// stat
fs.stat("a.txt", (err, statObj) => {
  console.log(statObj.size); // 26
  console.log(statObj.isFile()); // true
  console.log(statObj.isDirectory()); // false
});

// mkdir
// 第二个参数 recursive 默认 false，要保证父级目录是存在的,
// 示例1：'a/b' 需要a存在
// 示例2：'a/b/c' 需要a/b存在
// 意思就是：只能创建最末端的一个路径 basename
// 第二个参数 recursive 为 true，递归创建，那上面示例就不需要父级目录了
fs.mkdir("a/b/c/d", { recursive: true }, (err) => {
  if (!err) {
    console.log("创建成功");
  } else {
    console.log(err);
  }
});

// rmdir
// 第二个参数 recursive 默认 false，
// 默认情况，删除的是最末端的一个路径 basename,
// 默认情况，只能删除空目录
// 第二个参数 recursive 为 true，
// 递归删除，删除第一个参数的所有路径及内容
fs.rmdir("a/b/c", { recursive: true }, (err) => {
  if (!err) {
    console.log("删除成功");
  } else {
    console.log(err);
  }
});

// readdir
// 返回数组，包含第一层级的目录名和文件名
fs.readdir("a", (err, files) => {
  console.log(files); // [ 'a.txt', 'b' ]
});

// unlink
// 删除指定文件
fs.unlink("a/a.txt", (err, files) => {
  if (!err) {
    console.log("删除成功");
  }
});
```

### 目录操作练习

```js
/**
 * 练习1：同步创建多层目录
 * 01 将来调用时需要接收类似 a/b/c 这样的路径，它们之间是采用 / 去行连接
 * 02 利用 / 分隔符将路径进行拆分，将每一项放入一个数组中进行管理 ['a', 'b', 'c']
 * 03 对上述的数组进行遍历，我们需要拿到每一项，然后与前一项进行拼接 /
 * 04 判断一个当前对拼接之后的路径是否具有可操作的权限，如果有则证明存在，否则的话就需要执行创建
 */
function makeDirSync(dirPath) {
  // path.sep 当前系统路径分隔符

  let items = dirPath.split(path.sep); // 02
  for (let index = 0; index < items.length; index++) {
    const dir = items.slice(0, index + 1).join(path.sep); // 03
    try {
      fs.accessSync(dir); // 04
    } catch (error) {
      fs.mkdirSync(dir);
    }
  }
}
makeDirSync("d/e/f");

/**
 * 练习2：异步创建多层目录
 * next 是常见的书写方式
 */
function makeDir(dirPath, cb) {
  const parts = dirPath.split(path.sep);
  let index = 1;

  function next() {
    if (index > parts.length) return cb && cb(); // 递归出口

    const current = parts.slice(0, index).join(path.sep);
    index++;

    fs.access(current, (err) => {
      if (err) {
        // fs.makeDir(current, next) // 可这样
        fs.mkdir(current, () => {
          next();
        });
      } else {
        next();
      }
    });
  }

  // 执行
  next();
}
makeDir("e/e/f");

/**
 * 练习3：异步 async 实现
 * 将 access 与 mkdir 处理成  async... 风格
 */
const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
async function myMkdir(dirPath, cb) {
  let parts = dirPath.split("/");
  for (let index = 1; index <= parts.length; index++) {
    const current = parts.slice(0, index).join("/");
    try {
      await access(current);
    } catch (error) {
      await mkdir(current);
    }
  }

  cb && cb();
}

myMkdir("e/f/g", () => {
  console.log("创建成功");
});

/**
 * 练习4：目录删除异步实现
 * 需求：自定义一个函数，接收一个路径，然后执行删除
 * 01 判断当前传入的路径是否为一个文件，直接删除当前问价即可
 * 02 如果当前传入的是一个目录，我们需要继续读取目录中的内容，然后再执行删除操作
 * 03 将删除行为定义成一个函数，然后通过递归的方式进行复用
 * 04 将当前的名称拼接成再删除时可使用的路径
 *
 * 递归出口（就有1个）
 * 递归（1个递归出口+1个初次执行+1个递归操作）
 */
function myRmDir(dirPath, cb) {
  // 判断当前 dirPath 的类型 文件or文件夹
  fs.stat(dirPath, (err, statObj) => {
    if (statObj.isDirectory()) {
      // 目录则继续读取，所有文件和目录
      fs.readdir(dirPath, (err, files) => {
        // 拼接路径
        const dirs = files.map((item) => {
          return path.join(dirPath, item);
        });
        // 递归出口判断：信号量等于dirs长度
        let index = 0;
        function next() {
          // rmdir 默认情况，删除的是最末端的一个路径 basename
          // 当index等于dirs长度时，说明当前dirs已经全遍历过了，然后再执行myRmdir就走到这个条件执行fs.rmdir
          // rmdir 默认情况，只能删除空目录
          // 递归是从最里层删除的，外层目录满足下面条件时，里面目录也已经删除了，所以是可以被删除掉的
          if (index === dirs.length) return fs.rmdir(dirPath, cb);

          const current = dirs[index];
          index++;

          //当前dirPath和cb
          myRmDir(current, next);
        }

        // 初次调用
        next();
      });
    } else {
      // 文件则直接删除
      fs.unlink(dirPath, cb);
    }
  });
}

myRmDir("f", () => {
  console.log("删除成功");
});
```

## 模块 module

- Commonjs 规范
  - 每个 js 文件都是模块，每个模块都有自己的作用域
  - exports 导出
  - require 导入
- AMD 规范
  - define require
- CMD 规范
- ES modules 规范

Commonjs

- 模块引用 require
- 模块定义 exports
- 模块标识/id 字符串、相对路径、绝对路径

Nodejs 与 Commonjs

- 任意一个文件就是一个模块，具有独立作用域
- 使用 require 导入其它模块
- 将模块 ID 传入 require 实现目标模块定位

module 属性（Nodejs 中任意一个文件都有 module 属性，module 是文件模块的实例，文件模块类构造函数是 Module✅）

- 任意 js 文件就是一个模块，可以直接使用 module 属性
- id： 返回模块标识，一般是一个绝对路径
- filename：返回文件模块的绝对路径
- loaded：返回布尔值，表示模块是否完成加载
- parent：返回对象存放调用当前模块的模块
- children：返回数组，存放当前模块调用的其它模块
- exports：返回当前模块需要暴露的内容
- paths：返回数组，存放不同目录下的 node_modules 位置

module.exports 与 exports 有何区别？

- Commonjs 规范，只规定了，通过 module.exports 执行数据导出操作
- exports 是 nodejs 方便导出，为每个模块都提供的，指向了 module.exports 的内存地址
- exports 不能直接赋值，这样它就不指向 module.exports 的内存地址了，不能对外暴露数据了，变成局部变量了
  - 其实就是 exports = module.exports，exports 应该永远指向 module.exports，才能 exports 导出数据
  - 如果 module.exports 重新赋值，指向就变了，那 exports 也就失效了

require 属性

- 基本功能是读入并执行一个模块文件
- resolve：返回模块文件绝对路径
- extensions：依据不同后缀名执行解析操作
- main：返回主模块对象

Commonjs 规范

- CommonJS 规范起初是为了弥补 JS 语言模块化缺陷

- CommonJS 是语言层面的规范，当前主要用于 Node.js

- CommonJS 规定模块化分为引入、定义、标识符三个部分

- Module 在任意模块中可直接使用包含模块信息

- Require 接收标识符，加载目标模块

- Exports 与 module.exports 都能导出模块数据

- CommonJS 规范定义模块的加载是同步完成

### Node.js 与 Commonjs

- 使用 module.exports 与 require 实现模块导入与导出
- module 属性及其常见信息获取
- exports 导出数据及其与 module.exports 区别
- Commonjs 规范下的模块加载都是同步的 ✅（核心模块 nodejs 运行时已经加载到内存中了，其它自定义模块都是同步执行加载的）

```js
console.log(module); // ✅

// 打印：
{
  id: '.',
  path: '/Users/xxxx/learn/nodejs-projects/examples/module', // 父目录
  exports: { obj: 'hello' }, // 模块导出内容
  filename: '/Users/xxxx/learn/nodejs-projects/examples/module/index.js', // 当前文件
  loaded: false, // 是否完成首次加载并缓存
  children: [
    {
      id: '/Users/xxxx/learn/nodejs-projects/examples/module/strParse.js',
      path: '/Users/xxxx/learn/nodejs-projects/examples/module',
      exports: [Function: strParse],
      filename: '/Users/xxxx/learn/nodejs-projects/examples/module/strParse.js',
      loaded: true,
      children: [],
      paths: [Array]
    }
  ],
  // 一直向上寻找 node_modules，直到找到 node_modules✅
  paths: [
    '/Users/xxxx/learn/nodejs-projects/examples/module/node_modules',
    '/Users/xxxx/learn/nodejs-projects/examples/node_modules',
    '/Users/xxxx/learn/nodejs-projects/node_modules',
    '/Users/xxxx/learn/node_modules',
    '/Users/xxxx/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}

```

```js
// 示例1：
exports.obj = "hello";
module.exports = {
  obj1: "ni hao",
};
// 如果 module.exports 重新赋值，那 exports.obj  不生效了

// 示例2：
exports = {
  obj2: "hello2",
};
// 如果 exports 重新赋值，那 exports 不生效了

// 综上2个示例：
// module.exports 和 exports 指向不一致了，那 exports 导出就不生效了 ✅
```

```js
// require.main 应该是当前命令行的入口模块
console.log(require.main === module);
```

### 模块分类及加载流程

模块分类：

- 内置模块
- 文件模块

模块加载速度：

- 核心模块： Node 源码编译时写入到二进制文件中，当某个 node 进程被启用时，有些 node 模块就已经存在于内存中了
- 文件模块：代码运行时，动态加载。

加载流程：

1. 路径分析：依据标识符确定模块位置（将当前模块标识符转为绝对路径，找到目标模块）
2. 文件定位：确定目标模块中具体的文件及文件类型
3. 编译执行：采用对应的方式完成文件的编译执行（最后返回一个可用 exports 对象给外部使用）

路径分析之标识符

- 路径标识符
- 非路径标识符，常见于核心模块及第三方模块
- 模块路径：module.paths 路径数组，是 node 查找当前模块的策略，一直向上查找 node_modules 目录。当其它模块 require 这个模块时，会遍历这个路径数组，如果最终没找到就抛出 Cannot find module

文件定位：✅

- 项目下存在 m1.js 模块，导入时使用 require('m1') 语法。
- m1.js -> m1.json -> m1.node 当没有文件扩展名时，会按左侧顺序补足扩展名。
- 如果都没找到查找 Node 会认为拿到的是目录，Node 就会把这个当做包来处理，在当前目录下查找 package.json 文件，如果找到则使用 JSON.parse() 解析 json 文件里的内容，找到 main 属性值。
- main.js -> main.json -> main.node 如果 main 没有文件扩展名同样也会进行补足扩展名。
- 如果 main 相关的文件都没找到，那 Node 会将 index 作为目标模块中的具体文件名称，在一次查找 index.js -> index.json -> index.node 文件。
- 先是在当前目录查找，如果没找到，就会按路径数组，向上一层一层查找。如果最后还是没找到就会抛出异常。

编译执行：

- 将某个具体类型的文件按照相应的方式进行编译和执行（在 node 中每个模块都是一个对象 ✅）
- 创建新对象，按路径载入，完成编译执行。

JS 文件的编译执行：✅

- 先使用 fs 模块同步读取目标文件内容
- 对内容进行语法包装，生成可执行 js 函数
- 紧接着调用这个函数
- 调用函数时传入 exports、module、require 等属性值

JSON 文件的编译执行：✅

- 将读取到的内容通过 JSON.parse() 进行解析
- 最后将结果返回给 exports 对象就可以了

缓存优化原则：✅

- 提高模块加载速度
- 当标识符确定了决定路径后，首先会在缓存中查找是否存在想要的模块，如果有则直接返回模块，
- 如果没有则会执行一次完整的加载流程。当首次模块加载完成后，会使用路径作为索引进行缓存。这样下次再加载该模块时，就可以使用缓存中的该模块了。
- 如果已缓存了，那 this.loaded = true

### 模块加载源码分析

require 源码分析调试 ✅✅✅ 可反复复习；

Webpack 打包过程中模块分析编译，和 require 有类似思路，当然它是为了在浏览器端运行。

nodejs 断点调试 ✅、断点调试面板 ✅、源码调试讲解 ✅

- module 是文件模块的实例，文件模块类构造函数是 Module✅
- new Module(filename, parent) 生成模块实例对象，filename 是绝对路径

```js
function Module(id = "", parent) {
  this.id = id;
  this.path = path.dirname(id);
  this.exports = {};
  this.parent = parent;
  updateChildren(parent, this, false);
  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```

- `Module._cache` Module 类上 `_cache` 用来缓存模块，`Module._cache[filename] = module`
- Module.prototype.load 方法用来加载模块
  - `Module._extensions` 补足模块扩展名，并读取文件内容，并编译文件内容
  - 文件内容 content = fs.readFileSync(filename, 'utf8') 返回字符串
  - 再通过 `Module.prototype._compile(content, filename)` 将字符串内容转成可运行 js 代码
  - 模块加载时同步操作，require 源码里的文件读取 api 也都是同步的
  - 加载完成 this.loaded = true
- `Module.prototype._compile`
  - compiledWrapper = wrapSafe(filename, content, this) 返回的是自调用的结构，入参有 `(exports, require, module, __filename, __dirname)` 函数里内容就是模块内容。这 5 个参数变量也是任意 node 模块里能直接使用的 5 个变量，为什么能够直接使用呢，就是因为在加载过程中包裹操作时传入里这 5 个变量。
  - compiledWrapper 里如何安全执行的，是通过类似虚拟机的 vm 模块完成的，vm 是一个沙箱环境。
  - 先是有了这个自执行函数 compiledWrapper 但还没执行，接下来是获取那 5 个入参变量
    - dirname = path.dirname(filename)
    - require = makeRequireFunction(...)
    - exports = this.exports
    - thisValue = exports
    - module = this 当前模块的实例
    - 最后执行 result = compiledWrapper.call(thisValue, exports, require, module, filename, dirname)
    - 在模块里 console.log(this) 不是 global 而是 exports，在这里 call(thisValue)
- 最后 return module.exports 也就是 require 最后返回永远是 module.exports 的指向

### 内置模块 VM

核心作用：创建独立运行的沙箱环境

默认 nodejs 能 require js、json、.node 后缀文件 ✅

```js
const fs = require("fs");
const vm = require("vm");

const content = fs.readFileSync("./test.txt", "utf-8");
// age = 10;
// let age = 10;
// let age1 = 30;

// 让js字符串内容转成能够执行js代码的方式：

// eval() 方式
// 会有变量重名问题
eval(content);
console.log(content); // var age = 18; 如果使用 const 不行
console.log(age); // 18

// vm 方式
// 会有变量重名问题
vm.runInThisContext(content);
console.log(age); // 18
vm.runInThisContext("age += 10"); // age is not defined 除非 age 全局变量
```

### 模块加载模拟实现

模拟文件模加载流程实现

- 路径分析，确定绝对路径
- 缓存优化
- 文件定位，确定文件类型，来调用对应的编译函数（require 默认有.js、.json 模块文件的内容读取编译方式）
- 编译执行，把加载的模块内容，转变成在当前模块可执行的内容

```js
// 模拟require实现 ✅👍🏻

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function Module(id) {
  this.id = id;
  this.exports = {};
}

/**
 * 根据路径查找文件模块位置的大概方式：
 * 直接看不存在情况：
 * 01 补足文件或追 .js .json 等，
 * 02 补完后还不存在，当做目录找里面是否有package.json，再找 main.js 或 main.json，如果 main 不存在，再找 index
 * 03 还不存在，按查找路径一层层往上找 node_modules，寻找该块
 *
 * 下面实现通过：通过后缀补足方式
 */

Module._resolveFileName = function (filename) {
  // 利用 Path 将 filename 转为绝对路径
  const absPath = path.resolve(__dirname, filename);

  // 判断当前路径对应的内容是否存在（路径或文件）
  if (fs.existsSync(absPath)) {
    // 如果条件成立则说明 absPath 对应的内容是存在的
    return absPath;
  } else {
    // 文件定位，通过后缀补足方式
    const suffixArr = Object.keys(Module._extensions);
    for (let i = 0; i < suffixArr.length; i++) {
      const newPath = absPath + suffixArr[i];
      if (fs.existsSync(newPath)) {
        return newPath;
      }
    }
  }

  // 如果上面方式没找到文件，则抛出错误
  throw new Error(`${filename} is not exists`);
};

Module._extensions = {
  ".js"(module) {
    // js 类型文件编译并执行

    // 01 读取字符串内容
    let content = fs.readFileSync(module.id, "utf-8");

    // 02 包装可执行的字符串
    content = Module.wrapper[0] + content + Module.wrapper[1];

    // 03 通过 VM 编译成可执行函数
    let compileFn = vm.runInThisContext(content);
    console.log(compileFn);

    // 04 准备参数的值
    const exports = module.exports;
    const dirname = path.dirname;
    const filename = module.filename;

    // 05 调用执行函数，this 指向 exports
    compileFn.call(exports, exports, myRequire, module, filename, dirname);

    // 模块文件内部需要有 module.exports 进行属性挂载
    // 挂载到 module 实例的 exports 属性上
    // 里面的 module 是 myRequire 里创建的Module实例 ✅
  },
  ".json"(module) {
    // json 类型文件编译并执行

    // 01 读取字符串内容，并parse
    let content = JSON.parse(fs.readFileSync(module.id, "utf-8"));

    // 挂载到 module 实例的 exports 属性上
    module.exports = content;
  },
};

// 包装自执行函数, 并加上参数
Module.wrapper = [
  "(function(exports, require, module, __filename, __dirname) {",
  "})",
];

Module._cache = {};

Module.prototype.load = function () {
  // 01 文件类型
  const extname = path.extname(this.id);
  console.log(extname);
  // 02 根据文件类型进行相应的处理，并传入this
  Module._extensions[extname](this);
};

function myRequire(filename) {
  // 01 绝对路径
  let mPath = Module._resolveFileName(filename);

  // 02 缓存优先
  const cacheModule = Module._cache[mPath];
  if (cacheModule) return cacheModule.exports;

  // 03 创建对象加载目标模块
  const module = new Module(mPath);

  // 04 缓存已加载的模块
  Module._cache[mPath] = module;

  // 05 执行加载（编译执行）
  module.load();

  // 06 返回数据
  return module.exports;
}

// 测试执行 myRequire
// let obj = myRequire("./v.js");
let obj = myRequire("./v1.json");
console.log("myRequire返回结果: ", obj);
```

## 事件模块 Events

- 通过 EventEmitter 类实现事件统一管理 `const EventEmitter = require("events")`
- 实际开发中 单独引入这个模块概率不大
- 很多核心模块已经继承了这个类，也就具备了事件注册和发布的能力

events 与 EventEmitter

- nodejs 是基于事件驱动的异步曹组架构，内置 events 模块
- events 模块提供了 EventEmitter 类
- nodejs 中很多内置核心模块继承了 EventEmitter

EventEmitter 常见 API

- on: 添加当前时间被处罚时调用的回调函数
- emit: 触发事件，按照注册的序同步调用每个事件监听器
- once: 添加当事件注册之后首次被触发时调用的回调函数
- off: 移除特定的监听器

```js
// EventEmitter 是一个类，可被继承扩展、实例化。
const EventEmitter = require("events");
// 自定义继承扩展
class CusTomEvent extends EventEmitter {}
const ev = new EventEmitter(); // 一个实例，后面操作也是在这个实例上完成的✅

//【on 事件监听】
// 事件处理程序会被放到事件队列里
ev.on("test", () => {
  console.log("事件执行: test1");
});
ev.on("test", () => {
  console.log("事件执行: test2");
});
// 事件函数执行的顺序和注册时的顺序一致
ev.emit("test");
// 如果多次触发同一个事件，那相应的事件函数也会多次执行
ev.emit("test");

//【once 事件监听一次】
ev.once("test-once", () => {
  console.log("事件执行: test-once1");
});
ev.once("test-once", () => {
  console.log("事件执行: test-once2");
});
// 首次触发事件，两个监听函数都会执行
ev.emit("test-once");
// once 事件监听函数执行完后，会把对应的监听函数删除
// 再次触发事件，上面两个监听函数都不会执行了，已经被删除了
ev.emit("test-once");
// 打印：
// 事件执行: test-once1
// 事件执行: test-once2

//【off 取消事件监听，第一个参数是事件名，第二个参数是监听函数名】
// 监听函数
const testACb = () => {
  console.log("事件执行: test");
};
ev.on("test", testACb);
// 首次触发事件，监听函数会执行
ev.emit("test");
// 取消事件test的监听函数testACb
ev.off("test", testACb);
// 再次触发事件，监听函数 testACb 不会执行了，已经被取消注册了
ev.emit("test");

//【监听函数接收参数】
// 监听函数
const testACb = (a, b) => {
  console.log("事件执行: test", a, b);
};
// 也可放到一个数组里
const testACb1 = (...args) => {
  console.log("事件执行: test", args);
};
ev.on("test", testACb);
// 监听函数传参
ev.emit("test", 1, 2);

//【EventEmitter实例打印】
// function 里 this 指向 EventEmitter 实例
ev.on("test", function () {
  console.log(this);
  //
});
ev.on("test", function () {
  console.log(111);
});
ev.on("test2", function () {
  console.log(222);
});
ev.emit("test");
// 打印: _events 存放了多个事件
// EventEmitter {
//   _events: [Object: null prototype] {
//     test: [ [Function (anonymous)], [Function (anonymous)] ],
//     test2: [Function (anonymous)]
//   },
//   _eventsCount: 2,
//   _maxListeners: undefined,
//   [Symbol(shapeMode)]: false,
//   [Symbol(kCapture)]: false
// }
// 111

// 【fs 模块 继承了 EventEmitter，同理其它模块】
// 就可以使用 EventEmitter 一些 api，和 fs里面自定义的事件
// 这也是事件驱动思想，来完成nodejs的开发
const fs = require("fs");
const crt = fs.createReadStream();
crt.on("data", () => {});

// 【事件驱动与 事件循环 event loop】✅
// 每次触发事件都会把事件监听函数，放到事件循环里；
// 当主线程代码执行完后，会按照事件循环的机制一次执行。
// 这样就是nodejs的异步变成方式，以及处理回调的方式。

// 事件注册函数时，是放到事件实例的_events里的，不是事件循环里，别弄混了。✅
```

### 发布订阅模式

发布订阅要素

- 缓存队列，存放订阅者信息
- 具有增加、删除订阅的能力
- 状态改变时通知所有订阅者执行监听

模拟发布订阅实现

```js
class PubSub {
  constructor() {
    this._events = {};
  }
  // 注册
  subscribe(event, callback) {
    // 一个事件可绑定多个监听，放到数组里
    if (this._events[event]) {
      // 如果当前 事件 存在，所以只需要往后添加当前次监听操作callback
      this._events[event].push(callback);
    } else {
      // 如果没有订阅过此事件
      this._events[event] = [callback];
    }
  }
  // 发布，让事件的每个监听执行
  publish(event, ...args) {
    const items = this._events[event];
    if (items && items.length) {
      items.forEach(function (callback) {
        callback.call(this, ...args);
      });
    }
  }
}

const ps = new PubSub();
ps.subscribe("test", () => {
  console.log("事件执行了1");
});
ps.subscribe("test", () => {
  console.log("事件执行了2");
});
ps.publish("test");
```

### EventEmitter 源码调试

源码调试过程很棒可重复观看 ✅👍🏻：

- 一个事件单次订阅监听、再次订阅监听、触发事件
- EventEmitter 内部也是发布订阅模式
- 每个事件实例需要 new 生成

源码调试操作：

- 右弯箭头 在单个文件里 ✅，单步/单行跳过
  - 如果需要进入函数里面，就点击进栈
- 下箭头 进栈
- 上箭头 出栈
- 刷新

### EventEmitter 模拟

```js
function MyEvent() {
  // 准备一个数据结构用于缓存订阅者信息
  this._events = Object.create(null);
}
MyEvent.prototype.on = function (type, callback) {
  // 判断当前次的事件是否已存在，然后再决定如何做缓存
  if (this._events[type]) {
    this._events[type].push(callback);
  } else {
    this._events[type] = [callback];
  }
};
MyEvent.prototype.emit = function (type, ...args) {
  if (this._events && this._events[type].length) {
    this._events[type].forEach((callback) => {
      callback.call(this, ...args);
    });
  }
};
MyEvent.prototype.off = function (type, callback) {
  if (this._events && this._events[type]) {
    this._events[type] = this._events[type].filter((item) => {
      return item !== callback || item.link !== callback; // 兼容once
    });
  }
};
MyEvent.prototype.once = function (type, callback) {
  // 函数包装器
  const foo = function (...args) {
    callback.call(this, ...args);
    this.off(type, foo);
  };
  // 兼容once注册后，主动取消off
  foo.link = callback;
  this.on(type, foo);
};

const ev = new MyEvent();
const fn = function (...data) {
  console.log("事件test执行了", data);
};
ev.on("test", fn);
ev.on("test", fn);
// ev.off("test", fn);
ev.emit("test", "前", "后");
```

### 事件环

### 浏览器中的 Eventloop

- 从上至下执行所有的同步代码 ✅
- 执行过程中将遇到的宏任务与微任务添加至相应的队列
- 同步代码执行完毕后，执行满足条件的微任务回调 ✅
- 微任务队列执行完毕后，执行满足条件的宏任务回调
- 循环事件环操作
- 注意：每当宏任务列表中，任何一个宏任务执行完成后，都会清空一次微任务列表的所有微任务。✅

- 简化：✅
  - 初始同步代码执行（也是宏任务）
  - 完成后，检查微任务队列，清空微任务列表，执行所以微任务（过程中产生新的宏和微任务分别添加到各自队列，如果是微任务在此次清空列表的过程中还会被执行）
  - 完成后，检查宏任务队列，执行一个宏任务（过程中产生新的宏和微任务分别添加到各自队列）

```js
setTimeout(() => {
  console.log("s1");
  Promise.resolve().then(() => {
    console.log("p2");
  });
  Promise.resolve().then(() => {
    console.log("p3");
  });
});

Promise.resolve().then(() => {
  console.log("p1");
  setTimeout(() => {
    console.log("s2");
  });
  setTimeout(() => {
    console.log("s3");
  });
});

// p1
// s1
// p2
// p3
// s2
// s3
```

### Nodejs 中的事件环

- nodejs 共有 6 个事件队列
- 每个队列存放都是回调函数，具体内容不一样：✅
  - timer: 执行 setTimeout 与 setInterval 回调
  - pending callbacks: 执行系统操作的回调，例如 tcp udp
  - idle，prepare: 只在系统内部进行使用
  - poll: 执行与 I/O 相关的回调
  - check: 执行 setImmediate 中的回调
  - close callbacks: 执行 close 事件的回调

![8](/assets/images/nodejs8.png)

Nodejs 完整事件环： ✅

- 执行同步代码，将不同的任务添加到相应的队列；比如遇到 setTimeout 回调 就会放到 timer 里，如遇到文件读写回调就会放到 poll 里；
- 所有同步代码执行完后，就会执行满足条件的微任务；脑补下有个存放微任务的队列，这和前面 6 个队列没关系；
- 所微任务代码执行完后，会执行 timer 队列中满足的宏任务；
- timer 中的所有的宏任务执行完后，就会依次切换队列（按照顺序宏任务）
- 注意：在切换下个宏任务队列之前，会先清空微任务代码；
- （❗️ 注意一下，老师这里是按照 10 版本讲的，但是在 11 版本后，Node.js 的微任务执行时机已经和浏览器保持一致了，即 `每一个宏任务执行前`，都要优先清空微任务。老师这里的 10 版本，是在`宏任务队列切换前`，才会去清空微任务）

示例：

```js
// 宏任务
setTimeout(() => {
  console.log("s1");
});
// 微任务，Promise.resolve()是同步的，后面then的回调是微任务
Promise.resolve().then(() => {
  console.log("then");
});
// 微任务，优先级高于上面then的微任务
process.nextTick(() => {
  console.log("tick");
});
// 宏任务
setImmediate(() => {
  console.log("setImmediate");
});
console.log("end");
// 首次同步任务，输出：start end
// 清空微任务，输出：start end tick then
// 宏任务timer，输出：start end tick then s1
// 切换到poll，没有任务继续向下切换
// 切换到check，输出：start end tick then s1 setImmediate
```

首次同步代码执行完示意图
![9](/assets/images/nodejs9.png)

### Nodejs 事件环梳理

（❗️ 注意一下，老师这里是按照 10 版本讲的，但是在 11 版本后，Node.js 的微任务执行时机已经和浏览器保持一致了，即 `每一个宏任务执行前`，都要优先清空微任务。老师这里的 10 版本，是在`宏任务队列切换前`，才会去清空微任务）

```js
// 宏任务
setTimeout(() => {
  console.log("s1");
  // 微任务
  Promise.resolve().then(() => {
    console.log("then1");
  });
  // 微任务
  process.nextTick(() => {
    console.log("tick1");
  });
});
// 微任务
Promise.resolve().then(() => {
  console.log("then2");
});
console.log("start");
// 宏任务
setTimeout(() => {
  console.log("s2");
  // 微任务
  Promise.resolve().then(() => {
    console.log("then3");
  });
  // 微任务
  process.nextTick(() => {
    console.log("tick2");
  });
});
console.log("end");

// node -v v21.5.0
// start
// end
// then2
// s1
// tick1
// then1
// s2
// tick2
// then3
```

### Nodejs 与浏览器事件环区别

- 任务队列数不同
  - 浏览器中只有 2 个任务队列（宏任务队列、微任务队列）
  - Nodejs 中有 6 个事件队列
- 微任务优先级不同
  - 浏览器事件环中，微任务存放于事件队列，先进先出
  - Nodejs 中 process.nextTick 优先 promise.then 执行
- 同步执行完，每个宏任务执行完，都会清空微任务队列

### Nodejs 事件环常见问题

1. setTimeout 0 延迟问题

```js
// 宏任务，默认第二个参数是0
setTimeout(() => {
  console.log("s1");
});
// 宏任务
setImmediate(() => {
  console.log("setImmediate");
});
// setImmediate
// s1
// ➜  events git:(master) ✗ node ./index.js
// s1
// setImmediate
// ➜  events git:(master) ✗ node ./index.js
// setImmediate
// s1

// 原因是 setTimeout 回调 0 触发不稳定，可能会延迟的
// 如果 setTimeout 没延迟，那 s1 在前，否则 s1 在后
```

2.

```js
const fs = require("fs");
fs.readFile("./m1.js", () => {
  // 宏任务，timer队列里
  setTimeout(() => {
    console.log("s1");
  });
  // 宏任务，会放到check队列
  setImmediate(() => {
    console.log("setImmediate");
  });
});
// 快速执行几次，一直都是：
// setImmediate
// s1
// 原因：
// 先readFile回调，放到 poll 队列里
// 然后执行回调，分别把2个宏任务放到对应队列里；
// ✅然后，poll执行完后，切换队列是按顺序向下切换，所以就到了 setImmediate 所在任务队列即 check队列；
```

- 总结：
  - 默认 setTimeout(0) 和 setImmediate 回调执行顺序是随机的；
  - 如果放到 IO 回调中，那顺序就是固定的，永远都是 setImmediate 回调先执行，在执行 setTimeout(0)的回调；（原因就是 6 个队列的执行顺序有关；）

## 核心模块 Stream

- `ls | grep *.js` 会将管道左侧命名执行结果，再交给右侧命令进行处理
- 文件系统和网络模块实现了流接口，Nodejs 最长使用的两个模块。
- Nodejs 中的流就是处理流式数据的抽象接口
- 应用程序中为什么使用流来处理数据？
  - 同步读取资源文件，用户需要等待数据读取完成
  - 资源文件最终一次性加载至内存，开销教大（v8 引擎默认提供内存 1G 多点）
  - 因此可以采用流操作数据
- 流处理数据的优势
  - 时间效率：流的分段处理可以同时操作多个数据 chunk
  - 空间效率：同一时间流分段无须占据大内存空间
  - 使用方便：流可配合管道，扩展程序变得简单

Node.js 中流的分类：（抽象类）

- Readable： 可读流，能够实现数据的读取
- Writeable：可写流，能够实现数据的写操作
- Duplex： 双工流，即可读又可写，读写是独立的，可理解读写的简单合并 ✅
- Transform：转换流，可读可写，读写是互通的，能够实现数据转换 ✅

Node.js 流的特点：

- Stream 模块实现了四个具体的抽象类（上面 4 个类）（常用模块如 fs http 等已经实现了流操作的接口）✅
- 所有流都继承了 EventEmitter ✅

```js
const fs = require("fs");
// 创建可读流，读取test内容
const rs = fs.createReadStream("./test.txt");
// 创建可写流，写入到test1
const ws = fs.createWriteStream("./test1.txt");
// 通过管道分段处理
rs.pipe(ws);
```

### stream 可读流

可读流：生产供程序消费数据的流。最常见的生产方式：读取磁盘文件，读取网络请求里的内容。✅

- fs 内部已经实现了 Readable 类的接口，同时也继承了 EventEmitter 类。
- Nodejs 中标准输出就是一个可写流。
- 原理了解即可，常用模块已经内部实现了流的接口，使用即可。✅

如何自定义可读流？

- 继承 Stream 里的 Readable 类
- 重写 `_read` 方法，调用 push 产出数据（push 推送到缓存区，供其它程序消费）

- 底层数据读取完成之后如何处理？
  - push(null)
- 消费者如何获取可读流中的数据？
  - 提供 2 个事件：Readable 和 data 事件
- 消费数据为什么存在二种方式？
  - 流动模式、暂停模式，区别就是，是否需要主动方法调用 read 方法

![nodejs10](/assets/images/nodejs10.png)
这个过程中有很多细节，这里只做大概了解可读流工作原理，常用模块已经继承了流模块。✅

Readable 和 data 事件 与 pipe

- Readable 和 data 事件，可自主拿到想要数据，做写自定义操作
- pipe 则是对整体数据进行处理

消费数据

- Readable 事件：当流中存在可读取数据时触发，即缓存区已经准备了些数据，需要主动调用 Readable 方法来消费数据，同时可能触发\_read 继续读取底层数据到缓存区再到应用程序，直接消费者拿到 null 后，这样底层数据页被读取完了。（✅ 比较完整描述了流式读取）
- data 事件：当流中数据块传递给消费者后触发，可读流是流动模式的，数据会被尽可能快的传递，底层数据被读取出，可能都不会调用 push 进入缓存区，直接就给消费了，同样读取到 null，读取就完成了。
- end 事件：数据被全部消费完成后触发。
- 还有其它事件就不展开了，看文档吧。

可读流总结

- 明确数据生产与消费流程
- 利用 API 实现自定义的可读流
- 明确数据消费的事件使用

```js
const { Readable } = require("stream");
// 模拟底层数据
const source = ["lg", "zce", "syy"];
// 自定义继承 Readable
class MyReadable extends Readable {
  constructor(source) {
    super();
    this.source = source;
  }
  // 覆盖 父类_read方法
  _read() {
    const data = this.source.shift() || null; // 如果读取没了，则返回null同步非消费者，数据读取完了
    // push 到缓存区
    this.push(data);
  }
}
// 测试：实例化
const myReadable = new MyReadable(source);

// 打印2次1
// 原因是在Readable里默认是暂停模式，监听操作好像是读了2次
// myReadable.on("readable", () => {
//   console.log(1);
// });

// 示例1：使用主动调用read()方法的方式
myReadable.on("readable", () => {
  let data = null;
  // 如果null说明数据读取完成了
  // read不带参数
  // while ((data = myReadable.read()) !== null) {
  //   console.log(data.toString());
  // }
  // read带参数2
  while ((data = myReadable.read(2)) !== null) {
    console.log(data.toString());
  }
});
// 不带参数-打印：
// lgzce // 这里应该是缓存区已经有数据了，不用纠结这块。大概理解读取流程就行
// syy
// 不带参数-打印：
// lg
// zc
// es
// yy

// 示例2：使用流动模式（注释上面的示例1）
// 可能不用push缓存区直接消费使用了，看着比较舒服些
myReadable.on("data", (chunk) => {
  console.log(chunk.toString());
});
// 打印：
// lg
// zce
// syy
```

### stream 可写流

可写流：用于消费数据的流，常见操作：往磁盘文件写入内容，或对 tcp 和 http 网络响应进行操作。

自定义可写流：

- 继承 stream 模块的 Writeable
- 重写 `_write` 方法，调用 write 执行写入

可写流事件：

- pipe 事件：可读流调用 pipe() 方法时触发
- unpipe 事件：可读流调用 unpipe() 方法时触发
- drain 事件：write() 方法返回 false，而又可以继续写入时触发。
  - 使用流操作不会撑爆内存，如何实现的？大致原理：write() 执行时会判断下，当前想要写入的数据量是否小于当前流中设置的缓存大小上线，
  - 如果小于返回 true 正常写入，如果大于返回 false（未完待续）
- 其它事件：close、open、error、finish、ready

```js
// 流的拷贝，与 copyFile 一次性的读取再写入✅
const fs = require("fs");
// 创建一个可读流，生产数据
const rs = fs.createReadStream("./test.txt");
// 修改字符编码，便于后续使用
rs.setEncoding("utf-8");
// 创建一个可写流，消费数据
const ws = fs.createWriteStream("./test1.txt");
// 监听事件调用方法完成具体消费
rs.on("data", (chunk) => {
  // 执行数据写入
  console.log(ws);
  ws.write(chunk);
});
```

```js
// 自定义可写流
const { Writable } = require("stream");
class MyWritable extends Writable {
  constructor() {
    super();
  }
  // en 写入时要设置的编码集
  _write(chunk, en, done) {
    // 直接控制台，标准输出
    process.stdout.write(chunk.toString() + "<---");
    process.nextTick(done); // 异步中执行回调
  }
}
const myWritable = new MyWritable();
myWritable.write("hello write", "utf-8", () => {
  console.log("end");
});
// 打印：hello write<---end
```

### stream 双工流和转换流

- nodejs 中 stream 是流操作的抽象接口集合。
- 可读、可写、双工、转换是单一抽象具体实现。
- 流操作的核心功能是处理数据
- Nodejs 诞生初中就是解决密集型 IO 事务
- Nodejs 中处理数据模块继承了流和 EventEmitter
- 日常开发中直接使用这些已继承的模块就行，不用自定义继承。了解流操作对具体模块使用，什么场景使用哪些模块，是有帮助的。✅

Duplex 是双工流，同时实现了 Readable 和 Writeable，既能生产数据又能消费数据

自定义双工流：

- 继承 Duplex 类
- 重写 `_read` 方法，调用 push 生产数据
- 重写 `_write` 方法，调用 write 消费数据

Transform 转换流 也是双工流；

自定义双工流：

- 继承 Transform 类
- 重写 `_transform` 方法，调用 push 和 callback
- 重写 `_flush` 方法，处理剩余数据

Duplex 与 Transform 区别：

- **Duplex 读写是相互独立的，读操作创建的数据不能直接被写操作当做数据源使用；Duplex 可读流数据和可写流数据，是分开处理的 ✅**
- **Transform 这个操作是可以的，底层读写操作是连通的，读写操作操作的数据是互通的，还是对数据进行自定义转换操作 ✅**

```js
// 自定义 Duplex 双工流
const { Duplex } = require("stream");
// 模拟底层数据
const source = ["a", "b", "c"];
// 自定义双工流（简单合并读和写操作）
class MyDuplex extends Duplex {
  constructor(source, options) {
    super(source, options);
    this.source = source;
  }
  // 可读
  _read() {
    const data = this.source.shift() || null;
    this.push(data);
  }
  // 可写
  _write(chunk, enc, next) {
    if (Buffer.isBuffer(chunk)) {
      chunk = chunk.toString();
    }
    process.stdout.write(chunk + "----");
    process.nextTick(next);
  }
}
// 实例化
const myDuplex = new MyDuplex(source);
// 可读流的事件
myDuplex.on("data", (chunk) => {
  console.log(chunk.toString());
});
// 可写的方法；和可读是分开的
// myDuplex.write("测试数据", "utf-8", () => {
//   console.log("双工流测试可写操作");
// });
// 注意：myDuplex 可读流数据和可写流数据，是分开处理的✅
```

```js
// 自定义 Transform 转换流
const { Transform } = require("stream");

class MyTransform extends Transform {
  constructor() {
    super();
  }
  /**
   * _transform(chunk, encoding, callback)
   * chunk 是从传给 write 的 stream 转换来的
   * this.push() 把数据放到可读流里✅，这里可对chunk进行转换操作
   * callback(err, chunk) 是 chunk 处理完成后必须要执行的；✅
   *  传入 err 对象；
   *  传入 chunk 与调用push的操作一样，内部调用 push(chunk)，把数据交给可读流，后面再调用 callback
   */
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback(null);
  }
}
const t = new MyTransform();
t.write("a");
// 验证是否有可读的操作，通过事件 data ✅
t.on("data", (chunk) => {
  console.log(chunk.toString());
});
/**✅
 * 先执行写入方法，然后pipe方法，是把转换流里数据传给可写流stdout，那转换流里的数据从哪来的？
 * 因为并没有主动调用可读流操作，这里write写入数据最终是通过push交给了可读流，从而打通了读写操作。
 * 也就是write写入的 a b c 是在可读流中是存在的。因此在可写流stdout可输出大写的ABC
 */
t.pipe(process.stdout);
```

### 文件可读流创建和消费

```js
const fs = require("fs");
// 可读流
const rs = fs.createReadStream("./test.txt", {
  // 以什么模式打开，r 可读
  flags: "r",
  // 默认 null，test内容是buffer
  encoding: null,
  // 标识符
  fd: null,
  // 十进制 438
  mode: 438,
  // 自动关闭文件
  autoClose: true,
  // 从哪个位置读取
  start: 0,
  // 从哪个位置结束
  // end: 3,
  // 每次读取多少到缓存区
  highWaterMark: 4,
});
// data事件，流动模式与暂停模式切换
// rs.on("data", (chunk) => {
//   console.log(chunk.toString());
//   // 暂停模式
//   rs.pause();
//   setTimeout(() => {
//     // 开启流动
//     rs.resume();
//   }, 1000);
// });
// 打印：每隔1s打印2个字节，直到全部
// 注释上面的
// readable事件，通过主动调用read方法消费
rs.on("readable", () => {
  // const data = rs.read();
  // console.log(data);
  let data;
  data = rs.read(1); // 参数为 1 测试
  while (data !== null) {
    console.log(data.toString());
    // 查看缓冲区里字节的长度
    console.log("--------", rs._readableState.length);
    data = rs.read(1);
  }
});
// ✅：
// readable 事件被触发时，缓存区都会有 highWaterMark 长度的数据，
// 当read(1)读取走1个长度字节时，那缓冲区还剩3个长度字节
// 然后继续read(1) ...
// 直到缓存区清空了或剩余字节长度小于要读取的长度，会触发从底层_read()读取highWaterMark 长度的数据push()到缓存区，继续上面的操作。
// 打印：
// h
// -------- 3
// e
// -------- 2
// l
// -------- 1
// l
// -------- 0
// o
// -------- 0
```

### 文件可读流事件与应用

```js
// 示例使用上面代码
// open 事件，创建或实例化文件可读流后触发 open 事件
rs.on("open", (fd) => {
  console.log(fd, "文件打开了");
});
// 默认是暂停模式，需要数据消费空后，才能触发close事件
rs.on("close", () => {
  console.log("文件关闭了");
});
// 使用data事件，切换到流程模式，数据消费完后，触发close事件
rs.on("data", (chunk) => {
  console.log(chunk);
});
// end事件，数据被清空之后触发
rs.on("end", () => {
  console.log("当数据被清空之后");
});
// error事件
rs.on("error", (err) => {
  console.log(err, "出错了");
});
// 打印：
// 14 文件打开了
// <Buffer 68 65 6c 6c>
// <Buffer 6f>
// 当数据被清空之后
// 文件关闭了
```

```js
// 示例使用上面代码
const bufferArr = [];
rs.on("data", (chunk) => {
  bufferArr.push(chunk);
});
rs.on("end", () => {
  // 拼接然后转成字符串
  console.log(Buffer.concat(bufferArr).toString());
});
// 打印：hello
```

### 文件可写流应用和事件

```js
const fs = require("fs");
// 可写流
const ws = fs.createWriteStream("./test.txt", {
  // 以什么模式，w 可写模式
  flags: "w",
  // 编码集
  encoding: "utf-8",
  // 标识符
  fd: null,
  // 十进制 438
  mode: 438,
  // 从哪个位置读取
  start: 0,
  // 每次写多少
  highWaterMark: 3,
});
// write 回调函数异步操作是串行的，意思是先添加的回调会先执行，后添加的或执行。
// ✅fs文件可写流可传入数据一般都是字符串或buffer，不能是数值等。非文件可写流可以是其它数据类型。
ws.write("world", () => {
  console.log("ok1");
});
// 继续写入 buffer
const buf = Buffer.from("abc");
ws.write(buf, () => {
  console.log("ok2");
});
// test.txt文件会写入 worldabc
```

```js
// open事件，ws 实例被创建就会触发open
ws.on("open", (fd) => {
  console.log("open", fd);
});
// close事件，需要主动调用end()方法后，才会触发close事件
ws.on("close", () => {
  console.log("文件关闭了");
});
// 写入 123
ws.write("123");
// ✅end方法调用，写入操作完成结束，会把缓存区内容清空
ws.end();
// ✅end结束后写入，会报错
ws.write("456");
// error事件
ws.on("error", (err) => {
  console.log("出错了");
});
```

### write 执行流程

借助源码分析 write 的流程，更好的理解数据从上游生产者传递到消费者，整个过程是如何发生的。也会明白为什么限流和控制速度。

![nodejs11](/assets/images/nodejs11.png)

```js
// 可写流
const ws = fs.createWriteStream("./test.txt", {
  highWaterMark: 3,
});
// 写入1
let flag = ws.write("1");
console.log(flag);
// 写入2
flag = ws.write("2");
console.log(flag);
// 写入3
flag = ws.write("3");
console.log(flag);
// drain 事件触发
ws.on("drain", () => {
  console.log("4");
});
```

源码：

- 如果传 string 会转成 buffer
- writeOrBuffer 写或缓存操作
- 当前累计写入 length
- `stream._write() 》WriteStream.prototype._write()` 真正的写入操作
- `ret = state.length < state.highWaterMark` !ret 则 needDrain = true

### 控制写入速度

drain 与写入速度

```js
/**
 * 需求：'helloworld' 写入指定文件；通过 highWaterMark 控制可流量，
 * 01 一次性写入，如果要写入字符小于 highWaterMark，又因为第一次写入不会进入缓存，就可以次一次性写入。
 * 02 分批写入，一次write变成多次write✅，下面是分批写入示例
 */
const fs = require("fs");
const ws = fs.createWriteStream("./test.txt", {
  highWaterMark: 3,
});
// 字符数组
const source = "helloworld".split("");
const length = source.length;
let num = 0;
// 执行写
function executeWrite() {
  let flag = true;
  while (num !== length && flag) {
    flag = ws.write(source[num]);
    num++;
    console.log(num);
  }
}
// 首次执行
executeWrite();
// drain事件，喝光的意思，应该是该缓存又有空间了，可继续写入到缓存了✅
// 缓存被写满，与highWaterMark和 flag有关，flag为false说明被写满了✅
ws.on("drain", () => {
  console.log("drain 喝光了");
  executeWrite(); // 继续写入
});
// 打印：
// 1
// 2
// 3
// drain 喝光了
// 4
// 5
// 6
// drain 喝光了
// 7
// 8
// 9
// drain 喝光了
// 10
// ✅上面分批限流方式，是有助于理解限流和pipe方法实现原理，日常开发很少使用，一般用pipe方法
// pipe管道
```

### 背压机制

- ✅55-背压机制，这节课多看视频，口述了很多，解释下面图的原理
- 使用层面也就是 pipe 方法
- nodejs 的 stream 已实现了保证数据平滑流动的背压机制
- 数据读写过程，以及背压机制解决什么问题，pipe 内部实现原理大概情况
- 流操作可以把分段东西组合到一起最后使用。
- 流动模式和暂停模式，应该就是开关，不是程序上的一套设计模式。

```js
const rs = fs.createReadStream("./test.txt");
const ws = fs.createWriteStream("./test1.txt");
rs.on("data", () => {
  ws.write(chunk);
});
```

上面示例，数据读写可能存在的问题：
数据从磁盘读取的速度，远大于被写入的速度，消费者速度往往跟不上生产者速度，会出现产能过剩，writeable 里维护了缓存队列，当数据不能被及时消费时，会被缓存到队列里。队列大小有上线，读写过程中，如果没有实现背压机制，很有可能出现内存溢出、GC 频繁调用、其它进程变慢。基于这种场景，就需要有一种机制，可以让数据生产者和消费者之间平滑流动，这就是背压机制 ✅。

数据读操作：

1. 底层数据
2. 缓存空间，默认大小 16kb，在可读流里是 64kb
3. 消费者，主动调用 read 方法，或者监听 data 事件来消费数据 ✅
4. 两种工作模式：流动模式、暂停模式（默认）；
5. 流动模式是一直放水；过剩时可调用 pause 方法切换到暂停模式，放水暂时被关闭了；
6. 等到把缓存的水资源消费差不多后，会告送生产者可继续放水了；
7. 消费者该如何通知生产者继续放水呢

![nodejs12](/assets/images/nodejs12.png)

数据写操作：

1. 生产者数据
2. 可写流内部，同样有块内存空间用来缓存队列，同样有水位线 highWaterMark，如果上游数据超过了水位线，就无法消费缓存更多水资源了，
3. 此时 write()调用后会返回 false 给到上游生产者，生产者可暂停放水；
4. 等消费者，把缓存中数据消费差不多后，再触发 drain 事件，告诉上游生产者可以继续放水了；
5. 生产者，就可以调用 resume 方法，再次打开阀门继续放水了。
6. 如此往复就能保证数据的平滑流动，即不会出现内存溢出，也不会无水可用，这就是 pipe 方法内部实现原理。

![nodejs13](/assets/images/nodejs13.png)

```js
const fs = require("fs");
const rs = fs.createReadStream("./test.txt", {
  highWaterMark: 4, // 测试水量大点
});
const ws = fs.createWriteStream("./test1.txt", {
  highWaterMark: 1, // 测试水量小点
});
let flag = true;
// 流动模式消费数据
rs.on("data", (chunk) => {
  flag = ws.write(chunk, () => {
    console.log("写完了");
  });
  console.log(flag);
  if (!flag) {
    // 切换到暂停模式✅（暂停模式）
    rs.pause();
  }
});
// drain事件被触发，说明可写流缓存区又有空间了，可继续流动了
ws.on("drain", () => {
  // 可读流打开开关继续流动，切换到流动模式✅（流动模式）
  rs.resume();
});
// 上面示例就是背压机制的大概原理
// 也是pipe内部实现大概流程
// ✅更常见的是直接使用pipe方法，和上面的方式一样都能完成读写拷贝
// rs.pipe(ws);
```

### 模拟文件可读流

```js
const fs = require("fs");
const EventEmitter = require("events");
class MyFileReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || "r"; // 读
    this.mode = options.mode || 438; // 十进制
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.end = options.end; // 读取数据结束位置
    this.highWaterMark = options.highWaterMark || 64 * 1024; // 64kb
    this.readOffset = 0; // 偏移量
    this.fd = ""; // 文件id
    // 模拟new实例化时会调用open方法，触发open事件
    this.open();

    // ✅新增事件监听时被触发，可以是随意的事件名如abc
    this.on("newListener", (type) => {
      console.log("type:", type); // 一次打印：open error abc data
      if (type === "data") {
        // ✅这个很关键，能说明为什么挂载data事件能触发可读流
        this.read();
      }
    });
  }
  // 模拟open，触发open事件，返回文件fd
  open() {
    // 使用原生open方法打开指定位置的文件
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        this.emit("error", err);
      } else {
        this.fd = fd;
        this.emit("open", fd);
      }
    });
  }
  // read方法
  read() {
    if (typeof this.fd !== "number") {
      // ✅使用node开发常用发布订阅，解决获取异步获取fd的问题
      return this.once("open", this.read);
    }
    // 如果有fd，比如异步监听data时，也避免重复once
    // ✅buf是每次read申请内存空间大小
    let buf = Buffer.alloc(this.highWaterMark);

    // 兼容this.end
    let howMuchToRead;
    if (this.end) {
      howMuchToRead = Math.min(
        this.end + 1 - this.readOffset, // readOffsets和highWaterMark都是长度，this.end是位置，需要this.end+1变为长度
        this.highWaterMark
      );
      // 最后 howMuchToRead 会等于0，读取的readBytes也为0，就能end了
    } else {
      howMuchToRead = this.highWaterMark;
    }

    // type === "data"读取数据是流动模式
    fs.read(
      this.fd,
      buf, // 内存空间
      0, // 从buf哪个字节位置开始写
      howMuchToRead, // 一次读多少
      this.readOffset, // 从文件哪个字节位置开始读取
      (err, readBytes) => {
        // 如果有数据
        if (readBytes) {
          this.readOffset += readBytes; // readBytes 应该是字节数量
          // 模拟data事件
          this.emit("data", buf.slice(0, readBytes)); // 返回每次内存空间里readBytes长度字节，每次从0开始代表内存空间会使用完被清理
          // 流动模式需要一直读数据
          this.read();
        } else {
          // 直到没有数据
          // 模拟end事件
          this.emit("end");
          // 模拟close
          this.close();
        }
      }
    );
  }
  // close方法，模拟close事件
  close() {
    fs.close(this.fd, () => {
      this.emit("close");
    });
  }
  // 模拟pipe方法
  pipe(ws) {
    this.on("data", (data) => {
      // 写入
      let flag = ws.write(data);
      // 缓存区写满，暂停
      if (!flag) {
        this.pause();
      }
    });
    ws.on("drain", () => {
      // 触发drain继续读，然后触发上面的data事件
      this.resume();
    });
  }
}
const rs = new MyFileReadStream("./test.txt", {
  highWaterMark: 3,
  end: 7, // 读取结束位置 0 - 7 字节 共 8个 字节
});
rs.on("open", (fd) => {
  console.log("open", fd);
});
rs.on("error", (error) => {
  console.log("error", error);
});
rs.on("abc", () => {
  console.log("abc");
});
rs.on("data", (chunk) => {
  console.log("chunk:", chunk);
});
rs.on("end", () => {
  console.log("end");
});
rs.on("close", () => {
  console.log("close");
});
```

### 单向链表实现

```js
/**
 * 01 node + head + null
 * 02 head --> null
 * 03 size
 * 04 next element
 * 05 增加 删除 修改 查询 清空
 */
class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}
class LinkedList {
  constructor(head, size) {
    this.head = null;
    this.size = 0;
  }
  _getNode(index) {
    if (index < 0 || index >= this.size) {
      throw new Error("cross the border");
    }
    let currentNode = this.head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }
  add(index, element) {
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    if (index < 0 || index > this.size) {
      throw new Error("cross the border");
    }

    if (index === 0) {
      const head = this.head;
      this.head = new Node(element, head);
    } else {
      const preNode = this._getNode(index - 1);
      preNode.next = new Node(element, preNode.next);
    }
    this.size++;
  }
  remove(index) {
    let rmNode = null;
    if (index === 0) {
      rmNode = this.head;
      if (!rmNode) {
        return;
      }
      this.head = rmNode.next;
    } else {
      const prevNode = this._getNode(index - 1);
      rmNode = prevNode.next;
      prevNode.next = rmNode.next;
    }
    this.size--;
    return rmNode;
  }
  set(index, element) {
    const node = this._getNode(index);
    node.element = element;
  }
  get(index) {
    return this._getNode(index);
  }
  clear() {
    this.head = null;
    this.size = 0;
  }
}
// const l1 = new LinkedList();
// l1.add("node1");
// l1.add("node2");
// l1.add(1, "node3");
// l1.set(1, "node33");
// l1.remove(1);
// console.log("get:", l1.get(1));
// l1.clear();
// console.log(l1);
```

### 单向链表实现队列

```js
class Queue {
  constructor() {
    this.linkedList = new LinkedList();
  }
  enQueue(data) {
    this.linkedList.add(data);
  }
  deQueue() {
    return this.linkedList.remove(0);
  }
}
const q = new Queue();
q.enQueue("node1");
q.enQueue("node2");
let a = q.deQueue();
console.log("a1:", a);
a = q.deQueue();
console.log("a2:", a);
a = q.deQueue();
console.log("a3:", a);
// a1: Node { element: 'node1', next: Node { element: 'node2', next: null } }
// a2: Node { element: 'node2', next: null }
// a3: undefined
```

### 文件可写流实现

```js
const fs = require("fs");
const EventsEmitter = require("events");
const Queue = require("../utils/linkedList");

class MyWriteStream extends EventsEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || "w"; // 写
    this.mode = options.mode || 438; // 十进制
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.encoding = options.encoding || "utf8";
    this.highWaterMark = options.highWaterMark || 16 * 1024; // 16kb

    this.open();
    this.fd = undefined;
    this.writeOffset = this.start;
    this.writing = false;
    this.writeLen = 0; // 动态累计写入量，写入前++，写入后--
    this.needDrain = false; // 是否需要触发drain事件
    this.cache = new Queue(); // 缓存区
  }
  open() {
    // 原生 fs.open
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        this.emit("error", err);
      }
      // 正常打开
      this.fd = fd;
      this.emit("open", fd);
    });
  }
  // 模拟write 主流程
  write(chunk, encoding, cb) {
    // chunk只考虑string和buffer类型
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.writeLen += chunk.length;
    let flag = this.writeLen < this.highWaterMark; // 判断
    this.needDrain = !flag; // 是否需要drain
    if (this.writing) {
      // 放入缓存，进行排队
      this.cache.enQueue({ chunk, encoding, cb });
    } else {
      // 执行写入
      this.writing = true;
      this._write(chunk, encoding, () => {
        cb();
        // 清空排队内容
        this._clearBuffer();
      });
    }
    return flag; // 最后返回
  }
  // 写入方法
  _write(chunk, encoding, cb) {
    if (typeof this.fd !== "number") {
      return this.once("open", () => {
        return this._write(chunk, encoding, cb);
      });
    }
    fs.write(
      this.fd,
      chunk,
      this.start,
      chunk.length,
      this.writeOffset,
      (err, written) => {
        this.writeOffset += written; // 写入量
        this.writeLen -= written; //
        if (cb) cb();
      }
    );
  }
  // 清空缓存，递归
  _clearBuffer() {
    let data = this.cache.deQueue();
    if (data) {
      this._write(data.element.chunk, data.element.encoding, () => {
        if (data.element.cb) data.element.cb();
        this._clearBuffer(); // 确实是清空缓存
      });
    } else {
      // 缓存区清空后
      // 判断触发drain事件
      if (this.needDrain) {
        this.needDrain = false;
        this.emit("drain");
      }
    }
  }
}
const ws = new MyWriteStream("./test.txt", {
  highWaterMark: 1,
});
ws.on("open", (fd) => {
  console.log("open->fd:", fd);
});
ws.on("drain", (fd) => {
  console.log("drain");
});
ws.write("12", "utf8", () => {
  console.log("ok1");
});
ws.write("34", "utf8", () => {
  console.log("ok3");
});
```

### pipe 方法

**pipe 方法是文件读写操作的终极语法糖。日常开发文件拷贝操作使用 pipe 方法居多 ✅。**

- 底层基于流实现的。
- 使用场景也是文件读写操作。读写也是拷贝的操作。

```js
/**
 * rs 读取数据
 * pipe 管道
 * ws 写入数据
 * 模拟pipe实现在[模拟文件可读流]里
 */
const fs = require("fs");
const rs = fs.createReadStream("./test.txt", {
  highWaterMark: 4, // 默认64kb
});
const ws = fs.createWriteStream("./test1.txt", {
  highWaterMark: 1, // 默认16kb
});
rs.pipe(ws);
```

## 通信基本原理

通信必要条件

- 主机之间需要有传输介质
- 计算机世界里所有数据都会被转成二进制
- 网线作为传输介质是通过电信号源源不断的高低电压而不是 1010
- 就需要网卡进行调制和解调制，把高低电压转换成二进制过程就是调制过程
- 主机之间通信前需要协商网络速率

### 网络通信方式

通信是双向的，数据中会包裹 Mac 地址、ip 地址

### 网络层次模型

常用：http 是应用层协议；tcp、udp 是传输层协议；✅

OSI 七层模型：

- 应用层：用户与网络的接口
- 表示层：数据加密、转换、压缩
- 会话层：控制网络连接建立与终止
- 传输层：控制数据传输可靠性
- 网络层：确定目标网络
- 数据链路层：确定目标主机
- 物理层：各种物理设备和标准

TCP IP 模型：

- 前三层合并，统一叫做应用层
- 传输层
- 网络层，改名为主机层
- 数据链路层和物理层，合并为接入层

数据从 A 主机至 B 主机，先封装再解封

- 数据从 A 主机首先按着分层自上向下一层层进行数据封装
- 然后到 B 主机网卡协调之后，再按照自下向上顺序进行拆解，最后在应用层拿到 A 主机发送过来的数据

### 数据封装与解封装

（视频讲解不错 ✅）

TCP IP 五层划分模式

- 端口作用是在主机上确定唯一进程。
- 目标，指要访问的主机
- 源，指当前主机
- http 是应用层协议

|      层      |                                   向下数据层层包裹 |                                      说明 |
| :----------: | -------------------------------------------------: | ----------------------------------------: |
|   应用层 ↓   |                                               data |                            应用层产出数据 |
|   传输层 ↓   |                               目标端口 源端口 data |               常见 tcp udp 协议，基于端口 |
|   网络层 ↓   |                 目标-IP 源-IP 目标端口 源端口 data |           确定目标主机网络，和当前主机 IP |
| 数据链路层 ↓ | 目标-Mac 源-Mac 目标-IP 源-IP 目标端口 源端口 data | 通过 Mac 地址确定在该 IP 网络里的哪台主机 |
|   物理层 ↓   |                          1010101010101010101001010 |    以上层层包裹的数据转换成二进制进行传输 |

网线通过高低电压传输数据，在经过路由器的分配等，到达目标主机的网卡，首先进行数据解调，将电压变为二进制在向上传递给链路层：

|      层      |                                   向上数据层层解包 |                                             说明 |
| :----------: | -------------------------------------------------: | -----------------------------------------------: |
|   应用层 ↑   |                                               data |                                   最后解包的数据 |
|   传输层 ↑   |                               目标端口 源端口 data |               确定端口是否当前一致，拆包向上传递 |
|   网络层 ↑   |                 目标-IP 源-IP 目标端口 源端口 data |   确定目标主机 IP，是否当前主机 IP，拆包向上传递 |
| 数据链路层 ↑ | 目标-Mac 源-Mac 目标-IP 源-IP 目标端口 源端口 data | 目标 Mac 地址是否当前主机 Mac 地址，拆包向上传递 |
|   物理层 ↑   |                          1010101010101010101001010 |       进行数据解调将电压变为二进制，拆包向上传递 |

### TCP 三次握手与四次挥手

（视频讲解不错 ✅）

TCP 协议:

- TCP 属于传输层协议
- TCP 是面向连接的协议
- TCP 用于处理实时通信

完整 TCP 报文信息：
![nodejs14](/assets/images/nodejs14.png)

常见控制字段：

- SYN = 1 表示请求建立连接
- FIN = 1 表示请求断开连接
- ACK = 1 表示数据信息确认

cs 网络架构为例：建立连接

- 任何一次完整请求都是有来有回
- 客户端向服务端发送信息的通道，双向请求，客户端 SYN = 1，服务端 ACK = 1
- 服务端向客户端发送信息通道，双向请求，服务端 SYN = 1，客户端 ACK = 1
- 这四次连接发生后，就有了客户端和服务端进行数据通信的双向通道。
- 这里看着是四次握手，其实是服务端在回复 ACK = 1 时，同时发送了 SYN = 1，这两次握手合并，也就三次握手了。

![nodejs15](/assets/images/nodejs15.png)

断开连接请求：四次挥手

- 一个服务端会服务于多个客户端
- 客户端 FIN = 1，服务端 ACK = 1
- 服务端 FIN = 1，客户端 ACK = 1

TCP 协议：

- TCP 处于传输层，基于端口，面向连接
- 主机之间要想通信需要先建立双向数据通道
- TCP 的握手和挥手本质上都是四次

### 创建 TCP 通信

Net 模块实现了底层通信接口，能直接创建基于流操作的 tcp 或 ipc

Net 模块-通信过程：

- 创建服务端：接收和回写客户端数据
- 创建客户端：发送和接收服务端数据
- 数据传输：内置服务事件和方法读写数据

Net 模块-通信事件：

- listening 事件：调用 sever.listen 方法之后触发
- connection 事件：新的连接建立时触发
- close 事件：当 server 关闭时触发
- error 事件：当错误出现的时候触发

Net 模块-通信事件&方法：

- data 事件：当接收到数据时触发该事件
- write 方法：在 socket 上发送数据，默认是 UTF8
- end 操作：当 socket 的一端发送 FIN 包时触发，结束可读端

Net 模块创建基于流的 TCP 通信：（这块没用教程的）

```js
// cd到npm目录执行：npm run server
// server.js
// 1.通过域名找到该主机 2.应用进程在该机器占用的端口
const net = require("net");
// 创建一个 TCP 服务器
const server = net.createServer((socket) => {
  console.log("客户端已连接");
  // 监听数据事件
  // socket 是双工流 可写可读
  socket.on("data", (data) => {
    // 收到客户端的数据: hello net粘包测试1粘包测试2粘包测试3
    console.log("收到客户端的数据:", data.toString());
    // 回复数据给客户端
    socket.write("服务器已收到:" + data);
  });
  // 监听客户端断开连接
  socket.on("end", () => {
    console.log("客户端已断开连接");
  });
});
// 监听端口
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`服务器正在监听端口: ${PORT}`);
});

// client.js
const net = require("net");
// 待发送数据
const dataArr = ["粘包测试1", "粘包测试2", "粘包测试3", "粘包测试4"];
// 连接到服务器
const client = net.createConnection({ port: 8080 }, () => {
  console.log("已连接到服务器");
  // 向服务器发送数据
  // client 是双工流 可写可读
  client.write("Hello Net");
  // client.write("粘包测试1");
  // client.write("粘包测试2");
  // client.write("粘包测试3");
  // 收到服务器的回复::  服务器已收到:hello net粘包测试1粘包测试2粘包测试3

  // 发送数据加时间间隔, 演示解决粘包问题
  for (let i = 0; i < dataArr.length; i++) {
    (function (val, index) {
      setTimeout(() => {
        client.write(val);
      }, 1000 * (index + 1));
    })(dataArr[i], i);
  }
  // 收到服务器的回复::  服务器已收到:Hello Net
  // 收到服务器的回复::  服务器已收到:粘包测试1
  // 收到服务器的回复::  服务器已收到:粘包测试2
  // 收到服务器的回复::  服务器已收到:粘包测试3
  // 收到服务器的回复::  服务器已收到:粘包测试4
});
// 监听数据事件
client.on("data", (data) => {
  console.log("收到服务器的回复:: ", data.toString());
  // 断开连接
  // client.end();
});
// 监听结束事件
client.on("end", () => {
  console.log("已从服务器断开连接");
});
```

### TCP 粘包及解决

- 数据通信包含数据发送端和接收端
- 发送端累积数据统一发送
- 接收端缓冲数据之后再消费
- 可减少 IO 操作带来的性能消耗
- 但数据使用会产生粘包的问题
- 数据时被放到缓存中，什么时候才会发送呢
- TCP 拥塞机制决定发送时机

粘包现象和演示解决：通过加长发送数据时间间隔，但降低了数据传输效，实际开发不会这样处理，只做演示。（看 👆🏻 代码）

### 封包拆包实现

数据的封包与拆包：按照规则先打包，收到数据按规则拆包使用。

一条完整消息：

- 消息头（header）：序列号、消息长度
- 消息体（body）：消息体

数据传输过程：

- 进行数据编码，获取二进制数据包
- 按规则拆解数据，获取指定长度的数据

Buffer 数据读写

- writeInt16BE: 将 value 从指定位置写入
- readInt16BE: 从指定位置开始读取数据

```js
class MyTransformCode {
  constructor() {
    this.packageHeaderLen = 4; // 包header长度是4个字节
    this.serialNum = 0; // 包header序列号
    this.serialLen = 2; // 包序列号长度
  }
  // 编码
  encode(data, serialNum) {
    // data转二进制，后续操作都是二进制
    const body = Buffer.from(data);
    // 01 header组装, 按指定长度申请内存空间，作为header使用
    const headerBuf = Buffer.alloc(this.packageHeaderLen);
    // 02 header组装，写入序号，写的规则也是Int16BE
    headerBuf.writeInt16BE(serialNum || this.serialNum);
    // 03 header组装，写入体长度，第二个参数是offset
    headerBuf.writeInt16BE(body.length, this.serialLen);
    // 自增序列号
    if (serialNum === undefined) {
      this.serialNum++;
    }
    // 03 返回组装好的header和body
    return Buffer.concat([headerBuf, body]);
  }
  // 解码
  decode(buffer) {
    const headerBuf = buffer.slice(0, this.packageHeaderLen);
    const bodyBuf = buffer.slice(this.packageHeaderLen);
    // 读取并返回使用，读的规则也是Int16BE
    return {
      serialNum: headerBuf.readInt16BE(), // 序号
      bodyLength: headerBuf.readInt16BE(this.serialLen), // 体长度，参数是offset
      body: bodyBuf.toString(), // 体数据
    };
  }
  // 获取包长度，判断包是否还剩数据
  getPackageLen(buffer) {
    if (buffer.length < this.packageHeaderLen) {
      return 0;
    } else {
      return this.packageHeaderLen + buffer.readInt16BE(this.serialLen);
    }
  }
}

// 测试
// const ts = new MyTransformCode();
// const str1 = "封包解包";
// console.log(Buffer.from(str1));
// console.log(ts.encode(str1, 1));
// 体
// <Buffer e5 b0 81 e5 8c 85 e8 a7 a3 e5 8c 85>
// 前2是序号，前2-4是体长度，后面是体
// <Buffer 00 01 00 0c e5 b0 81 e5 8c 85 e8 a7 a3 e5 8c 85>
// const encodeBuf = ts.encode(str1, 1);
// console.log(ts.decode(encodeBuf));
// console.log(ts.getPackageLen(encodeBuf));
// { serialNum: 1, bodyLength: 12, body: '封包解包' }
// 总长度：16
module.exports = MyTransformCode;
```

### 封包解决粘包

通过封包拆包来解决 TCP 粘包问题（代码解决的过程不是很理解）

```js
// server.js
const net = require("net");
const MyTransform = require("./myTransform.js");
let overageBuffer = null; // 剩余未处理完的
const ts = new MyTransform();
const server = net.createServer((socket) => {
  console.log("客户端已连接");
  socket.on("data", (chunk) => {
    if (overageBuffer) {
      chunk = Buffer.concat([overageBuffer, chunk]);
    }
    let packageLen = 0; // 包长度
    while ((packageLen = ts.getPackageLen(chunk))) {
      console.log(1, packageLen);
      const packageCon = chunk.slice(0, packageLen); // 包所有数据
      chunk = chunk.slice(packageLen); // 更新chunk？不是很理解，不是已经拿了所有数据吗
      const ret = ts.decode(packageCon); // 解包数据
      console.log(4, ret);
      // 回写数据
      socket.write(ts.encode(ret.body, ret.serialNum));
    }
    // 剩余chunk
    console.log(5, chunk);
    overageBuffer = chunk;
  });
  socket.on("end", () => {
    console.log("客户端已断开连接");
  });
});
// 监听端口
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`服务器正在监听端口: ${PORT}`);
});

// client.js
const net = require("net");
const MyTransform = require("./myTransform.js");
let overageBuffer = null; // 剩余未处理完的
const ts = new MyTransform();
const client = net.createConnection({ port: 8080 }, () => {
  console.log("已连接到服务器");
  client.write(ts.encode("封包解包测试1"));
  client.write(ts.encode("封包解包测试2"));
  client.write(ts.encode("封包解包测试3"));
  client.write(ts.encode("封包解包测试4"));
  client.write(ts.encode("封包解包测试5"));
});
// 监听数据事件
client.on("data", (chunk) => {
  if (overageBuffer) {
    chunk = Buffer.concat([overageBuffer, chunk]);
  }
  let packageLen = 0; // 包长度
  while ((packageLen = ts.getPackageLen(chunk))) {
    const packageCon = chunk.slice(0, packageLen); // 包所有数据
    chunk = chunk.slice(packageLen); // 更新chunk？不是很理解，不是已经拿了所有数据吗
    const ret = ts.decode(packageCon); // 解包数据
    console.log("收到服务器的回复:: ", ret);
  }
  overageBuffer = chunk;
});
// 监听结束事件
client.on("end", () => {
  console.log("已从服务器断开连接");
});
```

## http 协议

浏览器充当客户端，在 tcp 基础之上浏览器就会基于 http 协议，给服务端发送数据

### 获取 http 请求 响应

- 重点是 req 是可读流程，res 是可写流，所以会继承读写流程的操作 ✅
- http 数据读写也是基于流的操作。✅
- 传输数据示例中只能是 string 和 buffer

```js
// server.js
const http = require("http");
const url = require("url");
const server = http.createServer((req, res) => {
  console.log(`客户端请求中...`);
  // req 可读流
  const { pathname, query } = url.parse(req.url, true);
  console.log(pathname, query); // 请求路径
  console.log(req.method);
  console.log(req.httpVersion); // http版本
  console.log(req.headers);
  // 请求体数据
  const arrData = [];
  req.on("data", (data) => {
    arrData.push(data);
  });
  req.on("end", () => {
    const objStr = Buffer.concat(arrData).toString();
    console.log();
    if (req.headers["content-type"] === "application/json") {
      const obj = JSON.parse(objStr);
      obj.add = "--添加测试";
      res.end(JSON.stringify(obj));
    } else {
      res.end(Buffer.concat(arrData).toString());
    }
  });
  // res 可写流
  // res.write('ok')
  // res.end() // 需要end✅
  // 或end
  // res.setHeader("Content-Type", "text/html;charset=utf8");
  // res.statusCode = 302;
  // res.end("get请求");
});
// 监听端口
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`服务器正在监听端口: ${PORT}`);
});

// client
const http = require("http");
const options = {
  host: "localhost",
  port: 8080,
  path: "/?a=1", // 需要有/
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
};
const req = http.request(options, (res) => {
  // 读取返回结果
  const arrData = [];
  res.on("data", (data) => {
    arrData.push(data);
  });
  res.on("end", () => {
    console.log(Buffer.concat(arrData).toString());
  });
});
req.end('{ "bbb": "你好" }');
```
