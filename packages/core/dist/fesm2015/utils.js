let __debug = false;
const ASPECT_OPTIONS_REFLECT_KEY = 'aspectjs.aspect.options';
const ASPECT_ORIGINAL_CTOR_KEY = 'aspectjs.referenceConstructor';
/**
 * @public
 */
function _getReferenceConstructor(proto) {
    var _a;
    return (_a = Reflect.getOwnMetadata(ASPECT_ORIGINAL_CTOR_KEY, proto)) !== null && _a !== void 0 ? _a : proto.constructor;
}
/**
 * @public
 */
function _setReferenceConstructor(proto, originalCtor) {
    assert(isFunction(originalCtor));
    Reflect.defineMetadata(ASPECT_ORIGINAL_CTOR_KEY, originalCtor, proto);
}
/**
 * @public
 */
function isAspect(aspect) {
    return !!__getAspectOptions(aspect);
}
/**
 * @public
 */
function assertIsAspect(aspect) {
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
function getAspectOptions(aspect) {
    assertIsAspect(aspect);
    return __getAspectOptions(aspect);
}
/**
 * @public
 */
function setAspectOptions(target, options) {
    Reflect.defineMetadata(ASPECT_OPTIONS_REFLECT_KEY, options, getProto(target));
}
/**
 * @internal
 */
function __setDebug(debug) {
    __debug = debug;
}
/**
 * @public
 */
function assert(condition, msg) {
    if (__debug && !condition) {
        debugger;
        const e = isFunction(msg) ? msg() : new Error(msg !== null && msg !== void 0 ? msg : 'assertion error');
        const stack = e.stack.split('\n');
        stack.splice(1, 1);
        e.stack = stack.join('\n');
        throw e;
    }
}
function getOrComputeMetadata(key, target, propertyKey, valueGenerator, save = true) {
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
function getProto(target) {
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
function isObject(value) {
    return typeof value === 'object' && !isArray(value);
}
/**
 * @public
 */
function isArray(value) {
    return !isUndefined(value) && value !== null && Object.getPrototypeOf(value) === Array.prototype;
}
/**
 * @public
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * @public
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}
/**
 * @public
 */
function isFunction(value) {
    return typeof value === 'function';
}
/**
 * @public
 */
function isNumber(value) {
    return typeof value === 'number';
}
/**
 * @public
 */
function isEmpty(value) {
    return value.length === 0;
}
/**
 * @public
 */
function isPromise(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.then);
}

/**
 * Null-safe navigation through object properties, that allows to generate missing properties on the fly.
 *
 * @public
 */
class Locator {
    constructor(_obj, _parent, _parentKey) {
        this._obj = _obj;
        this._parent = _parent;
        this._parentKey = _parentKey;
    }
    /**
     * Descend to the given property of the object.
     * @param propertyName - the property to access to.
     */
    at(propertyName) {
        return new Locator(this._obj ? this._obj[propertyName] : undefined, this, propertyName);
    }
    /**
     * Get the property value
     * @returns the property value (can be null)
     */
    get() {
        return this._obj;
    }
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is then saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    orElseCompute(valueProvider) {
        return this.orElse(valueProvider, true);
    }
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is **not** saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    orElseGet(valueProvider) {
        return this.orElse(valueProvider, false);
    }
    /**
     * Get the property value, or generate a new one with the given function.
     * @param valueProvider - the function used to generate a new value
     * @param save - if the generated property should then be saved into the object.
     * @returns the property value
     */
    orElse(valueProvider, save = true) {
        var _a;
        const value = (_a = this._obj) !== null && _a !== void 0 ? _a : valueProvider();
        if (save) {
            this._obj = value;
            this._parent._patch(value, this._parentKey);
        }
        return value;
    }
    _patch(value, key) {
        if (!this._obj) {
            this._obj = {};
            if (this._parent) {
                this._parent._patch(this._obj, this._parentKey);
            }
        }
        this._obj[key] = value;
    }
}
/**
 * @param obj - the object to navigate through.
 *
 * @public
 */
function locator(obj) {
    return new Locator(obj);
}

export { Locator, __setDebug, _getReferenceConstructor, _setReferenceConstructor, assert, assertIsAspect, getAspectOptions, getOrComputeMetadata, getProto, isArray, isAspect, isEmpty, isFunction, isNumber, isObject, isPromise, isString, isUndefined, locator, setAspectOptions };
//# sourceMappingURL=utils.js.map
