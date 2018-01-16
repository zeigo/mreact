/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ClassComponent = exports.ClassComponent = 2;
var HostRoot = exports.HostRoot = 3;
var HostComponent = exports.HostComponent = 5;
var HostText = exports.HostText = 6;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Don't change these two values:
var NoEffect = exports.NoEffect = 0; //           0b00000000
var PerformedWork = exports.PerformedWork = 1; //      0b00000001

// You can change the rest (and add more).
var Placement = exports.Placement = 2; //          0b00000010
var Update = exports.Update = 4; //             0b00000100
var PlacementAndUpdate = exports.PlacementAndUpdate = 6; // 0b00000110
var Deletion = exports.Deletion = 8; //           0b00001000
var ContentReset = exports.ContentReset = 16; //      0b00010000
var Callback = exports.Callback = 32; //          0b00100000
var Err = exports.Err = 64; //               0b01000000
var Ref = exports.Ref = 128; //              0b10000000

// &取交集，|表示并集

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFiber = createFiber;
exports.createFiberFromElement = createFiberFromElement;
exports.createFiberFromText = createFiberFromText;
exports.createWorkInProgress = createWorkInProgress;

var _TypeOfWork = __webpack_require__(0);

var _TypeOfEffect = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fiber = function Fiber(tag, key) {
  _classCallCheck(this, Fiber);

  this.tag = tag; // TypeOfWork
  this.key = key;
  this.type = null; // 组件类，nodeName
  this.stateNode = null; // 组件实例，DOM元素

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.alternate = null;
  this.index = 0;
  this.updateQueue = null;

  this.effectTag = _TypeOfEffect.NoEffect;
  this.firstEffect = null;
  this.lastEffect = null;
  this.nextEffect = null;
  this.expirationTime = _TypeOfWork.NoWork;

  this.memorizedState = null;
  this.pendingProps = null;
  this.memorizedProps = null;
  // 没有pendingState, 从updateQueue得到
};

function createFiber(tag, key) {
  return new Fiber(tag, key);
}

function createFiberFromElement(element, expirationTime) {
  var type = element.type,
      fiber = void 0;
  if (typeof type === "string") {
    // HostComponent
    fiber = createFiber(_TypeOfWork.HostComponent, element.key);
  } else if (typeof type === "function") {
    // ClassComponent
    fiber = createFiber(_TypeOfWork.ClassComponent, element.key);
  }
  fiber.type = type;
  fiber.expirationTime = expirationTime;
  fiber.pendingProps = element.props;
  return fiber;
}

function createFiberFromText(textContent, expirationTime) {
  var fiber = createFiber(_TypeOfWork.HostText, null);
  fiber.expirationTime = expirationTime;
  fiber.pendingProps = textContent;
  return fiber;
}

