# Loader

## loader & plugin✅

Webpack 本质是一个事件流机制的打包构建工具，从读取配置到分析语法树注册事件流输出文件的一个过程。其核心的`loader 本质也是一个可以获取到源代码的一个函数，plugin则是一个可以获取到整个事件生命周期的一个类`。

loader 的处理顺序是自下向上的，即先用 loader1 处理源码，然后将处理后的代码再传给 loader2。
loader 其实是一个函数，它的参数是匹配文件的源码，返回结果是处理后的源码。

## 说一说Loader和Plugin的区别？

区别一：

- loader 运行在打包文件之前
- plugins 在整个编译周期都起作用

区别二：

- loader 在 module.rules 中配置，类型为数组。每一项都是 Object，包含了 test、use 等属性
- Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 实例，参数都通过构造函数传入

区别三：

在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过Webpack 提供的 API 改变输出结果

对于 loader，实质是一个转换器，将A文件进行编译形成B文件，操作的是文件，比如将 A.scss 转变为 B.css ，单纯的文件转换过程

Loader主要负责将代码转译为webpack 可以处理的JavaScript代码，而 Plugin 更多的是负责通过接入webpack 构建过程来影响构建过程以及产物的输出，Loader的职责相对比较单一简单，而Plugin更为丰富多样

**那你再说一说Loader和Plugin的区别？**
- Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。
因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
- Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
- Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
- Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

**Loader和Plugin的不同？**

不同的作用

Loader直译为"加载器"。Webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到loader。 所以Loader的作用是让webpack拥有了加载和解析非JavaScript文件的能力。

Plugin直译为"插件"。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

不同的用法

Loader在module.rules中配置，也就是说他作为模块的解析规则而存在。 类型为数组，每一项都是一个Object，里面描述了对于什么类型的文件（test），使用什么加载(loader)和使用的参数（options）

Plugin在plugins中单独配置。 类型为数组，每一项是一个plugin的实例，参数都通过构造函数传入。

## 如何编写Loader

https://juejin.cn/post/7138203576098095112

这也是面试官喜欢问的问题，而我们大部分人别说写了，可能连用都没咋用过，所以问这个问题更多是为了了解你对loader这方面的知识掌握程度，毕竟只有当你足够了解loader的知识，你才有自己编写loader的可能，那接下来我们就按照从loader的特性来分析如何编写loader这个思路来讲解

1. loader支持链式调用，上一个loader的执行结果会作为下一个loader的入参。

根据这个特性，我们知道我们的loader想要有返回值，并且这个返回值必须是标准的JavaScript字符串或者AST代码结构，这样才能保证下一个loader的正常调用。

2. loader的主要职责就是将代码转译为webpack可以理解的js代码。

根据这个特性，loader内部一般需要通过return / this.callback来返回转换后的结果

3. 单个loader一把只负责单一的功能。

根据这个特性，我们的loader应该符合单一职责的原则，尽量别让单个loader执行太多职责

4. 善于利用开发工具

loader-utils： loader-utils 是一个非常重要的 Loader 开发辅助工具，为开发中提供了诸如读取配置、requestString的序列化和反序列化、getOptions/getCurrentRequest/parseQuery等核心接口....等等功能，对于loader的开发十分有用

schema--utils：schema-utils是用于校验用户传入loader的参数配置的校验工具，也是在开发中十分有用

5. loader是无状态的

根据此特性，我们不应该在loader保存状态

6. webpack默认缓存loader的执行结果

webpack会默认缓存loader的执行结果直到资源/所依赖的资源发生变化 如果想要loader不缓存 可以通过this.cacheble 显式声明不做缓存

7. Loader接收三个参数

    - source： 资源输入 对于第一个执行的loader为资源文件的内容 后续执行的loader则为前一个loader的执行结果 也可能是字符串 或者是代码的AST结构
    - sourceMap： 可选参数 代码的sourcemap结构
    - data： 可选参数 其他需要在Loader链中传递的信息

8. 正确上报loader的异常信息

    - 一般尽量使用logger.error 减少对用户的干扰
    - 对于需要明确警示用户的错误 优先使用 this.emitError
    - 对于已经严重到不能继续往下编译的错误 使用 callback

9. loader函数中的this 由webpack提供 并且指向了loader-runtime的loaderContext 对象

可以通过this来获取loader需要的各种信息 Loader Context提供了许多实用的接口，我们不仅可以通过这些接口获取需要的信息，还可以通过这些接口改变webpack的运行状态（相当于产生 Side Effect）

