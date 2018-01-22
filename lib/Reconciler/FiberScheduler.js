import { NoWork, Sync } from "./ExpirationTime";
import { Placement, Deletion, Callback, Update, PerformedWork, Err, ContentReset } from "./TypeOfEffect";
import { createWorkInProgress } from "./Fiber"
import beginWork from "./FiberBeginWork"
import { completeUnitOfWork } from "./FiberCompleteWork"
import { commitContentReset, commitDeletion, commitPlacement, commitWork, commitLifeCycles } from "./FiberCommitWork"
import { msToExpirationTime, computeExpirationBucket, expirationTimeToMs } from "./ExpirationTime"

function now() {
  return Date.now() // performance.now()
}

let startTime = now(), // 作为之后expirationTime的参照
  mostRecentCurrentTime = msToExpirationTime(0)

function recalculateCurrentTime() {
  const ms = now() - startTime;
  mostRecentCurrentTime = msToExpirationTime(ms);
  return mostRecentCurrentTime;
}

function computeAsyncExpiration() {
  const currentTime = recalculateCurrentTime();
  const expirationMs = 1000;
  const bucketSizeMs = 200;
  return computeExpirationBucket(currentTime, expirationMs, bucketSizeMs);
}

// 处理页面多个HostRoot的情况！！
let lastScheduledRoot = null,
  firstScheduledRoot = null,
  nextFlushedRoot = null,
  nextFlushedExpirationTime = NoWork

let isRendering = false,
  isWorking = false,
  isCommitting = false,
  isUnmounting = false

let nextRoot = null,
  nextRenderExpirationTime = NoWork, // 当前render的期限
  nextUnitOfWork = null

let deadline = null,
  deadlineDidExpire = false,
  callbackExpirationTime = NoWork,
  callbackId = -1
// 永远只有一个异步任务

let nextEffect = null

var useSyncScheduling = true // 默认同步渲染

// updateContainer/setState时使用
export function computeExpirationForFiber(fiber) {
  var expirationTime
  if (isWorking) {
    if (isCommitting) {
      // commit阶段的update默认Sync
      // lifecycle?
      expirationTime = Sync
    } else { 
      // render阶段的update与当前render work一致
      // componentWillMount/ 时setState
      expirationTime = nextRenderExpirationTime
    }
  } else {
    if (fiber.internalContextTag !== undefined) {
      expirationTime = computeAsyncExpiration()
    } else {
      expirationTime = Sync
    }
  }
  return expirationTime
}

export function scheduleWork(fiber, expirationTime) {
  let node = fiber
  while (node !== null) {
    if (node.expirationTime === NoWork || node.expirationTime > expirationTime) {
      node.expirationTime = expirationTime
    }
    let alternate = node.alternate
    if (alternate !== null) {
      if (alternate.expirationTime === NoWork || alternate.expirationTime > expirationTime) {
        alternate.expirationTime = expirationTime
      }
    }
    if (node.return === null) {
      let root = node.stateNode
      requestWork(root, expirationTime)
    }
    node = node.return
  }
}

// 每次有update都会冒泡到root再requestWork, 之后决定什么时候renderRoot
// ?? 是否有方法只更新触发的部分
function requestWork(root, expirationTime) {
  // 检查root是否在schedule中
  if (root.nextScheduledRoot === null) { // 不在时添加
    root.remainingExpirationTime = expirationTime
    if (lastScheduledRoot === null) {
      root.nextScheduledRoot = root
      firstScheduledRoot = lastScheduledRoot = root
    } else {
      lastScheduledRoot.nextScheduledRoot = root
      lastScheduledRoot = root
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot // ?
    }
  } else { // 在时判断是否增加优先级
    var remainingExpirationTime = root.remainingExpirationTime
    if (remainingExpirationTime === NoWork || remainingExpirationTime > expirationTime) {
      root.remainingExpirationTime = expirationTime
    }
  }

  if (isRendering) return // 避免嵌套

  if (expirationTime === Sync) {
    performWork(Sync, null)
  } else {
    // requestIdleCallback
    scheduleCallbackWithExpiration(expirationTime)
  }
}

function scheduleCallbackWithExpiration(expirationTime) {
  if (callbackExpirationTime !== NoWork) {
    if (expirationTime > callbackExpirationTime) {
      // 已计划的callback更紧急，不需要再设置
      return
    } else {
      cancelIdleCallback(callbackId)
    }
  }
  // Compute a timeout for the given expiration time.
  const currentMs = now() - startTime;
  const expirationMs = expirationTimeToMs(expirationTime);
  const timeout = expirationMs - currentMs;

  callbackExpirationTime = expirationTime;
  callbackId = requestIdleCallback(performAsyncWork, {
    timeout
  });
}

function performAsyncWork(dl) {
  performWork(NoWork, dl)
}

function performWork(minExpirationTime, dl) {
  // minExpirationTime            dl
  //       Sync                  null
  //      NoWork       {didTimeout, timeRemaining()}
  deadline = dl

  findHighestPriorityRoot()
  
  // 若performWorkOnRoot里的renderRoot耗尽了时间，deadlineDidExpire为true
  while (nextFlushedRoot !== null &&
    nextFlushedExpirationTime !== NoWork &&
    !deadlineDidExpire) {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime)
    findHighestPriorityRoot()
  }

  if (deadline !== null) {
    callbackExpirationTime = NoWork
    callbackId = -1
  }

  if (nextFlushedExpirationTime !== NoWork) {
    scheduleCallbackWithExpiration(nextFlushedExpirationTime)
  }
  deadline = null
  deadlineDidExpire = false
}

