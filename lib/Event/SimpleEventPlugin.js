import { HostComponent, HostRoot } from "../Reconciler/TypeOfWork";
import SyntheticMouseEvent from "./SyntheticMouseEvent"
import { accumulateInto } from "./Accumulate"

var topLevelTypeToDispatchConfig = {}
// {
//   "topClick": {
//     dependencies: ["top"],
//     phasedRegistrationNames: {
//       captured: "onClickCaptured",
//       bubbled: "onClick"
//     }
//   }
// }
var eventTypes = {};
// {
//   "click": {
//     dependencies: ["top"],
//     phasedRegistrationNames: {
//       captured: "onClickCaptured",
//       bubbled: "onClick"
//     }
//   }
// }
[ "click"
, "mouseenter"
].forEach(event => {
  var capitalized = event[0].toUpperCase() + event.slice(1)
  var onEvent = "on" + capitalized
  var topEvent = "top" + capitalized
  var type = {
    dependencies: [topEvent],
    phasedRegistrationNames: {
      captured: onEvent + "Captured",
      bubbled: onEvent
    }
  }
  eventTypes[event] = type
  topLevelTypeToDispatchConfig[topEvent] = type
});

const SimpleEventPlugin = {
  eventTypes,

  extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelTypeToDispatchConfig[topLevelType]
    if (!dispatchConfig) return null
    var EventConstructor
    switch (topLevelType) {
      case "topClick":
        EventConstructor = SyntheticMouseEvent
        break;
      default:
        break;
    }
    // pooled
    var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget)
    traverseTwoPhase(targetInst, event)
    return event
  }
}

// 第一遍从上往下找onClickCapture，第二遍从下往上找onClick
function traverseTwoPhase(inst, event) {
  var path = [] // button, div
  while (inst) {
    if (inst.tag === HostComponent)
      path.push(inst)
    inst = inst.return
  }
  var i, len = path.length
  for (i = len - 1; i >= 0; i--) {
    accumulateDispatches(path[i], event, "captured")
  }
  for (i = 0; i < len; i++) {
    accumulateDispatches(path[i], event, "bubbled")
  }
}

// 找到phase对应的registrationName，找inst对应的prop
function accumulateDispatches(inst, event, phase) {
  var registrationName = event.dispatchConfig.phasedRegistrationNames[phase]
  var listener = getListener(inst, registrationName)
  if (listener) {
    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener)
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst)
  }
}

function getListener(inst, registrationName) {
  var listener
  // 为什么不直接memorizedProps
  var stateNode = inst.stateNode
  if (!stateNode) return null
  var props = stateNode._eventHandler
  if (!props) return null
  listener = props[registrationName]
   // disabled button/input/textarea/select
  return listener
}

export default SimpleEventPlugin