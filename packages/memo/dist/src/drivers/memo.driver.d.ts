import { MarshallingContext } from '../marshalling/marshalling-context';
import { MemoEntry, MemoKey } from '../memo.types';
/**
 * Connects the MemoAspect to a storage back-end
 * @public
 */
export declare abstract class MemoDriver {
    abstract getKeys(namespace?: string): Promise<MemoKey[]>;
    /**
     * Get the name of the driver this aspect uses.
     */
    abstract get NAME(): string;
    /**
     * Get the priority this driver should be picked up to handle the given type.
     */
    getPriority(context: MarshallingContext): number;
    accepts(context: MarshallingContext): boolean;
    /**
     * Returns the cached value.
     * @param key - the key of storage entry to read
     */
    abstract read(key: MemoKey): MemoEntry;
    /**
     * Returns a promise that is resolved once value is saved.
     */
    abstract write(entry: MemoEntry): PromiseLike<void>;
    abstract remove(key: MemoKey): PromiseLike<void>;
}
//# sourceMappingURL=memo.driver.d.ts.map