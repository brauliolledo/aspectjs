(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@aspectjs/memo'), require('rxjs'), require('rxjs/operators'), require('@aspectjs/core/annotations'), require('@aspectjs/core/commons')) :
  typeof define === 'function' && define.amd ? define(['exports', '@aspectjs/memo', 'rxjs', 'rxjs/operators', '@aspectjs/core/annotations', '@aspectjs/core/commons'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.aspectjs = global.aspectjs || {}, global.aspectjs['memo_observable-support'] = {}), global.aspectjs.memo, global.rxjs, global.rxjs.operators, global.aspectjs.core_annotations, global.aspectjs.core_commons));
}(this, (function (exports, memo, rxjs, operators, annotations, commons) { 'use strict';

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

  /**
   * Supports marshalling Observables
   * @public
   */

  var ObservableMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(ObservableMarshaller, _MemoMarshaller);

    var _super = _createSuper(ObservableMarshaller);

    function ObservableMarshaller() {
      var _this;

      _classCallCheck(this, ObservableMarshaller);

      _this = _super.apply(this, arguments);
      _this.types = 'Observable';
      return _this;
    }

    _createClass(ObservableMarshaller, [{
      key: "marshal",
      value: function marshal(frame, context, defaultMarshal) {
        frame.setAsyncValue(frame.value.pipe(operators.shareReplay(1)).toPromise().then(function (v) {
          return defaultMarshal(v);
        }));
        return frame;
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame, context, defaultUnmarshal) {
        if (frame.isAsync()) {
          return rxjs.from(frame.async.then(function (v) {
            return defaultUnmarshal(v);
          })).pipe(operators.share());
        } else {
          return rxjs.from(Promise.resolve(defaultUnmarshal(frame.value)));
        }
      }
    }]);

    return ObservableMarshaller;
  }(memo.MemoMarshaller);

  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __metadata(metadataKey, metadataValue) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }

  var ObservableMemoSupportAspect_1;
  /**
   * Enable support for Observables memoization.
   * @public
   */

  exports.ObservableMemoSupportAspect = ObservableMemoSupportAspect_1 = /*#__PURE__*/function () {
    function ObservableMemoSupportAspect() {
      _classCallCheck(this, ObservableMemoSupportAspect);
    }

    _createClass(ObservableMemoSupportAspect, [{
      key: "onEnable",
      value: function onEnable(weaver) {
        var memoAspect = weaver.getAspect(memo.MemoAspect);

        if (!memoAspect) {
          throw new commons.WeavingError("Cannot enable ".concat(ObservableMemoSupportAspect_1.name, ": ").concat(memo.MemoAspect.name, " should be enabled first"));
        }

        memoAspect.addMarshaller(new ObservableMarshaller());
      }
    }, {
      key: "onDisable",
      value: function onDisable(weaver) {
        var _a;

        (_a = weaver.getAspect(memo.MemoAspect)) === null || _a === void 0 ? void 0 : _a.removeMarshaller(new ObservableMarshaller());
      }
    }, {
      key: "shareReplay",
      value: function shareReplay(ctxt) {
        if (rxjs.isObservable(ctxt.value)) {
          return ctxt.value.pipe(operators.shareReplay(1));
        }

        return ctxt.value;
      }
    }]);

    return ObservableMemoSupportAspect;
  }();

  __decorate([annotations.AfterReturn(commons.on.method.withAnnotations(memo.Memo)), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], exports.ObservableMemoSupportAspect.prototype, "shareReplay", null);

  exports.ObservableMemoSupportAspect = ObservableMemoSupportAspect_1 = __decorate([annotations.Aspect('@aspectjs/memo:ObservableMemoSupportAspect')], exports.ObservableMemoSupportAspect);

  exports.ObservableMarshaller = ObservableMarshaller;

})));
//# sourceMappingURL=observable-support.umd.js.map
