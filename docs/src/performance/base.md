# 性能优化

- 按需加载、拆包、treeshaking、减小包大小、http2
- 利用换缓存
- cdn
- 长任务

指标：FCP、

## 小技巧

当我们生成性能报告的时候，我们可以先选择主线程上的某个Task，此时会有个红色的框框选中，表明属于选中的状态。然后通过键盘的w, s, a, d按键来控制主线程上任务的放大和缩小区域 
关于Chrome Devtools的其他

可以直接去阅读一下Chome Devtools的官方文档，可以学习到不少技巧，帮助大家更好的分析性能。链接位于参考文章处

## Synchronous layout

https://developer.chrome.com/docs/devtools/performance/
下面的例子是来自Analyze runtime performance文章的demo的，主要是想给大家展示一下强制同步布局对页面性能的影响

通过Performance工具，我们可以知道，高CPU运算都是因为Script和Layout导致的。黄色代表Script的运行，紫色代表Layout的运行
这些计算都是因为app.update函数中某段逻辑导致的
这个是因为在执行Script逻辑的时候，读取了offsetTop的位置，导致主线程需要重新走渲染流程，同步的获取完布局后的信息。最终导致渲染丢帧，影响用户体验
接着看看要怎么解决这个问题

https://web.dev/articles/optimize-long-tasks?utm_source=devtools&hl=zh-cn
https://developer.chrome.com/docs/devtools/performance/reference/#record
https://developer.chrome.com/docs/devtools/performance/


## 首屏性能分析及优化

1. 异步具名加载

通过import函数加载的资源，可以异步加载。但是在webpack中，如果按照常规写法，在打包的时候会导致[name]为id名，而不是具体的文件名。下面是分享弹窗中动态加载的某个JS。这种会导致我们无法分析具体加载的JS是从哪里来的。所以异步加载的时候需要特定处理一下。

修改方式

首先，通过Network面板找到对应的[id].js的文件，通过文件内容，定位到具体的代码在哪里。
然后在需要异步加载的地方，需要加上/* webpackChunkName: 'fileName' */

2. 按需加载
实现具名异步加载后，我们还需要让其按需加载。在需要的时候（如点击行为，滚动行为等）在加载对应资源。目的是加快首屏渲染。

验证后发现，大部分不需要的内容都在移动端加载了。虽然在代码层面做了import函数的异步加载（chunk），但是由于没有在DOM层面作处理（使用了v-show），导致仍然加载了多余内容。所以我们需要异步 + 按需加载组件。

以下某公共组件改动可以至少减少首屏请求。如下，大部分的改动基于
- 使用v-if而不是v-show
- 使用import函数而不是import导入

3. nuxt CSS配置
nuxt的css配置是给全局使用的，即以下引入的内容会在所有页面都生效

4. 样式文件放在head头部，JS文件放在底部

5. 处理Long Task

6. 静态资源统一CDN路径

- 好处，就近访问原则：权威域名服务器通过CNAME的方式，返回就近的IP地址，提高访问效率。
我们可以将以下目录中的静态资源，都放到static/baseasset 目录下处理，统一CDN资源路径。（通过cloudflare做了CDN代理）。
- 如何处理，据我了解，目前使用nuxt打包后的资源，都会通过cloudflare代理后走CDN访问。但是我们需要统一一下资源的目录。所以选择将所有资源（static目录下、utils目录下、assets目录下）的JS、CSS、文件等内容都挪动到static/baseasset目录下。

7. 弹窗CPU、内存激增
问题：
- 在线上环境下，CPU、内存正常，但是会下载非常多的字体文件，影响用户体验。
- 在本地环境下，CPU、内存激增，同时会下载非常多的字体文件，影响本地调试。
（猜

处理：
- 修改dom-to-image的源码，不去下载字体文件。

embedFonts(node) {return node}

继续定位发现，这个dom-to-image的作用就是将html转换为image之类的海报，可提供给用户保存图片后分享。
问题的根本是在于这个库内部，在生成海报的过程中，会疯狂的去下载当前的所有字体。海报处理好了，弹窗会有个闪动（因为这时候插入了img标签）。

