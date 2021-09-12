import { ASPECTJS_ANNOTATION_FACTORY, AnnotationRef } from '@aspectjs/core/commons';
// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;
/**
 * @public
 */
export const OrderAnnotation = ASPECTJS_ANNOTATION_FACTORY.create(function Order(order) {
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
export const Order = OrderAnnotation;
//# sourceMappingURL=order.annotation.js.map