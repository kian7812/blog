# 正则表达式

## 正则模拟实现trim方法

```js
String.prototype.strim1 = function () {
  return this.replace(/^\s+|\s+$/g, '')
}
String.prototype.strim2 = function () {
  return this.replace(/^\s+(.*?)\s+$/, '$1')
}

let str = '    aaaa   '

console.log(str.length)

console.log(str)
console.log(str.strim1().length)
console.log(str.strim2().length)
```

## 手机号 3-3-4分割

```js
// 适合纯11位手机
const splitMobile = (mobile, format = '-') => {
  return String(mobile).replace(/(?=(\d{4})+$)/g, format)
}
// 适合11位以内的分割
const splitMobile2 = (mobile, format = '-') => {
  return String(mobile).replace(/(?<=(\d{3}))/, format).replace(/(?<=([\d\-]{8}))/, format)
}

console.log(splitMobile(18379802267))
console.log(splitMobile2(18379876545))
```

## 千分位格式化数字

```js
// 金额转千分位
const formatPrice = (number) => {
  number = '' + number

  const [ integer, decimal = '' ] = number.split('.')

  return integer.replace(/\B(?=(\d{3})+$)/g, ',') + (decimal ? '.' + decimal : '')
}

console.log(formatPrice(123456789.3343))
```

## templateRender

```js
const render = (template, data) => {
  return template.replace(/{{\s*?(\w+)\s*?}}/g, (match, key) => {
    return key && data.hasOwnProperty(key) ? data[ key ] : ''
  })
}

const data = {
  name: '前端胖头鱼',
  age: 100
}
const template = `
  我是: {{ name }}
  年龄是: {{age}}
`
console.log(render(template, data))
```


## 参考

- *fe-handwriting https://github.com/qianlongo/fe-handwriting/tree/master

- [有了这25个正则表达式，代码效率提高80%](https://juejin.cn/post/7016871226899431431)
- [面试中会遇到的正则题](https://juejin.cn/post/6844903586711732237)