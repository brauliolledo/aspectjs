import { MemoFrame } from '../../drivers';
import { MarshalFn, MemoMarshaller, UnmarshalFn } from './marshaller';
import { MarshallingContext, UnmarshallingContext } from '../marshalling-context';
/**
 * Supports marshalling simple objects
 * @public
 */
export declare class ObjectMarshaller extends MemoMarshaller {
    readonly types: string[];
    marshal(frame: MemoFrame<object>, context: MarshallingContext, defaultMarshal: MarshalFn): MemoFrame<object>;
    unmarshal(frame: MemoFrame<object>, context: UnmarshallingContext, defaultUnmarshal: UnmarshalFn): object;
}
//# sourceMappingURL=object-marshaller.d.ts.map