function createWorkInProgress(current, pendingProps, expirationTime) {
  var workInProgress = current.alternate;
  if (workInProgress === null) {
    // 初次没有alternate
    workInProgress = createFiber(current.tag, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // reset effect
    workInProgress.effectTag = _TypeOfEffect.NoEffect;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
    workInProgress.nextEffect = null;
  }

  workInProgress.expirationTime = expirationTime;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.child = current.child;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  workInProgress.memorizedState = current.memorizedState;
  workInProgress.memorizedProps = current.memorizedProps;
  workInProgress.pendingProps = pendingProps;
  return workInProgress;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var NoWork = exports.NoWork = 0;
var Sync = exports.Sync = 1;

// expirationTime is too too long, maybe change its name later

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createElement;

var _Symbols = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function Element(type, props, key) {
  _classCallCheck(this, Element);

  this.$$typeof = _Symbols.ELEMENT_TYPE;
  this.type = type;
  this.props = props;
  this.key = key;
};

function createElement(type, config, children) {
  var props = {},
      key = null,
      configName = void 0;
  if (config) {
    key = config.key || null;
    for (configName in config) {
      if (config.hasOwnProperty(configName) && configName !== "key") {
        props[configName] = config[configName];
      }
    }
  }
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (configName in defaultProps) {
      if (props[configName] === undefined) {
        props[configName] = defaultProps[configName];
      }
    }
  }
  var childrenLen = arguments.length - 2;
  if (childrenLen === 1) props.children = children;else if (childrenLen > 1) {
    var childArr = [];
    for (var i = 0; i < childrenLen; i++) {
      childArr.push(arguments[i + 2]);
    }
    props.children = childArr;
  }
  return new Element(type, props, key);
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ELEMENT_TYPE = exports.ELEMENT_TYPE = Symbol.for("element");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffProperties = diffProperties;
exports.updateProperties = updateProperties;
function diffProperties(domElement, type, oldProps, newProps) {
  var updatePayload = null;
  // TODO: 表单元素特殊处理props
  var propKey = void 0,
      styleName = void 0,
      styleUpdates = null;

  // 比较oldProps中有而newProps没有的属性, 删除这些
  for (propKey in oldProps) {
    if (!oldProps.hasOwnProperty(propKey) || newProps.hasOwnProperty(propKey)) continue;
    if (propKey === "style") {
      var styles = oldProps[propKey];
      for (styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) continue;
        if (styleUpdates === null) styleUpdates = {};
        styleUpdates[styleName] = ""; // 清除这些style
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  // 新加或更新
  for (propKey in newProps) {
    var newProp = newProps[propKey],
        oldProp = oldProps !== null ? oldProps.propKey : undefined;
    if (!newProps.hasOwnProperty(propKey) || newProps === oldProps) continue;
    if (propKey === "style") {
      if (!oldProp) {
        // 若之前的style为null或没有
        styleUpdates = newProp;
      } else {
        // 重置oldStyle里有，而newStyle没有或newStyle为null
        for (styleName in oldProp) {
          if (oldProp.hasOwnProperty(styleName) && (!newProp || !newProp[styleName])) {
            if (!styleUpdates) styleUpdates = {};
            styleUpdates[styleName] = "";
          }
        }
        // 新建或更新
        for (styleName in newProp) {
          if (newProp.hasOwnProperty(styleName) && newProp[styleName] !== oldProp[styleName]) {
            if (!styleUpdates) styleUpdates = {};
            styleUpdates[styleName] = newProp[styleName];
          }
        }
      }
    } else if (propKey === "children") {
      if (oldProp !== newProp && (typeof newProp === "string" || typeof newProp === "number")) {
        (updatePayload = updatePayload || []).push("children", newProp + "");
      }
    } else {
      // ignore event now
      (updatePayload = updatePayload || []).push(propKey, newProp);
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push("style", styleUpdates);
  }
  return updatePayload; // ["id", "in"]
}

function updateProperties(domElement, updatePayload, tag, oldProps, newProps) {
  if (tag === "input" && newProps.type === "radio") {
    // checked
  }
  updateDOMProperties(domElement, updatePayload);
  // TODO: process input, textarea, select
}

function updateDOMProperties(domElement, updatePayload) {
  for (var i = 0, len = updatePayload.length; i < len; i += 2) {
    var propKey = updatePayload[i],
        propValue = updatePayload[i + 1];
    if (propKey === "style") {
      setValueForStyles(domElement, propValue);
    } else if (propKey === "children") {
      setTextContent(domElement, propValue);
    } else if (propValue !== null) {
      setValueForProperty(domElement, propKey, propValue);
    } else {
      deleteValueForProperty(domElement, propKey);
    }
  }
}

function setTextContent(domElement, newText) {
  var first = domElement.firstChild;
  if (first && first === domElement.lastChild) {
    first.nodeValue = newText;
    return;
  }
  domElement.textContent = newText;
}

function setValueForStyles(domElement, styles) {
  var style = domElement.style;
  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) continue;
    if (styleName === "float") styleName === "cssFloat";
    // TODO: custom property
    style[styleName] = styles[styleName];
  }
}

// property vs attribute
function setValueForProperty(domElement, key, value) {}

function setValueForAttribute(domElement, key, value) {
  if (value === null) {
    domElement.removeAttribute(key);
  } else {
    domElement.setAttribute(key, value + "");
  }
}

function deleteValueForProperty(domElement, key) {
  // ...
  domElement.removeAttribute(key);
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Element = __webpack_require__(4);

var _Element2 = _interopRequireDefault(_Element);

var _render = __webpack_require__(8);

var _render2 = _interopRequireDefault(_render);

var _App = __webpack_require__(14);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = (0, _Element2.default)(
  "div",
  null,
  (0, _Element2.default)(
    "p",
    { style: { color: "red" } },
    "hello world"
  ),
  "asdf",
  (0, _Element2.default)(
    "h1",
    null,
    "second"
  )
);

var b = (0, _Element2.default)(
  "div",
  null,
  (0, _Element2.default)(
    "p",
    { style: { color: "blue", border: "1px solid" } },
    "hi"
  ),
  "zxcv"
);
var ctn = document.getElementById("app");
(0, _render2.default)((0, _Element2.default)(
  "div",
  null,
  (0, _Element2.default)(
    "p",
    null,
    "hello world"
  ),
  (0, _Element2.default)(_App2.default, null)
), ctn);

var btn = document.createElement("button");
btn.innerHTML = "click to change";
btn.onclick = function () {
  (0, _render2.default)(b, ctn);
};
document.body.appendChild(btn);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _Fiber = __webpack_require__(2);

var _TypeOfWork = __webpack_require__(0);

var _ExpirationTime = __webpack_require__(3);

var _FiberScheduler = __webpack_require__(9);

// TODO: callback
function render(element, container) {
  var hostRoot = void 0;
  if (hostRoot = container._rootContainer) {
    // 已挂载
    updateContainer(element, hostRoot);
  } else {
    hostRoot = createContainer(container);
    container._rootContainer = hostRoot;
    // TODO: unbatchUpdates
    updateContainer(element, hostRoot);
  }
}

function createContainer(container) {
  var fiber = (0, _Fiber.createFiber)(_TypeOfWork.HostRoot, null);
  var root = {
    containerInfo: container,
    current: fiber,
    nextScheduledRoot: null,
    remainingExpirationTime: _ExpirationTime.NoWork,
    finishedWork: null,
    isReadyForCommit: false
    // TODO: Addtional properties
  };
  fiber.stateNode = root;
  return root;
}

function updateContainer(element, container) {
  var fiber = container.current;
  // TODO: get context
  scheduleTopLevelUpdate(fiber, element);
}

function scheduleTopLevelUpdate(fiber, element) {
  var expirationTime = (0, _FiberScheduler.computeExpirationForFiber)(fiber);
  var update = {
    expirationTime: expirationTime,
    partialState: { element: element },
    next: null
  };
  insertUpdateIntoFiber(fiber, update);
  (0, _FiberScheduler.scheduleWork)(fiber, expirationTime);
}

function insertUpdateIntoFiber(fiber, update) {
  var alternate = fiber.alternate,
      queue1 = fiber.updateQueue;
  if (queue1 === null) {
    queue1 = fiber.updateQueue = createUpdateQueue();
  }
  insertUpdateIntoQueue(update, queue1);
}

function createUpdateQueue() {
  return {
    baseState: null,
    first: null,
    last: null,
    expirationTime: _ExpirationTime.NoWork,
    isInitialized: false
  };
}

function insertUpdateIntoQueue(update, queue) {
  if (queue.last === null) {
    queue.first = queue.last = update;
  } else {
    // update放到queue最后
    queue.last.next = update;
    queue.last = update;
  }
  if (queue.expirationTime == _ExpirationTime.NoWork || queue.expirationTime > update.expirationTime) {
    queue.expirationTime = update.expirationTime;
  } // queue的expirationTime与最小的update保持一致
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeExpirationForFiber = computeExpirationForFiber;
exports.scheduleWork = scheduleWork;

var _ExpirationTime = __webpack_require__(3);

var _TypeOfEffect = __webpack_require__(1);

var _Fiber = __webpack_require__(2);

var _FiberBeginWork = __webpack_require__(10);

var _FiberBeginWork2 = _interopRequireDefault(_FiberBeginWork);

var _FiberCompleteWork = __webpack_require__(12);

var _FiberCommitWork = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function now() {
  return Date.now(); // performance.now()
}

function recalculteCurrentTime() {
  var ms = now() - startTime;
}
// 处理页面多个HostRoot的情况！！
var lastScheduledRoot = null,
    firstScheduledRoot = null;

var isRendering = false,
    isWorking = false,
    isCommiting = false,
    isUnmounting = false;

var nextFlushedRoot = null,
    nextFlushedExpirationTime = _ExpirationTime.NoWork,
    nextRoot = null,
    nextRenderExpirationTime = _ExpirationTime.NoWork,
    nextUnitOfWork = null;

var deadline = null,
    deadlineDidExpire = false,
    startTime = now(),
    mostRecentCurrentTime = void 0;

var nextEffect = null;

var useSyncScheduling = true; // 默认同步渲染

function computeExpirationForFiber(fiber) {
  var expirationTime;
  if (isWorking) {
    if (isCommiting) {
      expirationTime = _ExpirationTime.Sync;
    } else {
      expirationTime = nextRenderExpirationTime;
    }
  } else {
    if (useSyncScheduling) {
      expirationTime = _ExpirationTime.Sync;
    } else {
      // computeAsyncExpiration
    }
  }
  return expirationTime;
}

function scheduleWork(fiber, expirationTime) {
  var node = fiber;
  while (node !== null) {
    if (node.expirationTime === _ExpirationTime.NoWork || node.expirationTime > expirationTime) {
      node.expirationTime = expirationTime;
    }
    var alternate = node.alternate;
    if (alternate !== null) {
      if (alternate.expirationTime === _ExpirationTime.NoWork || alternate.expirationTime > expirationTime) {
        alternate.expirationTime = expirationTime;
      }
    }
    if (node.return === null) {
      var root = node.stateNode;
      requestWork(root, expirationTime);
    }
    node = node.return;
  }
}

// 每次有update都会冒泡到root再requestWork, 之后决定什么时候renderRoot
// ?? 是否有方法只更新触发的部分
function requestWork(root, expirationTime) {
  // 检查root是否在schedule中
  if (root.nextScheduledRoot === null) {
    // 不在时添加
    root.remainingExpirationTime = expirationTime;
    if (lastScheduledRoot === null) {
      root.nextScheduledRoot = root;
      firstScheduledRoot = lastScheduledRoot = root;
    } else {
      lastScheduledRoot.nextScheduledRoot = root;
      lastScheduledRoot = root;
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot; // ?
    }
  } else {
    // 在时判断是否增加优先级
    var remainingExpirationTime = root.remainingExpirationTime;
    if (remainingExpirationTime === _ExpirationTime.NoWork || remainingExpirationTime > expirationTime) {
      root.remainingExpirationTime = expirationTime;
    }
  }

  if (isRendering) return;

  if (expirationTime === _ExpirationTime.Sync) {
    performWork(_ExpirationTime.Sync, null);
  } else {
    // requestIdleCallback
    // scheduleCallbackWithExpiration(expirationTime)
  }
}

function performWork(minExpirationTime, dl) {
  deadline = dl;

  findHighestPriorityRoot();

  while (nextFlushedRoot !== null && nextFlushedExpirationTime !== _ExpirationTime.NoWork) {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
    findHighestPriorityRoot();
  }
  deadline = null;
}

// 找到root list里面优先级最高的赋值给nextFlushedRoot, nextFlushedExpirationTime
// 以下只考虑单一HostRoot
function findHighestPriorityRoot() {
  var hpRoot = null,
      hpWork = _ExpirationTime.NoWork;
  // throw new Error()
  if (lastScheduledRoot !== null) {
    var root = firstScheduledRoot;
    while (root !== null) {
      var remainingExpirationTime = root.remainingExpirationTime;
      if (remainingExpirationTime === _ExpirationTime.NoWork) {
        // this root no longer need work, remove it from scheduler
        if (root === root.nextScheduledRoot) {
          // 单HostRoot容器，目前只考虑这一种以简化
          root.nextScheduledRoot = null;
          firstScheduledRoot = lastScheduledRoot = null;
          break;
        }
      } else {
        if (hpWork === _ExpirationTime.NoWork || hpWork > remainingExpirationTime) {
          hpRoot = root;
          hpWork = remainingExpirationTime;
        }
        if (root === lastScheduledRoot) break; // 单HostRoot不用再找
        root = root.nextScheduledRoot;
      }
    }
  }

  nextFlushedExpirationTime = hpWork;
  nextFlushedRoot = hpRoot;
}

function performWorkOnRoot(root, expirationTime) {
  isRendering = true;

  if (true) {
    // flush sync work, expirationTime < recalculateCurrentTime()
    var finishedWork = root.finishedWork;
    if (finishedWork !== null) {
      // 已完成，进行commit; render和commit之间可能中断
      root.finishedWork = null;
      root.remainingExpirationTime = commitRoot(finishedWork);
    } else {
      finishedWork = renderRoot(root, expirationTime);
      if (finishedWork !== null) {
        root.remainingExpirationTime = commitRoot(finishedWork);
      }
    }
  }

  isRendering = false;
}

function renderRoot(root, expirationTime) {
  isWorking = true;
  root.isReadyForCommit = false;

  if (root !== nextRoot || expirationTime !== nextRenderExpirationTime || nextUnitOfWork === null) {
    nextRoot = root;
    nextRenderExpirationTime = expirationTime;
    nextUnitOfWork = (0, _Fiber.createWorkInProgress)(root.current, null, nextRenderExpirationTime);
  }
  // invokeGuardedCallback
  workLoop(expirationTime);

  return root.isReadyForCommit ? root.current.alternate : null;
}

function workLoop(expirationTime) {
  if (nextRenderExpirationTime === _ExpirationTime.NoWork || nextRenderExpirationTime > expirationTime) return;
  // count expire and comfirm shouldYield
  while (nextUnitOfWork !== null) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
}

// perform分为begin/complete两步
// begin 通过对比修改fiber 树，确定Placement, Deletion
// complete 新建/更新实例，确定Update
function performUnitOfWork(workInProgress) {
  var current = workInProgress.alternate;
  var next = (0, _FiberBeginWork2.default)(current, workInProgress, nextRenderExpirationTime);
  if (next === null) {
    // 到达叶节点，没有子节点或者只有text
    next = (0, _FiberCompleteWork.completeUnitOfWork)(workInProgress);
  }
  return next;
}

// 遍历两次
function commitRoot(finishedWork) {
  isWorking = true;
  isCommiting = true;
  var root = finishedWork.stateNode;
  root.isReadyForCommit = false;

  var firstEffect = void 0;
  if (finishedWork.effectTag > _TypeOfEffect.PerformedWork) {
    // root上有side effect
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    firstEffect = finishedWork.firstEffect;
  }

  nextEffect = firstEffect;

  while (nextEffect !== null) {
    commitAllHostEffects();
  }

  root.current = finishedWork;
  nextEffect = firstEffect;
  while (nextEffect !== null) {
    commitAllLifeCycles();
  }
  isWorking = false;
  isCommiting = false;
  root.isReadyForCommit = false;
  return root.current.expirationTime;
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag,
        primaryEffectTag = effectTag & (_TypeOfEffect.Placement | _TypeOfEffect.Update | _TypeOfEffect.Deletion);
    switch (primaryEffectTag) {
      case _TypeOfEffect.Deletion:
        {
          isUnmounting = true;
          (0, _FiberCommitWork.commitDeletion)(nextEffect);
          isUnmounting = false;
          break;
        }
      case _TypeOfEffect.Update:
        {
          (0, _FiberCommitWork.commitWork)(nextEffect.alternate, nextEffect);
          break;
        }
      case _TypeOfEffect.Placement:
        {
          (0, _FiberCommitWork.commitPlacement)(nextEffect);
          nextEffect.effectTag &= ~_TypeOfEffect.Placement;
          break;
        }
    }
    nextEffect = nextEffect.nextEffect;
  }
}

// componentDidMount
function commitAllLifeCycles() {
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag;

    if (effectTag & (_TypeOfEffect.Update | _TypeOfEffect.Callback)) {
      (0, _FiberCommitWork.commitLifeCycles)(nextEffect.alternate, nextEffect);
    }

    var next = nextEffect.nextEffect;
    nextEffect.nextEffect = null;
    nextEffect = next;
  }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beginWork;

var _TypeOfWork = __webpack_require__(0);

var _FiberReconciler = __webpack_require__(11);

var _FiberReconciler2 = _interopRequireDefault(_FiberReconciler);

var _Fiber = __webpack_require__(2);

var _ExpirationTime = __webpack_require__(3);

var _TypeOfEffect = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 控制入口，根据fiber的tag确定处理方式，返回下次work的对象
function beginWork(current, workInProgress, renderExpirationTime) {
  // 低优先级可以不处理
  if (workInProgress.expirationTime === _ExpirationTime.NoWork || workInProgress.expirationTime > renderExpirationTime) return null;
  switch (workInProgress.tag) {
    case _TypeOfWork.HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
    // dont support classComponet firstly
    // case ClassComponent:
    //   return updateClassComponent(current, workInProgress, renderExpirationTime)
    case _TypeOfWork.HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
    case _TypeOfWork.HostText:
      return updateHostText(current, workInProgress);
    case _TypeOfWork.ClassComponent:
      return updateClassComponent(current, workInProgress, renderExpirationTime);
    default:
      throw Error("not valid tag of fiber");
  }
}

// need prevProps, prevState later for partialState which is function
function processUpdateQueue(current, workInProgress, queue) {
  // workInProgress的queue是由current直接赋值来的，这里复制一份 why?
  if (current !== null && current.queue === queue) {
    var currentQueue = queue;
    queue = workInProgress.updateQueue = {
      first: currentQueue.first,
      last: currentQueue.last,
      isInitialized: currentQueue.isInitialized,
      baseState: currentQueue.baseState
    };
  }
  // initialize state
  var state = void 0;
  if (queue.isInitialized) {
    state = queue.baseState;
  } else {
    state = queue.baseState = workInProgress.memorizedState;
    queue.isInitialized = true;
  }
  var update = queue.first,
      dontMutatePrevState = true;
  while (update !== null) {
    // TODO: skip low priority
    var partialState = getStateFromState(update);
    if (partialState) {
      if (dontMutatePrevState) {
        // 确保是新的state
        state = Object.assign({}, state, partialState);
      } else {
        state = Object.assign(state, partialState);
      }
      dontMutatePrevState = false;
    }
    update = update.next;
  }
  workInProgress.updateQueue = null;
  // TODO: add callback list
  return state;
}

function getStateFromState(update) {
  var partialState = update.partialState;
  if (typeof partialState === "function") {
    // TODO
  }
  return partialState;
}

// 根据updateQueue确定后续步骤
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  var updateQueue = workInProgress.updateQueue,
      prevState = workInProgress.memorizedState;
  if (updateQueue !== null) {
    var state = processUpdateQueue(current, workInProgress, updateQueue);
    var element = state.element;
    // 对比后更改workInProgress.child
    (0, _FiberReconciler2.default)(current, workInProgress, element);
  } else {
    cloneChildFibers(current, workInProgress);
  }
  return workInProgress.child;
}

function cloneChildFibers(current, workInProgress) {
  var currentChild = workInProgress.child;
  if (currentChild === null) return;
  var newChild = (0, _Fiber.createWorkInProgress)(currentChild, currentChild.pendingProps, currentChild.expirationTime);
  newChild.return = workInProgress;
  workInProgress.child = newChild;

  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = (0, _Fiber.createWorkInProgress)(currentChild, currentChild.pendingProps, currentChild.expirationTime);
    newChild.return = workInProgress;
  }
  newChild.sibling = null;
}

function updateClassComponent(current, workInProgress, renderExpirationTime) {
  var shouldUpdate;
  if (current === null) {
    // 组件实例化
    constructClassInstance(workInProgress, workInProgress.pendingProps);
    mountClassInstance(workInProgress, renderExpirationTime);
    shouldUpdate = true;
  } else {
    shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime);
  }

  return finishClassComponent(current, workInProgress, shouldUpdate);
}

function constructClassInstance(workInProgress, props) {
  var ctor = workInProgress.type,
      instance = new ctor(props);
  workInProgress.stateNode = instance;
  instance._internalFiber = workInProgress;
  // 插入updater
  return instance;
}

function mountClassInstance(workInProgress, expirationTime) {
  var current = workInProgress.alternate,
      instance = workInProgress.stateNode,
      state = instance.state || null;
  instance.state = workInProgress.memoizedState = state; // 防止undefined
  if (typeof instance.componentWillMount === "function") {
    instance.componentWillMount();
    // enqueueReplaceState
    var queue = workInProgress.updateQueue;
    if (queue !== null) {
      instance.state = processUpdateQueue(current, workInProgress, updateQueue);
    }
  }
  if (typeof instance.componentDidMount === "function") {
    workInProgress.effectTag |= _TypeOfEffect.Update;
  }
}

// life-cycles
function updateClassInstance(current, workInProgress, renderExpirationTime) {
  var instance = workInProgress.stateNode,
      oldProps = workInProgress.memorizedProps,
      newProps = workInProgress.pendingProps;
  if (newProps === null) {
    newProps = oldProps;
  }

  // componentWillReceiveProps
  if (typeof instance.componentWillReceiveProps === "function" && newProps !== oldProps) {
    instance.componentWillReceiveProps(newProps);
  }

  var oldState = workInProgress.memorizedState,
      newState = oldState;
  if (workInProgress.updateQueue !== null) {
    newState = processUpdateQueue(current, workInProgress, workInProgress.updateQueue);
  }
  // shouldComponentUpdate
  var shouldUpdate = checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState);
  if (shouldUpdate) {
    // componentWillUpdate
    if (typeof instance.componentWillUpdate === "function") {
      instance.componentWillUpdate(newProps, newState);
    }
    if (typeof instance.componentDidUpdate === "function") {
      workInProgress.effectTag |= _TypeOfEffect.Update;
    }
  } else {
    if (typeof instance.componentDidUpdate === 'function') {
      if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.effectTag |= _TypeOfEffect.Update;
      }
    }
    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  }

  instance.props = newProps;
  instance.state = newState;
  return shouldUpdate;
}

