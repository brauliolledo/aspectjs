import { isPromise } from '@aspectjs/core/utils';
/**
 * A MemoEntry once marshalled
 * @public
 */
export class MemoFrame {
    constructor(frame) {
        Object.assign(this, frame);
    }
    setValue(value) {
        this._resolved = true;
        this.async = null;
        const frame = this;
        frame.value = value;
        return frame;
    }
    setAsyncValue(value) {
        const frame = this;
        this._resolved = false;
        this.async = value.then((v) => {
            frame.value = v;
            this._resolved = true;
            return frame.value;
        });
        return frame;
    }
    isAsync() {
        return isPromise(this.async);
    }
}
//# sourceMappingURL=memo-frame.js.map