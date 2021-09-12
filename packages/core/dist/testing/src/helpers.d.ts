import { AnnotationRef, AspectType, WeaverContext } from '@aspectjs/core/commons';
/**
 * Dummy object interface used for test purpose
 * @public
 */
export interface Labeled {
    labels?: string[];
    addLabel?: (...args: any[]) => any;
}
/**
 * Setup a brand new WEAVER_CONTEXT for test purposes
 * @public
 */
export declare function setupTestingWeaverContext(...aspects: AspectType[]): WeaverContext;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const AClass: (() => ClassDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const BClass: (() => ClassDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const CClass: (() => ClassDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const DClass: (() => ClassDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const XClass: (() => ClassDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const AProperty: (() => PropertyDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const BProperty: (() => PropertyDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const CProperty: (() => PropertyDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const DProperty: (() => PropertyDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const XProperty: (() => PropertyDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const AMethod: (() => MethodDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const BMethod: (() => MethodDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const CMethod: (() => MethodDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const DMethod: (() => MethodDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const XMethod: (() => MethodDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const AParameter: ((...args: any[]) => ParameterDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const BParameter: ((...args: any[]) => ParameterDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const CParameter: ((...args: any[]) => ParameterDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const DParameter: ((...args: any[]) => ParameterDecorator) & AnnotationRef;
/**
 * Dummy annotation useful for tests
 * @public
 */
export declare const XParameter: ((...args: any[]) => ParameterDecorator) & AnnotationRef;
//# sourceMappingURL=helpers.d.ts.map