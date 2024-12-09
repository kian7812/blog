# Nuxt3（文档）

https://www.nuxt.com.cn/docs/getting-started/introduction

- Nuxt.js 是什么？
- Nuxt.js 有哪些特点？
- Nuxt.js 是如何实现服务端渲染的？
- Nuxt.js 有哪些常用的模块？
- 如何在 Nuxt.js 中使用 Vuex？
- 如何在 Nuxt.js 中配置路由？
- Nuxt.js 支持哪些类型的应用？
- 如何在 Nuxt.js 中实现代码分块？路由懒加载
- 如何在 Nuxt.js 中使用异步数据？
- 如何在 Nuxt.js 中配置 SEO？

## 介绍

### 自动化和约定

- 基于文件的路由: 根据pages/目录的结构定义路由。这样可以更容易地组织应用程序，避免手动配置路由的需要。
- 代码分割: Nuxt自动将代码拆分成较小的块，这有助于减少应用程序的初始加载时间。
- 内置服务器端渲染: Nuxt具备内置的服务器端渲染能力，因此你不需要自己设置单独的服务器。
- 自动导入: 在各自的目录中编写Vue组件和可组合函数，并在使用时无需手动导入，**享受树摇和优化JS捆绑包的好处**。
- 数据获取工具: Nuxt提供了可用于处理与服务器端渲染兼容的数据获取的可组合函数，以及不同的策略。
- 零配置的TypeScript支持: 可以编写类型安全的代码，无需学习TypeScript，因为我们提供了自动生成的类型和tsconfig.json配置文件。
- 配置好的构建工具: 我们默认使用Vite来支持开发中的热模块替换（HMR），以及在生产中将代码打包成符合最佳实践的形式。

### 架构

Nuxt由不同的核心包组成：
- 核心引擎：nuxt
- 打包工具：@nuxt/vite-builder 和 @nuxt/webpack-builder
- 命令行界面：nuxi
- 服务器引擎：nitro
- 开发工具包：@nuxt/kit
- Nuxt 2桥接：@nuxt/bridge

## 配置

- nuxt.config - runtimeConfig 运行时
- app.config 偏静态
- 其它

## 资源

Nuxt使用两个目录来处理样式表、字体或图片等资源。

- public/ 目录中的内容会按原样作为服务器根目录下的公共资源提供。
- assets/ 目录按约定包含了你希望构建工具（Vite或webpack）处理的所有资源。

## 样式化

1. 如果你正在编写本地样式表，将它们放在 assets/ 目录 是最自然的位置。

2. 使用 v-bind 动态样式：可以在样式块中使用 v-bind 函数引用 JavaScript 变量和表达式。 绑定将是动态的，这意味着如果变量值发生变化，样式将会更新。

3. 作用域样式：scoped 属性允许你将样式应用于组件内部。

4. CSS 模块：你可以使用 module 属性和 CSS Modules。可以使用注入的 $style 变量访问它。

5. 预处理器支持：SFC 样式块支持预处理器语法。Vite 内置支持 .scss、.sass、.less、.styl 和 .stylus 文件，无需配置。你只需要首先安装它们，然后在 SFC 中使用 lang 属性直接引用它们。

6. 使用 PostCSS：
    - autoprefixer：自动添加厂商前缀
    - cssnano：压缩和清除无用的 CSS
7. 三方库和模块：
    - Tailwind CSS


**LCP高级优化**
- 你可以采取以下措施来加快全局CSS文件的下载速度：
- 使用CDN，让文件物理上更接近你的用户
- 压缩你的资源，最好使用Brotli
- 使用HTTP2/HTTP3进行传递
- 将你的资源托管在同一个域名下（不要使用不同的子域名）

如果你正在使用Cloudflare、Netlify或Vercel等现代平台，大多数情况下这些事情应该会自动完成。 你可以在web.dev上找到一个LCP优化指南。


## 视图

https://www.nuxt.com.cn/docs/getting-started/views

Nuxt 提供了几个组件层来实现应用程序的用户界面。

1. **app.vue**

默认情况下，**Nuxt 将把 `app.vue` 视为入口点，`并为应用程序的每个路由渲染其内容`**。

2. 布局

目录：layouts/

布局是页面的包装器，包含了多个页面的共同用户界面，如页眉和页脚。布局是使用 `<slot />` 组件来显示页面内容的 Vue 文件。layouts/default.vue 文件将被默认使用。

