# 基础

## 概念

webpack是一个JavaScript应用程序的静态模块打包器。当webpack处理应用程序时，它会递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。

*Webpack 从一个入口文件开始递归地分析模块的依赖关系，根据依赖关系将这些模块打包成一个或多个文件。
 1、从入口文件开始，递归查找文件，依赖分析，修改文件（核心），输出一系列文件。
 2、打包的过程就是修改文件的过程。

*支持所有的模块化
 可以对 ES6 模块、commonjs 模块、AMD 模块等所有标准的模块进行打包。
*code splitting
 可以将代码打成多个 chunk，按需加载，意味着我们的站点无需等待整个 js 资源下载完成之后才能交互，可以大大提升速度。
*强大灵活的插件系统 Webpack 提供了很多内置的插件，包括其自身也是架构在插件系统上可以满足所有的打包需求。
*loader 借助 loader 预处理非 js 资源，Webpack 可以打包所有的静态资源。

## Webpack构建过程？

https://juejin.cn/post/7236319311099265085

1. 解析配置文件：Webpack会读取项目根目录下的Webpack配置文件，解析其中的配置项，并根据配置项构建打包流程。
2. 解析模块依赖：Webpack会从entry配置中指定的入口文件开始，递归解析模块之间的依赖关系，并构建模块依赖图谱。
3. 加载模块：Webpack会根据模块依赖图谱，加载所有需要打包的模块，通过配置的loader将文件转换成Webpack可识别的模块。
4. 执行插件：Webpack会在打包流程中执行一系列插件，插件可以用于完成各种任务，例如生成HTML文件、压缩代码等等。
5. 输出打包结果：Webpack会将打包后的代码和资源输出到指定的输出目录，可以使用配置项进行相关设置。
6. 监听变化：在开发模式下，Webpack会在代码修改后重新构建打包流程，并将修改后的代码热更新到浏览器中。


## 基本概念

https://www.jianshu.com/p/53f370cc8c59

在了解Webpack原理前，需要掌握以下几个核心概念，以方便后面的理解：

- Entry：入口，Webpack执行构建的第一步将从Entry开始，可抽象成输入。
- Module：模块，在Webpack里一切皆模块，一个模块对应着一个文件。Webpack会从配置的Entry开始递归找出所有依赖的模块。
- Chunk：代码块，一个Chunk由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在Webpack构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

### 流程概括

Webpack的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和Shell语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译；
3. 确定入口：根据配置中的entry找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第4步使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变Webpack的运行结果。

### 流程细节

Webpack的构建流程可以分为以下三大阶段：

1. 初始化：启动构建，读取与合并配置参数，加载Plugin，实例化Compiler。
2. 编译：从Entry发出，针对每个Module串行调用对应的Loader去翻译文件内容，再找到该Module依赖的Module，递归地进行编译处理。
3. 输出：对编译后的Module组合成Chunk，把Chunk转换成文件，输出到文件系统。


## Webpack 本质是一个打包构建工具，我们不妨思考一下，它为我们做了什么。
1. 读取webpack.config.js配置文件，找到入口
2. 获取入口文件中的源代码 分析抽象语法树（babel实现）
3. 分析过程 静态分析代码执行上下文和使用情况, 标记是否Tree Shaking
4. 核心的loader 和 plugin 在读取配置过程中执行函数，tapable注入钩子函数
5. 最后输出在配置文件中的出口目录中
6. 使用 @babel/parser和@babel/traverse两个库分析源代码抽象语法树，找出所用模板依赖

## Compiler

```js
class Compiler {
  constructor(options) {
    // Webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }
  // 构建启动
  run() {
    // ...
  }
  // 重写 require 函数，输出 bundle
  generate() {
    // ...
  }
}
```

## Tapable

Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，Webpack 中最核心的负责编译的 Compiler 和负责创建 bundles 的 Compilation 都是 Tapable 的子类，并且实例内部的生命周期也是通过 Tapable 库提供的钩子类实现的。

## Webpack事件机制了解吗？

https://juejin.cn/post/7236319311099265085

Webpack常见的事件有：

