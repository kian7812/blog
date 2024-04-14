# ReactRouter

模式	实现方式	路由url表现
HashRouter	监听url hash值实现	http://localhost:3000/#/about
BrowerRouter	h5的 history.pushState API实现	http://localhost:3000/about


react-router-dom有哪些组件

HashRouter/BrowserRouter 路由器

Route 路由匹配

Link 链接，在html中是个锚点

NavLink 当前活动链接

Switch 路由跳转

Redirect 路由重定向

React Router核心能力：跳转
路由负责定义路径和组件的映射关系
导航负责触发路由的改变
路由器根据Route定义的映射关系为新的路径匹配对应的逻辑
BrowserRouter使用的HTML5的history api实现路由跳转
HashRouter使用URL的hash属性控制路由跳转
前端通用路由解决方案

hash模式


改变URL以#分割的路径字符串，让页面感知路由变化的一种模式,通过hashchange事件触发


history模式


通过浏览器的history api实现,通过popState事件触发

作者：lyllovelemon
链接：https://juejin.cn/post/7182382408807743548
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


## React-Router✅

### React-Router 的实现原理是什么？

基于 history 库来实现不同的客户端路由实现思想，并且能够保存历史记录等，磨平浏览器差异，上层无感知。

不同的客户端路由实现思想:
1、基于 hash 的路由：通过监听 hashchange 事件，感知 > hash 的变化。通过 location.hash=xxx 改变 hash 。
2、基于 H5 history 路由：通过自定义事件触发实现监听 url 的变化。可以通过 history.pushState 和 resplaceState 等改变 url ，会将 URL 压入堆栈，同时能够应用 history.go() 等 API。

通过维护的列表，在每次 URL 发生变化的回收，通过配置的 路由路径，匹配到对应的 Component，并且 render。

### React-Router的实现原理是什么？

**客户端路由的实现思想：**

基于 Hash 的路由：

- 这种路由方式利用了 URL 的 hash（#后面的部分）。
- 当 hash 变化时，页面不会重新加载，但可以通过监听 hashchange 事件来响应 URL 的变化。
- 这种方式的优点是兼容性好，适用于老旧浏览器。


基于 H5 History 路由：

- HTML5 引入了一个新的 History API，允许开发者直接操作浏览器的历史记录栈。
- 使用 history.pushState 和 history.replaceState 方法可以改变 URL 而不重新加载页面。
- 通过 history.go、history.forward、history.back 等 API 可以控制浏览器的历史记录导航。

**React-Router 的实现思想：**

1. 基于 History 库：
    - React Router 使用了 history 库来抽象化这些底层机制，提供了一个统一的 API。
    - 通过这个库，React Router 能够无缝地在不同类型的历史记录（hash、browser、memory）之间切换，同时磨平了浏览器之间的差异。

2. 路由匹配和渲染：
    - React Router 维护了一个路由配置的列表。
    - 每次 URL 发生变化时，React Router 会根据当前的 URL 和这个列表匹配，找到对应的组件（Component），然后进行渲染。

3. History 类型：
    - createHashHistory：用于老版本浏览器，基于 URL 的 hash 部分。
    - createBrowserHistory：用于现代浏览器，基于 HTML5 History API。
    - createMemoryHistory：主要用于非浏览器环境，如服务器端渲染（SSR）或测试，历史记录保存在内存中。

总的来说，React Router 的实现依赖于底层的** URL 变化机制**，通过 history 库对这些机制进行封装和抽象，提供了一套易用且功能强大的路由管理解决方案。无论是基于 hash 还是基于 HTML5 History API 的路由，React Router 都能够提供一致的开发体验，并且使得路由的变化和组件的渲染能够高效地协同工作。

### React-Router 实现路由切换

```
有几种方式：

使用 <Route> ，会比较 <Route> 的 path 属性和当前地址的 pathname 实现路由切换。

使用 <Switch> 会遍历其所有的子 <Route> 元素，并仅渲染与当前地址匹配的第一个元素。

使用<Link>、 <NavLink>、<Redirect>，会在你的应用程序中创建链接，通过 to 属性与当前地址匹配。
```

### react-router 里的 Link 标签和 a 标签的区别？

从最终渲染的 DOM 来看，这两者都是链接，都是 a标签，区别是∶ 是react-router 里实现路由跳转的链接，一般配合 使用，react-router接管了其默认的链接跳转行为，区别于传统的页面跳转， 的“跳转”行为只会触发相匹配的对应的页面内容更新，而不会刷新整个页面。

### React-Router 如何获取 URL 的参数和历史对象？

get 传值：通过 location.search 获取 url 获取到一个字符串'?id='1111'，通过浏览器的 URLSearchParams api 或自封装字符串解析方法解析出 id 的值。

动态路由传值：通过 match.params.id 或者 useParams（Hooks）取得 url 中的动态路由 id 部分的值

通过 query 或 state 传值：to 属性传递对象或数组时，通过 location.state 或 location.query 来获取即可，但是存在缺点就是，只要刷新页面参数就会丢失。
