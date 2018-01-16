import { createFiber } from "../Reconciler/Fiber"
import { HostRoot } from "../Reconciler/TypeOfWork"
import { NoWork, Sync } from "../Reconciler/ExpirationTime";
import { scheduleWork, computeExpirationForFiber } from "../Reconciler/FiberScheduler"

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

function insertUpdateIntoFiber(fiber, update) {
  let alternate = fiber.alternate,
    queue1 = fiber.updateQueue
  if (queue1 === null) {
    queue1 = fiber.updateQueue = createUpdateQueue()
  }
  insertUpdateIntoQueue(update, queue1)
}

function createUpdateQueue() {
  return {
    baseState: null,
    first: null,
    last: null,
    expirationTime: NoWork,
    isInitialized: false
  }
}

function insertUpdateIntoQueue(update, queue) {
  if (queue.last === null) {
    queue.first = queue.last = update
  } else { // update放到queue最后
    queue.last.next = update
    queue.last = update
  }
  if (queue.expirationTime == NoWork || queue.expirationTime > update.expirationTime) {
    queue.expirationTime = update.expirationTime
  } // queue的expirationTime与最小的update保持一致
}
