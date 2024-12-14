# App Router Migration

https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration

微软翻译

## App Router Incremental Adoption Guide 

应用路由器增量采用指南

本指南将帮助您：
- 将 Next.js 应用程序从版本 12 更新到版本 13
- 升级在 pages 和 app 目录中工作的功能
- 以增量方式将现有应用程序从 pages app

## 升级

### Node.js版本

最低Node.js版本现在是 v18.17。有关详细信息，请参阅Node.js文档。

### Next.js版本

若要更新到 Next.js 版本 13，请使用首选包管理器运行以下命令：

```
npm install next@latest react@latest react-dom@latest
```

### ESLint 版本

如果您使用的是 ESLint，则需要升级 ESLint 版本：

```
npm install -D eslint-config-next@latest
```

需要了解：可能需要在 VS Code 中重新启动 ESLint 服务器才能使 ESLint 更改生效。打开命令面板（ cmd+shift+p 在 Mac 上; ctrl+shift+p 在 Windows 上）并搜索 ESLint: Restart ESLint Server .

## 后续步骤

更新后，请参阅以下部分了解后续步骤：

- 升级新功能：帮助您升级到新功能（如改进的映像和链接组件）的指南。
- 从 pages to 目录迁移：帮助您从 pages to app app 目录逐步迁移的分步指南。

## 升级新功能

Next.js 13 推出了具有新功能和约定的新 App Router。新路由器在 app 目录中可用，并与 pages 目录共存。

升级到 Next.js 13 不需要使用新的 App Router。您可以继续使用 pages 在这两个目录中工作的新功能，例如更新的图像组件、链接组件、脚本组件和字体优化。

### Image 组件

Next.js 12 通过临时导入对图像组件进行了新的改进： next/future/image .这些改进包括更少的客户端 JavaScript、更简单的图像扩展和样式设置方法、更好的可访问性以及本机浏览器延迟加载。

在版本 13 中，此新行为现在是 的 next/image 默认行为。

有两个 codemod 可帮助您迁移到新的图像组件：
- next-image-to-legacy-image codemod：安全自动地将导入重命名为 next/image next/legacy/image 。现有组件将保持相同的行为。
- next-image-experimental codemod：危险地添加内联样式并删除未使用的道具。这将更改现有组件的行为以匹配新的默认值。要使用此 codemod，您需要先运行 next-image-to-legacy-image codemod。

### Link 组件

该 `<Link>` 组件不再需要手动添加子 `<a>` 标签。此行为已在版本 12.2 中作为实验性选项添加，现在是默认值。在 Next.js 13 中， `<Link>` 始终呈现 `<a>` 并允许您将道具转发到底层标签。

For example: 例如：
```js
import Link from 'next/link'
 
// Next.js 12: `<a>` has to be nested otherwise it's excluded
<Link href="/about">
  <a>About</a>
</Link>
 
// Next.js 13: `<Link>` always renders `<a>` under the hood
<Link href="/about">
  About
</Link>
```

To upgrade your links to Next.js 13, you can use the new-link codemod.
要将链接升级到 Next.js 13，您可以使用 new-link codemod。

### Script 组件

的行为 next/script 已更新为同时支持 pages 和 app ，但需要进行一些更改以确保顺利迁移：

- 将之前包含的所有 beforeInteractive 脚本移动 _document.js 到根布局文件 （ app/layout.tsx ）。
- 实验 worker 策略尚不起作用 app ，必须删除或修改用此策略表示的脚本以使用不同的策略（例如）。 lazyOnload
- onLoad 、 onReady 、 和 onError 处理程序在服务器组件中不起作用，因此请确保将它们移动到客户端组件或完全删除它们。

### 字体优化

以前，Next.js通过内联字体 CSS 来帮助您优化字体。版本 13 引入了新 next/font 模块，使您能够自定义字体加载体验，同时仍确保出色的性能和隐私。 next/font pages 在 和 app 目录中都受支持。

虽然内联 CSS 仍然适用于 pages ，但它在 app 中不起作用。您应该改用 next/font 。

请参阅字体优化页面，了解如何使用 next/font 。

## 从 pages 迁移到 app

*观看：了解如何在 YouTube →逐步采用 App Router（16 分钟）。*

