# Guide

## 导航 1

:::info

- 计算时间：一个任务时间过长（长任务）（时间复杂）
- 内存空间：就是占用内存空间。（空间复杂）
- 通过切入点：
  - **通过切入点操作卡顿（也是长任务）**=》performance 排查；（看了月影的都是通过卡顿和 longtask 切入的）
  - 切点 lighthouse=》performance 排查；
  - 产生的 longtask 场景很多：dom 计算、回流、单纯的 js 大量数据计算；vue-react 的 re-render、patch 等等。
- 服务端渲染还是客户端渲染：参考 pagespeed 就行了。不一定复杂大组件运算比较高的也在服务端渲染。
  - 服务端渲染，如果渲染页面，如果时间很长，也是一个意思
- 如果是资源下载任务，是否可以拆解包；如果是计算运行是否可以分拆到下一个任务中。这是简单的思路，看看月影那几篇文章就长见识了。😄
  :::

### 【Nextjs 页面性能优化】（想 get 但没插件包优先级高）

- （目录：browser 性能优化、browserChrome 导航）
- \*Next.js 优化打包体积减少 69% https://juejin.cn/post/7347983259584282675
- 性能优化——把重排、重绘、合成掰开了、揉碎了学 https://weijunext.com/article/f30c20a3-f8b0-41bf-8be6-25ebcfebde80
- \*https://hutaod.github.io/blog/web-performance-understand
- https://hutaod.github.io/blog/web-performance-practice

### 【dev_zuo vue3 table 性能优化，减少 85% 渲染耗时】

- 有文章、视频、githubdemo（自己重做一遍学习）
- 非常好，虽然表达上描述，感觉不合理或者不好理解点在哪里，但整体还是很到位。

https://juejin.cn/post/7194516447932973112

https://www.bilibili.com/video/BV1tR4y1872M/

### 月影 2022（好牛 b 啊，下面这几篇文章直接 copy 一份备份啊，思想和排查过程值得学习）

【通过 Chrome-DevTools 看 js 的事件循环】 https://juejin.cn/post/7131259803589935112 （可理解如何用 Performance 观察任务执行，js 执行、dom 渲染等）

【性能优化之 longtask 治理(实际项目)】https://juejin.cn/post/7240297635428565050

【性能优化之 Recalculate Style 耗时过长】https://juejin.cn/post/7252255706934083621（回流）

- 最近公司项目`longtask`卡顿治理中，大部分卡点都在 Recalculate Style 耗时过长，经常各种 500ms 以上的 longtask，甚至各种 1s 以上的 longtask。
  总结：

1. 我们的项目在回流时候，并不像各种八股文里提到的 layout 耗时长，而是 Recalculate Style 耗时长，感觉主要原因还是 css 规则太多了，几万条 css 规则，一旦需要回流的元素比较多，那么重新匹配就是 M*N 的关系，回流元素数*css 规则数，所以还是要尽量减少 css 规则数，尤其这种微应用+各种内部 npm 包+模块联邦的项目。
2. css 规则尽量要简单，匹配路径要尽量短，尽量减少使用兄弟选择器、not()、nth-child()这类的复杂选择器，这种选择如果 blink 引擎在构建失效集时做的优化并不彻底或者未做优化，会导致大量节点的回流。

【性能优化：树形组件 tree 一次针对大量数据的优化】https://juejin.cn/post/7301907369906880549

- 有一天体验公司项目，录制 performance 时候，发现一段预期之外`longtask`，是一个筛选项，使用 ui 库的 treeSelect 组件渲染的(大体样式如下面截图)，点这个筛选项在其进行渲染时有一段比较夸张的 longtask，耗时高达 600ms 左右。

二：问题解决
此段 lontask 的由来主要是三个原因：

- 是一个大对象
- 这个大对象经过 mobx 包装，给对象递归的加了层层代理 proxy。取值时候自然多一层。
- ui 库的 treeSelect 组件里在进行 treeData 的 isEqual 比较时候，三次调用。

针对以上问题，解决办法也比较简单了：

- 将此筛选项的大对象，设置为不可观察，去掉 proxy。
- 组件库对 treeSelect 组件进行修复，将三次 isEqual 的调用改为一次调用即可。

### 那个分享弹窗应该也是 longtask

## 鹏周老师也很好

前端性能优化概览
还是看鹏周老师 https://www.bilibili.com/video/BV1KR4y1L7TK
小满的 http1-http2 &浏览器缓存（通俗易懂）https://xiaoman.blog.csdn.net/article/details/125568128

## 导航 2

https://juejin.cn/post/7197025946918502456

cmd + shift + p => fps

Performance 对象https://www.bilibili.com/video/BV1wP4y187fJ

https://www.bilibili.com/video/BV1Pr4y1N7QZ

前端页面性能测试工具 lighthouse
https://www.bilibili.com/video/BV1bm4y1S7MX（一般只是介绍了概念，没有调试。1.9*）

李鹏周 13.使用浏览器 DevTools 分析性能-Performance 面板 https://www.bilibili.com/video/BV1C8411V7y2

pagespeed 教程
https://www.youtube.com/watch?v=PU10N-uTFmg
