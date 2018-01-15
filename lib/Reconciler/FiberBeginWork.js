import { HostComponent, HostRoot, HostText, ClassComponent} from "./TypeOfWork"
import reconcileChildren from "./FiberReconciler"

// 控制入口，根据fiber的tag确定处理方式，返回下次work的对象
export default function beginWork(current, workInProgress, renderExpirationTime) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime)
    // dont support classComponet firstly
    // case ClassComponent:
    //   return updateClassComponent(current, workInProgress, renderExpirationTime)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime)
    case HostText:
      return updateHostText(current, workInProgress)
    default:
      throw Error("not valid tag of fiber")
  }
}

// need prevProps, prevState later for partialState which is function
function processUpdateQueue(current, workInProgress, queue) {
  // workInProgress的queue是由current直接赋值来的，这里复制一份 why?
  if (current !== null && current.queue === queue) {
    let currentQueue = queue
    queue = workInProgress.updateQueue = {
      first: currentQueue.first,
      last: currentQueue.last,
      isInitialized: currentQueue.isInitialized,
      baseState: currentQueue.baseState
    }
  }
  // initialize state
  let state
  if (queue.isInitialized) {
    state = queue.baseState
  } else {
    state = queue.baseState = workInProgress.memorizedState
    queue.isInitialized = true
  }
  let update = queue.first,
    dontMutatePrevState = true
  while (update !== null) {
    // TODO: skip low priority
    let partialState = getStateFromState(update)
    if (partialState) {
      if (dontMutatePrevState) { // 确保是新的state
        state = Object.assign({}, state, partialState)
      } else {
        state = Object.assign(state, partialState)
      }
      dontMutatePrevState = false
    }
    update = update.next
  }
  workInProgress.updateQueue = null
  // TODO: add callback list
  return state
}

function getStateFromState(update) {
  let partialState = update.partialState
  if (typeof partialState === "function") {
    // TODO
  }
  return partialState
}

function updateHostRoot(current, workInProgress, renderExpirationTime) {
  let updateQueue = workInProgress.updateQueue,
    prevState = workInProgress.memorizedState
  if (updateQueue !== null) {
    let state = processUpdateQueue(current, workInProgress, updateQueue)
    let element = state.element
    // 对比后更改workInProgress.child
    reconcileChildren(current, workInProgress, element)
  }
  return workInProgress.child
}

// function updateClassComponent(current, workInProgress, renderExpirationTime) {
//   if (current === null) {

//   } else {
//     shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime)
//   }

//   let nextChildren = instance.render()
//   workInProgress.effectTag |= PerformedWork
//   reconcileChildren(current, workInProgress, nextChildren)
//   workInProgress.memorizedProps = instance.props
//   workInProgress.memorizedState = instance.state
//   return workInProgress.child
// }

// // life-cycles
// function updateClassInstance(current, workInProgress, renderExpirationTime) {
//   let instance = workInProgress.stateNode,
//     oldProps = workInProgress.memorizedProps,
//     newProps = workInProgress.pendingProps
//   if (!newProps) {
//     newProps = oldProps
//   }
//   // componentWillReceiveProps
//   if (typeof instance.componentWillReceiveProps === "function" && newProps !== oldProps) {

//   }
//   let oldState = workInProgress.memorizedState,
//     newState = oldState
//   if (workInProgress.updateQueue !== null) {
//     newState = processUpdateQueue(current, workInProgress, workInProgress.updateQueue)
//   }
//   // shouldComponentUpdate
//   let shouldUpdate = checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState)
//   if (shouldUpdate) {
//     // componentWillUpdate
//     if (typeof instance.componentWillUpdate === "function") {
//       instance.componentWillUpdate(newProps, newState)
//     }
//   }

//   instance.props = newProps
//   instance.state = newState
//   return shouldUpdate
// }

// function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState) {
//   let instance = workInProgress.stateNode
//   let shouldUpdate = true
//   if (typeof instance.shouldComponentUpdate === "function") {
//     shouldUpdate = instance.shouldComponentUpdate(newProps, newState)
//   }
//   return shouldUpdate
// }

function updateHostComponent(current, workInProgress, renderExpirationTime) {
  let oldProps = workInProgress.memorizedProps,
    newProps = workInProgress.pendingProps
  if (newProps === null) newProps = oldProps
  let nextChildren = newProps.children
  if (typeof nextChildren === "string") {
    nextChildren = null
  } // 子节点只有textNode，不往下再比较
  reconcileChildren(current, workInProgress, nextChildren)
  workInProgress.memorizedProps = newProps
  return workInProgress.child
}

function updateHostText(current, workInProgress) {
  let oldProps = workInProgress.memorizedProps,
    newProps = workInProgress.pendingProps
  if (newProps === null) newProps = oldProps
  workInProgress.memorizedProps = newProps
  return null
}