迁移到 App Router 可能是第一次使用 React 功能，Next.js构建在服务器组件、Suspense 等之上。当与新的Next.js功能（如特殊文件和布局）相结合时，迁移意味着要学习新的概念、心智模型和行为变化。

我们建议通过将迁移分解为更小的步骤来降低这些更新的综合复杂性。该 app 目录有意设计为与目录同时工作， pages 以允许逐页增量迁移。

- 该 app 目录支持嵌套路由和布局。了解更多信息。
- 使用嵌套文件夹定义路由，并使用特殊 page.js 文件使路段可公开访问。了解更多信息。
- 特殊文件约定用于为每个路由段创建 UI。最常见的特殊文件是 page.js 和 layout.js 。
  - 用于 page.js 定义路由唯一的 UI。
  - 用于 layout.js 定义跨多个路由共享的 UI。
  - .js 、 .jsx 或 .tsx 文件扩展名可用于特殊文件。
- 您可以将其他文件并置目录 app 中，例如组件、样式、测试等。了解更多信息。
- 数据获取函数 和 getServerSideProps getStaticProps 已被替换为内部 app 的新 API。 getStaticPaths 已替换为 generateStaticParams 。
- pages/_app.js 并 pages/_document.js 已替换为单个 app/layout.js 根布局。了解更多信息。
- pages/_error.js 已被更精细 error.js 的特殊文件所取代。了解更多信息。
- pages/404.js 已替换为文件 not-found.js 。
- pages/api/* API 路由已替换为 route.js （Route Handler） 特殊文件。

### 步骤 1：创建 app 目录

更新到最新的 Next.js 版本（需要 13.4 或更高版本）：

`npm install next@latest`

然后，在项目（或 src/ 目录）的根目录下创建一个新 app 目录。

### 第 2 步：创建根布局

在 app 目录中创建一个新 app/layout.tsx 文件。这是一个根布局，将应用于 app 中的所有路由 。

```js
// app/layout.tsx
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```
- 目录 app 必须包含根布局。
- 根布局必须定义 `<html> 和 <body>` 标签，因为 Next.js 不会自动创建它们
- 根布局替换 pages/_app.tsx 了 and pages/_document.tsx 文件。
- .js 、 .jsx 或 .tsx 扩展名可用于布局文件。

要管理 `<head>` HTML 元素，您可以使用内置的 SEO 支持：

```js
// app/layout.tsx
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

#### 迁移 _document.js 和 _app.js

如果您有现有 _app 文件或 _document 文件，则可以将内容（例如全局样式）复制到根布局 （ app/layout.tsx ）。中的 app/layout.tsx 样式不适用于 pages/* 。您应该在迁移时保持 _app / _document 以防止您的 pages/* 路由中断。完全迁移后，您可以安全地删除它们。

如果您使用的是任何 React Context 提供程序，则需要将它们移动到客户端组件。

#### 将 getLayout() 模式迁移到布局（可选）

Next.js建议向 Page 组件添加一个属性， pages 以实现目录中的每页布局。此模式可以替换为 app 对目录中嵌套布局的本机支持。

以前
```js
// components/DashboardLayout.js
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>My Dashboard</h2>
      {children}
    </div>
  )
}
```

```js
// pages/dashboard/index.js 页面/仪表板/index.js
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>My Dashboard</h2>
      {children}
    </div>
  )
}
```
之后

从 pages/dashboard/index.js 中删除该 Page.getLayout 属性，并按照将页面迁移到 app 目录的步骤操作。
```js
// app/dashboard/page.js 应用/仪表板/page.js
export default function Page() {
  return <p>My Page</p>
}
```
将内容 DashboardLayout 移动到新的客户端组件中以保留 pages 目录行为。
```js
// app/dashboard/DashboardLayout.js
'use client' // this directive should be at top of the file, before any imports.
 
// This is a Client Component
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>My Dashboard</h2>
      {children}
    </div>
  )
}
```
导入 DashboardLayout 到 app 目录内的新 layout.js 文件中。
```js
// app/dashboard/layout.js 应用/仪表板/layout.js
import DashboardLayout from './DashboardLayout'
 
// This is a Server Component
export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
```
您可以将 （客户端组件） 的非 DashboardLayout.js 交互式部分增量移动到 （服务器组件） 中 layout.js ，以减少发送到客户端的组件 JavaScript 量。

### 第 3 步：迁移 next/head

在目录中 pages ， next/head React 组件用于管理 `<head>` HTML 元素，例如 title 和 meta 。在目录中 app ， next/head 被替换为新的内置 SEO 支持。

以前：
```js
// pages/index.tsx 页面/索引.tsx
import Head from 'next/head'
 
export default function Page() {
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
    </>
  )
}
```
后：
```js
// app/page.tsx
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'My Page Title',
}
 
export default function Page() {
  return '...'
}
```
查看所有元数据选项。

### 第 4 步：迁移页面

- 默认情况下， app 目录中的页面是服务器组件。这与页面是客户端组件的 pages 目录不同。
- 中 app 的数据获取已更改。 getServerSideProps ， getStaticProps 并 getInitialProps 已替换为更简单的 API。
- 该 app 目录使用嵌套文件夹来定义路由，并使用特殊 page.js 文件使路由段可公开访问。

| pages 目录 | app 目录 | Route |
| --- | --- | --- |
| index.js | page.js | / |
| about.js	 | about/page.js | /about |
| blog/[slug].js | blog/[slug]/page.js | /blog/post-1 |

我们建议将页面的迁移分为两个主要步骤：
- 步骤 1：将默认导出的页面组件移动到新的客户端组件中。
- 步骤 2：将新的客户端组件导入 app 到目录内的新 page.js 文件中。

*很高兴知道：这是最简单的迁移路径，因为它具有与 pages 目录最相似的行为。*

**步骤 1：创建新的客户端组件**

- 在导出客户端组件的 app 目录（ app/home-page.tsx 即或类似目录）中创建一个新的单独文件。若要定义客户端组件，请将 'use client' 指令添加到文件顶部（在进行任何导入之前）。
  - 与 Pages Router 类似，有一个优化步骤，用于在初始页面加载时将客户端组件预呈现为静态 HTML。
- 将默认导出的页面组件从 pages/index.js 移动到 app/home-page.tsx 。

```js
// app/home-page.tsx
'use client'
 
// This is a Client Component (same as components in the `pages` directory)
// It receives data as props, has access to state and effects, and is
// prerendered on the server during the initial page load.
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**第 2 步：创建新页面**

- 在 app 目录中创建一个新 app/page.tsx 文件。默认情况下，这是一个服务器组件。
- 将客户端组件导入 home-page.tsx 到页面中。
- 如果要在 pages/index.js 中获取数据，请使用新的数据获取 API 将数据获取逻辑直接移动到服务器组件中。有关详细信息，请参阅数据获取升级指南。

```js
// app/page.tsx
// Import your Client Component
import HomePage from './home-page'
 
async function getPosts() {
  const res = await fetch('https://...')
  const posts = await res.json()
  return posts
}
 
export default async function Page() {
  // Fetch data directly in a Server Component
  const recentPosts = await getPosts()
  // Forward fetched data to your Client Component
  return <HomePage recentPosts={recentPosts} />
}
```

- 如果您之前使用的页面 useRouter 是 ，则需要更新到新的路由挂钩。了解更多信息。
- 启动开发服务器并访问 `http://localhost:3000` 。您应该会看到现有的索引路由，现在通过应用程序目录提供。

### 步骤 5：迁移路由挂钩

添加了一个新路由器以支持 app 目录中的新行为。

在 中 app ，应使用从 next/navigation 以下 useRouter() 位置导入的三个新钩子： 、 usePathname() 和 useSearchParams() 。
- 新 useRouter 挂钩是从 next/navigation 导入的 useRouter ，并且与从 next/router 导入的挂钩 pages 具有不同的行为。
  - app 目录中不支持从 next/router 中导入 useRouter 的钩子，但可以继续在 pages 目录中使用。
- new useRouter 不返回 pathname 字符串。请改用单独的 usePathname 挂钩。
- new useRouter 不返回对象 query 。请改用单独的 useSearchParams 挂钩。
- 您可以使用 useSearchParams 和 usePathname 一起收听页面更改。有关详细信息，请参阅路由器事件部分。
- 这些新钩子仅在客户端组件中受支持。它们不能在服务器组件中使用。

```js
// app/example-client-component.tsx
'use client'
 
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  // ...
}
```

此外，新 useRouter 钩子还进行了以下更改：

- isFallback 已被删除，因为 fallback 已被替换。
- locale locales 、 defaultLocales 、 domainLocales 值已被删除，因为 app 目录中不再需要内置的 i18n Next.js 功能。了解有关 i18n 的更多信息。
- basePath 已被删除。替代方案将不是 useRouter 的一部分。它尚未实施。
- asPath 已被删除，因为已从新路由器中删除了 的概念 as 。
- isReady 已被删除，因为不再需要它。在静态渲染期间，任何使用 useSearchParams() 钩子的组件都将跳过预渲染步骤，而是在运行时在客户端上渲染。

查看 useRouter() API 参考。

### 步骤 6：迁移数据获取方法

pages 目录使用 getServerSideProps 和 getStaticProps 来获取页面的数据。在目录中 app ，这些以前的数据获取函数被替换为基于 async React Server 组件构建 fetch() 的更简单的 API。

```js
// app/page.tsx
export default async function Page() {
  // This request should be cached until manually invalidated.
  // Similar to `getStaticProps`.
  // `force-cache` is the default and can be omitted.
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })
 
  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })
 
  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })
 
  return <div>...</div>
}
```

#### 服务器端渲染 （ getServerSideProps ）

在目录中 pages ， getServerSideProps 用于获取服务器上的数据并将 prop 转发到文件中默认导出的 React 组件。页面的初始 HTML 是从服务器预呈现的，然后在浏览器中“水化”页面（使其具有交互性）。

```js
// pages/dashboard.js
// `pages` directory
 
export async function getServerSideProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()
 
  return { props: { projects } }
}
 
export default function Dashboard({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

在目录中 app ，我们可以使用服务器组件将数据获取托管在 React 组件中。这允许我们向客户端发送更少的 JavaScript，同时维护从服务器呈现的 HTML。

通过将 cache 选项设置为 no-store ，我们可以指示永远不应缓存获取的数据。这与 pages 目录 getServerSideProps 中类似。

```js
// app/dashboard/page.tsx
// `app` directory
 
// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()
 
  return projects
}
 
export default async function Dashboard() {
  const projects = await getProjects()
 
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

#### 访问请求对象

在 pages 目录下，您可以基于Node.js HTTP API检索基于请求的数据。

例如，您可以从 getServerSideProps 中检索 req 对象并使用它来检索请求的 Cookie 和标头。

```js
// pages/index.js
// `pages` directory
 
export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization'];
  const theme = req.cookies['theme'];
 
  return { props: { ... }}
}
 
export default function Page(props) {
  return ...
}
```

该 app 目录公开了新的只读函数来检索请求数据：

- headers() ：基于 Web 标头 API，可在服务器组件中用于检索请求标头。
- cookies() ：基于 Web Cookie API，可在服务器组件中用于检索 Cookie。

```js
// app/page.tsx
// `app` directory
import { cookies, headers } from 'next/headers'
 
async function getData() {
  const authHeader = headers().get('authorization')
 
  return '...'
}
 
export default async function Page() {
  // You can use `cookies()` or `headers()` inside Server Components
  // directly or in your data fetching function
  const theme = cookies().get('theme')
  const data = await getData()
  return '...'
}
```

#### 静态站点生成 （ getStaticProps ）

在目录中 pages ，该 getStaticProps 函数用于在构建时预呈现页面。此函数可用于从外部 API 或直接从数据库获取数据，并在生成期间生成此数据时将此数据传递到整个页面。

```js
// `pages` directory
// pages/index.js
 
export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()
 
  return { props: { projects } }
}
 
export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```
在目录中 app ，数据获取方式 fetch() 将默认为 cache: 'force-cache' ，它将缓存请求数据，直到手动失效。这与 pages 目录 getStaticProps 中类似。

```js
// `app` directory
// app/page.js
 
// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`)
  const projects = await res.json()
 
  return projects
}
 
export default async function Index() {
  const projects = await getProjects()
 
  return projects.map((project) => <div>{project.name}</div>)
}
```

#### 动态路径 （ getStaticPaths ）

在目录中 pages ，该 getStaticPaths 函数用于定义在构建时应预呈现的动态路径。

```js
// `pages` directory
// pages/posts/[id].js
import PostLayout from '@/components/post-layout'
 
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  }
}
 
export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()
 
  return { props: { post } }
}
 
export default function Post({ post }) {
  return <PostLayout post={post} />
}
```

在目录中 app ， getStaticPaths 替换为 generateStaticParams 。

generateStaticParams 行为与 getStaticPaths 类似，但具有用于返回路由参数的简化 API，并且可以在布局中使用。的 generateStaticParams 返回形状是段数组，而不是嵌套 param 对象数组或解析路径字符串。

```js
// `app` directory
// app/posts/[id]/page.js
import PostLayout from '@/components/post-layout'
 
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
 
async function getPost(params) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()
 
  return post
}
 
export default async function Post({ params }) {
  const post = await getPost(params)
 
  return <PostLayout post={post} />
}
```

使用该名称 generateStaticParams 比 getStaticPaths 用于 app 目录中的新模型更合适。 get 前缀被替换为更具描述性的 generate ，现在 getStaticProps getServerSideProps 单独使用更好，不再需要。 Paths 后缀替换为 Params ，这更适合于具有多个动态段的嵌套路由。

#### 取代 fallback 

在目录中 pages ，返回的 fallback getStaticPaths 属性用于定义在生成时未预呈现的页面的行为。此属性可以设置为 true 在生成页面时显示回退页面、 false 显示 404 页面或 blocking 在请求时生成页面。

```js
// `pages` directory
// pages/posts/[id].js
 
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}
 
export async function getStaticProps({ params }) {
  ...
}
 
export default function Post({ post }) {
  return ...
}
```

在 app 目录中， config.dynamicParams 该属性控制如何处理外部 generateStaticParams 的参数：

- true ：（默认）未包含在中的动态区段 generateStaticParams 按需生成。
- false ：未包含在 generateStaticParams 中的动态段将返回 404。

这将替换 pages 目录中的 fallback: true | false | 'blocking' 选项 getStaticPaths 。该 fallback: 'blocking' 选项不包括在内 dynamicParams ，因为 和 true 之间的 'blocking' 差异在流式处理中可以忽略不计。

设置为 true （默认值）后 dynamicParams ，当请求尚未生成的路由段时，服务器将呈现和缓存该路由段。

#### 增量静态再生 （ getStaticProps with revalidate ）

在目录中 pages ，该 getStaticProps 功能允许您添加一个 revalidate 字段，以便在一定时间后自动重新生成页面。

```js
// `pages` directory
// pages/index.js
 
export async function getStaticProps() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()
 
  return {
    props: { posts },
    revalidate: 60,
  }
}
 
export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  )
}
```
在目录中 app ，数据获取 可以使用 fetch() revalidate ，它将缓存请求指定的秒数。

```js
// `app` directory
// app/page.js
 
async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()
 
  return data.posts
}
 
export default async function PostList() {
  const posts = await getPosts()
 
  return posts.map((post) => <div>{post.name}</div>)
}
```

#### API 路由

API 路由继续在目录中工作， pages/api 无需任何更改。但是，它们已被 app 目录中的路由处理程序替换。

路由处理程序允许您使用 Web 请求和响应 API 为给定路由创建自定义请求处理程序。

```js
// app/api/route.ts
export async function GET(request: Request) {}
```
*很高兴知道：如果您以前使用 API 路由从客户端调用外部 API，则现在可以改用服务器组件来安全地提取数据。详细了解数据提取。*

### 第 7 步：样式

在目录中 pages ，全局样式表仅限于 pages/_app.js 。对于 app 目录，此限制已解除。全局样式可以添加到任何布局、页面或组件中。

- CSS Modules 
- Tailwind CSS 
- Global Styles 
- CSS-in-JS
- External Stylesheets 外部样式表
- Sass

#### Tailwind CSS

如果您使用的是 Tailwind CSS，则需要将 app 目录添加到您的 tailwind.config.js 文件中：

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <-- Add this line
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

您还需要在 app/layout.js 文件中导入全局样式：

```js
// app/layout.js
import '../styles/globals.css'
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```
了解有关使用 Tailwind CSS 进行样式设置的更多信息

### Codemods 代码模组

Next.js 提供 Codemod 转换，以帮助在功能被弃用时升级代码库。有关更多信息，请参见 Codemods。