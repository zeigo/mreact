import { NoWork } from "./ExpirationTime";

class UpdateQueue {
  constructor() {
    this.first = null
    this.last = null
    this.expirationTime = NoWork
    this.isInitialized = false
    this.baseState = null
  }
}