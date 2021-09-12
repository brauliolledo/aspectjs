"use strict";
exports.__esModule = true;
exports.isPromise = exports.isEmpty = exports.isNumber = exports.isFunction = exports.isUndefined = exports.isString = exports.isArray = exports.isObject = exports.getProto = exports.getOrComputeMetadata = exports.assert = exports.__setDebug = exports.setAspectOptions = exports.getAspectOptions = exports.assertIsAspect = exports.isAspect = exports._setReferenceConstructor = exports._getReferenceConstructor = void 0;
require("reflect-metadata");
var __debug = false;
var ASPECT_OPTIONS_REFLECT_KEY = 'aspectjs.aspect.options';
var ASPECT_ORIGINAL_CTOR_KEY = 'aspectjs.referenceConstructor';
/**
 * @public
 */
function _getReferenceConstructor(proto) {
    var _a;
    return ((_a = Reflect.getOwnMetadata(ASPECT_ORIGINAL_CTOR_KEY, proto)) !== null && _a !== void 0 ? _a : proto.constructor);
}
exports._getReferenceConstructor = _getReferenceConstructor;
/**
 * @public
 */
function _setReferenceConstructor(proto, originalCtor) {
    assert(isFunction(originalCtor));
    Reflect.defineMetadata(ASPECT_ORIGINAL_CTOR_KEY, originalCtor, proto);
}
exports._setReferenceConstructor = _setReferenceConstructor;
/**
 * @public
 */
function isAspect(aspect) {
    return !!__getAspectOptions(aspect);
}
exports.isAspect = isAspect;
/**
 * @public
 */
function assertIsAspect(aspect) {
    if (!isAspect(aspect)) {
        var proto = getProto(aspect);
        throw new TypeError(proto.constructor.name + " is not an Aspect");
    }
}
exports.assertIsAspect = assertIsAspect;
function __getAspectOptions(aspect) {
    if (!aspect) {
        return;
    }
    var proto = getProto(aspect);
    if (proto) {
        return Reflect.getOwnMetadata(ASPECT_OPTIONS_REFLECT_KEY, proto);
    }
}
/**
 * @public
 */
function getAspectOptions(aspect) {
    assertIsAspect(aspect);
    return __getAspectOptions(aspect);
}
exports.getAspectOptions = getAspectOptions;
/**
 * @public
 */
function setAspectOptions(target, options) {
    Reflect.defineMetadata(ASPECT_OPTIONS_REFLECT_KEY, options, getProto(target));
}
exports.setAspectOptions = setAspectOptions;
/**
 * @internal
 */
function __setDebug(debug) {
    __debug = debug;
}
exports.__setDebug = __setDebug;
/**
 * @public
 */
function assert(condition, msg) {
    if (__debug && !condition) {
        debugger;
        var e = isFunction(msg)
            ? msg()
            : new Error(msg !== null && msg !== void 0 ? msg : 'assertion error');
        var stack = e.stack.split('\n');
        stack.splice(1, 1);
        e.stack = stack.join('\n');
        throw e;
    }
}
exports.assert = assert;
function getOrComputeMetadata(key, target, propertyKey, valueGenerator, save) {
    if (save === void 0) { save = true; }
    var _propertyKey = propertyKey;
    var _valueGenerator = valueGenerator;
    if (typeof valueGenerator === 'boolean') {
        save = valueGenerator;
    }
    if (typeof propertyKey === 'function') {
        _valueGenerator = propertyKey;
        _propertyKey = undefined;
    }
    assert(!!target);
    var value = Reflect.getOwnMetadata(key, target, _propertyKey);
    if (isUndefined(value)) {
        value = _valueGenerator();
        if (save) {
            Reflect.defineMetadata(key, value, target, _propertyKey);
        }
    }
    return value;
}
exports.getOrComputeMetadata = getOrComputeMetadata;
/**
 * @public
 */
function getProto(target) {
    if (isFunction(target)) {
        return target.prototype;
    }
    else if (target === null || target === undefined) {
        return target;
    }
    return target.hasOwnProperty('constructor')
        ? target
        : Object.getPrototypeOf(target);
}
exports.getProto = getProto;
/**
 * @public
 */
function isObject(value) {
    return typeof value === 'object' && !isArray(value);
}
exports.isObject = isObject;
/**
 * @public
 */
function isArray(value) {
    return (!isUndefined(value) &&
        value !== null &&
        Object.getPrototypeOf(value) === Array.prototype);
}
exports.isArray = isArray;
/**
 * @public
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * @public
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * @public
 */
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
/**
 * @public
 */
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
/**
 * @public
 */
function isEmpty(value) {
    return value.length === 0;
}
exports.isEmpty = isEmpty;
/**
 * @public
 */
function isPromise(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.then);
}
exports.isPromise = isPromise;
