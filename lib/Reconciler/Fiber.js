import { HostComponent, HostText } from "./TypeOfWork";
import { NoEffect } from "./TypeOfEffect";
import { NoWork } from "./TypeOfWork";


class Fiber {
  constructor(tag, key) {
    this.tag = tag // TypeOfWork
    this.key = key
    this.type = null // 组件类，nodeName
    this.stateNode = null // 组件实例，DOM元素

    this.return = null
    this.child = null
    this.sibling = null
    this.alternate = null
    this.index = 0
    this.updateQueue = null

    this.effectTag = NoEffect
    this.firstEffect = null
    this.lastEffect = null
    this.nextEffect = null
    this.expirationTime = NoWork

    this.memorizedState = null
    this.pendingProps = null
    this.memorizedProps = null
    // 没有pendingState, 从updateQueue得到
  }
}

export function createFiber(tag, key) {
  return new Fiber(tag, key)
}

export function createFiberFromElement(element, expirationTime) {
  let type = element.type,
    fiber
  if (typeof type === "string") { // HostComponent
    fiber = createFiber(HostComponent, element.key)
  }
  fiber.type = type
  fiber.expirationTime = expirationTime
  fiber.pendingProps = element.props
  return fiber
}

export function createFiberFromText(textContent, expirationTime) {
  let fiber = createFiber(HostText, null)
  fiber.expirationTime = expirationTime
  fiber.pendingProps = textContent
  return fiber
}

export function createWorkInProgress(current, pendingProps, expirationTime) {
  let workInProgress = current.alternate
  if (workInProgress === null) { // 初次没有alternate
    workInProgress = createFiber(current.tag, current.key)
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    // reset effect
    workInProgress.effectTag = NoEffect
    workInProgress.firstEffect = null
    workInProgress.lastEffect = null
    workInProgress.nextEffect = null
  }

  workInProgress.expirationTime = expirationTime
  workInProgress.updateQueue = current.updateQueue
  workInProgress.child = current.child
  workInProgress.sibling = current.sibling
  workInProgress.index = current.index

  workInProgress.memorizedState = current.memorizedState
  workInProgress.memorizedProps = current.memorizedProps
  workInProgress.pendingProps = current.pendingProps
  return workInProgress
}