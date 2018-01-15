import { createFiberFromElement, createFiberFromText, createWorkInProgress } from "./Fiber.js"
import { Deletion, Placement } from "./TypeOfEffect";
import { ELEMENT_TYPE } from "../Utils/Symbols";
import { HostText } from "./TypeOfWork"

export default function reconcileChildren(current, workInProgress, nextChildren) {
  let expirationTime = workInProgress.expirationTime,
    currentFirstChild = null
  if (current !== null) currentFirstChild = current.child
  // 简化，先不将current === null即初次单独考虑
  // if (current === null) {
  //   workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, expirationTime)
  // }
  workInProgress.child = reconcileChildFibers(workInProgress, currentFirstChild, nextChildren, expirationTime)
}

// tag children with the side-effect
function reconcileChildFibers(returnFiber, currentFirstChild, newChildren, expirationTime) {
  if (typeof newChildren === "object" && newChildren !== null) {
    switch (newChildren.$$typeof) {
      case ELEMENT_TYPE:
        return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChildren, expirationTime))
    }
  }
  if (Array.isArray(newChildren)) { // children为数组
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime)
  }

  // newChildren: null/undefined
  return deleteRemainingChildren(returnFiber, currentFirstChild)
}

// 对比单个element
function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
  let child = currentFirstChild,
    key = element.key
  while (child !== null) {
    if (key === child.key) {
      if (child.type === element.type) {
        deleteRemainingChildren(returnFiber, child.sibling);
        var existing = useFiber(child, element.props, expirationTime);
        existing.return = returnFiber;
        return existing;
      } else {
        deleteRemainingChildren(returnFiber, child)
        break
      }
    } else {
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }
  let elementFiber = createFiberFromElement(element, expirationTime)
  elementFiber.return = returnFiber
  return elementFiber
}

function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
  let oldFiber = currentFirstChild,
    lastPlacedIndex = 0,
    newIndex = 0,
    prevNewFiber = null,
    resultFirstChild = null // 新的first child

  // 依次同时遍历old和new，key匹配时（包括两个null）才继续
  for (; oldFiber !== null && newIndex < newChildren.length; newIndex++) {
    let newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIndex], expirationTime)
    // key不匹配时返回null
    if (newFiber === null) {
      break
    }
    if (oldFiber && newFiber.alternate === null) {
      deleteChild(returnFiber, oldFiber)
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex)
    if (prevNewFiber === null) {
      resultFirstChild = newFiber
    } else {
      prevNewFiber.sibling = newFiber
    }
    prevNewFiber = newFiber
    oldFiber = oldFiber.sibling
  }

  if (newIndex === newChildren.length) { // newChildren到末尾
    deleteRemainingChildren(returnFiber, oldFiber)
    return resultFirstChild
  }

  if (oldFiber === null) { // oldFiber先到末尾，剩下的newChild全部插入
    for (; newIndex < newChildren.length; newIndex++) {
      let newFiber = createChild(returnFiber, newChildren[newIndex], expirationTime);
      if (!newFiber) {
        continue;
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex);
      if (prevNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultFirstChild = newFiber;
      } else {
        prevNewFiber.sibling = newFiber;
      }
      prevNewFiber = newFiber;
    }
    return resultFirstChild;
  }

  // 若因为key不匹配而提前退出遍历，根据key或index建立原来子节点的map
  let existingChildren = mapRemainingChildren(returnFiber, oldFiber)
  for (; newIndex < newChildren.length; newIndex++) {
    let newFiber = updateFromMap(existingChildren, returnFiber, newIndex, newChildren[newIndex], expirationTime)
    if (newFiber) {
      // 若复用之前map中的fiber，从map中删去
      if (newFiber.alternate !== null) {
        existingChildren.delete(newFiber.key || newIndex)
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex)
      if (prevNewFiber === null) {
        resultFirstChild = newFiber;
      } else {
        prevNewFiber.sibling = newFiber;
      }
      prevNewFiber = newFiber;
    }
  }
  // map剩下的都是不需要的，删除
  existingChildren.forEach(function(child) {
    deleteChild(returnFiber, child)
  })
}