- before-run: 在Webpack开始执行构建之前触发，可以用于清理上一次构建的临时文件或状态。
- run: 在Webpack开始执行构建时触发。
- before-compile: 在Webpack开始编译代码之前触发，可以用于添加一些额外的编译配置或预处理代码。
- compile: 在Webpack开始编译代码时触发，可以用于监听编译过程或处理编译错误。
- this-compilation: 在创建新的Compilation对象时触发，Compilation对象代表当前编译过程中的所有状态和信息。
- compilation: 在Webpack编译代码期间触发，可以用于监听编译过程或处理编译错误。
- emit: 在Webpack生成输出文件之前触发，可以用于修改输出文件或生成一些附加文件。
- after-emit: 在Webpack生成输出文件后触发，可以用于清理中间文件或执行一些其他操作。
- done: 在Webpack完成构建时触发，可以用于生成构建报告或通知开发者构建结果。

Webpack的事件机制是基于Tapable实现的，Tapable是Webpack事件机制的核心类，它封装了事件的订阅和发布机制。在Webpack中，Compiler对象和Compilation对象都是Tapable类的实例对象。


## 整个过程可大致分为三个步骤：初始化、编译、输出

| 初始化
这个阶段，webpack会将CLI参数、配置文件、默认配置 进行融合，形成一个最终配置对象（依托于第三方库yargs完成）。
（主要是为了接下来的编译阶段做必要准备，可以简单理解为初始化阶段主要用于产生一个最终的配置。）

| 编译
1 创建chunk
chunk：webpack在内部构建过程中的概念，块，表示通过某个入口找到所有依赖的统称
根据入口模块（默认为./src/index.js）创建一个chunk
每个chunk至少有两个属性：
* name：默认为main
* id：唯一编号，开发环境和name相同，生产环境是一个数字，从0开始

2 构建所有依赖模块
入口 —> 模块文件 —> 检测记录 —> 已记录则结束|未记录则继续 —> 读取文件内容 —> AST抽象语法树 —> 记录依赖 —> 保存到dependences —> 替换依赖函数 —> 保存转换后的模块代码 -> 根据依赖内容递归加载模块

chunk中的模块记录列表：
模块id            转换后的代码 
./src/index.js   xxxxx

3 第二步完成之后，chunk中会产生一个模块列表，其中包含了模块id和模块转换后的代码
接下来，webpack会根据配置为chunk生成一个资源列表 chunk assets，资源列表可以理解为是生成到最终文件的文件名和文件内容
chunk assets：
文件名               文件内容
./dist/main.js      xxxxx
./dist/main.js.map  xxxxx
注意：模块列表和资源列表有区别

chunk hash是根据所有chunk assets的内容生成的一个hash字符串
hash：一种算法，具体有很多类，特点是将一个任意长度的内容字符串转换成一个固定长度的字符串，可以保证原始内容不变，产生的hash字符串就不变

4 合并分割 chunk assets // 其实这里就是 splitChunk
将多个chunk的assets合并到一起，并产生一个hash

| 输出
webpack将利用node中的fs模块（文件处理模块），根据编译产生的总的assets，生成相应的文件。


## 如何优化 Webpack 的构建速度？
* 使用高版本的 Webpack 和 Node.js
* 多进程/多实例构建：HappyPack(不维护了)、thread-loader
* 压缩代码
    * 多进程并行压缩
        * webpack-paralle-uglify-plugin
        * uglifyjs-webpack-plugin 开启 parallel 参数 (不支持ES6)
        * terser-webpack-plugin 开启 parallel 参数
    * 通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。
* 图片压缩
    * 使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)
    * 配置 image-webpack-loader
* 缩小打包作用域：
    * exclude/include (确定 loader 规则范围)
    * resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
    * resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)
    * resolve.extensions 尽可能减少后缀尝试的可能性
    * noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)
    * IgnorePlugin (完全排除模块)
    * 合理使用alias
* 提取页面公共资源：
    * 基础包分离：
        * 使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中
        * 使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件
* DLL：
    * 使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。
    * HashedModuleIdsPlugin 可以解决模块数字id问题
