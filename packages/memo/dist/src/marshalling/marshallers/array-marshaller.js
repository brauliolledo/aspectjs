import { MemoMarshaller } from './marshaller';
/**
 * Supports marshalling arrays
 * @public
 */
export class ArrayMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Array';
    }
    marshal(frame, context, defaultMarshal) {
        // array may contain promises
        frame.value = frame.value.map((i) => defaultMarshal(i));
        return frame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        // assert(wrapped[F.TYPE] === ValueType.ARRAY);
        const value = [];
        context.blacklist.set(frame, value);
        value.push(...frame.value.map((w) => defaultUnmarshal(w)));
        return value;
    }
}
//# sourceMappingURL=array-marshaller.js.map