10. loader由pitch和normal两个阶段

根据此特性，我们可以在pitch阶段预处理一些操作

webpack会按照 use 定义的顺序从前往后执行Pitch Loader 从后往前执行Normal Loader 我们可以将一些预处理的逻辑放在Pitch中

11. 正确处理日志 使用 Loader Context``的getLogger接口（支持verbose/log/info/warn/error 五种级别的日志 用户可以通过infrastructureLogging.level 配置项筛选不同日志内容 ）

12. 充分调试你编写的loader

创建出webpack实例 并运行loader
获取loader执行结果 对比、分析判断是否符合预期
判断执行过程中是否出错

以上便是开发loader需要的知识以及常规步骤，相信答出这些内容后，面试官变不会再为难你了！说完如何开发loader，接下来就趁热打铁讲解一下如何开发plugin


## 常见的Loader

* raw-loader：加载文件原始内容（utf-8）
* file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
* url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
* source-map-loader：加载额外的 Source Map 文件，以方便断点调试
* svg-inline-loader：将压缩后的 SVG 内容注入代码中
* image-loader：加载并且压缩图片文件
* json-loader 加载 JSON 文件（默认包含）
* handlebars-loader: 将 Handlebars 模版编译成函数并返回
* babel-loader：把 ES6 转换成 ES5
* ts-loader: 将 TypeScript 转换成 JavaScript
* awesome-typescript-loader：将 TypeScript 转换成 JavaScript，性能优于 ts-loader
* sass-loader：将SCSS/SASS代码转换成CSS
* css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
* style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
* postcss-loader：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
* eslint-loader：通过 ESLint 检查 JavaScript 代码
* tslint-loader：通过 TSLint检查 TypeScript 代码
* mocha-loader：加载 Mocha 测试用例的代码
* coverjs-loader：计算测试的覆盖率
* vue-loader：加载 Vue.js 单文件组件
* i18n-loader: 国际化
* cache-loader: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里


注：this 应该是当前webpack编译
注：content只有两种格式 string | Buffer

## loader

https://www.jianshu.com/p/c4c02a9b4221

loader用于对模块的源代码进行转换。

loader可以使你在import或"加载"模块时预处理文件。

loader可以将文件从不同的语言转换为JavaScript，或将内联图像转换为data URL。loader甚至允许你直接在JavaScript模块中import CSS文件！

loader让webpack能够去处理那些非JavaScript文件（webpack自身只理解JavaScript）。

loader可以将所有类型的文件转换为webpack能够处理的有效模块，然后你就可以利用webpack的打包能力，对它们进行处理。

本质上，webpack loader将所有类型的文件，转换为应用程序的依赖图（和最终的bundle）可以直接引用的模块。

loader能够import导入任何类型的模块，这是webpack特有的功能。

在webpack的配置中loader有两个目标：
- test属性，用于标识出应该被对应的loader进行转换的某个或某些文件。
- use属性，表示进行转换时，应该使用哪个loader。

loader特性

- loader支持链式传递。能够对资源使用流水线。一组链式的loader将按照`相反`的顺序执行。loader链中的第一个loader返回值给下一个loader。在最后一个loader，返回webpack所预期的JavaScript。
- loader可以是同步的，也可以是异步的。
- loader运行在Node.js中，并且能够执行任何可能的操作。
- loader接收查询参数。用于对loader传递配置。
- loader也能够使用options对象进行配置。
- 除了使用package.json常见的main属性，还可以将普通的npm模块导出为loader，做法是在package.json里定义一个loader字段。
- 插件可以为loader带来更多特性。
- loader能够产生额外的任意文件。

## 是否写过Loader？简单描述一下编写loader的思路？

简单来说 Loader 是一个可以获取你入口文件源代码的函数，函数本身参数就是源代码。
Webpack 调用Loader把文件内容传进去，Loader对内容进行操作，操作完成Loader结束，把操作后的内容返回。
Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情。
Loader 运行在 Node.js 中，我们可以调用任意 Node.js 自带的 API 或者安装第三方模块进行调用。
Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下 Loader 处理二进制文件时，需要通过 exports.raw = true 告诉 Webpack 该 Loader 是否需要二进制数据。

使用 loader-utils 和 schema-utils 工具，例如在 Loader 中获取用户传入的 options，通过 loader-utils 的 getOptions 方法获取。

Loader 有同步和异步之分，如果需异，执行 var callback = this.async() 告诉 Webpack 本次转换是异步的，Loader 会在 callback 回调中返回结果。 
尽可能的异步化 Loader，如果计算量很小，同步也可以。

