
export function executeDispatchesAndRelease(event) {
  if (event) {
    executeDispatchesInOrder(event)
    if (!event.isPersistent) {
      event.constructor.release(event)
    }
  }
}

function executeDispatchesInOrder(event) {
  var dispatchListeners = event._dispatchListeners
  var dispatchInstances = event._dispatchInstances

  if (Array.isArray(dispatchListeners)) {
    for (var i = 0, len = dispatchListeners.length; i < len; i++) {
      if (event.propagationStopped) break
      executeDispatch(event, dispatchListeners[i], dispatchInstances[i])
    }
  } else if (dispatchListeners) {
    executeDispatch(event, dispatchListeners, dispatchInstances)
  }

  event._dispatchListeners = null
  event._dispatchInstances = null
}

// 切换currentTarget，执行回调
// 这里listener是直接调用，如果之前没有bind或arrow function，this为undefined
// simulated: boolean ?? 好像是React测试中用到
function executeDispatch(event, listener, instance) {
  event.currentTarget = instance.stateNode
  // invokeGuardedCallback还需要传type，这里简化
  listener.call(undefined, event)
  event.currentTarget = null
}
