(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@aspectjs/core/commons'), require('@aspectjs/core/annotations'), require('@aspectjs/core/utils')) :
  typeof define === 'function' && define.amd ? define(['exports', '@aspectjs/core/commons', '@aspectjs/core/annotations', '@aspectjs/core/utils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.aspectjs = global.aspectjs || {}, global.aspectjs.core = {}), global.aspectjs.core_commons, global.aspectjs.core_annotations, global.aspectjs.core_utils));
}(this, (function (exports, commons, annotations, utils) { 'use strict';

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

  function _defineProperty$1(obj, key, value) {
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

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

  /**
   * Stores the aspects along with their advices.
   * @public
   */

  var AspectsRegistryImpl = /*#__PURE__*/function () {
    function AspectsRegistryImpl(_weaverContext) {
      _classCallCheck(this, AspectsRegistryImpl);

      this._weaverContext = _weaverContext;
      this._advicesRegistry = {
        byPointcut: {},
        byTarget: {},
        byAspect: {}
      };
      this._dirty = true;
      this._aspectsToLoad = new Set();
      this._loadedAspects = new Set();
      this._advicesRegistryKey = "aspectjs.adviceRegistry.byAspects"; // TODO increment key with AspectsRegistry instance ?
    }
    /**
     * Register a new advice, with the aspect it belongs to.
     * @param aspects - The aspects to register
     */


    _createClass(AspectsRegistryImpl, [{
      key: "register",
      value: function register() {
        var _this = this;

        for (var _len = arguments.length, aspects = new Array(_len), _key = 0; _key < _len; _key++) {
          aspects[_key] = arguments[_key];
        }

        (aspects !== null && aspects !== void 0 ? aspects : []).forEach(function (aspect) {
          // get annotations bundle
          var annotationsContext = commons._getWeaverContext().annotations;

          var bundle = annotationsContext.bundle.at(annotationsContext.location.of(aspect)); // get @Aspect options

          var target = _this._getTarget(aspect);

          var byAspectRegistry = utils.locator(_this._advicesRegistry.byAspect).at(target.ref).orElseCompute(function () {
            return {};
          });

          _this._aspectsToLoad.add(aspect);

          [[annotations.Compile, commons.PointcutPhase.COMPILE], [annotations.Before, commons.PointcutPhase.BEFORE], [annotations.Around, commons.PointcutPhase.AROUND], [annotations.After, commons.PointcutPhase.AFTER], [annotations.AfterReturn, commons.PointcutPhase.AFTERRETURN], [annotations.AfterThrow, commons.PointcutPhase.AFTERTHROW]].forEach(function (adviceDef) {
            bundle.onMethod(adviceDef[0]).forEach(function (annotation) {
              var expr = annotation.args[0];
              utils.assert(!!expr);

              var advice = commons._AdviceFactory.create(commons.Pointcut.of(adviceDef[1], expr), annotation.target);

              var k = "".concat(advice.pointcut.ref, "=>").concat(advice.name);
              byAspectRegistry[k] = advice;
            });
          });
        });
      }
    }, {
      key: "remove",
      value: function remove() {
        var _this2 = this;

        this._dirty = true;

        if (this._aspectsToLoad.size) {
          for (var _len2 = arguments.length, aspects = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            aspects[_key2] = arguments[_key2];
          }

          aspects.forEach(function (a) {
            // remove aspect from the list of aspects to load
            _this2._aspectsToLoad.delete(a); // remove aspect from registry


            delete _this2._advicesRegistry.byAspect[_this2._getTarget(a).ref];
          });
        } // force all aspects to reload


        this._loadedAspects.forEach(function (a) {
          return _this2._aspectsToLoad.add(a);
        });

        this._loadedAspects.clear();
      }
      /**
       * Get all advices that belongs to the given aspect
       * @param aspect - the aspect to get advices for.
       */

    }, {
      key: "getAdvicesByAspect",
      value: function getAdvicesByAspect(aspect) {
        var _a;

        utils.assertIsAspect(aspect);

        var target = this._getTarget(aspect);

        return Object.values((_a = this._advicesRegistry.byAspect[target.ref]) !== null && _a !== void 0 ? _a : {}).flat().map(function (advice) {
          var bound = advice.bind(aspect);
          Object.defineProperties(bound, Object.getOwnPropertyDescriptors(advice));
          return bound;
        });
      }
    }, {
      key: "getAdvicesByTarget",
      value: function getAdvicesByTarget(target, filter) {
        var _this3 = this;

        this._load();

        var targetRegistry = utils.locator(this._advicesRegistry).at('byTarget').at("".concat(target.ref).concat((filter === null || filter === void 0 ? void 0 : filter.name) ? ":".concat(filter === null || filter === void 0 ? void 0 : filter.name) : '')).orElseGet(function () {
          return {};
        }); // get all advices that correspond to all the annotations of this context

        var bundle = this._weaverContext.annotations.bundle.at(target.location);

        var annotationContexts = bundle.onSelf();

        for (var _len3 = arguments.length, phases = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          phases[_key3 - 2] = arguments[_key3];
        }

        (phases !== null && phases !== void 0 ? phases : []).forEach(function (phase) {
          if (!targetRegistry[phase]) {
            var advices = annotationContexts.map(function (annotationContext) {
              return utils.locator(_this3._advicesRegistry).at('byPointcut').at(phase).at(target.type).at('byAnnotation').at(annotationContext.ref).orElseGet(function () {
                return [];
              });
            }).flat().sort(function (a1, a2) {
              var _a, _b; // sort by advice order


              var a = _this3._weaverContext.annotations;
              var o1 = (_a = a.bundle.at(a.location.of(a1.aspect)[a1.name]).onMethod(annotations.Order)[0]) === null || _a === void 0 ? void 0 : _a.args[0];
              var o2 = (_b = a.bundle.at(a.location.of(a2.aspect)[a1.name]).onMethod(annotations.Order)[0]) === null || _b === void 0 ? void 0 : _b.args[0];
              return _compareOrder(o1, o2);
            });

            if (filter) {
              advices = advices.filter(filter.fn);
            }

            targetRegistry[phase] = advices;
          }
        });
        return targetRegistry;
      }
      /**
       * @internal
       */

    }, {
      key: "_getTarget",
      value: function _getTarget(obj) {
        return commons.AnnotationLocationFactory.getTarget(this._weaverContext.annotations.location.of(obj));
      }
      /**
       * Sort the aspects according to their precedence & store by target, by phase & type
       * @private
       */

    }, {
      key: "_load",
      value: function _load() {
        var _this4 = this;

        if (this._dirty) {
          this._advicesRegistry.byPointcut = {};
          this._advicesRegistry.byTarget = {};
        }

        if (!this._aspectsToLoad.size) {
          return;
        }

        _toConsumableArray(this._aspectsToLoad).sort(function (a1, a2) {
          var _a, _b; // sort by aspect order


          var a = _this4._weaverContext.annotations;
          var o1 = (_a = a.bundle.at(a.location.of(a1)).onClass(annotations.Order)[0]) === null || _a === void 0 ? void 0 : _a.args[0];
          var o2 = (_b = a.bundle.at(a.location.of(a2)).onClass(annotations.Order)[0]) === null || _b === void 0 ? void 0 : _b.args[0];
          return _compareOrder(o1, o2);
        }).map(function (a) {
          _this4._loadedAspects.add(a);

          return a;
        }).map(function (aspect) {
          return _this4.getAdvicesByAspect(aspect);
        }).flat().forEach(function (advice) {
          var pc = advice.pointcut;
          utils.locator(_this4._advicesRegistry).at('byPointcut').at(pc.phase).at(pc.type).at('byAnnotation').at(pc.annotation.ref).orElseCompute(function () {
            return [];
          }).push(advice);
        });

        this._dirty = false;

        this._aspectsToLoad.clear();
      }
    }]);

    return AspectsRegistryImpl;
  }();

  function _compareOrder(o1, o2) {
    if (o1 === annotations.Order.LOWEST_PRECEDENCE || o1 === undefined) {
      return 1;
    }

    if (o2 === annotations.Order.LOWEST_PRECEDENCE || o2 === undefined) {
      return -1;
    }

    if (o1 === annotations.Order.HIGHEST_PRECEDENCE) {
      return -1;
    }

    if (o2 === annotations.Order.HIGHEST_PRECEDENCE) {
      return 1;
    }

    return o1 - o2;
  }

  /**
   * @internal
   */

  var _AdviceExecutionPlanFactory = /*#__PURE__*/function () {
    function _AdviceExecutionPlanFactory() {
      _classCallCheck(this, _AdviceExecutionPlanFactory);
    }

    _createClass(_AdviceExecutionPlanFactory, [{
      key: "create",
      value: function create(target, hooks, filter) {
        var compiled = false;
        var compiledSymbol;

        var linkFn = function linkFn(ctxt) {
          var _a;

          if (!compiled) {
            compileFn(ctxt);
          }

          utils.assert(!!compiledSymbol);

          var jp = function jp() {
            var _a;

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            ctxt.args = args;
            ctxt.instance = this;

            var advicesReg = commons._getWeaverContext().aspects.registry.getAdvicesByTarget(ctxt.target, filter, commons.PointcutPhase.BEFORE, commons.PointcutPhase.AROUND, commons.PointcutPhase.AFTERRETURN, commons.PointcutPhase.AFTERTHROW, commons.PointcutPhase.AFTER); // create the joinpoint for the original method


            var jp = commons._JoinpointFactory.create(null, ctxt, function () {
              var _a, _b, _c, _d;

              var restoreJp = ctxt.joinpoint;
              var restoreArgs = ctxt.args;

              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              ctxt.args = args;
              delete ctxt.joinpoint;

              try {
                (_a = hooks.preBefore) === null || _a === void 0 ? void 0 : _a.call(hooks, ctxt);
                hooks.before(ctxt, advicesReg[commons.PointcutPhase.BEFORE]);
                hooks.initialJoinpoint.call(hooks, ctxt, compiledSymbol);
                (_b = hooks.preAfterReturn) === null || _b === void 0 ? void 0 : _b.call(hooks, ctxt);
                return hooks.afterReturn(ctxt, advicesReg[commons.PointcutPhase.AFTERRETURN]);
              } catch (e) {
                // consider WeavingErrors as not recoverable by an aspect
                if (e instanceof commons.WeavingError) {
                  throw e;
                }

                ctxt.error = e;
                (_c = hooks.preAfterThrow) === null || _c === void 0 ? void 0 : _c.call(hooks, ctxt);
                return hooks.afterThrow(ctxt, advicesReg[commons.PointcutPhase.AFTERTHROW]);
              } finally {
                delete ctxt.error;
                (_d = hooks.preAfter) === null || _d === void 0 ? void 0 : _d.call(hooks, ctxt);
                hooks.after(ctxt, advicesReg[commons.PointcutPhase.AFTER]);
                ctxt.joinpoint = restoreJp;
                ctxt.args = restoreArgs;
              }
            });

            (_a = hooks.preAround) === null || _a === void 0 ? void 0 : _a.call(hooks, ctxt);
            return hooks.around(ctxt, advicesReg[commons.PointcutPhase.AROUND], jp)(args);
          };

          return (_a = hooks.finalize.call(hooks, ctxt, jp)) !== null && _a !== void 0 ? _a : jp;
        };

        var compileFn = function compileFn(ctxt) {
          var compileAdvices = commons._getWeaverContext().aspects.registry.getAdvicesByTarget(ctxt.target, filter, commons.PointcutPhase.COMPILE)[commons.PointcutPhase.COMPILE];

          compiledSymbol = hooks.compile(ctxt, compileAdvices);
          compiled = true;

          if (!compiledSymbol) {
            throw new commons.WeavingError("".concat(Reflect.getPrototypeOf(hooks).constructor.name, ".compile() did not returned a symbol"));
          }

          return compiledSymbol;
        };

        return new _ExecutionPlan(compileFn, linkFn);
      }
    }]);

    return _AdviceExecutionPlanFactory;
  }();
  /**
   * Sort the advices according to their precedence & store by phase & type, so they are ready to execute.
   * @internal
   */

  var _ExecutionPlan = /*#__PURE__*/function () {
    function _ExecutionPlan(compileFn, linkFn) {
      _classCallCheck(this, _ExecutionPlan);

      this.compileFn = compileFn;
      this.linkFn = linkFn;
    }

    _createClass(_ExecutionPlan, [{
      key: "compile",
      value: function compile(ctxt) {
        var compiled = this.compileFn(ctxt);
        var _link = this.linkFn;
        return {
          /**
           * Returns a function that executes the plan for the Before, Around, AfterReturn, AfterThrow & After advices.
           */
          link: function link() {
            return _link(ctxt, compiled);
          }
        };
      }
    }]);

    return _ExecutionPlan;
  }();

  /**
   *
   * @param fn
   * @param name
   * @param tag
   * @param toString
   * @internal
   */

  function _defineFunctionProperties(fn, name, tag, toString) {
    utils.assert(typeof fn === 'function'); // const newFn = fn;

    var newFn = new Function('fn', "return function ".concat(name, "(...args) { return fn.apply(this, args) };"))(fn);
    Object.defineProperty(newFn, 'name', {
      value: name
    });
    tag = tag !== null && tag !== void 0 ? tag : name;
    Object.defineProperty(newFn, Symbol.toPrimitive, {
      enumerable: false,
      configurable: true,
      value: function value() {
        return tag;
      }
    });
    newFn.prototype.toString = toString;
    newFn.toString = toString;
    return newFn;
  }

  /**
   * @internal
   */

  var _GenericWeavingStrategy = /*#__PURE__*/function () {
    function _GenericWeavingStrategy() {
      _classCallCheck(this, _GenericWeavingStrategy);
    }

    _createClass(_GenericWeavingStrategy, [{
      key: "after",
      value: function after(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
      }
    }, {
      key: "afterReturn",
      value: function afterReturn(ctxt, advices) {
        ctxt.value = ctxt.value; // force key 'value' to be present

        advices.forEach(function (advice) {
          ctxt.value = advice(ctxt, ctxt.value);
        });
        return ctxt.value;
      }
    }, {
      key: "afterThrow",
      value: function afterThrow(ctxt, advices) {
        var allowReturn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var _a;

        if (advices.length) {
          ctxt.value = (_a = ctxt.value) !== null && _a !== void 0 ? _a : undefined; // force key 'value' to be present

          advices.forEach(function (advice) {
            ctxt.advice = advice;
            ctxt.value = advice(ctxt, ctxt.error);
            delete ctxt.advice;

            if (!allowReturn && !utils.isUndefined(ctxt.value)) {
              throw new commons.AdviceError(advice, "Returning from advice is not supported");
            }
          });
          return ctxt.value;
        } else {
          utils.assert(!!ctxt.error); // pass-trough errors by default

          throw ctxt.error;
        }
      }
    }, {
      key: "around",
      value: function around(ctxt, advices, jp) {
        var allowReturn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        advices.reverse().forEach(function (advice) {
          var originalJp = jp;

          var nextJp = commons._JoinpointFactory.create(advice, ctxt, function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return originalJp(args);
          });

          jp = function jp(args) {
            ctxt.joinpoint = nextJp;
            ctxt.args = args;
            ctxt.advice = advice;
            ctxt.value = advice(ctxt, nextJp, args);

            if (ctxt.value !== undefined && !allowReturn) {
              throw new commons.AdviceError(advice, "Returning from advice is not supported");
            }

            return ctxt.value;
          };
        });
        return jp;
      }
    }, {
      key: "before",
      value: function before(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
      }
    }, {
      key: "_applyNonReturningAdvices",
      value: function _applyNonReturningAdvices(ctxt, advices) {
        advices.forEach(function (advice) {
          ctxt.advice = advice;
          var retVal = advice(ctxt);
          delete ctxt.advice;

          if (!utils.isUndefined(retVal)) {
            throw new commons.AdviceError(advice, "Returning from advice is not supported");
          }
        });
      }
    }]);

    return _GenericWeavingStrategy;
  }();

  /**
   * @internal
   */

  var _ClassWeavingStrategy = /*#__PURE__*/function (_GenericWeavingStrate) {
    _inherits(_ClassWeavingStrategy, _GenericWeavingStrate);

    var _super = _createSuper(_ClassWeavingStrategy);

    function _ClassWeavingStrategy() {
      _classCallCheck(this, _ClassWeavingStrategy);

      return _super.apply(this, arguments);
    }

    _createClass(_ClassWeavingStrategy, [{
      key: "compile",
      value: function compile(ctxt, advices) {
        // if another @Compile advice has been applied
        // replace wrapped ctor by original ctor before it gets wrapped again
        ctxt.target.proto.constructor = utils._getReferenceConstructor(ctxt.target.proto);

        utils._setReferenceConstructor(ctxt.target.proto, ctxt.target.proto.constructor);

        var ctor;
        advices.forEach(function (advice) {
          ctxt.advice = advice;
          ctor = advice(ctxt);
        });
        delete ctxt.advice;
        return ctxt.target.proto.constructor = ctor !== null && ctor !== void 0 ? ctor : ctxt.target.proto.constructor;
      }
    }, {
      key: "preAround",
      value: function preAround(ctxt) {
        // original ctor invocation will discard any changes done to instance before, so accessing ctxt.instance is forbidden
        this.originalInstance = ctxt.instance;
        ctxt.instance = null;
      }
    }, {
      key: "around",
      value: function around(ctxt, advices, joinpoint) {
        advices.reverse().forEach(function (advice) {
          var originalJp = joinpoint;

          var nextJp = commons._JoinpointFactory.create(advice, ctxt, function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return originalJp(args);
          });

          joinpoint = function joinpoint(args) {
            var _a;

            ctxt.joinpoint = nextJp;
            ctxt.args = args;
            ctxt.advice = advice;
            return ctxt.instance = (_a = advice(ctxt, nextJp, args)) !== null && _a !== void 0 ? _a : ctxt.instance;
          };
        });
        return joinpoint;
      }
    }, {
      key: "initialJoinpoint",
      value: function initialJoinpoint(ctxt, originalCtor) {
        var _a; // We need to keep originalInstance as the instance, because of instanceof.
        // Merge the new instance into originalInstance;


        Object.assign(this.originalInstance, (_a = _construct(originalCtor, _toConsumableArray(ctxt.args))) !== null && _a !== void 0 ? _a : this.originalInstance);
        ctxt.instance = this.originalInstance;
      }
    }, {
      key: "afterReturn",
      value: function afterReturn(ctxt, advices) {
        var newInstance = ctxt.instance;
        advices.forEach(function (advice) {
          ctxt.value = ctxt.instance;
          ctxt.advice = advice;
          newInstance = advice(ctxt, ctxt.value);

          if (!utils.isUndefined(newInstance)) {
            ctxt.instance = newInstance;
          }

          delete ctxt.advice;
        });
        return ctxt.instance;
      }
    }, {
      key: "preAfterThrow",
      value: function preAfterThrow(ctxt) {
        // as of ES6 classes, 'this' is no more available after ctor thrown.
        // replace 'this' with partial this
        ctxt.instance = this.originalInstance;
      }
    }, {
      key: "afterThrow",
      value: function afterThrow(ctxt, advices) {
        if (!advices.length) {
          // pass-trough errors by default
          throw ctxt.error;
        } else {
          var newInstance = ctxt.instance;
          advices.forEach(function (advice) {
            ctxt.advice = advice;
            newInstance = advice(ctxt, ctxt.error);

            if (!utils.isUndefined(newInstance)) {
              ctxt.instance = newInstance;
            }

            delete ctxt.advice;
          });
          return ctxt.instance;
        }
      }
    }, {
      key: "finalize",
      value: function finalize(ctxt, joinpoint) {
        var _a;

        utils.assert(!!((_a = ctxt.target) === null || _a === void 0 ? void 0 : _a.proto));
        var originalCtor = ctxt.target.proto.constructor;
        var ctorName = originalCtor.name;
        joinpoint = _defineFunctionProperties(joinpoint, ctorName, "class ".concat(ctorName, "$$advised {}"), originalCtor.toString.bind(originalCtor));
        joinpoint.prototype = ctxt.target.proto;
        joinpoint.prototype.constructor = joinpoint;
        return joinpoint;
      }
    }]);

    return _ClassWeavingStrategy;
  }(_GenericWeavingStrategy);

  /**
   * @internal
   */

  var _MethodWeavingStrategy = /*#__PURE__*/function (_GenericWeavingStrate) {
    _inherits(_MethodWeavingStrategy, _GenericWeavingStrate);

    var _super = _createSuper(_MethodWeavingStrategy);

    function _MethodWeavingStrategy() {
      _classCallCheck(this, _MethodWeavingStrategy);

      return _super.apply(this, arguments);
    }

    _createClass(_MethodWeavingStrategy, [{
      key: "compile",
      value: function compile(ctxt, advices) {
        var _a;

        var target = ctxt.target; // save & restore original descriptor

        Reflect.defineProperty(target.proto, target.propertyKey, utils.getOrComputeMetadata('aspectjs.originalMethodDescriptor', target.proto, ctxt.target.propertyKey, function () {
          return Object.assign({}, Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey));
        }, true));
        var lastCompileAdvice = advices[0];
        var newDescriptor;
        advices.forEach(function (advice) {
          var _a;

          lastCompileAdvice = advice;
          ctxt.advice = advice;
          newDescriptor = (_a = advice(ctxt)) !== null && _a !== void 0 ? _a : newDescriptor;
        });
        delete ctxt.advice;

        if (utils.isUndefined(newDescriptor)) {
          return Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey);
        } else {
          if (((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) === null || _a === void 0 ? void 0 : _a.configurable) === false) {
            throw new commons.AdviceError(lastCompileAdvice, "".concat(target.label, " is not configurable"));
          } // ensure value is a function


          if (!utils.isFunction(newDescriptor.value)) {
            throw new commons.AdviceError(lastCompileAdvice, "Expected advice to return a method descriptor. Got: ".concat(newDescriptor.value));
          }

          if (utils.isUndefined(newDescriptor.enumerable)) {
            newDescriptor.enumerable = false;
          }

          if (utils.isUndefined(newDescriptor.configurable)) {
            newDescriptor.configurable = true;
          } // test property validity


          newDescriptor = Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
          Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
          return newDescriptor;
        }
      }
    }, {
      key: "initialJoinpoint",
      value: function initialJoinpoint(ctxt, refDescriptor) {
        ctxt.value = refDescriptor.value.apply(ctxt.instance, ctxt.args);
      }
    }, {
      key: "finalize",
      value: function finalize(ctxt, jp) {
        var newDescriptor = Object.getOwnPropertyDescriptor(ctxt.target.proto, ctxt.target.propertyKey);
        newDescriptor.value = jp;
        var originalFn = ctxt.target.proto[ctxt.target.propertyKey];
        newDescriptor.value = _defineFunctionProperties(newDescriptor.value, originalFn.name, originalFn.toString().split('\n')[0], originalFn.toString.bind(originalFn));
        Reflect.defineMetadata('aspectjs.enhancedMethodDescriptor', true, newDescriptor);
        return newDescriptor;
      }
    }]);

    return _MethodWeavingStrategy;
  }(_GenericWeavingStrategy);

  var _defineProperty = Object.defineProperty;
  var _ParameterWeavingStrategy = /*#__PURE__*/function (_MethodWeavingStrateg) {
    _inherits(_ParameterWeavingStrategy, _MethodWeavingStrateg);

    var _super = _createSuper(_ParameterWeavingStrategy);

    function _ParameterWeavingStrategy() {
      _classCallCheck(this, _ParameterWeavingStrategy);

      return _super.call(this);
    }

    _createClass(_ParameterWeavingStrategy, [{
      key: "compile",
      value: function compile(ctxt, advices) {
        var target = ctxt.target; // save & restore original descriptor

        var originalDescriptor = utils.getOrComputeMetadata('aspectjs.originalPropertyDescriptor', target.proto, ctxt.target.propertyKey, function () {
          return Object.assign({}, Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey));
        }, true);
        Reflect.defineProperty(target.proto, target.propertyKey, originalDescriptor);
        Reflect.defineMetadata('aspectjs.originalMethodDescriptor', originalDescriptor, target.proto, target.propertyKey);
        return _get(_getPrototypeOf(_ParameterWeavingStrategy.prototype), "compile", this).call(this, ctxt, advices);
      }
    }, {
      key: "finalize",
      value: function finalize(ctxt, jp) {
        var newDescriptor = _get(_getPrototypeOf(_ParameterWeavingStrategy.prototype), "finalize", this).call(this, ctxt, jp);

        Reflect.defineProperty(ctxt.target.proto, ctxt.target.propertyKey, newDescriptor); // We want any further method advice t use this descriptor as a reference

        Reflect.defineMetadata('aspectjs.originalMethodDescriptor', newDescriptor, ctxt.target.proto, ctxt.target.propertyKey); // Override method descriptor from parameter decorator is not allowed because return value of this parameter decorators is ignored
        // Moreover, Reflect.decorate will overwrite any changes made on proto[propertyKey]
        // We monkey patch Object.defineProperty to prevent this;

        Object.defineProperty = function (o, p, attributes) {
          if (o === ctxt.target.proto && p === ctxt.target.propertyKey) {
            // restore original defineProperty method
            Object.defineProperty = _defineProperty; // if attempt to write an enhanced descriptor... let go

            if (Reflect.getOwnMetadata('aspectjs.enhancedMethodDescriptor', attributes)) {
              return Object.defineProperty(o, p, attributes);
            } else {
              // prevent writing back old descriptor
              return newDescriptor;
            }
          }

          return _defineProperty(o, p, attributes);
        };

        return newDescriptor;
      }
    }]);

    return _ParameterWeavingStrategy;
  }(_MethodWeavingStrategy);

  /**
   * @internal
   */

  var _PropertyGetWeavingStrategy = /*#__PURE__*/function (_GenericWeavingStrate) {
    _inherits(_PropertyGetWeavingStrategy, _GenericWeavingStrate);

    var _super = _createSuper(_PropertyGetWeavingStrategy);

    function _PropertyGetWeavingStrategy() {
      _classCallCheck(this, _PropertyGetWeavingStrategy);

      return _super.apply(this, arguments);
    }

    _createClass(_PropertyGetWeavingStrategy, [{
      key: "compile",
      value: function compile(ctxt, advices) {
        var _a;

        var target = ctxt.target;

        if (this.compiledDescriptor) {
          return this.compiledDescriptor;
        } // if another @Compile advice has been applied
        // replace wrapped descriptor by original descriptor before it gets wrapped again


        target.descriptor = utils.getOrComputeMetadata('aspectjs.originalDescriptor', target.proto, target.propertyKey, function () {
          var _a;

          return (_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) !== null && _a !== void 0 ? _a : {
            configurable: true,
            enumerable: true,
            get: function get() {
              return Reflect.getOwnMetadata("aspectjs.propValue", this, target.propertyKey);
            },
            set: function set(value) {
              Reflect.defineMetadata("aspectjs.propValue", value, this, target.propertyKey);
            }
          };
        }, true);
        var advice;
        var newDescriptor = ctxt.target.descriptor;
        advices.forEach(function (advice) {
          var _a;

          ctxt.advice = advice;
          newDescriptor = (_a = advice(ctxt)) !== null && _a !== void 0 ? _a : newDescriptor;
        });
        delete ctxt.advice;

        if (newDescriptor) {
          if (((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) === null || _a === void 0 ? void 0 : _a.configurable) === false) {
            throw new commons.AdviceError(advice, "".concat(target.label, " is not configurable"));
          } // test property validity


          var surrogate = {
            prop: ''
          };
          var surrogateProp = Reflect.getOwnPropertyDescriptor(surrogate, 'prop');

          if (utils.isUndefined(newDescriptor.enumerable)) {
            newDescriptor.enumerable = surrogateProp.enumerable;
          }

          if (utils.isUndefined(newDescriptor.configurable)) {
            newDescriptor.configurable = surrogateProp.configurable;
          } // normalize the descriptor


          newDescriptor = Object.getOwnPropertyDescriptor(Object.defineProperty(surrogate, 'newProp', newDescriptor), 'newProp');
          Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
        }

        if (newDescriptor.hasOwnProperty('value')) {
          var propValue = newDescriptor.value;

          newDescriptor.get = function () {
            return propValue;
          };

          delete newDescriptor.writable;
          delete newDescriptor.value;
        }

        return this.compiledDescriptor = newDescriptor;
      }
    }, {
      key: "preBefore",
      value: function preBefore(ctxt) {
        ctxt.args = [];
      }
    }, {
      key: "initialJoinpoint",
      value: function initialJoinpoint(ctxt, originalDescriptor) {
        utils.assert(utils.isFunction(originalDescriptor.get));
        ctxt.value = commons._JoinpointFactory.create(null, ctxt, originalDescriptor.get)();
      }
    }, {
      key: "finalize",
      value: function finalize(ctxt, joinpoint) {
        var newDescriptor = Object.assign(Object.assign({}, this.compiledDescriptor), {
          get: joinpoint
        }); // test property validity

        Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
        return newDescriptor;
      }
    }]);

    return _PropertyGetWeavingStrategy;
  }(_GenericWeavingStrategy);

  /**
   * @internal
   */

  var _PropertySetWeavingStrategy = /*#__PURE__*/function (_GenericWeavingStrate) {
    _inherits(_PropertySetWeavingStrategy, _GenericWeavingStrate);

    var _super = _createSuper(_PropertySetWeavingStrategy);

    function _PropertySetWeavingStrategy(getterHooks) {
      var _this;

      _classCallCheck(this, _PropertySetWeavingStrategy);

      _this = _super.call(this);
      _this.getterHooks = getterHooks;
      return _this;
    }

    _createClass(_PropertySetWeavingStrategy, [{
      key: "compile",
      value: function compile(ctxt) {
        return this.compiledDescriptor = this.getterHooks.compile(ctxt, null);
      }
    }, {
      key: "initialJoinpoint",
      value: function initialJoinpoint(ctxt, refDescriptor) {
        utils.assert(utils.isFunction(refDescriptor === null || refDescriptor === void 0 ? void 0 : refDescriptor.set));
        ctxt.value = commons._JoinpointFactory.create(null, ctxt, refDescriptor.set)(ctxt.args);
      }
    }, {
      key: "around",
      value: function around(ctxt, advices, jp) {
        return _get(_getPrototypeOf(_PropertySetWeavingStrategy.prototype), "around", this).call(this, ctxt, advices, jp, false);
      }
    }, {
      key: "afterReturn",
      value: function afterReturn(ctxt, advices) {
        return this._applyNonReturningAdvices(ctxt, advices);
      }
    }, {
      key: "afterThrow",
      value: function afterThrow(ctxt, advices) {
        _get(_getPrototypeOf(_PropertySetWeavingStrategy.prototype), "afterThrow", this).call(this, ctxt, advices, false);
      }
    }, {
      key: "after",
      value: function after(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
      }
    }, {
      key: "finalize",
      value: function finalize(ctxt, joinpoint) {
        var newDescriptor = Object.assign(Object.assign({}, this.compiledDescriptor), {
          set: joinpoint
        }); // test property validity

        Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
        return newDescriptor;
      }
    }]);

    return _PropertySetWeavingStrategy;
  }(_GenericWeavingStrategy);

  /**
   * The JitWeaver wires up advices to the corresponding annotations as soon as the annotation gets processed by JS interpreter.
   * @public
   */

  var JitWeaver = /*#__PURE__*/function (_WeaverProfile) {
    _inherits(JitWeaver, _WeaverProfile);

    var _super = _createSuper(JitWeaver);

    /**
     *
     * @param _context - the weaver context to attach this weaver to.
     * @param _prod - When prod mode is activated, enabling an aspect after Annotation compilation is prohibed.
     */
    function JitWeaver(_context) {
      var _this$_enhancers;

      var _this;

      var _prod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      _classCallCheck(this, JitWeaver);

      _this = _super.call(this);
      _this._context = _context;
      _this._prod = _prod;
      _this._enhancers = (_this$_enhancers = {}, _defineProperty$1(_this$_enhancers, commons.AnnotationType.CLASS, _this._enhanceClass.bind(_assertThisInitialized(_this))), _defineProperty$1(_this$_enhancers, commons.AnnotationType.PROPERTY, _this._enhanceProperty.bind(_assertThisInitialized(_this))), _defineProperty$1(_this$_enhancers, commons.AnnotationType.METHOD, _this._enhanceMethod.bind(_assertThisInitialized(_this))), _defineProperty$1(_this$_enhancers, commons.AnnotationType.PARAMETER, _this._enhanceParameter.bind(_assertThisInitialized(_this))), _this$_enhancers);
      _this._planFactory = new _AdviceExecutionPlanFactory();
      return _this;
    }

    _createClass(JitWeaver, [{
      key: "enable",
      value: function enable() {
        var _WeaverProfile2,
            _this2 = this;

        var _aspects = (_WeaverProfile2 = new commons.WeaverProfile()).enable.apply(_WeaverProfile2, arguments).getAspects();

        try {
          var _this$_context$aspect, _get2;

          (_this$_context$aspect = this._context.aspects.registry).register.apply(_this$_context$aspect, _toConsumableArray(_aspects));

          if (this._prod) {
            // check annotations has not already been processed
            var alreadyProcessedAnnotations = new Map();

            _aspects.forEach(function (aspect) {
              _this2._context.aspects.registry.getAdvicesByAspect(aspect).forEach(function (a) {
                return alreadyProcessedAnnotations.set(a.pointcut, aspect);
              });
            });

            alreadyProcessedAnnotations.forEach(function (aspect, pointcut) {
              var _a, _b;

              if (_this2._context.annotations.bundle.all(pointcut.annotation.ref).length) {
                throw new commons.WeavingError("Cannot enable aspect ".concat((_b = (_a = aspect.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : aspect, " because annotation ").concat(pointcut.annotation, " has already been applied"));
              }
            });
          }

          var r = (_get2 = _get(_getPrototypeOf(JitWeaver.prototype), "enable", this)).call.apply(_get2, [this].concat(_toConsumableArray(_aspects)));

          _aspects.filter(function (a) {
            return utils.isFunction(a.onEnable);
          }).forEach(function (a) {
            return a.onEnable.call(a, _this2);
          });

          return r;
        } catch (e) {
          var _this$_context$aspect2;

          (_this$_context$aspect2 = this._context.aspects.registry).remove.apply(_this$_context$aspect2, _toConsumableArray(_aspects));

          throw e;
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        var _WeaverProfile3,
            _this3 = this,
            _get3;

        var _aspects = (_WeaverProfile3 = new commons.WeaverProfile()).enable.apply(_WeaverProfile3, arguments).getAspects();

        _aspects.filter(function (a) {
          return utils.isFunction(a.onDisable);
        }).forEach(function (a) {
          return a.onEnable.call(a, _this3);
        });

        return (_get3 = _get(_getPrototypeOf(JitWeaver.prototype), "disable", this)).call.apply(_get3, [this].concat(_toConsumableArray(_aspects)));
      }
    }, {
      key: "reset",
      value: function reset() {
        this._planFactory = new _AdviceExecutionPlanFactory();
        return _get(_getPrototypeOf(JitWeaver.prototype), "reset", this).call(this);
      }
    }, {
      key: "enhance",
      value: function enhance(target) {
        var ctxt = new AdviceContextImpl(target, this._context.annotations.bundle.at(target.location));
        return this._enhancers[target.type](ctxt);
      }
    }, {
      key: "_enhanceClass",
      value: function _enhanceClass(ctxt) {
        var plan = this._planFactory.create(ctxt.target, new _ClassWeavingStrategy());

        return plan.compile(ctxt).link();
      }
    }, {
      key: "_enhanceProperty",
      value: function _enhanceProperty(ctxt) {
        var getterHooks = new _PropertyGetWeavingStrategy();

        var gettersPlan = this._planFactory.create(ctxt.target, getterHooks, {
          name: 'get',
          fn: _isPropertyGet
        });

        var newDescriptor = gettersPlan.compile(ctxt).link();

        if (_isDescriptorWritable(newDescriptor)) {
          var settersPlan = this._planFactory.create(ctxt.target, new _PropertySetWeavingStrategy(getterHooks), {
            name: 'set',
            fn: _isPropertySet
          });

          newDescriptor.set = settersPlan.compile(ctxt).link().set;
          delete newDescriptor.writable;
        } else {
          delete newDescriptor.set;
        }

        var target = ctxt.target;
        Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
        return newDescriptor;
      }
    }, {
      key: "_enhanceMethod",
      value: function _enhanceMethod(ctxt) {
        var plan = this._planFactory.create(ctxt.target, new _MethodWeavingStrategy());

        return plan.compile(ctxt).link();
      }
    }, {
      key: "_enhanceParameter",
      value: function _enhanceParameter(ctxt) {
        var plan = this._planFactory.create(ctxt.target, new _ParameterWeavingStrategy());

        return plan.compile(ctxt).link();
      }
    }]);

    return JitWeaver;
  }(commons.WeaverProfile);

  function _isPropertyGet(a) {
    return a.pointcut.ref.startsWith('property#get');
  }

  function _isPropertySet(a) {
    return a.pointcut.ref.startsWith('property#set');
  }

  function _isDescriptorWritable(propDescriptor) {
    var desc = propDescriptor;
    return !desc || desc.hasOwnProperty('writable') && desc.writable || utils.isFunction(desc.set);
  }

  var AdviceContextImpl = /*#__PURE__*/function () {
    function AdviceContextImpl(target, bundle) {
      _classCallCheck(this, AdviceContextImpl);

      this.target = target;
      this.data = {};
      this.annotations = bundle;
    }

    _createClass(AdviceContextImpl, [{
      key: "clone",
      value: function clone() {
        return Object.assign(Object.create(Reflect.getPrototypeOf(this)), this);
      }
    }, {
      key: "toString",
      value: function toString() {
        return "".concat(this.advice, " on ").concat(this.target.label);
      }
    }]);

    return AdviceContextImpl;
  }();

  var bundleRegistry = {
    byTargetClassRef: {},
    byAnnotation: {}
  };
  var bundle = new commons.RootAnnotationsBundle(bundleRegistry);
  var annotationRegistry = new commons.AnnotationRegistry(bundleRegistry);
  /**
   * @public
   */

  var WeaverContextImpl = /*#__PURE__*/function () {
    function WeaverContextImpl() {
      _classCallCheck(this, WeaverContextImpl);

      this._targetFactory = new commons.AnnotationTargetFactory();
      this.annotations = {
        location: new commons.AnnotationLocationFactory(this._targetFactory),
        registry: annotationRegistry,
        targetFactory: this._targetFactory,
        bundle: bundle
      };
      this.aspects = {
        registry: new AspectsRegistryImpl(this)
      };
      this.weaver = this._createWeaver();
    }

    _createClass(WeaverContextImpl, [{
      key: "_createWeaver",
      value: function _createWeaver() {
        return new JitWeaver(this);
      }
      /**
       * Get the global weaver
       */

    }, {
      key: "getWeaver",
      value: function getWeaver() {
        return this.weaver;
      }
    }]);

    return WeaverContextImpl;
  }();

  /**
   * @public
   */

  var WEAVER_CONTEXT = new ( /*#__PURE__*/function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _createClass(_class, [{
      key: "aspects",
      get: // Allow setWeaverContext to switch implementation of weaver.
      // This is used for resetWaverContext as a convenience for tests
      function get() {
        return commons._getWeaverContext().aspects;
      }
    }, {
      key: "annotations",
      get: function get() {
        return commons._getWeaverContext().annotations;
      }
    }, {
      key: "getWeaver",
      value: function getWeaver() {
        return commons._getWeaverContext().getWeaver();
      }
    }]);

    return _class;
  }())();

  commons._setWeaverContext(new WeaverContextImpl());

  exports.JitWeaver = JitWeaver;
  exports.WEAVER_CONTEXT = WEAVER_CONTEXT;
  exports.WeaverContextImpl = WeaverContextImpl;
  exports._AdviceExecutionPlanFactory = _AdviceExecutionPlanFactory;
  exports._ExecutionPlan = _ExecutionPlan;

})));
//# sourceMappingURL=core.umd.js.map