缓存加速

在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。为此，Webpack 会默认缓存所有 Loader 的处理结果，也就是说在需要被处理的文件或者其他依赖的文件没有发生变化时，是不会重新调用对应的 Loader 去执行转换操作的。
如果你想让 Webpack 不缓存该 Loader 的处理结果，可以这样：
```js
module.exports = function(source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  return source;
};
```

Loader 是无状态的，我们不应该在 Loader 中保留状态。

loader函数中的this上下文由webpack提供，可以通过this对象提供的相关属性，获取当前loader需要的各种信息数据，事实上，这个this指向了一个叫loaderContext的loader-runner特有对象。
```js
module.exports = function(source) {
    const content = doSomeThing2JsString(source);
    
    // 如果 loader 配置了 options 对象，那么this.query将指向 options
    const options = this.query;
    
    // 可以用作解析其他模块路径的上下文
    console.log('this.context');
    
    /*
     * this.callback 参数：
     * error：Error | null，当 loader 出错时向外抛出一个 error
     * content：String | Buffer，经过 loader 编译后需要导出的内容
     * sourceMap：为方便调试生成的编译后内容的 source map
     * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
     */
    this.callback(null, content);
    // or return content;
}
```

## Webpack原理—编写Loader和Plugin

https://www.jianshu.com/p/c021b78c9ef2


**编写 Loader**

Loader就像是一个翻译员，能把源文件经过转化后输出新的结果，并且一个文件还可以链式的经过多个翻译员翻译。
以处理SCSS文件为例：

1. SCSS源代码会先交给sass-loader把SCSS转换成CSS；
2. 把sass-loader输出的CSS交给css-loader处理，找出CSS中依赖的资源、压缩CSS等；
3. 把css-loader输出的CSS交给style-loader处理，转换成通过脚本加载的JavaScript代码；

可以看出以上的处理过程需要有顺序的链式执行，先sass-loader再css-loader再style-loader。 以上处理的Webpack相关配置如下：

```js
module.exports = {
  module: {
    rules: [
      {
        // 增加对 SCSS 文件的支持
        test: /\.scss/,
        // SCSS 文件的处理顺序为先 sass-loader 再 css-loader 再 style-loader
        use: [
          'style-loader',
          {
            loader:'css-loader',
            // 给 css-loader 传入配置项
            options:{
              minimize:true, 
            }
          },
          'sass-loader'],
      },
    ]
  },
};
```

**Loader的职责**

由上面的例子可以看出：一个Loader的职责是单一的，只需要完成一种转换。 如果一个源文件需要经历多步转换才能正常使用，就通过多个Loader去转换。 在调用多个Loader去转换一个文件时，每个Loader会链式的顺序执行， 第一个Loader将会拿到需处理的原内容，上一个Loader处理后的结果会传给下一个接着处理，最后的Loader将处理后的最终结果返回给Webpack。

所以，在你开发一个Loader时，请保持其职责的单一性，你只需关心输入和输出。

**Loader基础**

由于Webpack是运行在Node.js之上的，一个Loader其实就是一个Node.js模块，这个模块需要导出一个函数。 这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。

一个最简单的Loader的源码如下：
```js
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该`Loader`没有做任何转换
  return source;
};
```
由于Loader运行在Node.js中，你可以调用任何Node.js自带的API，或者安装第三方模块进行调用：

```js
const sass = require('node-sass');
module.exports = function(source) {
  return sass(source);
};
```

**Loader进阶**

Webpack还提供一些API供Loader调用。

**获得Loader的options**

在最上面处理SCSS文件的Webpack配置中，给css-loader传了options参数，以控制css-loader。要在自己编写的Loader中获取到用户传入的options，需要这样做：

```js
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return source;
};
```
**返回其它结果**

上面的Loader都只是返回了原内容转换后的内容，但有些场景下还需要返回除了内容之外的东西。

例如以用babel-loader转换ES6代码为例，它还需要输出转换后的ES5代码对应的Source Map，以方便调试源码。 为了把Source Map也一起随着ES5代码返回给Webpack，可以这样写：

```js
module.exports = function(source) {
  // 通过 this.callback 告诉 Webpack 返回的结果
  this.callback(null, source, sourceMaps);
  // 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined，
  // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中 
  return;
};
```

其中的this.callback是Webpack给Loader注入的API，以方便Loader和Webpack之间通信。this.callback的详细使用方法如下：

