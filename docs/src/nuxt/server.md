# 服务器

## 服务器引擎/介绍

https://www.nuxt.com.cn/docs/getting-started/introduction

Nuxt的服务器引擎Nitro开启了全新的全栈能力。

在开发中，它使用Rollup和Node.js工作线程来处理你的服务器代码和上下文隔离。它还通过读取`server/api/`中的文件生成你的服务器API，以及读取`server/middleware/`中的文件生成服务器中间件。

在生产中，Nitro将你的应用程序和服务器构建为一个通用的`.output`目录。这个输出是轻量级的：经过压缩，并且不包含任何Node.js模块（除了polyfills）。你可以将此输出部署到支持JavaScript的任何系统上，包括**Node.js、无服务器（Serverless）、Workers、边缘渲染或纯静态环境**。

## 服务器引擎/关键概念

https://www.nuxt.com.cn/docs/guide/concepts/server-engine

Nuxt 3由一款新的服务器引擎Nitro驱动。

- API层
- 直接调用API
- 类型化的API路由
- 独立服务器

## 服务器/开始使用

https://www.nuxt.com.cn/docs/getting-started/server

1. 由Nitro驱动，使用Nitro给予Nuxt超能力：
    - 对应用程序的服务器端部分拥有完全控制权
    - 在任何提供者上进行通用部署（许多无需配置）
    - 混合渲染（渲染能力是Nitro提供呗）

## server/目录

https://www.nuxt.com.cn/docs/guide/directory-structure/server

server/目录用于在应用程序中注册API和服务器处理程序。

1. ~/server/api
2. ~/server/routes
3. ~/server/middleware
4. ~/server/plugins
5. ~/server/utils
6. ~/server/tsconfig.json

其它：参数、HTTP方法、请求体、查询、错误处理、状态码、Cookie、存储等等。