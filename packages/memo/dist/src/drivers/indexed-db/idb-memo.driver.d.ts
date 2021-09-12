import { MemoDriver } from '../memo.driver';
import { MemoEntry, MemoKey } from '../../memo.types';
import { LsMemoDriver } from '..';
import { MarshallingContext } from '../../marshalling/marshalling-context';
/**
 * Options supported by the IdbMemoDriver
 * @public
 */
export interface IndexedDbDriverOptions {
    indexedDB: typeof indexedDB;
    localStorageDriver: LsMemoDriver;
}
/**
 * Memo driver to store async @Memo result into the Indexed Database.
 * @public
 */
export declare class IdbMemoDriver extends MemoDriver {
    protected _params: Partial<IndexedDbDriverOptions>;
    static readonly NAME = "indexedDb";
    readonly NAME = "indexedDb";
    static readonly DATABASE_NAME = "IndexedDbMemoAspect_db";
    static readonly STORE_NAME = "results";
    static readonly DATABASE_VERSION = 1;
    private readonly _scheduler;
    private _init$;
    private _localStorageDriver;
    constructor(_params?: Partial<IndexedDbDriverOptions>);
    private get _idb();
    private get _ls();
    getKeys(namespace: string): Promise<MemoKey[]>;
    private _openDb;
    getPriority(context: MarshallingContext): number;
    accepts(context: MarshallingContext): boolean;
    read<T>(key: MemoKey): MemoEntry<T>;
    remove(key: MemoKey): PromiseLike<void>;
    write(entry: MemoEntry): PromiseLike<any>;
    private _deleteIdbEntry;
    private _deleteLsEntry;
    private _runTransactional;
    private _findLsDriver;
}
//# sourceMappingURL=idb-memo.driver.d.ts.map