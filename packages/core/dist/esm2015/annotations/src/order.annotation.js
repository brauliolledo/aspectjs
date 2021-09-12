import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';

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

export { Order, OrderAnnotation };
//# sourceMappingURL=order.annotation.js.map
