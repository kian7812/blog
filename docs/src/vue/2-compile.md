# 编译

## Vue 的模板编译原理✅

vue模板的编译过程分为3个阶段：
1. 第⼀步：解析
将模板字符串解析⽣成 AST，⽣成的AST 元素节点总共有 3 种类型，1 为普通元素， 2 为表达式，3为纯⽂本。
2. 第⼆步：优化语法树
    - Vue 模板中并不是所有数据都是响应式的，有很多数据是⾸次渲染后就永远不会变化的，那么这部分数据⽣成的 DOM 也不会变化，我们可以在 patch 的过程跳过对他们的⽐对。
    - 此阶段会深度遍历⽣成的 AST 树，检测它的每⼀颗⼦树是不是静态节点，如果是静态节点则它们⽣成DOM 永远不需要改变，这对运⾏时对模板的更新起到极⼤的优化作⽤。
3. ⽣成代码
  - const code = generate(ast, options)
  - 通过 generate ⽅法，将ast⽣成 render 函数。

## 如何理解Vue中的模板编译原理？

这个问题的核心是如何将template转换成render函数。
1. 将template模块转换成ast语法书 - parserHTML
2. 对静态语法做标记（某些节点不改变）
3. 重新生成代码 - codeGen,使用with语法包裹字符串


## 编译
https://ustbhuangyi.github.io/vue-analysis/v2/compile/

之前我们分析过模板到真实 DOM 渲染的过程，中间有一个环节是把模板编译成 render 函数，这个过程我们把它称作编译。

虽然我们可以直接为组件编写 render 函数，但是编写 template 模板更加直观，也更符合我们的开发习惯。

Vue.js 提供了 2 个版本：
一个是 Runtime + Compiler 的，一个是 Runtime only 的，前者是包含编译代码的，可以把编译过程放在运行时做，后者是不包含编译代码的，需要借助 webpack 的 vue-loader 事先把模板编译成 render函数。

### 1. parse

编译过程首先就是对模板做解析，生成 AST，它是一种抽象语法树，是对源代码的抽象语法结构的树状表现形式。在很多编译技术中，如 babel 编译 ES6 的代码都会先生成 AST。

parse 的目标是把 template 模板字符串转换成 AST 树，它是一种用 JavaScript 对象的形式来描述整个模板。

AST 元素节点总共有 3 种类型，type 为 1 表示是普通元素，为 2 表示是表达式，为 3 表示是纯文本。

### 2. optimize

当我们的模板 template 经过 parse 过程后，会输出生成 AST 树，那么接下来我们需要对这颗树做优化。

为什么要有优化过程？

因为我们知道 Vue 是数据驱动，是响应式的，但是我们的模板并不是所有数据都是响应式的，也有很多数据是首次渲染后就永远不会变化的，那么这部分数据生成的 DOM 也不会变化，我们可以在 patch 的过程跳过对他们的比对。

所以整个 optimize 的过程实际上就干 2 件事情，markStatic(root) 标记静态节点 ，markStaticRoots(root, false) 标记静态根。

optimize 的过程，就是深度遍历这个 AST 树，去检测它的每一颗子树是不是静态节点，如果是静态节点则它们生成 DOM 永远不需要改变，这对运行时对模板的更新起到极大的优化作用。
我们通过 optimize 我们把整个 AST 树中的每一个 AST 元素节点标记了 static 和 staticRoot，它会影响我们接下来执行代码生成的过程。

### 3. codegen

编译的最后一步就是把优化后的 AST 树转换成可执行的代码。

## Vue模版编译原理知道吗，能简单说一下吗？（描述还是挺好的）

简单说，Vue的编译过程就是将template转化为render函数的过程。会经历以下阶段：
* 生成AST树
* 优化
* codegen

首先解析模版，生成AST语法树(一种用JavaScript对象的形式来描述整个模板)。 使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理。

Vue的数据是响应式的，但其实模板中并不是所有的数据都是响应式的。有一些数据首次渲染后就不会再变化，对应的DOM也不会变化。那么优化过程就是深度遍历AST树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以跳过对它们的比对，对运行时的模板起到很大的优化作用。

编译的最后一步是将优化后的AST树转换为可执行的代码。

## Vue complier 实现

