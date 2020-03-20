import WeakRef from './WeakRef.js';

/**
 * @template Holdings
 * @param {WeakRef<object>} weakRef 
 * @param {Holdings} holdings 
 * @param {(holdings: Holdings) => void} callback 
 * @param {number} delay 
 * @returns {() => void}
 */
function poll(weakRef, holdings, callback, delay) {
    let timeout = setTimeout(pollOnce, delay);

    function pollOnce() {
        if (weakRef.deref()) {
            return callback(holdings);
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
        
    }

    /**
     * @param {(holdings: Holdings) => void} cleanupCallback
     */
    cleanupSome(cleanupCallback) {
        // This implementation doesn't batch callbacks so cleanupSome does
        // nothing
    }
}
