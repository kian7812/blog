# Plugin

## 概念

插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

## plugin 的实现

https://juejin.cn/post/6871239792558866440

简单的说，一个具有 apply 方法的函数就是一个插件，并且它要监听 webpack 的某个事件。

我们看一下官网的定义，webpack 插件由以下部分组成：
1. 一个 JavaScript 命名函数。
2. 在插件函数的 prototype 上定义一个 apply 方法。
3. 指定一个绑定到 webpack 自身的事件钩子。
4. 处理 webpack 内部实例的特定数据。
5. 功能完成后调用 webpack 提供的回调。


下面来看一个简单的示例：
```js
function Plugin(options) { }

Plugin.prototype.apply = function (compiler) {
    // 所有文件资源都被 loader 处理后触发这个事件
    compiler.plugin('emit', function (compilation, callback) {
        // 功能完成后调用 webpack 提供的回调
        console.log('Hello World')
        callback()
    })
}

module.exports = Plugin
```
写完插件后要怎么调用呢？
先在 webpack 配置文件中引入插件，然后在 plugins 选项中配置：
```js
const Plugin = require('./src/plugin')

module.exports = {
	...
    plugins: [
        new Plugin()
    ]
}
```

## Compiler 和 Compilation

https://juejin.cn/post/6871239792558866440

webpack 在整个编译周期中会触发很多不同的事件，plugin 可以监听这些事件，并且可以调用 webpack 的 API 对输出资源进行处理。

这是它和 loader 的不同之处，loader 一般只能对源文件代码进行转换，而 plugin 可以做得更多。plugin 在整个编译周期中都可以被调用，只要监听事件。

对于 webpack 编译，有两个重要的对象需要了解一下：

Compiler 和 Compilation
在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

这两个组件是任何 webpack 插件不可或缺的部分（特别是 compilation），因此，开发者在阅读源码，并熟悉它们之后，会感到获益匪浅。

## 常见的Plugin

1.有哪些常见的Plugin？你用过哪些Plugin？
(这大兄弟好像听上瘾了，继续开启常规操作)
* define-plugin：定义环境变量 (Webpack4 之后指定 mode 会自动配置)
* ignore-plugin：忽略部分文件
* html-webpack-plugin：简化 HTML 文件创建 (依赖于 html-loader)
* web-webpack-plugin：可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
* uglifyjs-webpack-plugin：不支持 ES6 压缩 (Webpack4 以前)
* terser-webpack-plugin: 支持压缩 ES6 (Webpack4)
* webpack-parallel-uglify-plugin: 多进程执行代码压缩，提升构建速度
* mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)
* serviceworker-webpack-plugin：为网页应用增加离线缓存功能
* clean-webpack-plugin: 目录清理
* ModuleConcatenationPlugin: 开启 Scope Hoisting
* speed-measure-webpack-plugin: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)
* webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)
更多 Plugin 请参考官网


4.使用webpack开发时，你用过哪些可以提高效率的插件？
(这道题还蛮注重实际，用户的体验还是要从小抓起的)
* webpack-dashboard：可以更友好的展示相关打包信息。
* webpack-merge：提取公共配置，减少重复配置代码
* speed-measure-webpack-plugin：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。
* size-plugin：监控资源体积变化，尽早发现问题
* HotModuleReplacementPlugin：模块热替换

## 如何编写Plugin

https://juejin.cn/post/7138203576098095112

我们都知道Plugin是通过监听webpack构建过程中发布的hooks来实施对应的操作从而影响更改构建逻辑以及生成的产物，而在这个过程中compiler和compilation可以说是最核心的两个对象了，其中compiler可以暴露了整个构建流程的200+个hooks，而compilation则暴露了更细粒度的hooks。

compiler对象是一个全局单例，代表了webpack从开启到关闭的整个生命周期，负责启动编译和监听文件，而compilation是每次构建过程的上下文对象，包含当次构建所需要的信息

每次热更新和重新编译都会创建一个新的compilation对象，compilation对象只代表当次编译

我们都知道插件是通过监听webpack构建过程中发布的hooks从而在特定阶段去执行特定功能来达到改变构建逻辑以及产物的目的，而这些都离不开tapable （一个专门用于处理各种发布订阅的库 有同步异步、熔断、循环、瀑布流等钩子）

