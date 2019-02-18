'use strict';
const CppWeakRef = require('./build/Release/WeakRef.node')

const turnSet = new Set()

/**
 * @param {() => void} func
 */
function queueMicrotask(func) {
  Promise.resolve().then(function() {
    func()
  })
}

/**
 * @template T
 */
module.exports = class WeakRef {
  /**
   * @param {T} object
   */
  constructor(object) {
    this._cppWeakRef = new CppWeakRef(object)
  }

  /**
   * @returns { T | undefined }
   */
  deref() {
    const value = this._cppWeakRef.deref()
    if (value) {
      const strongRef = { value }
      turnSet.add(strongRef)
      queueMicrotask(() => {
        turnSet.delete(strongRef)
      })
    }
    return value
  }
}
