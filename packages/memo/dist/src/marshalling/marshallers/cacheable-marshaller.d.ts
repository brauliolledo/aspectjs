import { MemoFrame } from '../../drivers';
import { MarshalFn, MemoMarshaller } from './marshaller';
import { ObjectMarshaller } from './object-marshaller';
import { MarshallingContext, UnmarshallingContext } from '../marshalling-context';
/**
 * Supports marshalling instances of classes annotated with @Cacheable
 * @public
 */
export declare class CacheableMarshaller extends MemoMarshaller {
    readonly types = "*";
    private _objectMarshaller;
    private _nonCacheableHandler;
    constructor(options?: {
        objectMarshaller: ObjectMarshaller;
        nonCacheableHandler: (proto: object) => void;
    });
    marshal(frame: MemoFrame<object>, context: MarshallingContext, defaultMarshal: MarshalFn): MemoFrame;
    unmarshal(frame: MemoFrame<object>, context: UnmarshallingContext, defaultUnmarshal: MarshalFn): any;
}
//# sourceMappingURL=cacheable-marshaller.d.ts.map