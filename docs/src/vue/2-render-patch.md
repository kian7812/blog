# Vue2组件渲染流程

## 独立构建与运行时构建

1、独立构建：包含模板编译器
- 渲染过程: html字符串 → render函数 → vnode → 真实dom节点

2、运行时构建：不包含模板编译器
- 渲染过程: render函数 → vnode → 真实dom节点

备注：
- 线上运行时（只包含运行时版 (生产环境) vue.runtime.min.js）。
- 没有.vue文件、没有template标签和选项、没有相关生命周期，在构建项目时通过Vue-loader已经编译成render函数。
- 运行时构建通过砍掉模板编译器，让整个包少了30%（官方数据）。

* vue.js：完整版本，包含了模板编译的能力；
* vue.runtime.js：运行时版本，不提供模板编译能力，需要通过 vue-loader 进行提前编译。

简单来说，
- 就是如果你用了 vue-loader ，就可以使用 vue.runtime.min.js，将模板编译的过程交过 vue-loader，
  - template compile to render function 的流程是可以借助 vue-loader 在 webpack 编译阶段离线完成，并非一定要在运行时完成。
- 如果你是在浏览器中直接通过 script 标签引入 Vue，需要使用 vue.min.js，运行的时候编译模板。

1. 模板编译，将模板代码转化为 AST；
2. 优化 AST，方便后续虚拟 DOM 更新；
3. 生成代码，将 AST 转化为可执行的代码render函数。

### .vue中的template会被vue-loader编译成render函数

项目运行编译时，.vue中的template会被vue-loader编译成render函数，并添加到组件选项对象里。组件通过components引用该组件选项，创建组件（Vue实例），渲染页面(组件被多次引用时，引用的是相同的组件选项，解释data为什么要是函数)。


### 每一个组件对应一个 Watcher 实例对象

是这样的没做，Vue.js 2.x 的数据更新并触发重新渲染的粒度是组件级的（来自Vue.js 3.0 核心源码解析）

```js
// src/core/instance/lifecycle // beforeMount和mounted
  export function mountComponent () {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
    new Watcher(vm, updateComponent, noop, {
      before () {
        if (vm._isMounted) {
          callHook(vm, 'beforeUpdate')
        }
      }
    }, true /* isRenderWatcher */)
  }

// src/core/instance/state
  export function initState (vm: Component) {  
    vm._watchers = [] // 这个_watchers是用来收集Watcher实例的。
```

### 在构建build阶段，模板变成render渲染函数

- https://blog.csdn.net/qq_22167989/article/details/88628422
- https://www.jianshu.com/p/7508d2a114d3

`模板（vm.options.template或.vue中最外层<temple>标签）通过编译生成AST，再由AST生成Vue的render函数（渲染函数）`
- AST，是Abstract Syntax Tree的简称，Vue使用HTML的Parser将HTML模板解析为AST，并且对AST进行一些优化的标记处理，提取最大的静态树，方便Virtual DOM时直接跳过Diff。

渲染函数render
- 是用来生成虚拟节点。
- 虚拟节点Diff和Patch后生成新的UI。
- Vue的Virtual DOM Patching算法是基于Snabbdom的实现，并在些基础上作了很多的调整和改进。

- Vue的编译器在编译模板之后，会把这些模板编译成一个渲染函数。
- 而函数被调用的时候就会渲染并且返回一个虚拟DOM的树。

当我们有了这个虚拟的树之后，再交给一个Patch函数，负责把这些虚拟DOM真正施加到真实的DOM上。
- (patch 就是直接操作DOM了？)

Watcher，
- 每个Vue组件都有一个对应的watcher实例，这个watcher将会在组件render的时候收集组件所依赖的数据，并在依赖有更新的时候，触发组件重新渲染。
- Vue遍历data选项对象属性，使用Object.defineProperty方法设置每个对象属性getter和setter，
- 组件在渲染时，创建一个watcher实例，同时把当用到data属性的时候，会触发getter，会把watcher订阅者，收集到这个属性的Dep，当属性值变更时会触发setter，并通知这个依赖的所有订阅者Watcher重新计算，从而使它关联的组件得以更新update。

一个简单的组件渲染流程：结果是生成组件实例、虚拟dom节点树。
- template模板，通过编译器Vue-loader构建成 render 函数（里面有createElement方法），// 在项目build的时候完成了
- render函数，执行createElement（里有new VNode）方法，并且通过 VNode，创建节点实例，最终返回虚拟dom节点树枝。虚拟节点树通过patch算法，再生成真实dom树。// 在生命周期的created — beforeMount阶段执行。

Vue组件的三种组织方式，对应三种渲染方式：// 最终线上运行时都会被编译成render函数。
- 1、只有render函数的组件；
- 2、带template选项或.vue的组件；
- 3、带el的最外层new Vue()，根Vue实例。

这三种渲染模式最终都是要得到render函数。只不过用户自定义的render函数省去了程序分析的过程，等同于处理过的render函数，而普通的template或者el只是字符串，需要解析成AST，再将AST转化为render函数（通过解析器vue-loader完成）。

