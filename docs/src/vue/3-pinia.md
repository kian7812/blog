# Pinia（文档）

https://pinia.vuejs.org/zh/


Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。
如果你熟悉组合式 API 的话，*你可能会认为可以通过一行简单的 export const state = reactive({}) 来共享一个全局状态。对于单页应用来说确实可以，但如果应用在服务器端渲染，这可能会使你的应用暴露出一些安全漏洞*。

## Store 是什么？

它承载着全局状态。

有三个概念，**state、getter 和 action**，我们可以假设这些概念相当于组件中的 data、 computed 和 methods。

## 定义 Store

Option Store：与 Vue 的选项式 API 类似。

Setup Store：与 Vue 组合式 API 的 setup 函数 相似。

注意，要让 pinia 正确识别 state，你**必须在 setup store 中返回 state 的所有属性**。这意味着，你不能在 store 中使用私有属性。**不完整返回会影响 SSR** ，而开发工具和其他插件的正常运行。

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```
在 Setup Store 中：
- ref() 就是 state 属性
- computed() 就是 getters（被reactive包装了，不需要.value）
- function() 就是 actions

### 使用 Store

一旦 store 被实例化，你可以直接访问在 store 的 state、getters 和 actions 中定义的任何属性。

请注意，**store 是一个用 reactive 包装的对象**，这意味着*不需要在 getters 后面写 .value*。*就像 setup 中的 props 一样，我们不能对它进行解构*。

### 从 Store 解构

为了从 store 中提取属性时保持其响应性，需要使用 storeToRefs()。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。请注意，你可以直接从 store 中解构 action，因为它们也被绑定到 store 上：
```vue
<script setup>
import { storeToRefs } from 'pinia'
const store = useCounterStore()
// `name` 和 `doubleCount` 是响应式的 ref
// 同时通过插件添加的属性也会被提取为 ref
// 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
const { name, doubleCount } = storeToRefs(store)
// 作为 action 的 increment 可以直接解构
const { increment } = store
</script>
```


## 对比 Vuex 3.x/4.x

Pinia API 与 Vuex(<=4) 也有很多不同，即：

- mutation 已被弃用。它们经常被认为是极其冗余的。它们初衷是带来 devtools 的集成方案，但这已不再是一个问题了。
- 无需要创建自定义的复杂包装器来支持 TypeScript，一切都可标注类型，API 的设计方式是尽可能地利用 TS 类型推理。
- 无过多的魔法字符串注入，只需要导入函数并调用它们，然后享受自动补全的乐趣就好。
- 无需要动态添加 Store，它们默认都是动态的，甚至你可能都不会注意到这点。注意，你仍然可以在任何时候手动使用一个 Store 来注册它，但因为它是自动的，所以你不需要担心它。
- 不再有嵌套结构的模块。你仍然可以通过导入和使用另一个 Store 来隐含地嵌套 stores 空间。虽然 Pinia 从设计上提供的是一个扁平的结构，但仍然能够在 Store 之间进行交叉组合。你甚至可以让 Stores 有循环依赖关系。
- 不再有可命名的模块。考虑到 Store 的扁平架构，Store 的命名取决于它们的定义方式，你甚至可以说所有 Store 都应该命名。

## 
（参考文档）

**State**
- 访问 state 并直接修改
- 重置 state，$reset()
- 变更 state，$patch()
- 替换 state，$state = {}
- 订阅 state，$subscribe()，比起普通的 watch()，使用 $subscribe() 的好处是 subscriptions 在 patch 后只触发一次。

**Getter**
- 访问其他 getter
- 向 getter 传递参数
- 访问其他 store 的 getter

**Action**
- action 可以是异步的
- 访问其他 store 的 action
- 订阅 action

**插件**

Pinia store 可以支持扩展以下内容：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如本地存储
- 仅应用插件于特定 store

插件是通过 pinia.use() 添加到 pinia 实例的。

**服务端渲染 (SSR)**



## 在组件外使用 store 非 SSR

如果你不做任何 SSR(服务器端渲染)，**在用 app.use(pinia) 安装 pinia 插件后，对 useStore() 的任何调用都会正常执行**。

- 在组件 setup 中使用，比较常规。包括在hooks中、在接口中使用，其实hooks、接口都是在组件中发起的。


### 在 Vue Router 的导航守卫中使用 store 的例子：

为确保 pinia 实例被激活，最简单的方法就是将 useStore() 的调用放在 pinia 安装后才会执行的函数中。

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ 由于引入顺序的问题，这将失败
const store = useStore()

router.beforeEach((to, from, next) => {
  // 我们想要在这里使用 store
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ 这样做是可行的，因为路由器是在其被安装之后开始导航的，
  // 而此时 Pinia 也已经被安装。
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

## 服务端渲染 (SSR) Nuxtjs

搭配 Nuxt 的 Pinia 更易用，因为 Nuxt 处理了很多与服务器端渲染有关的事情。

`npm install pinia @pinia/nuxt`

在 setup() 外部使用 store：

选项式API：
```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```
`<script setup>`中：
```vue
<script setup>
const store = useStore()
const { data } = await useAsyncData('user', () => store.fetchUser())
</script>
```

```
todo疑问:
1. 在服务端操作过得store会初始化到 clint吗
2. 上面的客户端也有时机调用。
```
