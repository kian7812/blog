# CSS 面试题（1）

## 常见浏览器内核有哪些

- 谷歌/safari：-webkit- （webkit渲染引擎）
- 火狐：-moz-（gecko引擎）
- ie：-ms-（trident渲染引擎）
- 欧鹏：-o-（opeck渲染引擎）
- qq浏览器：双内核 -webkit- -ms-

## 介绍一下 css 盒模型

CSS 盒模型本质上是一个盒子，它包括：边距 margin，边框 border，填充 padding，和实际内容 content。

- **标准**盒模型中，元素的宽高 = content
- **IE怪异**盒模型中，元素的宽高 = content + padding + border

通过CSS的 box-sizing 属性切换模式，content-box就是标准模式，border-box就是怪异模式

*（图片可搜索下）*

## media媒体查询

通过媒体查询可以为不同大小尺寸的设备使用不同的 CSS，达到自适应的目的。可以通过 html 或者 CSS 设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1. maximum-scale=1,user-scalable=no">
<link ref="stylesheet" type="text/css" href="xxx.css" media="only screen and(max-device-width: 480px)">
```
```css
@media only screen and(max-device-width:480px){ ... }
```

## 置/替换元素

替换元素就是浏览器根据元素的标签和属性，来决定元素的具体显示内容。
`<img>、<input>、<textarea>、<select>、<object>`都是替换元素。这些元素往往没有实际的内容，即是一个空元素，浏览器会根据元素的标签类型和属性来显示这些元素。可替换元素也在其显示中生成了框。

## BFC 是什么

BFC Block Formatting Context（BFC | **块级格式化上下文**），是 Web 页面中盒模型布局的 CSS 渲染模式，是一个隔离的独立容器。容器里面的子元素不会影响到外面的元素。

**创建BFC或触发BFC：**

- 根元素或其它包含它的元素
- 浮动 (元素的 float 不是 none)
- 绝对定位的元素 (元素具有 position 为 absolute 或 fixed)
- 非块级元素具有 display: inline-block，table-cell, table-caption, flex, inline-flex
- 块级元素具有 overflow ，且值不是 visible

**BFC 用处：**

1. 清除浮动（规则 6）
2. 布局：自适应两栏布局（规则 4、5）
3. 防止垂直 margin 合并（规则 5）

**BFC 规则：**

1. 内部的 Box 会在垂直方向，一个接一个地放置。
2. Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
3. 每个元素的左外边缘（margin-left）， 与包含块的左边（contain box left）相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。除非这个元素自己形成了一个新的 BFC。
4. BFC 的区域不会与 float box 重叠。
5. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算 BFC 的高度时，浮动元素也参与计算

[参考](https://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html)

## 清除浮动方式

1. 使用 `clear` 清除元素浮动影响 

使用`clear:both`可以清除浮动，在父元素上使用伪类`::after`添加用于清除浮动的元素

```css
.parent-box::after{
  clear: both;
  content: '';
  display: block;
}
```

2. 在父元素上创建BFC以清除浮动的影响
在浮动元素的父元素上创建块格式化上下文 BFC，一个BFC中所有的元素都会包含在其中包括浮动元素。

```css
.parent-box{
  overflow:auto;
}
```

[参考](https://www.cnblogs.com/tim100/p/6056533.html)

## transition和animation的区别是什么？

- 过渡属性transition可以在一定的事件内实现元素的状态过渡为最终状态，用于模拟一种过渡动画效果，但是功能有限，只能用于制作简单的动画效果；
- 动画属性animation可以制作类似Flash动画，通过关键帧控制动画的每一步，控制更为精确，从而可以制作更为复杂的动画。

## 单位em和rem有什么区别？
- rem是相对于根的em，rem即root的em，`相对于html根元素大小`。
- em是相对长度单位，相对于当前对象内文本的字体尺寸。如果当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

## 如何将文字超出元素的部分变成省略号（...）
- 如果实现单行文本溢出变成省略号，需要几个css属性结合使用：

```css
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
```

- 多行则在webkit内核浏览器中可以得到比较满意的效果，下面指定了显示2行，多余2行的部分显示为省略号：

```css
text-overflow:ellipsis;
overflow:hidden; 
display:-webkit-box; 
-webkit-box-orient:vertical;
-webkit-line-clamp:2;
```

## display:inline-block的间距问题

由于空白字符的原因，解决：

```css
font-size: 0;
```

## position 有哪些属性

- static：正常文档流，无定位
- relative：正常文档流，相对自身定位
- absolute：脱离文档流，相对上级有 position 属性且值不为 static 的元素定位，若没有则相对 body 定位
- fixed：脱离文档流，相对于浏览器窗口定位
- sticky：根据窗口滚动自动切换 relative 和 fixed，由 top 决定

## 几种隐藏的区别

- visibility:hidden：隐藏元素，会继续在文档流中占位，所以触发重绘，隐藏后不能触发点击事件
- display:none：隐藏元素，会从页面中删除掉，所以会触发重排和重绘
- opacity:0：透明，会继续在文档流中占位，所以触发重绘。由是是作用于元素自身，所以子元素会继承，全部变透明，透明后可以触发点击事件
- rgba(0,0,0,0)：透明，会继续在文档流中占位，所以触发重绘。由于只作用于颜色或背景色，所以子元素不会继承，透明后可以触发点击事件

*另外 transition 过渡不支持 display:none，其他三个是支持的*

## margin 和 padding

margin 和 padding 对行内元素的影响，比如 span，默认设置不了宽高的，但是可以设置 margin 和 padding, 不过设置后 margin 和 padding 都只有水平方向有效果，垂直方向是没有效果的

**两个div上下排列，都设置 margin 会怎样？**

会发生边距重叠，margin 都大于0就取较大值，一正一负就相加，都负取较大绝对值

**为什么会这样？**

就是由于 BFC

