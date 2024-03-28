# CSS 面试题（2）布局

## 水平垂直居中
*（不固定宽高的元素）*

1. 子元素display:table; 子元素display:cell-table

```css
.parent1{
  display: table;
  height:300px;
  width: 300px;
  background-color: #FD0C70;
}
.parent1 .child{
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  color: #fff;
  font-size: 16px;
}
```

2. 表格布局：

```css
父级 display: table-cell; vertical-align: middle;  
子级 margin: 0 auto;
```

4. 绝对定位 + transform

```css
.parent3{
  position: relative;
  height:300px;
  width: 300px;
  background: #FD0C70;
}
.parent3 .child{
  position: absolute;
  top: 50%;
  left: 50%;
  color: #fff;
  transform: translate(-50%, -50%);
}
```

4. flex布局：

```css
.parent4{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height:300px;
  background: #FD0C70;
}
.parent4 .child{
  color:#fff;
}
```

5. grid布局：

```css
.parent4{
  display: grid;
  width: 300px;
  height:300px;
  background: #FD0C70;
}
.parent4 .child{
  justify-self: center;
  align-items: center;
  color:#fff;
}
```

6. calc

```css
position: absolute;
box-sizing: border-box;
width: 1200rpx;
height: 1200rpx;
top: calc(50% - 600rpx);
left: calc(50% - 600rpx);
```

## 自适应两列布局

1. 右边元素触发BFC

```html
<style>
  .father {
    background-color: lightblue;
  }
  .left {
    float: left;
    width: 100px;
    height: 200px;
    background-color: red;
  }
  .right {
    overflow: auto;
    height: 500px;
    background-color: lightseagreen
  }
</style>
<body>
    <div class="father">
      <div class='left'>left</div>
      <div class='right'>right</div>
    </div>
</body>
```

2. margin-left 实现（要确定左侧的宽度）

```html
<style>
  .father {
    background-color: lightblue;
  }
  .left {
    width: 100px;
    float: left;
    background-color: red;
  }
  .right {
    margin-left: 100px;
    background-color: lightseagreen
  }
</style>
<body>
  <div class="father">
    <div class='left'>left</div>
    <div class='right'>right</div>
  </div>
</body>
```

## 三列布局
1. margin-left 实现（要确定左侧的宽度）

```html
<style>
  .father {
    display: flex;
    height: 100%;
  }
  .left,
  .right {
    flex: 0 1 100px;
    background-color: red;
  }
  .middle {
    flex: 1;
    height: 100%;
    background-color: green;
  }
</style>
<body>
  <div class="father">
     <div class='left'>left</div>
      <div class='middle'>middle</div>
      <div class='right'>center</div>
  </div>
</body>
```

2. 负margin布局(双飞翼)

```html
<style>
  .mainWrap {
    width: 100%;
    float: left;
  }
  .main {
    margin: 0 120px;
  }
  .left,
  .right {
    float: left;
    width: 100px;
  }
  .left {
    margin-left: -100%;
  }
  .right {
    margin-left: -100px;
  }
</style>
<body>
  <div class="parent" style="background-color: lightgrey;">
    <div class="main-wrap">
      <div class="main" style="background-color: lightcoral;">main</div>
    </div>
    <div class="left" style="background-color: orange;">left</div>
    <div class="right" style="background-color: lightsalmon;">right</div>
  </div>
</body>
```

## A元素垂直居中 

- A元素的高度始终是A元素宽度的50%
- A元素距离屏幕左右各边各10px 
- A元素里的文字font—size:20px水平垂直居中

```html
<style>
  .Abox{
    margin-left:10px;
    width: calc(100vw - 20px);
    height: calc(50vw - 10px);
    position: absolute;
    background: yellow;
    top:50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
</style>
<body>
  <div class="Abox">我是居中元素 </div>
</body>
```