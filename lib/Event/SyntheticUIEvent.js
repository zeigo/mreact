import SyntheticEvent from "./SyntheticEvent"

const SyntheticUIEvent = SyntheticEvent.extend({
  view: null,
  detail: null
})

export default SyntheticEvent