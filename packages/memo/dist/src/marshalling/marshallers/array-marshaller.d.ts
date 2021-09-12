import { MemoFrame } from '../../drivers';
import { MarshalFn, MemoMarshaller, UnmarshalFn } from './marshaller';
import { MarshallingContext, UnmarshallingContext } from '../marshalling-context';
/**
 * Supports marshalling arrays
 * @public
 */
export declare class ArrayMarshaller extends MemoMarshaller {
    readonly types = "Array";
    marshal(frame: MemoFrame<unknown[]>, context: MarshallingContext, defaultMarshal: MarshalFn): MemoFrame<any[]>;
    unmarshal(frame: MemoFrame<unknown[]>, context: UnmarshallingContext, defaultUnmarshal: UnmarshalFn): unknown[];
}
//# sourceMappingURL=array-marshaller.d.ts.map