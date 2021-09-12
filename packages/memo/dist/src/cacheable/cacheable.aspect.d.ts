import { AdviceType, CompileContext } from '@aspectjs/core/commons';
/**
 * @public
 */
export declare type Prototype = {
    constructor: Function;
};
/**
 * Store the signature of an object annotated wuth @Cacheable in order
 * to be able to cache it with the @Memo annotation
 *
 * @public
 */
export interface CacheableAspect {
    readonly cacheTypeStore: CacheTypeStore;
}
/**
 * @public
 */
export interface CacheTypeStore {
    getPrototype(key: string): Prototype;
    getVersion(key: string): any;
    getTypeKey<T extends Prototype>(proto: T): string;
    addPrototype<T extends Prototype>(proto: T, key: string, version?: any): void;
}
/**
 * Assign a key to the prototype of a class into a CacheTypeStore,
 * so that Memo drivers can inflate memoized objects with proper types.
 *
 * @public
 */
export declare class DefaultCacheableAspect implements CacheableAspect {
    readonly cacheTypeStore: CacheTypeStore;
    constructor(cacheTypeStore?: CacheTypeStore);
    registerCacheKey(ctxt: CompileContext<any, AdviceType.CLASS>): void;
}
/**
 * Store class prototypes along with a defined key.
 * @internal
 */
export declare class _CacheTypeStoreImpl implements CacheTypeStore {
    private readonly _prototypes;
    getPrototype(key: string): Prototype;
    getTypeKey<T extends Prototype>(prototype: T): string;
    addPrototype(proto: Prototype, typeId: string, version?: string): void;
    getVersion(key: string): string;
}
//# sourceMappingURL=cacheable.aspect.d.ts.map