// type相同，则复用fiber；type不同，新建fiber。更新pendingProps为element.props
function updateElement(returnFiber, current, element, expirationTime) {
  if (current !== null && current.type === element.type) {
    var existing = useFiber(current, element.props, expirationTime);
    existing.return = returnFiber;
    return existing;
  } else {
    var created = createFiberFromElement(element, expirationTime);
    created.return = returnFiber;
    return created;
  }
}

function updateTextNode(returnFiber, oldFiber, newText, expirationTime) {
  if (oldFiber === null || oldFiber.tag !== HostText) {
    // Insert
    var created = createFiberFromText(newText, expirationTime);
    created['return'] = returnFiber;
    return created;
  } else {
    // Update
    var existing = useFiber(oldFiber, newText, expirationTime);
    existing['return'] = returnFiber;
    return existing;
  }
}

function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
  let key = oldFiber !== null ? oldFiber.key : null
  if (typeof newChild === "string" || typeof newChild === "number") {
    if (key !== null) return null // 若新节点为text而原节点有key，自然不匹配
    return updateTextNode(returnFiber, oldFiber, "" + newChild, expirationTime)
  }

  if (typeof newChild === "object" && newChild !== null) {
    switch (newChild.$$typeof) {
      case ELEMENT_TYPE: {
        if (newChild.key === key)
          return updateElement(returnFiber, oldFiber, newChild, expirationTime)
        else
          return null
      }
    }
  }
}

function mapRemainingChildren(returnFiber, currentFirstChild) {
  let remain = new Map(),
    child = currentFirstChild
  while (child !== null) {
    if (child.key === null) {
      remain.set(child.index, child)
    } else {
      remain.set(child.key, child)
    }
  }
  return remain
}

function updateFromMap(remain, returnFiber, newIndex, newChild, expirationTime) {
  if (typeof newChild === "string" || typeof newChild === "number") {
    let matched = remain.get(newIndex) || null
    return updateTextNode(returnFiber, matched, "" + newChild, expirationTime)
  }

  if (typeof newChild === "object" && newChild !== null) {
    switch (newChild.$$typeof) {
      case ELEMENT_TYPE: {
        let matched = remain.get(newChild.key || newIndex) || null
        return updateElement(returnFiber, matched, newChild, expirationTime)
      }
    }
  }
}

function createChild(returnFiber, newChild, expirationTime) {
  if (typeof newChild === "string" || typeof newChild === "number") {
    var created = createFiberFromText(newChild + "", expirationTime)
    created.return = returnFiber
    return created;
  }
  if (typeof newChild === "object" && newChild !== null) {
    switch (newChild.$$typeof) {
      case ELEMENT_TYPE: {
        var created = createFiberFromElement(newChild, expirationTime);
        created.return = returnFiber;
        return created;
      }
    }
  }
}

function placeChild(newFiber, lastPlacedIndex, newIndex) {
  newFiber.index = newIndex
  let current = newFiber.alternate
  if (current !== null) { // type不变
    let oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // This is a move.
      newFiber.effectTag = Placement;
      return lastPlacedIndex;
    } else {
      // dont need to move
      return oldIndex;
    }
  } else {
    newFiber.effectTag = Placement
    return lastPlacedIndex
  }
}

// 插入新child时，effectTag设为Placement
function placeSingleChild(newFiber) {
  if (newFiber.alternate === null)
    newFiber.effectTag |= Placement
  return newFiber
}

// clone fiber, alternate为原始fiber
function useFiber(fiber, pendingProps, expirationTime) {
  var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

// 要删除的加到return的effect list里
function deleteChild(returnFiber, childToDelete) {
  let last = returnFiber.lastEffect
  if (last === null) {
    returnFiber.firstEffect = returnFiber.lastEffect = childToDelete
  } else {
    last.nextEffect = childToDelete
    returnFiber.lastEffect = childToDelete
  }
  childToDelete.nextEffect = null
  childToDelete.effectTag = Deletion
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild
  while (childToDelete !== null) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling
  }
  return null
}