# Nuxt3

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

## Nuxt.js 有哪些特点？

https://www.nuxt.com.cn/docs/getting-started/introduction

- 基于文件的路由: 根据pages/目录的结构定义路由。这样可以更容易地组织应用程序，避免手动配置路由的需要。
- 代码分割: Nuxt自动将代码拆分成较小的块，这有助于减少应用程序的初始加载时间。
- 内置服务器端渲染: Nuxt具备内置的服务器端渲染能力，因此你不需要自己设置单独的服务器。
- 自动导入: 在各自的目录中编写Vue组件和可组合函数，并在使用时无需手动导入，享受树摇和优化JS捆绑包的好处。
- 数据获取工具: Nuxt提供了可用于处理与服务器端渲染兼容的数据获取的可组合函数，以及不同的策略。
- 零配置的TypeScript支持: 可以编写类型安全的代码，无需学习TypeScript，因为我们提供了自动生成的类型和tsconfig.json配置文件。
- 配置好的构建工具: 我们默认使用Vite来支持开发中的热模块替换（HMR），以及在生产中将代码打包成符合最佳实践的形式。

## 服务器引擎 Nitro 是什么

https://www.nuxt.com.cn/docs/getting-started/introduction

Nuxt的服务器引擎Nitro开启了全新的全栈能力。

在开发中，它使用Rollup和Node.js工作线程来处理你的服务器代码和上下文隔离。它还通过读取server/api/中的文件生成你的服务器API，以及读取server/middleware/中的文件生成服务器中间件。

在生产中，Nitro将你的应用程序和服务器构建为一个通用的.output目录。这个输出是轻量级的：经过压缩，并且不包含任何Node.js模块（除了polyfills）。你可以将此输出部署到支持JavaScript的任何系统上，包括Node.js、无服务器（Serverless）、Workers、边缘渲染或纯静态环境。

## 架构

Nuxt由不同的核心包组成：
- 核心引擎：nuxt
- 打包工具：@nuxt/vite-builder 和 @nuxt/webpack-builder
- 命令行界面：nuxi
- 服务器引擎：nitro
- 开发工具包：@nuxt/kit
- Nuxt 2桥接：@nuxt/bridge

## 迁移到 Nuxt 3

https://www.nuxt.com.cn/docs/migration/overview

## 与 Nuxt 2 / Vue 2 的区别

https://www.nuxt.com.cn/docs/guide/concepts/vuejs-development

Nuxt 3 基于 Vue 3。新的 Vue 主要版本引入了几个变化，Nuxt 利用了这些变化：
- 更好的性能
- Composition API
- TypeScript 支持

**更快的渲染**

Vue 虚拟 DOM（VDOM）已经从头开始重写，可以提供更好的渲染性能。除此之外，当使用编译后的单文件组件时，Vue 编译器可以在构建时进一步优化它们，将静态和动态标记分离。

这导致了更快的首次渲染（组件创建）和更新，以及更少的内存使用。在 Nuxt 3 中，它还实现了更快的服务器端渲染。

**更小的捆包**

Vue 3 和 Nuxt 3 专注于减小捆包大小。在版本 3 中，包括模板指令和内置组件在内的大部分 Vue 功能都可以进行 tree-shaking。如果你不使用它们，你的生产捆包将不包含它们。

这样，一个最小的 Vue 3 应用程序可以减小到 12 KB gzipped。

**Composition API**

在 Vue 2 中，向组件提供数据和逻辑的唯一方式是通过 Options API，它允许你返回数据和方法到一个带有预定义属性（如 data 和 methods）的模板中

Vue 3 中引入的 Composition API 不是 Options API 的替代，而是可以更好地在整个应用程序中重用逻辑，并且是在复杂组件中按关注点分组的更自然的方式。

**TypeScript 支持**

