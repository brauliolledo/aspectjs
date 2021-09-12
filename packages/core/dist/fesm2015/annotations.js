import { isString, setAspectOptions } from '@aspectjs/core/utils';
import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';

let _globalAspectId = 0;
/**
 * @public
 */
const Aspect = ASPECTJS_ANNOTATION_FACTORY.create(function Aspect(id = {}) {
    return function (target) {
        var _a;
        const options = isString(id) ? { id: id } : (_a = id) !== null && _a !== void 0 ? _a : {};
        if (options.id === undefined) {
            options.id = `AnonymousAspect#${_globalAspectId++}`;
        }
        else if (!isString(options.id)) {
            throw new TypeError(`Aspect ${target.name} should have a string id. Got: ${options.id}`);
        }
        setAspectOptions(target, options);
    };
});

/**
 * @public
 */
const After = ASPECTJS_ANNOTATION_FACTORY.create(function After(pointcutExp) {
    return;
});

/**
 * @public
 */
const AfterReturn = ASPECTJS_ANNOTATION_FACTORY.create(function AfterReturn(pointcutExp) {
    return;
});

/**
 * @public
 */
const AfterThrow = ASPECTJS_ANNOTATION_FACTORY.create(function AfterThrow(pointcutExp) {
    return;
});

/**
 * @public
 */
const Around = ASPECTJS_ANNOTATION_FACTORY.create(function Around(pointcutExp) {
    return;
});

/**
 * @public
 */
const Compile = ASPECTJS_ANNOTATION_FACTORY.create(function Compile(pointcutExp) {
    return;
});

/**
 * @public
 */
const Before = ASPECTJS_ANNOTATION_FACTORY.create(function Before(pointcutExp) {
    return;
});

/**
 * @public
 */
const OrderAnnotation = ASPECTJS_ANNOTATION_FACTORY.create(function Order(order) {
    return;
});
Object.defineProperties(OrderAnnotation, {
    LOWEST_PRECEDENCE: {
        writable: false,
        value: Infinity,
    },
    HIGHEST_PRECEDENCE: {
        writable: false,
        value: -Infinity,
    },
});
/**
 * @public
 */
const Order = OrderAnnotation;

export { After, AfterReturn, AfterThrow, Around, Aspect, Before, Compile, Order, OrderAnnotation };
//# sourceMappingURL=annotations.js.map
