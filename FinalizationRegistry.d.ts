
export default class FinalizationRegistry<
    T extends object,
    Holdings,
    UnregisterToken extends object=never
> {
    constructor(cleanupCallback: (holdings: Holdings) => void);

    register(value: T, holdings: Holdings, unregisterToken?: UnregisterToken);
    unregister(unregisterToken: UnregisterToken);
    cleanupSome(cleanupCallback: (holdings: Holdings) => void);
}
