import { WEAVER_CONTEXT } from '@aspectjs/core';
import { assert } from '@aspectjs/core/utils';
import { WeavingError } from '@aspectjs/core/commons';
import { Cacheable } from '../../cacheable/cacheable.annotation';
import { VersionConflictError } from '../../errors';
import { MemoMarshaller } from './marshaller';
import { ObjectMarshaller } from './object-marshaller';
import { provider, hash } from '../../utils';
/**
 * Supports marshalling instances of classes annotated with @Cacheable
 * @public
 */
export class CacheableMarshaller extends MemoMarshaller {
    constructor(options) {
        var _a, _b;
        super();
        this.types = '*';
        this._objectMarshaller = (_a = options === null || options === void 0 ? void 0 : options.objectMarshaller) !== null && _a !== void 0 ? _a : new ObjectMarshaller();
        this._nonCacheableHandler =
            (_b = options === null || options === void 0 ? void 0 : options.nonCacheableHandler) !== null && _b !== void 0 ? _b : ((proto) => {
                const name = proto.constructor.name;
                throw new TypeError(`Type "${name}" is not annotated with "${Cacheable}". Please add "${Cacheable}" on class "${name}", or register a proper ${MemoMarshaller.name} for this type.`);
            });
    }
    marshal(frame, context, defaultMarshal) {
        // delete wrap.type; // Do not store useless type, as INSTANCE_TYPE is used for objects of non-built-in types.
        const proto = Reflect.getPrototypeOf(frame.value);
        const ts = typeStore();
        const instanceType = ts.getTypeKey(proto);
        if (!instanceType) {
            this._nonCacheableHandler(proto);
        }
        const newFrame = this._objectMarshaller.marshal(frame, context, defaultMarshal);
        newFrame.hash = __createHash(proto);
        newFrame.instanceType = instanceType;
        newFrame.version = provider(ts.getVersion(instanceType))();
        return newFrame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        frame.value = this._objectMarshaller.unmarshal(frame, context, defaultUnmarshal);
        assert(!!frame.instanceType);
        const ts = typeStore();
        const proto = ts.getPrototype(frame.instanceType);
        const version = provider(ts.getVersion(frame.instanceType))();
        if (version !== frame.version) {
            if (version !== frame.version) {
                throw new VersionConflictError(`Object for key ${frame.instanceType} is of version ${version}, but incompatible version ${frame.version} was already cached`, context);
            }
        }
        if (version === undefined && frame.hash !== __createHash(proto)) {
            throw new VersionConflictError(`Hash changed for type ${frame.instanceType} `, context);
        }
        Reflect.setPrototypeOf(frame.value, proto);
        return frame.value;
    }
}
function typeStore() {
    const weaver = WEAVER_CONTEXT.getWeaver();
    if (!weaver) {
        throw new WeavingError('no weaver configured. Please call setWeaver()');
    }
    const cacheableAspect = weaver.getAspect('@aspectjs/cacheable');
    if (!cacheableAspect) {
        throw new WeavingError('MemoAspect requires an aspect to be registered for id "@aspectjs/cacheable".' +
            ' Did you forgot to call getWeaver().enable(new DefaultCacheableAspect()) ?');
    }
    return cacheableAspect.cacheTypeStore;
}
function __createHash(proto) {
    const s = [];
    let p = proto;
    while (p !== Object.prototype) {
        s.push(p.constructor.toString());
        p = Reflect.getPrototypeOf(p);
    }
    return hash(s.join());
}
//# sourceMappingURL=cacheable-marshaller.js.map