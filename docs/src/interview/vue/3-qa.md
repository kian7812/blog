# Vue3问答


## Vue3相比Vue2有哪些变化？

### 编译优化

在vue项目编译的时候，会将template编译成render函数，在编译原理的文章中说过，vue2.0会标记静态根节点，在虚拟dom的diff过程中会跳过静态根节点的对比，从而优化编译速度。
而在vue3.0中又添加了如下内容用于优化编译过程：

1. 静态提升。
2. Patch Flag。
3. 缓存事件处理函数。
4. Fragments(片段)。

**静态提升**
- 原来render函数中的静态节点都被提取到render函数的外面，这样，静态节点只有在初始化的时候被编译一次，后续发生变化后，静态节点会复用初始化时编译的结果，从而提升编译性能。

**patch flag**
- 在编译生成的动态节点中，_createVNode方法最后会包含一个数字；
- 如9 代表的是该节点的text和props中均存在动态绑定的内容；
- 如1 表示该节点只有text被动态绑定。
- 这样，在虚拟Dom的patch过程中，就可以通过patch flag，判断用直接采用哪种比对方式，从而提升编译/渲染速度。
- 将 vdom 更新性能由与模版整体大小相关提升为与动态内容的数量相关。

**缓存事件处理函数**
- 在模版中绑定了click事件，Vue2默认认为该节点属性中绑定了某个动态数据，所以当事件处理函数发生变化的时候，会出发页面的更新。
- Vue3开启事件缓存，在初始化编译的时候，其内部用一个函数包裹了绑定事件并添加到缓存中，当后续变化的时候，会直接从缓存中读取相应的处理函数（不用重新生成），此时加快了编译速度，同时，由于新生成了一个函数包裹事件处理函数，不管处理函数是否发生变化，包裹得函数是不会变化的，此时也就不会因为处理函数的变化导致页面更新。

**fragments**
在vue2.0中，template模版只能存在一个根节点，而3.0中通过fragments实现了可以存在多个同级根节点。

**更好的tree-shaking支持**
在Vue3中，常用API都可以通过ES模块的方式按需导入，没有用到的就会tree-shaking掉。
而在vue2中所有的API都在Vue原型和实例上，难以实现tree-shaking。

Tree shaking 描述：
1. Tree shaking是基于ES6模板语法（import与exports），主要是借助ES6模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输入和输出的变量
2. Tree shaking无非就是做了两件事：
  编译阶段利用ES6 Module判断哪些模块已经加载
   判断那些模块和变量未被使用或者引用，进而删除对应代码

首先，tree-shaking有一个两个要求：
* 一个是必须是import导入。
* 另一个是必须是单个函数或常量导出。
如果导出的是一个对象，那也无法用tree-shaking。
```
export const add=()=>{
    //...
}
export const handleClick=()=>{
    //...
}
//不要这样导出
export default {
    add,
    handleClick
}
webpack中需要开启：
optimization: {
    usedExports: true, //用到使用
    minimize: true, //压缩
}

```

### 使用层面变更

1. data的变化
在v3版本中将data的返回值进行了标准化，只接受返回Object的Function, 而在v2版本中同时支持返回Object和返回Object的Function。

2. mixin合并的变化
v3版本中关于Object的合并是覆盖，而不是合并。

3. 移除了 $on , $off , $once方法
在v2版本中，通常使用$on, $off来实现全局事件总线，使用$once绑定监听一个自定义事件，其实这些在实际项目中用到的也不会特别多，在v3版本移除后，可以通过一些外部库来实现相关需求。例如 mitt

4. 删除了过滤器
v3版本中删除了过滤器， {{ calcNum | filter }}将不在支持，官方建议使用computed属性替换过滤器（well done ~）。

5. 片段
在v3版本中支持了可以有多个根节点的组件，可以减少节点层级深度。但也希望开发者能够明确语义。
```js
<template>
  <header></header>
  <main></main>
  <footer></footer>
</template>
```

6. 函数式组件 // 文中有代码demo
v2版本的函数式组件,它有两种创建方式： functional attribute 和 { functional : true } 选项；
v2版本中组件有两种组件类型：有状态组件和函数式组件（无状态组件）,相对于有状态组件，函数式组件不需要被实例化，无状态，没有生命周期钩子，它们的渲染速度远高于有状态组件。往往通常被适用于功能单一的静态展示组件从而优化性能。除此之外，函数式组件还有返回多个根节点的能力。
在v3版本中，有状态组件和函数式组件之间的性能差异已经大大减少，在大部分场景下几乎可以忽略不计。所以函数式组件唯一的优势就在一返回多节点的能力，但这种通常运用比较少，且组件往往比较简单。