（注意：布局和路由没啥关系）

3. 页面

目录：pages/

页面代表了每个特定路由模式的视图。pages/ 目录中的每个文件都表示一个不同的路由，显示其内容。
要使用页面，创建 pages/index.vue 文件并将 `<NuxtPage />` 组件添加到 app.vue（或者删除 app.vue 以使用默认入口）。

4. 组件

目录：components/

大多数组件是可重用的用户界面部件，如按钮和菜单。在 Nuxt 中，你可以在 components/ 目录中创建这些组件，它们将自动在整个应用程序中可用，无需显式地导入。


## 路由

Nuxt的核心功能之一是文件系统路由。pages/目录中的每个Vue文件都会创建一个相应的URL（或路由），用于显示文件的内容。通过为每个页面使用动态导入，Nuxt利用代码分割来仅加载所需路由的最小量JavaScript。

### 页面

目录：pages/

**Nuxt的路由基于`vue-router`，根据`pages/`目录中创建的每个组件的文件名生成路由。**

1. pages/index.vue 文件将映射到应用程序的 / 路由。
2. 动态路由，*双*方括号中，可选参数。
3. 全匹配路由，[...slug].vue 的文件
4. 路由参数，`useRoute()`
5. 嵌套路由，使用 `<NuxtPage>` 显示嵌套路由
6. 页面元数据，使用 `definePageMeta` 宏来实现，通过 route.meta 对象访问这些数据。
7. 导航组件 `<NuxtLink>`，它能智能地确定链接是内部链接还是外部链接，并根据可用的优化（预加载、默认属性等）进行渲染。
8. 编程式导航，通过 `navigateTo()` 进行编程式导航。
9. 多个页面目录，使用 Nuxt Layers 来创建应用程序页面的分组。

`<NuxtLink>` 组件用于在页面之间创建链接。它会将`<a>`标签渲染为具有href属性设置为页面的路由。一旦应用程序被渲染，页面的切换将在JavaScript中进行，通过更新浏览器URL来实现。这样可以避免整页刷新，同时允许实现动画过渡效果。

### 路由中间件

目录：middleware/ （客户端、服务端渲染用到，但纯服务端不行）

Nuxt提供了一个可自定义的路由中间件框架，您可以在应用程序中使用，非常适合提取在导航到特定路由之前要运行的代码。

注意：**路由中间件在Nuxt应用程序的Vue部分中运行。尽管名称相似，但它们与在应用程序的Nitro服务器部分中运行的服务器中间件完全不同。**

有三种类型的路由中间件：
- 匿名（或内联）路由中间件，直接在使用它们的页面中定义。
- 命名路由中间件，放置在middleware/目录中，当在页面中使用时，会通过异步导入自动加载。
- 全局路由中间件，放置在middleware/目录中（使用.global后缀），将在每次路由更改时自动运行。

### 路由验证

Nuxt通过每个要验证的页面中的definePageMeta()的validate属性提供路由验证。

validate属性接受route作为参数。您可以返回一个布尔值来确定是否将此路由视为`有效`路由以渲染此页面。**如果返回false，并且找不到其他匹配项，这将导致404错误**。您还可以直接返回一个带有statusCode/statusMessage的对象以立即响应错误（其他匹配项将不会被检查）。

（应该是做有效性验证的，可以做权限管理？）


## SEO和Meta

- https://www.nuxt.com.cn/docs/getting-started/seo-meta

1. 默认值，Nuxt提供了合理的默认值，如果需要的话，你可以进行覆盖。在 nuxt.config.ts 文件中提供 app.head 属性，可以自定义整个应用的头部。

2. useHead() 组合函数允许你以编程和响应式的方式管理头部标签，它只能在组件的 setup 和生命周期钩子中使用。

3. useSeoMeta() 组合函数允许你将站点的SEO元标签定义为一个扁平的对象，并提供完整的TypeScript支持。`这有助于避免拼写错误和常见错误`。（*SEO配置推荐这个*）
    - 有超过100个参数。请参阅源代码中的完整参数列表。https://zhead.dev/ 

4. Nuxt SEO https://nuxtseo.com/ (有待)

5. 组件，Nuxt提供了`<Title>、<Base>、<NoScript>、<Style>、<Meta>、<Link>、<Body>、<Html>和<Head>`组件，让你可以直接在组件的模板中与元数据进行交互。

