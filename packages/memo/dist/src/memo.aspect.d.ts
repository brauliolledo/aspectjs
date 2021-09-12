import { AroundContext, AspectType, BeforeContext, JoinPoint } from '@aspectjs/core/commons';
import { MemoDriver } from './drivers';
import { MemoMarshaller } from './marshalling/marshallers';
import { MemoKey } from './memo.types';
/**
 * @public marshallers that gets configured with default MemoAspect
 */
export declare const DEFAULT_MARSHALLERS: MemoMarshaller[];
/**
 * Options accepted by MemoAspect
 * @public
 */
export interface MemoAspectOptions {
    /** use a namespace to avoid collision of data between eg: 2 different users */
    namespace?: string | (() => string);
    /** configure cache expiration in milliseconds or at a given specific date */
    expiration?: Date | number | (() => Date | number);
    /** get the identity of the class whose methods generates memoized data */
    id?: string | number | ((ctxt: BeforeContext<any, any>) => string | number);
    /** function that based on the execution context, generates the key to store cached data  */
    createMemoKey?: (ctxt: BeforeContext<any, any>) => MemoKey | string;
    /** marshallers to transform objects from / to storable structure */
    marshallers?: MemoMarshaller[];
    /** drivers that do the actual storage **/
    drivers?: MemoDriver[];
}
/**
 * Enable Memoization of a method's return value.
 * @public
 */
export declare class MemoAspect implements AspectType {
    protected _options: MemoAspectOptions;
    private readonly _drivers;
    /** maps memo keys with its unregister function for garbage collector timeouts */
    private readonly _entriesGc;
    private _marshallers;
    private _pendingResults;
    private _enabled;
    constructor(params?: MemoAspectOptions);
    getDrivers(): Record<string, MemoDriver>;
    addDriver(...drivers: MemoDriver[]): this;
    onEnable(): void;
    addMarshaller(...marshallers: MemoMarshaller[]): void;
    removeMarshaller(...marshallers: MemoMarshaller[]): void;
    /**
     * Apply the memo pattern. That is, get the result from cache if any, or call the original method and store the result otherwise.
     */
    applyMemo(ctxt: AroundContext<any>, jp: JoinPoint): any;
    private _removeValue;
    private _scheduleCleaner;
    private _initGc;
    private getExpiration;
}
//# sourceMappingURL=memo.aspect.d.ts.map