function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState) {
  var instance = workInProgress.stateNode;
  var shouldUpdate = void 0;
  if (typeof instance.shouldComponentUpdate === "function") {
    shouldUpdate = instance.shouldComponentUpdate(newProps, newState);
    return shouldUpdate;
  }
  // pureComponent, shallowEqual
  return true;
}

function finishClassComponent(current, workInProgress, shouldUpdate) {
  if (!shouldUpdate) {
    cloneChildFibers(current, workInProgress);
    return workInProgress.child;
  }
  var instance = workInProgress.stateNode,
      nextChildren = instance.render();
  workInProgress.effectTag |= _TypeOfEffect.PerformedWork;
  (0, _FiberReconciler2.default)(current, workInProgress, nextChildren);
  workInProgress.memorizedProps = instance.props;
  workInProgress.memorizedState = instance.state;
  return workInProgress.child;
}

// 根据pendingProps, memorizedProps
function updateHostComponent(current, workInProgress, renderExpirationTime) {
  var oldProps = workInProgress.memorizedProps,
      newProps = workInProgress.pendingProps;
  if (newProps === null) newProps = oldProps;
  if (newProps === null || newProps === oldProps) {
    cloneChildFibers(current, workInProgress);
    return workInProgress.child;
  }
  var nextChildren = newProps.children;
  if (typeof nextChildren === "string") {
    nextChildren = null;
  } // 子节点只有textNode，不往下再比较
  (0, _FiberReconciler2.default)(current, workInProgress, nextChildren);
  workInProgress.memorizedProps = newProps;
  return workInProgress.child;
}

