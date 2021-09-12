import { MarshallingContext, UnmarshallingContext, MemoFrame, MarshalFn, MemoMarshaller, UnmarshalFn } from '@aspectjs/memo';
import { Observable } from 'rxjs';
/**
 * Supports marshalling Observables
 * @public
 */
export declare class ObservableMarshaller extends MemoMarshaller<Observable<any>, any> {
    readonly types = "Observable";
    marshal(frame: MemoFrame<Observable<unknown>>, context: MarshallingContext, defaultMarshal: MarshalFn): MemoFrame<Observable<any>>;
    unmarshal(frame: MemoFrame<MemoFrame<any>>, context: UnmarshallingContext, defaultUnmarshal: UnmarshalFn): Observable<any>;
}
//# sourceMappingURL=observable-marshaller.d.ts.map