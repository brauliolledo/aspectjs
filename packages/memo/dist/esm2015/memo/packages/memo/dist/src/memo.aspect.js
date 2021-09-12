import { __decorate, __metadata } from '../../../../node_modules/tslib/tslib.es6.js';
import { Around, Aspect } from '@aspectjs/core/annotations';
import { AspectError, on } from '@aspectjs/core/commons';
import { isString, isFunction, isUndefined, getOrComputeMetadata, getProto } from '@aspectjs/core/utils';
import copy from '../../../../node_modules/fast-copy/dist/fast-copy.esm.js';
import { stringify } from '../../../../node_modules/flatted/esm/index.js';
import { VersionConflictError, MemoAspectError } from './errors.js';
import { MarshallersRegistry } from './marshalling/marshallers-registry.js';
import { Memo } from './memo.annotation.js';
import { MemoKey } from './memo.types.js';
import { ObjectMarshaller } from './marshalling/marshallers/object-marshaller.js';
import { ArrayMarshaller } from './marshalling/marshallers/array-marshaller.js';
import { DateMarshaller } from './marshalling/marshallers/date-marshaller.js';
import { PromiseMarshaller } from './marshalling/marshallers/promise-marshaller.js';
import { CacheableMarshaller } from './marshalling/marshallers/cacheable-marshaller.js';
import { BasicMarshaller } from './marshalling/marshallers/basic-marshaller.js';
import { provider } from './utils/provider.js';
import { hash } from './utils/hash.js';

/**
 * @public marshallers that gets configured with default MemoAspect
 */
const DEFAULT_MARSHALLERS = [
    new ObjectMarshaller(),
    new ArrayMarshaller(),
    new DateMarshaller(),
    new PromiseMarshaller(),
    new CacheableMarshaller(),
    new BasicMarshaller(),
];
Object.freeze(DEFAULT_MARSHALLERS);
const MEMO_ID_REFLECT_KEY = '@aspectjs:memo/id';
let internalId = 0;
const DEFAULT_MEMO_ASPECT_OPTIONS = {
    id: (ctxt) => {
        var _a, _b;
        const { id, _id, hashcode, _hashcode } = ctxt.instance;
        const result = (_b = (_a = id !== null && id !== void 0 ? id : _id) !== null && _a !== void 0 ? _a : hashcode) !== null && _b !== void 0 ? _b : _hashcode;
        if (isUndefined(result)) {
            return getOrComputeMetadata(MEMO_ID_REFLECT_KEY, ctxt.instance, () => internalId++);
        }
        return result;
    },
    namespace: '',
    createMemoKey: (ctxt) => {
        return new MemoKey({
            namespace: ctxt.data.namespace,
            instanceId: ctxt.data.instanceId,
            argsKey: hash(stringify(ctxt.args)),
            targetKey: hash(`${ctxt.target.ref}`),
        });
    },
    expiration: undefined,
    marshallers: DEFAULT_MARSHALLERS,
    drivers: [],
};
/**
 * Enable Memoization of a method's return value.
 * @public
 */
