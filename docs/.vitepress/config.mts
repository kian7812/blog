import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Frontend Interview",
  description: "Frontend interview preparation materials",
  srcDir: "./src",
  base: "/frontend-interview-questions/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',
    outlineTitle: '本页目录',

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Interview',
        items: [
          { text: 'HTMLCSS', link: '/interview/htmlcss/css-1', activeMatch: '/htmlcss/' },
          { text: 'JavaScript', link: '/interview/javascript/base/1', activeMatch: '/javascript/' },
          { text: 'Browser', link: '/interview/browser/network', activeMatch: '/browser/' },
          { text: 'Algorithm', link: '/interview/algorithm/sort', activeMatch: '/algorithm/' },
        ]
      },
      { text: 'Blog', link: '/blog/browser/processes-and-threads', activeMatch: '/blog/' }
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
            { text: "26. 删除有序数组中的重复项", link: '/interview/algorithm/leetcode/26.md' },
            { text: "35. 搜索插入位置", link: '/interview/algorithm/leetcode/35.md' },
            { text: "88. 合并两个有序数组", link: '/interview/algorithm/leetcode/88.md' },
            { text: "136. 只出现一次的数字", link: '/interview/algorithm/leetcode/136.md' },
            { text: "146. LRU 缓存", link: '/interview/algorithm/leetcode/146.md' },
            { text: "217. 存在重复元素", link: '/interview/algorithm/leetcode/217.md' },
            { text: "283. 移动零", link: '/interview/algorithm/leetcode/283.md' },
            { text: "349. 两个数组的交集", link: '/interview/algorithm/leetcode/349.md' },
            { text: "350. 两个数组的交集 II", link: '/interview/algorithm/leetcode/350.md' },
            { text: "704. 二分查找", link: '/interview/algorithm/leetcode/704.md' },
            { text: "724. 寻找数组的中心下标", link: '/interview/algorithm/leetcode/724.md' },
          ]
        }
      ],
      '/blog/': [
        {
          text: '浏览器',
          items: [
            { text: '浏览器多进程多线程和JS单线程', link: '/blog/browser/processes-and-threads' },
            { text: '从输入URL到页面加载的过程', link: '/blog/browser/when-you-enter-a-url' },
            { text: 'HTTP请求头和响应头中cache-control的区别', link: '/blog/browser/cache-control-client-or-server' },
          ]
        },
        {
          text: '正则表达式',
          items: [
            { text: '正则表达式系列', link: '/blog/regexp/1' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  ],
})
