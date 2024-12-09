# 文档 API

- createApp()
- app.mount()
- app.use() 安装一个插件
- app.component()
- app.directive()
- app.provide()
- app.config app.config.errorHandler app.config.performance
- app.config.globalProperties 应用内所有组件实例访问到的全局属性的对象，对 Vue 2 中 Vue.prototype 使用方式的一种替代

- nextTick()​ 当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。nextTick() 可以在状态改变后立即使用，以等待 DOM 更新完成。
- defineComponent() 定义 Vue 组件时提供类型推导的辅助函数。

- ref()
- computed()
- reactive()
- watchEffect() 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。
- watch()
- shallowRef()
- shallowReactive()
- provide() inject() 与注册生命周期钩子的 API 类似，都必须在组件的 setup() 阶段同步调用。

- onMounted()

  - 其所有同步子组件都已经被挂载 (不包含异步组件或 `<Suspense>` 树内的组件)。
  - 这个钩子在服务器端渲染期间不会被调用。

- onUnmounted()

  - 一个组件在以下情况下被视为已卸载：
  - 其所有子组件都已经被卸载。
  - 所有相关的响应式作用 (渲染作用以及 setup() 时创建的计算属性和侦听器) 都已经停止。

- toRef() toRefs() 简单理解是对象与属性建立响应式关系

- toRaw() unref() toValue()

- v-show v-if v-else v-for v-on v-bind v-model v-slot v-once v-memo
- v-if 当 v-if 元素被触发，元素及其所包含的指令/组件都会销毁和重构。如果初始条件是假，那么其内部的内容根本都不会被渲染。
- v-memo 缓存一个模板的子树。在元素和组件上都可以使用。为了实现缓存，该指令需要传入一个固定长度的依赖值数组进行比较。如果数组里的每个值都与最后一次的渲染相同，那么整个子树的更新将被跳过。
  - 与 v-for 一起使用 ✅（看文档）
- v-html scoped 样式将不会作用于 v-html 里的内容

- 编译器宏：defineProps()、defineEmits()、defineExpose()、defineModel()、defineOptions()、defineSlots()，只能在`<script setup>`中。
- useSlots() 、useAttrs()、useModel()、useTemplateRef()、useId()

- key
  - 在没有 key 的情况下，Vue 将使用一种最小化元素移动的算法，并尽可能地就地更新/复用相同类型的元素。如果传了 key，则将根据 key 的变化顺序来重新排列元素，并且将始终移除/销毁 key 已经不存在的元素。

## 单文件组件语法定义

- `<template>`语块包裹的内容将会被提取、传递给 @vue/compiler-dom，预编译为 JavaScript 渲染函数，并附在导出的组件上作为其 render 选项。
- `<script>` 默认导出应该是 Vue 的组件选项对象
- `<script setup>` 这个脚本块将被预处理为组件的 setup() 函数，这意味着它将为每一个组件实例都执行。

## 单文件组件 CSS 功能

- 深度选择器 .a :deep(.b) {
  /_ ... _/
  }
- 插槽选择器 :slotted
- 全局选择器
- 混合使用局部与全局样式
- CSS Modules 类似 react 那个
- CSS 中的 v-bind()

## 术语表

https://cn.vuejs.org/glossary/

- 调度器 (scheduler)
- VNode 即虚拟 DOM 节点。它们可以使用 h() 函数创建。
