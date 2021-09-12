import { MemoMarshaller } from './marshaller.js';
import { MemoFrame } from '../../drivers/memo-frame.js';

/**
 * Pass-through marshaller
 * @public
 */
class NoopMarshaller extends MemoMarshaller {
    marshal(value) {
        return new MemoFrame({
            value,
        });
    }
    unmarshal(frame) {
        return frame.value;
    }
}

export { NoopMarshaller };
//# sourceMappingURL=noop-marshaller.js.map
