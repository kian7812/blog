import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Frontend Interview",
  description: "Frontend interview preparation materials",
  srcDir: "./src",
  base: "/fed",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',
    outlineTitle: '本页目录',

    nav: [
      // { text: 'Home', link: '/' },
      {
        text: 'Interview',
        items: [
          { text: '1 Vue', link: '/interview/vue/guide', activeMatch: '/vue/' },
          { text: '1 React', link: '/interview/react/guide', activeMatch: '/react/' },
          { text: '2 JavaScript', link: '/interview/javascript/base/1', activeMatch: '/javascript/' },
          { text: '2 HTMLCSS', link: '/interview/htmlcss/css-1', activeMatch: '/htmlcss/' },
          { text: '2 Browser', link: '/interview/browser/network', activeMatch: '/browser/' },
          { text: '2 Performance', link: '/interview/performance/guide', activeMatch: '/performance/' },
          { text: '3 TypeScript', link: '/interview/typescript/guide', activeMatch: '/typescript/' },
          { text: '3 Webpack', link: '/interview/webpack/base', activeMatch: '/webpack/' },
          { text: '4 Nuxt', link: '/interview/nuxt/base', activeMatch: '/nuxt/' },
          { text: '4 Nextjs', link: '/interview/nextjs/base', activeMatch: '/nextjs/' },
          { text: '4 Starter', link: '/interview/starter/guide', activeMatch: '/starter/' },
          { text: '6 Algorithm', link: '/interview/algorithm/guide', activeMatch: '/algorithm/' },
          { text: '6 Vite', link: '/interview/vite/base', activeMatch: '/vite/' },
          { text: '6 Web3', link: '/interview/web3/base', activeMatch: '/web3/' },
        ]
      },
      { text: 'Blog', link: '/blog/guide', activeMatch: '/blog/' }
    ],

    sidebar: {
      '/interview/htmlcss/': [
        {
          text: 'HTMLCSS 面试题',
          items: [
            { text: 'CSS 基础', link: '/interview/htmlcss/css-1' },
            { text: 'CSS 布局', link: '/interview/htmlcss/css-2' },
            { text: 'CSS 选择器', link: '/interview/htmlcss/selector' },
            { text: 'CSS3', link: '/interview/htmlcss/css-3' },
            { text: 'HTML5', link: '/interview/htmlcss/html5' },
            { text: 'canvas 画布', link: '/interview/htmlcss/canvas' },
            { text: 'iframe', link: '/interview/htmlcss/iframe' },
            { text: 'WebSocket', link: '/interview/htmlcss/websocket' },
          ]
        }
      ],
      '/interview/javascript/': [
        {
          text: 'JavaScript 面试题',
          items: [
            {
              text: '基础',
              items: [
                { text: "数据类型相关", link: '/interview/javascript/base/1' },
                { text: "执行上下文、作用域、闭包、this", link: '/interview/javascript/base/2' },
                { text: "构造函数、原型、原型链、继承", link: '/interview/javascript/base/3' },
                { text: "浏览器：文档、事件相关", link: '/interview/javascript/base/4' },
                { text: "其它", link: '/interview/javascript/base/5' },
                { text: "ES6+", link: '/interview/javascript/base/es6' },
                { text: "EventLoop", link: '/interview/javascript/base/event-loop' }
              ]
            },
            {
              text: '手写',
              items: [
                { text: '经典1', link: '/interview/javascript/coding/1' },
                { text: '经典2', link: '/interview/javascript/coding/2' },
                { text: 'Promise', link: '/interview/javascript/coding/promise' },
                { text: '正则', link: '/interview/javascript/coding/reg' }
              ]
            }
          ]
        }
      ],
      '/interview/browser/': [
        {
          text: '浏览器相关题',
          items: [
            { text: "网络", link: '/interview/browser/network' },
            { text: "跨域", link: '/interview/browser/cross-domain' },
            { text: "输入URL", link: '/interview/browser/enter-a-url' },
            { text: "优化1", link: '/interview/browser/optimize-1' },
            { text: "回流重绘", link: '/interview/browser/reflow-repaint' },
            { text: "SEO", link: '/interview/browser/seo' },
          ]
        }
      ],
      '/interview/vue/': [
        {
          text: 'Vue',
          items: [
            { text: "Guide", link: '/interview/vue/guide' },

          ]
        },
        {
          text: 'Vue3',
          items: [
            { text: "基础", link: '/interview/vue/3-base' },
            { text: "响应式", link: '/interview/vue/3-reactivity' },
            { text: "使用", link: '/interview/vue/3-use' },
            { text: "Setup", link: '/interview/vue/3-setup' },
            { text: "Typescript", link: '/interview/vue/3-ts' },
            { text: "Router", link: '/interview/vue/3-router' },
            { text: "Pinia", link: '/interview/vue/3-pinia' },
            { text: "QA", link: '/interview/vue/3-qa' },
          ]
        },
        {
          text: 'Vue2',
          items: [
            { text: "基础", link: '/interview/vue/2-base' },
            { text: "响应式", link: '/interview/vue/2-reactivity' },
            { text: "nextTick(2/3)", link: '/interview/vue/2-nexttick' },
            { text: "渲染PatchDiff", link: '/interview/vue/2-render-patch-diff' },
            { text: "编译", link: '/interview/vue/2-compile' },
            { text: "QA", link: '/interview/vue/2-qa' },
          ]
        }
      ],
      '/interview/react/': [
        {
          text: '导读',
          items: [
            { text: "Guide", link: '/interview/react/guide' },
          ]
        },
        {
          text: 'React文档',
          items: [
            { text: "Hooks", link: '/interview/react/doc-react-hooks' },
            { text: "Hooks1", link: '/interview/react/doc-react-hooks1' },
            { text: "Hooks2", link: '/interview/react/doc-react-hooks2' },
            { text: "React Components", link: '/interview/react/doc-react-components' },
            { text: "React API", link: '/interview/react/doc-react-apis' },
            { text: "React DOM Hooks 组件 API", link: '/interview/react/doc-react-dom-hooks-components-apis' },
            { text: "React 规则", link: '/interview/react/doc-rules' },
            { text: "描述 UI", link: '/interview/react/doc-describing-the-ui' },
            { text: "添加交互", link: '/interview/react/doc-adding-interactivity' },
            { text: "状态管理", link: '/interview/react/doc-managing-state' },
            { text: "脱围机制 ref", link: '/interview/react/doc-escape-hatches-ref' },
            { text: "脱围机制 effect", link: '/interview/react/doc-escape-hatches-effect' },
            { text: "脱围机制 hook", link: '/interview/react/doc-escape-hatches-hook' },
          ]
        },
        {
          text: 'React题',
          items: [
            { text: "基础", link: '/interview/react/base' },
            { text: "React18", link: '/interview/react/18' },
            { text: "事件", link: '/interview/react/event' },
            { text: "高阶组件", link: '/interview/react/hoc' },
            { text: "Hooks", link: '/interview/react/hooks' },
            { text: "Fiber", link: '/interview/react/fiber' },
            { text: "Diff", link: '/interview/react/diff' },
            { text: "路由", link: '/interview/react/router' },
            { text: "状态管理", link: '/interview/react/store' },
            { text: "优化", link: '/interview/react/optimize' },
            { text: "SSR", link: '/interview/react/ssr' },

          ]
        },
      ],
      '/interview/webpack/': [
        {
          text: 'Webpack题',
          items: [
            { text: "导读", link: '/interview/webpack/guide' },
            { text: "基础", link: '/interview/webpack/base' },
            { text: "Chunk", link: '/interview/webpack/chunk' },
            { text: "Loader", link: '/interview/webpack/loader' },
            { text: "Plugin", link: '/interview/webpack/plugin' },
            { text: "HMR", link: '/interview/webpack/hmr' },
            { text: "TreeShaking", link: '/interview/webpack/tree-shaking' },
            { text: "Webpack5", link: '/interview/webpack/5' },
            { text: "优化", link: '/interview/webpack/optimize' },
            { text: "Bundle打包后", link: '/interview/webpack/bundle' },
          ]
        },
      ],
      '/interview/vite/': [
        {
          text: 'Vite面试题',
          items: [
            { text: "基础", link: '/interview/vite/base' },
            { text: "优化", link: '/interview/vite/optimize' },
            { text: "插件", link: '/interview/vite/plugin' },
            { text: "配置", link: '/interview/vite/setting' },
          ]
        },
      ],
      '/interview/nextjs/': [
        {
          text: 'Nextjs面试题',
          items: [
            { text: "基础", link: '/interview/nextjs/base' },
            { text: "AppRouter迁移", link: '/interview/nextjs/app-router-migration' },
            { text: "渲染机制", link: '/interview/nextjs/rendering' },
            { text: "Routing", link: '/interview/nextjs/routing' },
            { text: "优化", link: '/interview/nextjs/optimize' },
            { text: "QA1", link: '/interview/nextjs/qa1' },
            { text: "QA2", link: '/interview/nextjs/qa2' },
          ]
        },
      ],
      '/interview/nuxt/': [
        {
          text: 'Nuxt3 面试题',
          items: [
            { text: "基础", link: '/interview/nuxt/base' },
            { text: "渲染模式", link: '/interview/nuxt/rendering' },
            { text: "数据获取", link: '/interview/nuxt/fetching' },
            { text: "服务器", link: '/interview/nuxt/server' },
            { text: "项目模版", link: '/interview/nuxt/starter' },
            { text: "QA1", link: '/interview/nuxt/qa1' },
          ]
        },
      ],
      '/interview/performance/': [
        {
          text: '性能优化',
          items: [
            { text: "概览", link: '/interview/performance/guide' },
            { text: "基础", link: '/interview/performance/base' },
            { text: "指标", link: '/interview/performance/vitals' },
            { text: "长任务", link: '/interview/performance/long-task' },
            { text: "Vue", link: '/interview/performance/vue-nuxt' },
            { text: "React", link: '/interview/performance/react-nextjs' },
          ]
        },
      ],
      '/interview/algorithm/': [
        {
          text: '前端算法题',
          items: [
            { text: "导读", link: '/interview/algorithm/guide.md' },
            { text: "数据结构", link: '/interview/algorithm/data-structure.md' },
            { text: "排序", link: '/interview/algorithm/sort' },
          ]
        },
        {
          text: 'LeetCode',
          items: [
            { text: "1. 两数之和", link: '/interview/algorithm/leetcode/1.md' },
            { text: "3. 无重复字符的最长子串", link: '/interview/algorithm/leetcode/3.md' },
            { text: "7. 整数反转（todo）", link: '/interview/algorithm/leetcode/7.md' },
            { text: "8. 字符串转换整数 (atoi)（todo）", link: '/interview/algorithm/leetcode/8.md' },
            { text: "14. 最长公共前缀（简单）", link: '/interview/algorithm/leetcode/14.md' },
            { text: "20. 有效的括号（简单）", link: '/interview/algorithm/leetcode/20.md' },
            { text: "26. 删除有序数组中的重复项", link: '/interview/algorithm/leetcode/26.md' },
            { text: "28. 找出字符串中第一个匹配项的下标（简单）", link: '/interview/algorithm/leetcode/28.md' },
            { text: "35. 搜索插入位置", link: '/interview/algorithm/leetcode/35.md' },
            { text: "88. 合并两个有序数组", link: '/interview/algorithm/leetcode/88.md' },
            { text: "125. 验证回文串（简单）", link: '/interview/algorithm/leetcode/125.md' },
            { text: "136. 只出现一次的数字", link: '/interview/algorithm/leetcode/136.md' },
            { text: "146. LRU 缓存（中等）", link: '/interview/algorithm/leetcode/146.md' },
            { text: "165. 比较版本号（todo）", link: '/interview/algorithm/leetcode/165.md' },
            { text: "211. 添加与搜索单词 - 数据结构设计（中等）（todo）", link: '/interview/algorithm/leetcode/211.md' },
            { text: "217. 存在重复元素", link: '/interview/algorithm/leetcode/217.md' },
            { text: "242. 有效的字母异位词（简单）", link: '/interview/algorithm/leetcode/242.md' },
            { text: "283. 移动零", link: '/interview/algorithm/leetcode/283.md' },
            { text: "322. 零钱兑换（todo）", link: '/interview/algorithm/leetcode/322.md' },
            { text: "328. 奇偶链表（中等）", link: '/interview/algorithm/leetcode/328.md' },
            { text: "344. 反转字符串（简单）", link: '/interview/algorithm/leetcode/344.md' },
            { text: "349. 两个数组的交集", link: '/interview/algorithm/leetcode/349.md' },
            { text: "350. 两个数组的交集 II", link: '/interview/algorithm/leetcode/350.md' },
            { text: "387. 字符串中的第一个唯一字符（简单）", link: '/interview/algorithm/leetcode/387.md' },
            { text: "680. 验证回文串 II（简单）", link: '/interview/algorithm/leetcode/680.md' },
            { text: "704. 二分查找", link: '/interview/algorithm/leetcode/704.md' },
            { text: "724. 寻找数组的中心下标", link: '/interview/algorithm/leetcode/724.md' },
            { text: "2648. 生成斐波那契数列（todo）", link: '/interview/algorithm/leetcode/2648.md' },
          ]
        }
      ],
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: "Guide", link: '/blog/guide' },
          ]
        },
        {
          text: '浏览器',
          items: [
            { text: '浏览器多进程多线程和JS单线程*', link: '/blog/browser/processes-and-threads' },
            { text: '从输入URL到页面加载的过程*', link: '/blog/browser/when-you-enter-a-url' },
            { text: 'HTTP请求头和响应头中cache-control的区别', link: '/blog/browser/cache-control-client-or-server' },
          ]
        },
        {
          text: 'JavaScript',
          items: [
            { text: 'Proxy&Reflect', link: '/blog/javascript/proxy-reflect' },
          ]
        },
        {
          text: '正则表达式',
          items: [
            { text: '正则表达式系列', link: '/blog/regexp/1' },
          ]
        },
        {
          text: 'Vue',
          items: [
            { text: 'Vue3中的响应式原理*', link: '/blog/vue/1/reactivity' },
            { text: 'Vue2响应式原理概述*', link: '/blog/vue/2/reactivity' },
            { text: 'Vue2批量异步更新与nextTick原理', link: '/blog/vue/2/nexttick' },
            { text: 'Vue2组件渲染流程', link: '/blog/vue/2/renderpatch' },
          ]
        },
        {
          text: 'JD',
          items: [
            { text: 'Vue', link: '/blog/jd/vue' },
            { text: 'React', link: '/blog/jd/react' },
            { text: 'Web3', link: '/blog/jd/web3' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yangxqian12/frontend-interview-questions' }
    ]
  },
  head: [
    ['link', { rel: 'shortcut icon', href: '/frontend-interview-questions/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/frontend-interview-questions/favicon.ico' }],
  ],
})
