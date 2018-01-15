// TODO: context, callback
export default class Component {
  constructor(props) {
    this.props = props
    this.updater = null
  }
  setState(partialState) {
    this.updater.enqueueSetState(this, partialState)
  }
}