# Vite

## Vite

https://juejin.cn/post/7207659644487893051#heading-25

## 如何指定 vite 插件 的执行顺序？

可以使用 enforce 修饰符来强制插件的位置:

pre：在 Vite 核心插件之前调用该插件
post：在 Vite 构建插件之后调用该插件

###  Vite是否支持 commonjs 写法？

纯业务代码，一般建议采用 ESM 写法。如果引入的三方组件或者三方库采用了 CJS 写法，vite 在预构建的时候就会将 CJS 模块转化为 ESM 模块。

### 为什么说 vite 比 webpack 要快

- vite 不需要做全量的打包
- vite 在解析模块依赖关系时，利用了 esbuild，更快（esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍）
- 按需加载：在HMR（热更新）方面，当改动了一个模块后，vite 仅需让浏览器重新请求该模块即可，不像 webpack 那样需要把该模块的相关依赖模块全部编译一次，效率更高。
- 由于现代浏览器本身就支持 ES Module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像 webpack 那样进行打包合并。
- 按需编译：当浏览器请求某个模块时，再根据需要对模块内容进行编译，这种按需动态编译的方式，极大的缩减了编译时间。
- webpack 是先打包再启动开发服务器，vite 是直接启动开发服务器，然后按需编译依赖文件。由于 vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。

### vite 对比 webpack ，优缺点在哪？

（1）优点：

- 更快的冷启动： Vite 借助了浏览器对 ESM 规范的支持，采取了与 Webpack 完全不同的 unbundle 机制
- 更快的热更新： Vite 采用 unbundle 机制，所以 dev server 在监听到文件发生变化以后，只需要通过 ws 连接通知浏览器去重新加载变化的文件，剩下的工作就交给浏览器去做了。

（2）缺点：

- 开发环境下首屏加载变慢：由于 unbundle 机制， Vite 首屏期间需要额外做其它工作。不过首屏性能差只发生在 dev server 启动以后第一次加载页面时发生。之后再 reload 页面时，首屏性能会好很多。原因是 dev server 会将之前已经完成转换的内容缓存起来
- 开发环境下懒加载变慢：由于 unbundle 机制，动态加载的文件，需要做 resolve 、 load 、 transform 、 parse 操作，并且还有大量的 http 请求，导致懒加载性能也受到影响。
- webpack支持的更广：由于 Vite 基于ES Module，所以代码中不可以使用CommonJs；webpack更多的关注兼容性, 而 Vite 关注浏览器端的开发体验。


当需要打包到生产环境时，Vite使用传统的rollup进行打包，所以，vite的优势是体现在开发阶段，缺点也只是在开发阶段存在。

### Vite和webpack的区别
Vite 和 Webpack 都是现代化的前端构建工具，它们可以帮助开发者优化前端项目的构建和性能。虽然它们的目标是相似的，但它们在设计和实现方面有许多不同之处。

两者原理图：

区别如下：
（1）构建原理： Webpack 是一个静态模块打包器，通过对项目中的 JavaScript、CSS、图片等文件进行分析，生成对应的静态资源，并且可以通过一些插件和加载器来实现各种功能；Vite 则是一种基于浏览器原生 ES 模块解析的构建工具。
（2）打包速度： Webpack 的打包速度相对较慢，Vite 的打包速度非常快。
（3）配置难度： Webpack 的配置比较复杂，因为它需要通过各种插件和加载器来实现各种功能；Vite 的配置相对简单，它可以根据不同的开发场景自动配置相应的环境变量和配置选项。
（4）插件和加载器： Webpack 有大量的插件和加载器可以使用，可以实现各种复杂的构建场景，例如代码分割、按需加载、CSS 预处理器等；Vite 的插件和加载器相对较少
（5）Vite是按需加载，webpack是全部加载： 在HMR（热更新）方面，当改动了一个模块后，vite仅需让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。
（6）webpack是先打包再启动开发服务器，vite是直接启动开发服务器，然后按需编译依赖文件 由于vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译，这种按需动态编译的方式，极大的缩减了编译时间。

### Vite 常见的配置

https://juejin.cn/post/7207659644487893051

（1）css.preprocessorOptions： 传递给 CSS 预处理器的配置选项，例如，我们可以定义一个全局变量文件，然后再引入这个文件：

（2）css.postcss： PostCSS 也是用来处理 CSS 的，只不过它更像是一个工具箱，可以添加各种插件来处理 CSS（解决浏览器样式兼容问题、浏览器适配等问题）。例如：移动端使用 postcss-px-to-viewport 对不同设备进行布局适配：

