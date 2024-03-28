function b() {
  var c = new String('1')
  var d = new String('2')
  function e() {
    console.log(c)
  }
  function f() {
    console.log(d)
  }
  return f
}
b()