6. 其它：标题模板等

## 状态管理

1. useState()（还是不确定场景有哪些）
    - Nuxt提供了useState组合函数，用于在组件之间创建响应式**且适用于SSR的共享状态**。
    - useState是一个适用于SSR的ref替代品。**它的值将在服务器端渲染后保留（在客户端渲染期间进行hydration），并通过唯一的键在所有组件之间共享**。
    - 由于useState内部的数据将被序列化为JSON，因此重要的是它不包含无法序列化的内容，如类、函数或符号。
2. 使用第三方库，Pinia - 官方推荐的Vue状态管理库。

## 错误处理

Nuxt 3 是一个全栈框架，这意味着在不同的上下文中可能会发生几种无法预防的用户运行时错误：
1. Vue 渲染生命周期中的错误（SSR 和 CSR）
2. Nitro 服务器生命周期中的错误（server/ 目录）
3. 服务器和客户端启动错误（SSR + CSR）
4. 下载 JS chunk 时出错

## 图层

Nuxt 3 的核心功能之一就是图层和扩展支持。你可以扩展默认的 Nuxt 应用程序，以便重用组件、工具和配置。图层结构几乎与标准的 Nuxt 应用程序相同，这使得它们易于编写和维护。

## 部署

Nuxt 应用可以部署在 Node.js 服务器上，预渲染以进行静态托管，或部署到无服务器或边缘（CDN）环境中。

Node.js 服务器：
  - 入口点（启动）
  - PM2
  - 集群模式
  - 了解更多：https://nitro.unjs.io/deploy

静态托管
  - 基于爬取的预渲染
  - 选择性预渲染
  - 仅客户端渲染

## 升级指南

https://www.nuxt.com.cn/docs/getting-started/upgrade


## 关键概念

### 自动导入

https://www.nuxt.com.cn/docs/guide/concepts/auto-imports

**Nuxt自动导入组件、组合式函数、辅助函数和Vue API**，无需显式导入即可在整个应用程序中使用。

由于Nuxt具有固定的目录结构，它可以自动导入components/、composables/和utils/。

## Vue.js 开发

### Nuxt3 与 Nuxt2/Vue2 的区别

https://www.nuxt.com.cn/docs/guide/concepts/vuejs-development

Nuxt 3 基于 Vue 3。新的 Vue 主要版本引入了几个变化，Nuxt 利用了这些变化：
- 更好的性能
- Composition API
- TypeScript 支持

**更快的渲染**
- Vue 虚拟 DOM（VDOM）已经从头开始重写，可以提供更好的渲染性能。除此之外，当使用编译后的单文件组件时，Vue 编译器可以在构建时进一步优化它们，将静态和动态标记分离。
- 这导致了更快的首次渲染（组件创建）和更新，以及更少的内存使用。在 Nuxt 3 中，它还实现了更快的服务器端渲染。

**更小的捆包**
- Vue 3 和 Nuxt 3 专注于减小捆包大小。在版本 3 中，包括模板指令和内置组件在内的大部分 Vue 功能都可以进行 tree-shaking。如果你不使用它们，你的生产捆包将不包含它们。
- 这样，一个最小的 Vue 3 应用程序可以减小到 12 KB gzipped。

**Composition API**
- 在 Vue 2 中，向组件提供数据和逻辑的唯一方式是通过 Options API，它允许你返回数据和方法到一个带有预定义属性（如 data 和 methods）的模板中
- Vue 3 中引入的 Composition API 不是 Options API 的替代，而是可以更好地在整个应用程序中重用逻辑，并且是在复杂组件中按关注点分组的更自然的方式。

**TypeScript 支持**
- Vue 3 和 Nuxt 3 都是用 TypeScript 编写的。完全类型化的代码库可以防止错误并记录 API 的使用方式。在 Nuxt 3 中，你可以通过将文件从 .js 重命名为 .ts，或在组件中添加 `<script setup lang="ts"> 来选择使用它`。

## 模块

Nuxt 模块是异步函数，在使用 nuxi dev 命令以开发模式启动 Nuxt 或者使用 nuxi build 命令构建项目时，它们会按顺序运行。它们可以覆盖模板、配置 webpack 加载器、添加 CSS 库以及执行许多其他有用的任务。
最重要的是，Nuxt 模块可以以 npm 包的形式分发。