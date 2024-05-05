# setup（文档）

## setup()函数

https://cn.vuejs.org/api/composition-api-setup.html

setup() 钩子是在组件中使用组合式 API 的入口

- 在 setup() 函数中返回的对象会暴露给模板和组件实例。
- 在模板中访问从 setup 返回的 ref 时，它会自动浅层解包
- setup() 自身并不含对组件实例的访问权，即**在 setup() 中访问 this 会是 undefined**。
- 可以使用 async setup() ，该组件作为 Suspense 组件的后裔。

### 访问 Props

setup 函数的第一个参数是组件的 props。

### props解构响应丢失

请注意如果你解构了 props 对象，解构出的变量将会丢失响应性。因此我们推荐通过 props.xxx 的形式来使用其中的 props。

果你确实需要解构 props 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，那么你可以使用 toRefs() 和 toRef() 这两个工具函数：

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)

    // 或者，将 `props` 的单个属性转为一个 ref
    const title = toRef(props, 'title')
  }
}
```

### Setup 上下文

传入 setup 函数的第二个参数是一个 Setup 上下文对象。

上下文对象暴露了:
```js
export default {
  setup(props, context) {
    // 透传 Attributes（非响应式的对象，等价于 $attrs）
    console.log(context.attrs)

    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots)

    // 触发事件（函数，等价于 $emit）
    console.log(context.emit)

    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
```
该上下文对象是非响应式的，可以安全地解构：
```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

## `<script setup>`

https://cn.vuejs.org/api/sfc-script-setup.html

### 运行时 setup 只调用一次*

- onMounted() 也可以在一个外部函数中调用，只要调用栈是同步的，且最终起源自 setup() 就可以。https://cn.vuejs.org/guide/essentials/lifecycle.html

- setup() 函数在每个组件中**只会被调用一次**，而返回的渲染函数将会被调用多次。https://cn.vuejs.org/guide/extras/render-function.html#declaring-render-function

### composables 注册

composables 都需要在 setup 中 调用，才能被使用，即需要在setup中‘注册’。

组合式函数只能在 `<script setup>` 或 setup() 钩子中被调用。在这些上下文中，它们也只能被同步调用。这些限制很重要，因为这些是 Vue 用于确定当前活跃的组件实例的上下文。访问活跃的组件实例很有必要，这样才能：
- 将生命周期钩子注册到该组件实例上
- 将计算属性和监听器注册到该组件实例上，以便在该组件被卸载时停止监听，避免内存泄漏。

### 顶层的绑定会被暴露给模板

在 setup() 函数中手动暴露大量的状态和方法非常繁琐。当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 导入的内容) 都能在模板中直接使用。

### 使用组件的方式

普通组件、动态组件、递归组件、命名空间组件

### 使用自定义指令

- 本地的自定义指令在 `<script setup>` 中不需要显式注册，但他们必须遵循 vNameOfDirective 这样的命名规范：
- 如果指令是从别处导入的，可以通过重命名来使其符合命名规范：

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```
```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

### 编译器宏只能在 `<script setup>` 中使用

defineProps() 和 defineEmits()、defineModel()、defineExpose()、defineOptions() ​

defineSlots()​ 它还返回 slots 对象，该对象等同于在 setup 上下文中暴露或由 useSlots() 返回的 slots 对象。


### 顶层 await

`<script setup>` 中可以使用顶层 await。结果代码会被编译成 `async setup()`

async setup() 必须与 Suspense 内置组件组合使用。

### 泛型

https://cn.vuejs.org/api/sfc-script-setup.html#generics

应该是，这里ts并不是完全版typescript，所以这里的泛型支持，就是单纯的定义泛型变量给到里面使用。