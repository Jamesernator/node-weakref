'use strict'
const test = require('ava')
const FinalizationGroup = require('../FinalizationGroup.js')
const WeakRef = require('../WeakRef.js')

function deferred() {
  const result = {}
  result.promise = new Promise((resolve, reject) => {
    Object.assign(result, { resolve, reject })
  })
  return result
}

function timeout(time) {
  return new Promise((_, reject) => {
    setTimeout(reject, time, `Timed out!`)
  })
}

class Banana {
  constructor() {
    
  }
}

test("a finalization group will call the cleanup callback when an item is collected", async t => {
  const def = deferred()
  let seenHoldings = new Set()

  const group = new FinalizationGroup(holdings => {
    for (const holding of holdings) {
      seenHoldings.add(holding)

      if (seenHoldings.size === 2) {
        def.resolve()
      }
    }
  })

  {
    let a = new Banana()
    let b = new Banana()

    group.register(a, 12)
    group.register(b, 17)

    a = null
    b = null

    gc()

    await def.promise

    t.is(seenHoldings.size, 2)
    t.true(seenHoldings.has(12))
    t.true(seenHoldings.has(17))
  }
})

test("if a holding is not consumed from the iterator it will still be available on the next call", async t => {
  const def = deferred()

  let call = 0
  let allHoldings = null
  const group = new FinalizationGroup(holdings => {
    call += 1
    if (call === 2) {
      allHoldings = [...holdings].sort((a, b) => a-b)
      def.resolve()
    }
  })

  {
    let a = new Banana()
    let b = new Banana()

    group.register(a, 12)
    group.register(b, 17)

    a = null
    b = null

    gc()

    await def.promise

    t.deepEqual(allHoldings, [12, 17])
  }
})

test("calling cleanupSome should call the given callback with any holdings still pending", async t => {
  const def = deferred()

  let call = 0

  const group = new FinalizationGroup(holdings => {
    call += 1
    if (call === 3) {
      holdings.next()
      def.resolve()
    }
  })

  {
    let a = new Banana()
    let b = new Banana()
    let c = new Banana()

    group.register(a, 12)
    group.register(b, 17)
    group.register(c, 23)

    a = null
    b = null
    c = null

    gc()

    await def.promise

    let remainingHoldings = []
    group.cleanupSome(([...holdings]) => { remainingHoldings = holdings })

    t.is(remainingHoldings.length, 2)
  }
})