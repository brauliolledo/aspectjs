import { MemoMarshaller } from '@aspectjs/memo';
import { from } from 'rxjs';
import { shareReplay, share } from 'rxjs/operators';

/**
 * Supports marshalling Observables
 * @public
 */
class ObservableMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Observable';
    }
    marshal(frame, context, defaultMarshal) {
        frame.setAsyncValue(frame.value
            .pipe(shareReplay(1))
            .toPromise()
            .then((v) => defaultMarshal(v)));
        return frame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        if (frame.isAsync()) {
            return from(frame.async.then((v) => defaultUnmarshal(v))).pipe(share());
        }
        else {
            return from(Promise.resolve(defaultUnmarshal(frame.value)));
        }
    }
}

export { ObservableMarshaller };
//# sourceMappingURL=observable-marshaller.js.map
