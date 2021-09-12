(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@aspectjs/core/utils')) :
  typeof define === 'function' && define.amd ? define(['exports', '@aspectjs/core/utils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.aspectjs = global.aspectjs || {}, global.aspectjs.core_commons = {}), global.aspectjs.core_utils));
}(this, (function (exports, utils) { 'use strict';

  function _wrapRegExp() {
    _wrapRegExp = function (re, groups) {
      return new BabelRegExp(re, undefined, groups);
    };

    var _super = RegExp.prototype;

    var _groups = new WeakMap();

    function BabelRegExp(re, flags, groups) {
      var _this = new RegExp(re, flags);

      _groups.set(_this, groups || _groups.get(re));

      return _setPrototypeOf(_this, BabelRegExp.prototype);
    }

    _inherits(BabelRegExp, RegExp);

    BabelRegExp.prototype.exec = function (str) {
      var result = _super.exec.call(this, str);

      if (result) result.groups = buildGroups(result, this);
      return result;
    };

    BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
      if (typeof substitution === "string") {
        var groups = _groups.get(this);

        return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
          return "$" + groups[name];
        }));
      } else if (typeof substitution === "function") {
        var _this = this;

        return _super[Symbol.replace].call(this, str, function () {
          var args = arguments;

          if (typeof args[args.length - 1] !== "object") {
            args = [].slice.call(args);
            args.push(buildGroups(args, _this));
          }

          return substitution.apply(this, args);
        });
      } else {
        return _super[Symbol.replace].call(this, str, substitution);
      }
    };

    function buildGroups(result, re) {
      var g = _groups.get(re);

      return Object.keys(g).reduce(function (groups, name) {
        groups[name] = result[g[name]];
        return groups;
      }, Object.create(null));
    }

    return _wrapRegExp.apply(this, arguments);
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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * @public
   */

  exports.AnnotationType = void 0;

  (function (AnnotationType) {
    AnnotationType["CLASS"] = "AnnotationType.CLASS";
    AnnotationType["PROPERTY"] = "AnnotationType.PROPERTY";
    AnnotationType["METHOD"] = "AnnotationType.METHOD";
    AnnotationType["PARAMETER"] = "AnnotationType.PARAMETER";
  })(exports.AnnotationType || (exports.AnnotationType = {}));
  /**
   * @public
   */


  var AnnotationRef = /*#__PURE__*/function () {
    function AnnotationRef(groupIdOrRef, name) {
      var _this = this;

      _classCallCheck(this, AnnotationRef);

      if (!name) {
        this.ref = groupIdOrRef;

        var ANNOTATION_REF_REGEX = /*#__PURE__*/_wrapRegExp(/([\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]+):([\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]+)/, {
          groupId: 1,
          name: 2
        });

        var macth = ANNOTATION_REF_REGEX.exec(this.ref);
        this.groupId = macth.groups.groupId;
        this.name = macth.groups.name;
      } else {
        this.ref = "".concat(groupIdOrRef, ":").concat(name);
        this.name = name;
        this.groupId = groupIdOrRef;
      }

      if (!this.name) {
        utils.assert(false);
        throw new Error('cannot create annotation without name');
      }

      if (!this.groupId) {
        throw new Error('cannot create annotation without groupId');
      }

      Object.defineProperty(this, Symbol.toPrimitive, {
        enumerable: false,
        value: function value() {
          return "@".concat(_this.name);
        }
      });
    }

    _createClass(AnnotationRef, [{
      key: "toString",
      value: function toString() {
        return "@".concat(this.groupId, ":").concat(this.name);
      }
    }]);

    return AnnotationRef;
  }();

  /**
   * Thrown by aspects in case some error occurred during the aspect execution.
   * @public
   */
  var AspectError = /*#__PURE__*/function (_Error) {
    _inherits(AspectError, _Error);

    var _super = _createSuper(AspectError);

    function AspectError(ctxt, message) {
      _classCallCheck(this, AspectError);

      return _super.call(this, "Error applying advice ".concat(ctxt.advice, " on ").concat(ctxt.target.label, ": ").concat(message));
    }

    return AspectError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  /**
   * Error thrown during the weaving process meaning the weaver has illegal state.
   * @public
   */
  var WeavingError = /*#__PURE__*/function (_Error) {
    _inherits(WeavingError, _Error);

    var _super = _createSuper(WeavingError);

    function WeavingError() {
      _classCallCheck(this, WeavingError);

      return _super.apply(this, arguments);
    }

    return WeavingError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  /**
   * Error thrown when an advice has an unexpected behavior (eg: returns a value that is not permitted)
   * @public
   */

  var AdviceError = /*#__PURE__*/function (_WeavingError) {
    _inherits(AdviceError, _WeavingError);

    var _super = _createSuper(AdviceError);

    function AdviceError(advice, message) {
      _classCallCheck(this, AdviceError);

      return _super.call(this, "".concat(advice, ": ").concat(message));
    }

    return AdviceError;
  }(WeavingError);

  var _AnnotationPointcutEx;
  /**
   * @public
   */

  var PointcutExpression = /*#__PURE__*/function () {
    function PointcutExpression(_label) {
      var _annotations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      _classCallCheck(this, PointcutExpression);

      this._label = _label;
      this._annotations = _annotations;
      this._name = '*'; // TODO

      this._expr = _trimSpaces("".concat(this._label, " ").concat(this._annotations.map(function (a) {
        return "@".concat(a.ref);
      }).join(','), " ").concat(this._name));
    }

    _createClass(PointcutExpression, [{
      key: "toString",
      value: function toString() {
        return this._expr;
      }
    }], [{
      key: "of",
      value: function of(type, annotation) {
        return AnnotationPointcutExpressionBuilders[type].withAnnotations(annotation);
      }
    }]);

    return PointcutExpression;
  }();
  /**
   * @public
   */

  var AnnotationPointcutExpressionBuilder = /*#__PURE__*/function () {
    function AnnotationPointcutExpressionBuilder(_label) {
      _classCallCheck(this, AnnotationPointcutExpressionBuilder);

      this._label = _label;
    }

    _createClass(AnnotationPointcutExpressionBuilder, [{
      key: "withAnnotations",
      value: function withAnnotations() {
        for (var _len = arguments.length, annotation = new Array(_len), _key = 0; _key < _len; _key++) {
          annotation[_key] = arguments[_key];
        }

        return new PointcutExpression(this._label, annotation);
      }
    }]);

    return AnnotationPointcutExpressionBuilder;
  }();
  /**
   * @public
   */

  var PropertyAnnotationPointcutExpressionBuilder = /*#__PURE__*/function () {
    function PropertyAnnotationPointcutExpressionBuilder() {
      _classCallCheck(this, PropertyAnnotationPointcutExpressionBuilder);

      this.setter = new AnnotationPointcutExpressionBuilder('property#set');
    }

    _createClass(PropertyAnnotationPointcutExpressionBuilder, [{
      key: "withAnnotations",
      value: function withAnnotations() {
        for (var _len2 = arguments.length, annotation = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          annotation[_key2] = arguments[_key2];
        }

        return new PointcutExpression('property#get', annotation);
      }
    }]);

    return PropertyAnnotationPointcutExpressionBuilder;
  }();
  var AnnotationPointcutExpressionBuilders = (_AnnotationPointcutEx = {}, _defineProperty(_AnnotationPointcutEx, exports.AnnotationType.CLASS, new AnnotationPointcutExpressionBuilder('class')), _defineProperty(_AnnotationPointcutEx, exports.AnnotationType.METHOD, new AnnotationPointcutExpressionBuilder('method')), _defineProperty(_AnnotationPointcutEx, exports.AnnotationType.PARAMETER, new AnnotationPointcutExpressionBuilder('parameter')), _defineProperty(_AnnotationPointcutEx, exports.AnnotationType.PROPERTY, new PropertyAnnotationPointcutExpressionBuilder()), _AnnotationPointcutEx);
  /**
   * @public
   */

  var on = {
    class: AnnotationPointcutExpressionBuilders[exports.AnnotationType.CLASS],
    method: AnnotationPointcutExpressionBuilders[exports.AnnotationType.METHOD],
    parameter: AnnotationPointcutExpressionBuilders[exports.AnnotationType.PARAMETER],
    property: AnnotationPointcutExpressionBuilders[exports.AnnotationType.PROPERTY]
  };
  /**
   * @public
   */

  exports.PointcutPhase = void 0;

  (function (PointcutPhase) {
    PointcutPhase["COMPILE"] = "Compile";
    PointcutPhase["AROUND"] = "Around";
    PointcutPhase["BEFORE"] = "Before";
    PointcutPhase["AFTERRETURN"] = "AfterReturn";
    PointcutPhase["AFTER"] = "After";
    PointcutPhase["AFTERTHROW"] = "AfterThrow";
  })(exports.PointcutPhase || (exports.PointcutPhase = {}));
  /**
   * @public
   */


  exports.Pointcut = void 0;

  (function (Pointcut) {
    var _POINTCUT_REGEXPS;

    var POINTCUT_REGEXPS = (_POINTCUT_REGEXPS = {}, _defineProperty(_POINTCUT_REGEXPS, exports.AnnotationType.CLASS, new RegExp('class(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*')), _defineProperty(_POINTCUT_REGEXPS, exports.AnnotationType.PROPERTY, new RegExp('property#(?:get|set)(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*')), _defineProperty(_POINTCUT_REGEXPS, exports.AnnotationType.METHOD, new RegExp('method(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*')), _defineProperty(_POINTCUT_REGEXPS, exports.AnnotationType.PARAMETER, new RegExp('parameter(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*')), _POINTCUT_REGEXPS);

    function of(phase, exp) {
      var ref = exp.toString();
      var pointcut;

      for (var _i = 0, _Object$entries = Object.entries(POINTCUT_REGEXPS); _i < _Object$entries.length; _i++) {
        var entry = _Object$entries[_i];

        var _entry = _slicedToArray(entry, 2),
            type = _entry[0],
            regex = _entry[1];

        var match = regex.exec(ref);

        if (match === null || match === void 0 ? void 0 : match.groups.name) {
          utils.assert(!!match.groups.annotation, 'only annotation pointcuts are supported');
          pointcut = {
            type: type,
            phase: phase,
            annotation: new AnnotationRef(match.groups.annotation),
            name: match.groups.name,
            ref: ref
          };
          Reflect.defineProperty(pointcut, Symbol.toPrimitive, {
            value: function value() {
              return "".concat(phase, "(").concat(ref, ")");
            }
          });
          return pointcut;
        }
      }

      throw new WeavingError("expression ".concat(ref, " not recognized as valid pointcut expression"));
    }

    Pointcut.of = of;
  })(exports.Pointcut || (exports.Pointcut = {}));

  function _trimSpaces(s) {
    return s.replace(/\s+/, ' ');
  }

  /**
   * @internal
   */

  var _JoinpointFactory = /*#__PURE__*/function () {
    function _JoinpointFactory() {
      _classCallCheck(this, _JoinpointFactory);
    }

    _createClass(_JoinpointFactory, null, [{
      key: "create",
      value: function create(advice, ctxt, fn) {
        function alreadyCalledFn() {
          throw new AdviceError(advice, "joinPoint already proceeded");
        }

        return function (args) {
          args = args !== null && args !== void 0 ? args : ctxt.args;

          if (!utils.isArray(args)) {
            throw new AdviceError(advice, "Joinpoint arguments expected to be array. Got: ".concat(args));
          }

          var jp = fn;
          fn = alreadyCalledFn;
          return jp.apply(ctxt.instance, args);
        };
      }
    }]);

    return _JoinpointFactory;
  }();

  /**
   * A WeaverProfile is a set of Aspects that can be enabled or disabled.
   * The profile itself is meant to be enabled on a Weaver, making it easy to enable multiples aspects at once.
   * @public
   */

  var WeaverProfile = /*#__PURE__*/function (_Symbol$iterator) {
    function WeaverProfile() {
      _classCallCheck(this, WeaverProfile);

      this._aspectsRegistry = {};
    }

    _createClass(WeaverProfile, [{
      key: "enable",
      value: function enable() {
        var _this = this;

        for (var _len = arguments.length, aspects = new Array(_len), _key = 0; _key < _len; _key++) {
          aspects[_key] = arguments[_key];
        }

        aspects.forEach(function (p) {
          if (p instanceof WeaverProfile) {
            Object.values(p._aspectsRegistry).forEach(function (p) {
              return _this.enable(p);
            });
          } else {
            _this.setEnabled(p, true);
          }
        });
        return this;
      }
    }, {
      key: "disable",
      value: function disable() {
        var _this2 = this;

        for (var _len2 = arguments.length, aspects = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          aspects[_key2] = arguments[_key2];
        }

        aspects.forEach(function (p) {
          if (p instanceof WeaverProfile) {
            // disable profile
            Object.values(p._aspectsRegistry).forEach(function (p) {
              return _this2.disable(p);
            });
          } else if (utils.isObject(p)) {
            // disable aspect
            _this2.setEnabled(p, false);
          } else {
            utils.assert(utils.isString(p)); // delete aspect by id

            delete _this2._aspectsRegistry[p];
          }
        });
        return this;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._aspectsRegistry = {};
        return this;
      }
    }, {
      key: "setEnabled",
      value: function setEnabled(aspect, enabled) {
        var _a;

        var id = utils.getAspectOptions(aspect).id;

        if (enabled) {
          // avoid enabling an aspect twice
          var oldAspect = this._aspectsRegistry[id];

          if (oldAspect && oldAspect !== aspect) {
            console.warn("Aspect ".concat(aspect.constructor.name, " overrides aspect \"").concat((_a = oldAspect === null || oldAspect === void 0 ? void 0 : oldAspect.constructor.name) !== null && _a !== void 0 ? _a : 'unknown', "\" already registered for name ").concat(id));
          }

          this._aspectsRegistry[id] = aspect;
        } else {
          delete this._aspectsRegistry[id];
        }

        return this;
      }
    }, {
      key: "getAspect",
      value: function getAspect(aspect) {
        if (utils.isString(aspect)) {
          return this._aspectsRegistry[aspect];
        } else {
          return this._aspectsRegistry[utils.getAspectOptions(aspect).id];
        }
      }
    }, {
      key: "getAspects",
      value: function getAspects() {
        return Object.values(this._aspectsRegistry);
      }
    }, {
      key: _Symbol$iterator,
      value: function value() {
        var aspects = this.getAspects();
        var i = 0;
        return {
          next: function next() {
            if (i >= aspects.length) {
              return {
                value: undefined,
                done: true
              };
            }

            return {
              value: aspects[i++],
              done: false
            };
          }
        };
      }
    }]);

    return WeaverProfile;
  }(Symbol.iterator);

  var _weaverContext;
  /**
   * @internal
   */


  function _getWeaverContext() {
    return _weaverContext;
  }
  /**
   * @internal
   */

  function _setWeaverContext(weaverContext) {
    _weaverContext = weaverContext;
  }

  /**
   * @internal
   */

  var _AdviceFactory = /*#__PURE__*/function () {
    function _AdviceFactory() {
      _classCallCheck(this, _AdviceFactory);
    }

    _createClass(_AdviceFactory, null, [{
      key: "create",
      value: function create(pointcut, target) {
        var _a;

        utils.assert(!(pointcut.type === exports.AnnotationType.PROPERTY) || pointcut.ref.startsWith('property#get') || pointcut.ref.startsWith('property#set'));
        var _ref = [target.proto, target.propertyKey],
            aspect = _ref[0],
            propertyKey = _ref[1];
        utils.assert(utils.isFunction(aspect[propertyKey]));

        var _advice;

        if (pointcut.phase === exports.PointcutPhase.COMPILE) {
          // prevent @Compile advices to be called twice
          _advice = function advice() {
            var a = _advice;

            _advice = function advice() {
              throw new WeavingError("".concat(a, " already applied"));
            };

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return aspect[propertyKey].apply(this, args);
          };
        } else {
          _advice = function _advice() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return aspect[propertyKey].apply(this, args);
          };
        }

        _advice.pointcut = pointcut;
        _advice.aspect = aspect;
        Reflect.defineProperty(_advice, Symbol.toPrimitive, {
          value: function value() {
            return "@".concat(pointcut.phase, "(").concat(pointcut.annotation, ") ").concat(aspect.constructor.name, ".").concat(String(propertyKey), "()");
          }
        });
        Reflect.defineProperty(_advice, 'name', {
          value: propertyKey
        });

        if (pointcut.phase === exports.PointcutPhase.COMPILE) {
          if (pointcut.ref.startsWith('property#set')) {
            // @Compile(on.property.setter) are forbidden
            // because PropertyDescriptor can only be setup for both setter & getter at once.
            throw new AdviceError(_advice, "Advice cannot be applied on property setter");
          }
        } // assert the weaver is loaded before invoking the underlying decorator


        var weaverContext = _getWeaverContext();

        if (!weaverContext) {
          throw new Error("Cannot create aspect ".concat((_a = utils.getProto(aspect).constructor.name) !== null && _a !== void 0 ? _a : '', " before \"setWeaverContext()\" has been called"));
        }

        return _advice;
      }
    }]);

    return _AdviceFactory;
  }();

  /**
   * @public
   */

  var AnnotationContext = /*#__PURE__*/function (_AnnotationRef) {
    _inherits(AnnotationContext, _AnnotationRef);

    var _super = _createSuper(AnnotationContext);

    function AnnotationContext() {
      _classCallCheck(this, AnnotationContext);

      return _super.apply(this, arguments);
    }

    return AnnotationContext;
  }(AnnotationRef);

  /**
   * @public
   */

  var AnnotationRegistry = /*#__PURE__*/function () {
    function AnnotationRegistry(_bundleRegistry) {
      _classCallCheck(this, AnnotationRegistry);

      this._bundleRegistry = _bundleRegistry;
    }
    /**
     * Registers a new annotation by its AnnotationContext,
     * so that it can be picked up wy an annotation weaver, or used through AnnotationBundle
     * @param context - the annotation context to register
     */


    _createClass(AnnotationRegistry, [{
      key: "register",
      value: function register(context) {
        var byTargetReg = utils.locator(this._bundleRegistry.byTargetClassRef).at(context.target.declaringClass.ref).orElseCompute(function () {
          return {
            byAnnotation: {},
            all: []
          };
        });
        [byTargetReg, this._bundleRegistry].forEach(function (reg) {
          utils.locator(reg.byAnnotation).at(context.ref).orElseCompute(function () {
            return [];
          }).push(context);
        });
        byTargetReg.all.push(context);
      }
    }]);

    return AnnotationRegistry;
  }();

  var _globalTargetId = 0;
  /**
   * @public
   */

  var AnnotationTargetFactory = /*#__PURE__*/function () {
    function AnnotationTargetFactory() {
      var _this$_TARGET_GENERAT,
          _this = this,
          _this$_REF_GENERATORS;

      _classCallCheck(this, AnnotationTargetFactory);

      this._TARGET_GENERATORS = (_this$_TARGET_GENERAT = {}, _defineProperty(_this$_TARGET_GENERAT, exports.AnnotationType.CLASS, _createClassAnnotationTarget), _defineProperty(_this$_TARGET_GENERAT, exports.AnnotationType.PROPERTY, _createPropertyAnnotationTarget), _defineProperty(_this$_TARGET_GENERAT, exports.AnnotationType.METHOD, _createMethodAnnotationTarget), _defineProperty(_this$_TARGET_GENERAT, exports.AnnotationType.PARAMETER, _createParameterAnnotationTarget), _this$_TARGET_GENERAT);
      this._REF_GENERATORS = (_this$_REF_GENERATORS = {}, _defineProperty(_this$_REF_GENERATORS, exports.AnnotationType.CLASS, function (d) {
        var ref = "c[".concat(utils._getReferenceConstructor(d.proto).name, "]");
        return "".concat(ref, "#").concat(utils.getOrComputeMetadata('aspectjs.targetId', d.proto, function () {
          return _globalTargetId++;
        }));
      }), _defineProperty(_this$_REF_GENERATORS, exports.AnnotationType.PROPERTY, function (d) {
        return "".concat(_this._REF_GENERATORS[exports.AnnotationType.CLASS](d), ".p[").concat(d.propertyKey, "]");
      }), _defineProperty(_this$_REF_GENERATORS, exports.AnnotationType.METHOD, function (d) {
        return _this._REF_GENERATORS[exports.AnnotationType.PROPERTY](d);
      }), _defineProperty(_this$_REF_GENERATORS, exports.AnnotationType.PARAMETER, function (d) {
        return "".concat(_this._REF_GENERATORS[exports.AnnotationType.METHOD](d), ".a[").concat(isNaN(d.parameterIndex) ? '*' : d.parameterIndex, "]");
      }), _this$_REF_GENERATORS);
    }

    _createClass(AnnotationTargetFactory, [{
      key: "of",
      value: function of(args) {
        // ClassAnnotation = <TFunction extends Function>(target: TFunction) => TFunction | void;
        // PropertyAnnotation = (target: Object, propertyKey: string | symbol) => void;
        // MethodAnnotation = <A>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<A>) => TypedPropertyDescriptor<A> | void;
        // ParameterAnnotation = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
        // eslint-disable-next-line @typescript-eslint/ban-types
        var target = args[0];
        var propertyKey = utils.isUndefined(args[1]) ? undefined : String(args[1]);
        var parameterIndex = utils.isNumber(args[2]) ? args[2] : undefined;
        var proto = utils.getProto(target);
        var descriptor = utils.isObject(args[2]) ? args[2] : undefined;
        var atarget = {
          proto: proto,
          propertyKey: propertyKey,
          parameterIndex: parameterIndex,
          descriptor: descriptor
        };
        return this.create(atarget);
      }
      /**
       * Creates an AnnotationTarget from the given argument
       * @param target - the AnnotationTarget stub.
       * @param type - target type override
       */

    }, {
      key: "create",
      value: function create(target, type) {
        var _this2 = this;

        // determine advice type
        if (utils.isUndefined(type) && utils.isUndefined(target.type)) {
          if (utils.isNumber(target.parameterIndex)) {
            type = exports.AnnotationType.PARAMETER;
          } else if (!utils.isUndefined(target.propertyKey)) {
            if (utils.isObject(target.descriptor) && utils.isFunction(target.descriptor.value)) {
              type = exports.AnnotationType.METHOD;
            } else {
              type = exports.AnnotationType.PROPERTY;
            }
          } else {
            type = exports.AnnotationType.CLASS;
          }
        } else {
          type = type !== null && type !== void 0 ? type : target.type;
        }

        var ref = this._REF_GENERATORS[type](target);

        target.type = type;
        return utils.getOrComputeMetadata(_metaKey(ref), target.proto, function () {
          var t = _this2._TARGET_GENERATORS[type](_this2, target, _this2._REF_GENERATORS[type]);

          Reflect.setPrototypeOf(t, AnnotationTargetImpl.prototype);
          return t;
        });
      }
    }]);

    return AnnotationTargetFactory;
  }();

  function _metaKey(ref) {
    return "Decorizer.target:".concat(ref);
  }

  var AnnotationTargetImpl = /*#__PURE__*/function () {
    function AnnotationTargetImpl() {
      _classCallCheck(this, AnnotationTargetImpl);
    }

    _createClass(AnnotationTargetImpl, [{
      key: "toString",
      value: function toString() {
        return this.ref;
      }
    }]);

    return AnnotationTargetImpl;
  }();

  function _createClassAnnotationTarget(targetFactory, target, refGenerator) {
    var _a;

    target = _createAnnotationTarget(target, exports.AnnotationType.CLASS, ['proto'], refGenerator);
    target.label = "class \"".concat(target.proto.constructor.name, "\"");
    target.name = target.proto.constructor.name;
    target.declaringClass = target;
    target.location = (_a = target.location) !== null && _a !== void 0 ? _a : _createLocation(target);

    var parentClass = _parentClassTargetProperty(targetFactory, target);

    Object.defineProperties(target, {
      parent: parentClass,
      parentClass: parentClass
    });
    return target;
  }

  function _createMethodAnnotationTarget(targetFactory, target, refGenerator) {
    target = _createAnnotationTarget(target, exports.AnnotationType.METHOD, ['proto', 'propertyKey', 'descriptor'], refGenerator);
    target.label = "method \"".concat(target.proto.constructor.name, ".").concat(String(target.propertyKey), "\"");
    target.name = target.propertyKey;
    Object.defineProperties(target, {
      declaringClass: _declaringClassTargetProperty(targetFactory, target),
      parent: _declaringClassTargetProperty(targetFactory, target),
      parentClass: _parentClassTargetProperty(targetFactory, target)
    });

    if (!target.location) {
      target.location = utils.locator(_getDeclaringClassLocation(target)).at(target.propertyKey).orElseCompute(function () {
        return _createLocation(target);
      });
      target.location.args = _createAllParametersAnnotationTarget(targetFactory, target, refGenerator).location;
    }

    return target;
  }

  function _getDeclaringClassLocation(target) {
    // retrieve the declaringClass location (location of the declaringClass target)
    return utils.locator(target.declaringClass).at('location').orElseCompute(function () {
      return _createLocation(target.declaringClass);
    }); // if no rootLocation exists, create a new one.
  }

  function _createPropertyAnnotationTarget(targetFactory, target, refGenerator) {
    var _a;

    target = _createAnnotationTarget(target, exports.AnnotationType.PROPERTY, ['proto', 'propertyKey'], refGenerator);
    target.label = "property \"".concat(target.proto.constructor.name, ".").concat(String(target.propertyKey), "\"");
    Object.defineProperties(target, {
      declaringClass: _declaringClassTargetProperty(targetFactory, target),
      parent: _declaringClassTargetProperty(targetFactory, target),
      parentClass: _parentClassTargetProperty(targetFactory, target)
    });
    utils.assert(target.type === exports.AnnotationType.PROPERTY);
    target.location = (_a = target.location) !== null && _a !== void 0 ? _a : utils.locator(_getDeclaringClassLocation(target)).at(target.propertyKey).orElseCompute(function () {
      return _createLocation(target);
    });
    return target;
  }

  function _createAllParametersAnnotationTarget(targetFactory, target, refGenerator) {
    var _a;

    target = _createAnnotationTarget(Object.assign(Object.assign({}, target), {
      parameterIndex: NaN
    }), exports.AnnotationType.PARAMETER, ['parameterIndex', 'proto', 'propertyKey'], refGenerator);
    target.label = "parameter \"".concat(target.proto.constructor.name, ".").concat(String(target.propertyKey), "(*)})\"");
    Object.defineProperties(target, {
      declaringClass: _declaringClassTargetProperty(targetFactory, target),
      parent: _declaringMethodTargetProperty(targetFactory, target),
      parentClass: _parentClassTargetProperty(targetFactory, target)
    });
    target.location = (_a = target.location) !== null && _a !== void 0 ? _a : _createLocation(target, []);
    return target;
  }

  function _createParameterAnnotationTarget(targetFactory, target, refGenerator) {
    target = _createAnnotationTarget(target, exports.AnnotationType.PARAMETER, ['parameterIndex', 'proto', 'propertyKey'], refGenerator);
    target.label = "parameter \"".concat(target.proto.constructor.name, ".").concat(String(target.propertyKey), "(#").concat(target.parameterIndex, ")\"");
    Object.defineProperties(target, {
      declaringClass: _declaringClassTargetProperty(targetFactory, target),
      parent: _declaringMethodTargetProperty(targetFactory, target),
      parentClass: _parentClassTargetProperty(targetFactory, target)
    });

    if (!target.location) {
      var methodLocation = utils.locator(_getDeclaringClassLocation(target)).at(target.propertyKey).orElseCompute(function () {
        return targetFactory.create({
          proto: target.proto,
          propertyKey: target.propertyKey,
          descriptor: Object.getOwnPropertyDescriptor(target.proto, target.propertyKey)
        }, exports.AnnotationType.METHOD).location;
      });
      target.location = utils.locator(methodLocation.args).at(target.parameterIndex).orElseCompute(function () {
        return _createLocation(target);
      });
    }

    target.descriptor = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey);
    return target;
  }

  function _createAnnotationTarget(target, type, requiredProperties, refGenerator) {
    var _a;

    requiredProperties.forEach(function (n) {
      return utils.assert(!utils.isUndefined(target[n]), "target.".concat(n, " is undefined"));
    });
    target = Object.assign({}, target); // delete useleff properties

    Object.keys(target).filter(function (p) {
      return requiredProperties.indexOf(p) < 0;
    }).forEach(function (n) {
      return delete target[n];
    });
    target.type = type;
    target.ref = (_a = target.ref) !== null && _a !== void 0 ? _a : refGenerator(target);
    return target;
  }

  function _parentClassTargetProperty(targetFactory, dtarget) {
    return {
      get: function get() {
        var parentProto = Reflect.getPrototypeOf(dtarget.proto);
        return parentProto === Object.prototype ? undefined : targetFactory.of([parentProto]);
      }
    };
  }

  function _declaringClassTargetProperty(targetFactory, dtarget) {
    return {
      get: function get() {
        return targetFactory.create(Object.assign({}, dtarget), exports.AnnotationType.CLASS);
      }
    };
  }

  function _declaringMethodTargetProperty(targetFactory, dtarget) {
    return {
      get: function get() {
        return targetFactory.of([dtarget.proto, dtarget.propertyKey]);
      }
    };
  }

  function _createLocation(target) {
    var locationStub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new AdviceLocationImpl();
    var proto = Object.create(Reflect.getPrototypeOf(locationStub));

    proto.getTarget = function () {
      return target;
    };

    Reflect.setPrototypeOf(locationStub, proto);
    return locationStub;
  }

  var AdviceLocationImpl = /*#__PURE__*/function () {
    function AdviceLocationImpl() {
      _classCallCheck(this, AdviceLocationImpl);
    }

    _createClass(AdviceLocationImpl, [{
      key: "getTarget",
      value: function getTarget() {
        throw new Error('No target registered');
      }
    }]);

    return AdviceLocationImpl;
  }();

  /**
   * @public
   */

  var AnnotationLocationFactory = /*#__PURE__*/function () {
    function AnnotationLocationFactory(_targetFactory) {
      _classCallCheck(this, AnnotationLocationFactory);

      this._targetFactory = _targetFactory;
    }

    _createClass(AnnotationLocationFactory, [{
      key: "of",
      value: function of(obj) {
        var proto = utils.getProto(obj);

        if (proto === Object.prototype) {
          throw new Error('given object is neither a constructor nor a class instance');
        }

        var target = this._targetFactory.create({
          proto: proto,
          type: exports.AnnotationType.CLASS
        }).declaringClass;

        return target.location;
      }
    }], [{
      key: "getTarget",
      value: function getTarget(location) {
        if (!location) {
          return undefined;
        }

        return Object.getPrototypeOf(location).getTarget();
      }
    }]);

    return AnnotationLocationFactory;
  }();

  var _AnnotationType$CLASS, _AnnotationType$PROPE, _AnnotationType$METHO, _AnnotationType$PARAM, _FILTERS;
  /**
   * @public
   */

  var RootAnnotationsBundle = /*#__PURE__*/function () {
    function RootAnnotationsBundle(_registry) {
      _classCallCheck(this, RootAnnotationsBundle);

      this._registry = _registry;
    }

    _createClass(RootAnnotationsBundle, [{
      key: "at",
      value: function at(location) {
        var searchParents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        return new ClassAnnotationsBundle(this._registry, location, searchParents);
      }
    }, {
      key: "all",
      value: function all() {
        for (var _len = arguments.length, annotations = new Array(_len), _key = 0; _key < _len; _key++) {
          annotations[_key] = arguments[_key];
        }

        if (annotations && annotations.length === 1) {
          return utils.locator(this._registry.byAnnotation).at(getAnnotationRef(annotations[0])).orElseGet(function () {
            return [];
          });
        }

        var entries = Object.entries(this._registry.byAnnotation);

        if (annotations && annotations.length) {
          var annotationsSet = new Set(annotations.map(function (a) {
            return getAnnotationRef(a);
          }));
          entries = entries.filter(function (e) {
            return annotationsSet.has(e[0]);
          });
        }

        return entries.map(function (e) {
          return e[1];
        }).flat();
      }
    }]);

    return RootAnnotationsBundle;
  }();
  /**
   * @public
   */

  var ClassAnnotationsBundle = /*#__PURE__*/function (_RootAnnotationsBundl) {
    _inherits(ClassAnnotationsBundle, _RootAnnotationsBundl);

    var _super = _createSuper(ClassAnnotationsBundle);

    function ClassAnnotationsBundle(registry, location, searchParents) {
      var _this;

      _classCallCheck(this, ClassAnnotationsBundle);

      _this = _super.call(this, registry);
      _this.searchParents = searchParents;
      _this._target = AnnotationLocationFactory.getTarget(location);
      return _this;
    }

    _createClass(ClassAnnotationsBundle, [{
      key: "all",
      value: function all() {
        for (var _len2 = arguments.length, annotations = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          annotations[_key2] = arguments[_key2];
        }

        return this._allWithFilter(this._target, 'all', annotations);
      }
    }, {
      key: "onClass",
      value: function onClass() {
        for (var _len3 = arguments.length, annotations = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          annotations[_key3] = arguments[_key3];
        }

        return this._allWithFilter(this._target, exports.AnnotationType.CLASS, annotations);
      }
    }, {
      key: "onSelf",
      value: function onSelf() {
        for (var _len4 = arguments.length, annotations = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          annotations[_key4] = arguments[_key4];
        }

        return this._allWithFilter(this._target, this._target.type, annotations);
      }
    }, {
      key: "onProperty",
      value: function onProperty() {
        for (var _len5 = arguments.length, annotations = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          annotations[_key5] = arguments[_key5];
        }

        return this._allWithFilter(this._target, exports.AnnotationType.PROPERTY, annotations);
      }
    }, {
      key: "onMethod",
      value: function onMethod() {
        for (var _len6 = arguments.length, annotations = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          annotations[_key6] = arguments[_key6];
        }

        return this._allWithFilter(this._target, exports.AnnotationType.METHOD, annotations);
      }
    }, {
      key: "onParameter",
      value: function onParameter() {
        for (var _len7 = arguments.length, annotations = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          annotations[_key7] = arguments[_key7];
        }

        return this._allWithFilter(this._target, exports.AnnotationType.PARAMETER, annotations);
      }
    }, {
      key: "_allWithFilter",
      value: function _allWithFilter(target, filter, annotations) {
        if (!target) {
          return [];
        }

        var parentContext = target.parentClass && this.searchParents ? this._allWithFilter(target.parentClass, filter, annotations) : [];
        var reg = utils.locator(this._registry.byTargetClassRef).at(target.declaringClass.ref).get();

        if (!reg) {
          return parentContext;
        }

        var annotationsRef = (annotations !== null && annotations !== void 0 ? annotations : []).map(getAnnotationRef);
        var contexts = reg.all;

        if (annotationsRef.length) {
          contexts = annotationsRef.map(function (annotationRef) {
            return utils.locator(reg.byAnnotation).at(annotationRef).orElseGet(function () {
              return [];
            });
          }).flat();
        }

        contexts = contexts.filter(function (a) {
          return FILTERS[target.type][filter](target, a);
        });
        return [].concat(_toConsumableArray(parentContext), _toConsumableArray(contexts));
      }
    }]);

    return ClassAnnotationsBundle;
  }(RootAnnotationsBundle);

  var falseFilter = function falseFilter() {
    return false;
  };

  var FILTERS = (_FILTERS = {}, _defineProperty(_FILTERS, exports.AnnotationType.CLASS, (_AnnotationType$CLASS = {
    all: function all(target, a) {
      // keep all if location is the class
      return true;
    }
  }, _defineProperty(_AnnotationType$CLASS, exports.AnnotationType.CLASS, function (target, a) {
    // keep only annotations on classes
    return a.target.type === exports.AnnotationType.CLASS;
  }), _defineProperty(_AnnotationType$CLASS, exports.AnnotationType.PROPERTY, function (target, a) {
    // keep only annotations on properties
    return a.target.type === exports.AnnotationType.PROPERTY;
  }), _defineProperty(_AnnotationType$CLASS, exports.AnnotationType.METHOD, function (target, a) {
    // keep only annotations on properties
    return a.target.type === exports.AnnotationType.METHOD;
  }), _defineProperty(_AnnotationType$CLASS, exports.AnnotationType.PARAMETER, function (target, a) {
    // keep only annotations on properties
    return a.target.type === exports.AnnotationType.PARAMETER;
  }), _AnnotationType$CLASS)), _defineProperty(_FILTERS, exports.AnnotationType.PROPERTY, (_AnnotationType$PROPE = {
    all: function all(target, a) {
      // keep if same propertyKey
      return target.propertyKey === a.target.propertyKey;
    }
  }, _defineProperty(_AnnotationType$PROPE, exports.AnnotationType.CLASS, falseFilter), _defineProperty(_AnnotationType$PROPE, exports.AnnotationType.PROPERTY, function (target, a) {
    return FILTERS[target.type].all(target, a);
  }), _defineProperty(_AnnotationType$PROPE, exports.AnnotationType.METHOD, falseFilter), _defineProperty(_AnnotationType$PROPE, exports.AnnotationType.PARAMETER, falseFilter), _AnnotationType$PROPE)), _defineProperty(_FILTERS, exports.AnnotationType.METHOD, (_AnnotationType$METHO = {
    all: function all(target, a) {
      var aTarget = a.target; // keep if same propertyKey

      return target.propertyKey === aTarget.propertyKey && (aTarget.type === exports.AnnotationType.PARAMETER || aTarget.type === exports.AnnotationType.METHOD);
    }
  }, _defineProperty(_AnnotationType$METHO, exports.AnnotationType.CLASS, falseFilter), _defineProperty(_AnnotationType$METHO, exports.AnnotationType.PROPERTY, falseFilter), _defineProperty(_AnnotationType$METHO, exports.AnnotationType.METHOD, function (target, a) {
    return (// keep only annotations on properties
      a.target.type === exports.AnnotationType.METHOD && // keep only the required method if location is the method
      target.propertyKey === a.target.propertyKey
    );
  }), _defineProperty(_AnnotationType$METHO, exports.AnnotationType.PARAMETER, function (target, a) {
    return (// keep only annotations on properties
      a.target.type === exports.AnnotationType.PARAMETER && // keep all parameters on method if location is the method
      target.propertyKey === a.target.propertyKey
    );
  }), _AnnotationType$METHO)), _defineProperty(_FILTERS, exports.AnnotationType.PARAMETER, (_AnnotationType$PARAM = {
    all: function all(target, a) {
      var aTarget = a.target;
      return (// keep if same propertyKey
        target.propertyKey === aTarget.propertyKey && // keep parameters if location is parameters
        aTarget.type === exports.AnnotationType.PARAMETER && (isNaN(target.parameterIndex) || target.parameterIndex === aTarget.parameterIndex)
      );
    }
  }, _defineProperty(_AnnotationType$PARAM, exports.AnnotationType.CLASS, falseFilter), _defineProperty(_AnnotationType$PARAM, exports.AnnotationType.PROPERTY, falseFilter), _defineProperty(_AnnotationType$PARAM, exports.AnnotationType.METHOD, falseFilter), _defineProperty(_AnnotationType$PARAM, exports.AnnotationType.PARAMETER, function (target, a) {
    return FILTERS[target.type].all(target, a);
  }), _AnnotationType$PARAM)), _FILTERS);

  function getAnnotationRef(annotation) {
    return utils.isString(annotation) ? annotation : annotation === null || annotation === void 0 ? void 0 : annotation.ref;
  }

  var generatedId = 0;
  /**
   * Factory to create some {@link Annotation}.
   * @public
   */

  var AnnotationFactory = /*#__PURE__*/function () {
    function AnnotationFactory(groupId) {
      _classCallCheck(this, AnnotationFactory);

      this._groupId = groupId;
    }

    _createClass(AnnotationFactory, [{
      key: "create",
      value: function create(name, annotationStub) {
        var groupId = this._groupId;

        if (utils.isFunction(name)) {
          annotationStub = name;
          name = annotationStub.name;
        }

        if (!annotationStub) {
          annotationStub = function annotationStub() {};
        }

        if (!name) {
          name = "anonymousAnnotation#".concat(generatedId++);
        } // create the annotation (ie: decorator provider)


        var annotation = _createAnnotation(name, groupId, annotationStub, function () {
          for (var _len = arguments.length, annotationArgs = new Array(_len), _key = 0; _key < _len; _key++) {
            annotationArgs[_key] = arguments[_key];
          }

          return _createBootstrapDecorator(annotation, annotationStub, annotationArgs);
        });

        return annotation;
      }
    }]);

    return AnnotationFactory;
  }();

  function _createAnnotation(name, groupId, annotationStub, fn) {
    utils.assert(typeof fn === 'function'); // ensure annotation has a name.

    annotationStub = annotationStub !== null && annotationStub !== void 0 ? annotationStub : function () {};
    var annotationRef = new AnnotationRef(groupId, name);
    var annotation = fn;
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationStub));
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationRef));
    utils.assert(Object.getOwnPropertySymbols(annotation).indexOf(Symbol.toPrimitive) >= 0);
    return annotation;
  }

  function _createBootstrapDecorator(annotation, annotationStub, annotationArgs) {
    return function () {
      var _a, _b; // eslint-disable-next-line prefer-spread


      for (var _len2 = arguments.length, targetArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        targetArgs[_key2] = arguments[_key2];
      }

      (_a = annotationStub.apply(void 0, _toConsumableArray(annotationArgs))) === null || _a === void 0 ? void 0 : _a.apply(null, targetArgs); // assert the weaver is loaded before invoking the underlying decorator

      var weaverContext = _getWeaverContext();

      if (!weaverContext) {
        throw new Error("Cannot invoke annotation ".concat((_b = annotation.name) !== null && _b !== void 0 ? _b : '', " before \"setWeaverContext()\" has been called"));
      }

      var target = _getWeaverContext().annotations.targetFactory.of(targetArgs);

      var annotationContext = new AnnotationContextImpl(target, annotationArgs, annotation);
      weaverContext.annotations.registry.register(annotationContext);
      var enhanced = weaverContext.getWeaver().enhance(target);

      if (target.type === exports.AnnotationType.CLASS) {
        Object.defineProperties(enhanced, Object.getOwnPropertyDescriptors(targetArgs[0]));
      }

      return enhanced;
    };
  }

  var AnnotationContextImpl = /*#__PURE__*/function (_AnnotationContext) {
    _inherits(AnnotationContextImpl, _AnnotationContext);

    var _super = _createSuper(AnnotationContextImpl);

    function AnnotationContextImpl(target, args, annotation) {
      var _this;

      _classCallCheck(this, AnnotationContextImpl);

      _this = _super.call(this, annotation.groupId, annotation.name);
      _this.target = target;
      _this.args = args;
      return _this;
    }

    return AnnotationContextImpl;
  }(AnnotationContext);

  /**
   * The AnnotationFactory used to create annotations of the Aspectjs framework
   * @public
   */

  var ASPECTJS_ANNOTATION_FACTORY = new AnnotationFactory('aspectjs');

  exports.ASPECTJS_ANNOTATION_FACTORY = ASPECTJS_ANNOTATION_FACTORY;
  exports.AdviceError = AdviceError;
  exports.AdviceType = exports.AnnotationType;
  exports.AnnotationContext = AnnotationContext;
  exports.AnnotationFactory = AnnotationFactory;
  exports.AnnotationLocationFactory = AnnotationLocationFactory;
  exports.AnnotationPointcutExpressionBuilder = AnnotationPointcutExpressionBuilder;
  exports.AnnotationRef = AnnotationRef;
  exports.AnnotationRegistry = AnnotationRegistry;
  exports.AnnotationTargetFactory = AnnotationTargetFactory;
  exports.AspectError = AspectError;
  exports.ClassAnnotationsBundle = ClassAnnotationsBundle;
  exports.PointcutExpression = PointcutExpression;
  exports.PropertyAnnotationPointcutExpressionBuilder = PropertyAnnotationPointcutExpressionBuilder;
  exports.RootAnnotationsBundle = RootAnnotationsBundle;
  exports.WeaverProfile = WeaverProfile;
  exports.WeavingError = WeavingError;
  exports._AdviceFactory = _AdviceFactory;
  exports._JoinpointFactory = _JoinpointFactory;
  exports._getWeaverContext = _getWeaverContext;
  exports._setWeaverContext = _setWeaverContext;
  exports.on = on;

})));
//# sourceMappingURL=commons.umd.js.map
