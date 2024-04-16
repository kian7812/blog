# TreeShaking

## 概念

- Tree Shaking可以用来剔除JavaScript中用不上的死代码（一个文件中）。
- 它依赖静态的ES6模块化语法， 因为ES6模块化语法是静态的。
- 如果你采用ES5中的模块化，例如module.export={...}、require(x+y)、if(x){require('./util')}，Webpack无法分析出哪些代码可以剔除。
- Webpack只是指出了哪些函数用上了哪些没用上（打标记），要剔除用不上的代码还得经过UglifyJS去处理一遍。 或者其他方式

## Tree shaking的原理

（笔记·Tree shaking）

webpack的treeshking是基于 es module的静态分析，能够在编译期间就确定哪些模块用到了哪些模块没用到，并且配合解构赋值还能确定哪些export用到了，哪些export没用到。然后对用到的部分和没用到的部分进行标记，在压缩阶段就可以删除标记出的没有用到的部分，从而达到treeshking的目的。

## 了解过Tree-shaking吗？

概念：Tree-shaking又叫摇树优化，是通过静态分析消除JS模块中未使用的代码，减小项目体积。

原理：Tree-shaking依赖于ES6的模块机制，因为ES6模块是静态的，编译时就能确定模块的依赖关系。对于非ES6模块的代码或者动态引入的代码，无法被消除掉。

配置：Tree-Shaking需要配置optimization选项中的usedExports为true，同时在babel配置中使用babel-preset-env，开启modules选项为false，这样可以保证ES6模块在编译时不会被转换为CommonJS模块。


## Tree shaking的原理✅

https://juejin.cn/post/7138203576098095112

**什么是 Tree shaking？**

Tree-Shaking 是一种基于 ES Module 规范的 Dead Code Elimination 技术，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化。

**使用 Tree shaking**，使用 Tree shaking的三个必要条件
- 使用ESM规范编写模块代码
- 配置 optimization.usedExports为 true 启动标记功能
- 启动代码优化功能 可以通过如下方法实现
  - 配置 mode = production
  - 配置 optimization.minimize = true
  - 提供 optimization.minimizer数组

对于使用了babel-loader loader或者根据对代码进行转译的时候，注意应该关闭对于导入/导出语句的转译，因为这会影响到后续的 tree shaking 比如应该将 babel-loader 的 babel-preset-env的modules配置为false

**必要条件：**

所有导入导出语句只能在模块顶层 且导入导出的模块名必须为字符串常量 不能动态导入的（ESM模块之间的依赖关系是高度确定的 与运行状态无关 编译工具只需要对ESM模块做静态分析就可以从代码字面量中推断出哪些模块值没被使用）

**Tree shaking的原理**

Tree shaking的工作流程可以分为

1.标记哪些导出值没有被使用； 2. 使用Terser将这些没用到的导出语句删除

标记的流程如下：
- make阶段：收集模块导出变量并记录到模块依赖关系图中
- seal阶段：遍历模块依赖关系图并标记那些导出变量有没有被使用
- 构建阶段：利用Terser将没有被用到的导出语句删除

**开发中如何利用Tree shaking？**

避免无作用的重复赋值
使用 #pure标记函数无副作用（这种做法在开源项目的源码中经常出现，如pinia、reactive....等）
禁止转译 导入/导出语句（使用了babel-loader需要将 babel-preset-env的modules配置为false ）
使用支持 Tree shaking的包
优化导出值的粒度

```js
//正确做法
const a = 'a';
const b = 'b';
export {
  a,
  b
}
//错误做法
export default {
  a: 'a',
  b: 'b'
}
```
关于tree shaking的原理，这里同样推荐范文杰大佬写的原理系列九：Tree-Shaking 实现原理

## Webpack构建优化—Tree Shaking和提取公共代码

https://www.jianshu.com/p/12999b6404a5 (文章发布时间2019年)

**认识 Tree Shaking**

Tree Shaking可以用来剔除JavaScript中用不上的死代码。它依赖静态的ES6模块化语法，例如通过import和export导入导出。

假如有一个文件util.js里存放了很多工具函数和常量，在 main.js 中会导入和使用 util.js，代码如下：

```js
// util.js 源码：
export function funcA() {
}
export function funB() {
}
export const a = 'a';

// main.js 源码：
import {funcA} from './util.js';
funcA();
```
Tree Shaking后的util.js：

