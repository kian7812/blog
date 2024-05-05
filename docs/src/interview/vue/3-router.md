# Vue Router（文档）

https://router.vuejs.org/zh/introduction.html

## 从头开始实现一个简单的路由

（看文档）https://cn.vuejs.org/guide/scaling-up/routing.html


## `<router-link>`

RouterLink 组件来创建链接，使得 Vue Router 可以在不重新加载页面的情况下更改 URL。

## `<router-view>`

`<router-view>` 用于承载显示与 URL 对应的组件。

## 

动态路由匹配

嵌套路由

编程式导航

命名视图
同时 (同级) 展示多个视图，一个路由下多个router-view，通过name属性。

重定向和别名

## 路由模式

Hash 模式：它在内部传递的实际 URL 之前使用了一个哈希字符（#）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。不过，它在 SEO 中确实有不好的影响。如果你担心这个问题，可以使用 HTML5 模式。

Memory 模式：Memory 模式不会假定自己处于浏览器环境，因此不会与 URL 交互也不会自动触发初始导航。这使得它非常适合 Node 环境和 SSR。

HTML5 模式：历史模式
- 由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 `https://example.com/user/id`，就会得到一个 404 错误。这就尴尬了。
- 服务其兼容：要解决这个问题，你需要做的就是在你的服务器上添加一个简单的回退路由。**如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 index.html 相同的页面**。

## 导航守卫

组件内的守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

完整的导航解析流程：
1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## Vue Router 和 组合式 API

因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。作为替代，我们使用 useRouter 和 useRoute 函数。
```js
const router = useRouter()
const route = useRoute()
```

- route 对象是一个响应式对象，所以它的任何属性都可以被监听，但你应该避免监听整个 route 对象。在

- 导航守卫组合式API：`import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'`

- useLink 用于生成自定义链接、构建你自己的 RouterLink 组件。

## 路由懒加载

把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件。
Vue Router 支持开箱即用的动态导入。

**把组件按组分块**：把某个路由下的所有组件都打包在同一个异步块 (chunk) 中。只需要使用命名 chunk。具体看文档。

## 动态添加删除路由

对路由的添加通常是通过 routes 选项来完成的，但是在某些情况下，你可能想在应用程序已经运行的时候添加或删除路由。

添加路由和删除路由，通过两个函数实现。router.addRoute() 和 router.removeRoute()。具体看文档吧。