## 组件渲染过程

- 1、.vue组件通过Vue-loader编译成一个组件对象，同时带render选项。
- 2、render函数参数 createElement 函数，
- 3、createElement 函数里，有 new VNode()
- 4、VNode 函数，用来创建虚拟dom。VNode虚拟节点对象就是一个属性的集合。
- 5、如果标签是组件标签，通过components获取的组件选项，并使用extend方法生成组件的构造函数，将构造函数和组件选项保存在组件标签节点上
- 6、每个Vue组件都是Vue实例。

### 从模板到真实dom节点经过一些步骤：

1. 把模板编译为render函数
2. 实例进行挂载, 根据根节点render函数的调用，递归的生成虚拟dom // $mount是渲染的起点
3. 对比虚拟dom，渲染到真实dom
4. 组件内部data发生变化，组件和子组件引用data作为props重新调用render函数，生成虚拟dom, 返回到步骤3。

### 如何才能触发组件的render：

- 当组件data属性如果在组件内部初次渲染过程被引用(data的属性被访问，也就是数据劫持的get), 包括生命周期方法或者render方法。
- 之后通过触发组件data属性赋值（setter），就会触发的组件的update(beforeUpdate -> render -> updated)。
- 注: 为了防止data被多次set从而触发多次update, Vue把update存放到异步队列中。这样就能保证多次data的set只会触发一次update。

### 子组件通过父组件的props触发自己的render：

- 把父组件的data通过props传递给子组件的时候，
- 子组件在初次渲染的时候生命周期或者render方法，有调用data相关的props的属性, 这样子组件也被添加到父组件的data的相关属性依赖中，
- 这样父组件的data在set的时候，就相当于触发自身和子组件的update。

### 渲染过程虚拟dom-真实dom

从架构来讲，Vue2.0 依然是写一样的模板。Vue的编译器在编译模板之后，会把这些模板编译成一个渲染函数。而函数被调用的时候就会渲染并且返回一个虚拟DOM的树。这个树非常轻量，它的职责就是描述当前界面所应处的状态。当我们有了这个虚拟的树之后，再交给一个patch函数，负责把这些虚拟DOM真正施加到真实的DOM上。在这个过程中，Vue有自身的响应式系统来侦测在渲染过程中所依赖到的数据来源。在渲染过程中，侦测到的数据来源之后，之后就可以精确感知数据源的变动。到时候就可以根据需要重新进行渲染。当重新进行渲染之后，会生成一个新的树，将新树与旧树进行对比，就可以最终得出应施加到真实DOM上的改动。最后再通过patch函数施加改动。

## createElement 参数

返回：虚拟节点树，虚拟节点VNode，一个属性的集合，用来描述节点。

- 第一个参数：{String | Object | Function}，必填项。一个HTML标签名、组件选项对象，或者 resolve 了标签名或组件选项对象 async 函数。
- 第二个参数：{Object}，可选
- 第三个参数：{String | Array}，可选。文本虚拟节点、createElement()
 
所以组件里的render函数里都必须 return createElement()，因为组件有可能会被多次引用，跟data为什么是一个函数返回对象一样。

### 一个VNode的实例对象包含了以下属性

* tag: 当前节点的标签名
* data: 当前节点的数据对象，具体包含哪些字段可以参考vue源码types/vnode.d.ts中对VNodeData的定义
* children: 数组类型，包含了当前节点的子节点
* text: 当前节点的文本，一般文本节点或注释节点会有该属性
* elm: 当前虚拟节点对应的真实的dom节点
* ns: 节点的namespace
* context: 编译作用域
* functionalContext: 函数化组件的作用域
* key: 节点的key属性，用于作为节点的标识，有利于patch的优化
* componentOptions: 创建组件实例时会用到的选项信息
* child: 当前节点对应的组件实例
* parent: 组件的占位节点
* raw: raw html
* isStatic: 静态节点的标识
* isRootInsert: 是否作为根节点插入，被`<transition>`包裹的节点，该属性的值为false
* isComment: 当前节点是否是注释节点
* isCloned: 当前节点是否为克隆节点
* isOnce: 当前节点是否有v-once指令

VNode分类
VNode可以理解为vue框架的虚拟dom的基类，通过new实例化的VNode大致可以分为几类
* EmptyVNode: 没有内容的注释节点
* TextVNode: 文本节点
* ElementVNode: 普通元素节点
* ComponentVNode: 组件节点
* CloneVNode: 克隆节点，可以是以上任意类型的节点，唯一的区别在于isCloned属性为true
* …

VNode也提供了生命周期钩子：
* init: vdom初始化时
* create: vdom创建时
* prepatch: patch之前
* insert: vdom插入后
* update: vdom更新前
* postpatch: patch之后
* remove: vdom移除时
* destroy: vdom销毁时

vue组件的生命周期底层其实就依赖于vnode的生命周期，在src/core/vdom/create-component.js中我们可以看到，vue为自己的组件vnode已经写好了默认的init/prepatch/insert/destroy，而vue组件的mounted/activated就是在insert中触发的，deactivated就是在destroy中触发的

