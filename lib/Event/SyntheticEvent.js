var POOL_SIZE = 10

var EventInterface = {
  type: null,
  target: null, // IE srcElement
  // currentTarget在dispatch的时候设置
  currentTarget: () => null,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  defaultPrevented: null, // IE returnValue
  isTrusted: null,
}

const shouldBeReleasedProperties = [
  'dispatchConfig',
  '_targetInst',
  'nativeEvent',
  'isDefaultPrevented',
  'isPropagationStopped',
  '_dispatchListeners',
  '_dispatchInstances',
];

function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
  this.dispatchConfig = dispatchConfig
  this._targetInst = targetInst // fiber
  this.nativeEvent = nativeEvent

  var Interface = this.constructor.Interface,
    propName
  for (propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) continue
    var propValue = Interface[propName]
    if (propValue) { // function
      this[propName] = propValue(nativeEvent)
    } else if (propName === "target") {
      this.target = nativeEventTarget
    } else {
      this[propName] = nativeEvent[propName]
    }
  }

  var defaultPrevented =
    nativeEvent.defaultPrevented != null ?
    nativeEvent.defaultPrevented :
    this.returnValue === false
  this.isDefaultPrevented = defaultPrevented

  this.isPropagationStopped = false

  // this._dispatchInstances
  // this._dispatchListeners
}

SyntheticEvent.Interface = EventInterface

Object.assign(SyntheticEvent.prototype, {
  stopPropagation() {
    var event = this.nativeEvent
    if (!event) return
    if (event.stopPropagation) {
      event.stopPropagation()
    } else if (typeof event.cancelBubble !== "unknown") {
      event.cancelBubble = true
    }
    this.isPropagationStopped = true
  },

  preventDefault() {
    this.defaultPrevented = true
    var event = this.nativeEvent
    if (!event) return
    if (event.preventDefault) {
      event.preventDefault();
    } else if (typeof event.returnValue !== 'unknown') {
      event.returnValue = false;
    }
    this.isDefaultPrevented = true
  },

  persist() {
    this.isPersistent = true
  },

  destructor() {
    var Interface = this.constructor.Interface
    for (var propName in Interface) {
      this[propName] = null
    }
    for (var i = 0, len = shouldBeReleasedProperties.length; i < len; i++) {
      this[shouldBeReleasedProperties[i]] = null
    }
  }
})

SyntheticEvent.extend = function (Interface) {
  var Super = this
  // 寄生组合式继承
  var E = function() {}
  E.prototype = Super.prototype
  var prototype = new E()
  // 类似prototype = Object.create(Super.prototype)
  // 不直接Class.prototype = new Super()
  // 避免进行Super的实例化
  function Class() {
    return Super.apply(this, arguments)
  }
  Object.assign(prototype, Class.prototype)
  Class.prototype = prototype
  Class.prototype.constructor = Class
  Class.Interface = Object.assign({}, Super.Interface, Interface)
  Class.extend = Super.extend
  addEventPoolingTo(Class)
  return Class
}

function addEventPoolingTo(EventConstructor) {
  EventConstructor.eventPool = [];

  EventConstructor.getPooled = function(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
    const EventConstructor = this;
    if (EventConstructor.eventPool.length) {
      const instance = EventConstructor.eventPool.pop();
      EventConstructor.call(
        instance,
        dispatchConfig,
        targetInst,
        nativeEvent,
        nativeEventTarget
      );
      return instance;
    }
    return new EventConstructor(
      dispatchConfig,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );
  };

  EventConstructor.release = function(event) {
    var EventConstructor = this
    event.destructor()
    if (this.eventPool.length < POOL_SIZE) {
      this.eventPool.push(event)
    }
  }
}

addEventPoolingTo(SyntheticEvent)

export default SyntheticEvent