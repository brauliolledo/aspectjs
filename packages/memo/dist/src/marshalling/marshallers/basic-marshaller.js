import { MemoMarshaller } from './marshaller';
/**
 * Supports marshalling primitives
 * @public
 */
export class BasicMarshaller extends MemoMarshaller {
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
//# sourceMappingURL=basic-marshaller.js.map