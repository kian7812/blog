# 渲染机制

## 理解 Next.js 中的 CSR、SSR、SSG、ISR 以及 Streaming

https://juejin.cn/post/7162775935828115469

前言

熟悉 React 的同学想必听说过 Next.js，Next.js 给自己的介绍是“The React Framework”，没接触过的同学可能会有疑问？React 已经是一个框架了，为什么还要有 Next.js 呢？其实 Next.js 是为了互补 React 的不足，Next.js 提供了 CSR、SSR、SSG、ISR、 Streaming 这么多渲染方式，本文就从渲染方式方面来讲解，让我们可以更好地理解 Next.js 以及使用 Next.js。

### CSR（Client Side Rendering）

CSR 也就是客户端渲染，需要使用 JavaScript，调用接口（API）来获取数据，这种方式前后端完全分离。

比如现在有一个博客接口/api/articles，返回 JSON 数据如下

```js
[
  {"id":1,"title":"使用 Next.js 和掘金API 打造个性博客"},
  {"id":2,"title":"使用 Strapi 和 Next.js 开发简易微博"},
  {"id":3,"title":"使用 Notion 数据库进行 Next.js 应用全栈开发"}
]
```
常 React 项目会使用 create-react-app 来创建项目，我们会在useEffect 中请求数据。

```js
import { useState, useEffect } from "react";

function BlogList() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    fetch("/api/articles").then((res) => res.json()).then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    reload();
  }, []);

  if (!data && isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div>
      <div>
        <button disabled={isLoading} loading={isLoading} onClick={reload}>刷新</button>
      </div>
      {data.map((item) => (
        <div key={item.id}>
          <a href={`/blog/${item.id}`}>{item.title}</a>
        </div>
      ))}
    </div>
  );
}
```
上面的代码中，页面上还有一个刷新按钮，当数据新增时，接口接口会多返回一条数据，点击刷新按钮，页面上已经存在的 DOM 节点是不更新的，DOM 中只会插入新增的数据，这样我们就会感觉页面渲染很快。

这得益于 React 中引入了虚拟 dom，也就是将真实元素节点抽象成 JavaScript 对象，称之为 VNode，更新 DOM 前会先通过 VDOM 对比，得到要真实更新的 DOM，因此可以有效减少直接操作 dom 次数，从而提高程序性能。

Next.js 团队发布了另一个关于数据请求的 hooks 叫 swr，名字来自于 stale-while-revalidate，意思是过期就会重新验证，它有缓存，聚焦时重新验证，间隔轮询等功能。

与上面代码功能相同，我们可以改成下面代码：
```js
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function BlogList() {
  const { data, error } = useSWR("/api/articles", fetcher, { refreshInterval: 3000 });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <a href={`/blog/${item.id}`}>{item.title}</a>
        </div>
      ))}
    </div>
  );
}
```
在页面中，去除了刷新按钮，因为 swr 帮我们每隔 3 秒重新请求。整个过程中，刷新对应用户来说是无感知的，而看到的却是最新的数据。

**CSR 存在的问题**

基于 create-react-app 创建的应用，在 HTML 首次挂载的的时候仅有几个 DOM 节点，类似如下

```js
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" media="screen" href="/assets/css/index-fe9dd8655d2ba.css" />
</head>
<body>
    <div id="root"></div>
    <script src="/assets/js/main-d0bbfde89eb2a.js"></script>
</body>
</html>
```
这就会引起 2 个问题

1. 首次渲染，白屏时间过长；由于所有 JS 都打包在一个文件中，在这个 JS 加载完成之前，在页面上是看不到任何东西，这就会让用户感受到‘白屏’
2. 对于搜索引擎来说，只能在页面中发现一个 DOM 节点，不利于 SEO；因为搜索引擎是不支持执行 JavaScript 代码的。

### SSR（Server Side Rendering）

SSR 也就是服务端渲染，有些同学可能会问“难道要回到 PHP 或者 JSP 时代吗？”，没错 PHP 和 JSP 是服务端渲染，但 Next.js 的 SSR 不同于纯服务端渲染，也拥有着如 SPA 一样快速渲染的能力。传统的服务端渲染只有 HTML 字符串，缺少交互，比如有一个ClickCounter 组件

