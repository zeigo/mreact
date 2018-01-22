import { NoWork } from "./ExpirationTime";

class Update {
  constructor() {
    this.expirationTime = NoWork
    this.next = null // Update
    this.partialState = null
  }
}

// Singly linked-list of updates. When an update is scheduled, it is added to
// the queue of the current fiber and the work-in-progress fiber. The two queues
// are separate but they share a persistent structure.
//
// During reconciliation, updates are removed from the work-in-progress fiber,
// but they remain on the current fiber. That ensures that if a work-in-progress
// is aborted, the aborted updates are recovered by cloning from current.
//
// The work-in-progress queue is always a subset of the current queue.
//
// When the tree is committed, the work-in-progress becomes the current.
class UpdateQueue {
  // A processed update is not removed from the queue if there are any
  // unprocessed updates that came before it. In that case, we need to keep
  // track of the base state, which represents the base state of the first
  // unprocessed update, which is the same as the first update in the list.
  constructor() {
    this.first = null
    this.last = null
    this.expirationTime = NoWork
    this.isInitialized = false // 标志baseState是否初始化
    this.baseState = null
  }
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

export function insertUpdateIntoFiber(fiber, update) {
  // 最多有两条不同的queue
  let alternate = fiber.alternate,
    queue1 = fiber.updateQueue
  if (queue1 === null) {
    queue1 = fiber.updateQueue = createUpdateQueue()
  }
  let queue2
  if (alternate !== null) {
    queue2 = alternate.updateQueue
    if (queue2 === null) {
      queue2 = alternate.updateQueue = createUpdateQueue()
    }
  } else {
    queue2 = null
  }
  queue1 === queue2 && (queue2 = null)

  if (queue2 === null) {
    insertUpdateIntoQueue(queue1, update)
    return
  }

  if (queue1.last === null || queue2.last === null) {
    insertUpdateIntoQueue(queue1, update)
    insertUpdateIntoQueue(queue2, update)
    return
  }

  insertUpdateIntoQueue(queue1, update);
  // 当有两条不同queue时，当不为空时，只需更新queue1，并更新queue2.last
  queue2.last = update;
}

function insertUpdateIntoQueue(queue, update) {
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

// need prevProps, prevState later for partialState which is function
export function processUpdateQueue(current, workInProgress, queue, renderExpirationTime) {
  // workInProgress的queue是由current直接赋值来的，persistent
  if (current !== null && current.queue === queue) {
    let currentQueue = queue
    queue = workInProgress.updateQueue = {
      first: currentQueue.first,
      last: currentQueue.last,
      isInitialized: currentQueue.isInitialized,
      baseState: currentQueue.baseState
    }
  }
  // queue的expirationTime需要是被跳过而剩余的update中最小值
  // 这里先重置
  queue.expirationTime = NoWork
  // initialize state
  let state
  if (queue.isInitialized) {
    state = queue.baseState
  } else {
    state = queue.baseState = workInProgress.memorizedState
    queue.isInitialized = true
  }
  let update = queue.first,
    dontMutatePrevState = true,
  // 不直接在原来state上修改，从而保证state引用不同
    didSkip = false
  while (update !== null) {

    let updateExpirationTime = update.expirationTime
    if (updateExpirationTime > renderExpirationTime) {
      // 不紧急，跳过
      if (queue.expirationTime === NoWork || queue.expirationTime > updateExpirationTime) {
        queue.expirationTime = updateExpirationTime
      } // 保持queue的expirationTime最小
      if (!didSkip) {
        didSkip = true
        queue.baseState = state
      }
      update = update.next
      continue
    }
    // 若之前没有跳过，从queue里删去这个update
    // ?? 能否使updateQueue只剩下跳过的部分
    if (!didSkip) {
      queue.first = update.next
      queue.first === null && (queue.last = null)
    }

    let partialState = getStateFromUpdate(update)
    if (partialState) {
      if (dontMutatePrevState) { // 确保是新的state
        state = Object.assign({}, state, partialState)
      } else {
        state = Object.assign(state, partialState)
      }
      dontMutatePrevState = false
    }
    // TODO: add callback list
    update = update.next
  }
  if (queue.first === null) { // queue已处理空
    workInProgress.updateQueue = null
  }
  if (!didSkip) {
    queue.baseState = state
  }
  return state
}

function getStateFromUpdate(update) {
  var partialState = update.partialState;
  if (typeof partialState === 'function') {
    // TODO: function
  } else {
    return partialState;
  }
}