模板解析这种事，本质是将数据转化为一段 html ，最开始出现在后端，经过各种处理吐给前端。
随着各种 mv* 的兴起，模板解析交由前端处理。 总的来说，Vue complier 是将 template 转化成一个 render 字符串。 可以简单理解成以下步骤：
* parse 过程，将 template 利用正则转化成 AST 抽象语法树。
* optimize 过程，标记静态节点，后 diff 过程跳过静态节点，提升性能。
* generate 过程，生成 render 字符串。

## Vue.js的template编译
简而言之，就是先转化成AST树，再得到的render函数返回VNode（Vue的虚拟DOM节点），详细步骤如下：

首先，通过compile编译器把template编译成AST语法树（abstract syntax tree 即 源代码的抽象语法结构的树状表现形式），compile是createCompiler的返回值，createCompiler是用以创建编译器的。另外compile还负责合并option。

然后，AST会经过generate（将AST语法树转化成render funtion字符串的过程）得到render函数，render的返回值是VNode，VNode是Vue的虚拟DOM节点，里面有（标签名、子节点、文本等等）

## 
.vue文件的里的template标签的内容，都经过vue-loader处理，直接编译成render函数，（因为解析一个模板内容变成render函数，这过程是比较耗时的过程，所以使用vue-loader处理效率会更高）。

## Vue模版编译原理知道吗，能简单说一下吗？

简单说，Vue的编译过程就是将template转化为render函数的过程。会经历以下阶段（生成AST树/优化/codegen）：
* 首先解析模版，生成AST语法树(一种用JavaScript对象的形式来描述整个模板)。 使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理。
* Vue的数据是响应式的，但其实模板中并不是所有的数据都是响应式的。有一些数据首次渲染后就不会再变化，对应的DOM也不会变化。那么优化过程就是深度遍历AST树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以跳过对它们的比对，对运行时的模板起到很大的优化作用。
* 编译的最后一步是将优化后的AST树转换为可执行的代码。

## vue-loader是什么？使用它的用途有哪些？

vue文件的一个加载器，跟template/js/style转换成js模块。


## Vue 模板编译原理
Vue 的编译过程就是将 template 转化为 render 函数的过程 分为以下三步

1. 第一步是将 模板字符串 转换成 element ASTs（解析器）
2. 第二步是对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化（优化器）
3. 第三步是 使用 element ASTs 生成 render 函数代码字符串（代码生成器）

```js
export function compileToFunctions(template) {
  // 我们需要把html字符串变成render函数
  // 1.把html代码转成ast语法树  ast用来描述代码本身形成树结构 不仅可以描述html 也能描述css以及js语法
  // 很多库都运用到了ast 比如 webpack babel eslint等等
  let ast = parse(template);
  // 2.优化静态节点
  // 这个有兴趣的可以去看源码  不影响核心功能就不实现了
  //   if (options.optimize !== false) {
  //     optimize(ast, options);
  //   }

  // 3.通过ast 重新生成代码
  // 我们最后生成的代码需要和render函数一样
  // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本
  let code = generate(ast);
  //   使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值
  let renderFn = new Function(`with(this){return ${code}}`);
  return renderFn;
}

```

## 编译，编译的是谁？编译成什么？为什么编译？做了几件事情？

- 编译的是template，
- 编译成render函数，用来生成vnode，
- 编译过程中可以进行一些优化静态标识等。

vue里通过，字符串模板template -> ast HTML语法树 -> render函数 -> vnode

虚拟dom

字符串模板template -（compiler编译成）> ast HTML语法树（vue-loader做了前面） -> render函数 -> vnode -> patch 真实dom替换
runtime render函数 -> vnode -> vnode新patch旧 真实dom替换

为什么使用虚拟dom？

可以提高操作dom的性能，通过比对虚拟dom，最小概率的操作dom。
因为所有比对操作都是js完成，最小概率的操作dom，切减少操作dom次数，来提高dom操作方面的性能

虚拟dom是？

描述真实dom节点的js对象，用来缓存住，最终用来对比并生成真实dom

思考: vue 项目 *模板 转换为 抽象语法树* 需要执行几次???（1次）
- 一个项目运行的时候 模板是不会变 的, 就表示 AST 是不会变的

patch时

真实dom 与 虚拟vnode 是一一对应的，虚拟dom树的每个节点，都会对应的真是dom，
新的vnode与现有进行diff，会更新现有的vnode，同时也会操作真实dom（这块看源码时重点关注下），diff的目的就是以最小的粒度更新真实dom操作。


*小右：不要深究diff*


