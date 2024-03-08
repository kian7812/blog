# CSS3

CSS3是CSS（层叠样式表）技术的升级版本，于1999年开始制订，2001年5月23日W3C完成了CSS3的工作草案，主要包括盒子模型、列表模块、超链接方式、语言模块、背景和边框、文字特效、多栏布局等模块。

## 背景

**`background-origin` 用来规定背景图片的定位区域：**
- `padding-box`：背景图像相对内边距定位（默认值）
- `border-box`：背景图像相对边框定位【以边框左上角为参照进行位置设置】
- `content-box`：背景图像相对内容区域定位【以内容区域左上角为参照进行位置设置

**`background-clip` 规定背景的绘制区域：**
- `border-box`：背景被裁切到边框盒子位置 【将背景图片在整个容器中显示】默认值）
- `padding-box`：背景被裁切到内边距区域【将背景图片在内边距区域（包含内容区域）显示】
- `content-box`：背景被裁切到内容区域【将背景图片在内容区域显示】

**`background-size` 规定背景图片的尺寸：**
- `cover`：背景图片按照原来的缩放比，铺满整个容器
- `contain`：背景图片按照原来的缩放比，完整地显示到容器中(不确定是否铺满屏幕)
- `length`：设置背景图片高度和宽度
- `percentage`：将计算相对于背景定位区域的百分比


## 边框

**box-shadow 向方框添加一个或多个阴影**

box-shadow: x y blur spread color inset

- x：必需。水平阴影的位置。允许负值。 
- y：必需。垂直阴影的位置。允许负值。 
- blur：可选。模糊距离。 
- spread：可选。阴影的尺寸。 
- color：可选。阴影的颜色。请参阅 CSS 颜色值。 
- inset：可选。将外部阴影 (outset) 改为内部阴影。


**border-radius 为元素添加圆角边框**

border-radius:2em 等于:

- border-top-left-radius:2em;
- border-top-right-radius:2em;
- border-bottom-right-radius:2em;
- border-bottom-left-radius:2em;

**border-image 为元素边框添加图片**

border-image 属性是一个简写属性，用于设置以下属性：

- border-image-source：图片路径
- border-image-slice：图片边框向内偏移。
- border-image-width：图片边框宽度
- border-image-outset：边框图像区域超出边框的量。
- border-image-repeat：repeated|rounded|stretched 图像边框是否应平铺｜铺满｜拉伸

## 文本

**text-shadow 设置文本阴影**

text-shadow: x y blur color;

**word-wrap 允许长单词或URL地址换行**

word-wrap: normal|break-word;

- normal：只在允许的断字点换行（浏览器保持默认处理）。
- break-word： 在长单词或 URL 地址内部进行换行。

**text-overflow 规定当文本溢出包含元素时发生的事情**

text-overflow: clip|ellipsis|string;

- clip：修剪文本
- ellipsis：显示省略符号来代表被修剪的文本
- string：使用给定的字符串来代表被修剪的文本

```css
实现一个单行文本省略：
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
多行文本省略：
.text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical；
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## 颜色渐变

**线性渐变**
```css
background-image: linear-gradient(
	to right,   // 渐变方向 to + right | top | bottom | left
	red,    // 开始渐变的颜色
	blue    // 结束渐变的颜色
);
```

**径向渐变：**
```css
background-image: radial-gradient(
  shape,  // 确定圆的类型,ellipse（默认：椭圆）｜circle（圆的经向渐变）
  start-color,
  ...,
  last-color,
);

