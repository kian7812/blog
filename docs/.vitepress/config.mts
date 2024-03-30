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
          { text: 'JavaScript', link: '/interview/javascript/base/1', activeMatch: '/javascript/' },
          { text: 'HTMLCSS', link: '/interview/htmlcss/css-1', activeMatch: '/htmlcss/' },
          { text: '浏览器', link: '/interview/browser/network', activeMatch: '/browser/' },
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
            { text: '手写', link: '/interview/javascript/coding/1' },
          ]
        }
      ],
      '/interview/browser/': [
        {
          text: '浏览器',
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