let MemoAspect = class MemoAspect {
    constructor(params) {
        var _a, _b;
        this._drivers = {};
        /** maps memo keys with its unregister function for garbage collector timeouts */
        this._entriesGc = new Map();
        this._pendingResults = new Map();
        this._options = Object.assign(Object.assign({}, DEFAULT_MEMO_ASPECT_OPTIONS), params);
        this._marshallers = new MarshallersRegistry();
        this.addMarshaller(...DEFAULT_MARSHALLERS, ...((_a = this._options.marshallers) !== null && _a !== void 0 ? _a : []));
        this.addDriver(...((_b = params === null || params === void 0 ? void 0 : params.drivers) !== null && _b !== void 0 ? _b : []));
    }
    getDrivers() {
        return this._drivers;
    }
    addDriver(...drivers) {
        (drivers !== null && drivers !== void 0 ? drivers : []).forEach((d) => {
            var _a, _b;
            const existingDriver = this._drivers[d.NAME];
            if (existingDriver === d) {
                return;
            }
            if (existingDriver) {
                throw new Error(`both ${(_a = d.constructor) === null || _a === void 0 ? void 0 : _a.name} & ${(_b = existingDriver.constructor) === null || _b === void 0 ? void 0 : _b.name} configured for name ${d.NAME}`);
            }
            this._drivers[d.NAME] = d;
            if (this._enabled) {
                this._initGc(d);
            }
        });
        return this;
    }
    onEnable() {
        this._enabled = true;
        Object.values(this._drivers).forEach((d) => this._initGc(d));
    }
    addMarshaller(...marshallers) {
        this._marshallers.addMarshaller(...marshallers);
    }
    removeMarshaller(...marshallers) {
        this._marshallers.removeMarshaller(...marshallers);
    }
    /**
     * Apply the memo pattern. That is, get the result from cache if any, or call the original method and store the result otherwise.
     */
    applyMemo(ctxt, jp) {
        var _a, _b, _c, _d;
        const memoParams = ctxt.annotations.onSelf(Memo)[0].args[0];
        ctxt.data.namespace = (_a = provider(memoParams === null || memoParams === void 0 ? void 0 : memoParams.namespace)()) !== null && _a !== void 0 ? _a : provider((_b = this._options) === null || _b === void 0 ? void 0 : _b.namespace)();
        ctxt.data.instanceId = `${(_c = provider(memoParams === null || memoParams === void 0 ? void 0 : memoParams.id)(ctxt)) !== null && _c !== void 0 ? _c : provider((_d = this._options) === null || _d === void 0 ? void 0 : _d.id)(ctxt)}`;
        const key = this._options.createMemoKey(ctxt);
        if (!key) {
            throw new Error(`${this._options.createMemoKey.name} function did not return a valid MemoKey`);
        }
        const options = ctxt.annotations.onSelf(Memo)[0].args[0];
        const expiration = this.getExpiration(ctxt, options);
        const drivers = _selectCandidateDrivers(this._drivers, ctxt);
        const proceedJoinpoint = () => {
            var _a, _b, _c;
            // value not cached. Call the original method
            const value = jp();
            this._pendingResults.set(key.toString(), value);
            // marshall the value into a frame
            const marshallingContext = this._marshallers.marshal(value);
            const driver = drivers
                .filter((d) => d.accepts(marshallingContext))
                .map((d) => [d, d.getPriority(marshallingContext)])
                .sort((dp1, dp2) => dp2[1] - dp1[1])
                .map((dp) => dp[0])[0];
            if (!driver) {
                throw new AspectError(ctxt, `Driver ${drivers[0].NAME} does not accept value of type ${(_c = (_b = (_a = getProto(value)) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : typeof value} returned by ${ctxt.target.label}`);
            }
            if (expiration) {
                this._scheduleCleaner(driver, key, expiration);
            }
            marshallingContext.then((frame) => {
                // promise resolution may not arrive in time in case the same method is called right after.
                // store the result in a temporary variable in order to be available right away
                const entry = {
                    key,
                    expiration,
                    frame,
                    signature: __createContextSignature(ctxt),
                };
                driver.write(entry).then(() => {
                    const pendingResults = this._pendingResults.get(key.toString());
                    if (pendingResults === value) {
                        this._pendingResults.delete(key.toString());
                    }
                });
            });
            return value;
        };
        const pendingResults = this._pendingResults.get(key.toString());
        if (pendingResults) {
            return copy(pendingResults);
        }
        for (const d of drivers) {
            try {
                const entry = d.read(key);
                if (entry) {
                    if (entry.expiration && entry.expiration < new Date()) {
                        // remove data if expired
                        this._removeValue(d, key);
                    }
                    else if (entry.signature && entry.signature !== __createContextSignature(ctxt)) {
                        // remove data if signature mismatch
                        console.debug(`${ctxt.target.label} hash mismatch. Removing memoized data...`);
                        this._removeValue(d, key);
                    }
                    else {
                        return this._marshallers.unmarshal(entry.frame);
                    }
                }
            }
            catch (e) {
                // mute errors in ase of version mismatch, & just remove old version
                if (e instanceof VersionConflictError || e instanceof MemoAspectError) {
                    console.error(e);
                    this._removeValue(d, key);
                }
                else {
                    throw e;
                }
            }
        }
        // found no driver for this value. Call the real method
        return proceedJoinpoint();
    }
    _removeValue(driver, key) {
        driver.remove(key);
        // get gc timeout handle
        const t = this._entriesGc.get(key.toString());
        this._pendingResults.delete(key.toString());
        if (t !== undefined) {
            // this entry is not eligible for gc
            this._entriesGc.delete(key.toString());
            // remove gc timeout
            clearTimeout(t);
        }
    }
    _scheduleCleaner(driver, key, expiration) {
        const ttl = expiration.getTime() - new Date().getTime();
        if (ttl <= 0) {
            this._removeValue(driver, key);
        }
        else {
            this._entriesGc.set(key.toString(), setTimeout(() => this._removeValue(driver, key), ttl));
        }
    }
    _initGc(driver) {
        driver.getKeys().then((keys) => {
            keys.forEach((k) => {
                Promise.resolve(driver.read(k)).then((memo) => {
                    if (memo === null || memo === void 0 ? void 0 : memo.expiration) {
                        this._scheduleCleaner(driver, k, memo.expiration);
                    }
                });
            });
        });
    }
    getExpiration(ctxt, options) {
        const exp = provider(options === null || options === void 0 ? void 0 : options.expiration)();
        if (exp) {
            if (exp instanceof Date) {
                return exp;
            }
            else if (typeof exp === 'number' && exp > 0) {
                return new Date(new Date().getTime() + exp * 1000);
            }
            else if (exp === 0) {
                return;
            }
            throw new AspectError(ctxt, `expiration should be either a Date or a positive number. Got: ${exp}`);
        }
    }
};
__decorate([
    Around(on.method.withAnnotations(Memo)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Object)
], MemoAspect.prototype, "applyMemo", null);
MemoAspect = __decorate([
    Aspect('@aspectjs/memo'),
    __metadata("design:paramtypes", [Object])
], MemoAspect);
function _selectCandidateDrivers(drivers, ctxt) {
    var _a, _b;
    const annotationOptions = ((_a = ctxt.annotations.onSelf(Memo)[0].args[0]) !== null && _a !== void 0 ? _a : {});
    if (!annotationOptions.driver) {
        // return all drivers
        return Object.values(drivers);
    }
    else {
        if (isString(annotationOptions.driver)) {
            const candidates = Object.values(drivers).filter((d) => d.NAME === annotationOptions.driver);
            if (!candidates.length) {
                throw new AspectError(ctxt, `No candidate driver available for driver name "${annotationOptions.driver}"`);
            }
            return candidates;
        }
        else if (isFunction(annotationOptions.driver)) {
            const candidates = Object.values(drivers).filter((d) => d.constructor === annotationOptions.driver);
            if (!candidates.length) {
                throw new AspectError(ctxt, `No candidate driver available for driver "${(_b = annotationOptions.driver) === null || _b === void 0 ? void 0 : _b.name}"`);
            }
            return candidates;
        }
        else {
            throw new AspectError(ctxt, `driver option should be a string or a Driver constructor. Got: ${annotationOptions.driver}`);
        }
    }
}
function __createContextSignature(ctxt) {
    const s = [];
    let proto = ctxt.target.proto;
    let property = proto[ctxt.target.propertyKey];
    while (proto !== Object.prototype && property) {
        s.push(ctxt.target.proto[ctxt.target.propertyKey].toString());
        proto = Reflect.getPrototypeOf(proto);
        property = proto[ctxt.target.propertyKey];
    }
    return hash(s.join());
}

export { DEFAULT_MARSHALLERS, MemoAspect };
//# sourceMappingURL=memo.aspect.js.map
