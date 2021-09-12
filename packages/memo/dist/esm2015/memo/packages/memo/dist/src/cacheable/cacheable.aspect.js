import { __decorate, __metadata } from '../../../../../node_modules/tslib/tslib.es6.js';
import { Compile, Aspect } from '@aspectjs/core/annotations';
import { on } from '@aspectjs/core/commons';
import { isObject, getOrComputeMetadata, assert } from '@aspectjs/core/utils';
import { Cacheable as _Cacheable } from './cacheable.annotation.js';

/**
 * Assign a key to the prototype of a class into a CacheTypeStore,
 * so that Memo drivers can inflate memoized objects with proper types.
 *
 * @public
 */
let DefaultCacheableAspect = class DefaultCacheableAspect {
    constructor(cacheTypeStore = new _CacheTypeStoreImpl()) {
        this.cacheTypeStore = cacheTypeStore;
    }
    registerCacheKey(ctxt) {
        var _a;
        let options = ctxt.annotations.onSelf(_Cacheable)[0].args[0];
        if (!isObject(options)) {
            options = {
                typeId: options,
            };
        }
        const typeId = (_a = options.typeId) !== null && _a !== void 0 ? _a : _generateTypeId(ctxt.target.proto);
        this.cacheTypeStore.addPrototype(ctxt.target.proto, typeId, options.version);
    }
};
__decorate([
    Compile(on.class.withAnnotations(_Cacheable)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DefaultCacheableAspect.prototype, "registerCacheKey", null);
DefaultCacheableAspect = __decorate([
    Aspect('@aspectjs/cacheable'),
    __metadata("design:paramtypes", [Object])
], DefaultCacheableAspect);
/**
 * Store class prototypes along with a defined key.
 * @internal
 */
class _CacheTypeStoreImpl {
    constructor() {
        this._prototypes = new Map();
    }
    getPrototype(key) {
        assert(!!key, 'key must be defined');
        const entry = this._prototypes.get(key);
        if (!entry) {
            throw new Error(`no prototype found for key ${key}`);
        }
        return entry.proto;
    }
    getTypeKey(prototype) {
        return Reflect.getOwnMetadata('@aspectjs/cacheable:typekey', prototype);
    }
    addPrototype(proto, typeId, version) {
        var _a, _b;
        const existingProto = this._prototypes.get(typeId);
        if (existingProto && existingProto !== proto) {
            throw new Error(`Cannot call @Cacheable({typeId = ${typeId}}) on ${(_a = proto === null || proto === void 0 ? void 0 : proto.constructor) === null || _a === void 0 ? void 0 : _a.name}: typeId is already assigned to ${(_b = existingProto === null || existingProto === void 0 ? void 0 : existingProto.constructor) === null || _b === void 0 ? void 0 : _b.name}`);
        }
        this._prototypes.set(typeId, { proto, version });
    }
    getVersion(key) {
        var _a, _b;
        return (_b = (_a = this._prototypes.get(key)) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : undefined;
    }
}
let globalId = 0;
function _generateTypeId(proto) {
    return getOrComputeMetadata('@aspectjs/cacheable:typekey', proto, () => {
        return `${proto.constructor.name}#${globalId++}`;
    });
}

export { DefaultCacheableAspect, _CacheTypeStoreImpl };
//# sourceMappingURL=cacheable.aspect.js.map
