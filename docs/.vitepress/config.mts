import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Frontend Interview",
  description: "Frontend interview preparation materials",
  srcDir: "./src",
  base: "/frontend-interview-questions/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'HTMLCSS', link: '/htmlcss/css-1', activeMatch: '/htmlcss/' }
    ],

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
            { text: '画布（canvas）', link: '/htmlcss/canvas' },
            { text: 'iframe', link: '/htmlcss/iframe' },
            { text: 'WebSocket', link: '/htmlcss/websocket' },
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
