(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@aspectjs/core/utils'), require('@aspectjs/core/commons')) :
    typeof define === 'function' && define.amd ? define(['exports', '@aspectjs/core/utils', '@aspectjs/core/commons'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.aspectjs = global.aspectjs || {}, global.aspectjs.core_annotations = {}), global.aspectjs.core_utils, global.aspectjs.core_commons));
}(this, (function (exports, utils, commons) { 'use strict';

    var _globalAspectId = 0;
    /**
     * @public
     */

    var Aspect = commons.ASPECTJS_ANNOTATION_FACTORY.create(function Aspect() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return function (target) {
        var _a;

        var options = utils.isString(id) ? {
          id: id
        } : (_a = id) !== null && _a !== void 0 ? _a : {};

        if (options.id === undefined) {
          options.id = "AnonymousAspect#".concat(_globalAspectId++);
        } else if (!utils.isString(options.id)) {
          throw new TypeError("Aspect ".concat(target.name, " should have a string id. Got: ").concat(options.id));
        }

        utils.setAspectOptions(target, options);
      };
    });

    /**
     * @public
     */

    var After = commons.ASPECTJS_ANNOTATION_FACTORY.create(function After(pointcutExp) {
      return;
    });

    /**
     * @public
     */

    var AfterReturn = commons.ASPECTJS_ANNOTATION_FACTORY.create(function AfterReturn(pointcutExp) {
      return;
    });

    /**
     * @public
     */

    var AfterThrow = commons.ASPECTJS_ANNOTATION_FACTORY.create(function AfterThrow(pointcutExp) {
      return;
    });

    /**
     * @public
     */

    var Around = commons.ASPECTJS_ANNOTATION_FACTORY.create(function Around(pointcutExp) {
      return;
    });

    /**
     * @public
     */

    var Compile = commons.ASPECTJS_ANNOTATION_FACTORY.create(function Compile(pointcutExp) {
      return;
    });

    /**
     * @public
     */

    var Before = commons.ASPECTJS_ANNOTATION_FACTORY.create(function Before(pointcutExp) {
      return;
    });

    /**
     * @public
     */

    var OrderAnnotation = commons.ASPECTJS_ANNOTATION_FACTORY.create(function Order(order) {
      return;
    });
    Object.defineProperties(OrderAnnotation, {
      LOWEST_PRECEDENCE: {
        writable: false,
        value: Infinity
      },
      HIGHEST_PRECEDENCE: {
        writable: false,
        value: -Infinity
      }
    });
    /**
     * @public
     */

    var Order = OrderAnnotation;

    exports.After = After;
    exports.AfterReturn = AfterReturn;
    exports.AfterThrow = AfterThrow;
    exports.Around = Around;
    exports.Aspect = Aspect;
    exports.Before = Before;
    exports.Compile = Compile;
    exports.Order = Order;
    exports.OrderAnnotation = OrderAnnotation;

})));
//# sourceMappingURL=annotations.umd.js.map
