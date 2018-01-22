import SimpleEventPlugin from "./SimpleEventPlugin"

export const topLevelTypes = {
  "topClick": "click",
  "topChange": "change",
  "topInput": "input",
  "topAnimationEnd": "animationend", // get prefix
}

export const registrationNameModules = {
  onClick: SimpleEventPlugin
}

export const registrationNameDependencies = {
  "onClick": ["topClick"],
  "onChange": [
    "topFocus", 
    "topBlur", 
    "topClick",
    "topKeyDown",
    "topKeyUp",
    "topChange",
    "topInput",
    "topSelectionChange" 
  ]
}

export const plugins = [SimpleEventPlugin]