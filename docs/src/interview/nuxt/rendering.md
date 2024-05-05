
# 渲染模式*

- https://www.nuxt.com.cn/docs/guide/concepts/rendering
- https://www.nuxt.com.cn/docs/getting-started/deployment（也有渲染相关的）

## 概括
::: info
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

## 通用渲染

当服务器启用了通用（服务器端+客户端）渲染，此时浏览器发起URL请求，服务器将一个完整渲染的HTML页面返回给浏览器。这个HTML页面，`不管是预先生成并缓存的（generate ssg），还是即时渲染的`，在某个时刻，都是`Nuxt在服务器环境中运行了JavaScript（Vue.js）代码，生成的一个HTML文档`。这一步类似传统`服务器端渲染`。

客户端（浏览器）在下载完HTML文档后，会加载在服务器上的JavaScript代码。浏览器再次解释它，Vue.js会`接管`文档并启用交互性。

在浏览器中使静态页面具有交互性被称为`“水合”`。

通用渲染使Nuxt应用程序能够快速加载页面，同时保留了客户端渲染的好处。

`浏览器在客户端导航时接管了服务器调用`。



## 服务器端渲染特点

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

## 客户端渲染

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

## 混合渲染

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