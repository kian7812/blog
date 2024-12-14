# 热更新

## 说一下 Webpack 的热更新原理吧
(敲黑板，这道题必考)

Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该chunk的增量更新。

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 HotModulePlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR。
细节请参考Webpack HMR 原理解析

## HMR（热更新）的原理

https://juejin.cn/post/7138203576098095112

这个可以说是webpack的最高频考点之一了，同时也是webpack的难点，也是webpack的核心功能之一！接下来我将带大家先学习如何使用HMR再逐步分析HMR的原理。

如何开启HMR：通过设置devServer: {hot: true} 开启 开启后便可以在发生改变后局部刷新改变的部分

原理：

- 使用 webpack-dev-server（WDS） 托管静态资源 同时以Runtime方式注入HMR客户端代码
- 浏览器加载页面后 与WDS建立WebSocket连接
- webpack监听到文件变化后 增量构建发生变更的模块 并通过WebSocket发送hash事件
- 浏览器接收到 hash事件后 请求 manifest资源文件 确认增量变更范围
- 浏览器加载发生变更的增量模块
- webpack运行时触发变更模块的module.hot.accept回调 执行代码变更逻辑
- done：构建完成，更新变化

总结就是webpack将静态资源托管在 WDS 上，而 WDS 又和浏览器通过 webSocket 建立联系，而当webpack监听到文件变化时，就会向浏览器推送更新并携带新的hash 与之前的hash进行对比，浏览器接收到hash事件后变化加载变更的增量模块并触发变更模块的 module.hot.accept回调执行变更逻辑。

![3](/assets/images/webpack3.webp)

（图片来自与范文杰大佬的Webpack 原理系列十：HMR 原理全解析 - 掘金 (juejin.cn)，这篇写的很不错，对HMR感兴趣的小伙伴推荐阅读）

## webpack的热更新是如何做到的？说明其原理？

https://github.com/tgoufe/Interview/blob/master/webpack%E9%9D%A2%E8%AF%95%E9%A2%98.md

原理： webpack运行机制图

首先要知道server端和client端都做了处理工作

1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。

2. 第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。

3. 第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。

4. 第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。

5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。

6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。

7. 而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。

8. 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。
