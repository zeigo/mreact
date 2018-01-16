import { NoWork, Sync } from "./ExpirationTime";
import { Placement, Deletion, Callback, Update, PerformedWork, Err } from "./TypeOfEffect";
import { createWorkInProgress } from "./Fiber"
import beginWork from "./FiberBeginWork"
import { completeUnitOfWork } from "./FiberCompleteWork"
import { commitDeletion, commitPlacement, commitWork, commitLifeCycles } from "./FiberCommitWork"

function now() {
  return Date.now() // performance.now()
}

function recalculteCurrentTime() {
  var ms = now() - startTime

}
// 处理页面多个HostRoot的情况！！
let lastScheduledRoot = null,
  firstScheduledRoot = null
 
let isRendering = false,
  isWorking = false,
  isCommiting = false,
  isUnmounting = false
  
let nextFlushedRoot = null,
  nextFlushedExpirationTime = NoWork,
  nextRoot = null,
  nextRenderExpirationTime = NoWork,
  nextUnitOfWork = null
  
let deadline = null,
  deadlineDidExpire = false,
  startTime = now(),
  mostRecentCurrentTime

let nextEffect = null

var useSyncScheduling = true // 默认同步渲染

export function computeExpirationForFiber(fiber) {
  var expirationTime
  if (isWorking) {
    if (isCommiting) {
      expirationTime = Sync
    } else {
      expirationTime = nextRenderExpirationTime
    }
  } else {
    if (useSyncScheduling) {
      expirationTime = Sync
    } else {
      // computeAsyncExpiration
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

  if (isRendering) return

  if (expirationTime === Sync) {
    performWork(Sync, null)
  } else {
    // requestIdleCallback
    // scheduleCallbackWithExpiration(expirationTime)
  }
}

function performWork(minExpirationTime, dl) {
  deadline = dl

  findHighestPriorityRoot()

  while (nextFlushedRoot !== null && nextFlushedExpirationTime !== NoWork) {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime)
    findHighestPriorityRoot()
  }
  deadline = null
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

  if (true) { // flush sync work, expirationTime < recalculateCurrentTime()
    let finishedWork = root.finishedWork
    if (finishedWork !== null) {
      // 已完成，进行commit; render和commit之间可能中断
      root.finishedWork = null
      root.remainingExpirationTime = commitRoot(finishedWork)
    } else {
      finishedWork = renderRoot(root, expirationTime)
      if (finishedWork !== null) {
        root.remainingExpirationTime = commitRoot(finishedWork)
      }
    }
  }

  isRendering = false
}

function renderRoot(root, expirationTime) {
  isWorking = true
  root.isReadyForCommit = false

  if (root !== nextRoot || expirationTime !== nextRenderExpirationTime || nextUnitOfWork === null) {
    nextRoot = root
    nextRenderExpirationTime = expirationTime
    nextUnitOfWork = createWorkInProgress(root.current, null, nextRenderExpirationTime)
  }
  // invokeGuardedCallback
  workLoop(expirationTime)

  return root.isReadyForCommit ? root.current.alternate : null
}

function workLoop(expirationTime) {
  if (nextRenderExpirationTime === NoWork || nextRenderExpirationTime > expirationTime)
    return
  // count expire and comfirm shouldYield
  while (nextUnitOfWork !== null) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
}

// perform分为begin/complete两步
// begin 通过对比修改fiber 树，确定Placement, Deletion
// complete 新建/更新实例，确定Update
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
  isCommiting = true
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
  isCommiting = false
  root.isReadyForCommit = false
  return root.current.expirationTime
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    let effectTag = nextEffect.effectTag,
      primaryEffectTag = effectTag & (Placement | Update | Deletion)
    switch (primaryEffectTag) {
      case Deletion: {
        isUnmounting = true
        commitDeletion(nextEffect)
        isUnmounting = false
        break;
      }
      case Update: {
        commitWork(nextEffect.alternate, nextEffect)
        break;
      }
      case Placement: {
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