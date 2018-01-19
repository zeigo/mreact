import { trapBubbledEvent } from "./EventListener"

var alreadyListeningTo = {}
var topListenerID = "_listenersID"
var topListenerCounter = 0

var registrationNameDependencies = {
  onClick: ["topClick"]
}

var topLevelTypes = {
  topClick: "click"
}

export function listenTo(registName) {
  var isListening = getListeningForDocument(), // {}
    dependencies = registrationNameDependencies[registName]
  
    for (var i = 0, len = dependencies.length; i < len; i++) {
      var dependency = dependencies[i]
      if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
        trapBubbledEvent(dependency, topLevelTypes[dependency], document)
        isListening[dependency] = true
      }
    }

  // isListening["topClick"] = true
}

function getListeningForDocument() {
  if (!Object.prototype.hasOwnProperty.call(document, topListenerID)) { // 还未注册过
    document[topListenerID] = topListenerCounter++
    alreadyListeningTo[document[topListenerID]] = {}
  }
  return alreadyListeningTo[document[topListenerID]]
}