VNode虚拟节点作用：
主要用来patch/diff生成真实dom。

## patch原理（同步的）

https://segmentfault.com/a/1190000008291645

patch函数的定义在src/core/vdom/patch.js中，我们先来看下这个函数的逻辑

patch函数接收6个参数：

* oldVnode: 旧的虚拟节点或旧的真实dom节点
* vnode: 新的虚拟节点
* hydrating: 是否要跟真是dom混合
* removeOnly: 特殊flag，用于`<transition-group>`组件
* parentElm: 父节点
* refElm: 新节点将插入到refElm之前

patch的策略是：

1. 如果vnode不存在但是oldVnode存在，说明意图是要销毁老节点，那么就调用invokeDestroyHook(oldVnode)来进行销毁
2. 如果oldVnode不存在但是vnode存在，说明意图是要创建新节点，那么就调用createElm来创建新节点
3. 当vnode和oldVnode都存在时
    * 如果oldVnode和vnode是同一个节点，就调用patchVnode来进行patch
    * 当vnode和oldVnode不是同一个节点时，如果oldVnode是真实dom节点或hydrating设置为true，需要用hydrate函数将虚拟dom和真是dom进行映射，然后将oldVnode设置为对应的虚拟dom，找到oldVnode.elm的父节点，根据vnode创建一个真实dom节点并插入到该父节点中oldVnode.elm的位置

patchVnode算法是：// patch的核心

这里面值得一提的是patchVnode函数，因为真正的patch算法是由它来实现的（patchVnode中更新子节点的算法其实是在updateChildren函数中实现的，为了便于理解，我统一放到patchVnode中来解释）。

1. 如果oldVnode跟vnode完全一致，那么不需要做任何事情
2. 如果oldVnode跟vnode都是静态节点，且具有相同的key，当vnode是克隆节点或是v-once指令控制的节点时，只需要把oldVnode.elm和oldVnode.child都复制到vnode上，也不用再有其他操作
3. 否则，如果vnode不是文本节点或注释节点。
   …这里省略了很多内容，直接看文章吧。
4. 如果vnode是文本节点或注释节点，但是vnode.text != oldVnode.text时，只需要更新vnode.elm的文本内容就可以

patch提供了5个生命周期钩子：
* create: 创建patch时
* activate: 激活组件时
* update: 更新节点时
* remove: 移除节点时
* destroy: 销毁节点时

这些钩子是提供给Vue内部的directives/ref/attrs/style等模块使用的，方便这些模块在patch的不同阶段进行相应的操作，这里模块定义在src/core/vdom/modules和src/platforms/web/runtime/modules2个目录中

真实dom的增删改
* 虚拟节点里面有一个属性elm, 这个属性指向真实的DOM节点。
* 底层真实dom的增删改是通过Vnode.elm，还有patch函数的参数parentElm、refElm等，还有createElm（它用来创建真实节点的），
经过一系列patch策略及patchVnode算法的操作，最后文档中真实dom被增删改，内容、属性值、样式等等增删改查。
* 当然update后，新的VNode变成了老的oldVNode。
* 综上，patch的作用是通过虚拟dom对真实dom增删改查。
- patch函数，负责把这些虚拟DOM真正施加到真实的DOM上


## 虚拟DOM

### 虚拟 DOM 的优势

- 通过diff，减少 JavaScript 操作真实 DOM 的带来的性能消耗
  - 原生 DOM 因为浏览器厂商需要实现众多的规范（各种 HTML5 属性、DOM事件），即使创建一个空的 div 也要付出昂贵的代价。虚拟 DOM 提升性能的点在于 DOM 发生变化的时候，通过 diff 算法比对 JavaScript 原生对象，计算出需要变更的 DOM，然后只对变化的 DOM 进行操作，而不是更新整个视图。
  - 这样做的主要原因是，在浏览器当中，JavaScript的运算在现代的引擎中非常快，但DOM本身是非常缓慢的东西。当你调用原生DOM API的时候，浏览器需要在JavaScript引擎的语境下去接触原生的DOM的实现，这个过程有相当的性能损耗。所以，本质的考量是，要把耗费时间的操作尽量放在纯粹的计算中去做（diff），保证最后计算出来的需要实际接触真实DOM的操作是最少的。

- 虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力

### 为什么要使用虚拟 DOM 呢？

https://juejin.cn/post/7010594233253888013

- 由于在浏览器中操作DOM是很昂贵的。频繁的操作DOM，会产生一定的性能问题。这就是虚拟Dom的产生原因。
- Vue2的Virtual DOM借鉴了开源库snabbdom的实现。
- Virtual DOM本质就是用一个原生的JS对象去描述一个DOM节点。是对真实DOM的一层抽象。

- 如图可以看出原生 DOM 有非常多的属性和事件，就算是创建一个空div也要付出不小的代价。
- 而使用虚拟 DOM 来提升性能的点在于 DOM 发生变化的时候，通过 diff 算法和数据改变前的 DOM 对比，计算出需要更改的 DOM，然后只对变化的 DOM 进行操作，而不是更新整个视图。