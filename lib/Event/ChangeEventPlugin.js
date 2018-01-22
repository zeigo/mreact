
const eventType = {
  "change": {
    dependencies: [
      "topFocus", 
      "topBlur", 
      "topClick",
      "topKeyDown",
      "topKeyUp",
      "topChange",
      "topInput",
      "topSelectionChange" 
    ],
    phasedRegistrationNames: {
      "captured": "onChangeCaptured",
      "bubbled": "onChange"
    }
  }
}