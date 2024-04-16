# Vite的常用插件

https://juejin.cn/post/7256723839941476412

- rollup-plugin-visualizer 打包分析插件
- vite-plugin-restart 通过监听文件修改，自动重启 vite 服务
- unplugin-vue-components 组件自动按需导入
- vite-plugin-style-import 自动引入引入样式，配合unplugin-vue-components
- unplugin-auto-import vue3等插件 hooks 自动引入
- vite-plugin-svg-icons 用于生成 svg 雪碧图，方便在项目中使用 .svg 文件
- vite-plugin-html 一个针对 index.html，提供压缩和基于 ejs 模板功能的 vite 插件，通过搭配 .env 文件，可以在开发或构建项目时，对 index.html 注入动态数据，例如替换网站标题
- vite-plugin-compression 使用 gzip 或者 brotli 来压缩资源
- vite-plugin-imagemin 打包压缩图片
- @vitejs/plugin-vue-jsx 此插件支持在vue3中使用jsx/tsx语法
- vite-plugin-vue-setup-extend setup语法糖name增强，使vue3语法糖支持name属性
- vitejs-plugin-legacy Vite默认的浏览器支持基线是原生ESM。该插件为不支持原生ESM的传统浏览器提供支持
- @vitejs/plugin-vue vite支持vue开发
- vite-plugin-vue-images 自动导入图像，同级目录的文件名不能重复！
- vue-global-api