```js
export function funcA() {
}
```

由于只用到了util.js中的funcA，所以剩下的都被Tree Shaking当作死代码给剔除了。

需要注意的是要让Tree Shaking正常工作的前提是交给Webpack的JavaScript代码必须是采用ES6模块化语法的， 因为ES6模块化语法是静态的（导入导出语句中的路径必须是静态的字符串，而且不能放入其它代码块中），这让Webpack可以简单的分析出哪些export的被import过了。 如果你采用ES5中的模块化，例如module.export={...}、require(x+y)、if(x){require('./util')}，Webpack无法分析出哪些代码可以剔除。

目前的 Tree Shaking 还有些的局限性，经实验发现：
- 不会对entry入口文件做Tree Shaking。
- 不会对异步分割出去的代码做Tree Shaking。


**接入 Tree Shaking**

首先，为了把采用ES6模块化的代码交给Webpack，需要配置Babel让其保留ES6模块化语句，修改.babelrc文件为如下：

```js
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ]
}
```

其中"modules": false的含义是关闭Babel的模块转换功能，保留原本的ES6模块化语法。
配置好Babel后，重新运行Webpack，在启动Webpack时带上--display-used-exports参数，以方便追踪Tree Shaking的工作， 这时你会发现在控制台中输出了如下的日志：

```
> webpack --display-used-exports
bundle.js  3.5 kB       0  [emitted]  main
   [0] ./main.js 41 bytes {0} [built]
   [1] ./util.js 511 bytes {0} [built]
       [only some exports used: funcA]
```
其中[only some exports used: funcA]提示了util.js只导出了用到的funcA，说明Webpack确实正确的分析出了如何剔除死代码。
但当你打开Webpack输出的bundle.js文件看下时，你会发现用不上的代码还在里面，如下：

```js
/* harmony export (immutable) */
__webpack_exports__["a"] = funcA;

/* unused harmony export funB */

function funcA() {
  console.log('funcA');
}

function funB() {
  console.log('funcB');
}
```
Webpack只是指出了哪些函数用上了哪些没用上，要剔除用不上的代码还得经过UglifyJS去处理一遍。 要接入UglifyJS也很简单，不仅可以通过加入UglifyJSPlugin去实现，也可以简单的通过在启动Webpack时带上--optimize-minimize参数。

通过webpack --display-used-exports --optimize-minimize重启Webpack后，打开新输出的bundle.js，内容如下：
```js
function r() {
  console.log("funcA")
}

t.a = r
```

可以看出Tree Shaking确实做到了，用不上的代码都被剔除了。

当你的项目使用了大量第三方库时，你会发现Tree Shaking似乎不生效了，原因是大部分Npm中的代码都是采用的CommonJS语法， 这导致Tree Shaking无法正常工作而降级处理。 但幸运的时有些库考虑到了这点，这些库在发布到Npm上时会同时提供两份代码，一份采用CommonJS模块化语法，一份采用ES6模块化语法。 并且在package.json文件中分别指出这两份代码的入口。

以redux库为例，其发布到Npm上的目录结构为：

```
node_modules/redux
|-- es
|   |-- index.js # 采用 ES6 模块化语法
|-- lib
|   |-- index.js # 采用 ES5 模块化语法
|-- package.json
```
package.json文件中有两个字段：
```js
{
  "main": "lib/index.js", // 指明采用 CommonJS 模块化的代码入口
  "jsnext:main": "es/index.js" // 指明采用 ES6 模块化的代码入口
}
```
mainFields用于配置采用哪个字段作为模块的入口描述。为了让Tree Shaking对redux生效，需要配置Webpack的文件寻找规则为如下：
```js
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
};
```
以上配置的含义是优先使用jsnext:main作为入口，如果不存在jsnext:main就采用browser或者main作为入口。虽然并不是每个Npm中的第三方模块都会提供ES6模块化语法的代码，但对于提供了的不能放过，能优化的就优化。

目前越来越多的Npm中的第三方模块考虑到了Tree Shaking，并对其提供了支持。 采用jsnext:main作为ES6模块化代码的入口是社区的一个约定，假如将来你要发布一个库到Npm时，希望你能支持Tree Shaking， 以让Tree Shaking发挥更大的优化效果，让更多的人为此受益。

