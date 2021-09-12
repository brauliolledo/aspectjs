import { MarshallingContext } from '../../marshalling/marshalling-context';
import { MemoEntry, MemoKey } from '../../memo.types';
import { MemoDriver } from '../memo.driver';
import { SimpleLsSerializer } from './serializers/ls-serializer';
import { LsMemoSerializer } from './serializers/ls-serializer.type';
/**
 * Options supported by the LsMemoDriver
 * @public
 */
export interface LsMemoDriverOptions {
    localStorage?: typeof localStorage;
    serializer?: LsMemoSerializer;
}
/**
 * @public
 */
export declare const DEFAULT_LS_DRIVER_OPTIONS: {
    serializer: SimpleLsSerializer;
};
/**
 * Memo driver to store async @Memo result into the Indexed Database.
 * @public
 */
export declare class LsMemoDriver extends MemoDriver {
    options?: LsMemoDriverOptions;
    static readonly NAME = "localStorage";
    readonly NAME = "localStorage";
    constructor(options?: LsMemoDriverOptions);
    private get _ls();
    getKeys(namespace: string): Promise<MemoKey[]>;
    /**
     * Accepts all kind of results
     * @param context - the marshalling context for the current 'to-be-stored' value
     */
    getPriority(context: MarshallingContext): number;
    read<T>(key: MemoKey): MemoEntry<T>;
    write(entry: MemoEntry): PromiseLike<void>;
    remove(key: MemoKey): PromiseLike<void>;
}
//# sourceMappingURL=localstorage.driver.d.ts.map