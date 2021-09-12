import { MemoFrame } from '../drivers';
import { MemoMarshaller } from './marshallers';
import { MarshallingContext, UnmarshallingContext } from './marshalling-context';
export declare class MarshallersRegistry {
    private _marshallers;
    addMarshaller(...marshallers: MemoMarshaller[]): this;
    removeMarshaller(...marshallers: MemoMarshaller[]): this;
    getMarshaller(typeName: string): MemoMarshaller;
    marshal<T>(value: T): MarshallingContext<T>;
    unmarshal(frame: MemoFrame<any>): UnmarshallingContext<any>;
}
//# sourceMappingURL=marshallers-registry.d.ts.map