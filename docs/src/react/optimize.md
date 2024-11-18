# 优化


## react性能优化手段

shouldComponentUpdate
memo
getDerviedStateFromProps
使用Fragment
v-for使用正确的key
拆分尽可能小的可复用组件，ErrorBoundary
使用React.lazy和React.Suspense延迟加载不需要立马使用的组件


## 如何发现以及分析性能问题
https://chodocs.cn/interview/react-summary/

参考答案
肉眼可见的性能问题，如白屏、卡顿、加载时间很长，一般是要答带数据的优化。
lightHouse 的评分，可以作为优化依据。

React 性能检测的一些工具也可以：Profiler 能测出 reRender 的耗时，平常对数据要求不严也就是不需要准确测出 rerender 的时间的话可以使用 ReactDevtool。

浏览器开发者工具可以检测到大部分的性能数据：

网络面板的一些优化方案：

阻塞或者排队，由于一个域名最多维护 6 个链接，可以做域名分片或者多个域名。
网络原因可以用 CDN 缓存
下载时间过长可以压缩或者 webpack 打包优化。
performance：

FPS （Frames Per Second）每秒传输帧数，发现页面帧速图表出现红色块，代表一帧所需时间过长->卡顿。
CPU 图表显示占得面积太大，可能某个 js 占用太多主线程时间
V8 内存使用凸显一直上升，内存泄漏可能存在

### 怎么做性能优化

1、写 React 代码的优化

减少计算

增加 key
commit 阶段减少耗时操作
一些 hook ： useMemo、useCallback、React.Memo 4. setState 将多个合并，或者用 ustable_batchedUpdate 批量更新
精细化渲染

优先用户响应，耗时任务放到下一个宏任务。“关闭弹窗类似的场景”
usecontext 跳过中间组件 ，发布订阅模式，redux
useMemo 也可以跳过 render
控制范围

防抖节流
懒渲染（"虚拟列表"）、懒加载（webPack）
避免在 didMount 或 didUpdate 中更新 state
2、webpack 的优化（除去开发环境的优化）

打包速度

onOf、external 可以跳过 loader 的查找，除去一些不打包
babel 缓存，可以对运行结果缓存
多进程打包 thread-loader
运行性能

文件资源缓存 hash、chunkhash、contenthash，这几个的区别也要明白
treeShacking
code split
懒加载、预加载（某些浏览器不支持）
离线可访问 pwa （也是一种优化，但用的不多）
3、网络等优化

CDN 缓存
域名分片
文件压缩
DNS 预解析，提前解析之后可能会用到的域名

## React性能优化方案

https://juejin.cn/post/7338617055149883419

1、跳过不必要的组件更新：

PureComponent：用于类组件中，同时对 props 和 state 的变化前和变化后的值进行浅对比，对每个 props 值进行基本的值对比，如果值类型是复杂类型，如引用类型（对象），并不会深入遍历每个属性的变化，如果都没发生变化则会跳过重渲染。

React.memo：用于函数组件中，功能和PureComponent一样。

shouldComponentUpdate：
- 在每次渲染（render）之前被调用，并且根据该函数的返回值（true/false）来决定是否调用渲染函数（return true 触发渲染，return false 阻止渲染）。
- 但是组件的首次渲染或者调用 forceUpdate() 方法时不会触发调用。

使用useCallback和useMemo缓存函数的引用或值：
- useCallback：是useMemo的语法糖，是「useMemo 的返回值为函数」时的特殊情况，缓存的是函数的引用。
- useMemo：缓存计算数据的值。

状态下放，缩小状态影响范围：如果一个状态只在某部分子树中使用，那么可以将这部分子树提取为组件，并将该状态移动到该组件内部。

列表项使用 key 属性。

useMemo 返回虚拟 DOM：利用 useMemo 可以缓存计算结果的特点，如果 useMemo 返回的是组件的虚拟 DOM，则将在 useMemo 依赖不变时，跳过组件的 Render 阶段。

Hooks 按需更新：如果自定义 Hook 暴露多个状态，而调用方只关心某一个状态，那么其他状态改变就不应该触发组件重新 Render。

使用immutable解决memo浅比较陷阱：
- memo使用Object.is()进行浅比较，深拷贝又需要递归耗费性能。
- immutable.js会将引用对象变成一个immutable对象，改变某一属性的时候，会更新当前属性以及它所有的父节点属性，其余属性保持不变，实现数据复用，提高深层次比较效率。

2、减少提交阶段耗时：

React 工作流提交阶段的第二步就是执行提交阶段钩子，它们的执行会阻塞浏览器更新页面。如果在提交阶段钩子函数中更新组件 State，会再次触发组件的更新流程，造成两倍耗时。

避免在 didMount、didUpdate、willUnmount、useLayoutEffect 和特殊场景下的 useEffect中更新组件 State。

3、前端通用优化

debounce、throttle 优化频繁触发的回调。

组件按需挂载：
- 懒加载
- 懒渲染：当组件进入或即将进入可视区域时才渲染组件：通过 react-visibility-observer 进行监听
- 虚拟列表：react-window