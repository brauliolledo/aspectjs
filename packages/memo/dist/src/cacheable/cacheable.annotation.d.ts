import { AnnotationRef } from '@aspectjs/core/commons';
/**
 * Options accepted by the \@Cacheable annotation.
 *
 * @public
 */
export interface CacheableOptions {
    /** Identifies the type of object to be cached. If not provided, a typeId should is generated automatically **/
    typeId?: string;
    /** Any entry of the @Cacheable object with a different version is evicted from the cache. Supports SemVer versioning **/
    version?: string | number | (() => string | number);
}
declare function Cacheable(opts?: CacheableOptions): ClassDecorator;
declare function Cacheable(typeId?: string): ClassDecorator;
/**
 * Indicates that the result of annotated method could be cached.
 * @public
 */
declare const _Cacheable: typeof Cacheable & AnnotationRef;
export { _Cacheable as Cacheable };
//# sourceMappingURL=cacheable.annotation.d.ts.map