7. 全局API调整
v3版本中新增了一个新的全局APIcreateApp，通过ES模块的方式引入。调用createApp返回一个应用实例，该应用实例暴露出来应用API，（主要解决了不同"app"之间能够共享资源配置、全局组件、指令等等）。
v3将从原来Vue构造函数上的API转移到了实例上了：app.use|component|directive|mixin 等。
全局API：nextTick、生命周期钩子、计算属性和watch、响应式api。
考虑到tree-shaking，只能通过ES模块的方式导入。

8. 组合式API
组合式API的入口，是vue3新增了钩子函数 setup（相当于beforeCreate和created），在setup里可以做原本在vue组件选项api里能做的所有事情，如在data,created,mounted，computed，watch,methods等，vue3都有提供对应新增api可以写到setup中（可通过ES模块的方式按需引入）。

主要解决什么事情呢？
我们都知道组件的作用就是对功能的提取以及代码的复用。这使得我们的程序在灵活性和可维护性上能走的更远，
但是这还不够，当一个组件内部的逻辑很复杂的时候，我们将逻辑分别散落在 created,mounted,methods，computed，watch里面，然后整个文件代码很长。这对于没有编写这个组件的人来说，去理解、修改、维护这些逻辑代码还是比较头疼的。
而setup正是解决了这个事情，将所有的逻辑都集中起来在setup中处理；
而且能把一块功能的逻辑抽离出来，可以在不同的组件引用且原数据的出处清晰，让逻辑能够提取和复用（逻辑复用v2可通过mixin会有些问题，比如原数据不透明，模版中的一些响应式数据，找不到声明。）。

9. 组合式API的使用：Vue3/使用·setup|组合式API|响应式API

10. v3 v-model 参数的变更，支持多个 v-model 
https://v3.cn.vuejs.org/guide/component-custom-events.html

11. Typescript的支持，更好的类型推到能力。
对 TypeScript 支持不友好（所有属性都放在了 this 对象上，难以推倒组件的数据类型）

