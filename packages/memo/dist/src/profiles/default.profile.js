import { WeaverProfile } from '@aspectjs/core/commons';
import { DefaultCacheableAspect } from '../cacheable/cacheable.aspect';
import { IdbMemoDriver, LsMemoDriver, LzMemoSerializer } from '../drivers';
import { DEFAULT_MARSHALLERS, MemoAspect } from '../memo.aspect';
/**
 * Weaver profile configured with
 * - LsMemoAspect (for synchronous @Memo methods)
 *     - LzMemoHandler to compress data stored in LocalStorage
 * - IndexedDbMemoAspect (for asynchronous @Memo methods)
 * @public
 */
export class MemoProfile extends WeaverProfile {
    constructor(memoProfileFeatures) {
        var _a, _b, _c, _d;
        super();
        this._features = {
            useLocalStorage: true,
            useIndexedDb: true,
            useLzString: true,
            options: {},
        };
        this.enable(new DefaultCacheableAspect());
        this._features.options = (_a = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.options) !== null && _a !== void 0 ? _a : this._features.options;
        this._features.useIndexedDb = (_b = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useIndexedDb) !== null && _b !== void 0 ? _b : this._features.useIndexedDb;
        this._features.useLzString = (_c = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useLzString) !== null && _c !== void 0 ? _c : this._features.useLzString;
        this._features.useLocalStorage = (_d = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useLocalStorage) !== null && _d !== void 0 ? _d : this._features.useLocalStorage;
        const marshallers = [...DEFAULT_MARSHALLERS];
        const drivers = [];
        if (this._features.useIndexedDb) {
            drivers.push(new IdbMemoDriver());
        }
        if (this._features.useLocalStorage) {
            let serializer;
            if (this._features.useLzString) {
                serializer = new LzMemoSerializer();
            }
            drivers.push(new LsMemoDriver({
                serializer,
            }));
        }
        const memoAspect = new MemoAspect(Object.assign(Object.assign({}, this._features.options), { marshallers,
            drivers }));
        this.enable(memoAspect);
    }
    configure(features) {
        return new MemoProfile(Object.assign(Object.assign({}, this._features), features));
    }
}
//# sourceMappingURL=default.profile.js.map