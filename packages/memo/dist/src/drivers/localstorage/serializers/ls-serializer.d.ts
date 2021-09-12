import { MemoEntry } from '../../../memo.types';
import { LsMemoSerializer } from './ls-serializer.type';
export declare class SimpleLsSerializer implements LsMemoSerializer {
    deserialize(serialized: string): Omit<MemoEntry, 'key'>;
    serialize(entry: Omit<MemoEntry, 'key'>): string;
}
//# sourceMappingURL=ls-serializer.d.ts.map