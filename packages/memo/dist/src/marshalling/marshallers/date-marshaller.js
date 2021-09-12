import { parse, stringify } from 'flatted';
import { MemoMarshaller } from './marshaller';
/**
 * Supports marshalling Dates
 * @public
 */
export class DateMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Date';
    }
    marshal(frame) {
        return frame.setValue(stringify(frame.value));
    }
    unmarshal(frame) {
        return new Date(parse(frame.value));
    }
}
//# sourceMappingURL=date-marshaller.js.map