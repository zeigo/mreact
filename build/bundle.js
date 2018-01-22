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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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
exports.msToExpirationTime = msToExpirationTime;
exports.expirationTimeToMs = expirationTimeToMs;
exports.computeExpirationBucket = computeExpirationBucket;
var NoWork = exports.NoWork = 0;
var Sync = exports.Sync = 1;

// expirationTime is too too long, maybe change its name later
var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = 2;

// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms) {
  // 加上偏移量以避免10ms以内的与NoWork冲突
  return (ms / UNIT_SIZE | 0) + MAGIC_NUMBER_OFFSET;
}

function expirationTimeToMs(expirationTime) {
  return (expirationTime - MAGIC_NUMBER_OFFSET) * UNIT_SIZE;
}

// 向上取整为precision的倍数
function ceiling(num, precision) {
  return ((num / precision | 0) + 1) * precision;
}

// expirationInMs: 1000, bucketSizeMs: 200
// 200ms内都会有相同的expirationTime
function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
  return ceiling(currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
}

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertUpdateIntoFiber = insertUpdateIntoFiber;
exports.processUpdateQueue = processUpdateQueue;

var _ExpirationTime = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Update = function Update() {
  _classCallCheck(this, Update);

  this.expirationTime = _ExpirationTime.NoWork;
  this.next = null; // Update
  this.partialState = null;
};

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


var UpdateQueue =
// A processed update is not removed from the queue if there are any
// unprocessed updates that came before it. In that case, we need to keep
// track of the base state, which represents the base state of the first
// unprocessed update, which is the same as the first update in the list.
function UpdateQueue() {
  _classCallCheck(this, UpdateQueue);

  this.first = null;
  this.last = null;
  this.expirationTime = _ExpirationTime.NoWork;
  this.isInitialized = false; // 标志baseState是否初始化
  this.baseState = null;
};

function createUpdateQueue() {
  return {
    baseState: null,
    first: null,
    last: null,
    expirationTime: _ExpirationTime.NoWork,
    isInitialized: false
  };
}

function insertUpdateIntoFiber(fiber, update) {
  // 最多有两条不同的queue
  var alternate = fiber.alternate,
      queue1 = fiber.updateQueue;
  if (queue1 === null) {
    queue1 = fiber.updateQueue = createUpdateQueue();
  }
  var queue2 = void 0;
  if (alternate !== null) {
    queue2 = alternate.updateQueue;
    if (queue2 === null) {
      queue2 = alternate.updateQueue = createUpdateQueue();
    }
  } else {
    queue2 = null;
  }
  queue1 === queue2 && (queue2 = null);

  if (queue2 === null) {
    insertUpdateIntoQueue(queue1, update);
    return;
  }

  if (queue1.last === null || queue2.last === null) {
    insertUpdateIntoQueue(queue1, update);
    insertUpdateIntoQueue(queue2, update);
    return;
  }

  insertUpdateIntoQueue(queue1, update);
  // 当有两条不同queue时，当不为空时，只需更新queue1，并更新queue2.last
  queue2.last = update;
}

