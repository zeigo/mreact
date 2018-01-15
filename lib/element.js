import { ELEMENT_TYPE } from "./Utils/Symbols"

class Element {
  constructor(type, props, key) {
    this.$$typeof = ELEMENT_TYPE
    this.type = type
    this.props = props
    this.key = key
  }
}

export default function createElement(type, config, children) {
  let props = {},
    key = null,
    configName
  if (config) {
    key = config.key || null
    for (configName in config) {
      if (config.hasOwnProperty(configName) && configName !== "key") {
        props[configName] = config[configName]
      }
    }
  }
  if (type && type.defaultProps) {
    let defaultProps = type.defaultProps;
    for (configName in defaultProps) {
      if (props[configName] === undefined) {
        props[configName] = defaultProps[configName];
      }
    }
  }
  let childrenLen = arguments.length - 2
  if (childrenLen === 1)
    props.children = children
  else if (childrenLen > 1) {
    let childArr = []
    for (let i = 0; i < childrenLen; i++) {
      childArr.push(arguments[i + 2])
    }
    props.children = childArr
  }
  return new Element(type, props, key)
}