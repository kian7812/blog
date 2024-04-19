# Routing

## app 路由约定

路由文件

- layout .js .jsx .tsx - 布局
- page .js .jsx .tsx - 页面
- loading .js .jsx .tsx - 加载 UI
- not-found .js .jsx .tsx - 未找到页面 UI
- error .js .jsx .tsx - 错误 UI
- global-error .js .jsx .tsx - 全球错误 UI
- route .js .ts - API 端点
- template .js .jsx .tsx - 重新渲染的布局
- default .js .jsx .tsx - 平行路由备用页面

嵌套路由

- folder/ - 路由片段
- folder/folder/ - 嵌套路由片段

动态路由

- [folder] - 动态路由片段
- [...folder] - 捕获所有路由片段
- [[...folder]] - 可选的捕获所有路由片段

路由组和私有文件夹

- (folder) - 不影响路由的路由组
- _folder - 让该文件夹及其所有子片段退出路由

平行路由和拦截路由

- @folder - 命名插槽
- (.)folder - 拦截同一层级
- (..)folder - 拦截上一层级
- (..)(..)folder - 拦截两层以上
- (...)folder - 从根部拦截
