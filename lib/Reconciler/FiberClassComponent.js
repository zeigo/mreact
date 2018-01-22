import { processUpdateQueue } from "./UpdateQueue"
import { Update } from "./TypeOfEffect"

export function constructClassInstance(workInProgress, props) {
  var ctor = workInProgress.type
  // TODO: get context
  // fiber.tag === ClassComponent && fiber.type.contextTypes != null
  var instance = new ctor(props)
  workInProgress.stateNode = instance
  instance._internalFiber = workInProgress
  // 插入updater
  return instance
}

export function mountClassInstance(workInProgress, renderExpirationTime) {
  var current = workInProgress.alternate,
    instance = workInProgress.stateNode,
    state = instance.state || null,
    props = workInProgress.pendingProps
  instance.state = workInProgress.memoizedState = state // 防止undefined
  instance.props = props

  // internalContextTag: AsyncUpdates

  if (typeof instance.componentWillMount === "function") {
    instance.componentWillMount() // 可能setState
    // enqueueReplaceState
    var queue = workInProgress.updateQueue
    if (queue !== null) {
      instance.state = processUpdateQueue(current, workInProgress, updateQueue, renderExpirationTime)
    }
  }
  if (typeof instance.componentDidMount === "function") {
    workInProgress.effectTag |= Update
  }
}

// life-cycles
export function updateClassInstance(current, workInProgress, renderExpirationTime) {
  let instance = workInProgress.stateNode,
    oldProps = workInProgress.memorizedProps,
    newProps = workInProgress.pendingProps
  if (newProps === null) {
    newProps = oldProps
  }

  // componentWillReceiveProps
  if (typeof instance.componentWillReceiveProps === "function" && newProps !== oldProps) {
    instance.componentWillReceiveProps(newProps)
  }

  let oldState = workInProgress.memorizedState,
    newState = oldState
  if (workInProgress.updateQueue !== null) {
    newState = processUpdateQueue(current, workInProgress, workInProgress.updateQueue, renderExpirationTime)
  }
  // shouldComponentUpdate
  let shouldUpdate = checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState)
  if (shouldUpdate) {
    // componentWillUpdate
    if (typeof instance.componentWillUpdate === "function") {
      instance.componentWillUpdate(newProps, newState)
    }
    if (typeof instance.componentDidUpdate === "function") {
      workInProgress.effectTag |= Update
    }
  } else {
    if (typeof instance.componentDidUpdate === 'function') {
      if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.effectTag |= Update;
      }
    }
    workInProgress.memoizedProps = newProps
    workInProgress.memoizedState = newState
  }

  instance.props = newProps
  instance.state = newState
  return shouldUpdate
}

function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState) {
  let instance = workInProgress.stateNode
  let shouldUpdate
  if (typeof instance.shouldComponentUpdate === "function") {
    shouldUpdate = instance.shouldComponentUpdate(newProps, newState)
    return shouldUpdate
  }
  // pureComponent, shallowEqual
  return true
}
