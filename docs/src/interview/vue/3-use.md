# Vue3理解并使用

![vue-render-pipeline](/assets/images/vue-render-pipeline.png)

## 组件种类*

**在 Vue 里组件需要注册才能被使用和渲染的**。（这点容易被忽略，vue3提供了很多语法糖）

大概两大类：

1. 普通组件
    - .vue文件：选项式、组合式
    - `app.component('my-component', {...})`

2. 函数式组件（也被注册才能使用，没有任何状态的组件）
    - 以前的.vue文件 functional
    - 普通的.js/ts文件 function MyComponent(props, { slots, emit, attrs }) {}，可返回h()创建节点；
    - .jsx/tsx文件 function MyComponent(props, { slots, emit, attrs }) {}，可返回`<>`创建节点；
    - https://cn.vuejs.org/guide/extras/render-function.html#functional-components
    - 在 Vue 3 中，*所有的函数式组件*都是用普通函数创建的。换句话说，不需要定义 { functional: true } 组件选项。它们将接收两个参数：props 和 context。在 3.x 中，*有状态组件和函数式组件之间的性能差异已经大大减少*，并且在大多数用例中是微不足道的。https://v3-migration.vuejs.org/zh/breaking-changes/functional-components.html

3. 带状态的函数式组件（带setup的函数组件）
    - https://cn.vuejs.org/api/general.html#function-signature
    - defineComponent() 还有一种备用签名，旨在与组合式 API 和渲染函数或 JSX 一起使用。
    - **这个函数的工作方式与组合式 API 的 setup() 函数相同**：它接收 props 和 setup 上下文。返回值应该是一个渲染函数——支持 h() 和 JSX

## Vue组件、vnode、.jsx 区别*

- 组件是可以带状态、带样式、props、context、setup、生命周期等等，你所想象vue组件该有的东西。
- vnode通过h函数创建，用来对比渲染节点。组件实例中有render函数来创建vnode。
- .jsx文件`<>`，可理解为就是会单纯的编译成vnode。

- *vnode需要放到组件里，该被注册，同时被使用了，即存在于Vue组件树，才能被渲染出来。否则就是单纯的js对象。*
- vnode需要作为组件的一部分，才能能被渲染现实。

- .jsx文件就是单纯创建vnode，可以理解为.js文件+h函数。
- .jsx文件为了书写`<>`的

## 运行时的渲染树

- vnode 要想被渲染，需要在节点树的渲染函数中，就是需要在挂载的vue的节点树中。
- vnode 需要在渲染函数（render渲染中）里才能被现实，否则就是简单的js对象。
- vue有一个唯一的渲染树。
- 渲染函数只有在渲染树中才能被渲染。


### 创建 Vnodes 方式

1. h() 函数用于创建 vnodes
2. jsx/tsx 通过 h() 编译成 vnodes


```js
const vnode = <div>hello</div>
```

### 能生成render函数的几种方式：

render函数用来创建 vnode

1. （选项式API），使用 render 选项来声明渲染函数：

https://cn.vuejs.org/guide/extras/render-function.html#render-function-recipes

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

2. （选项式API），setup 选项来声明渲染函数：

https://cn.vuejs.org/guide/extras/render-function.html#render-function-recipes

当组合式 API 与模板一起使用时，setup() 钩子的返回值是用于暴露数据给模板。然而当我们使用渲染函数时，可以直接把渲染函数返回：

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // 返回渲染函数
    return () => h('div', props.msg + count.value)
  }
}
```

2. `<template>` 编译成渲染函数

4. 函数式组件

该函数实际上就是该组件的渲染函数

https://cn.vuejs.org/guide/extras/render-function.html#functional-components


## 项目编写tsx组件有哪些参考：

- *带状态的函数组件（函数签名） https://cn.vuejs.org/api/general.html#function-signature（使用的这种）
- 书写 JSX / TSX https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx
- TypeScript 与组合式 API https://cn.vuejs.org/guide/typescript/composition-api.html
- 类型工具 https://cn.vuejs.org/api/utility-types.html

## useDialog

### 为什么不再重新重建Vue根实例

- 因为要使用同一个Vue实例，来保持保持样式、状态、全局组件、app.use注册的所有插件、统一

### 为什么使用useDialog

- 可以直接被用到一些 composables 中，方变逻辑抽离聚合。