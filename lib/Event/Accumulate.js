// current: null/undefined, notArray, array;
// next: notArray, array
export function accumulateInto(current, next) {
  if (current == null) return next

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next)
      return current
    }
    current.push(next)
    return current
  }

  if (Array.isArray(next)) {
    next.unshift(current)
    return next
  }
  return [current, next]
}

export function forEachAccumulated(arr, callback, context) {
  if (Array.isArray(arr)) {
    arr.forEach(callback, context);
  } else if (arr) {
    callback.call(context, arr);
  }
}