function updateHostText(current, workInProgress) {
  var oldProps = workInProgress.memorizedProps,
      newProps = workInProgress.pendingProps;
  if (newProps === null) newProps = oldProps;
  workInProgress.memorizedProps = newProps;
  return null;
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = reconcileChildren;

var _Fiber = __webpack_require__(2);

var _TypeOfEffect = __webpack_require__(1);

var _Symbols = __webpack_require__(5);

var _TypeOfWork = __webpack_require__(0);

function reconcileChildren(current, workInProgress, nextChildren) {
  var expirationTime = workInProgress.expirationTime,
      currentFirstChild = null;
  if (current !== null) currentFirstChild = current.child;
  // 简化，先不将current === null即初次单独考虑
  // if (current === null) {
  //   workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, expirationTime)
  // }
  workInProgress.child = reconcileChildFibers(workInProgress, currentFirstChild, nextChildren, expirationTime);
}

// tag children with the side-effect
function reconcileChildFibers(returnFiber, currentFirstChild, newChildren, expirationTime) {
  if ((typeof newChildren === "undefined" ? "undefined" : _typeof(newChildren)) === "object" && newChildren !== null) {
    switch (newChildren.$$typeof) {
      case _Symbols.ELEMENT_TYPE:
        return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChildren, expirationTime));
    }
  }
  if (Array.isArray(newChildren)) {
    // children为数组
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime);
  }

  // newChildren: null/undefined
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}