讲完plugin的前置知识，接下来就让我们正式开始学习如何开发插件

1. 插件是通过监听webpack发布的hooks来工作的

根据这个特性，我们的plugin一定是一个函数或者一个包含apply（） 的对象，这样才可以监听compiler 对象

2. 传递给插件的compiler  和compilation 都是同一个引用

根据此特性，我们知道我们的插件是会影响到其他插件的，所以我们在编写插件的时候应该分析会对其他插件造成啥影响

3. 基于tapable来完成对hooks的复杂的订阅以及响应

    - 编译过程的特定节点会分发特定钩子，插件可以通过这些钩子来执行对应的操作
    - 通过 tapable的回调机制以参数形式传递上下文信息
    - 可以通过上下文的众多接口来影响构建流程

4. 监听一些具有特定意义的hook来影响构建

    - compiler.hooks.compilation:webpack刚启动完并创建compilation对象后触发
    - compiler.hooks.make:webpack开始构建时触发
    - compiler.hooks.done:webpack 完成编译时触发，此时可以通过stats对象得知编译过程中的各种信息

5. 善于使用开发工具

使用schema-utils用于校验参数（关于schema-utils的使用方法读者可以自行查阅）



6. 正确处理插件日志信息以及插件信息

    - 使用 stats汇总插件的统计数据
    - 使用 ProgressPlugin插件的 reportProgress接口上报执行进度
    - 通过 compilation.getLogger获取分级日志管理器
    - 使用 compilation.errors/warining处理异常信息（eslint-webpack-plugin的做法）

7. 测试插件

    - 通过分析compilation.error/warn 数组来判断webpack是否运行成功
    - 分析构建产物判断插件功能是否符合预期

以上便是如何编写plugin所需的知识和常规流程，建议可以阅读一些插件例如eslint-webpack-plugin / DefinePlugin 等插件的源码来更深入地学习插件开发的知识和流程


## 是否写过Plugin？简单描述一下编写Plugin的思路？ 

基本概念：

插件其本质是一个Class类，原型上配有apply方法。
webpack在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在特定的阶段钩入想要添加的自定义功能。
Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好（Webpack的事件机制基于webpack自己实现的一套Tapable事件流方案）。

Webpack Plugin 的工作原理：

1. Webpack 读取配置的过程中，会先执行 new HelloPlugin(options) 初始化一个 HelloPlugin 获得其实例
2. 初始化 compiler 对象后，调用 HelloPlugin.apply() 给插件实例传入 compiler 对象
3. 插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(事件名称, 回调函数) 监听到 Webpack 广播出来的事件，并且可以通过 compiler 对象去操作 Webpack

* compiler 暴露了和 Webpack 整个生命周期相关的钩子
* compilation 暴露了与模块和依赖有关的粒度更小的事件钩子
* 传给每个插件的 compiler 和 compilation对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件
* 找出合适的事件点去完成想要的功能
    * emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
    * watch-run 当依赖的文件发生变化时会触发
* 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

示例：
```js
class HelloPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {
    // ...
  }
  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在 emit 阶段插入钩子函数，用于特定时机处理额外的逻辑
    compiler.hooks.emit.tap('HelloPlugin', compilation => {
      // 在功能流程完成后可以调用 Webpack 提供的回调函数
    });
    // 如果事件是异步的，会带两个参数，第二个参数为回调函数，在插件处理完成任务时需要调用回调函数通知 Webpack，才会进入下一个处理流程
    compiler.plugin('emit', function(compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack
      // 如果不执行 callback，运行流程将会一致卡在这不往下执行
      callback();
    });
  }
}
module.exports = HelloPlugin;
```

使用插件时，引入插件类，实例化放到 Webpack 的 Plugins 数组配置中：
```js
const HelloPlugin = require('./hello-plugin.js');
module.exports = {
  plugins: [new HelloPlugin({ options: true })],
};
```

## Webpack原理—编写Loader和Plugin

https://www.jianshu.com/p/c021b78c9ef2

**编写Plugin**

Webpack通过Plugin机制让其更加灵活，以适应各种应用场景。 在Webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过Webpack提供的API改变输出结果。

一个最基础的Plugin的代码是这样的：

