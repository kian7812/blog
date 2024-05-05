# Core Web Vitals



## First Contentful Paint (FCP) 

https://web.dev/articles/fcp?hl=zh-cn

翻译为：首次内容绘制

- 它标记了网页加载时间轴中用户可以看到屏幕上*任何内容的第一个点*（时间轴第一个点）。快速的 FCP 有助于让用户确信正在发生的事情。
- FCP 衡量的是从用户首次导航到相应网页到该网页的*任何部分呈现在屏幕上所用的时间*。对于此指标，“内容”是指文本、图片（包括背景图片）、`<svg>` 元素或非白色 `<canvas>` 元素。

FCP 重要的原因：从进入网页加载资源，到开始渲染并显示第一个元素内容的。**察的是如首屏资源加载的时间**。

FCP 包括从上一个网页开始的所有卸载时间、连接设置时间、重定向时间以及首字节时间 (TTFB)

文章中【如何提高 FCP】，列举很多方式，主要是减少资源大小、提高请求速度等。

![vitals-lcp-fcp](/assets/images/vitals-lcp-fcp.png)

## Largest Contentful Paint (LCP) 

https://web.dev/articles/lcp?hl=zh-cn

翻译为：首屏渲染时间

**LCP 报告的是视口中可见最大图片或文本块的呈现时间（相对于用户首次导航到相应网页的时间）。**

- FCP 衡量的是任何内容何时绘制到屏幕上，而 LCP 测量何时绘制主要内容（视口中内容）。

FCP重要的原因：考察的时候首屏，渲染的速度。

- 需要考虑哪些元素？
- 如何确定元素的大小？
- 如何处理元素布局和尺寸更改？示例有图很好的说明
- 优化 LCP 的完整指南

## Cumulative Layout Shift (CLS) 

翻译：累计布局偏移

CLS 衡量的是网页生命周期内发生的每次意外布局偏移的最大布局偏移得分。

- 文章中有很多图示对比解释，很棒
- 还有如何优化

## Interaction to Next Paint (INP) 

https://web.dev/articles/inp?hl=zh-cn

INP 会在网页生命周期内观察用户与网页进行的所有点击、点按和键盘互动的延迟时间，并报告最长持续时间，并忽略离群值。INP 较低意味着网页始终能够快速响应大多数用户互动。

### 优化耗时较长的任务

好有长任务优化内容：https://web.dev/articles/optimize-long-tasks?hl=zh-cn
长任务指的是：https://web.dev/articles/custom-metrics?hl=zh-cn#long-tasks-api

## 加载第一个字节所需时间 (TTFB) 

https://web.dev/articles/ttfb?hl=zh-cn

翻译：网页服务器响应时间

首字节时间 (TTFB) 是一项基本指标，用于在实验室和现场衡量连接设置时间和网络服务器响应能力。它测量的是从请求资源到响应的第一个字节开始到达所经过的时间。这有助于识别 Web 服务器何时因速度过慢而无法响应请求。

TTFB 是以下请求阶段的总和：
重定向时间、
Service Worker 启动时间（如果适用）、
DNS 查找、
连接和 TLS 协商、
请求，直到响应的第一个字节到达，
缩短连接设置时间和后端的延迟时间有助于降低 TTFB。

由于 TTFB 发生在以用户为中心的指标（例如首次内容绘制 (FCP) 和 Largest Contentful Paint (LCP)）之前，因此我们建议您的服务器足够快速地响应导航请求。

## Total Blocking Time (TBT) 

总阻塞时间 (TBT)

*它会测量首次内容绘制 (FCP) 之后的总时间，在该时间内，主线程处于阻塞状态的时间足够长*，足以阻止对用户输入做出响应。较低的 TBT 有助于确保网页易于浏览。（开始时FCP之后，结束应该是整个页面渲染完吧）

- 改进 TBT