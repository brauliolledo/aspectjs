(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.aspectjs = global.aspectjs || {}, global.aspectjs.core_utils = {})));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var __debug = false;
  var ASPECT_OPTIONS_REFLECT_KEY = 'aspectjs.aspect.options';
  var ASPECT_ORIGINAL_CTOR_KEY = 'aspectjs.referenceConstructor';
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
      var proto = getProto(aspect);
      throw new TypeError("".concat(proto.constructor.name, " is not an Aspect"));
    }
  }

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
      var e = isFunction(msg) ? msg() : new Error(msg !== null && msg !== void 0 ? msg : 'assertion error');
      var stack = e.stack.split('\n');
      stack.splice(1, 1);
      e.stack = stack.join('\n');
      throw e;
    }
  }
  function getOrComputeMetadata(key, target, propertyKey, valueGenerator) {
    var save = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
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
  /**
   * @public
   */

  function getProto(target) {
    if (isFunction(target)) {
      return target.prototype;
    } else if (target === null || target === undefined) {
      return target;
    }

    return target.hasOwnProperty('constructor') ? target : Object.getPrototypeOf(target);
  }
  /**
   * @public
   */

  function isObject(value) {
    return _typeof(value) === 'object' && !isArray(value);
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
  var Locator = /*#__PURE__*/function () {
    function Locator(_obj, _parent, _parentKey) {
      _classCallCheck(this, Locator);

      this._obj = _obj;
      this._parent = _parent;
      this._parentKey = _parentKey;
    }
    /**
     * Descend to the given property of the object.
     * @param propertyName - the property to access to.
     */


    _createClass(Locator, [{
      key: "at",
      value: function at(propertyName) {
        return new Locator(this._obj ? this._obj[propertyName] : undefined, this, propertyName);
      }
      /**
       * Get the property value
       * @returns the property value (can be null)
       */

    }, {
      key: "get",
      value: function get() {
        return this._obj;
      }
      /**
       * Get the property value, or generate a new one with the given function.
       * The generated property is then saved into the object.
       * @param valueProvider - the function used to generate a new value
       * @returns the property value
       */

    }, {
      key: "orElseCompute",
      value: function orElseCompute(valueProvider) {
        return this.orElse(valueProvider, true);
      }
      /**
       * Get the property value, or generate a new one with the given function.
       * The generated property is **not** saved into the object.
       * @param valueProvider - the function used to generate a new value
       * @returns the property value
       */

    }, {
      key: "orElseGet",
      value: function orElseGet(valueProvider) {
        return this.orElse(valueProvider, false);
      }
      /**
       * Get the property value, or generate a new one with the given function.
       * @param valueProvider - the function used to generate a new value
       * @param save - if the generated property should then be saved into the object.
       * @returns the property value
       */

    }, {
      key: "orElse",
      value: function orElse(valueProvider) {
        var save = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var _a;

        var value = (_a = this._obj) !== null && _a !== void 0 ? _a : valueProvider();

        if (save) {
          this._obj = value;

          this._parent._patch(value, this._parentKey);
        }

        return value;
      }
    }, {
      key: "_patch",
      value: function _patch(value, key) {
        if (!this._obj) {
          this._obj = {};

          if (this._parent) {
            this._parent._patch(this._obj, this._parentKey);
          }
        }

        this._obj[key] = value;
      }
    }]);

    return Locator;
  }();
  /**
   * @param obj - the object to navigate through.
   *
   * @public
   */

  function locator(obj) {
    return new Locator(obj);
  }

  exports.Locator = Locator;
  exports.__setDebug = __setDebug;
  exports._getReferenceConstructor = _getReferenceConstructor;
  exports._setReferenceConstructor = _setReferenceConstructor;
  exports.assert = assert;
  exports.assertIsAspect = assertIsAspect;
  exports.getAspectOptions = getAspectOptions;
  exports.getOrComputeMetadata = getOrComputeMetadata;
  exports.getProto = getProto;
  exports.isArray = isArray;
  exports.isAspect = isAspect;
  exports.isEmpty = isEmpty;
  exports.isFunction = isFunction;
  exports.isNumber = isNumber;
  exports.isObject = isObject;
  exports.isPromise = isPromise;
  exports.isString = isString;
  exports.isUndefined = isUndefined;
  exports.locator = locator;
  exports.setAspectOptions = setAspectOptions;

})));
//# sourceMappingURL=utils.umd.js.map
