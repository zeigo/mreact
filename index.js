import createElement from "./lib/Element"
import render from "./lib/DOM/render"

let a = (
  <div>
    <p style={{color: "red"}}>hello world</p>
    asdf
    <h1>second</h1>
  </div>
)

let b = (
  <div>
    <p style={{color: "blue", border: "1px solid"}}>hi</p>
    zxcv
  </div>
)
var ctn = document.getElementById("app")
render(a, ctn)

var btn = document.createElement("button")
btn.innerHTML = "click to change"
btn.onclick = function() {
  render(b, ctn)
}
document.body.appendChild(btn)