// 找到root list里面优先级最高的赋值给nextFlushedRoot, nextFlushedExpirationTime
// 以下只考虑单一HostRoot
function findHighestPriorityRoot() {
  var hpRoot = null,
    hpWork = NoWork
  // throw new Error()
  if (lastScheduledRoot !== null) {
    var root = firstScheduledRoot
    while (root !== null) {
      var remainingExpirationTime = root.remainingExpirationTime
      if (remainingExpirationTime === NoWork) {
        // this root no longer need work, remove it from scheduler
        if (root === root.nextScheduledRoot) {
          // 单HostRoot容器，目前只考虑这一种以简化
          root.nextScheduledRoot = null
          firstScheduledRoot = lastScheduledRoot = null
          break
        }
      } else {
        if (hpWork === NoWork || hpWork > remainingExpirationTime) {
          hpRoot = root
          hpWork = remainingExpirationTime
        }
        if (root === lastScheduledRoot) break // 单HostRoot不用再找
        root = root.nextScheduledRoot
      }
    }
  }

  nextFlushedExpirationTime = hpWork
  nextFlushedRoot = hpRoot
}

function performWorkOnRoot(root, expirationTime) {
  isRendering = true

  let finishedWork = root.finishedWork
  if (finishedWork !== null) {
    // 已完成，可进行commit; render和commit之间可能中断
    root.finishedWork = null
    root.remainingExpirationTime = commitRoot(finishedWork)
  } else {
    finishedWork = renderRoot(root, expirationTime)
    if (finishedWork !== null) {
      if (expirationTime < recalculateCurrentTime()) {
        // sync/expired work，直接commit
        root.remainingExpirationTime = commitRoot(finishedWork)
      } else if (!shouldYield()) { // async，还有时间剩余，直接commit
        root.remainingExpirationTime = commitRoot(finishedWork)
      } else { // 没时间剩余，之后再commit
        root.finishedWork = finishedWork
      }
    }
  }

  isRendering = false
}

// 1.performUnitOfWork后要判断时间，没时间之后从nextUnitOfWork继续
// 2.renderRoot后要判断时间，没时间之后从root.finishedWork继续
function shouldYield() {
  if (deadline === null) return false
  if (deadline.timeRemaining() > 1) return false
  deadlineDidExpire = true
  return true
}

// 当workLoop中performUnitOfWork因时间不够停止时，isReadyForCommit仍为false，返回null
function renderRoot(root, expirationTime) {
  isWorking = true
  root.isReadyForCommit = false

  // 重新开始而不是从中断的地方nextUnitOfWork继续
  if (root !== nextRoot || expirationTime !== nextRenderExpirationTime || nextUnitOfWork === null) {
    nextRoot = root
    nextRenderExpirationTime = expirationTime
    nextUnitOfWork = createWorkInProgress(root.current, null, nextRenderExpirationTime)
  }
  // invokeGuardedCallback
  workLoop(expirationTime)
  isWorking = false
  return root.isReadyForCommit ? root.current.alternate : null
}

function workLoop(expirationTime) {
  if (nextRenderExpirationTime === NoWork || nextRenderExpirationTime > expirationTime)
    return
  // count expire and comfirm shouldYield
  if (nextRenderExpirationTime < mostRecentCurrentTime) {
    // flush sync/expired work
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
  } else {
    // flush async work until deadline
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
  }
}

// perform分为begin/complete两步
// begin 通过对比修改fiber 树，确定Placement, Deletion, ContentRest
// 新建/更新Class实例, 根据pendingProps和updateQueue来
// 确定work in progress的memorizedProps/State
// complete 新建/更新Host实例，确定Update
function performUnitOfWork(workInProgress) {
  let current = workInProgress.alternate
  let next = beginWork(current, workInProgress, nextRenderExpirationTime)
  if (next === null) { // 到达叶节点，没有子节点或者只有text
    next = completeUnitOfWork(workInProgress)
  }
  return next
}

// 遍历两次
function commitRoot(finishedWork) {
  isWorking = true
  isCommitting = true
  let root = finishedWork.stateNode
  root.isReadyForCommit = false

  let firstEffect
  if (finishedWork.effectTag > PerformedWork) { // root上有side effect
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork
      firstEffect = finishedWork.firstEffect
    } else {
      firstEffect = finishedWork
    }
  } else {
    firstEffect = finishedWork.firstEffect
  }

  nextEffect = firstEffect

  while (nextEffect !== null) {
    commitAllHostEffects()
  }

  root.current = finishedWork
  nextEffect = firstEffect
  while (nextEffect !== null) {
    commitAllLifeCycles()
  }
  isWorking = false
  isCommitting = false
  root.isReadyForCommit = false
  return root.current.expirationTime
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    let effectTag = nextEffect.effectTag
    if (effectTag & ContentReset) {
      commitContentReset(nextEffect)
    }
    let primaryEffectTag = effectTag & (Placement | Update | Deletion)
    switch (primaryEffectTag) {
      case Deletion:
        {
          isUnmounting = true
          commitDeletion(nextEffect)
          isUnmounting = false
          break;
        }
      case Update:
        {
          commitWork(nextEffect.alternate, nextEffect)
          break;
        }
      case Placement:
        {
          commitPlacement(nextEffect)
          nextEffect.effectTag &= ~Placement
          break
        }
    }
    nextEffect = nextEffect.nextEffect
  }
}

// componentDidMount
function commitAllLifeCycles() {
  while (nextEffect !== null) {
    let effectTag = nextEffect.effectTag

    if (effectTag & (Update | Callback)) {
      commitLifeCycles(nextEffect.alternate, nextEffect)
    }

    let next = nextEffect.nextEffect
    nextEffect.nextEffect = null
    nextEffect = next
  }
}