// 对比单个element
function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
  var child = currentFirstChild,
      key = element.key;
  while (child !== null) {
    if (key === child.key) {
      if (child.type === element.type) {
        deleteRemainingChildren(returnFiber, child.sibling);
        var existing = useFiber(child, element.props, expirationTime);
        existing.return = returnFiber;
        return existing;
      } else {
        deleteRemainingChildren(returnFiber, child);
        break;
      }
    } else {
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }
  var elementFiber = (0, _Fiber.createFiberFromElement)(element, expirationTime);
  elementFiber.return = returnFiber;
  return elementFiber;
}

function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
  var oldFiber = currentFirstChild,
      lastPlacedIndex = 0,
      newIndex = 0,
      prevNewFiber = null,
      resultFirstChild = null; // 新的first child

  // 依次同时遍历old和new，key匹配时（包括两个null）才继续
  for (; oldFiber !== null && newIndex < newChildren.length; newIndex++) {
    var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIndex], expirationTime);
    // key不匹配时返回null
    if (newFiber === null) {
      break;
    }
    if (oldFiber && newFiber.alternate === null) {
      deleteChild(returnFiber, oldFiber);
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex);
    if (prevNewFiber === null) {
      resultFirstChild = newFiber;
    } else {
      prevNewFiber.sibling = newFiber;
    }
    prevNewFiber = newFiber;
    oldFiber = oldFiber.sibling;
  }

  if (newIndex === newChildren.length) {
    // newChildren到末尾
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultFirstChild;
  }

  if (oldFiber === null) {
    // oldFiber先到末尾，剩下的newChild全部插入
    for (; newIndex < newChildren.length; newIndex++) {
      var _newFiber = createChild(returnFiber, newChildren[newIndex], expirationTime);
      if (!_newFiber) {
        continue;
      }
      lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIndex);
      if (prevNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultFirstChild = _newFiber;
      } else {
        prevNewFiber.sibling = _newFiber;
      }
      prevNewFiber = _newFiber;
    }
    return resultFirstChild;
  }

  // 若因为key不匹配而提前退出遍历，根据key或index建立原来子节点的map
  var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
  for (; newIndex < newChildren.length; newIndex++) {
    var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIndex, newChildren[newIndex], expirationTime);
    if (_newFiber2) {
      // 若复用之前map中的fiber，从map中删去
      if (_newFiber2.alternate !== null) {
        existingChildren.delete(_newFiber2.key || newIndex);
      }
      lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIndex);
      if (prevNewFiber === null) {
        resultFirstChild = _newFiber2;
      } else {
        prevNewFiber.sibling = _newFiber2;
      }
      prevNewFiber = _newFiber2;
    }
  }
  // map剩下的都是不需要的，删除
  existingChildren.forEach(function (child) {
    deleteChild(returnFiber, child);
  });
}