（3）resolve.alias： 定义路径别名也是我们常用的一个功能，我们通常会给 scr 定义一个路径别名：

（4）resolve.extensions： 导入时想要省略的扩展名列表。默认值为 ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'] 。

（5）optimizeDeps.force： 是否开启强制依赖预构建。node_modules 中的依赖模块构建过一次就会缓存在 node_modules/.vite/deps 文件夹下，下一次会直接使用缓存的文件。而有时候我们想要修改依赖模块的代码，做一些测试或者打个补丁，这时候就要用到强制依赖预构建。
javascript复制代码

（6）server.host： 指定服务器监听哪个 IP 地址。默认值为 localhost ，只会监听本地的 127.0.0.1。

（7）server.proxy： 反向代理也是我们经常会用到的一个功能，通常我们使用它来解决跨域问题：

（8）base： 开发或生产环境服务的公共基础路径。

（9）build.outdir： 指定打包文件的输出目录，默认值为 dist。

（10）build.assetsDir： 指定生成静态资源的存放目录，默认值为 assets。

（11）build.assetsInlineLimit： 图片转 base64 编码的阈值。为防止过多的 http 请求，Vite 会将小于此阈值的图片转为 base64 格式，可根据实际需求进行调整。

（12）plugins： 插件相信大家都不陌生了，我们可以使用官方插件，也可以社区插件。


## Vite为什么快呢？快在哪？说一下我自己的理解吧

https://juejin.cn/post/7040750959764439048


**1. 启动**

Vite在打包的时候，将模块分成两个区域依赖和源码：

- 依赖：一般是那种在开发中不会改变的JavaScript，比如组件库，或者一些较大的依赖（可能有上百个模块的库），这一部分使用esbuild来进行预构建依赖,esbuild使用的是 Go 进行编写，比 JavaScript 编写的打包器预构建依赖快 10-100倍
- 源码：一般是哪种好修改几率比较大的文件，例如JSX、CSS、vue这些需要转换且时常会被修改编辑的文件。同时，这些文件并不是一股脑全-部加载，而是可以按需加载（例如路由懒加载）。Vite会将文件转换后，以es module的方式直接交给浏览器，因为现在的浏览器大多数都直接支持es module，这使性能提高了很多，为什么呢？咱们看下面两张图：

第一张图，是以前的打包模式，就像之前举的index.js、add.js、sub.js的例子，项目启动时，需要先将所有文件打包成一个文件bundle.js，然后在html引入，这个多文件 -> bundle.js的过程是非常耗时间的。

![0](/assets/images/vite0.webp)

第二张图，是Vite的打包方式，刚刚说了，Vite是直接把转换后的es module的JavaScript代码，扔给支持es module的浏览器，让浏览器自己去加载依赖，也就是把压力丢给了浏览器，从而达到了项目启动速度快的效果。

![1](/assets/images/vite1.webp)

**2. 更新**

刚刚说了，项目启动时，将模块分成依赖和源码，当你更新代码时，依赖就不需要重新加载，只需要精准地找到是哪个源码的文件更新了，更新相对应的文件就行了。这样做使得更新速度非常快。

Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 304 Not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求。


## 什么是ES Modules？

通过使用 export 和 import 语句，ES Modules 允许在浏览器端导入和导出模块。

当使用 ES Modules 进行开发时，开发者实际上是在构建一个依赖关系图，不同依赖项之间通过导入语句进行关联。

主流浏览器（除IE外）均支持ES Modules，并且可以通过在 script 标签中设置 type="module"来加载模块。默认情况下，模块会延迟加载，执行时机在文档解析之后，触发DOMContentLoaded事件前。

## 底层语言的差异

Webpack 是基于 Node.js 构建的，而 Vite 则是基于 esbuild 进行预构建依赖。esbuild 是采用 Go 语言编写的，Go 语言是纳秒级别的，而 Node.js 是毫秒级别的。因此，Vite 在打包速度上相比Webpack 有 10-100 倍的提升。

##  什么是预构建依赖？

预构建依赖通常指的是在项目启动或构建之前，对项目中所需的依赖项进行预先的处理或构建。这样做的好处在于，当项目实际运行时，可以直接使用这些已经预构建好的依赖，而无需再进行实时的编译或构建，从而提高了应用程序的运行速度和效率。

## 热更新的处理

