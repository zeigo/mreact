import Component from "./lib/Component"
import createElement from "./lib/Element"

export default class App {
  constructor(props) {
    this.state = {value: "a"}
  }
  componentWillMount() {
    console.log("will mount")
  }
  componentDidMount() {
    console.log("did mount")
  }
  componentWillUnmount(){
    console.log("will unmount")
  }
  render() {
    return (
      <div>
        <p>{this.state.value}</p>
      </div>
    )
  }
}