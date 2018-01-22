import { HostComponent, HostRoot, HostText, ClassComponent} from "./TypeOfWork"
import { reconcileChildren, cloneChildFibers } from "./FiberReconciler"
import { NoWork } from "./ExpirationTime";
import { Update, PerformedWork, ContentReset } from "./TypeOfEffect";
import { constructClassInstance, mountClassInstance, updateClassInstance } from "./FiberClassComponent"
import { processUpdateQueue } from "./UpdateQueue"

// 控制入口，根据fiber的tag确定处理方式，返回下次work的对象
export default function beginWork(current, workInProgress, renderExpirationTime) {
  // 低优先级可以不处理
  if (workInProgress.expirationTime === NoWork || workInProgress.expirationTime > renderExpirationTime)
    return null
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime)
    case HostText:
      return updateHostText(current, workInProgress)
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderExpirationTime)
    default:
      throw Error("not valid tag of fiber")
  }
}

// 根据updateQueue确定后续步骤
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  let updateQueue = workInProgress.updateQueue,
    prevState = workInProgress.memorizedState
  if (updateQueue !== null) {
    let state = processUpdateQueue(current, workInProgress, updateQueue, renderExpirationTime)
    let element = state.element
    // 对比后更改workInProgress.child
    reconcileChildren(current, workInProgress, element)
  } else {
    cloneChildFibers(current, workInProgress)
  }
  return workInProgress.child
}


function updateClassComponent(current, workInProgress, renderExpirationTime) {
  var shouldUpdate
  if (current === null) {
    // 组件实例化
    constructClassInstance(workInProgress, workInProgress.pendingProps)
    mountClassInstance(workInProgress, renderExpirationTime)
    shouldUpdate = true
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime)
  }

  return finishClassComponent(current, workInProgress, shouldUpdate)
}

function finishClassComponent(current, workInProgress, shouldUpdate) {
  if (!shouldUpdate) {
    cloneChildFibers(current, workInProgress)
    return workInProgress.child
  }
  var instance = workInProgress.stateNode,
    nextChildren = instance.render()
  workInProgress.effectTag |= PerformedWork
  reconcileChildren(current, workInProgress, nextChildren)
  workInProgress.memorizedProps = instance.props
  workInProgress.memorizedState = instance.state
  return workInProgress.child
}


// 根据pendingProps, memorizedProps
function updateHostComponent(current, workInProgress, renderExpirationTime) {
  let oldProps = workInProgress.memorizedProps,
    newProps = workInProgress.pendingProps,
    type = workInProgress.type
  if (newProps === null) newProps = oldProps
  if (newProps === null || newProps === oldProps) {
    cloneChildFibers(current, workInProgress)
    return workInProgress.child
  }
  let nextChildren = newProps.children,
    currentProps = current === null ? null : current.memorizedProps
  // 子节点只有textNode，不往下再创建fiber比较
  // 所以若current的children只有text，需要ContentReset
  if (shouldSetTextContent(type, newProps)) {
    nextChildren = null
  } else if (currentProps && shouldSetTextContent(type, currentProps)) {
    workInProgress.effectTag |= ContentReset
  }

  reconcileChildren(current, workInProgress, nextChildren)
  workInProgress.memorizedProps = newProps
  return workInProgress.child
}

function shouldSetTextContent(type, props) {
  return typeof props.children === "string" || typeof props.children === "number"
}


function updateHostText(current, workInProgress) {
  let newProps = workInProgress.pendingProps
  workInProgress.memorizedProps = newProps
  return null
}