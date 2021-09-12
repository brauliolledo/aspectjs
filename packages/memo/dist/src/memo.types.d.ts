import { MemoFrame } from './drivers';
/**
 * @public
 */
export declare class MemoKey {
    readonly namespace: string;
    readonly targetKey: string;
    readonly instanceId: string;
    readonly argsKey: string;
    private readonly _strValue;
    constructor(key: Omit<MemoKey, '_strValue'>, namespace?: string);
    static parse(str: string, throwIfInvalid?: boolean): MemoKey | null;
    toString(): string;
}
/**
 * @public
 */
export interface MemoEntry<T = any> {
    readonly key: MemoKey;
    readonly frame: MemoFrame<T>;
    readonly signature?: string;
    readonly expiration?: Date;
}
//# sourceMappingURL=memo.types.d.ts.map