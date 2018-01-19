import { accumulateInto, forEachAccumulated } from "./Accumulate"
import { executeDispatchesAndRelease } from "./EventPluginUtils"
import { plugins } from "./EventPluginRegistry"

var eventQueue = null

export function runExtractedEventsInBatch(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget)
  runEventsInBatch(events)
}

function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events
  for (var i = 0; i < plugins.length; i++) {
    // Not every plugin in the ordering may be loaded at runtime.
    var possiblePlugin = plugins[i];
    if (possiblePlugin) {
      var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents);
      }
    }
  }
  return events;
}

function runEventsInBatch(events) {
  if (events) 
    eventQueue = accumulateInto(eventQueue, events)
  var processingEventQueue = eventQueue
  eventQueue = null
  if (processingEventQueue) {
    forEachAccumulated(processingEventQueue, executeDispatchesAndRelease)
  }
}
