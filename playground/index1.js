

class Scheduler {
  constructor(max) {
    this.max = max
    this.count = 0
    this.list = [] // 队列
  }

  add (time, value) {
    this.list.push([time, value])
  }

  start() {
    if (!this.list.length) return;

    if(this.count<=this.max){
      const [time, value] = this.list.shift()
      this.count++
      setTimeout(()=> {
        console.log(value);
        this.count--
        this.start()
      }, time)
    }

    this.start()
  }
}

