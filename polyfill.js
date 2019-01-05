'use strict'

const { WeakRef, FinalizationGroup } = require('./index.js')

global.WeakRef = WeakRef
global.FinalizationGroup = FinalizationGroup