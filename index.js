'use strict'

module.exports = {
  get WeakRef() {
    return require('./WeakRef.js')
  },

  get FinalizationGroup() {
    return require('./FinalizationGroup.js')
  },
}