Vue 3 和 Nuxt 3 都是用 TypeScript 编写的。完全类型化的代码库可以防止错误并记录 API 的使用方式。在 Nuxt 3 中，你可以通过将文件从 .js 重命名为 .ts，或在组件中添加 `<script setup lang="ts"> 来选择使用它`。



## 渲染模式*

https://www.nuxt.com.cn/docs/guide/concepts/rendering

::: info
### 概括
- nuxt generate 预渲染，与ssr区别是什么
  - 预渲染，可以理解为build阶段一次ssr。ssg时默认ssr: true（因为ssg就是build阶段一次ssr），不能ssr: false，会生成一个空 `<div id="__nuxt"></div>` 的 HTML 页面，也就失去了预渲染的意义了。（https://nuxt.com/docs/getting-started/deployment#static-hosting）
  - 预渲染，会打包出html文件;
  - 预渲染，但应该会带着payload静态包（可能已经水合好了）。这点和ssr应该一样。
  - 都会按路由代码拆分，一个路由只是generate在build执行一次useAsyncdata，并返回html；ssr会每次请求都会执行useAsyncdata
  - 构建部署后，当请求一个的路由时，预渲染直接返回html，携带静态包，不会触发useAsyncdata；ssr会执行服务端渲染，返回html+静态包payload，到客户端水合。

- nuxt build: Build your application with webpack and minify the JS & CSS (for production).
- nuxt generate: Build the application and generate every route as a HTML file (used for static hosting).

- 通用渲染，包括ssg和ssr。
- 服务端渲染，ssr。
- 客户端渲染，就是csr。
- 预渲染就是，ssg。
- 混合渲染，就是在routeRules给不同的路由，定义不同的前面3个渲染方式。
- 混合渲染，`swr和isr基于缓存策略`，可以重新生成页面。

- 项目中:
  - 可以简单点都用ssr
  - 进阶点，可以混合渲染配置routeRules，思考点是哪个路由有更强的seo需求
:::

### 通用渲染

当服务器启用了通用（服务器端+客户端）渲染，此时浏览器发起URL请求，服务器将一个完整渲染的HTML页面返回给浏览器。这个HTML页面，`不管是预先生成并缓存的（generate ssg），还是即时渲染的`，在某个时刻，都是`Nuxt在服务器环境中运行了JavaScript（Vue.js）代码，生成的一个HTML文档`。这一步类似传统`服务器端渲染`。

客户端（浏览器）在下载完HTML文档后，会加载在服务器上的JavaScript代码。浏览器再次解释它，Vue.js会`接管`文档并启用交互性。

在浏览器中使静态页面具有交互性被称为`“水合”`。

通用渲染使Nuxt应用程序能够快速加载页面，同时保留了客户端渲染的好处。

`浏览器在客户端导航时接管了服务器调用`。



### 服务器端渲染特点

https://www.nuxt.com.cn/docs/getting-started/introduction

Nuxt默认具备内置的服务器端渲染（SSR）能力，无需自己配置服务器，这对于Web应用有许多好处：

- 更快的初始页面加载时间: Nuxt向浏览器发送完全渲染的HTML页面，可以立即显示。这可以提供更快的页面加载时间和更好的用户体验（UX），特别是在网络或设备较慢的情况下。
- 改善SEO: 搜索引擎可以更好地索引SSR页面，因为HTML内容立即可用，而不需要依赖JavaScript在客户端渲染内容。
- 在低功率设备上的更好性能: 减少了需要在客户端下载和执行的JavaScript量，这对于处理重型JavaScript应用程序可能有困难的低功率设备非常有益。
- 更好的可访问性: 内容在初始页面加载时立即可用，改善了依赖屏幕阅读器或其他辅助技术的用户的可访问性。
- 更容易的缓存: 页面可以在服务器端缓存，这可以通过减少生成和发送内容所需的时间而进一步提高性能。

总体而言，服务器端渲染可以提供更快更高效的用户体验，同时改善搜索引擎优化和可访问性。

