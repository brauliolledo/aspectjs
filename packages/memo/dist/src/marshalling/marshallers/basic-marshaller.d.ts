import { MemoFrame } from '../../drivers';
import { MemoMarshaller } from './marshaller';
/**
 * Supports marshalling primitives
 * @public
 */
export declare class BasicMarshaller extends MemoMarshaller<any> {
    readonly types: string[];
    marshal<T>(frame: MemoFrame<T>): MemoFrame<T>;
    unmarshal<T>(frame: MemoFrame<T>): T;
}
//# sourceMappingURL=basic-marshaller.d.ts.map