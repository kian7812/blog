# 项目工程搭建

modules：gtag、pinia


i18n、vue-i18n

Nuxt Image

vueuse

dayjs、lodash-es

swiper

tailwindcss

element-plus


## 类型

enums/目录

type.ts

## 接口

apis/目录

~enums/interface.ts // 定义接口返回 code 值的枚举

~/composables/useDefaultRequest.ts  // 定义接口统一拦截函数

## 代码规范

https://juejin.cn/post/7249297734866812983

ESLint + Prettier + Stylelint + Commitlint + husky钩子

lint-staged 借用 lint-staged 可以仅校验每次提交的内容

vue和nuxt3提供的一些

## 状态

store/目录
@pinia/nuxt


## 环境变量
runtimeConfig：需要在使用环境变量构建后指定的私有或公共令牌。
app.config：在构建时确定的公共令牌，网站配置，如主题变量，标题和任何不敏感的项目配置。

```js
import { NuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  runtimeConfig: {
     public: {
        apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
        loginUrl: process.env.NUXT_PUBLIC_LOGIN_URL,
        locationOriginUrl: process.env.NUXT_PUBLIC_LOCATION_ORIGIN_URL,
     },
   }
} as NuxtConfig);

```

## 配置主题
```js
export default defineNuxtConfig({
  vite: {
    plugins: [
      Components({
        resolvers: [
--        AntDesignVueResolver(),
++        AntDesignVueResolver({
++          importStyle: "less",
++        }),
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/styles/index.less";',
++        modifyVars: {
++          "primary-color": "#04dc82",
++        },
++        javascriptEnabled: true,
        },
      },
    },
  },
} as NuxtConfig);
```



## 多语言

https://www.cnblogs.com/chenyi4/p/12409074.html

国际化是怎做的，有什么优化方式，除了vue-i18这种，还有什么方案（这个是和登录鉴权有类似的流程的）
除了在本地添加多语言，还有其他方式吗

多语言、vue-i18n

1. vue-i18n, 本地配置好对应的语言包，根据不同语言环境，初始化对应的语言包，使用时调用$t方法传入key来获取对应的翻译文案
2. 另一种方案是通过后端接口返回，请求时cookie或header上携带lang，后端根据lang类型返回对应的语言文案（场景有比如返回提示信息给到用户的接口、模版接口会根据lang类型返回所有表单需要的语言文案）

优化：

1. 按需加载（本地）语言包，
和按需加载组件方式一样，都是通过webpack import语法动态引入文件，打包构建时会切割成单独文件。
可以路由拦截里做判断，如果与当前语言做比较如果不一样，异步加载语言包，然后再做一些语音类型初始化。

2. 还可以对翻译阶段做下辅助优化，比如使用固定字符包裹汉字作为key，然后对src下的文件筛选拿到未翻译的key导出Excel或上传到服务器，然后再拿到翻译好的文件进行读取，避免手动替换。 $t('{#返回#}’)