由于Nuxt是一个多功能的框架，它允许你将整个应用程序静态渲染为静态托管，使用nuxt generate进行部署， 通过ssr: false选项在全局禁用SSR，或通过设置routeRules选项来实现混合渲染。

服务器端渲染的好处：
- 性能：用户可以立即访问页面的内容，因为浏览器可以比JavaScript生成的内容更快地显示静态内容。同时，当水合过程发生时，Nuxt保留了Web应用程序的交互性。
- 搜索引擎优化：通用渲染将整个HTML内容作为经典服务器应用程序直接传递给浏览器。Web爬虫可以直接索引页面的内容，这使得通用渲染成为任何希望快速索引的内容的绝佳选择。

服务器端渲染的缺点：
- 开发约束：服务器和浏览器环境提供的API不同，编写可以在两个环境中无缝运行的代码可能会有些棘手。幸运的是，Nuxt提供了指导方针和特定的变量，帮助你确定代码在哪个环境中执行。
- 成本：为了即时渲染页面，服务器需要运行。这和任何传统服务器一样增加了每月的成本。然而，`由于浏览器在客户端导航时接管了服务器调用，调用次数大大减少`。通过利用边缘端渲染，可以实现成本的降低。

通用渲染非常灵活，几乎适用于任何用例，特别适合面向内容的网站：博客、营销网站、作品集、电子商务网站和市场。

### 客户端渲染

客户端渲染的优点：
- 开发速度：在完全在客户端进行工作时，我们不必担心代码的服务器兼容性，例如，使用仅在浏览器中可用的API，如window对象。
成本较低：运行服务器会增加基础设施成本，因为需要在支持JavaScript的平台上运行。我们可以将仅客户端的应用程序托管在任何具有HTML、CSS和JavaScript文件的静态服务器上。
- 离线工作：因为代码完全在浏览器中运行，所以在网络不可用的情况下，它可以继续正常工作。

客户端渲染的缺点：
- 性能：用户必须等待浏览器下载、解析和运行JavaScript文件。根据下载部分的网络和解析和执行的用户设备的性能，这可能需要一些时间，并影响用户的体验。
- 搜索引擎优化：通过客户端渲染提供的内容进行索引和更新比使用服务器渲染的HTML文档需要更长的时间。这与我们讨论的性能缺点有关，因为搜索引擎爬虫不会等待界面在第一次尝试索引页面时完全渲染。纯客户端渲染将导致内容在搜索结果页面中显示和更新所需的时间更长。

客户端渲染适用于需要大量交互的Web应用程序，不需要索引或其用户频繁访问的应用程序。它可以利用浏览器缓存，在后续访问中跳过下载阶段，例如SaaS、后台应用程序或在线游戏。

你可以在你的nuxt.config.ts中启用仅客户端渲染：
```js
export default defineNuxtConfig({
  ssr: false
})
```

### 混合渲染

`混合渲染允许每个路由使用不同的渲染模式，以及使用不同的路由规则和缓存策略，来响应URL请求`。

以前，Nuxt应用程序和服务器的每个路由/页面必须使用相同的渲染模式，通用渲染或客户端渲染。

Nuxt 包括了路由规则和混合渲染支持。使用路由规则，可以为一组Nuxt路由定义规则，改变渲染模式或基于路由分配缓存策略！

Nuxt服务器`将(这些规则)自动注册相应的中间件`，并使用Nitro缓存层包装路由。

请注意，`使用nuxt generate时，无法使用混合渲染`。

```js
export default defineNuxtConfig({
  routeRules: {
    // 主页在构建时预渲染
    '/': { prerender: true },
    // 产品页面按需生成，后台自动重新验证
    '/products/**': { swr: 3600 },
    // 博客文章按需生成，直到下一次部署前持续有效
    '/blog/**': { isr: true },
    // 管理仪表板仅在客户端渲染
    '/admin/**': { ssr: false },
    // 在API路由上添加cors头
    '/api/**': { cors: true },
    // 跳转旧的URL
    '/old-page': { redirect: '/new-page' }
  }
})
```

