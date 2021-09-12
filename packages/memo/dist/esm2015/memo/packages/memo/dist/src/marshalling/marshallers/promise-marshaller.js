import { MemoMarshaller } from './marshaller.js';

/**
 * Supports marshalling promises
 * @public
 */
class PromiseMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Promise';
    }
    marshal(frame, context, defaultMarshal) {
        frame.setAsyncValue(frame.value.then((v) => defaultMarshal(v)));
        return frame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        if (frame.isAsync()) {
            return frame.async.then((v) => {
                return defaultUnmarshal(v);
            });
        }
        else {
            return Promise.resolve(defaultUnmarshal(frame.value));
        }
    }
}

export { PromiseMarshaller };
//# sourceMappingURL=promise-marshaller.js.map
