import { Placement, PerformedWork, Update, ContentReset } from "./TypeOfEffect";
import { HostComponent, HostRoot, HostText, ClassComponent} from "./TypeOfWork"
import { updateProperties } from "../Utils/Property"

export function commitContentReset(fiber) {
  let node = fiber.stateNode
  node.textContent = ""
}

function getHostParentFiber(fiber) {
  let parent = fiber.return
  while (parent !== null) {
    if (parent.tag === HostComponent || parent.tag === HostRoot) break
    parent = parent.return
  }
  return parent
}

function isHostParent(fiber) {
  let tag = fiber.tag
  return tag === HostComponent || tag === HostRoot
}

// 寻找不为Placement的sibling作为insertBefore的参照
// 如果没有则返回null，之后直接appendChild
function getHostSibling(fiber) {
  let node = fiber
  sibling: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(fiber)) {
        return null
      }
      node = node.return
    }
    node = node.sibling
    // 如果碰到ClassComponent，在child中继续寻找
    while (node.tag !== HostComponent && node.tag !== HostText) {
      if (node.effectTag & Placement) {
        continue sibling
      }
      node = node.child
    }
    if (!node.effectTag & Placement) {
      return node.stateNode
    }
  }
}

export function commitPlacement(fiber) {
  let parentFiber = getHostParentFiber(fiber),
    parent
  if (parentFiber.tag === HostComponent)
    parent = parentFiber.stateNode
  else if (parentFiber.tag === HostRoot)
    parent = parentFiber.stateNode.containerInfo

  // 子fiber的placement effect要早于父fiber的contentReset出现
  // 故要处理父fiber
  if (parentFiber.effectTag & ContentReset) {
    parent.textContent = ""
    // Clear ContentReset from the effect tag
    parentFiber.effectTag &= ~ContentReset;
  }
  let before = getHostSibling(fiber),
    node = fiber
  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      if (before) {
        parent.insertBefore(fiber.stateNode, before)
      } else {
        parent.appendChild(fiber.stateNode)
      }
    } else {
      // TODO: ClassComponent
    }
    if (node === fiber) return
  }
}

export function commitWork(current, fiber) {
  switch (fiber.tag) {
    case HostComponent: {
      let updatePayload = fiber.updateQueue,
        instance = fiber.stateNode,
        newProps = fiber.memorizedProps,
        oldProps = current !== null ? current.memorizedProps : null
      fiber.updateQueue = null
      if (updatePayload) {
        commitUpdate(instance, updatePayload, fiber.type, oldProps, newProps)
      }
      return
    }
    case HostText: {
      let textInstance = fiber.stateNode,
        newText = fiber.memorizedProps
      commitTextUpdate(textInstance, newText)
      return
    }
  }
}

function commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
  domElement._eventHandler = newProps
  updateProperties(domElement, updatePayload, type, oldProps, newProps)
}

function commitTextUpdate(textInstance, newText) {
  textInstance.nodeValue = newText
}

// 从host父节点上删除
export function commitDeletion(fiber) {
  unmountHostComponent(fiber)
  // detachFiber
  fiber.return = null
  fiber.child = null
}

function unmountHostComponent(fiber) {
  var node = fiber,
    parentFiber = getHostParentFiber(fiber),
    parent, tag
  if (parentFiber.tag === HostComponent)
    parent = parentFiber.stateNode
  else if (parentFiber.tag === HostRoot)
    parent = parentFiber.stateNode.containerInfo

  while (true) {
    tag = node.tag
    if (tag === HostComponent || tag === HostText) {
      parent.removeChild(node.stateNode)
      unmountChildren(node)
    } else if (tag === ClassComponent) {
      var instance = node.stateNode
      if (typeof instance.componentWillUnmount === "function") {
        instance.componentWillUnmount()
      }
      if (node.child !== null) {
        node = node.child
        continue
      }
    }
    if (node === fiber) return // fiber直接为Host或ClassComponent没有Child
    while (node.sibling === null) {
      if (node.return === null || node.return === fiber) return
      node = node.return
    }
    node = node.sibling
  }
}

// 向下递归unmount ClassComponent
// TODO: clear ref
function unmountChildren(fiber) {
  var node = fiber
  while (true) {
    if (node.tag === ClassComponent) {
      var instance = node.stateNode
      if (typeof instance.componentWillUnmount === "function") {
        instance.componentWillUnmount()
      }
    }
    if (node.child !== null) {
      node = node.child
      continue
    }
    if (node === fiber) return // fiber没有child，直接返回
    while (node.sibling === null) { // 若没有sibling，向上找
      if (node.return === null || node.return === fiber)
        return
      node = node.return
    }
    node = node.sibling
  }
}

export function commitLifeCycles(current, fiber) {
  switch (fiber.tag) {
    case HostComponent: {
      if (current === null && fiber.effectTag & Update){
        // auto focus for input/form control
      }
      return
    }
    case HostRoot: {
      return
    }
    case ClassComponent: {
      if (current === null && fiber.effectTag & Update) {
        var instance = fiber.stateNode
        instance.componentDidMount()
      } else {
        // cDU
      }
      return
    }
  }
}