// type相同，则复用fiber；type不同，新建fiber。更新pendingProps为element.props
function updateElement(returnFiber, current, element, expirationTime) {
  if (current !== null && current.type === element.type) {
    var existing = useFiber(current, element.props, expirationTime);
    existing.return = returnFiber;
    return existing;
  } else {
    var created = (0, _Fiber.createFiberFromElement)(element, expirationTime);
    created.return = returnFiber;
    return created;
  }
}

function updateTextNode(returnFiber, oldFiber, newText, expirationTime) {
  if (oldFiber === null || oldFiber.tag !== _TypeOfWork.HostText) {
    // Insert
    var created = (0, _Fiber.createFiberFromText)(newText, expirationTime);
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
  var key = oldFiber !== null ? oldFiber.key : null;
  if (typeof newChild === "string" || typeof newChild === "number") {
    if (key !== null) return null; // 若新节点为text而原节点有key，自然不匹配
    return updateTextNode(returnFiber, oldFiber, "" + newChild, expirationTime);
  }

  if ((typeof newChild === "undefined" ? "undefined" : _typeof(newChild)) === "object" && newChild !== null) {
    switch (newChild.$$typeof) {
      case _Symbols.ELEMENT_TYPE:
        {
          if (newChild.key === key) return updateElement(returnFiber, oldFiber, newChild, expirationTime);else return null;
        }
    }
  }
}

function mapRemainingChildren(returnFiber, currentFirstChild) {
  var remain = new Map(),
      child = currentFirstChild;
  while (child !== null) {
    if (child.key === null) {
      remain.set(child.index, child);
    } else {
      remain.set(child.key, child);
    }
  }
  return remain;
}

function updateFromMap(remain, returnFiber, newIndex, newChild, expirationTime) {
  if (typeof newChild === "string" || typeof newChild === "number") {
    var matched = remain.get(newIndex) || null;
    return updateTextNode(returnFiber, matched, "" + newChild, expirationTime);
  }

  if ((typeof newChild === "undefined" ? "undefined" : _typeof(newChild)) === "object" && newChild !== null) {
    switch (newChild.$$typeof) {
      case _Symbols.ELEMENT_TYPE:
        {
          var _matched = remain.get(newChild.key || newIndex) || null;
          return updateElement(returnFiber, _matched, newChild, expirationTime);
        }
    }
  }
}

function createChild(returnFiber, newChild, expirationTime) {
  if (typeof newChild === "string" || typeof newChild === "number") {
    var created = (0, _Fiber.createFiberFromText)(newChild + "", expirationTime);
    created.return = returnFiber;
    return created;
  }
  if ((typeof newChild === "undefined" ? "undefined" : _typeof(newChild)) === "object" && newChild !== null) {
    switch (newChild.$$typeof) {
      case _Symbols.ELEMENT_TYPE:
        {
          var created = (0, _Fiber.createFiberFromElement)(newChild, expirationTime);
          created.return = returnFiber;
          return created;
        }
    }
  }
}

function placeChild(newFiber, lastPlacedIndex, newIndex) {
  newFiber.index = newIndex;
  var current = newFiber.alternate;
  if (current !== null) {
    // type不变
    var oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // This is a move.
      newFiber.effectTag = _TypeOfEffect.Placement;
      return lastPlacedIndex;
    } else {
      // dont need to move
      return oldIndex;
    }
  } else {
    newFiber.effectTag = _TypeOfEffect.Placement;
    return lastPlacedIndex;
  }
}

// 插入新child时，effectTag设为Placement
function placeSingleChild(newFiber) {
  if (newFiber.alternate === null) newFiber.effectTag |= _TypeOfEffect.Placement;
  return newFiber;
}

