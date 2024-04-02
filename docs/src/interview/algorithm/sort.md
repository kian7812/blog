# 排序

## 复杂度和稳定性

| 名称| 	平均时间复杂度|	最好|	最坏|	空间复杂度|	稳定性 |
| --- | --- | --- |--- | --- | --- |
| 冒泡排序|	O(n^2)|	O(n)|	O(n^2)|	O(1)|	稳定 |
| 选择排序|	O(n^2)|	O(n^2)|	O(n^2)|	O(1)|	不稳定 |
| 堆排序|	O(n logn)|	O(n logn)|	O(n logn)|	O(1)|不稳定 |
| 插入排序|	O(n^2)|	O(n)|	O(n^2)|	O(1)|	稳定 |
| 希尔排序|	O(n logn)|	O(n log^2 n)	|O(n log^2 n)|	O(1)|	不稳定 |
| 快速排序|	O(n logn)|	O(n logn)|	O(n^2)|	O(logn)	|不稳定 |
| 归并排序|	O(n logn)|	O(n logn)|	O(n logn)|	O(n)|	稳定 |
| 计数排序|	O(n+k)|	O(n+k)|	O(n+k)|	O(k)|	稳定 |
| 桶排序|	O(n+k)|	O(n+k)|	O(n^2)|	O(n+k)|	稳定 |
| 基数排序|	O(n*k)|	O(n*k)|	O(n*k)|	O(n+k)	|稳定 |


## 交换

```js
function swap(arr, a, b) {
  [arr[b], arr[a]] = [arr[a], arr[b]]
}
```

## 快速排序 quickSort

"快速排序"的思想很简单，整个排序过程只需要三步：
1. 在数据集之中，选择一个元素作为"基准"（pivot）。
2. 所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
3. 对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。

参考：https://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html

```js
const quickSort = (array) => {
  // 检查数组的元素个数，如果小于等于1，就直接返回
  if (array.length <= 1) {
      return array
  }
  // 2. 选择基准 pivot，基准值可以任意选择，但是选择中间的值比较容易理解
  const pivotIndex = Math.floor(array.length / 2)
  // 3. 将基准从array中删除并返回
  const pivot = array.splice(pivotIndex, 1)[0]
  // 4. 定义两个数组，用来存放小于和大于的元素
  const left = []
  const right = []
  // 5. 遍历array，小于基准放在左侧，大于基准放在右侧
  for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element < pivot) {
          left.push(element)
      } else {
          right.push(element)
      }
  }
  // 6. 使用递归不断进栈，出栈时进行排序汇总
  return quickSort(left).concat(pivot, quickSort(right))
}
```

## 冒泡排序 bubbleSort

大致流程：
1. 从第一个元素开始，比较每两个相邻元素，如果前者大，就交换位置
2. `每次遍历结束，能够找到该次遍历过的元素中的最大值`
3. 如果还有没排序过的元素，继续第1步

参考：https://juejin.cn/post/6844903814340804615#heading-3

```js
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length -1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr, j , j+1)
      }
    }
  }
  return arr
}
```

有优化空间，主要从两方面进行优化：
- 减少外层遍历次数
- 让每次遍历能找到两个极值

## 选择排序 selectSort

每次遍历选择最小。排序后的元素将放在数组前部。

大致流程：
1. 取出未排序部分的第一个元素，遍历该元素之后的部分并比较大小。对于第一次遍历，就是取出第一个元素
2. 如果有更小的，与该元素交换位置
3. `每次遍历都能找出剩余元素中的最小值并放在已排序部分的最后`（每次内层遍历都能确定好位置）

并不是倒着的冒泡排序。冒泡排序是比较相邻的两个元素。

```js
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i
    // 遍历后面的部分，寻找更小值
    for (let j = i + 1; j < arr.length; j++) {
      // 如果有，更新minIndex
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    swap(arr, i, minIndex)
  }
  return arr
}

```

## 插入排序 insertSort

### 一般实现

已排序元素将放在数组前部。

大致流程：
1. 取未排序部分的第一个元素。第一次遍历时，将第一个元素作为已排序元素，从第二个元素开始取
2. `遍历前面的已排序元素，并与这个未排序元素比较大小，找到合适的位置插入`
3. 继续执行第1步

第一种理解方式，也就是一般的实现原理：
在上面的第2步中，遍历已排序元素时，如果该未排序元素仍然小于当前比较的已排序元素，就把前一个已排序元素的值赋给后一个位置上的元素，也就是产生了两个相邻的重复元素。
这样一来，在比较到最后，找到合适的位置时，用该未排序元素给两个重复元素中合适的那一个赋值，覆盖掉一个，排序就完成了。（叙述可能不够清楚，看后面的代码就是了）

和选择排序好像有一点类似的地方：

- 选择排序，`先找合适的元素`，然后`直接放到已排序部分`
- 插入排序，`先按顺序取`元素，`再去已排序部分里找合适的位置`

```js
// 按照第一种理解方式的实现，即一般的实现
function insertSort(arr) {
  for (let index = 1; index < arr.length; index++) {
    // 取出一个未排序元素
    let currentEle = arr[index]
    // 已排序元素的最后一个的位置
    let orderedIndex = index - 1
    // 前面的元素更大，并且还没遍历完
    while (arr[orderedIndex] >= currentEle && orderedIndex >= 0) {
      // 使用前面的值覆盖当前的值
      arr[orderedIndex + 1] = arr[orderedIndex]
      // 向前移动一个位置
      orderedIndex--
    }
    // 遍历完成，前面的元素都比当前元素小，把未排序元素赋值进去
    arr[orderedIndex + 1] = currentEle
  }
  return arr
}
```

### 优化

使用二分查找。

遍历已排序部分时，不再是按顺序挨个比较，而是比较中位数。

```js
function binaryInsertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    // 未排序部分的第1个
    let currentEle = array[i]
    // 已排序部分的第1个和最后1个
    let left = 0, right = i - 1
    // 先找位置
    while (left <= right) {
      // 不再是从最后一个位置开始向前每个都比较，而是比较中间的元素
      let middle = parseInt((left + right) / 2)
      if (currentEle < array[middle]) {
        // 选左侧
        right = middle - 1
      } else {
        // 选右侧
        left = middle + 1
      }
    }
    // while结束，已经找到了一个大于或等于当前元素的位置 left
    // 再修改数组：把 left 到 i 之间的元素向后移动一个位置
    for (let j = i - 1; j >= left; j--) {
      array[j + 1] = array[j]
    }
    // 插入当前元素
    array[left] = currentEle
  }
  return array
}

```


## 参考

- **10种排序算法原理及JS实现 https://juejin.cn/post/6844903814340804615
- *胖头鱼fe-handwriting https://github.com/qianlongo/fe-handwriting/tree/master
