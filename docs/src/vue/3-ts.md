# Vue 中 TypeScript（文档）

- 概览 https://cn.vuejs.org/guide/typescript/overview.html
- 组合式 https://cn.vuejs.org/guide/typescript/composition-api.html
- 类型工具 https://cn.vuejs.org/api/utility-types.html
- `script setup`中ts使用 https://cn.vuejs.org/api/sfc-script-setup.html


## 在单文件组件中的用法

1. 选项式

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- 启用了类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```
2. `<script setup>`中

```vue
<script setup lang="ts">
// 启用了 TypeScript
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- 启用了类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```

## tsx组件

函数签名 https://cn.vuejs.org/api/general.html#function-signature


## 为组件的 props 标注类型

在 `<script setup lang="ts">` 中，defineProps() 宏函数支持从它的参数中推导类型。

通过泛型参数来定义 props 的类型通常更直接：
```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

## 为组件的 emits 标注类型

使用 defineEmits() 宏函数，更多参考文档
```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于选项
const emit = defineEmits({
  change: (id: number) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  },
  update: (value: string) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  }
})

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: 可选的、更简洁的语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

## 为 ref() 标注类型

默认隐士类型推到。

```ts
// 使用 Ref 这个类型：
const year: Ref<string | number> = ref('2020')
// 使用 泛型
const year = ref<string | number>('2020')
```
## 为 reactive() 标注类型

默认隐士类型推到。

官方：*不推荐使用 reactive() 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同*。

```ts
// 显式地标注一个 reactive 变量的类型，我们可以使用接口：
interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

## 为 computed() 标注类型

computed() 会自动从其计算函数的返回值上推导出类型。

或者使用泛型。

## 为事件处理函数标注类型

## 为 provide / inject 标注类型

```ts
const key = Symbol() as InjectionKey<string>
```

## 为模板引用标注类型

模板引用需要通过一个显式指定的泛型参数和一个初始值 null 来创建：
```ts
const el = ref<HTMLInputElement | null>(null)
```

## 为组件模板引用标注类型

为了获取 MyModal 的类型，我们首先需要通过 typeof 得到其类型，再使用 TypeScript 内置的 InstanceType 工具类型来获取其实例类型：

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
// ...
defineExpose({
  open
})
</script>

<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

果组件的具体类型无法获得，或者你并不关心组件的具体类型，那么可以使用 ComponentPublicInstance。这只会包含所有组件都共享的属性。