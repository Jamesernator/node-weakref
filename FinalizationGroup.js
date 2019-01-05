'use strict'
const WeakRef = require('./WeakRef.js')

function queueMicrotask(func) {
  Promise.resolve().then(function() {
    func()
  })
}


class Queue {
  constructor() {
    this._queue = new Set()
  }

  get length() {
    return this._queue.size
  }

  enqueue(value) {
    this._queue.add({ value })
  }

  dequeue() {
    if (this._queue.size === 0) {
      throw new Error("Can't dequeue from empty queue")
    }
    const [first] = this._queue
    this._queue.delete(first)
    return first.value
  }
}

class CleanupIterator {
  constructor(queue) {
    this._queue = queue
  }

  next() {
    if (this._queue.length === 0) {
      return { done: true, value: undefined }
    } else {
      return { done: false, value: this._queue.dequeue() }
    }
  }

  [Symbol.iterator]() {
    return this
  }
}

function poll(weakRef, holdings, callback, delay) {
  if (weakRef.deref() === undefined) {
    callback(holdings)
  } else {
    setTimeout(poll, delay, weakRef, holdings, callback, delay)
  }
}

async function poll(weakRef, holdings, callback, delay) {
  while (weakRef.deref() !== undefined) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  callback(holdings)
}

module.exports = class FinalizationGroup {
  constructor(cleanupCallback, pollDelay=16) {
    this._cleanupCallback = cleanupCallback
    this._queue = new Queue()
    this._pollDelay = pollDelay
  }

  _triggerCleanup(holdings) {
    this._queue.enqueue(holdings)
    
    queueMicrotask(() => {
      this._cleanupCallback(new CleanupIterator(this._queue))
    })
  }

  _beginPoll(weakRef, holdings) {
    queueMicrotask(() => {
      poll(weakRef, holdings, () => this._triggerCleanup(holdings), this._pollDelay)
    })
  }

  register(value, holdings) {
    const weakRef = new WeakRef(value)

    this._beginPoll(weakRef, holdings)
  }

  cleanupSome(cleanupCallback) {
    if (this._queue.length) {
      cleanupCallback(new CleanupIterator(this._queue))
    }
  }
}