* 充分利用缓存提升二次构建速度：
    * babel-loader 开启缓存
    * terser-webpack-plugin 开启缓存
    * 使用 cache-loader 或者 hard-source-webpack-plugin
* Tree shaking
    * 打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 开发中尽可能使用ES6 Module的模块，提高tree shaking效率
    * 禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking
    * 使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码
        * purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)
* Scope hoisting
    * 构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
    * 必须是ES6的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的ES6模块化语法
* 动态Polyfill
    * 建议采用 polyfill-service 只给用户返回需要的polyfill，社区维护。 (部分国内奇葩浏览器UA可能无法识别，但可以降级返回所需全部polyfill)
更多优化请参考官网-构建性能



## source map是什么？生产环境怎么用？✅

sourceMap是一项将编译、打包、压缩后的代码映射回源代码的技术，由于打包压缩后的代码并没有阅读性可言，一旦在开发中报错或者遇到问题，直接在混淆代码中 debug 会带来非常糟糕的体验， sourceMap 可以帮助我们快速定位到源代码的位置，提高我们的开发效率。

打包压缩后的代码不具备良好的可读性，它可以把编译、打包、压缩后的代码映射回源代码，想要调试源码就需要 soucre map。

map文件只要不打开开发者工具，浏览器是不会加载的。

开发环境：cheap-eval-source-map，生产这种source map速度最快，并且由于开发环境下没有代码压缩，所以不会影响断点调试

线上环境一般有三种处理方案：
* hidden-source-map：借助第三方错误监控平台 Sentry 使用
* nosources-source-map：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
* sourcemap：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)
注意：避免在生产中使用 inline- 和 eval-，因为它们会增加 bundle 体积大小，并降低整体性能。


## 聊一聊Babel原理吧✅

babel 可以将代码转译为想要的目标代码，并且对目标环境不支持的api 自动 polyfill。

Babel大概分为三大部分：

* 解析：将代码转换成 AST
    * 词法分析：将代码(字符串)分割为token流，即语法单元成的数组
    * 语法分析：分析token流(上面生成的数组)并生成 AST
    [将ES6+的解析生成为ES6+的AST]
* 转换：访问 AST 的节点进行变换操作生产新的 AST
     [把ES6+的AST转换为ES5+的AST]
    
* 生成：以新的 AST 为基础生成代码
 [最后再将这个AST转换为具体的ES5的代码]


原理简单说就是先将ES6+的解析生成为ES6+的AST，然后把ES6+的AST转换为ES5+的AST，最后再将这个AST转换为具体的ES5的代码

大多数JavaScript Parser遵循 estree 规范，Babel 最初基于 acorn 项目(轻量级现代 JavaScript 解析器) 
Taro就是利用 babel 完成的小程序语法转换

## 如何对bundle体积进行监控和分析？
VSCode 中有一个插件 Import Cost 可以帮助我们对引入模块的大小进行实时监测，还可以使用 webpack-bundle-analyzer 生成 bundle 的模块组成图，显示所占体积。
bundlesize 工具包可以进行自动化资源体积监控。

## 文件监听原理呢？✅

开启文件监听后，webpack会轮询访问文件的最后修改时间，当发现文件修改时间发生变化后，会先缓存起来等到aggregateTimeout再统一执行

在发现源码发生变化时，自动重新构建出新的输出文件。

Webpack开启监听模式，有两种方式：
* 启动 webpack 命令时，带上 --watch 参数
* 在配置 webpack.config.js 中设置 watch:true

缺点：每次需要手动刷新浏览器

原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout 后再执行。

```js
module.export = {
    // 默认false,也就是不开启
    watch: true,
    // 只有开启监听模式时，watchOptions才有意义
    watchOptions: {
        // 默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored: /node_modules/,
        // 监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout:300,
        // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
        poll:1000
    }
}
```

## 文件指纹是什么？怎么用？✅

https://juejin.cn/post/7138203576098095112

概念：文件指纹是指文件打包后的一连串后缀

作用：
- 版本管理：在发布版本时，通过文件指纹来区分 修改的文件 和 未修改的文件。
- 使用缓存：浏览器通过文件指纹是否改变来决定使用缓存文件还是请求新文件。

