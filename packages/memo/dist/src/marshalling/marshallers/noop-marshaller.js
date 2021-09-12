import { MemoFrame } from '../../drivers';
import { MemoMarshaller } from './marshaller';
/**
 * Pass-through marshaller
 * @public
 */
export class NoopMarshaller extends MemoMarshaller {
    marshal(value) {
        return new MemoFrame({
            value,
        });
    }
    unmarshal(frame) {
        return frame.value;
    }
}
//# sourceMappingURL=noop-marshaller.js.map