在 Webpack 中，当一个模块或其依赖的模块内容改变时，需要重新编译这些模块。

而在 Vite 中，当某个模块内容改变时，只需要让浏览器重新请求该模块即可，这大大减少了热更新的时间。

## 面试官快问快答：webpack VS vite 

https://juejin.cn/post/7219567168316276796

**核心理念 — bundle与否**

- webpack使用Node.js 编写的打包器从入口点开始逐步构建一个依赖图，然后将项目中所需的模块组合成一个或多个bundle文件，即逐级递归识别依赖，构建依赖图谱 ；

- vite无需进行bundle操作，源文件之间的依赖关系通过浏览器对ESM规范的支持来解析，将应用中的模块区分为 依赖(node_modules) 和 源码(项目代码) 两类；
  - 依赖：使用esbuild预构建，esbuild使用Go编写，比以Node.js编写的打包器预构建依赖快10-100倍；
  - 源码：在浏览器请求时按需转换并以原生ESM方式提供源码，让浏览器接管了打包程序的部分工作；

**首屏、懒加载性能**

- 由于webpack本身是经过了漫长的bundle过程，得到了一个完整的模块关系依赖包，所以不存在这两个方面的问题；

- 而vite由于unbundle机制，首屏、懒加载会存在一定的问题，处理时需要额外做以下工作：
  - 由于未对源文件做合并捆绑操作，导致大量的http请求；
  - 动态加载的文件需要对源文件进行转换操作：resolve、load、transform、parse；
  - 预构建、二次预构建操作也会阻塞首屏请求，直到预构建完成为止；
  - 但是由于缓存的存在，当第一次加载完成(预构建)之后，再次reload的时候性能会有较大的提升 ;

**服务启动速度**

- webpack需要先把所有的模块建立依赖关系打包成一个大文件，速度相对较慢；

- vite将应用中的模块区分为 依赖(node_modules) 和 源码(项目代码) 两类，进行预构建，速度会快很多；
  - 依赖：使用esbuild预构建，esbuild使用Go编写，比以Node.js编写的打包器预构建依赖快10-100倍；
    - 初次预构建完成后，会在node_modules中生成 .vite文件，后期不需要再次进行依赖的预构建；
  - 源码：在浏览器请求时按需转换并以原生ESM方式提供源码，让浏览器接管了打包程序的部分工作；
    - 由于是按需提供，所以在首屏、懒加载方面相比于webpack会存在一定的差异；

**热更新速度**

- webpack：
  - 编辑文件后将重新构建文件本身;
  - 显然我们不应该重新构建整个包，因为这样更新速度会随着应用体积增长而直线下降；
  - 所以打包器支持了动态模块热重载HMR(Hot Module Replacing)，而对页面其余部分没有影响，这较大的提升了开发体验；
  - 然而，在实践中发现即使是HMR，更新速度也会随着应用规模的增长而显著下降；

vite：

- 在vite中，HMR是在原生ESM上执行的，当编辑一个文件时，只需要精确地使已编辑的模块与其最近的 HMR边界之间的链失效(大多数时候只需要模块本身)，使HMR更新始终快速，无论应用的大小；

- vite同时利用HTTP头来加速整个页面的重新加载(再次让浏览器为我们做更多事情)：

源码模块的请求会根据304 Not Modified进行协商缓存；
![2](/assets/images/vite2.webp)
依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable进行强缓存;
![3](/assets/images/vite3.webp)

**prod环境打包区别**

- webpack在生产环境的构建方面更加成熟，bundle整体形成完善的依赖关系，也有非常多的loader或者plugin可供选择；

- vite在生产环境的构建目前用的Rollup：

vite在生产环境，如果使用ESM会存在大量额外网络请求问题：
  - 尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下 ；
  - 最好的方式还是代码进行 tree-shaking、懒加载、和 chunk 分隔等；

使用 rollup打包而不是速度惊人的esbuild，这是因为esbuild针对构建应用的重要功能仍然还在持续开发中 —— 特别是代码分割和css处理方面，rollup在应用打包方面更加的成熟且灵活；

当未来这些功能稳定后，也不排除使用 esbuild 作为生产构建器的可能；

**生态成熟度**

webpack拥有一个庞大的生态系统，有非常多优秀的loader和plugin可供选择(毕竟是老大哥)；
vite生态成熟度目前不如webpack，但也在很大程度上满足常规开发所需，赶上也只是时间问题；

**总结：**

