# 优化

## Next.js 优化打包体积减少69%

https://juejin.cn/post/7347983259584282675

### 优化产物体积

安装 [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) 是 Next.js 的一个插件，可帮助您管理 JavaScript 模块的大小。它生成每个模块的大小及其依赖关系的可视化报告。您可以使用这些信息来删除较大的依赖项、拆分代码或仅在需要时加载某些部分，从而减少传输到客户端的数据量。

### 优化 Cumulative Layout Shift

顶部的“轮播图”是根据systemconfig api 返回结果动态渲染的，它导致 “布局偏移”，因为他不一定存在。设置元素的 display、visibility 或 opacity 等 CSS 属性来隐藏元素，这种方式是不行的。

Next.js 的服务端渲染解决问题，决定这个“轮播图”是否出现，通过服务端提前拿到是否展示轮播图的结果，这样客户端就不会出现偏移了

```js
export async function getServerSideProps(content: any) {
  const baseurl = `http://${process.env.HOSTNAME || 'localhost'}:${process.env.PORT || 3000}`;
  const { data } = (await (await fetch(`${baseurl}/api/platform/getSystemConfig`)).json()) as {
    data: SystemConfigType;
  };

  return {
    props: {
      ...(await serviceSideProps(content)),
      showCarousel: data.showCarousel
    }
  };
}
```

### 优化图片

首先使用 next/image 优化图像，减小图片大小，使用 priority 对影响LCP的图像优先渲染。

应该对检测为最大内容绘制 (LCP) 元素的任何图像使用优先级属性。具有多个优先级图像可能是合适的，因为不同的图像可能是不同视口尺寸的LCP元素。

```js
import Image from 'next/image'
 
export default function Page() {
  return (
    <Image
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
      priority
    />
  )
}
```

使用 tinify.cn/ 压缩图片大小，使用更好格式的图片。

### 优化无障碍访问

这里只做了小小的处理，给相关的按钮增加了id，能够提高页面的可访问性，这里就不多说了