```

## 2D转换 transform

**位移：**

- translate(x, y)：沿着 X 和 Y 轴移动元素。
- translateX(n)：沿着 X 轴移动元素。
- translateY(n)：沿着 Y 轴移动元素。

```css
div {
  transform: translate(50px,100px);
}
```

**旋转：rotate(angle)**

```css
div {
  transform: rotate(60deg); // 备注：取值为角度  
}
```

**缩放：**

- scale(x,y)： 宽、高缩放
- scaleX(n)
- scaleY(n)

值为倍数，缩小为小数，放大为大于1

**倾斜：**

- skew(x-angle,y-angle): 沿X、Y轴倾斜方向
- skewX(angle)
- skewY(angle)

## 3D转换
transform-style: preserve-3d;：将平面图形转换为立体图形

**位移：**

- tranform: translate3d(x,y,z);
- transform: translateX() translateY() translateZ();

**旋转：**

- tranform: rotate3d(x,y,z,angle)
- transform: rotateX(60deg) rotateY(60deg) rotateZ(60deg);

**缩放：**

- tranform: scale3d(x,y,z);
- transform: scaleX(0.5) scaleY(1) scaleZ(1);

**其它：**
transform-origin
perspective
perspective(n)

## 过渡 transition

`transition: property duration timing-function delay;`

**简写：**

- transition: none; 没有过度
- transition: 2s; property是默认值all，timing-function是默认值ease，delay是默认值0。
- transition: left 2s ease 1s, color 2s; 向多个样式添加过渡效果，请添加多个属性，由逗号隔开。

**transition-timing-function: linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n);**

- linear：以相同速度开始至结束的过渡效果
- ease：慢速开始，然后变快，然后慢速结束
- ease-in：以慢速开始
- ease-out：以慢速结束
- ease-in-out：以慢速开始和结束

## 动画 animation

**定义动画:**

```css
@keyframes  rotate {
  /* 定义开始状态  0%*/
  from {
    transform: rotateZ(0deg);
  }
  /* 结束状态 100%*/
  to {
    transform: rotateZ(360deg);
  }
}
```

**简写：**

animation: name duration timing-function delay iteration-count direction;

**调用动画集：**
- animation-name: 调用动画集名称
- animation-duration：完成一个周期所花费的时间
- animation-timing-function：动画执行的速度类型，linear|ease|ease-in|ease-out|ease-in-out
- animation-delay：动画延时
- animation-iteration-count：动画被播放的次数，infinite无限执行
- animation-direction：是否应该轮流反向播放动画
    - normal（默认值，动画正常播放）
    - reverse（动画反向播放）;
- animation-fill-mode：设置动画填充模式，规定动画在播放之前或之后，其动画效果是否可见
    - none：不改变默认行为
    - forwards：当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）
    - backwards：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）
    - both：向前和向后填充模式都被应用。
- animation-play-state：动画暂停paused | running;


## flex 弹性布局

flex 布局也是高频考点

**定义弹性容器：**

display: flex; 

*定义弹性容器，子元素的float、clear和vertical-align属性将失效；*

**弹性容器上的属性：**

- flex-direction: row|row-reverse|column|column-reverse; 设置伸缩盒子主轴方向
- flex-wrap: nowrap|wrap|wrap-reverse; 设置子元素是否换行显示
- justify-content: flex-start|flex-end|center|space-between|space-around; 设置子元素在主轴的对齐方式
- align-items: stretch|center|flex-start|flex-end|baseline; 设置子元素在侧轴的对齐方式
- align-content: stretch|center|flex-start|flex-end|space-between|space-around; // 设置子元素换行后的对齐方式,定义了多根轴线的对齐方式
- flex-flow: flex-direction flex-wrap; 是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap

**弹性元素的属性**

- order: number; 定义弹性元素的排列顺序。数值越小，排列越靠前，默认为0。
- flex-grow: number; 定义正的剩余空间如何分配，默认值是 0。
- flex-shrink: number; 定义负空间/空间不足如何分配，默认值是 1。
- flex-basis: number|auto; 元素初始长度，默认值 auto
  - 属性定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。
- flex: flex-grow flex-shrink flex-basis; 默认 0 1 auto
- align-self: auto|stretch|center|flex-start|flex-end|baseline; 元素自身辅轴对齐，默认auto，可继承弹性容器的align-items，同时也可覆盖；


## 参考

- :+1: [HTML5、CSS3完全使用手册（万字详解）](https://juejin.cn/post/6844904147590856717)
- [阮一峰的 flex 教程](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)


