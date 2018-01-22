import { createFiber } from "../Reconciler/Fiber"
import { HostRoot } from "../Reconciler/TypeOfWork"
import { NoWork } from "../Reconciler/ExpirationTime";
import { scheduleWork, computeExpirationForFiber } from "../Reconciler/FiberScheduler"
import { insertUpdateIntoFiber } from "../Reconciler/UpdateQueue"

// TODO: callback
export default function render(element, container) {
  let hostRoot
  if (hostRoot = container._rootContainer) { // 已挂载
    updateContainer(element, hostRoot)
  } else {
    hostRoot = createContainer(container)
    container._rootContainer = hostRoot
    // TODO: unbatchUpdates
    updateContainer(element, hostRoot)
  }
}

function createContainer(container) {
  let fiber = createFiber(HostRoot, null)
  let root = {
    containerInfo: container,
    current: fiber,
    nextScheduledRoot: null,
    remainingExpirationTime: NoWork,
    finishedWork: null,
    isReadyForCommit: false,
    // TODO: Addtional properties
  }
  fiber.stateNode = root
  return root
}

function updateContainer(element, container) {
  let fiber = container.current
  // TODO: get context
  scheduleTopLevelUpdate(fiber, element);
}

function scheduleTopLevelUpdate(fiber, element) {
  let expirationTime = computeExpirationForFiber(fiber)
  let update = {
    expirationTime,
    partialState: {element: element},
    next: null
  }
  insertUpdateIntoFiber(fiber, update)
  scheduleWork(fiber, expirationTime)
}
