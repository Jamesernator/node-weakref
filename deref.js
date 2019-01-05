'use strict'
const makeWeakRef = require('./index.js')
const a = { x: 10 }

const deref = makeWeakRef(a)

deref()
