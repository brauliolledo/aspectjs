import { MemoFrame } from '../../drivers';
import { MemoMarshaller } from './marshaller';
/**
 * Supports marshalling Dates
 * @public
 */
export declare class DateMarshaller extends MemoMarshaller<Date, string> {
    readonly types = "Date";
    marshal(frame: MemoFrame<Date>): MemoFrame<string>;
    unmarshal(frame: MemoFrame<string>): Date;
}
//# sourceMappingURL=date-marshaller.d.ts.map