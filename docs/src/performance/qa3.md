# QA3

```
-待收-不错-Vue 项目性能优化 — 实践指南（网上最全 / 详细） https://juejin.cn/post/6844903913410314247
-待收-不错-Vue性能提升之Object.freeze() https://juejin.cn/post/6844903922469961741
-待收-不错-Vue 应用性能优化指南 https://juejin.cn/post/6844903677262561293
-待收-不错-7个有用的Vue开发技巧 https://juejin.cn/post/6859538537830858759
总结我对Vue项目上线做的一些基本优化：https://juejin.im/post/5f0f1a045188252e415f642c

VUE中的Object.freeze https://blog.csdn.net/weixin_46382167/article/details/108970255

下面的优化 和 webpack 相关优化放在一起，因为一般面试官问的时候，只问一次优化相关的
~ Vue组件开发时性能优化手段（不错）
常用的性能优化手段有(仅适用于 2.x版本)：
1. 使用 key 提高组件复用率（场景：v-if、v-for）
2. （合理拆分组件，减少不必要的重新渲染）正确处理组件 render 函数复杂度，因为 render 依赖的响应属性越多，越容易造成重新渲染，必要时可拆分子组件将复杂度分发到更细粒度上进行管理（这个也是我想突出表达的）
3. 通常地，可以在 created 回调中执行异步数据处理，以尽快启动异步任务（减少白屏时间、同时兼任ssr）
4. 必要时可以使用 inject/provide 替代 props 实现父子间传值，因为 props 会对属性再进行一次响应式封装，而 inject/provide 接口只是简单地传值
5. 对于大数据场景，可以使用 Object.freeze 接口禁止属性变更，避免过度频繁的渲染
6. 使用 keep-alive 缓存组件实例
7. 使用 functional 降低单个组件生命流程与状态管理的复杂度

补充1：整体思路为，
减少重复渲染（拆分组件）；
减少（data、props）响应式观测（this私有属性、inject/provide）

你都做过哪些Vue的性能优化？
* 编码阶段
     * 使用路由懒加载、异步组件
     * 按需导入第三方模块
    * 图片懒加载
    -* 长列表滚动到可视区域动态加载
    * 防抖、节流
    * 合理拆分组件( 提高复用性、增加代码的可维护性,减少不必要的渲染性能 )
    * 尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher

    * v-if和v-for不能连用
    * v-if 当值为false时内部指令不会执行,具有阻断功能，很多情况下使用v-if替代v-show
    * 在更多的情况下，使用v-if替代v-show
    * key保证唯一
    * 如果需要使用v-for给每项元素绑定事件时使用事件代理

    * Object.freeze 冻结数据
    * SPA 页面采用keep-alive缓存组件
* SEO优化
    * 预渲染 插件 prerender-spa-plugin
    * 服务端渲染SSR
* 打包优化
    * 压缩代码
    * Tree Shaking/Scope Hoisting
    * 使用cdn加载第三方模块
    * 多线程打包happypack
    * splitChunks抽离公共文件
    * sourceMap优化
* 用户体验
    * 骨架屏
    * PWA
    * 还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。


你有对 Vue 项目进行哪些优化？
（1）代码层面的优化
* v-if 和 v-show 区分使用场景
* computed 和 watch 区分使用场景
* v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
* 长列表性能优化
* 事件的销毁
* 图片资源懒加载
* 路由懒加载
* 第三方插件的按需引入
* 优化无限列表性能
* 服务端渲染 SSR or 预渲染

（2）Webpack 层面的优化
* Webpack 对图片进行压缩
* Tree Shaking
* 通用第三方组件（externals引入或splitChunk到独立bundle中）
* 提取组件的 CSS
* 优化 SourceMap
* 构建结果输出分析
* Vue 项目的编译优化

-* 提取公共代码
-* 减少 ES6 转为 ES5 的冗余代码
-* 模板预编译

（3）基础的 Web 技术的优化
* 开启 gzip 压缩
* 浏览器缓存
* CDN 加速静态资源 的使用
* 使用 Chrome Performance 查找性能瓶颈

聊聊前端开发中的长列表：https://zhuanlan.zhihu.com/p/26022258 （不错）
长列表优化
方案1：懒渲染
懒渲染就是大家平常说的无限滚动，指的就是在滚动到页面底部的时候，再去加载剩余的数据。
后端数据分页。

方案2：可视区域渲染（复杂多了）
虚拟列表方案貌似在国内社区上很少提及，前段时间刚好写了个类似的 Vue 组件：https://github.com/tangbc/vue-virtual-scroll-list
是的，主要原因是移动端体验优化比较困难，很难成为标准的解决方案。



```