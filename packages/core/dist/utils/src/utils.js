let __debug = false;
const ASPECT_OPTIONS_REFLECT_KEY = 'aspectjs.aspect.options';
const ASPECT_ORIGINAL_CTOR_KEY = 'aspectjs.referenceConstructor';
/**
 * @public
 */
export function _getReferenceConstructor(proto) {
    var _a;
    return (_a = Reflect.getOwnMetadata(ASPECT_ORIGINAL_CTOR_KEY, proto)) !== null && _a !== void 0 ? _a : proto.constructor;
}
/**
 * @public
 */
export function _setReferenceConstructor(proto, originalCtor) {
    assert(isFunction(originalCtor));
    Reflect.defineMetadata(ASPECT_ORIGINAL_CTOR_KEY, originalCtor, proto);
}
/**
 * @public
 */
export function isAspect(aspect) {
    return !!__getAspectOptions(aspect);
}
/**
 * @public
 */
export function assertIsAspect(aspect) {
    if (!isAspect(aspect)) {
        const proto = getProto(aspect);
        throw new TypeError(`${proto.constructor.name} is not an Aspect`);
    }
}
function __getAspectOptions(aspect) {
    if (!aspect) {
        return;
    }
    const proto = getProto(aspect);
    if (proto) {
        return Reflect.getOwnMetadata(ASPECT_OPTIONS_REFLECT_KEY, proto);
    }
}
/**
 * @public
 */
export function getAspectOptions(aspect) {
    assertIsAspect(aspect);
    return __getAspectOptions(aspect);
}
/**
 * @public
 */
export function setAspectOptions(target, options) {
    Reflect.defineMetadata(ASPECT_OPTIONS_REFLECT_KEY, options, getProto(target));
}
/**
 * @internal
 */
export function __setDebug(debug) {
    __debug = debug;
}
/**
 * @public
 */
export function assert(condition, msg) {
    if (__debug && !condition) {
        debugger;
        const e = isFunction(msg) ? msg() : new Error(msg !== null && msg !== void 0 ? msg : 'assertion error');
        const stack = e.stack.split('\n');
        stack.splice(1, 1);
        e.stack = stack.join('\n');
        throw e;
    }
}
export function getOrComputeMetadata(key, target, propertyKey, valueGenerator, save = true) {
    let _propertyKey = propertyKey;
    let _valueGenerator = valueGenerator;
    if (typeof valueGenerator === 'boolean') {
        save = valueGenerator;
    }
    if (typeof propertyKey === 'function') {
        _valueGenerator = propertyKey;
        _propertyKey = undefined;
    }
    assert(!!target);
    let value = Reflect.getOwnMetadata(key, target, _propertyKey);
    if (isUndefined(value)) {
        value = _valueGenerator();
        if (save) {
            Reflect.defineMetadata(key, value, target, _propertyKey);
        }
    }
    return value;
}
/**
 * @public
 */
export function getProto(target) {
    if (isFunction(target)) {
        return target.prototype;
    }
    else if (target === null || target === undefined) {
        return target;
    }
    return target.hasOwnProperty('constructor') ? target : Object.getPrototypeOf(target);
}
/**
 * @public
 */
export function isObject(value) {
    return typeof value === 'object' && !isArray(value);
}
/**
 * @public
 */
export function isArray(value) {
    return !isUndefined(value) && value !== null && Object.getPrototypeOf(value) === Array.prototype;
}
/**
 * @public
 */
export function isString(value) {
    return typeof value === 'string';
}
/**
 * @public
 */
export function isUndefined(value) {
    return typeof value === 'undefined';
}
/**
 * @public
 */
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * @public
 */
export function isNumber(value) {
    return typeof value === 'number';
}
/**
 * @public
 */
export function isEmpty(value) {
    return value.length === 0;
}
/**
 * @public
 */
export function isPromise(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.then);
}
//# sourceMappingURL=utils.js.map