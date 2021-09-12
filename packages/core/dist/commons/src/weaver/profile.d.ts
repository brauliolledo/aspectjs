import { AspectType } from '../aspect';
/**
 * A WeaverProfile is a set of Aspects that can be enabled or disabled.
 * The profile itself is meant to be enabled on a Weaver, making it easy to enable multiples aspects at once.
 * @public
 */
export declare class WeaverProfile {
    protected _aspectsRegistry: {
        [aspectId: string]: AspectType;
    };
    constructor();
    enable(...aspects: (AspectType | WeaverProfile)[]): this;
    disable(...aspects: (AspectType | string | WeaverProfile)[]): this;
    reset(): this;
    setEnabled(aspect: AspectType, enabled: boolean): this;
    getAspect<T extends AspectType>(aspect: string | (new () => T)): T | undefined;
    getAspects<T extends AspectType>(): AspectType[];
    [Symbol.iterator](): Iterator<AspectType>;
}
//# sourceMappingURL=profile.d.ts.map