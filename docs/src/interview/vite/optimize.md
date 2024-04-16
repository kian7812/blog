# 优化和配置


## Vite打包性能优化✅

- https://juejin.cn/post/7232688124416458789
- https://juejin.cn/post/7256723839941476412


**1、前置工具：打包体积分析**

- rollup-plugin-visualizer  打包体积分析插件

**2、配置打包文件分类输出**

- build.rollupOptions.output

**3、js最小拆分包**

*http2*

- build.rollupOptions.output.manualChunks

**4、代码压缩+剔除console+debugger**

- build.minify
- build.terserOptions

vite 4.X 版本已经不集成 terser，需要自行安装 terser，需要自行安装

**5、文件压缩gzip**

- build.rollupOptions.plugins[].viteCompression

vite-plugin-compression

当请求静态资源时，服务端发现请求资源为gzip的格式时，应该设置响应头 content-encoding: gzip 。因为浏览器解压也需要时间，所以代码体积不是很大的话不建议使用 gzip 压缩。

**6、图片资源压缩**

- plugins[].viteImagemin

vite-plugin-imagemin

**7、按需导入**

lodash-es 是 lodash 的 es modules 版本 
使用 loadsh-es 代替 lodash，支持按需导入，减少打包体积

**8、CDN 加速**

3个配置：
- plugins[].createHtmlPlugin.inject
- build.rollupOptions.external
- build.rollupOptions.plugins[].externalGlobals

vite-plugin-html、rollup-plugin-external-globals

内容分发网络（Content Delivery Network，简称 CDN）就是让用户从最近的服务器请求资源，提升网络请求的响应速度。同时减少应用打包出来的包体积，利用浏览器缓存，不会变动的文件长期缓存。


**全部配置**

```js
// vite.config.js
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'
import externalGlobals from 'rollup-plugin-external-globals'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    visualizer({ open: true }),
    // 将下面的添加到plugin下
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          vuescript: '<script src="https://cdn.jsdelivr.net/npm/vue@3.2.25"></script>',
          demiScript: '<script src="//cdn.jsdelivr.net/npm/vue-demi@0.13.7"></script>',
          elementPlusScript: `
            <link href="https://cdn.jsdelivr.net/npm/element-plus@2.2.22/dist/index.min.css" rel="stylesheet">
            <script src="https://cdn.jsdelivr.net/npm/element-plus@2.2.22/dist/index.full.min.js"></script>
          `,
          echartsSciprt: '<script src="https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js"></script>'
        }
      }
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2020',
    minify: 'terser', // 启用 terser 压缩  
    // rollup 配置
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
          // if (id.includes('node_modules')) {
          //   return 'vendor'
          // }
        }
      },
      // 告诉打包工具 在external配置的 都是外部依赖项  不需要打包
      external: ['vue', 'element-plus', 'echarts'],
      plugins: [
        externalGlobals({
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          echarts: 'echarts',
          'vue-demi': 'VueDemi'
        }),
        viteCompression({
          verbose: true, // 是否在控制台中输出压缩结果
          disable: false,
          threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
          algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
          ext: '.gz',
          deleteOriginFile: false // 源文件压缩后是否删除
        })
      ]
    },
    // terser 压缩  
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境时移除console
        drop_debugger: true // 删除 debugger  
      }
    }
  }
})

```

## SEO优化，vite实现预渲染

vite-plugin-prerender

```js
import vitePrerender from 'vite-plugin-prerender'
import path from 'path'

export default () => {
  return {
    plugins: [
      vitePrerender({
        // Required - The path to the vite-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: ['/', '/chat', '/design'],
      }),
    ],
  }
}
```
打包完成后，会根据配置的路由地址，在dist文件中生成对应的index.html文件

【在dist根目录下、dist/chat、dist/design 目录下都会生成index.html文件】