(通过 performmance 是否 也能定位 问题呢，比如dom-to-image 图片合成)

```
性能规范设计
全屏 loading  不使用
图片格式  png 、jpg / jpeg、svg、webp
图片大小 优先保证UI精度，必须经过 UI 验收，高倍图<400kb、低倍图<200kb、手机端<100kb
懒加载
容器 父元素不可隐藏，并显示设置 width、height
图片 显示设置 width、height
懒加载容器使用局部 loading 可选
接口 SSR 规范 使用时必须是后端提供的 接口
首屏渲染（第一屏） 不使用 loading、骨架屏等懒加载方式
动态文本数据 使用占位符或 SSR，不得使用懒加载
图片 使用响应式图片，必要时使用 preload
video 使用懒加载
视窗外渲染（第N屏）
图片 loading="lazy"
video 使用懒加载
动态文本数据 根据 SEO 要求选择懒加载或 SSR
字体 统一使用 UI 规范的
老路由处理 项目迁移 主要由 301/302 跳转，可以JS 兜底
第三方库 非必要禁止全局加载
前端组件 使用时需要在文件内 import
后端接口 同一页面和同一时间节点不得重复调用
动态加载文件 路径不使用变量， 如 import() require()
```

## 多语言文件异步加载优化

- 背景：
  - 项目站的多语言文件全部打包在 main.js 内，体积庞大造成首屏加载速度慢。
- 目标：
  - 多语言文件按语言进行拆分，每个语言一个文件。除 en 外的其他语言异步加载，从而加速首屏渲染时间FCP。
- 关键技术细节
  - 使用 webpack  异步加载 import() 功能 `import('./locale/es.json').then(json => doSomeThing(json))`


## webpack5 解决方案

提升web core指标、用户体验：
1. mainjs中有过多的语言包，可以全部移出mainjs，采用按需异步加载使用，首屏JS直接减少2.8MB。
2. 所有路由以及较大的组件采用懒加载的方式，配合骨架屏幕或Loading，空闲时/鼠标滑入 预加载减少loading时间。
3. react、react-dom、recoil等核心库采用externals后使用公司通用CDN去引入，可以减少bundle体积200KB+-。
4. 三方打点等SDK采用空闲时加载执行，提升FID指标。
5. node_modules使用splitchunks分成多个js利用现有的http2特性，目前可以将每个JS体积控制在100KB-。
6. 较大的资源采用service worker缓存。
7. webpack编译时直接产出br压缩文件。

提升各个环境中的编译速度、开发体验
1. 使用webpack5 filesystem缓存（时间减少到原来的30%+-）
2. 使用thread-loader+swc编译tsx（减少约10+-）
3. 开发环境 添加打包进度条、友好的成功提示（显示域名可直接点开）


静态资源开启强缓存和 gzip/br 压缩 https://juejin.cn/post/6926443456084574215


为了提升用户体验、页面性能指标、seo排名，出于这几点考虑，我们选择了做ssr。
ssr的好处：
* 网络链路
    * 省去了客户端二次请求数据的网络传输开销
    * 服务端的网络环境要优于客户端，内部服务器之间通信路径也更短
* 内容呈现
    * 首屏加载时间（FCP）更快
    * 浏览器内容解析优化机制能够发挥作用
* 爬虫程序可以爬取页面完整的内容
       CSR 的 HTML 大多是个空壳儿【主站是个loading】,客户端拿到这种 HTML 只能立即渲染出一页空白，二次请求的数据回来之后才能呈现出有意义的内容，而 SSR 返回的 HTML 是有内容（数据）的，客户端能够立刻渲染出有意义的首屏内容（First Contentful Paint）。同时，静态的 HTML 文档让流式文档解析（streaming document parsing）等浏览器优化机制也能发挥其作用。
       从seo来讲，爬虫可以爬取完整的内容。像detail/id 这样的动态路由，每页的内容都是不重复的，更有利于搜索引擎收录。