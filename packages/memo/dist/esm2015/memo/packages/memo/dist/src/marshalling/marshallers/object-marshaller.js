import { assert } from '@aspectjs/core/utils';
import { MemoMarshaller } from './marshaller.js';

/**
 * Supports marshalling simple objects
 * @public
 */
class ObjectMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = ['Object', 'object'];
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    marshal(frame, context, defaultMarshal) {
        if (!frame.value) {
            return frame;
        }
        return frame.setValue([]
            .concat(Object.getOwnPropertyNames(frame.value))
            .concat(Object.getOwnPropertySymbols(frame.value))
            .reduce((w, k) => {
            const v = frame.value[k];
            w[k] = defaultMarshal(v);
            return w;
        }, {}));
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    unmarshal(frame, context, defaultUnmarshal) {
        if (frame.value === null) {
            return null;
        }
        const value = {};
        context.blacklist.set(frame, value);
        assert(!!frame.value);
        return []
            .concat(Object.getOwnPropertyNames(frame.value))
            .concat(Object.getOwnPropertySymbols(frame.value))
            .reduce((v, k) => {
            v[k] = defaultUnmarshal(frame.value[k]);
            return v;
        }, value);
    }
}

export { ObjectMarshaller };
//# sourceMappingURL=object-marshaller.js.map
