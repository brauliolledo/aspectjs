import { MemoKey } from '../../memo.types';
import { InstantPromise } from '../../utils';
import { MemoDriver } from '../memo.driver';
import { SimpleLsSerializer } from './serializers/ls-serializer';
/**
 * @public
 */
export const DEFAULT_LS_DRIVER_OPTIONS = {
    serializer: new SimpleLsSerializer(),
};
/**
 * Memo driver to store async @Memo result into the Indexed Database.
 * @public
 */
export class LsMemoDriver extends MemoDriver {
    constructor(options) {
        super();
        this.options = options;
        this.NAME = LsMemoDriver.NAME;
        this.options = Object.assign(Object.assign({}, DEFAULT_LS_DRIVER_OPTIONS), options);
        if (!this._ls) {
            throw new Error('localStorage not available on this platform, and no implementation was provided');
        }
    }
    get _ls() {
        var _a;
        return (_a = this.options.localStorage) !== null && _a !== void 0 ? _a : localStorage;
    }
    getKeys(namespace) {
        const res = [];
        for (let i = 0; i < this._ls.length; ++i) {
            const kStr = this._ls.key(i);
            const key = MemoKey.parse(kStr, false);
            if ((key === null || key === void 0 ? void 0 : key.namespace) === namespace) {
                res.push(key);
            }
        }
        return Promise.resolve(res);
    }
    /**
     * Accepts all kind of results
     * @param context - the marshalling context for the current 'to-be-stored' value
     */
    getPriority(context) {
        return 10;
    }
    read(key) {
        var _a, _b;
        const serializer = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.serializer) !== null && _b !== void 0 ? _b : DEFAULT_LS_DRIVER_OPTIONS.serializer;
        const frame = serializer.deserialize(this._ls.getItem(key.toString()));
        return frame
            ? Object.assign({ key }, frame) : undefined;
    }
    write(entry) {
        var _a, _b;
        const serializer = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.serializer) !== null && _b !== void 0 ? _b : DEFAULT_LS_DRIVER_OPTIONS.serializer;
        this._ls.setItem(entry.key.toString(), serializer.serialize(entry));
        return InstantPromise.resolve();
    }
    remove(key) {
        this._ls.removeItem(key.toString());
        return InstantPromise.resolve();
    }
}
LsMemoDriver.NAME = 'localStorage';
//# sourceMappingURL=localstorage.driver.js.map