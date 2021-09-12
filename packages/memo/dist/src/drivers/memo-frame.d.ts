/**
 * Flat dehydrated representation of an object that can be stored easily
 * @public
 */
export interface MemoTypeInfoFrame {
    type?: string;
    instanceType?: string;
    expiration?: Date;
    version?: string;
}
/**
 * A MemoEntry once marshalled
 * @public
 */
export declare class MemoFrame<T = unknown> implements MemoTypeInfoFrame {
    type?: string;
    instanceType?: string;
    version?: string;
    value: T;
    hash?: string;
    async: Promise<T>;
    private _resolved;
    constructor(frame: Partial<MemoFrame<T>>);
    setValue<X>(value: X): MemoFrame<X>;
    setAsyncValue<X>(value: Promise<X>): MemoFrame<X>;
    isAsync(): boolean;
}
//# sourceMappingURL=memo-frame.d.ts.map