```js
// shared/components/ClickCounter.jsx
import React,{ useState } from 'react';

const ClickCounter = () => {
  const [count, setCount] = useState(0);
  return (
      <button onClick={() => setCount(count + 1)} > {count} Clicks </button>
  );
};
```
经过服务端渲染只能得到最简单的的 HTML。

```js
// server/index.js
import ReactDOMServer from "react-dom/server";
import express from "express";

require("node-jsx").install();

const app = express();

app.get("/", (req, res) => {
    const reactHtml = ReactDOMServer.renderToString(<ClickCounter />）
    const htmlTemplate = `<!DOCTYPE html>
    <html>
        <head>
            <title>Universal React server bundle</title>
        </head>
        <body>
            <div id="root">${reactHtml}</div>
            <script src="public/client.bundle.js"></script>
        </body>
    </html>`
    res.send(htmlTemplate)
});
```
打印出的 button 点击无效，传统的服务端渲染到此就结束了。而 react 服务端渲染，需要客户端根据服务端生成的页面，继续二次渲染、事件绑定等

```js
// client/index.jsx
import React from 'react';
import { hydrate } from 'react-dom';

hydrate(<ClickCounter />, document.getElementById('root'));
```
简化流程是：

1. 服务器端使用renderToString直接渲染出的页面信息为静态 html。
2. 客户端根据渲染出的静态 html 进行hydrate，做一些绑定事件等操作。

因此，若要使用 react 来实现服务端渲染，一般需要 3 个目录，工程配置比较繁琐。

- server： 包含 express 的后端工程
- client： 包含 react 的前端工程
- shared： 包含前后端公用的组件代码。

而在 Nextjs 中，只需要在 Pages 目录下，如下这么写，Next.js 便会自动打包出前后端的代码，拥有 hydrate 的能力

```js
import Link from "next/link";

export default function Page({ data }: PageProps) {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <Link href={`/blog/${item.id}`}><a>{item.title}</a></Link>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://localhost:3000/api/articles').then((res)=>res.json());

  return {
    props: { data: res },
  };
};
```
我们需要清楚的是:
- getServerSideProps 只在服务端执行
- Page 组件是在前后端公共执行

所以，在 Page 函数中要注意一些全局对象的使用，比如window对象（Node.js 中是不存在的，所以会报错）

```js
// ❎ 错误代码
export default function Page({ data }: PageProps) {
  return (
    <div style={{width: window.innerWidth}}>
    ...
    </div>
  );
}
```
我们应该将 window 操作放入 useEffect 中，或者 click 回调函数中，因为这些函数在服务端渲染的时候是自动忽略的。

SSR 解决了白屏问题和 SEO 问题，但是也不是完美的。

SSR 存在的问题
1. 当请求量增大时，每次重新渲染增加了服务器的开销。
2. 需要等页面中所有接口请求完成才可以返回 html，虽不是白屏，但完成hydrate之前，页面也是不可操作。

### SSG（Static Site Generation）

SSG 也就是静态站点生成，为了减缓服务器压力，我们可以在构建时生成静态页面，备注：Next.js 生成的静态页面与普通的静态页面是不一样的，也是拥有 SPA 的能力，切换页面用户不会感受到整个页面在刷新，可以访问我的博客体验。

比如文章列表页，要生成静态页面，在 Next.js 中代码如下：

```js
import Link from "next/link";

export default function Page({ data }: PageProps) {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <Link href={`/blog/${item.id}`}><a>{item.title}</a></Link>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://localhost:3000/api/articles').then((res)=>res.json());

  return {
    props: { data: res },
  };
};
```
使用getStaticProps 可以获得静态网页的数据，传递给 Page 函数，便可以生成静态页面。博客列表 URL 是固定的，那么不是固定 URL 的页面，要生成静态页面怎么办呢？比如博客详情页。

```js
// pages/blog/[id].tsx
export async function getStaticPaths() {
  const articles = await fetch('https://localhost:3000/api/articles').then((res)=>res.json());
  return {
    paths: articles.map((p) => ({
      params: {
        id: p.id.toString(),
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const res = await fetch(`https://localhost:3000/api/articles/${params.id}`).then((res)=>res.json());

  return {
    props: { data: res },
  };
};