// clone fiber, alternate为原始fiber
function useFiber(fiber, pendingProps, expirationTime) {
  var clone = (0, _Fiber.createWorkInProgress)(fiber, pendingProps, expirationTime);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

// 要删除的加到return的effect list里
function deleteChild(returnFiber, childToDelete) {
  var last = returnFiber.lastEffect;
  if (last === null) {
    returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
  } else {
    last.nextEffect = childToDelete;
    returnFiber.lastEffect = childToDelete;
  }
  childToDelete.nextEffect = null;
  childToDelete.effectTag = _TypeOfEffect.Deletion;
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  var childToDelete = currentFirstChild;
  while (childToDelete !== null) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
  return null;
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completeUnitOfWork = completeUnitOfWork;

var _TypeOfWork = __webpack_require__(0);

var _TypeOfEffect = __webpack_require__(1);

var _ExpirationTime = __webpack_require__(3);

var _Property = __webpack_require__(6);

// 当还有sibling时，不返回null，对sibling performUnitOfWork
function completeUnitOfWork(workInProgress) {
  while (true) {
    var current = workInProgress.alternate;
    var next = completeWork(current, workInProgress);
    if (next !== null) return next; // if spawn new work
    var returnFiber = workInProgress.return,
        siblingFiber = workInProgress.sibling;

    resetExpirationTime(workInProgress);

    if (returnFiber !== null) {
      // return fiber接上workinprogress的effect list
      if (workInProgress.lastEffect === null) {
        // empty, Noop
      } else {
        if (returnFiber.lastEffect !== null) {
          returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
        } else {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        returnFiber.lastEffect = workInProgress.lastEffect;
      }
      // 是否workInProgress firstEffect, lastEffect设null

      // 如果workInProgress有side-effect，插入到returnFiber effect list最后
      if (workInProgress.effectTag > _TypeOfEffect.PerformedWork) {
        if (returnFiber.lastEffect === null) {
          // empty
          returnFiber.firstEffect = workInProgress;
        } else {
          returnFiber.lastEffect.nextEffect = workInProgress;
        }
        returnFiber.lastEffect = workInProgress;
      }
    }
    if (siblingFiber !== null) {
      return siblingFiber;
    } else if (returnFiber !== null) {
      workInProgress = returnFiber;
      continue;
    } else {
      workInProgress.stateNode.isReadyForCommit = true;
      return null;
    }
  }
}

function resetExpirationTime(workInProgress) {
  var newExpirationTime = getUpdateExpirationTime(workInProgress);
  var child = workInProgress.child;
  while (child !== null) {
    if (child.expirationTime !== _ExpirationTime.NoWork && (newExpirationTime === _ExpirationTime.NoWork || newExpirationTime > child.expirationTime)) {
      newExpirationTime = child.expirationTime;
    }
    child = child.sibling;
  }
  workInProgress.expirationTime = newExpirationTime;
}

function getUpdateExpirationTime(fiber) {
  if (fiber.tag !== _TypeOfWork.ClassComponent && fiber.tag !== _TypeOfWork.HostRoot) {
    return _ExpirationTime.NoWork;
  }
  var updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    return _ExpirationTime.NoWork;
  }
  return updateQueue.expirationTime;
}

// 更新/创建实例到stateNode，设置effectTag等
function completeWork(current, workInProgress) {
  var newProps = workInProgress.pendingProps;
  if (newProps === null) {
    newProps = workInProgress.memorizedProps;
  } else {
    workInProgress.pendingProps = null;
  }
  var oldProps = current !== null ? current.memorizedProps : null;
  switch (workInProgress.tag) {
    case _TypeOfWork.ClassComponent:
      {
        return null;
      }
    case _TypeOfWork.HostComponent:
      {
        var type = workInProgress.type;
        if (current !== null && workInProgress.stateNode !== null) {
          // update
          var instance = workInProgress.stateNode;
          var updatePayload = prepareUpdate(instance, type, oldProps, newProps);
          updateHostComponent(workInProgress, updatePayload);
        } else {
          var _instance = createInstance(type, newProps, workInProgress);
          appendAllChildren(_instance, workInProgress);
          finalizeInitialChildren(type, _instance, newProps);
          workInProgress.stateNode = _instance;
        }
        return null;
      }
    case _TypeOfWork.HostText:
      {
        var newText = newProps;
        if (current !== null && workInProgress.stateNode !== null) {
          var oldText = current.memorizedProps;
          updateHostText(workInProgress, oldText, newText);
        } else {
          var textInstance = createTextInstance(newText, workInProgress);
          workInProgress.stateNode = textInstance;
        }
        return null;
      }
    case _TypeOfWork.HostRoot:
      {
        return null;
      }
  }
}

function prepareUpdate(domElement, type, oldProps, newProps) {
  return (0, _Property.diffProperties)(domElement, type, oldProps, newProps);
}

function updateHostText(workInProgress, oldText, newText) {
  if (oldText !== newText) {
    workInProgress.effectTag |= _TypeOfEffect.Update;
  }
}

function updateHostComponent(workInProgress, updatePayload) {
  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    workInProgress.effectTag |= _TypeOfEffect.Update;
  }
}

function createInstance(tag, props, fiber) {
  var domElement = document.createElement(tag); // omit some details
  domElement._internalInstance = fiber;
  domElement._eventHandler = props;
  return domElement;
}

function createTextInstance(text, fiber) {
  var domElement = document.createTextNode(text); // omit some details
  domElement._internalInstance = fiber;
  return domElement;
}

function appendAllChildren(domElement, workInProgress) {
  var node = workInProgress.child;
  while (node !== null) {
    if (node.tag === _TypeOfWork.HostComponent || node.tag === _TypeOfWork.HostText) {
      domElement.appendChild(node.stateNode);
    }
    node = node.sibling;
  }
}

function finalizeInitialChildren(tag, domElement, props) {
  setInitialDOMProperties(tag, domElement, props);
}

// 设置DOM元素的属性
function setInitialDOMProperties(tag, domElement, props) {
  for (var propKey in props) {
    if (!props.hasOwnProperty(propKey)) continue;
    var prop = props[propKey];
    switch (propKey) {
      case "style":
        {
          var style = domElement.style;
          for (var styleName in prop) {
            if (!prop.hasOwnProperty(styleName)) continue;
            if (styleName === "float") styleName = "cssFloat";
            style[styleName] = prop[styleName];
          }
          break;
        }
      case "children":
        {
          // children只有text
          if (typeof prop === "string" || typeof prop === "number") {
            domElement.innerHTML = "" + prop; // textContent
          }
        }
    }
  }
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commitPlacement = commitPlacement;
exports.commitWork = commitWork;
exports.commitDeletion = commitDeletion;
exports.commitLifeCycles = commitLifeCycles;

var _TypeOfEffect = __webpack_require__(1);

var _TypeOfWork = __webpack_require__(0);

var _Property = __webpack_require__(6);

function getHostParentFiber(fiber) {
  var parent = fiber.return;
  while (parent !== null) {
    if (parent.tag === _TypeOfWork.HostComponent || parent.tag === _TypeOfWork.HostRoot) break;
    parent = parent.return;
  }
  return parent;
}

function isHostParent(fiber) {
  var tag = fiber.tag;
  return tag === _TypeOfWork.HostComponent || tag === _TypeOfWork.HostRoot;
}

// 寻找不为Placement的sibling作为insertBefore的参照
// 如果没有则返回null，之后直接appendChild
function getHostSibling(fiber) {
  var node = fiber;
  sibling: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(fiber)) {
        return null;
      }
      node = node.return;
    }
    node = node.sibling;
    // 如果碰到ClassComponent，在child中继续寻找
    while (node.tag !== _TypeOfWork.HostComponent && node.tag !== _TypeOfWork.HostText) {
      if (node.effectTag & _TypeOfEffect.Placement) {
        continue sibling;
      }
      node = node.child;
    }
    if (!node.effectTag & _TypeOfEffect.Placement) {
      return node.stateNode;
    }
  }
}

