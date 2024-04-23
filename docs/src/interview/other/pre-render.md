# 预渲染

背景，首先做好seo，搜索引擎爬虫可以更好的爬取网页的meta信息、关键词、title、语义化标签内容等，在搜索结果中的展示就更合理；

由于vue、React等spa单页面应用矿建，都是通过js动态渲染的，所以对爬虫不友好，

本插件基于 [prerender-spa-plugin]完成渲染，流程是在 webpack 构建成功时，调用 [Puppeteer]进行渲染页面