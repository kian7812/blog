# 数据获取*

- https://www.nuxt.com.cn/docs/getting-started/data-fetching
- https://www.youtube.com/watch?v=b1S5os65Urs（视频介绍使用场景）

useFetch useAsyncData $fetch

## 概括

::: info
- 首先 useFetch useAsyncData $fetch 这三个都能在客户端和服务端发起请求。（文档中：#仅在客户端获取数据 https://www.nuxt.com.cn/docs/getting-started/data-fetching）

- useAsyncData场景
  - useFetch组合函数用于在设置方法中调用，或在生命周期钩子函数的函数顶层直接调用，否则你应该使用$fetch方法。
  - useFetch、useAsyncData是一个可组合函数，可以直接在设置函数、插件或路由中调用。
  - 执行场景：初始页面进入时执行，客户端路由切换，或SSR中路由访问时。
  - 阻塞导航场景：同时可能会发生在，客户端路由切换，或SSR中路由访问时。可通过lazy配置。
  - 返回数据：在SSR中请求，会携带payload返回。

- 项目中request库应该要基于$fetch封装，$fetch是nuxt基于ofetch封装的nuxt底层请求方法。
  - useAsyncData有特定的使用场景。
:::

## $fetch
https://www.nuxt.com.cn/docs/api/utils/dollarfetch

用于在Vue应用程序或API路由中进行HTTP请求。（客户端和服务端都可使用）。

注意：在组件中使用$fetch而不使用useAsyncData进行包装会导致数据被获取两次：首先在服务器端获取，然后在客户端进行混合渲染期间再次获取，因为$fetch不会将状态从服务器传递到客户端。因此，获取将在两端执行，因为客户端需要再次获取数据。

- 建议在获取组件数据时使用useFetch或useAsyncData + $fetch来防止重复获取数据。
- $fetch是在Nuxt中进行HTTP调用的首选方式，而不是为Nuxt 2设计的@nuxt/http和@nuxtjs/axios。

```vue
<script setup lang="ts">
// 在SSR中数据将被获取两次，一次在服务器端，一次在客户端。（注意：在SSR中，两次）
const dataTwice = await $fetch('/api/item')

// 在SSR中，数据仅在服务器端获取并传递到客户端。（注意：在SSR中）
const { data } = await useAsyncData('item', () => $fetch('/api/item'))

// 你也可以使用useFetch作为useAsyncData + $fetch的快捷方式
const { data } = await useFetch('/api/item')
</script>
```

可以在只在客户端执行的任何方法中使用$fetch。

```vue
<script setup lang="ts">
function contactForm() {
  $fetch('/api/contact', {
    method: 'POST',
    body: { hello: 'world '}
  })
}
</script>

<template>
  <button @click="contactForm">联系我们</button>
</template>
```

## useAsyncData

https://www.nuxt.com.cn/docs/api/composables/use-async-data

useAsyncData提供了一种在SSR友好的组合式中访问异步解析数据的方式。

useAsyncData是一种组合式，可以直接在设置函数、插件或路由中调用。它返回响应式的组合式，并处理将响应添加到Nuxt负载中，以便在页面水合时从服务器传递到客户端，而不需要在客户端重新获取数据。

```vue
<script setup>
const { data, pending, error, refresh } = await useAsyncData(
  'mountains',
  () => $fetch('https://api.nuxtjs.dev/mountains')
)
</script>
```
options
- lazy: 是否在页面加载之后再等待执行异步任务，默认为false，表示在页面加载之前会阻塞，直到异步任务执行完。

返回值
- data: 返回一个 ref 的数据值 https://tr.zhiyakeji.com/post/27
  - 服务端在返回这个data的同时，会将data数据序列化并存放在payload里，payload和已经渲染好的html文本一起发送给浏览器
  - 在客户端(浏览器)第一次加载页面执行这个方法的时候，并不会真正的等待执行异步任务，而是先检查payload中是否已经存在此数据，如果存在则直接返回payload中的数据。这样客户端不用再次请求接口，而是直接拿到服务端已经请求过的数据。
  - 然后在客户端切换路由过程中再次加载此页面时，会等待执行异步任务，此时data里是最新的数据。

*（其实useAsyncData里面也需要$fetch来发起请求）*

## useLazyAsyncData

默认情况下，useAsyncData会阻塞导航，直到其异步处理程序解析完成。useLazyAsyncData在useAsyncData周围提供了一个包装器，通过将lazy选项设置为true，在处理程序解析之前触发导航。

## useFetch

https://www.nuxt.com.cn/docs/api/composables/use-fetch

*一个useAsyncData的封装或语法糖*

这个可组合函数提供了一个方便的封装，包装了useAsyncData和$fetch。它根据URL和fetch选项自动生成一个键，根据服务器路由提供请求URL的类型提示，并推断API响应类型。

useFetch是一个可组合函数，可以直接在设置函数、插件或路由中调用。它返回响应式的可组合函数，并处理将响应添加到Nuxt的负载中，以便在页面水合时可以从服务器传递给客户端，而无需在客户端重新获取数据。

```vue
<script setup>
const route = useRoute()

const { data, pending, error, refresh } = await useFetch(`https://api.nuxtjs.dev/mountains/${route.params.slug}`, {
  pick: ['title']
})
</script>
```