**路由规则**

你可以使用以下不同的属性：
- redirect: string - 定义服务器端重定向。
- ssr: boolean - 禁用应用程序的服务器端渲染部分，使其仅支持SPA，使用ssr: false。
- cors: boolean - 使用cors: true自动添加CORS头部，你可以通过覆盖headers来自定义输出。
- headers: object - 为你的站点的某些部分添加特定的头部，例如你的资源文件。
- `swr`: number|boolean - 为服务器响应添加缓存头部，并在服务器或反向代理上缓存它，以配置的TTL（存活时间）进行缓存。Nitro的node-server预设能够缓存完整的响应。当TTL过期时，将发送缓存的响应，同时在后台重新生成页面。如果使用true，则添加了一个不带MaxAge的stale-while-revalidate头部。
- `isr`: number|boolean - 行为与swr相同，除了我们能够将响应添加到支持此功能的CDN缓存中（目前支持Netlify或Vercel）。如果使用true，内容将在CDN中持久存在，直到下一次部署。
- prerender:boolean - 在构建时预渲染路由，并将其包含在你的构建中作为静态资源。
- experimentalNoScripts: boolean - 禁用Nuxt脚本的渲染和JS资源提示，用于你站点的某些部分。

在可能的情况下，路由规则将自动应用于部署平台的本机规则，以实现最佳性能（当前支持Netlify和Vercel）。



## 数据获取*

当浏览器请求启用了通用（服务器端+客户端）渲染的URL时，服务器将一个完整渲染的HTML页面返回给浏览器。无论页面是预先生成并缓存的，还是即时渲染的，在某个时刻，Nuxt都在服务器环境中运行了JavaScript（Vue.js）代码，生成了一个HTML文档。用户立即获得我们应用程序的内容，与客户端渲染相反。这一步类似于PHP或Ruby应用程序执行的传统服务器端渲染。

useFetch useAsyncData $fetch

https://www.nuxt.com.cn/docs/getting-started/data-fetching

::: info
### 概括
- 首先 useFetch useAsyncData $fetch 这三个都能在客户端和服务端发起请求。（文档中：#仅在客户端获取数据 https://www.nuxt.com.cn/docs/getting-started/data-fetching）

- useAsyncData场景
  - useFetch组合函数用于在设置方法中调用，或在生命周期钩子函数的函数顶层直接调用，否则你应该使用$fetch方法。
  - useFetch、useAsyncData是一个可组合函数，可以直接在设置函数、插件或路由中调用。
  - 执行场景：初始页面进入时执行，客户端路由切换，或SSR中路由访问时。
  - 阻塞导航场景：同时可能会发生在，客户端路由切换，或SSR中路由访问时。可通过lazy配置。
  - 返回数据：在SSR中请求，会携带payload返回。

- 项目中request库应该要基于$fetch封装，$fetch是nuxt基于ofetch封装的nuxt底层请求方法。
  - useAsyncData有特定的使用场景。
:::

### $fetch
https://www.nuxt.com.cn/docs/api/utils/dollarfetch

用于在Vue应用程序或API路由中进行HTTP请求。（客户端和服务端都可使用）。

注意：在组件中使用$fetch而不使用useAsyncData进行包装会导致数据被获取两次：首先在服务器端获取，然后在客户端进行混合渲染期间再次获取，因为$fetch不会将状态从服务器传递到客户端。因此，获取将在两端执行，因为客户端需要再次获取数据。

- 建议在获取组件数据时使用useFetch或useAsyncData + $fetch来防止重复获取数据。
- $fetch是在Nuxt中进行HTTP调用的首选方式，而不是为Nuxt 2设计的@nuxt/http和@nuxtjs/axios。

