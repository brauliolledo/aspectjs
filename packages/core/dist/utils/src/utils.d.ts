/**
 * @public
 */
export interface AspectOptions {
    id?: string;
}
/**
 * @public
 */
export declare type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
/**
 * @public
 */
export declare function _getReferenceConstructor(proto: object & {
    constructor: {
        new (...args: unknown[]): unknown;
    };
}): any;
/**
 * @public
 */
export declare function _setReferenceConstructor<T>(proto: object, originalCtor: {
    new (...args: any[]): T;
}): void;
/**
 * @public
 */
export declare function isAspect(aspect: object | Function): boolean;
/**
 * @public
 */
export declare function assertIsAspect(aspect: object | Function): void;
/**
 * @public
 */
export declare function getAspectOptions(aspect: object | Function): AspectOptions;
/**
 * @public
 */
export declare function setAspectOptions(target: Function, options: AspectOptions): void;
/**
 * @internal
 */
export declare function __setDebug(debug: boolean): void;
/**
 * @public
 */
export declare function assert(condition: boolean, errorProvider?: () => Error): void;
/**
 * @public
 */
export declare function assert(condition: boolean, msg?: string): void;
/**
 * @public
 */
export declare function getOrComputeMetadata<T>(key: string, target: object, valueGenerator: () => T, save?: boolean): T;
/**
 * @public
 */
export declare function getOrComputeMetadata<T>(key: string, target: object, propertyKey: string, valueGenerator: () => T, save?: boolean): T;
/**
 * @public
 */
export declare function getProto(target: Record<string, any> | Function): Record<string, any> & {
    constructor?: new (...args: any[]) => any;
};
/**
 * @public
 */
export declare function isObject(value: any): value is object;
/**
 * @public
 */
export declare function isArray(value: any): value is any[];
/**
 * @public
 */
export declare function isString(value: any): value is string;
/**
 * @public
 */
export declare function isUndefined(value: any): value is undefined;
/**
 * @public
 */
export declare function isFunction(value: any): value is (...args: any[]) => any;
/**
 * @public
 */
export declare function isNumber(value: any): value is number;
/**
 * @public
 */
export declare function isEmpty(value: any): boolean;
/**
 * @public
 */
export declare function isPromise(obj: any): obj is Promise<any>;
//# sourceMappingURL=utils.d.ts.map