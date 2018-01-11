
const ELEMENT_TYPE = Symbol.for("mre.element")

class Element {
  constructor(type, props, key, children) {
    this.$$typeof = ELEMENT_TYPE
    this.type = type
    this.props = props
    this.key = key
    this.children = children
  }
}

export function createElement(type, config, ...children) {
  let props = {},
    key, configName
  if (config) {
    key = config.key || null
    for (configName in config) {
      if (config.hasOwnProperty(configName) && configName !== "key") {
        props[configName] = config[configName]
      }
    }
  }
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (configName in defaultProps) {
      if (props[configName] === undefined) {
        props[configName] = defaultProps[configName];
      }
    }
  }
  return new Element(type, props, key, children)
}