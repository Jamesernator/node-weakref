import WeakRef from './WeakRef.js';

/**
 * @template Holdings
 * @param {WeakRef<object>} weakRef  
 * @param {number} delay
 * @param {() => void} callback
 * @returns {() => void}
 */
function pollWeakRef(weakRef, delay, callback) {
    let timeout = setTimeout(pollOnce, delay);

    function pollOnce() {
        if (weakRef.deref()) {
            return callback();
        }
        timeout = setTimeout(pollOnce, delay);
    }

    return () => clearTimeout(timeout);
}

/**
 * @template {object} T
 * @template Holdings
 * @template {object | undefined} UnregisterToken
 */
module.exports = class FinalizationGroup {
    /** @type {(holdings: Holdings) => void} */
    #cleanupCallback;
    /** @type {number} */
    #pollDelay;
    /** @type {Map<NonNullable<UnregisterToken>, () => void>} */
    #cancelPolls = new Map();

    /**
     * @param {(holdings: Holdings) => void} cleanupCallback
     * @param {number} pollDelay
     */
    constructor(cleanupCallback, pollDelay=16) {
        if (typeof cleanupCallback !== 'function') {
            throw new TypeError("Cleanup callback must be a function")
        }
        this.#cleanupCallback = cleanupCallback;
        this.#pollDelay = pollDelay;
    }

    /**
     * 
     * @param {T} value
     * @param {Holdings} holdings
     * @param {UnregisterToken} unregisterToken 
     */
    register(value, holdings, unregisterToken) {
        const weakRef = new WeakRef(value);
        const cancelPoll = pollWeakRef(weakRef, this.#pollDelay, () => {
            this.#cleanupCallback(holdings);
            if (unregisterToken) {
                // @ts-ignore
                this.#cancelPolls.delete(unregisterToken);
            }
        })
        if (unregisterToken) {
            // @ts-ignore
            this.#cancelPolls.set(unregisterToken, cancelPoll);
        }
    }

    /**
     * 
     * @param {NonNullable<UnregisterToken>} unregisterToken 
     */
    unregister(unregisterToken) {
        this.#cancelPolls.delete(unregisterToken);
    }

    /**
     * @param {(holdings: Holdings) => void} cleanupCallback
     */
    cleanupSome(cleanupCallback) {
        // This implementation doesn't batch callbacks so cleanupSome does
        // nothing
    }
}
