
export default class WeakRef<T extends object> {
    constructor(value: T);

    deref(): T | undefined;
}
