import { decompressFromUTF16, compressToUTF16 } from '../../../utils/lz-string.js';
import { SimpleLsSerializer } from './ls-serializer.js';

/**
 * Uses lz-string to compress serialized values in order to save-up some LocalStorage space.
 * @public
 */
class LzMemoSerializer extends SimpleLsSerializer {
    deserialize(str) {
        if (!str) {
            return null;
        }
        return super.deserialize(decompressFromUTF16(str));
    }
    serialize(obj) {
        if (!obj) {
            return null;
        }
        return compressToUTF16(super.serialize(obj));
    }
}

export { LzMemoSerializer };
//# sourceMappingURL=lz-memo.serializer.js.map
