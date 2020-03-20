import { createRequire } from 'module';
const require = createRequire(new URL(import.meta.url));
const CPPWeakRef = require('./build/Release/WeakRef.node');

const stronglyHeld = new WeakSet();

/**
 * @template {object} T
 */
export default class WeakRef {
    /**
     * @type {WeakRef<T>}
     */
    #cppWeakRef;

    /**
     * @param {T} value 
     */
    constructor(value) {
        this.#cppWeakRef = new CPPWeakRef(value);
    }

    /**
     * @returns {T | undefined}
     */
    deref() {
        const value = this.#cppWeakRef.deref();
        if (value) {
            stronglyHeld.add(value);
            queueMicrotask(() => stronglyHeld.delete(value))
        }
        return value;
    }
}
