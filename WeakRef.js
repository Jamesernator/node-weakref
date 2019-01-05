'use strict';
const CppWeakRef = require('./build/Release/WeakRef.node')

const turnSet = new Set()

function queueMicrotask(func) {
  Promise.resolve().then(function() {
    func()
  })
}

module.exports = class WeakRef {
  constructor(...args) {
    this._cppWeakRef = new CppWeakRef(...args)
  }

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