function insertUpdateIntoQueue(queue, update) {
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

// need prevProps, prevState later for partialState which is function
function processUpdateQueue(current, workInProgress, queue, renderExpirationTime) {
  // workInProgress的queue是由current直接赋值来的，persistent
  if (current !== null && current.queue === queue) {
    var currentQueue = queue;
    queue = workInProgress.updateQueue = {
      first: currentQueue.first,
      last: currentQueue.last,
      isInitialized: currentQueue.isInitialized,
      baseState: currentQueue.baseState
    };
  }
  // queue的expirationTime需要是被跳过而剩余的update中最小值
  // 这里先重置
  queue.expirationTime = _ExpirationTime.NoWork;
  // initialize state
  var state = void 0;
  if (queue.isInitialized) {
    state = queue.baseState;
  } else {
    state = queue.baseState = workInProgress.memorizedState;
    queue.isInitialized = true;
  }
  var update = queue.first,
      dontMutatePrevState = true,

  // 不直接在原来state上修改，从而保证state引用不同
  didSkip = false;
  while (update !== null) {

    var updateExpirationTime = update.expirationTime;
    if (updateExpirationTime > renderExpirationTime) {
      // 不紧急，跳过
      if (queue.expirationTime === _ExpirationTime.NoWork || queue.expirationTime > updateExpirationTime) {
        queue.expirationTime = updateExpirationTime;
      } // 保持queue的expirationTime最小
      if (!didSkip) {
        didSkip = true;
        queue.baseState = state;
      }
      update = update.next;
      continue;
    }
    // 若之前没有跳过，从queue里删去这个update
    // ?? 能否使updateQueue只剩下跳过的部分
    if (!didSkip) {
      queue.first = update.next;
      queue.first === null && (queue.last = null);
    }

    var partialState = getStateFromUpdate(update);
    if (partialState) {
      if (dontMutatePrevState) {
        // 确保是新的state
        state = Object.assign({}, state, partialState);
      } else {
        state = Object.assign(state, partialState);
      }
      dontMutatePrevState = false;
    }
    // TODO: add callback list
    update = update.next;
  }
  if (queue.first === null) {
    // queue已处理空
    workInProgress.updateQueue = null;
  }
  if (!didSkip) {
    queue.baseState = state;
  }
  return state;
}

function getStateFromUpdate(update) {
  var partialState = update.partialState;
  if (typeof partialState === 'function') {
    // TODO: function
  } else {
    return partialState;
  }
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugins = exports.registrationNameDependencies = exports.registrationNameModules = exports.topLevelTypes = undefined;

var _SimpleEventPlugin = __webpack_require__(22);

var _SimpleEventPlugin2 = _interopRequireDefault(_SimpleEventPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topLevelTypes = exports.topLevelTypes = {
  "topClick": "click",
  "topChange": "change",
  "topInput": "input",
  "topAnimationEnd": "animationend" // get prefix
};

var registrationNameModules = exports.registrationNameModules = {
  onClick: _SimpleEventPlugin2.default
};

var registrationNameDependencies = exports.registrationNameDependencies = {
  "onClick": ["topClick"],
  "onChange": ["topFocus", "topBlur", "topClick", "topKeyDown", "topKeyUp", "topChange", "topInput", "topSelectionChange"]
};

var plugins = exports.plugins = [_SimpleEventPlugin2.default];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createElement;

var _Symbols = __webpack_require__(7);

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ELEMENT_TYPE = exports.ELEMENT_TYPE = Symbol.for("element");

/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accumulateInto = accumulateInto;
exports.forEachAccumulated = forEachAccumulated;
// current: null/undefined, notArray, array;
// next: notArray, array
function accumulateInto(current, next) {
  if (current == null) return next;

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }
    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    next.unshift(current);
    return next;
  }
  return [current, next];
}

function forEachAccumulated(arr, callback, context) {
  if (Array.isArray(arr)) {
    arr.forEach(callback, context);
  } else if (arr) {
    callback.call(context, arr);
  }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Element = __webpack_require__(6);

var _Element2 = _interopRequireDefault(_Element);

var _render = __webpack_require__(11);

var _render2 = _interopRequireDefault(_render);

var _App = __webpack_require__(27);

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
    (0, _Element2.default)("input", null)
  ),
  "zxcv"
);
var ctn = document.getElementById("app");
// render(
//   <div>
//     <p>hello world</p>
//     <button onClick={() => alert("hi")}>click</button>
//     <App />
//   </div> , ctn)
(0, _render2.default)(a, ctn);

var btn = document.createElement("button");
btn.innerHTML = "click to change";
btn.onclick = function () {
  (0, _render2.default)(b, ctn);
};
document.body.appendChild(btn);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _Fiber = __webpack_require__(3);

var _TypeOfWork = __webpack_require__(0);

var _ExpirationTime = __webpack_require__(2);

var _FiberScheduler = __webpack_require__(12);

var _UpdateQueue = __webpack_require__(4);

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
  (0, _UpdateQueue.insertUpdateIntoFiber)(fiber, update);
  (0, _FiberScheduler.scheduleWork)(fiber, expirationTime);
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeExpirationForFiber = computeExpirationForFiber;
exports.scheduleWork = scheduleWork;

var _ExpirationTime = __webpack_require__(2);

var _TypeOfEffect = __webpack_require__(1);

var _Fiber = __webpack_require__(3);

var _FiberBeginWork = __webpack_require__(13);

var _FiberBeginWork2 = _interopRequireDefault(_FiberBeginWork);

var _FiberCompleteWork = __webpack_require__(16);

var _FiberCommitWork = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function now() {
  return Date.now(); // performance.now()
}

var startTime = now(),
    // 作为之后expirationTime的参照
mostRecentCurrentTime = (0, _ExpirationTime.msToExpirationTime)(0);

function recalculateCurrentTime() {
  var ms = now() - startTime;
  mostRecentCurrentTime = (0, _ExpirationTime.msToExpirationTime)(ms);
  return mostRecentCurrentTime;
}