种类：
- Hash：和整个项目的构建相关，只要项目有修改（compilation实例改变），Hash就会更新
- Contenthash：和文件的内容有关，只有内容发生改变时才会修改
- Chunkhash：和webpack构架的chunk有关 不同的entry会构建出不同的chunk （不同 ChunkHash之间的变化互不影响）

如何使用：
- JS文件：使用Chunkhash 
- CSS文件：使用Contenthash 
- 图片等静态资源： 使用hash 

生产环境的output为了区分版本变动，通过Contenthash来达到清理缓存及时更新的效果，而开发环境中为了加快构建效率，一般不引入Contenthash


JS的文件指纹设置，设置 output 的 filename，用 chunkhash。
```js
module.exports = {
    entry: {
        app: './scr/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name][chunkhash:8].js',
        path:__dirname + '/dist'
    }
}
```
CSS的文件指纹设置，设置 MiniCssExtractPlugin 的 filename，使用 contenthash。
```js
module.exports = {
    entry: {
        app: './scr/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name][chunkhash:8].js',
        path:__dirname + '/dist'
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: `[name][contenthash:8].css`
        })
    ]
}
```

图片的文件指纹设置，设置file-loader的name，使用hash。
占位符名称及含义
* ext 资源后缀名
* name 文件名称
* path 文件的相对路径
* folder 文件所在的文件夹
* contenthash 文件的内容hash，默认是md5生成
* hash 文件内容的hash，默认是md5生成
* emoji 一个随机的指代文件内容的emoj
```js
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        filename:'bundle.js',
        path:path.resolve(__dirname, 'dist')
    },
    module:{
        rules:[{
            test:/\.(png|svg|jpg|gif)$/,
            use:[{
                loader:'file-loader',
                options:{
                    name:'img/[name][hash:8].[ext]'
                }
            }]
        }]
    }
}
```


## compiler 和 compilation 对象

在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。
compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

这两个组件是任何 webpack 插件不可或缺的部分（特别是 compilation），因此，开发者在阅读源码，并熟悉它们之后，会感到获益匪浅。

compiler对象是一个全局单例，他负责把控整个webpack打包的构建流程。 
compilation对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息.


## webpack 中，hash、chunkhash、contenthash 的区别是什么？

文件指纹是什么？怎么用？

文件指纹是打包后输出的文件名的后缀。

- Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- Chunkhash：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
- Contenthash：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

（1）JS的文件指纹设置

设置 output 的 filename，用 chunkhash。

```js
module.exports = {    
    entry: {        
        app: './scr/app.js',        
        search: './src/search.js'    
    },    
    output: {        
        filename: '[name][chunkhash:8].js',        
        path:__dirname + '/dist'    
    }
}
```
（2）CSS的文件指纹设置

设置 MiniCssExtractPlugin 的 filename，使用 contenthash。
```js
module.exports = {    
    entry: {        
        app: './scr/app.js',        
        search: './src/search.js'    
    },    
    output: {        
        filename: '[name][chunkhash:8].js',        
        path:__dirname + '/dist'    
    },    
    plugins:[        
        new MiniCssExtractPlugin({            
            filename: `[name][contenthash:8].css`        
        })    
    ]
}
```

## SCSS文件在webpack中的编译打包过程是怎么样的？

- 加载scss：sass-loader在js文件中根据模块化规则找到scss文件
- 编译scss：sass编译器将scss编译为css
- css-loader解析：根据css-loader对css文件进行加载并解析其中的@import和url()
- style-loader工作：将css样式插入html文件中

## npm run dev的时候webpack做了什么事情
执行 npm run dev 时候最先执行的 build/dev-server.js 文件，该文件主要完成下面几件事情：
1、检查node和npm的版本、引入相关插件和配置
2、webpack对源码进行编译打包并返回compiler对象
3、创建express服务器
4、配置开发中间件（webpack-dev-middleware）和热重载中间件（webpack-hot-middleware）
5、挂载代理服务和中间件
6、配置静态资源
7、启动服务器监听特定端口（8080）
8、自动打开浏览器并打开特定网址（localhost:8080）