```js
this.callback(
    // 当无法转换原内容时，给 Webpack 返回一个 Error
    err: Error | null,
    // 原内容转换后的内容
    content: string | Buffer,
    // 用于把转换后的内容得出原内容的 Source Map，方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
    // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
    abstractSyntaxTree?: AST
);
```
Source Map的生成很耗时，通常在开发环境下才会生成Source Map，其它环境下不用生成，以加速构建。 为此Webpack为Loader提供了this.sourceMap API去告诉Loader当前构建环境下用户是否需要Source Map。

**同步与异步**

Loader有同步和异步之分，上面介绍的Loader都是同步的Loader，因为它们的转换流程都是同步的，转换完成后再返回结果。 但在有些场景下转换的步骤只能是异步完成的，例如你需要通过网络请求才能得出结果，如果采用同步的方式网络请求就会阻塞整个构建，导致构建非常缓慢。

在转换步骤是异步时，你可以这样：

```js
module.exports = function(source) {
    // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
    var callback = this.async();
    someAsyncOperation(source, function(err, result, sourceMaps, ast) {
        // 通过 callback 返回异步执行后的结果
        callback(err, result, sourceMaps, ast);
    });
};
```

**处理二进制数据**

在默认的情况下，Webpack传给Loader的原内容都是UTF-8格式编码的字符串。 但有些场景下Loader不是处理文本文件，而是处理二进制文件，例如file-loader，就需要Webpack给Loader传入二进制格式的数据。 为此，你需要这样编写Loader：

```js
module.exports = function(source) {
    // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
    source instanceof Buffer === true;
    // Loader 返回的类型也可以是 Buffer 类型的
    // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果
    return source;
};
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 
module.exports.raw = true;
```
以上代码中最关键的代码是最后一行module.exports.raw = true;，没有该行Loader只能拿到字符串。

**缓存加速**

在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。为此，Webpack会默认缓存所有Loader的处理结果，也就是说在需要被处理的文件或者其依赖的文件没有发生变化时， 是不会重新调用对应的Loader去执行转换操作的。

如果想让Webpack不缓存该Loader的处理结果，可以这样：

```js
module.exports = function(source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  return source;
};
```

**其它Loader API**

除了以上提到的在Loader中能调用的Webpack API外，还存在以下常用API：
```
this.context：当前处理文件的所在目录，假如当前Loader处理的文件是/src/main.js，则this.context就等于/src。
this.resource：当前处理文件的完整请求路径，包括querystring，例如/src/main.js?name=1。
this.resourcePath：当前处理文件的路径，例如/src/main.js。
this.resourceQuery：当前处理文件的querystring。
this.target：等于Webpack配置中的Target。
this.loadModule：当Loader在处理一个文件时，如果依赖其它文件的处理结果才能得出当前文件的结果时， 就可以通过this.loadModule(request: string, callback: function(err, source, sourceMap, module))去获得request对应文件的处理结果。
this.resolve：像require语句一样获得指定文件的完整路径，使用方法为resolve(context: string, request: string, callback: function(err, result: string))。
this.addDependency：给当前处理文件添加其依赖的文件，以便再其依赖的文件发生变化时，会重新调用Loader处理该文件。使用方法为addDependency(file: string)。
this.addContextDependency：和addDependency类似，但addContextDependency是把整个目录加入到当前正在处理文件的依赖中。使用方法为addContextDependency(directory: string)。
this.clearDependencies：清除当前正在处理文件的所有依赖，使用方法为clearDependencies()。
this.emitFile：输出一个文件，使用方法为emitFile(name: string, content: Buffer|string, sourceMap: {...})。
```

**加载本地Loader**

Npm link

ResolveLoader

**实战**

接下来从实际出发，来编写一个解决实际问题的Loader。
该Loader名叫comment-require-loader，作用是把JavaScript代码中的注释语法

```
// @require '../style/index.css'

转换成

require('../style/index.css');
```
该Loader的使用方法如下：
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['comment-require-loader'],
        // 针对采用了 fis3 CSS 导入语法的 JavaScript 文件通过 comment-require-loader 去转换 
        include: [path.resolve(__dirname, 'node_modules/imui')]
      }
    ]
  }
};
```
该Loader的实现非常简单，完整代码如下：
```js
function replace(source) {
    // 使用正则把 // @require '../style/index.css' 转换成 require('../style/index.css');  
    return source.replace(/(\/\/ *@require) +(('|").+('|")).*/, 'require($2);');
}
module.exports = function (content) {
    return replace(content);
};
```
