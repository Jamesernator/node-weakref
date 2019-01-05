'use strict'
const test = require('ava')
const WeakRef = require('../WeakRef.js')

test("a weak reference can be deferenced while it is still in scope", t => {
    const a = { x: 10 }
    
    const weakRef = new WeakRef(a)

    t.is(a, weakRef.deref())
})

test("once the object a weak reference points to is garbage collected .deref() returns undefined", t => {
    let a = { x: 10 }

    const weakRef = new WeakRef(a)

    a = null

    gc()

    t.log(weakRef.deref())

    t.is(undefined, weakRef.deref())
})

test("once .deref is called the object should last for the microtask but remain collectable", async t => {
    let a = { x: 10 }

    const weakRef = new WeakRef(a)

    t.is(a, weakRef.deref())

    a = null

    gc()

    t.deepEqual({ x: 10 }, weakRef.deref())

    await new Promise(resolve => setTimeout(resolve, 100))

    gc()

    t.is(undefined, weakRef.deref())
})

test("creating multiple weak refs still allows the object to be collected", async t => {
    {
        let a = { x: 10 }

        const weakRef1 = new WeakRef(a)
        const weakRef2 = new WeakRef(a)

        a = null
        gc()
        
        t.is(undefined, weakRef1.deref())
        t.is(undefined, weakRef2.deref())
    }

    {
        let a = { x: 10 }

        const weakRef1 = new WeakRef(a)
        const weakRef2 = new WeakRef(a)

        t.is(a, weakRef1.deref())
        t.is(a, weakRef2.deref())

        a = null
        gc()

        t.deepEqual(weakRef1.deref(), { x: 10 })
        t.deepEqual(weakRef2.deref(), { x: 10 })

        await new Promise(resolve => setTimeout(resolve, 100))

        gc()

        t.is(undefined, weakRef1.deref())
        t.is(undefined, weakRef2.deref())
    }
})

test("WeakRef must require the only argument to be an object", t => {
    t.throws(() => new WeakRef())
    t.throws(() => new WeakRef(10))
    t.notThrows(() => new WeakRef({ x: 10 }))
    t.notThrows(() => new WeakRef(() => 12))
})