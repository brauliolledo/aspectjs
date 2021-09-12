import { MemoEntry } from '../../../memo.types';
import { SimpleLsSerializer } from './ls-serializer';
/**
 * Uses lz-string to compress serialized values in order to save-up some LocalStorage space.
 * @public
 */
export declare class LzMemoSerializer<T = unknown> extends SimpleLsSerializer {
    deserialize(str: string): Omit<MemoEntry, 'key'>;
    serialize(obj: MemoEntry): string;
}
//# sourceMappingURL=lz-memo.serializer.d.ts.map