```js
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    compiler.plugin('compilation',function(compilation) {
    })
  }
}
// 导出 Plugin
module.exports = BasicPlugin;
```
在使用这个Plugin时，相关配置代码如下：

```js
const BasicPlugin = require('./BasicPlugin.js');
module.export = {
  plugins:[
    new BasicPlugin(options),
  ]
}
```
Webpack启动后，在读取配置的过程中会先执行new BasicPlugin(options)初始化一个BasicPlugin获得其实例。 在初始化compiler对象后，再调用basicPlugin.apply(compiler)给插件实例传入compiler对象。 插件实例在获取到compiler对象后，就可以通过compiler.plugin(事件名称, 回调函数)监听到Webpack广播出来的事件。 并且可以通过compiler对象去操作Webpack。

**Compiler和Compilation**

在开发Plugin时最常用的两个对象就是Compiler和Compilation，它们是Plugin和Webpack之间的桥梁。Compiler和Compilation的含义如下：

- Compiler对象包含了Webpack环境所有的的配置信息，包含options，loaders，plugins这些信息，这个对象在Webpack启动时候被实例化，它是全局唯一的，可以简单地把它理解为Webpack实例；
- Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等。当Webpack以开发模式运行时，每当检测到一个文件变化，一次新的Compilation将被创建。Compilation对象也提供了很多事件回调供插件做扩展。通过Compilation也能读取到Compiler对象。

Compiler和Compilation的区别在于：Compiler代表了整个Webpack从启动到关闭的生命周期，而Compilation只是代表了一次新的编译。

**事件流**

Webpack就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

Webpack通过Tapable来组织这条复杂的生产线。 Webpack在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack的事件流机制保证了插件的有序性，使得整个系统扩展性很好。
Webpack的事件流机制应用了观察者模式，和Node.js中的EventEmitter非常相似。Compiler和Compilation都继承自Tapable，可以直接在Compiler和Compilation对象上广播和监听事件，方法如下：

```js
/**
* 广播出事件
* event-name 为事件名称，注意不要和现有的事件重名
* params 为附带的参数
*/
compiler.apply('event-name',params);

/**
* 监听名称为 event-name 的事件，当 event-name 事件发生时，函数就会被执行。
* 同时函数中的 params 参数为广播事件时附带的参数。
*/
compiler.plugin('event-name',function(params) {

});
```

同理，compilation.apply和compilation.plugin使用方法和上面一致。
在开发插件时，你可能会不知道该如何下手，因为你不知道该监听哪个事件才能完成任务。
在开发插件时，还需要注意以下两点：

- 只要能拿到Compiler或Compilation对象，就能广播出新的事件，所以在新开发的插件中也能广播出事件，给其它插件监听使用。
- 传给每个插件的Compiler和Compilation对象都是同一个引用。也就是说在一个插件中修改了Compiler或Compilation对象上的属性，会影响到后面的插件。
- 有些事件是异步的，这些异步的事件会附带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知Webpack，才会进入下一处理流程。例如：

```js
compiler.plugin('emit',function(compilation, callback) {
  // 支持处理逻辑
  // 处理完毕后执行 callback 以通知 Webpack 
  // 如果不执行 callback，运行流程将会一直卡在这不往下执行 
  callback();
});
```

**常用API**

插件可以用来修改输出文件、增加输出文件、甚至可以提升Webpack性能、等等，总之插件通过调用 Webpack提供的API能完成很多事情。 由于Webpack提供的API非常多，有很多API很少用的上，又加上篇幅有限，下面来介绍一些常用的API。

**读取输出资源、代码块、模块及其依赖**

有些插件可能需要读取Webpack的处理结果，例如输出资源、代码块、模块及其依赖，以便做下一步处理。

在emit事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。 插件代码如下：

```js
class Plugin {
  apply(compiler) {
    compiler.plugin('emit', function (compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function (module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function (filepath) {
          });
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    })
  }
}
```

**监听文件变化**

Webpack会从配置的入口模块出发，依次找出所有的依赖模块，当入口模块或者其依赖的模块发生变化时， 就会触发一次新的Compilation。

在开发插件时经常需要知道是哪个文件发生变化导致了新的Compilation，为此可以使用如下代码：