export default function Page({ data }: PageProps) {
  return (
    <div>
      <h1>{data.tltle}</h1>
      <div>{data.content}</div>
    </div>
  );
}
```
我们可以使用 getStaticPaths 获得所有文章的路径，返回的paths 参数会传递给getStaticProps，在 getStaticProps中，通过 params 获得文章 id， Next.js 会在构建时，将paths 遍历生成所有静态页面。

SSG 的优点就是快，部署不需要服务器，任何静态服务空间都可以部署，而缺点也是因为静态，不能动态渲染，每添加一篇博客，就需要重新构建。

### ISR（Incremental Static Regeneration）

于是有了一另一种方案 ISR，增量静态生成，在访问时生成静态页面，在 Next.js 中，它比 SSG 方案只需要加了一个参数revalidate

```js
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://localhost:3000/api/articles').then((res)=>res.json());

  return {
    props: { data: res },
    revalidate: 20,
  };
};
```
上面代码表示，当访问页面时，发现 20s 没有更新页面就会重新生成新的页面，但当前访问的还是已经生成的静态页面，也就是：是否重新生成页面，需要根据上一次的生成时间来判断，并且数据会延迟 1 次。

我们可以在页面上显示生成时间

```js
function Time() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      setTime(time);
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, []);

  return <h1>当前时间：{time}</h1>;
}

