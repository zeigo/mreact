import { HostComponent, HostRoot, HostText, ClassComponent} from "./TypeOfWork"
import { PerformedWork, Update } from "./TypeOfEffect"
import { NoWork } from "./ExpirationTime"

// 当还有sibling时，不返回null，对sibling performUnitOfWork
export function completeUnitOfWork(workInProgress) {
  while (true) {
    let current = workInProgress.alternate
    let next = completeWork(current, workInProgress)
    if (next !== null) return next // if spawn new work
    let returnFiber = workInProgress.return,
      siblingFiber = workInProgress.sibling

    resetExpirationTime(workInProgress)

    if (returnFiber !== null) { // return fiber接上workinprogress的effect list
      if (workInProgress.lastEffect === null) { 
        // empty, Noop
      } else {
        if (returnFiber.lastEffect !== null) {
          returnFiber.lastEffect.nextEffect = workInProgress.firstEffect
        } else {
          returnFiber.firstEffect = workInProgress.firstEffect
        }
        returnFiber.lastEffect = workInProgress.lastEffect
      }
      // 是否workInProgress firstEffect, lastEffect设null

      // 如果workInProgress有side-effect，插入到returnFiber effect list最后
      if (workInProgress.effectTag > PerformedWork) {
        if (returnFiber.lastEffect === null) { // empty
          returnFiber.firstEffect = workInProgress
        } else {
          returnFiber.lastEffect.nextEffect = workInProgress
        }
        returnFiber.lastEffect = workInProgress
      }
    }
    if (siblingFiber !== null) {
      return siblingFiber
    } else if (returnFiber !== null) {
      workInProgress = returnFiber
      continue
    } else {
      workInProgress.stateNode.isReadyForCommit = true
      return null
    }
  }
}

function resetExpirationTime(workInProgress) {
  var newExpirationTime = getUpdateExpirationTime(workInProgress)
  var child = workInProgress.child
  while (child !== null) {
    if (child.expirationTime !== NoWork && (newExpirationTime === NoWork || newExpirationTime > child.expirationTime)) {
      newExpirationTime = child.expirationTime;
    }
    child = child.sibling;
  }
  workInProgress.expirationTime = newExpirationTime
}

function getUpdateExpirationTime(fiber) {
  if (fiber.tag !== ClassComponent && fiber.tag !== HostRoot) {
    return NoWork;
  }
  var updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    return NoWork;
  }
  return updateQueue.expirationTime;
} 

// 更新/创建实例到stateNode，设置effectTag等
function completeWork(current, workInProgress) {
  let newProps = workInProgress.pendingProps
  if (newProps === null) {
    newProps = workInProgress.memorizedProps
  } else {
    workInProgress.pendingProps = null
  }
  let oldProps = current !== null ? current.memorizedProps : null
  switch (workInProgress.tag) {
    case ClassComponent: {
      return null
    }
    case HostComponent: {
      let type = workInProgress.type
      if (current !== null && workInProgress.stateNode !== null) {
        // update
        let instance = workInProgress.stateNode
        let updatePayload = prepareUpdate(instance, type, oldProps, newProps)
        updateHostComponent(workInProgress, updatePayload)
      } else {
        let instance = createInstance(type, newProps, workInProgress)
        appendAllChildren(instance, workInProgress)
        finalizeInitialChildren(type, instance, newProps)
        workInProgress.stateNode = instance
      }
      return null
    }
    case HostText: {
      let newText = newProps;
      if (current !== null && workInProgress.stateNode !== null) {
        var oldText = current.memorizedProps
        updateHostText(workInProgress, oldText, newText)
      } else {
        let textInstance = createTextInstance(newText, workInProgress)
        workInProgress.stateNode = textInstance
      }
      return null
    }
    case HostRoot: {
      return null
    }
  }
}

function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps)
}

function diffProperties(domElement, type, oldProps, newProps) {
  let updatePayload = null
  // TODO: 表单元素特殊处理
  let propKey
  return updatePayload // ["id", "in"]
}

function updateHostText(workInProgress, oldText, newText) {
  if (oldText !== newText) {
    workInProgress.effectTag |= Update
  }
}

function updateHostComponent(workInProgress, updatePayload) {
  workInProgress.updateQueue = updatePayload
  if (updatePayload) {
    workInProgress.effectTag |= Update
  }
}

function createInstance(tag, props, fiber) {
  let domElement = document.createElement(tag) // omit some details
  domElement._internalInstance = fiber
  domElement._eventHandler = props
  return domElement
}

function createTextInstance(text, fiber) {
  let domElement = document.createTextNode(text) // omit some details
  domElement._internalInstance = fiber
  return domElement
}

function appendAllChildren(domElement, workInProgress) {
  let node = workInProgress.child
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      domElement.appendChild(node.stateNode)
    }
    node = node.sibling
  }
}

function finalizeInitialChildren(tag, domElement, props) {
  setInitialDOMProperties(tag, domElement, props)
}

// 设置DOM元素的属性
function setInitialDOMProperties(tag, domElement, props) {
  for (let propKey in props) {
    if (!props.hasOwnProperty(propKey)) continue
    let prop = props[propKey]
    switch (propKey) {
      case "style": {
        let style = domElement.style
        for (let styleName in prop) {
          if (!prop.hasOwnProperty(styleName)) continue
          if (styleName === "float") styleName = "cssFloat"
          style[styleName] = prop[styleName]
        }
        break;
      }
      case "children": { // children只有text
        if (typeof prop === "string" || typeof prop === "number") {
          domElement.innerHTML = "" + prop // textContent
        }
      }
    }
  }
}