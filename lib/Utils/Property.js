
export function diffProperties(domElement, type, oldProps, newProps) {
  let updatePayload = null
  // TODO: 表单元素特殊处理props
  let propKey, styleName, styleUpdates = null

  // 比较oldProps中有而newProps没有的属性, 删除这些
  for (propKey in oldProps) {
    if (!oldProps.hasOwnProperty(propKey) || newProps.hasOwnProperty(propKey))
      continue
    if (propKey === "style") {
      var styles = oldProps[propKey]
      for (styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) continue
        if (styleUpdates === null) styleUpdates = {}
        styleUpdates[styleName] = "" // 清除这些style
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null)
    }
  }
  // 新加或更新
  for (propKey in newProps) {
    var newProp = newProps[propKey],
      oldProp = oldProps !== null ? oldProps.propKey : undefined
    if (!newProps.hasOwnProperty(propKey) || newProps === oldProps)
      continue
    if (propKey === "style") {
      if (!oldProp) { // 若之前的style为null或没有
        styleUpdates = newProp
      } else {
        // 重置oldStyle里有，而newStyle没有或newStyle为null
        for (styleName in oldProp) {
          if (oldProp.hasOwnProperty(styleName) && (!newProp || !newProp[styleName])) {
            if (!styleUpdates) styleUpdates = {}
            styleUpdates[styleName] = ""
          }
        }
        // 新建或更新
        for (styleName in newProp) {
          if (newProp.hasOwnProperty(styleName) && newProp[styleName] !== oldProp[styleName]) {
            if (!styleUpdates) styleUpdates = {}
            styleUpdates[styleName] = newProp[styleName]
          }
        }
      }
    } else if (propKey === "children") {
      if (oldProp !== newProp && (typeof newProp === "string" || typeof newProp === "number")) {
        (updatePayload = updatePayload || []).push("children", newProp + "")
      }
    } else { // ignore event now
      (updatePayload = updatePayload || []).push(propKey, newProp)
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push("style", styleUpdates)
  }
  return updatePayload // ["id", "in"]
}

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
      setTextContent(domElement, propValue)
    } else if (propValue !== null) {
      setValueForProperty(domElement, propKey, propValue)
    } else {
      deleteValueForProperty(domElement, propKey)
    }
  }
}

function setTextContent(domElement, newText) {
  var first = domElement.firstChild
  if (first && first === domElement.lastChild) {
    first.nodeValue = newText
    return
  }
  domElement.textContent = newText
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