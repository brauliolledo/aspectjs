import { stringify, parse } from '../../../../../../node_modules/flatted/esm/index.js';
import { MemoMarshaller } from './marshaller.js';

/**
 * Supports marshalling Dates
 * @public
 */
class DateMarshaller extends MemoMarshaller {
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

export { DateMarshaller };
//# sourceMappingURL=date-marshaller.js.map
