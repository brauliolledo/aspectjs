import { MemoFrame } from '../../drivers';
import { MemoMarshaller } from './marshaller';
/**
 * Pass-through marshaller
 * @public
 */
export declare abstract class NoopMarshaller extends MemoMarshaller {
    marshal<T>(value: T): MemoFrame<T>;
    unmarshal<T>(frame: MemoFrame<T>): T;
}
//# sourceMappingURL=noop-marshaller.d.ts.map