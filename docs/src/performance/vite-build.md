# vite 构建选项/打包

其实需要配置的就那几个选项，一会儿晚上回收下，给下解释
vite 默认打包思路是啥，好像是尽量抽离 chunk

https://cn.vitejs.dev/config/build-options.html

https://cn.vitejs.dev/guide/why.html
为什么生产环境仍需打包
尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。

https://cn.vitejs.dev/guide/features.html#css-code-splitting

https://cn.vitejs.dev/guide/features.html#async-chunk-loading-optimization

https://cn.vitejs.dev/config/build-options.html#build-rollupoptions
build.rollupOptions
类型： RollupOptions
自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。查看 Rollup 选项文档 获取更多细节。

build.cssCodeSplit

启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时一并获取。

如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。

build.cssMinify

build.minify
类型： boolean | 'terser' | 'esbuild'
默认： 客户端构建默认为'esbuild'，SSR 构建默认为 false
淆器。默认为 Esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%。

build.reportCompressedSize 只是报告，告诉你 gzip 会是多少

## rollupjs

https://cn.rollupjs.org/tutorial/#code-splitting

https://cn.rollupjs.org/configuration-options/

https://cn.rollupjs.org/configuration-options/#output-experimentalminchunksize
`experimentalMinChunkSize: 10\*1024, // 单位 b`

## 文章

vite 打包分析
https://www.cnblogs.com/cczlovexw/p/17851988.html
https://mp.weixin.qq.com/s/Obyp0iE05hO2a91H6O7e0w
Webpack 打包分析：https://juejin.cn/post/7137971907361505288

2.8 https://juejin.cn/post/7287914129565270073

viteCompression({
verbose: true, // 是否在控制台中输出压缩结果
disable: false,
threshold: 10240, // 如果体积大于阈值，将被压缩，单位为 b，体积过小时请不要压缩，以免适得其反
algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
ext: '.gz',
deleteOriginFile: true // 源文件压缩后是否删除(我为了看压缩后的效果，先选择了 true)
})

https://juejin.cn/post/7232688124416458789

```
build: {
  chunkSizeWarningLimit: 9999,
  minify: true,
  target: 'esnext',
  rollupOptions: {
    output: {
      manualChunks(id) {
        try {
          if (id.includes("node_modules")) {
            let name = id.split("node_modules/")[1].split("/");
            if (name[0] == ".pnpm") {
              return name[1];
            } else {
              return name[0]
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
},

```