function commitPlacement(fiber) {
  var parentFiber = getHostParentFiber(fiber),
      parent = void 0;
  if (parentFiber.tag === _TypeOfWork.HostComponent) parent = parentFiber.stateNode;else if (parentFiber.tag === _TypeOfWork.HostRoot) parent = parentFiber.stateNode.containerInfo;
  var before = getHostSibling(fiber),
      node = fiber;
  while (true) {
    if (node.tag === _TypeOfWork.HostComponent || node.tag === _TypeOfWork.HostText) {
      if (before) {
        parent.insertBefore(fiber.stateNode, before);
      } else {
        parent.appendChild(fiber.stateNode);
      }
    } else {
      // TODO: ClassComponent
    }
    if (node === fiber) return;
  }
}

function commitWork(current, fiber) {
  switch (fiber.tag) {
    case _TypeOfWork.HostComponent:
      {
        var updatePayload = fiber.updateQueue,
            instance = fiber.stateNode,
            newProps = fiber.memorizedProps,
            oldProps = current !== null ? current.memorizedProps : null;
        fiber.updateQueue = null;
        if (updatePayload) {
          commitUpdate(instance, updatePayload, fiber.type, oldProps, newProps);
        }
        return;
      }
    case _TypeOfWork.HostText:
      {
        var textInstance = fiber.stateNode,
            newText = fiber.memorizedProps;
        commitTextUpdate(textInstance, newText);
        return;
      }
  }
}

function commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
  domElement._eventHandler = newProps;
  (0, _Property.updateProperties)(domElement, updatePayload, type, oldProps, newProps);
}

function commitTextUpdate(textInstance, newText) {
  textInstance.nodeValue = newText;
}

// 从host父节点上删除
function commitDeletion(fiber) {
  unmountHostComponent(fiber);
  // detachFiber
  fiber.return = null;
  fiber.child = null;
}

function unmountHostComponent(fiber) {
  var node = fiber,
      parentFiber = getHostParentFiber(fiber),
      parent,
      tag;
  if (parentFiber.tag === _TypeOfWork.HostComponent) parent = parentFiber.stateNode;else if (parentFiber.tag === _TypeOfWork.HostRoot) parent = parentFiber.stateNode.containerInfo;

  while (true) {
    tag = node.tag;
    if (tag === _TypeOfWork.HostComponent || tag === _TypeOfWork.HostText) {
      parent.removeChild(node.stateNode);
      unmountChildren(node);
    } else if (tag === _TypeOfWork.ClassComponent) {
      var instance = node.stateNode;
      if (typeof instance.componentWillUnmount === "function") {
        instance.componentWillUnmount();
      }
      if (node.child !== null) {
        node = node.child;
        continue;
      }
    }
    if (node === fiber) return; // fiber直接为Host或ClassComponent没有Child
    while (node.sibling === null) {
      if (node.return === null || node.return === fiber) return;
      node = node.return;
    }
    node = node.sibling;
  }
}

// 向下递归unmount ClassComponent
// TODO: clear ref
function unmountChildren(fiber) {
  var node = fiber;
  while (true) {
    if (node.tag === _TypeOfWork.ClassComponent) {
      var instance = node.stateNode;
      if (typeof instance.componentWillUnmount === "function") {
        instance.componentWillUnmount();
      }
    }
    if (node.child !== null) {
      node = node.child;
      continue;
    }
    if (node === fiber) return; // fiber没有child，直接返回
    while (node.sibling === null) {
      // 若没有sibling，向上找
      if (node.return === null || node.return === fiber) return;
      node = node.return;
    }
    node = node.sibling;
  }
}

function commitLifeCycles(current, fiber) {
  switch (fiber.tag) {
    case _TypeOfWork.HostComponent:
      {
        if (current === null && fiber.effectTag & _TypeOfEffect.Update) {
          // auto focus for input/form control
        }
        return;
      }
    case _TypeOfWork.HostRoot:
      {
        return;
      }
    case _TypeOfWork.ClassComponent:
      {
        if (current === null && fiber.effectTag & _TypeOfEffect.Update) {
          var instance = fiber.stateNode;
          instance.componentDidMount();
        } else {
          // cDU
        }
        return;
      }
  }
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = __webpack_require__(15);

var _Component2 = _interopRequireDefault(_Component);

var _Element = __webpack_require__(4);

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(props) {
    _classCallCheck(this, App);

    this.state = { value: "a" };
  }

  _createClass(App, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      console.log("will mount");
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log("did mount");
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      console.log("will unmount");
    }
  }, {
    key: "render",
    value: function render() {
      return (0, _Element2.default)(
        "div",
        null,
        (0, _Element2.default)(
          "p",
          null,
          this.state.value
        )
      );
    }
  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: context, callback
var Component = function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
    this.updater = null;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(partialState) {
      this.updater.enqueueSetState(this, partialState);
    }
  }]);

  return Component;
}();

exports.default = Component;

/***/ })
/******/ ]);