```vue
<script setup lang="ts">
// 在SSR中数据将被获取两次，一次在服务器端，一次在客户端。（注意：在SSR中，两次）
const dataTwice = await $fetch('/api/item')

// 在SSR中，数据仅在服务器端获取并传递到客户端。（注意：在SSR中）
const { data } = await useAsyncData('item', () => $fetch('/api/item'))

// 你也可以使用useFetch作为useAsyncData + $fetch的快捷方式
const { data } = await useFetch('/api/item')
</script>
```

可以在只在客户端执行的任何方法中使用$fetch。

```vue
<script setup lang="ts">
function contactForm() {
  $fetch('/api/contact', {
    method: 'POST',
    body: { hello: 'world '}
  })
}
</script>

<template>
  <button @click="contactForm">联系我们</button>
</template>
```

### useAsyncData

https://www.nuxt.com.cn/docs/api/composables/use-async-data

useAsyncData提供了一种在SSR友好的组合式中访问异步解析数据的方式。

useAsyncData是一种组合式，可以直接在设置函数、插件或路由中调用。它返回响应式的组合式，并处理将响应添加到Nuxt负载中，以便在页面水合时从服务器传递到客户端，而不需要在客户端重新获取数据。

```vue
<script setup>
const { data, pending, error, refresh } = await useAsyncData(
  'mountains',
  () => $fetch('https://api.nuxtjs.dev/mountains')
)
</script>
```
options
- lazy: 是否在页面加载之后再等待执行异步任务，默认为false，表示在页面加载之前会阻塞，直到异步任务执行完。

返回值
- data: 返回一个 ref 的数据值 https://tr.zhiyakeji.com/post/27
  - 服务端在返回这个data的同时，会将data数据序列化并存放在payload里，payload和已经渲染好的html文本一起发送给浏览器
  - 在客户端(浏览器)第一次加载页面执行这个方法的时候，并不会真正的等待执行异步任务，而是先检查payload中是否已经存在此数据，如果存在则直接返回payload中的数据。这样客户端不用再次请求接口，而是直接拿到服务端已经请求过的数据。
  - 然后在客户端切换路由过程中再次加载此页面时，会等待执行异步任务，此时data里是最新的数据。

*（其实useAsyncData里面也需要$fetch来发起请求）*

### useLazyAsyncData

默认情况下，useAsyncData会阻塞导航，直到其异步处理程序解析完成。useLazyAsyncData在useAsyncData周围提供了一个包装器，通过将lazy选项设置为true，在处理程序解析之前触发导航。

### useFetch

https://www.nuxt.com.cn/docs/api/composables/use-fetch

*一个useAsyncData的封装或语法糖*

这个可组合函数提供了一个方便的封装，包装了useAsyncData和$fetch。它根据URL和fetch选项自动生成一个键，根据服务器路由提供请求URL的类型提示，并推断API响应类型。

useFetch是一个可组合函数，可以直接在设置函数、插件或路由中调用。它返回响应式的可组合函数，并处理将响应添加到Nuxt的负载中，以便在页面水合时可以从服务器传递给客户端，而无需在客户端重新获取数据。

