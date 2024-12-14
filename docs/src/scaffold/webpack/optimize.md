# 优化

## 用 Webpack5 里有最新的优化指南✅

## Webpack怎么优化打包结果？
https://juejin.cn/post/7236319311099265085

优化打包结果的核心目标就是让打出来的包体积更小。

- 打包体积分析：使用webpack-bundle-analyzer来分析，一般脚手架里直接运行命令行就能生成打包体积图，很方便，然后可以根据包体积能定向优化。
- 代码压缩：使用UglifyJsPlugin、MiniCssExtractPlugin等插件来对JS代码和CSS代码进行压缩，减小代码体积，实际开发中一般脚手架也会默认有压缩的配置。
- 使用懒加载：可以使用Webpack的动态导入功能，实现懒加载，在需要时再加载代码块。这可以缩短首屏加载时间，提升体验。
- 开启gzip：使用compression-webpack-plugin插件，生成额外的gzip静态文件，然后部署时再开启Nginx的gzip即可。
- 使用splitChunks提取公共代码，在脚手架中一般是默认开启的。
- 分离第三方库：将第三方库从应用程序代码中分离出来，单独打包，这样可以提高缓存效率并减小应用程序代码的大小。
- 开启Tree Shaking，对于Vue和React项目，一般是默认开启Tree Shaking的，我们在编写代码时尽量使用ES模块化语法，就可以了。


## 如何用webpack来优化项目的性能

https://juejin.cn/post/7138203576098095112

说到优化，我们应该想到可以分为开发环境和生产环境的不同优化。

**开发环境**：开发环境我们需要的是更快的构建速度、模块热替换、更加友好的Source map

- 通过cache： { type: 'systemfile'}  开启缓存构建可以加快二次构建的效率
- 通过模块热替换可以做到局部更新变化，提高开发效率
- 根据设置 devtool： cheap-eval-source-map 在保证构建效率的同时又能进行代码调试
- 使用Thread-loader以多进程的方式运行资源加载逻辑
- 通过 stats 来分析性能做优化



**生产环境**：生产环境我们需要的是更小的体积，更稳定又快的性能

- 压缩代码：使用UglifyJsPlugin和ParallelUglifyPlugin来压缩代码 利用cssnano(css-loader? minimize)来压缩css
- 利用CDN：可以使用CDN来加快对静态资源的访问，提高用户的使用体验
- Tree Shaking: 删除没用到的代码
- 提取公共第三方库： 使用SplitChunksPlugin插件来进行公共模块抽取
- 使用TerserWebpackPlugin多进程执行代码压缩、uglify 功能


### 你知道哪些优化webpack构建的手段或者知识？

日常工作中如何优化webpack的配置来提高我们的性能！

使用高版本的 webpack 和node

多进程构建：使用thread-loader（HappyPack不维护了，这里不推荐）

使用Tree shaking 删除多余模块导出

使用Scope Hoisting合并模块

开启模块热替换

监控产物体积

缩小文件的搜索范围

设置环境，设置mode: production/development 可以开启对应的优化

代码压缩

使用CDN加速

使用缓存构建

使用DllPlugin：使用DllPlugin进行分包，使用 DllReferencePlugin引用mainfext.json , 通过将一些很少变动的代码先打包成静态资源，避免重复编译来提高构建性能

提取公共代码

使用splitChunkPlugin  提取公共代码，减少代码体积 （webpack3通过CommonsChunkPlugin）

动态Polyfill：使用polyfill-service只返回给用户需要的polyfill

使用可视化工具来分析性能

## 如何优化 Webpack 的构建速度？

https://juejin.cn/post/6844904094281236487

这个问题就像能不能说一说「从URL输入到页面显示发生了什么」一样
(我只想说：您希望我讲多长时间呢？)
(面试官：。。。)

1. 使用高版本的 Webpack 和 Node.js

2. 多进程/多实例构建：HappyPack(不维护了)、thread-loader

3. 压缩代码

多进程并行压缩

webpack-paralle-uglify-pluginuglifyjs-webpack-plugin 开启 parallel 参数 (不支持ES6)terser-webpack-plugin 开启 parallel 参数

通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。

4. 图片压缩

使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)

配置 image-webpack-loader

5. 缩小打包作用域：

exclude/include (确定 loader 规则范围)

resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)

esolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)

resolve.extensions 尽可能减少后缀尝试的可能性

noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)

IgnorePlugin (完全排除模块)合理使用alias

6. 提取页面公共资源：

基础包分离：

使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中

使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件

7. DLL：

使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。

HashedModuleIdsPlugin 可以解决模块数字id问题

8. 充分利用缓存提升二次构建速度：

babel-loader 开启缓存

terser-webpack-plugin 开启缓存

使用 cache-loader 或者 hard-source-webpack-plugin

9. Tree shaking

打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 

开发中尽可能使用ES6 Module的模块，提高tree shaking效率禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking

使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码

purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)

10. Scope hoisting

构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突

必须是ES6的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的ES6模块化语法

11. 动态Polyfill

建议采用 polyfill-service 只给用户返回需要的polyfill，社区维护。 (部分国内奇葩浏览器UA可能无法识别，但可以降级返回所需全部polyfill)

## 如何优化 Webpack 的构建速度？

1. 使用高版本的 Webpack 和 Node.js

2. 压缩代码

1）. 通过 uglifyjs-webpack-plugin 压缩JS代码

2）. 通过 mini-css-extract-plugin 提取 chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。

3. 多线程/多进程构建：thread-loader, HappyPack

4. 压缩图片: image-webpack-loader

5. 缩小打包作用域

1）. exclude/include (确定 loader 规则范围)

2）. resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)

3）. resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)

4）. resolve.extensions 尽可能减少后缀尝试的可能性

5）. noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)

6）. ignorePlugin (完全排除模块)

7）. 合理使用alias

6. 提取页面公共资源, 基础包分离

1）. 使用html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中。

2）. 使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件。

7. 充分利用缓存提升二次构建速度：

babel-loader 开启缓存

terser-webpack-plugin 开启缓存

使用 cache-loader 或者hard-source-webpack-plugin

8. Tree shaking

打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 开发中尽可能使用ES6 Module的模块，提高tree shaking效率

禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking

使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码

purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)

9. Scope hoisting

构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止变量名冲突。