export default function Page({ data, time }) {
  return (
    <div style={{ width: 500, margin: "0 auto" }}>
      <h1>
        页面生成时间：<span>{time}</span>
      </h1>
      <Time />
      {data.map((item) => (
        <div key={item.id}>
          <Link href={`/blog/${item.id}`}>{item.title}</Link>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps = async ({ params }) => {
  const res = await getList();

  const time = new Date().toLocaleTimeString();

  return {
    props: { data: res, time },
    revalidate: 20,
  };
};
```

上面代码中我们定义了一个 Time 组件，Time 在客户端渲染，每秒自动刷新。

本地使用运行yarn build和 yarn start 来模拟生成环境，测试增量生成。

![nextjs1](/assets/images/nextjs1.png)

上面是我的截图，我们可以多看到 20s 内重复刷新，页面生成时间是不变的，20s 后刷新，页面生成时间为新的生成时间。

列表页面可以增量生成，那么详情页呢？

若我们访问不存在的 id，比如 http://localhost:3000/blog/4，页面会显示 404。

getStaticPaths 方法中还有一个参数 fallback 用于控制未生成静态页面的渲染方式。

```js
// pages/blog/[id].js
import { useRouter } from 'next/router'

function Post({ post }) {
  const router = useRouter()

  // 如果页面还没静态生成，则先显示下面的loading
  // 直到 `getStaticProps()`运行完成
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Render ...
}

// 在构建时运行，获取全部文章路径
export async function getStaticPaths() {
  const articles = await fetch('https://localhost:3000/api/articles').then((res)=>res.json());
  return {
    paths: articles.map((p) => ({
      params: {
        id: p.id,
      },
    })),
    fallback: true,
  }
}
```
fallback 有 3 个值

- fallback: 'blocking' 未生成的页面使用服务端渲染;
- fallback: false 未生成的页面访问 404
- fallback: true 当访问的静态页面不存在时，会显示 loading，直到静态页面生成返回新的页面。

我们将 fallback 设置为 true，重新访问页面。

![nextjs2](/assets/images/nextjs2.png)

可以在左侧 .next/server 目录下，可以看到生成的静态文件，再次访问 http://localhost:3000/blog/4 后，可以看新生成了4.html.

revalidate会额外导致服务器性能开销，20s 生成一次页面是没必要的，比如一些博客网站和新闻网站，文章详情变更没那么频繁。

**On-demand Revalidation（按需增量生成）**

自从 next v12.2.0 开始支持按需增量生成，我们可以在 page 目录下新建一个 pages/api/revalidate.js接口，用于触发增量生成。
```js
// pages/api/revalidate.js

export default async function handler(req, res) {
  // 设置一个秘钥用于检查，访问合法性
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // path 为要触发的实际路径
    // e.g. for "/blog/[id]" this should be "/blog/5"
    await res.revalidate(req.query.path)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
```
比如我们在数据库中增加了 2 条数据，此时访问` https://localhost:3000/api/revalidate?secret=<token>&path=/blog/5`，便可以触发，生成新的静态页面了。

### Server component

Server component 是 React18 提供的能力， 与上面的 SSR 不同，相当于是流式 SSR。

传统 SSR 执行步骤

- 在服务器上，获取整个应用的数据。
- 在服务器上，将整个应用程序数据渲染为 HTML 并发送响应。
- 在浏览器上，加载整个应用程序的 JavaScript 代码。
- 在客户端，将 JavaScript 逻辑连接到服务端返回的 HTML（这就是“水合”）。

而以上每个步骤必须完成，才可以开始下一个步骤。

![nextjs3](/assets/images/nextjs3.png)

比如一个传统的博客页面采用 SSR 的方式使用 getServerSideProps 的方式渲染，那么就需要等 3 个接口全部返回才可以看到页面。

```js
export async function getServerSideProps() {
  const list = await getBlogList()
  const detail = await getBlogDetail()
  const comments = await getComments()

  return { props: { list,detail,comments } }
}
```

如果评论接口返回较慢，那么整个程序就是待响应状态。

我们可以在 Next.js 13 中开启 app 目录来，使用 Suspense开启流渲染的能力，将 Comments 组件使用 Suspense 包裹。

```js
import { SkeletonCard } from '@/ui/SkeletonCard';
import { Suspense } from 'react';
import Comments from './Comments';

export default function Posts() {
  return (
    <BlogList />
    <section>
     <BlogDetail />
      <Suspense
        fallback={
          <div className="w-full h-40 ">
            <SkeletonCard isLoading={true} />
          </div>
        }
      >
        <Comments />
      </Suspense>
    </section>
  );
}
```
组件数据请求使用 use API，就可以实现流渲染了。

```js
import { use } from 'react';

async function fetchComment(): Promise<string> {
  return fetch('http://www.example.com/api/comments').then((res)=>res.json())
}

export default function Comments() {
  let data = use(fetchComment());
  return (
    <section>
      {data.map((item)=><Item key={item.id}/>)}
    </section>
  );
}
```
整个渲染流程如下图。

![nextjs4](/assets/images/nextjs4.png)

- 灰色部分代表 HTML 字符串返回
- loading 状态表示当前部分还在请求
- 绿色部分代表注水成功，页面可以交互

如图所示，如果评论部分接口还在请求中，那么页面左侧注水完成，也是可以交互可以点击的。

因此，Server component 解决了 SSR 中的 3 个问题

- 不必在服务器上返回所有数据才开始返回 html，相反我们可以先返回一个 HTML 结构，相当于骨架屏。
- 不必等待所有 JavaScript 加载完毕才能开始补水。相反，我们可以利用代码拆分与服务器渲染结合使用，React 将在相关代码加载时对其进行水合。
- 不必等待所有组件水合完成，页面才可以交互。

想要了解更多关于Next.js 13的内容，可以查看《你好，Next.js 13》

### 小结

本文介绍了 Next.js 中的几种渲染模式

- CSR - 客户端渲染。也就是我们常说的 SPA（single page application），使用 useEffect 获取接口数据，优点是前端后端完全分离，静态部署，缺点是 JavaScript 过大，会造成“白屏”，网页初始 DOM 为空，不利于 SEO，适合开发一些后端管理系统。

- SSR - 服务器端渲染。优点是解决 SEO 和白屏问题，缺点是每次渲染都会请求服务器，会给服务器造成压力。

- SSG - 静态站点生成。在构建时获取数据，生成静态页面，只需要静态部署，适合开发一些数据不易变更的网站，比如开发文档。

- ISR – 增量静态再生。它是 SSG 和 SSR 的组合，主要是靠静态服务，但在数据过期时，可以再次从 API 获取数据，并且生成静态页面，最适合常见的资讯类、新闻类网站。

Server component- 也是 SSR 的一种， 但互补了 SSR 的不足，让网页拥有流式渲染的能力。


## 讲清楚 Next.js 里的 CSR, SSR, SSG 和 ISR

https://weijunext.com/article/fa1588d6-c068-40ec-a587-4572bd349b25


在 Web 前端的圈子里，渲染是一个无法绕开的概念。渲染决定了用户能够看到什么，以及他们能多快看到。但是，所有的渲染不都是相同的。随着现代前端开发的演进，我们有了多种不同的渲染方式，每种都有其独特的优势和挑战。

Next.js 作为 React 的上层框架，为开发者提供了一系列强大的渲染方式——`从传统的客户端渲染（CSR）到服务器端渲染（SSR），再到静态网站生成（SSG）和最新的增量静态生成（ISR）`：每一种方法都有其适用的场景。

思考一下，为什么我们需要这么多的渲染策略？它们之间有什么不同？如何为你的项目选择合适的策略？在本篇文章中，我们将详细探讨这些问题，一起来深入了解 Next.js 的渲染策略。

### 客户端渲染 (CSR)

`客户端渲染（CSR）是 React 应用程序的默认渲染策略。在 CSR 中，应用首次渲染会加载一个最小的 HTML 文件，其中包括负责渲染 DOM 的 JavaScript 文件。然后，由浏览器执行 JavaScript，从 API 获取数据并完成渲染`。

Next.js 中在 useEffect() 中请求数据就属于 CSR：
```js
import React, { useState, useEffect } from 'react'
 
export function Page() {
  const [data, setData] = useState(null)
 
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://nextjs.weijunext.com/data')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    }
 
    fetchData().catch((e) => {
      // handle the error as needed
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [])
 
  return <p>{data ? `Your data: ${data}` : 'Loading...'}</p>
}
```
这个示例中，在请求完成前会显示Loading，请求完成后就会把请求结果渲染到页面。

**优缺点**

优点：
- 服务器负载较轻，因为大部分工作都在客户端完成。
- 适用于高度交互的应用，如 SPA (单页应用)。
- 一旦页面加载完成，页面间的导航和互动会非常迅速。

缺点：
- 首次加载时间可能较长，因为需要下载、解析和执行大量 JavaScript。
- 不利于 SEO，因为搜索引擎可能只看到空的 HTML，而不是实际内容。
- 增加了客户端的计算负担，可能导致手机等低功耗设备的性能问题。

### 服务器端渲染 (SSR)

`Next.js 中，要使用服务器端渲染，需要导出一个名为 getServerSideProps 的异步函数。服务器将在每次请求页面时优先调用该函数`。

例如，假设页面需要预渲染频繁更新的数据（如下截图的页面访问量）。那你就可以编写 getServerSideProps 来获取这些数据并将其传递给页面

```js
export default function Page({ data }) {
  // Render data...
	<div>{data.view}</div>
}
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from API
  const res = await fetch(`/api/view`)
  const data = await res.json()
 
  // Pass data to the page via props
  return { props: { data } }
}
```
这个示例中，页面访问量的数据请求无法再浏览器控制台看到，因为`getServerSideProps是在服务端执行的`，页面渲染的时候就可以马上拿到访问量数据，不会像 CSR 那样有延迟。

**优缺点**

优点：
- 首次加载速度快，因为浏览器立即获得完整的页面内容。
- 有助于 SEO，因为搜索引擎可以直接爬取和索引完整的页面内容。
- 减轻了客户端的计算负担。

缺点：
- 服务器压力较大，尤其是在高流量情况下。
- 总体延迟可能增加，因为每次页面请求都需要服务器处理。
- 可能需要额外的服务器资源和优化

### 静态网站生成 (SSG)

如果页面静态网站生成 (SSG)，`页面 HTML 将在 build 时生成`。也就是说，如果你的页面已经发布到生产，这时想修改页面内容，`只能重新 build 来完成更新`。

Next.js 支持在 build 时生成带数据或者不带数据的 HTML，来看示例，

**不带数据的静态页面**
```js
function About() {
  return <div>About</div>
}
 
export default About
```

**带数据的静态页面**

带数据的静态页面又区分为两种，一种是页面内容依赖数据，一种是页面路径依赖数据。

1. 页面内容依赖数据

页面内容依赖数据，可以使用getStaticProps完成构建时的数据拉取

```js
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()
 
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```
`只要页面内使用了getStaticProps，那么 Next.js 都将在 build 时调用并获取数据，然后把数据传给客户端（即 Blog 组件），最后把客户端代码打包成 HTML`。

2. 页面路径依赖数据

页面路径依赖数据，要同时使用getStaticProps和getStaticPaths完成构建时的数据拉取。

假设你创建了一个动态路由文件 pages/posts/[id].js，路由会根据 id 显示博客文章，而这个 id 是什么是由服务端告知客户端的。

getStaticProps和getStaticPaths是这样联合使用的：
```js
export default function Post({ post }) {
  // Render post...
}
 
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()
 
  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))
 
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
 
// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()
 
  // Pass post data to the page via props
  return { props: { post } }
}
```
我们首先要使用getStaticPaths来获取需要预渲染的路径，然后再使用getStaticProps获取带有此 id 的博客文章，`这样 build 时就能完成依次调用getStaticPaths和getStaticProps来实现动态路由的静态页面渲染`。
SSG 无疑是几种渲染方式里最快的，所以你应该在较少变动数据的页面尽量使用 SSG。

**优缺点**

优点：
- 极快的加载速度，因为服务器仅提供预生成的文件。
- 减轻了服务器压力，因为不需要实时渲染。
- 非常适合内容不经常变动的网站或应用。

缺点：
- 不适合内容经常变动或需要实时更新的应用。
- 需要在内容变更时重新生成所有页面。
- 可能需要额外的构建和部署步骤。

### 增量静态生成 (ISR)

`增量静态再生（ISR）建立在 SSG 的基础上`，同时又有 SSR 的优点，`ISR 允许页面的某些部分是静态的，而其他部分则可以在数据发生变化时动态渲染`。ISR 在性能和内容更新之间取得了平衡，因此适用于内容经常更新的站点。

先来看一个示例：
```js
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
 
// This function gets called at build time on server-side.
// 该函数在在服务器端构建时调用
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()
 
  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 60 seconds
    // 当有请求时，60秒内，最多一次；Next.js将尝试重新生成这个page
    revalidate: 60, // In seconds
  }
}
 
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()
 
  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))
 
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}
 
export default Blog
```
`这个示例和 SSG 的示例大同小异，为什么能做到增量渲染呢？核心就在于revalidate和fallback`。

当我们使用 revalidate选项时，Next.js 会在 build 时调用一次getStaticProps，部署生产后，Next.js 还会在达到revalidate设置的时间间隔后再次运行getStaticProps，以此更新内容。（前提是有请求进来时吧）

`fallback则是用来决定当用户请求一个在构建时未被预渲染的路径时，Next.js 应当怎么处理。它有三种可选值：false、true 和 'blocking'`。

- fallback: false:
  - `当用户请求一个在构建时未被预渲染的路径时，将立即返回 404 页面`。
  - 这意味着如果路径不在getStaticPaths返回的列表中，用户会看到一个 404 错误。
- fallback: true:
  - 当用户请求一个未被预渲染的路径时，Next.js 会立即提供一个“fallback”版本的页面。这通常是一个空页面或一个加载状态。
  - 然后，Next.js 会在后台异步地运行getStaticProps来获取页面的数据，并重新渲染页面。一旦页面准备好，它将替换“fallback”版本。
  - 这允许页面几乎立即可用，但可能不显示任何实际内容，直到数据被加载并页面被渲染。
- fallback: 'blocking':
  - 当用户请求一个未被预渲染的路径时，Next.js 会等待getStaticProps完成并生成该页面，然后再提供给用户。
  - 这意味着用户会等待，直到页面准备好，但他们会立即看到完整的页面内容，而不是一个空页面或加载状态。

**优缺点**

优点：
- 结合了 SSR 的实时性和 SSG 的速度优势。
- 适合内容经常变动但不需要实时更新的应用。
- 减轻了服务器的压力，同时提供了实时内容。

缺点：
- 相比于 SSG，初次请求可能需要更长的加载时间。

### 如何选择合适的渲染策略建议

1. 高度交互的应用：如果你正在开发一个如单页应用（SPA）那样高度交互的应用，CSR 可能是最佳选择。一旦页面加载，用户的任何交互都将非常迅速，无需再次从服务器加载内容。
2. 需要 SEO 优化的应用：如果你的应用依赖于搜索引擎优化，SSR 或 SSG 是更好的选择。这两种方法都会提供完整的 HTML，有助于搜索引擎索引。
3. 内容静态但更新频繁的网站：例如博客或新闻网站，ISR 是一个很好的选择。它允许内容在背景中更新，而用户仍然可以快速访问页面。
4. 内容基本不变的网站：对于内容很少或根本不更改的网站，SSG 是最佳选择。一次生成，无需再次渲染，提供了最快的加载速度。
5. 混合内容的应用：Next.js 允许你在同一个应用中混合使用不同的渲染策略。例如，你可以使用 SSR 渲染首页，使用 SSG 渲染博客部分，而使用 CSR 渲染用户交互部分。

结语
CSR、SSR、SSG、ISR 这些看起来让人头疼的概念，实际上都有适合自己的场景，只要分析场景，结合文档使用就不会再迷茫。