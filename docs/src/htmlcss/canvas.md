# 画布 canvas 

HTML5 的 canvas 元素使用 JavaScript 在网页上绘制图像，canvas本身是没有绘图能力的，所有的绘制工作必须在JS内部完成。

注意点：

- 创建画布大小使用属性方式设置（不能通过CSS样式设置，会产生失真问题！）
- 解决画布重绘问题：设置一次描边、开启新的图层

**绘图基本方法：**

方法：

- ctx.moveTo(x,y)： 落笔
- ctx.lineTo(x,y)： 连线
- ctx.stroke()： 描边
- ctx.beginPath()： 开启新的图层
- ctx.closePath()： 闭合路径
- ctx.fill()： 填充

属性：

- strokeStyle： 描边颜色
- lineWidth： 线宽
- lineJoin： 线连接方式 round | bevel | miter (默认)
- lineCap：线帽（线两端结束的样式）butt(默认值) | round | square
- fillStyle： 填充颜色

**实现一个简单的三角形：**

```js
<!--html-->
<canvas width="600" height="400"></canvas>

<!--js-->
//获取画布对象
var canvas = document.querySelector('canvas')
//获取绘图上下文
var ctx = canvas.getContext('2d')
<!--落笔-->
ctx.moveTo(100,100);
<!--连线-->
ctx.lineTo(100,200);
<!--连线-->
ctx.lineTo(200,200);
//闭合路径
ctx.closePath();
<!--描边-->
ctx.stroke();
```
*（还有很多其它知识点不展开了）*



## 参考

- :+1: [HTML5、CSS3完全使用手册（万字详解）](https://juejin.cn/post/6844904147590856717)