优点：
1. 普适性更强，不需要针对数组做特殊处理；也能应用于值类型变量
2. 启动速度更快，因为启动时不需要再遍历对象的所有属性，而是在运行过程中增量执行依赖管理
3. 实现上重构 Watcher-Dep 模式，改用单个变量(reactivity/src/effect.ts#L10) 记录依赖关系，架构关系更简单，性能也稍有增强
4. 响应式能力通过 Composition API 开放，不再依赖于 Vue 实例，更容易复用


# 对于即将到来的 vue3.0 特性你有什么了解的吗？
Vue 3.0 正走在发布的路上，Vue 3.0 的目标是让 Vue 核心变得更小、更快、更强大，因此 Vue 3.0 增加以下这些新特性：
（1）监测机制的改变
3.0 将带来基于代理 Proxy 的 observer 实现，提供全语言覆盖的反应性跟踪。这消除了 Vue 2 当中基于 Object.defineProperty 的实现所存在的很多限制：
* 只能监测属性，不能监测对象
* 检测属性的添加和删除；
* 检测数组索引和长度的变更；
* 支持 Map、Set、WeakMap 和 WeakSet。
新的 observer 还提供了以下特性：
* 用于创建 observable 的公开 API。这为中小规模场景提供了简单轻量级的跨组件状态管理解决方案。
* 默认采用惰性观察。在 2.x 中，不管反应式数据有多大，都会在启动时被观察到。如果你的数据集很大，这可能会在应用启动时带来明显的开销。在 3.x 中，只观察用于渲染应用程序最初可见部分的数据。
* 更精确的变更通知。在 2.x 中，通过 Vue.set 强制添加新属性将导致依赖于该对象的 watcher 收到变更通知。在 3.x 中，只有依赖于特定属性的 watcher 才会收到通知。
* 不可变的 observable：我们可以创建值的“不可变”版本（即使是嵌套属性），除非系统在内部暂时将其“解禁”。这个机制可用于冻结 prop 传递或 Vuex 状态树以外的变化。
* 更好的调试功能：我们可以使用新的 renderTracked 和 renderTriggered 钩子精确地跟踪组件在什么时候以及为什么重新渲染。
（2）模板
模板方面没有大的变更，只改了作用域插槽，2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。
同时，对于 render 函数的方面，vue3.0 也会进行一系列更改来方便习惯直接使用 api 来生成 vdom 。
（3）对象式的组件声明方式
vue2.x 中的组件是通过声明的方式传入一系列 option，和 TypeScript 的结合需要通过一些装饰器的方式来做，虽然能实现功能，但是比较麻烦。3.0 修改了组件的声明方式，改成了类式的写法，这样使得和 TypeScript 的结合变得很容易。
此外，vue 的源码也改用了 TypeScript 来写。其实当代码的功能复杂之后，必须有一个静态类型系统来做一些辅助管理。现在 vue3.0 也全面改用 TypeScript 来重写了，更是使得对外暴露的 api 更容易结合 TypeScript。静态类型系统对于复杂代码的维护确实很有必要。
（4）其它方面的更改
vue3.0 的改变是全面的，上面只涉及到主要的 3 个方面，还有一些其他的更改：
* 支持自定义渲染器，从而使得 weex 可以通过自定义渲染器的方式来扩展，而不是直接 fork 源码来改的方式。
* 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。
* 基于 treeshaking 优化，提供了更多的内置功能。


模板方面没有大的变更，只改了作用域插槽，
2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。


*Proxy只能代理（控制）对象的直接子属性，是单层的。

*因为Proxy只代理了整个对象（最外层属性）[解构丢失响应性的原因]
Proxy 代理只存在当前的整个对象，那解构赋值里面的属性给到其对应变量，就失去了proxy代理，也就失去了响应式了。
如果解构变量需要保持响应式，toRefs处理（批量把变量都处理成ref）。

track依赖收集也是在这个proxy对象的get拦截器里，
trigger触发更新也是在这个proxy对象的set拦截器里，

*reactive源码，只有proxy对象的属性被访问时才会进行依赖收集，同时被访问时如果属性是对象，还对这个属性进行递归reactive。

*Proxy 是创建返回一个新的对象，作为响应式对象。而Object.deleteProperty() 是操作的原始对象，响应式也是在原对象上配置的。

*要使得Proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作。


Object.defineProperty有哪些缺点？
1. Object.defineProperty 只能劫持对象的属性，⽽ Proxy 是直接代理对象由于 Object.defineProperty 只能对属性进⾏劫持，需要遍历对象的每个属性。⽽ Proxy 可以直接代理对象。
2. Object.defineProperty 对新增属性需要⼿动进⾏ Observe ， 由于 Object.defineProperty 劫持的是对象的属性，所以新增属性时，需要重新遍历对象，对其新 增属性再使⽤ Object.defineProperty 进⾏劫持。 也正是因为这个原因，使⽤ Vue 给 data中的数组或对象新增属性时，需要使⽤ vm.$set才能保证新增的属性也是响应式的。
3. Proxy ⽀持13种拦截操作，这是 defineProperty 所不具有的。
4. 新标准性能红利Proxy 作为新标准，⻓远来看，JS引擎会继续优化 Proxy ，但 getter 和 setter 基本不会再有针对性优化。
5. Proxy 兼容性差 ⽬前并没有⼀个完整⽀持 Proxy 所有拦截⽅法的Polyfill⽅案


对比响应式代理 Proxy vs Object.defineProperty [文章描述的不错且有代码例子]

Object.defineProperty 无法一次性监听对象所有属性，必须遍历或者递归来实现。
Proxy直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的。
（Proxy只能代理（控制）对象的直接子属性，子属性里的都不能代理（控制）到了）
（Vue3的基于Proxy响应式观测，虽然是代理了真个对象，但是真正访问到的属性也递归观测了，依赖收集只发送在真正访问到的属性上）

Object.defineProperty 无法监听属性的新增和删除； // Vue2中初始化时只观测了已有的属性
Proxy 可以监听到属性的添加和删除。

Object.defineProperty 无法监听数组操作及长度和通过索引改变元素值的变化，（无法对 push、shift、pop、unshift 等方法进行响应。在 Vue 是通过重写原型实现的）。
Proxy 可以监听数组的操作以及数组长度和通过索引修改元素值的变化。

Proxy 提供了13种拦截方法，包括拦截 constructor、apply、deleteProperty 等等，
Object.defineProperty 只有 get 和 set。

Object.defineProperty 兼容性更好，支持 IE9。
Proxy 是新出的 API，兼容性还不够好，不支持 IE 全系列。Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平。

Proxy 返回的是一个新对象，我们可以只操作新的对象达到目的，
Object.defineProperty 只能遍历对象属性直接修改；

Proxy 支持 Map、Set、WeakMap 和 WeakSet。

Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

对于响应式，Vue3改用proxy来实现，对于开发有什么提升吗？
「尤大」: 首先对于开发来说，最大的提升就是可以不用去考虑数组、对象的一些变化了，都可以很好得实现响应式，同时也支持了WeakSet、WeakMap这样的数据结构。

update 性能提高
Object.defineProperty是一个相对比较昂贵的操作，因为它直接操作对象的属性，颗粒度比较小。将它替换为es6的Proxy，在目标对象之上架了一层拦截，代理的是对象而不是对象的属性。这样可以将原本对对象属性的操作变为对整个对象的操作，颗粒度变大。