```js
// 当依赖的文件发生变化时会触发 watch-run 事件
compiler.plugin('watch-run', (watching, callback) => {
    // 获取发生变化的文件列表
    const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
    // changedFiles 格式为键值对，键为发生变化的文件路径。
    if (changedFiles[filePath] !== undefined) {
      // filePath 对应的文件发生了变化
    }
    callback();
});
```
默认情况下Webpack只会监视入口和其依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个HTML文件。 由于 JavaScript 文件不会去导入HTML文件，Webpack就不会监听HTML文件的变化，编辑HTML文件时就不会重新触发新的Compilation。 为了监听HTML文件的变化，我们需要把HTML文件加入到依赖列表中，为此可以使用如下代码：

```js
compiler.plugin('after-compile', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
    compilation.fileDependencies.push(filePath);
    callback();
});
```

**修改输出资源**

有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听emit事件，因为发生emit事件时所有模块的转换和代码块对应的文件已经生成好， 需要输出的资源即将输出，因此emit事件是修改Webpack输出资源的最后时机。

所有需要输出的资源会存放在compilation.assets中，compilation.assets是一个键值对，键为需要输出的文件名称，值为文件对应的内容。

设置compilation.assets的代码如下：

```js
compiler.plugin('emit', (compilation, callback) => {
  // 设置名称为 fileName 的输出资源
  compilation.assets[fileName] = {
    // 返回文件内容
    source: () => {
      // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
      return fileContent;
      },
    // 返回文件大小
      size: () => {
      return Buffer.byteLength(fileContent, 'utf8');
    }
  };
  callback();
});
```

读取compilation.assets的代码如下：

```js
compiler.plugin('emit', (compilation, callback) => {
  // 读取名称为 fileName 的输出资源
  const asset = compilation.assets[fileName];
  // 获取输出资源的内容
  asset.source();
  // 获取输出资源的文件大小
  asset.size();
  callback();
});
```
**判断Webpack使用了哪些插件**

在开发一个插件时可能需要根据当前配置是否使用了其它某个插件而做下一步决定，因此需要读取Webpack当前的插件配置情况。 以判断当前是否使用了ExtractTextPlugin为例，可以使用如下代码：

```js
// 判断当前配置使用使用了 ExtractTextPlugin，
// compiler 参数即为 Webpack 在 apply(compiler) 中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置所有使用的插件列表
  const plugins = compiler.options.plugins;
  // 去 plugins 中寻找有没有 ExtractTextPlugin 的实例
  return plugins.find(plugin=>plugin.__proto__.constructor === ExtractTextPlugin) != null;
}
```

**实战**

下面我们去实现一个插件。
该插件的名称取名叫EndWebpackPlugin，作用是在Webpack即将退出时再附加一些额外的操作，例如在Webpack成功编译和输出了文件后执行发布操作把输出的文件上传到服务器。 同时该插件还能区分Webpack构建是否执行成功。使用该插件时方法如下：

```js
module.exports = {
  plugins:[
    // 在初始化 EndWebpackPlugin 时传入了两个参数，分别是在成功时的回调函数和失败时的回调函数；
    new EndWebpackPlugin(() => {
      // Webpack 构建成功，并且文件输出了后会执行到这里，在这里可以做发布文件操作
    }, (err) => {
      // Webpack 构建失败，err 是导致错误的原因
      console.error(err);        
    })
  ]
}
```
要实现该插件，需要借助两个事件：

- done：在成功构建并且输出了文件后，Webpack即将退出时发生；
- failed：在构建出现异常导致构建失败，Webpack即将退出时发生；

实现该插件非常简单，完整代码如下：

```js
class EndWebpackPlugin {
  constructor(doneCallback, failCallback) {
    // 存下在构造函数中传入的回调函数
    this.doneCallback = doneCallback;
    this.failCallback = failCallback;
  }

  apply(compiler) {
    compiler.plugin('done', (stats) => {
        // 在 done 事件中回调 doneCallback
        this.doneCallback(stats);
    });
    compiler.plugin('failed', (err) => {
        // 在 failed 事件中回调 failCallback
        this.failCallback(err);
    });
  }
}
// 导出插件 
module.exports = EndWebpackPlugin;
```
从开发这个插件可以看出，找到合适的事件点去完成功能在开发插件时显得尤为重要。Webpack在运行过程中广播出常用事件，你可以从中找到你需要的事件。