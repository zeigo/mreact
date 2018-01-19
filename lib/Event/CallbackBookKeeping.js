// bookkeep pool
var callbackBookkeepingPool = []
var POOL_SIZE = 10

export function getCallbackBookkeeping(topLevelType, nativeEvent, targetInst) {
  if (callbackBookkeepingPool.length) {
    var instance = callbackBookkeepingPool.pop();
    instance.topLevelType = topLevelType;
    instance.nativeEvent = nativeEvent;
    instance.targetInst = targetInst;
    return instance
  }
  return {
    topLevelType: topLevelType,
    nativeEvent: nativeEvent,
    targetInst: targetInst,
    ancestors: []
  }
}

export function releaseCallbackBookkeeping(instance) {
  instance.ancestors = []
  instance.topLevelType = null
  instance.nativeEvent = null
  instance.targetInst = null

  if (callbackBookkeepingPool.length < POOL_SIZE) {
    callbackBookkeepingPool.push(instance)
  }
}