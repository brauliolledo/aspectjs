import { MemoMarshaller } from './marshaller.js';

/**
 * Supports marshalling primitives
 * @public
 */
class BasicMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = ['Number', 'String', 'Boolean', 'symbol', 'number', 'string', 'boolean', 'symbol', 'undefined'];
    }
    marshal(frame) {
        return frame;
    }
    unmarshal(frame) {
        return frame.value;
    }
}

export { BasicMarshaller };
//# sourceMappingURL=basic-marshaller.js.map
