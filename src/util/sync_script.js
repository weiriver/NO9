// export const syncScript = (id, url, fn) => {
// }
// export const syncScript = 123
export default function (id, url, fn) {
  if (!document.getElementById(id)) {
    var body = document.getElementsByTagName('body')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = id
    script.src = url
    body.appendChild(script)
    script.onload = function () {
      fn()
    }
  } else {
    // console.log('已经存在了')
    fn()
  }
}
