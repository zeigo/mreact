import { NoWork } from "./ExpirationTime";


class Update {
  constructor() {
    this.expirationTime = NoWork
    this.next = null // Update
    this.partialState = null
  }
}