vite 的核心理念就是借助浏览器原生 ES Modules 能力，当浏览器发出请求时，为浏览器按需提供 ES Module 文件，浏览器获取 ES Module 文件会直接执行，即使首次启动的预构建也是使用速度惊人的esbuild完成，虽然存在一些小的问题（例如：首屏、懒加载性能），但瑕不掩瑜，速度、效率、体验已非webpack可比，我自己在最近的项目工作中也是使用的vite(项目从0到1)，感觉nice。


## Vite原理浅析
https://juejin.cn/post/7273646418208751671

**预处理依赖**

Vite 使用 esbuild 预构建依赖。esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

**基于ESM的Dev server**

Vite利用浏览器对ESM的支持，当 import 模块时，浏览器就会下载被导入的模块。先启动开发服务器，当代码执行到模块加载时再请求对应模块的文件，本质上实现了动态加载。灰色部分是暂时没有用到的路由，所有这部分不会参与构建过程。

随着项目里的应用越来越多，增加route，也不会影响其构建速度。

![1](/assets/images/vite1.webp)

**对于浏览器不能直接识别的文件，如tsx，scss。Vite怎么处理？**

在读取到index.tsx文件的内容之后，Vite会对文件的内容进行编译成浏览器可以识别的代码，与此同时，一个import语句即代表一个HTTP请求，Vite Dev Server会读取本地文件，返回浏览器可以解析的代码，当浏览器解析到新的import语句，又会发出新的请求，以此类推，直到所有的资源都加载完成。
![4](/assets/images/vite4.webp)

对于scss这些样式预处理文件，Vite会编译成浏览器可以识别的遵循ESM的js文件。
![vite5](/assets/images/vite5.webp)

**Vite中热更新**

Vite中热更新构建过程也是类似，Vite是在本地启动Vite Server服务，通过WebSocket与浏览器进行连接通信，并加入了WebSocket的定时心跳检测机制，拿到已修改更新的文件路径以及时间戳标识，然后再次带上这个时间戳作为参数去重新请求该文件修改后的版本，防止缓存。
![vite6](/assets/images/vite6.webp)

**利用浏览器缓存**

Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：

源码模块的请求会根据 304 Not Modified 进行协商缓存

依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求。


## 五个常见的Vite 面试题给你整理好

https://juejin.cn/post/7162096443832926244

### 为什么说 vite 比 webpack 要快

使用 webpack 时，从 yarn start 命令启动，到最后页面展示，需要经历的过程：

1. 以 entry 配置项为起点，做一个全量的打包，并生成一个入口文件 index.html 文件；
2. 启动一个 node 服务；
3. 打开浏览器，去访问入 index.html，然后去加载已经打包好的 js、css 文件；

在整个工作过程中，最重要的就是第一步中的全量打包，中间涉及到构建 module graph (涉及到大量度文件操作、文件内容解析、文件内容转换)、chunk 构建，这个需要消耗大量的时间。尽管在二次启动、热更新过程中，在构建 module graph 中可以充分利用缓存，但随着项目的规模越来越大，整个开发体验也越来越差。

![vite0](/assets/images/vite0.webp)

使用 vite 时， 从 vite 命令启动，到最后的页面展示，需要经历的过程：

1. 使用 esbuild 预构建依赖，提前将项目的第三方依赖格式化为 ESM 模块；
2. 启动一个 node 服务；
3. 打开浏览器，去访问 index.html；
4. 基于浏览器已经支持原生的 ESM 模块, 逐步去加载入口文件以及入口文件的依赖模块。浏览器发起请求以后，dev server 端会通过 middlewares 对请求做拦截，然后对源文件做 resolve、load、transform、parse 操作，然后再将转换以后的内容发送给浏览器。

在第四步中，vite 需要逐步去加载入口文件以及入口文件的依赖模块，但在实际应用中，这个过程中涉及的模块的数量级并不大，需要的时间也较短。而且在分析模块的依赖关系时， vite 采用的是 esbuild，esbuild 使用 Go 编写，比以 JavaScript 编写的打包器预构建依赖快 10-100 倍（webpack 就是采用 js 
![vite1](/assets/images/vite1.webp)

综上，开发模式下 vite 比 webpack 快的原因：

1. vite 不需要做全量的打包，这是比 webpack 要快的最主要的原因；
2. vite 在解析模块依赖关系时，利用了 esbuild，更快（esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍）；
3. 按需加载；模块之间的依赖关系的解析由浏览器实现。Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。
4. 充分利用缓存；Vite 利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 304 Not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求。