function computeAsyncExpiration() {
  var currentTime = recalculateCurrentTime();
  var expirationMs = 1000;
  var bucketSizeMs = 200;
  return (0, _ExpirationTime.computeExpirationBucket)(currentTime, expirationMs, bucketSizeMs);
}

// 处理页面多个HostRoot的情况！！
var lastScheduledRoot = null,
    firstScheduledRoot = null,
    nextFlushedRoot = null,
    nextFlushedExpirationTime = _ExpirationTime.NoWork;

var isRendering = false,
    isWorking = false,
    isCommitting = false,
    isUnmounting = false;

var nextRoot = null,
    nextRenderExpirationTime = _ExpirationTime.NoWork,
    // 当前render的期限
nextUnitOfWork = null;

var deadline = null,
    deadlineDidExpire = false,
    callbackExpirationTime = _ExpirationTime.NoWork,
    callbackId = -1;
// 永远只有一个异步任务

var nextEffect = null;

var useSyncScheduling = true; // 默认同步渲染

// updateContainer/setState时使用
function computeExpirationForFiber(fiber) {
  var expirationTime;
  if (isWorking) {
    if (isCommitting) {
      // commit阶段的update默认Sync
      // lifecycle?
      expirationTime = _ExpirationTime.Sync;
    } else {
      // render阶段的update与当前render work一致
      // componentWillMount/ 时setState
      expirationTime = nextRenderExpirationTime;
    }
  } else {
    if (fiber.internalContextTag !== undefined) {
      expirationTime = computeAsyncExpiration();
    } else {
      expirationTime = _ExpirationTime.Sync;
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

  if (isRendering) return; // 避免嵌套

  if (expirationTime === _ExpirationTime.Sync) {
    performWork(_ExpirationTime.Sync, null);
  } else {
    // requestIdleCallback
    scheduleCallbackWithExpiration(expirationTime);
  }
}

function scheduleCallbackWithExpiration(expirationTime) {
  if (callbackExpirationTime !== _ExpirationTime.NoWork) {
    if (expirationTime > callbackExpirationTime) {
      // 已计划的callback更紧急，不需要再设置
      return;
    } else {
      cancelIdleCallback(callbackId);
    }
  }
  // Compute a timeout for the given expiration time.
  var currentMs = now() - startTime;
  var expirationMs = (0, _ExpirationTime.expirationTimeToMs)(expirationTime);
  var timeout = expirationMs - currentMs;

  callbackExpirationTime = expirationTime;
  callbackId = requestIdleCallback(performAsyncWork, {
    timeout: timeout
  });
}

function performAsyncWork(dl) {
  performWork(_ExpirationTime.NoWork, dl);
}

function performWork(minExpirationTime, dl) {
  // minExpirationTime            dl
  //       Sync                  null
  //      NoWork       {didTimeout, timeRemaining()}
  deadline = dl;

  findHighestPriorityRoot();

  // 若performWorkOnRoot里的renderRoot耗尽了时间，deadlineDidExpire为true
  while (nextFlushedRoot !== null && nextFlushedExpirationTime !== _ExpirationTime.NoWork && !deadlineDidExpire) {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
    findHighestPriorityRoot();
  }

  if (deadline !== null) {
    callbackExpirationTime = _ExpirationTime.NoWork;
    callbackId = -1;
  }

  if (nextFlushedExpirationTime !== _ExpirationTime.NoWork) {
    scheduleCallbackWithExpiration(nextFlushedExpirationTime);
  }
  deadline = null;
  deadlineDidExpire = false;
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

  var finishedWork = root.finishedWork;
  if (finishedWork !== null) {
    // 已完成，可进行commit; render和commit之间可能中断
    root.finishedWork = null;
    root.remainingExpirationTime = commitRoot(finishedWork);
  } else {
    finishedWork = renderRoot(root, expirationTime);
    if (finishedWork !== null) {
      if (expirationTime < recalculateCurrentTime()) {
        // sync/expired work，直接commit
        root.remainingExpirationTime = commitRoot(finishedWork);
      } else if (!shouldYield()) {
        // async，还有时间剩余，直接commit
        root.remainingExpirationTime = commitRoot(finishedWork);
      } else {
        // 没时间剩余，之后再commit
        root.finishedWork = finishedWork;
      }
    }
  }

  isRendering = false;
}

// 1.performUnitOfWork后要判断时间，没时间之后从nextUnitOfWork继续
// 2.renderRoot后要判断时间，没时间之后从root.finishedWork继续
function shouldYield() {
  if (deadline === null) return false;
  if (deadline.timeRemaining() > 1) return false;
  deadlineDidExpire = true;
  return true;
}

// 当workLoop中performUnitOfWork因时间不够停止时，isReadyForCommit仍为false，返回null
function renderRoot(root, expirationTime) {
  isWorking = true;
  root.isReadyForCommit = false;

  // 重新开始而不是从中断的地方nextUnitOfWork继续
  if (root !== nextRoot || expirationTime !== nextRenderExpirationTime || nextUnitOfWork === null) {
    nextRoot = root;
    nextRenderExpirationTime = expirationTime;
    nextUnitOfWork = (0, _Fiber.createWorkInProgress)(root.current, null, nextRenderExpirationTime);
  }
  // invokeGuardedCallback
  workLoop(expirationTime);
  isWorking = false;
  return root.isReadyForCommit ? root.current.alternate : null;
}

function workLoop(expirationTime) {
  if (nextRenderExpirationTime === _ExpirationTime.NoWork || nextRenderExpirationTime > expirationTime) return;
  // count expire and comfirm shouldYield
  if (nextRenderExpirationTime < mostRecentCurrentTime) {
    // flush sync/expired work
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {
    // flush async work until deadline
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  }
}

// perform分为begin/complete两步
// begin 通过对比修改fiber 树，确定Placement, Deletion, ContentRest
// 新建/更新Class实例, 根据pendingProps和updateQueue来
// 确定work in progress的memorizedProps/State
// complete 新建/更新Host实例，确定Update
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
  isCommitting = true;
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
  isCommitting = false;
  root.isReadyForCommit = false;
  return root.current.expirationTime;
}

function commitAllHostEffects() {
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag;
    if (effectTag & _TypeOfEffect.ContentReset) {
      (0, _FiberCommitWork.commitContentReset)(nextEffect);
    }
    var primaryEffectTag = effectTag & (_TypeOfEffect.Placement | _TypeOfEffect.Update | _TypeOfEffect.Deletion);
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beginWork;

var _TypeOfWork = __webpack_require__(0);

var _FiberReconciler = __webpack_require__(14);

var _ExpirationTime = __webpack_require__(2);

var _TypeOfEffect = __webpack_require__(1);

var _FiberClassComponent = __webpack_require__(15);

var _UpdateQueue = __webpack_require__(4);

// 控制入口，根据fiber的tag确定处理方式，返回下次work的对象
function beginWork(current, workInProgress, renderExpirationTime) {
  // 低优先级可以不处理
  if (workInProgress.expirationTime === _ExpirationTime.NoWork || workInProgress.expirationTime > renderExpirationTime) return null;
  switch (workInProgress.tag) {
    case _TypeOfWork.HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
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

// 根据updateQueue确定后续步骤
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  var updateQueue = workInProgress.updateQueue,
      prevState = workInProgress.memorizedState;
  if (updateQueue !== null) {
    var state = (0, _UpdateQueue.processUpdateQueue)(current, workInProgress, updateQueue, renderExpirationTime);
    var element = state.element;
    // 对比后更改workInProgress.child
    (0, _FiberReconciler.reconcileChildren)(current, workInProgress, element);
  } else {
    (0, _FiberReconciler.cloneChildFibers)(current, workInProgress);
  }
  return workInProgress.child;
}

function updateClassComponent(current, workInProgress, renderExpirationTime) {
  var shouldUpdate;
  if (current === null) {
    // 组件实例化
    (0, _FiberClassComponent.constructClassInstance)(workInProgress, workInProgress.pendingProps);
    (0, _FiberClassComponent.mountClassInstance)(workInProgress, renderExpirationTime);
    shouldUpdate = true;
  } else {
    shouldUpdate = (0, _FiberClassComponent.updateClassInstance)(current, workInProgress, renderExpirationTime);
  }

  return finishClassComponent(current, workInProgress, shouldUpdate);
}

function finishClassComponent(current, workInProgress, shouldUpdate) {
  if (!shouldUpdate) {
    (0, _FiberReconciler.cloneChildFibers)(current, workInProgress);
    return workInProgress.child;
  }
  var instance = workInProgress.stateNode,
      nextChildren = instance.render();
  workInProgress.effectTag |= _TypeOfEffect.PerformedWork;
  (0, _FiberReconciler.reconcileChildren)(current, workInProgress, nextChildren);
  workInProgress.memorizedProps = instance.props;
  workInProgress.memorizedState = instance.state;
  return workInProgress.child;
}

// 根据pendingProps, memorizedProps
function updateHostComponent(current, workInProgress, renderExpirationTime) {
  var oldProps = workInProgress.memorizedProps,
      newProps = workInProgress.pendingProps,
      type = workInProgress.type;
  if (newProps === null) newProps = oldProps;
  if (newProps === null || newProps === oldProps) {
    (0, _FiberReconciler.cloneChildFibers)(current, workInProgress);
    return workInProgress.child;
  }
  var nextChildren = newProps.children,
      currentProps = current === null ? null : current.memorizedProps;
  // 子节点只有textNode，不往下再创建fiber比较
  // 所以若current的children只有text，需要ContentReset
  if (shouldSetTextContent(type, newProps)) {
    nextChildren = null;
  } else if (currentProps && shouldSetTextContent(type, currentProps)) {
    workInProgress.effectTag |= _TypeOfEffect.ContentReset;
  }

  (0, _FiberReconciler.reconcileChildren)(current, workInProgress, nextChildren);
  workInProgress.memorizedProps = newProps;
  return workInProgress.child;
}

function shouldSetTextContent(type, props) {
  return typeof props.children === "string" || typeof props.children === "number";
}

function updateHostText(current, workInProgress) {
  var newProps = workInProgress.pendingProps;
  workInProgress.memorizedProps = newProps;
  return null;
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.reconcileChildren = reconcileChildren;
exports.cloneChildFibers = cloneChildFibers;

var _Fiber = __webpack_require__(3);

var _TypeOfEffect = __webpack_require__(1);

var _Symbols = __webpack_require__(7);

var _TypeOfWork = __webpack_require__(0);

// 新建/更新子fiber，标记pendingProps
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
  // 依次遍历current的child
  // key不同 -> 直接删除当前
  // key相同 -> type相同 -> 删除之后的fiber，并复制当前fiber得到workinprogress的child，退出
  //        -> type不同 —> 删除剩下所有fiber，根据element新建fiber
  while (child !== null) {
    if (key === child.key) {
      if (child.type === element.type) {
        deleteRemainingChildren(returnFiber, child.sibling);
        var existing = useFiber(child, element.props, expirationTime);
        // TODO: ref
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
    // key不匹配时返回null，停止
    if (newFiber === null) {
      break;
    }
    // 新旧fiber的key相同但type不同，删除旧fiber
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
    // 
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

// 要删除的标记Deletion，并加到return的effect list里
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

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constructClassInstance = constructClassInstance;
exports.mountClassInstance = mountClassInstance;
exports.updateClassInstance = updateClassInstance;

var _UpdateQueue = __webpack_require__(4);

var _TypeOfEffect = __webpack_require__(1);

function constructClassInstance(workInProgress, props) {
  var ctor = workInProgress.type;
  // TODO: get context
  // fiber.tag === ClassComponent && fiber.type.contextTypes != null
  var instance = new ctor(props);
  workInProgress.stateNode = instance;
  instance._internalFiber = workInProgress;
  // 插入updater
  return instance;
}

function mountClassInstance(workInProgress, renderExpirationTime) {
  var current = workInProgress.alternate,
      instance = workInProgress.stateNode,
      state = instance.state || null,
      props = workInProgress.pendingProps;
  instance.state = workInProgress.memoizedState = state; // 防止undefined
  instance.props = props;

  // internalContextTag: AsyncUpdates

  if (typeof instance.componentWillMount === "function") {
    instance.componentWillMount(); // 可能setState
    // enqueueReplaceState
    var queue = workInProgress.updateQueue;
    if (queue !== null) {
      instance.state = (0, _UpdateQueue.processUpdateQueue)(current, workInProgress, updateQueue, renderExpirationTime);
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
    newState = (0, _UpdateQueue.processUpdateQueue)(current, workInProgress, workInProgress.updateQueue, renderExpirationTime);
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

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completeUnitOfWork = completeUnitOfWork;

var _TypeOfWork = __webpack_require__(0);

var _TypeOfEffect = __webpack_require__(1);

var _ExpirationTime = __webpack_require__(2);

var _Property = __webpack_require__(8);

var _EventEmitter = __webpack_require__(17);

var _EventPluginRegistry = __webpack_require__(5);

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
  // 如果子fiber有更高的优先级，父fiber也要跟着提高
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
    if (propKey === "style") {
      var style = domElement.style;
      for (var styleName in prop) {
        if (!prop.hasOwnProperty(styleName)) continue;
        if (styleName === "float") styleName = "cssFloat";
        style[styleName] = prop[styleName];
      }
    } else if (propKey === "children") {
      // children只有text
      if (typeof prop === "string" || typeof prop === "number") {
        domElement.innerHTML = "" + prop; // textContent
      }
    } else if (_EventPluginRegistry.registrationNameModules.hasOwnProperty(propKey)) {
      (0, _EventEmitter.listenTo)(propKey);
    }
  }
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenTo = listenTo;

var _EventListener = __webpack_require__(18);

var _EventPluginRegistry = __webpack_require__(5);

var alreadyListeningTo = {};
var topListenerID = "_listenersID";
var topListenerCounter = 0;

function listenTo(registName) {
  var isListening = getListeningForDocument(),
      // {}
  dependencies = _EventPluginRegistry.registrationNameDependencies[registName];

  for (var i = 0, len = dependencies.length; i < len; i++) {
    var dependency = dependencies[i];
    if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
      (0, _EventListener.trapBubbledEvent)(dependency, _EventPluginRegistry.topLevelTypes[dependency], document);
      isListening[dependency] = true;
    }
  }

  // isListening["topClick"] = true
}

function getListeningForDocument() {
  if (!Object.prototype.hasOwnProperty.call(document, topListenerID)) {
    // 还未注册过
    document[topListenerID] = topListenerCounter++;
    alreadyListeningTo[document[topListenerID]] = {};
  }
  return alreadyListeningTo[document[topListenerID]];
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trapBubbledEvent = trapBubbledEvent;

var _CallbackBookKeeping = __webpack_require__(19);

var _EventPluginHub = __webpack_require__(20);

var EventListener = {
  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent("on" + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent("on" + eventType, callback);
        }
      };
    }
  },
  capture: function capture(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    } else {
      throw new Error("browser dont support capture phase");
    }
  }
};

// DOM的事件，生成event对象，经过捕获、冒泡回到document，处理default action
// React提供更高的一层抽象，实现独立的捕获、冒泡

// 在completeWork的过程中，当发现fiber有关于事件的属性，如onClick会注册click事件
// 到document(focus/blur/cancel/close/scroll 为capture，其他为bubble阶段）
// 当document发生click时，找到触发的target及fiber，合成bookkeeping；
// 根据plugin extractEvents两次遍历找到回调，合成事件（Proxy），根据_dispatchListeners
// _dispatchInstances，依次执行dispatch，之后回收到Event pool

// 与之前理解的事件委托有所不同，document只起收集的作用，并不注册回调，回调都在对应的fiber里

function trapBubbledEvent(topLevelType, baseName, element) {
  if (!element) return;
  EventListener.listen(element, baseName, dispatchEvent.bind(null, topLevelType));
}

// instance对应fiber，回调都保存在对应的props里
function dispatchEvent(topLevelType, nativeEvent) {
  var nativeEventTarget = getEventTarget(nativeEvent);
  var targetInst = getClosestInstance(nativeEventTarget);
  var bookkeeping = (0, _CallbackBookKeeping.getCallbackBookkeeping)(topLevelType, nativeEvent, targetInst);
  // batched
  handleTopLevel(bookkeeping);
  (0, _CallbackBookKeeping.releaseCallbackBookkeeping)(bookkeeping);
}

function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;
  return target.nodeType === 3 ? target.parentNode : target; // textNode
}

// HostComponent fiber
function getClosestInstance(node) {
  while (!node._internalInstance) {
    node = node.parentNode;
  }
  return node._internalInstance;
}

function handleTopLevel(bookkeeping) {
  var targetInst = bookkeeping.targetInst;
  // ?? more ancestors
  var ancestors = bookkeeping.ancestors;
  ancestors.push(targetInst);
  (0, _EventPluginHub.runExtractedEventsInBatch)(bookkeeping.topLevelType, targetInst, bookkeeping.nativeEvent, getEventTarget(bookkeeping.nativeEvent));
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCallbackBookkeeping = getCallbackBookkeeping;
exports.releaseCallbackBookkeeping = releaseCallbackBookkeeping;
// bookkeep pool
var callbackBookkeepingPool = [];
var POOL_SIZE = 10;

function getCallbackBookkeeping(topLevelType, nativeEvent, targetInst) {
  if (callbackBookkeepingPool.length) {
    var instance = callbackBookkeepingPool.pop();
    instance.topLevelType = topLevelType;
    instance.nativeEvent = nativeEvent;
    instance.targetInst = targetInst;
    return instance;
  }
  return {
    topLevelType: topLevelType,
    nativeEvent: nativeEvent,
    targetInst: targetInst,
    ancestors: []
  };
}

function releaseCallbackBookkeeping(instance) {
  instance.ancestors = [];
  instance.topLevelType = null;
  instance.nativeEvent = null;
  instance.targetInst = null;

  if (callbackBookkeepingPool.length < POOL_SIZE) {
    callbackBookkeepingPool.push(instance);
  }
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runExtractedEventsInBatch = runExtractedEventsInBatch;

var _Accumulate = __webpack_require__(9);

var _EventPluginUtils = __webpack_require__(21);

var _EventPluginRegistry = __webpack_require__(5);

var eventQueue = null;

function runExtractedEventsInBatch(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
  runEventsInBatch(events);
}

function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events;
  for (var i = 0; i < _EventPluginRegistry.plugins.length; i++) {
    // Not every plugin in the ordering may be loaded at runtime.
    var possiblePlugin = _EventPluginRegistry.plugins[i];
    if (possiblePlugin) {
      var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
      if (extractedEvents) {
        events = (0, _Accumulate.accumulateInto)(events, extractedEvents);
      }
    }
  }
  return events;
}

function runEventsInBatch(events) {
  if (events) eventQueue = (0, _Accumulate.accumulateInto)(eventQueue, events);
  var processingEventQueue = eventQueue;
  eventQueue = null;
  if (processingEventQueue) {
    (0, _Accumulate.forEachAccumulated)(processingEventQueue, _EventPluginUtils.executeDispatchesAndRelease);
  }
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeDispatchesAndRelease = executeDispatchesAndRelease;
function executeDispatchesAndRelease(event) {
  if (event) {
    executeDispatchesInOrder(event);
    if (!event.isPersistent) {
      event.constructor.release(event);
    }
  }
}

function executeDispatchesInOrder(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  if (Array.isArray(dispatchListeners)) {
    for (var i = 0, len = dispatchListeners.length; i < len; i++) {
      if (event.propagationStopped) break;
      executeDispatch(event, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, dispatchListeners, dispatchInstances);
  }

  event._dispatchListeners = null;
  event._dispatchInstances = null;
}

// 切换currentTarget，执行回调
// 这里listener是直接调用，如果之前没有bind或arrow function，this为undefined
// simulated: boolean ?? 好像是React测试中用到
function executeDispatch(event, listener, instance) {
  event.currentTarget = instance.stateNode;
  // invokeGuardedCallback还需要传type，这里简化
  listener.call(undefined, event);
  event.currentTarget = null;
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TypeOfWork = __webpack_require__(0);

var _SyntheticMouseEvent = __webpack_require__(23);

var _SyntheticMouseEvent2 = _interopRequireDefault(_SyntheticMouseEvent);

var _Accumulate = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topLevelTypeToDispatchConfig = {};
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
["click", "mouseenter"].forEach(function (event) {
  var capitalized = event[0].toUpperCase() + event.slice(1);
  var onEvent = "on" + capitalized;
  var topEvent = "top" + capitalized;
  var type = {
    dependencies: [topEvent],
    phasedRegistrationNames: {
      captured: onEvent + "Captured",
      bubbled: onEvent
    }
  };
  eventTypes[event] = type;
  topLevelTypeToDispatchConfig[topEvent] = type;
});

var SimpleEventPlugin = {
  eventTypes: eventTypes,

  extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelTypeToDispatchConfig[topLevelType];
    if (!dispatchConfig) return null;
    var EventConstructor;
    switch (topLevelType) {
      case "topClick":
        EventConstructor = _SyntheticMouseEvent2.default;
        break;
      default:
        break;
    }
    // pooled
    var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
    traverseTwoPhase(targetInst, event);
    return event;
  }
};

// 第一遍从上往下找onClickCapture，第二遍从下往上找onClick
function traverseTwoPhase(inst, event) {
  var path = []; // button, div
  while (inst) {
    if (inst.tag === _TypeOfWork.HostComponent) path.push(inst);
    inst = inst.return;
  }
  var i,
      len = path.length;
  for (i = len - 1; i >= 0; i--) {
    accumulateDispatches(path[i], event, "captured");
  }
  for (i = 0; i < len; i++) {
    accumulateDispatches(path[i], event, "bubbled");
  }
}

// 找到phase对应的registrationName，找inst对应的prop
function accumulateDispatches(inst, event, phase) {
  var registrationName = event.dispatchConfig.phasedRegistrationNames[phase];
  var listener = getListener(inst, registrationName);
  if (listener) {
    event._dispatchListeners = (0, _Accumulate.accumulateInto)(event._dispatchListeners, listener);
    event._dispatchInstances = (0, _Accumulate.accumulateInto)(event._dispatchInstances, inst);
  }
}

function getListener(inst, registrationName) {
  var listener;
  // 为什么不直接memorizedProps
  var stateNode = inst.stateNode;
  if (!stateNode) return null;
  var props = stateNode._eventHandler;
  if (!props) return null;
  listener = props[registrationName];
  // disabled button/input/textarea/select
  return listener;
}

exports.default = SimpleEventPlugin;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SyntheticUIEvent = __webpack_require__(24);

var _SyntheticUIEvent2 = _interopRequireDefault(_SyntheticUIEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SyntheticMouseEvent = _SyntheticUIEvent2.default.extend({
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  pageX: null,
  pageY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  button: null,
  buttons: null,
  relatedTarget: function relatedTarget(event) {
    return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
  }
});

exports.default = SyntheticMouseEvent;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SyntheticEvent = __webpack_require__(25);

var _SyntheticEvent2 = _interopRequireDefault(_SyntheticEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SyntheticUIEvent = _SyntheticEvent2.default.extend({
  view: null,
  detail: null
});

exports.default = _SyntheticEvent2.default;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var POOL_SIZE = 10;

var EventInterface = {
  type: null,
  target: null, // IE srcElement
  // currentTarget在dispatch的时候设置
  currentTarget: function currentTarget() {
    return null;
  },
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  defaultPrevented: null, // IE returnValue
  isTrusted: null
};

var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];

function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst; // fiber
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface,
      propName;
  for (propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) continue;
    var propValue = Interface[propName];
    if (propValue) {
      // function
      this[propName] = propValue(nativeEvent);
    } else if (propName === "target") {
      this.target = nativeEventTarget;
    } else {
      this[propName] = nativeEvent[propName];
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : this.returnValue === false;
  this.isDefaultPrevented = defaultPrevented;

  this.isPropagationStopped = false;

  // this._dispatchInstances
  // this._dispatchListeners
}

SyntheticEvent.Interface = EventInterface;

Object.assign(SyntheticEvent.prototype, {
  stopPropagation: function stopPropagation() {
    var event = this.nativeEvent;
    if (!event) return;
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== "unknown") {
      event.cancelBubble = true;
    }
    this.isPropagationStopped = true;
  },
  preventDefault: function preventDefault() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    if (!event) return;
    if (event.preventDefault) {
      event.preventDefault();
    } else if (typeof event.returnValue !== 'unknown') {
      event.returnValue = false;
    }
    this.isDefaultPrevented = true;
  },
  persist: function persist() {
    this.isPersistent = true;
  },
  destructor: function destructor() {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      this[propName] = null;
    }
    for (var i = 0, len = shouldBeReleasedProperties.length; i < len; i++) {
      this[shouldBeReleasedProperties[i]] = null;
    }
  }
});

SyntheticEvent.extend = function (Interface) {
  var Super = this;
  // 寄生组合式继承
  var E = function E() {};
  E.prototype = Super.prototype;
  var prototype = new E();
  // 类似prototype = Object.create(Super.prototype)
  // 不直接Class.prototype = new Super()
  // 避免进行Super的实例化
  function Class() {
    return Super.apply(this, arguments);
  }
  Object.assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.Interface = Object.assign({}, Super.Interface, Interface);
  Class.extend = Super.extend;
  addEventPoolingTo(Class);
  return Class;
};

function addEventPoolingTo(EventConstructor) {
  EventConstructor.eventPool = [];

  EventConstructor.getPooled = function (dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
    var EventConstructor = this;
    if (EventConstructor.eventPool.length) {
      var instance = EventConstructor.eventPool.pop();
      EventConstructor.call(instance, dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
      return instance;
    }
    return new EventConstructor(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
  };

  EventConstructor.release = function (event) {
    var EventConstructor = this;
    event.destructor();
    if (this.eventPool.length < POOL_SIZE) {
      this.eventPool.push(event);
    }
  };
}

addEventPoolingTo(SyntheticEvent);

exports.default = SyntheticEvent;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commitContentReset = commitContentReset;
exports.commitPlacement = commitPlacement;
exports.commitWork = commitWork;
exports.commitDeletion = commitDeletion;
exports.commitLifeCycles = commitLifeCycles;

var _TypeOfEffect = __webpack_require__(1);

var _TypeOfWork = __webpack_require__(0);

var _Property = __webpack_require__(8);

function commitContentReset(fiber) {
  var node = fiber.stateNode;
  node.textContent = "";
}

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

  // 子fiber的placement effect要早于父fiber的contentReset出现
  // 故要处理父fiber
  if (parentFiber.effectTag & _TypeOfEffect.ContentReset) {
    parent.textContent = "";
    // Clear ContentReset from the effect tag
    parentFiber.effectTag &= ~_TypeOfEffect.ContentReset;
  }
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = __webpack_require__(28);

var _Component2 = _interopRequireDefault(_Component);

var _Element = __webpack_require__(6);

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
/* 28 */
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