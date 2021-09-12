(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@aspectjs/core/commons'), require('@aspectjs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@aspectjs/core/commons', '@aspectjs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.aspectjs = global.aspectjs || {}, global.aspectjs.core_testing = {}), global.aspectjs.core_commons, global.aspectjs.core));
}(this, (function (exports, commons, core) { 'use strict';

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

  var TestingWeaverContext = /*#__PURE__*/function (_WeaverContextImpl) {
    _inherits(TestingWeaverContext, _WeaverContextImpl);

    var _super = _createSuper(TestingWeaverContext);

    function TestingWeaverContext() {
      _classCallCheck(this, TestingWeaverContext);

      return _super.apply(this, arguments);
    }

    _createClass(TestingWeaverContext, [{
      key: "_createWeaver",
      value: function _createWeaver() {
        return new core.JitWeaver(this, false);
      }
    }]);

    return TestingWeaverContext;
  }(core.WeaverContextImpl);

  /**
   * Setup a brand new WEAVER_CONTEXT for test purposes
   * @public
   */

  function setupTestingWeaverContext() {
    var context = new TestingWeaverContext();

    commons._setWeaverContext(context);

    var weaver = context.getWeaver();
    weaver.enable.apply(weaver, arguments);
    return context;
  }
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var AClass = new commons.AnnotationFactory('tests').create(function AClass() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var BClass = new commons.AnnotationFactory('tests').create(function BClass() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var CClass = new commons.AnnotationFactory('tests').create(function CClass() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var DClass = new commons.AnnotationFactory('tests').create(function DClass() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var XClass = new commons.AnnotationFactory('tests').create(function XClass() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var AProperty = new commons.AnnotationFactory('tests').create(function AProperty() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var BProperty = new commons.AnnotationFactory('tests').create(function BProperty() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var CProperty = new commons.AnnotationFactory('tests').create(function CProperty() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var DProperty = new commons.AnnotationFactory('tests').create(function DProperty() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var XProperty = new commons.AnnotationFactory('tests').create(function XProperty() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var AMethod = new commons.AnnotationFactory('tests').create(function AMethod() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var BMethod = new commons.AnnotationFactory('tests').create(function BMethod() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var CMethod = new commons.AnnotationFactory('tests').create(function CMethod() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var DMethod = new commons.AnnotationFactory('tests').create(function DMethod() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var XMethod = new commons.AnnotationFactory('tests').create(function XMethod() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var AParameter = new commons.AnnotationFactory('tests').create(function AParameter() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var BParameter = new commons.AnnotationFactory('tests').create(function BParameter() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var CParameter = new commons.AnnotationFactory('tests').create(function CParameter() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var DParameter = new commons.AnnotationFactory('tests').create(function DParameter() {
    return;
  });
  /**
   * Dummy annotation useful for tests
   * @public
   */

  var XParameter = new commons.AnnotationFactory('tests').create(function XParameter() {
    return;
  });

  exports.AClass = AClass;
  exports.AMethod = AMethod;
  exports.AParameter = AParameter;
  exports.AProperty = AProperty;
  exports.BClass = BClass;
  exports.BMethod = BMethod;
  exports.BParameter = BParameter;
  exports.BProperty = BProperty;
  exports.CClass = CClass;
  exports.CMethod = CMethod;
  exports.CParameter = CParameter;
  exports.CProperty = CProperty;
  exports.DClass = DClass;
  exports.DMethod = DMethod;
  exports.DParameter = DParameter;
  exports.DProperty = DProperty;
  exports.XClass = XClass;
  exports.XMethod = XMethod;
  exports.XParameter = XParameter;
  exports.XProperty = XProperty;
  exports.setupTestingWeaverContext = setupTestingWeaverContext;

})));
//# sourceMappingURL=testing.umd.js.map
