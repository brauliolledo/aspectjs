import { MemoFrame } from '../../drivers';
import { MarshalFn, MemoMarshaller, UnmarshalFn } from './marshaller';
import { MarshallingContext, UnmarshallingContext } from '../marshalling-context';
/**
 * Supports marshalling promises
 * @public
 */
export declare class PromiseMarshaller extends MemoMarshaller<Promise<any>, any> {
    readonly types = "Promise";
    marshal(frame: MemoFrame<Promise<unknown>>, context: MarshallingContext, defaultMarshal: MarshalFn): MemoFrame<Promise<any>>;
    unmarshal(frame: MemoFrame<MemoFrame<any>>, context: UnmarshallingContext, defaultUnmarshal: UnmarshalFn): Promise<any>;
}
//# sourceMappingURL=promise-marshaller.d.ts.map