```vue
<script setup>
const route = useRoute()

const { data, pending, error, refresh } = await useFetch(`https://api.nuxtjs.dev/mountains/${route.params.slug}`, {
  pick: ['title']
})
</script>
```

## 自动导入

https://www.nuxt.com.cn/docs/guide/concepts/auto-imports

通过Nuxt自动导入的每个函数都可以直接在代码中使用，无需显式导入。

Nuxt自动导入组件、组合式函数、辅助函数和Vue API，无需显式导入即可在整个应用程序中使用。

由于Nuxt具有固定的目录结构，它可以自动导入components/、composables/和utils/。

## 资源

Nuxt使用两个目录来处理样式表、字体或图片等资源。

- public/ 目录中的内容会按原样作为服务器根目录下的公共资源提供。
- assets/ 目录按约定包含了你希望构建工具（Vite或webpack）处理的所有资源。

## 路由

https://www.nuxt.com.cn/docs/getting-started/routing

https://www.nuxt.com.cn/docs/guide/directory-structure/pages

Nuxt文件系统路由为`pages/`目录中的每个文件创建一个路由。

通过为每个页面路由使用动态导入，Nuxt利用`代码分割`来仅加载所需路由的最小量JavaScript。（路由懒加载：https://router.vuejs.org/zh/guide/advanced/lazy-loading）

### 导航

`<NuxtLink>` 组件用于在页面之间创建链接。它会将`<a>`标签渲染为具有href属性设置为页面的路由。一旦应用程序被渲染，页面的切换将在JavaScript中进行，通过更新浏览器URL来实现。这样可以避免整页刷新，同时允许实现动画过渡效果。

### 编程式导航

通过 navigateTo() 进行编程式导航。


路由参数

路由中间件

路由验证


### 嵌套路由

可以使用 `<NuxtPage>` 显示嵌套路由。


## SEO和Meta

https://www.nuxt.com.cn/docs/getting-started/seo-meta

**1.默认值**

Nuxt提供了合理的默认值，如果需要的话，你可以进行覆盖。在 nuxt.config.ts 文件中提供 app.head 属性，可以自定义整个应用的头部。
```js
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  }
})
```

**2.useHead**
useHead 组合函数允许你以编程和响应式的方式管理头部标签，它由 Unhead 提供支持。
和所有组合函数一样，它只能在组件的 setup 和生命周期钩子中使用。
```js
<script setup lang="ts">
useHead({
  title: '我的应用',
  meta: [
    { name: 'description', content: '我的神奇网站。' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})
</script>
```

**3.useSeoMeta**

useSeoMeta 组合函数允许你将站点的SEO元标签定义为一个扁平的对象，并提供完整的TypeScript支持。`这有助于避免拼写错误和常见错误`。
```js
<script setup lang="ts">
useSeoMeta({
  title: '我的神奇网站',
  ogTitle: '我的神奇网站',
  description: '这是我的神奇网站，让我来告诉你关于它的一切。',
  ogDescription: '这是我的神奇网站，让我来告诉你关于它的一切。',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
```

**4.组件**

Nuxt提供了`<Title>、<Base>、<NoScript>、<Style>、<Meta>、<Link>、<Body>、<Html>和<Head>`组件，让你可以直接在组件的模板中与元数据进行交互。

在模板中将它们大写非常重要。

`<Head>` 和 `<Body>` 可以接受嵌套的元标签`（出于美观的原因）`，`但这对最终HTML中嵌套的元标签的渲染位置没有影响`。
```js
<script setup lang="ts">
const title = ref('你好，世界')
</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
      <Style type="text/css" children="body { background-color: green; }" />
    </Head>

    <h1>{{ title }}</h1>
  </div>
</template>
```

## 状态管理

https://www.nuxt.com.cn/docs/getting-started/state-management

Nuxt提供了useState组合函数，用于在组件之间创建响应式且适用于SSR的共享状态。

useState是一个适用于SSR的ref替代品。它的值将在服务器端渲染后保留（在客户端渲染期间进行hydration），并通过唯一的键在所有组件之间共享。

由于useState内部的数据将被序列化为JSON，因此重要的是它不包含无法序列化的内容，如类、函数或符号。

使用第三方库，Pinia - 官方推荐的Vue状态管理库。

## 命令

**nuxi generate**

https://www.nuxt.com.cn/docs/api/commands/generate

利用 Nuxt 的 generate 命令来预渲染静态页面，

## 常用的模块

## 目录

### layouts布局

https://www.nuxt.com.cn/docs/guide/directory-structure/layouts

布局是页面的包装器，包含了多个页面的共同用户界面，如页眉和页脚。布局是使用 <slot /> 组件来显示页面内容的 Vue 文件。layouts/default.vue 文件将被默认使用。自定义布局可以作为页面元数据的一部分进行设置。

```vue
// layouts/default.vue
<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
```