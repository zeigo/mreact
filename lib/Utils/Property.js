
export function updateProperties(domElement, updatePayload, tag, oldProps, newProps) {
  if (tag === "input" && newProps.type === "radio") {
    // checked
  }
  updateDOMProperties(domElement, updatePayload)
  // TODO: process input, textarea, select
}

function updateDOMProperties(domElement, updatePayload) {
  for (let i = 0, len = updatePayload.length; i < len; i += 2) {
    let propKey = updatePayload[i],
      propValue = updatePayload[i + 1]
    if (propKey === "style") {
      setValueForStyles(domElement, propValue)
    } else if (propKey === "children") {

    } else if (propValue !== null) {
      setValueForProperty(domElement, propKey, propValue)
    } else {
      deleteValueForProperty(domElement, propKey)
    }
  }
}

function setValueForStyles(domElement, styles) {
  let style = domElement.style
  for (let styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) continue
    if (styleName === "float") styleName === "cssFloat"
    // TODO: custom property
    style[styleName] = styles[styleName]
  }
}

// property vs attribute
function setValueForProperty(domElement, key, value) {

}

function setValueForAttribute(domElement, key, value) {
  if (value === null) {
    domElement.removeAttribute(key)
  } else {
    domElement.setAttribute(key, value + "")
  }
}

function deleteValueForProperty(domElement, key) {
  // ...
  domElement.removeAttribute(key)
}