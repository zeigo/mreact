import { getCallbackBookkeeping, releaseCallbackBookkeeping } from "./CallbackBookKeeping";
import { runExtractedEventsInBatch } from "./EventPluginHub"

var EventListener = {
  listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false)
      return {
        remove() {
          target.removeEventListener(eventType, callback, false)
        }
      }
    } else if (target.attachEvent) {
      target.attachEvent("on" + eventType, callback)
      return {
        remove() {
          target.detachEvent("on" + eventType, callback)
        }
      }
    }
  },

  capture(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, true)
      return {
        remove() {
          target.removeEventListener(eventType, callback, true)
        }
      }
    } else {
      throw new Error("browser dont support capture phase")
    }
  }
}


// DOM的事件，生成event对象，经过捕获、冒泡回到document，处理default action
// React提供更高的一层抽象，实现独立的捕获、冒泡

// 在completeWork的过程中，当发现fiber有关于事件的属性，如onClick会注册click事件
// 到document(focus/blur/cancel/close/scroll 为capture，其他为bubble阶段）
// 当document发生click时，找到触发的target及fiber，合成bookkeeping；
// 根据plugin extractEvents两次遍历找到回调，合成事件（Proxy），根据_dispatchListeners
// _dispatchInstances，依次执行dispatch，之后回收到Event pool

// 与之前理解的事件委托有所不同，document只起收集的作用，并不注册回调，回调都在对应的fiber里

export function trapBubbledEvent(topLevelType, baseName, element) {
  if (!element) return
  EventListener.listen(element, baseName, dispatchEvent.bind(null, topLevelType))
}

// instance对应fiber，回调都保存在对应的props里
function dispatchEvent(topLevelType, nativeEvent) {
  var nativeEventTarget = getEventTarget(nativeEvent)
  var targetInst = getClosestInstance(nativeEventTarget)
  var bookkeeping = getCallbackBookkeeping(topLevelType, nativeEvent, targetInst)
  // batched
  handleTopLevel(bookkeeping)
  releaseCallbackBookkeeping(bookkeeping)
}

function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window
  return target.nodeType === 3 ? target.parentNode : target // textNode
}

// HostComponent fiber
function getClosestInstance(node) {
  while (!node._internalInstance) {
    node = node.parentNode
  }
  return node._internalInstance
}

function handleTopLevel(bookkeeping) {
  var targetInst = bookkeeping.targetInst
  // ?? more ancestors
  var ancestors = bookkeeping.ancestors
  ancestors.push(targetInst)
  runExtractedEventsInBatch(bookkeeping.topLevelType, targetInst, bookkeeping.nativeEvent, getEventTarget(bookkeeping.nativeEvent))
}

