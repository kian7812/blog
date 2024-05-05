# 文档

官方文档还是要多复习的，每次会有新收获。
- https://cn.vuejs.org/guide/introduction.html
- https://cn.vuejs.org/api/application.html

## 该选哪一个？

选项式 API 以“组件实例”的概念为中心 (即上述例子中的 this)，对于有面向对象语言背景的用户来说，这通常与基于类的心智模型更为一致。同时，它将响应性相关的细节抽象出来，并强制按照选项来组织代码，从而对初学者而言更为友好。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，也需要你对 Vue 的响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大。


## 在表达式中的方法和计算属性

在组件每次更新时都会被重新调用，因此不应该产生任何副作用，比如改变数据或触发异步操作。

计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。

相比之下，方法调用总是会在重渲染发生时再次执行函数。

## v-if vs v-show

- v-if 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。
- v-if 也是惰性的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有当条件首次变为 true 时才被渲染。
- v-show 简单许多，元素无论初始条件如何，始终会被渲染，只有 CSS display 属性会被切换。

总的来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要频繁切换，则使用 v-show 较好；如果在运行时绑定条件很少改变，则 v-if 会更合适。

## v-for 与 v-if

当它们同时存在于一个节点上时，v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名
```js
// todo 无法被访问到
<li v-for="todo in todos" v-if="!todo.isComplete">

// 在外先包装一层 <template> 再在其上使用 v-for 可以解决这个问题 (这也更加明显易读)：
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## 通过 key 管理状态

Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素。（默认能复用就复用啥都不管，不管对比效率）

默认模式是高效的，但只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态。

通过 key  标识节点，从而重用和重新排序现有的元素。（和默认的就地复用不同，通过key有意识的加上标识，这个整块可复用提高对比效率）

## 数组本身变化触发响应式更新

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

其它 filter()，concat() 和 slice() 通过替换原数组来触发更新

## input 上 v-model

```js
<input v-model="text">

<input
  :value="text"
  @input="event => text = event.target.value">
```

## 生命周期钩子

每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如设置好数据侦听，编译模板，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中，它也会运行被称为生命周期钩子的函数，让开发者有机会在特定阶段运行自己的代码。


## 在子组件更改props场景

1. prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性。（后续prop更新不受影响）

在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：

```js
const props = defineProps(['initialCounter'])

// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter)
```

2. 需要对传入的 prop 值做进一步的转换，在这种情况中，最好是基于该 prop 值定义一个计算属性。

## 组合式函数

https://cn.vuejs.org/guide/reusability/composables.html

组合式函数则侧重于有状态的逻辑

###  组合式函数 和 Mixin 的对比

https://cn.vuejs.org/guide/reusability/composables.html#vs-mixins

## 如何编写指令

https://cn.vuejs.org/guide/reusability/custom-directives.html

自定义指令主要是为了复用访问普通元素底层 DOM 的逻辑。一个自定义指令由一个包含类似组件生命周期钩子的对象来定义。钩子函数会接收到指令所绑定元素作为其参数。

## 编写插件

https://cn.vuejs.org/guide/reusability/plugins.html

- 插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码。
- 插件可以是一个拥有 install() 方法的对象，也可以直接是一个安装函数本身。

安装函数会接收到安装它的*应用实例*和传递给 app.use() 的*额外选项作为参数*：
```js
const myPlugin = {
  install(app, options) {
    // 配置此应用
  }
}
```

**插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：**

1. 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
2. 通过 app.provide() 使一个资源可被注入进整个应用。
3. 向 app.config.globalProperties 中添加一些全局实例属性或方法
4. 一个可能上述三种都包含了的功能库 (例如 vue-router)。

编写一个插件，一个简单的 i18n 插件 https://cn.vuejs.org/guide/reusability/plugins.html

## KeepAlive

最大缓存实例数​
我们可以通过传入 max prop 来限制可被缓存的最大组件实例数。`<KeepAlive>` 的行为在指定了 max 后类似一个 LRU 缓存：如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

## Teleport

`<Teleport>` 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。

`<Teleport>` 只改变了渲染的 DOM 结构，它不会影响组件间的逻辑关系。也就是说，如果 `<Teleport>` 包含了一个组件，那么该组件始终和这个使用了 `<teleport>` 的组件保持逻辑上的父子关系。传入的 props 和触发的事件也会照常工作。

这也意味着来自父组件的注入也会按预期工作，子组件将在 Vue Devtools 中嵌套在父级组件下面，而不是放在实际内容移动到的地方。

## Suspense

`<Suspense>` 是一个内置组件，用来处理组件异步渲染时的状态，**重点是能获得他们的状态**。

- 有两个插槽：#default 和 #fallback。
- 有三个事件：pending、resolve 和 fallback。
- 可以等待的异步依赖有两种：
    - 带有异步 setup() 钩子的组件。这也包含了使用 `<script setup>` 时有顶层 await 表达式的组件。
    - 异步组件。

## 单文件组件

Vue 的单文件组件 (即 *.vue 文件，英文 Single-File Component，简称 SFC) 

Vue SFC 是一个框架指定的文件格式，因此必须交由 @vue/compiler-sfc 编译为标准的 JavaScript 和 CSS，一个编译后的 SFC 是一个标准的 JavaScript(ES) 模块

如何看待关注点分离？前端工程化的最终目的都是为了能够更好地维护代码。关注点分离不应该是教条式地将其视为文件类型的区别和分离，仅仅这样并不够帮我们在日益复杂的前端应用的背景下提高开发效率。

按需组合起来。



## 状态管理

### 全局状态和局部状态

非常好的解释：

```js
import { ref } from 'vue'

// 全局状态，创建在模块作用域下
const globalCount = ref(1)

export function useCount() {
  // 局部状态，每个组件都会创建
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

## 服务端渲染 (SSR)

https://cn.vuejs.org/guide/scaling-up/ssr.html

Vue 也支持将组件在服务端直接渲染成 HTML 字符串，作为服务端响应返回给浏览器，最后在浏览器端*将静态的 HTML“激活”(hydrate) *为能够交互的客户端应用。


## 无障碍访问

https://cn.vuejs.org/guide/best-practices/accessibility.html

## 安全

https://cn.vuejs.org/guide/best-practices/security.html

## 动画技巧

https://cn.vuejs.org/guide/extras/animation.html

Vue 提供了 `<Transition>` 和 `<TransitionGroup>` 组件来处理元素进入、离开和列表顺序变化的过渡效果。


## API

https://cn.vuejs.org/api/application.html

- createApp()
- app.mount()
- app.use()
- app.component()
- app.directive()
- app.provide()
- app.config
- app.config.globalProperties 应用内所有组件实例访问到的全局属性的对象，对 Vue 2 中 Vue.prototype 使用方式的一种替代

- nextTick()​ 当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。
- defineComponent() 定义 Vue 组件时提供类型推导的辅助函数。
 
- ref()
- computed()
- reactive()
- watchEffect() 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。
- watch()
- shallowRef()
- shallowReactive()
- provide() inject()

- onMounted() 其所有同步子组件都已经被挂载 (不包含异步组件或 `<Suspense>` 树内的组件)。
- onUnmounted()

- toRef() toRefs() 简单理解是对象与属性建立响应式关系

- toRaw() unref()  toValue() 

- v-show v-if v-else v-for v-on v-bind v-model v-slot v-once v-memo

- 编译器宏：defineProps()、defineEmits()、defineExpose()、defineModel()、defineOptions()、defineSlots()，只能在`<script setup>`中。
- useSlots() 和 useAttrs()

## ref的解包

https://cn.vuejs.org/api/reactivity-core.html#reactive

```js
const count = ref(1)
const obj = reactive({ count })

// ref 会被解包
console.log(obj.count === count.value) // true

// 会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```


