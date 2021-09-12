import { MemoMarshaller } from './marshaller';
/**
 * Supports marshalling promises
 * @public
 */
export class PromiseMarshaller extends MemoMarshaller {
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
//# sourceMappingURL=promise-marshaller.js.map