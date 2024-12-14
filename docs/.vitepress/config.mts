import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 导航最左标题
  title: "Kian's Blog",
  description: "Frontend Study Blog",
  // 文档入口
  srcDir: "./src",
  // 根目录
  base: "/blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',
    outlineTitle: '本页目录',

    // 顶部导航
    nav: [
      // { text: 'Home', link: '/' },
      {
        text: 'Vue',
        items: [
          { text: 'Vue', link: '/vue/guide', activeMatch: '/vue/' },
          { text: 'Nuxt', link: '/nuxt/base', activeMatch: '/nuxt/' },
        ]
      },
      {
        text: 'React',
        items: [
          { text: 'React', link: '/react/guide', activeMatch: '/react/' },
          { text: 'Nextjs', link: '/nextjs/base', activeMatch: '/nextjs/' },
        ]
      },
      { text: 'JavaScript', link: '/javascript/base/1', activeMatch: '/javascript/' },
      { text: 'HTMLCSS', link: '/htmlcss/css-1', activeMatch: '/htmlcss/' },
      { text: 'Browser', link: '/browser/network', activeMatch: '/browser/' },
      { text: 'Performance', link: '/performance/guide', activeMatch: '/performance/' },
      { text: 'Algorithm', link: '/algorithm/guide', activeMatch: '/algorithm/' },
      { text: 'Nodejs', link: '/nodejs/guide', activeMatch: '/nodejs/' },
      { text: 'Doc', link: '/doc/guide', activeMatch: '/doc/' }
    ],
    // 每个路由对应的左侧菜单
    sidebar: {
      '/htmlcss/': [
        {
          text: 'HTMLCSS 面试题',
          items: [
            { text: 'CSS 基础', link: '/htmlcss/css-1' },
            { text: 'CSS 布局', link: '/htmlcss/css-2' },
            { text: 'CSS 选择器', link: '/htmlcss/selector' },
            { text: 'CSS3', link: '/htmlcss/css-3' },
            { text: 'HTML5', link: '/htmlcss/html5' },
            { text: 'canvas 画布', link: '/htmlcss/canvas' },
            { text: 'iframe', link: '/htmlcss/iframe' },
            { text: 'WebSocket', link: '/htmlcss/websocket' },
          ]
        }
      ],
      '/javascript/': [
        {
          text: 'JavaScript 面试题',
          items: [
            {
              text: '基础',
              items: [
                { text: "数据类型相关", link: '/javascript/base/1' },
                { text: "执行上下文、作用域、闭包、this", link: '/javascript/base/2' },
                { text: "构造函数、原型、原型链、继承", link: '/javascript/base/3' },
                { text: "浏览器：文档、事件相关", link: '/javascript/base/4' },
                { text: "其它", link: '/javascript/base/5' },
                { text: "ES6+", link: '/javascript/base/es6' },
                { text: "EventLoop", link: '/javascript/base/event-loop' },
                { text: 'Proxy&Reflect', link: '/doc/javascript/proxy-reflect' },
              ]
            },
            {
              text: '手写',
              items: [
                { text: '经典1', link: '/javascript/coding/1' },
                { text: '经典2', link: '/javascript/coding/2' },
                { text: 'Promise', link: '/javascript/coding/promise' },
                { text: '正则', link: '/javascript/coding/reg' }
              ]
            }
          ]
        }
      ],
      '/browser/': [
        {
          text: '浏览器相关题',
          items: [
            { text: "网络", link: '/browser/network' },
            { text: "跨域", link: '/browser/cross-domain' },
            { text: "输入URL", link: '/browser/enter-a-url' },
            { text: "回流重绘", link: '/browser/reflow-repaint' },
            { text: "SEO", link: '/browser/seo' },
          ]
        },
        {
          text: '浏览器',
          items: [
            { text: '浏览器多进程多线程和JS单线程*', link: '/browser/processes-and-threads' },
            { text: '从输入URL到页面加载的过程*', link: '/browser/when-you-enter-a-url' },
            { text: 'HTTP请求头和响应头中cache-control的区别', link: '/browser/cache-control-client-or-server' },
          ]
        },
      ],
      '/vue/': [
        {
          text: 'Vue',
          items: [
            { text: "Guide", link: '/vue/guide' },
          ]
        },
        {
          text: 'Vue3',
          items: [
            { text: "文档", link: '/vue/3-doc' },
            { text: "文档·Api", link: '/vue/3-api' },
            { text: "文档·Typescript", link: '/vue/3-doc-ts' },
            { text: "响应式简述", link: '/vue/3-reactivity' },
            { text: '响应式源码', link: '/vue/3-reactivity-1' },
            { text: "使用", link: '/vue/3-use' },
            { text: "Router", link: '/vue/3-router' },
            { text: "Pinia", link: '/vue/3-pinia' },
            { text: "QA", link: '/vue/3-qa' },
          ]
        },
        {
          text: 'Vue2',
          items: [
            { text: "基础", link: '/vue/2-base' },
            { text: "响应式", link: '/vue/2-reactivity' },
            { text: "nextTick(2/3)", link: '/vue/2-nexttick' },
            { text: "渲染PatchDiff", link: '/vue/2-render-patch-diff' },
            { text: "编译", link: '/vue/2-compile' },
            { text: 'Vue2响应式原理概述*', link: '/vue/2-reactivity-1' },
            { text: 'Vue2批量异步更新与nextTick原理', link: '/vue/2-nexttick-1' },
            { text: 'Vue2组件渲染流程', link: '/vue/2-render-patch' },
            { text: "QA", link: '/vue/2-qa' },
          ]
        },
      ],
      '/nuxt/': [
        {
          text: 'Nuxt3 面试题',
          items: [
            { text: "基础", link: '/nuxt/base' },
            { text: "渲染模式", link: '/nuxt/rendering' },
            { text: "数据获取", link: '/nuxt/fetching' },
            { text: "服务器", link: '/nuxt/server' },
            { text: "项目模版", link: '/nuxt/starter' },
            { text: "QA1", link: '/nuxt/qa1' },
          ]
        },
      ],
      '/react/': [
        {
          text: '导读',
          items: [
            { text: "Guide", link: '/react/guide' },
          ]
        },
        {
          text: 'React文档',
          items: [
            { text: "Hooks", link: '/react/doc-react-hooks' },
            { text: "Hooks1", link: '/react/doc-react-hooks1' },
            { text: "Hooks2", link: '/react/doc-react-hooks2' },
            { text: "React Components", link: '/react/doc-react-components' },
            { text: "React API", link: '/react/doc-react-apis' },
            { text: "React DOM Hooks 组件 API", link: '/react/doc-react-dom-hooks-components-apis' },
            { text: "React 规则", link: '/react/doc-rules' },
            { text: "描述 UI", link: '/react/doc-describing-the-ui' },
            { text: "添加交互", link: '/react/doc-adding-interactivity' },
            { text: "状态管理", link: '/react/doc-managing-state' },
            { text: "脱围机制 ref", link: '/react/doc-escape-hatches-ref' },
            { text: "脱围机制 effect", link: '/react/doc-escape-hatches-effect' },
            { text: "脱围机制 hook", link: '/react/doc-escape-hatches-hook' },
          ]
        },
        {
          text: 'React题',
          items: [
            { text: "基础", link: '/react/base' },
            { text: "React18", link: '/react/18' },
            { text: "事件", link: '/react/event' },
            { text: "高阶组件", link: '/react/hoc' },
            { text: "Hooks", link: '/react/hooks' },
            { text: "Fiber", link: '/react/fiber' },
            { text: "Diff", link: '/react/diff' },
            { text: "路由", link: '/react/router' },
            { text: "状态管理", link: '/react/store' },
            { text: "优化", link: '/react/optimize' },
            { text: "SSR", link: '/react/ssr' },

          ]
        },
      ],
      '/nextjs/': [
        {
          text: 'Nextjs',
          items: [
            { text: "基础", link: '/nextjs/base' },
            { text: "AppRouter迁移", link: '/nextjs/app-router-migration' },
            { text: "渲染机制", link: '/nextjs/rendering' },
            { text: "Routing", link: '/nextjs/routing' },
            { text: "优化", link: '/nextjs/optimize' },
            { text: "QA1", link: '/nextjs/qa1' },
            { text: "QA2", link: '/nextjs/qa2' },
          ]
        },
      ],
      '/performance/': [
        {
          text: '性能优化',
          items: [
            { text: "概览", link: '/performance/guide' },
            { text: "基础", link: '/performance/base' },
            { text: "指标", link: '/performance/vitals' },
            { text: "长任务", link: '/performance/long-task' },
            { text: "Vue", link: '/performance/vue-nuxt' },
            { text: "React", link: '/performance/react-nextjs' },
          ]
        },
      ],
      '/algorithm/': [
        {
          text: '前端算法题',
          items: [
            { text: "导读", link: '/algorithm/guide.md' },
            { text: "数据结构", link: '/algorithm/data-structure.md' },
            { text: "排序", link: '/algorithm/sort' },
          ]
        },
        {
          text: 'LeetCode',
          items: [
            { text: "1. 两数之和", link: '/algorithm/leetcode/1.md' },
            { text: "3. 无重复字符的最长子串", link: '/algorithm/leetcode/3.md' },
            { text: "7. 整数反转（todo）", link: '/algorithm/leetcode/7.md' },
            { text: "8. 字符串转换整数 (atoi)（todo）", link: '/algorithm/leetcode/8.md' },
            { text: "14. 最长公共前缀（简单）", link: '/algorithm/leetcode/14.md' },
            { text: "20. 有效的括号（简单）", link: '/algorithm/leetcode/20.md' },
            { text: "26. 删除有序数组中的重复项", link: '/algorithm/leetcode/26.md' },
            { text: "28. 找出字符串中第一个匹配项的下标（简单）", link: '/algorithm/leetcode/28.md' },
            { text: "35. 搜索插入位置", link: '/algorithm/leetcode/35.md' },
            { text: "88. 合并两个有序数组", link: '/algorithm/leetcode/88.md' },
            { text: "125. 验证回文串（简单）", link: '/algorithm/leetcode/125.md' },
            { text: "136. 只出现一次的数字", link: '/algorithm/leetcode/136.md' },
            { text: "146. LRU 缓存（中等）", link: '/algorithm/leetcode/146.md' },
            { text: "165. 比较版本号（todo）", link: '/algorithm/leetcode/165.md' },
            { text: "211. 添加与搜索单词 - 数据结构设计（中等）（todo）", link: '/algorithm/leetcode/211.md' },
            { text: "217. 存在重复元素", link: '/algorithm/leetcode/217.md' },
            { text: "242. 有效的字母异位词（简单）", link: '/algorithm/leetcode/242.md' },
            { text: "283. 移动零", link: '/algorithm/leetcode/283.md' },
            { text: "322. 零钱兑换（todo）", link: '/algorithm/leetcode/322.md' },
            { text: "328. 奇偶链表（中等）", link: '/algorithm/leetcode/328.md' },
            { text: "344. 反转字符串（简单）", link: '/algorithm/leetcode/344.md' },
            { text: "349. 两个数组的交集", link: '/algorithm/leetcode/349.md' },
            { text: "350. 两个数组的交集 II", link: '/algorithm/leetcode/350.md' },
            { text: "387. 字符串中的第一个唯一字符（简单）", link: '/algorithm/leetcode/387.md' },
            { text: "680. 验证回文串 II（简单）", link: '/algorithm/leetcode/680.md' },
            { text: "704. 二分查找", link: '/algorithm/leetcode/704.md' },
            { text: "724. 寻找数组的中心下标", link: '/algorithm/leetcode/724.md' },
            { text: "2648. 生成斐波那契数列（todo）", link: '/algorithm/leetcode/2648.md' },
          ]
        }
      ],
      '/nodejs/': [
        {
          text: 'Nodejs',
          items: [
            { text: 'Guide', link: '/nodejs/guide' },
            { text: '核心概念*', link: '/nodejs/core-concepts' },
          ]
        }
      ],
      '/doc/': [
        {
          text: 'Doc',
          items: [
            { text: "Guide", link: '/doc/guide' },
          ]
        },
        {
          text: 'Vite面试题',
          items: [
            { text: "基础", link: '/doc/vite/base' },
            { text: "优化", link: '/doc/vite/optimize' },
            { text: "插件", link: '/doc/vite/plugin' },
            { text: "配置", link: '/doc/vite/setting' },
          ]
        },
        {
          text: 'Webpack题',
          items: [
            { text: "导读", link: '/doc/webpack/guide' },
            { text: "基础", link: '/doc/webpack/base' },
            { text: "Chunk", link: '/doc/webpack/chunk' },
            { text: "Loader", link: '/doc/webpack/loader' },
            { text: "Plugin", link: '/doc/webpack/plugin' },
            { text: "HMR", link: '/doc/webpack/hmr' },
            { text: "TreeShaking", link: '/doc/webpack/tree-shaking' },
            { text: "Webpack5", link: '/doc/webpack/5' },
            { text: "优化", link: '/doc/webpack/optimize' },
            { text: "Bundle打包后", link: '/doc/webpack/bundle' },
          ]
        },
        {
          text: '正则表达式',
          items: [
            { text: '正则表达式系列', link: '/doc/regexp/1' },
          ]
        },
        {
          text: 'Typescript',
          items: [
            { text: 'Typescript', link: '/doc/typescript/guide' },
          ]
        },
        {
          text: 'JD',
          items: [
            { text: 'Vue', link: '/doc/jd/vue' },
            { text: 'React', link: '/doc/jd/react' },
            { text: 'Web3', link: '/doc/jd/web3' },
          ]
        },
        {
          text: 'Testing',
          items: [
            { text: 'Testing', link: '/doc/testing/guide' },
          ]
        },
        {
          text: '工具',
          items: [
            { text: 'Base', link: '/doc/tool/base' },
            { text: 'Guide', link: '/doc/tool/guide' },
            { text: 'Xss', link: '/doc/tool/xss' },
            { text: 'Hybird', link: '/doc/tool/hybird' },
          ]
        },
        {
          text: '常用',
          items: [
            { text: 'Guide', link: '/doc/use-a/guide' },
          ]
        },
      ],

    },

    // 导航最右
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kian7812/blog' }
    ]
  },
  // head标签
  head: [
    ['link', { rel: 'shortcut icon', href: '/blog/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/blog/favicon.ico' }],
  ],
})
