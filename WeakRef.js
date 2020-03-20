import { createRequire } from 'module';
const require = createRequire(new URL(import.meta.url));
const CPPWeakRef = require('./build/Release/WeakRef.node');

const stronglyHeld = new WeakSet();

export default class WeakRef {
    #cppWeakRef;

    constructor(value) {
        this.#cppWeakRef = new CPPWeakRef(value);
    }

    deref() {
        const value = this.#cppWeakRef.deref();
        if (value) {
            stronglyHeld.add(value);
            queueMicrotask(() => stronglyHeld.delete(value))
        }
        return value;
    }
}
