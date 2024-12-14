https://juejin.cn/post/6863264517074190350

```
~ vue路由hash模式和history模式实现原理分别是什么，他们的区别是什么？
* hash 模式：
#后面 hash 值的变化，不会导致浏览器向服务器发出请求，浏览器不发出请求，就不会刷新页面
通过监听 hashchange 事件可以知道 hash 发生了哪些变化，然后根据 hash 变化来实现更新页面部分内容的操作。
* history 模式：
history 模式的实现，主要是 HTML5 标准发布的两个 API，history.pushState() 和 history.replaceState()，这两个 API 可以在改变 url，但是不会发送请求。这样就可以监听 url 变化来实现更新页面部分内容的操作

区别：「👍」
url 展示上，hash 模式有“#”，history 模式没有
刷新页面时，hash 模式可以正常加载到 hash 值对应的页面，而 history 没有处理的话，会返回 404，一般需要后端将所有页面都配置重定向到首页路由
兼容性，hash 可以支持低版本浏览器和 IE。

~ 能说下 vue-router 中常用的 hash 和 history 路由模式实现原理吗？「👍」
（1）hash 模式的实现原理
早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：
https://www.word.com#search复制代码
hash 路由模式的实现主要是基于下面几个特性：
* 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。
* URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
* hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
* 可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用 JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；

（2）history 模式的实现原理
HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
history 路由模式的实现主要基于存在下面几个特性：
* pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
* 我们可以使用 popstate 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
* history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。
```

https://juejin.cn/post/6844903647378145294
```
前端路由实现起来其实很简单，本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新。
目前单页面使用的路由就只有两种实现方式：
* hash 模式
* history 模式
www.test.com/##/ 就是 Hash URL，当 ## 后面的哈希值发生变化时，通过 hashchange 事件来监听到 URL 的变化，从而进行跳转页面。
两种情况：不会向服务器请求数据
一是点击跳转路由或浏览器历史跳转，触发 hashchage 事件，解析url，匹配到对应的路由规则，跳转到目标页面，DOM替换更改页面。
二是手动刷新，不会触发hashchange事件。
```
![1](/assets/images/vue-router1.png)

```
History 模式是 HTML5 新推出的功能，比之 Hash URL 更加美观
三种情况：
一是浏览器回退动作，包括调用history.back()，触发popstate事件，解析url，跳转到目标页面，DOM替换更改页面。
二是点击跳转路由，调用pushState向浏览器历史添加一个状态，不会向服务器发送请求，跳转到目标页面，DOM替换更改页面。
三是刷新页面或输入URL，会向服务器请求，所以使用history需要后端配合重定向。
```
![2](/assets/images/vue-router2.png)