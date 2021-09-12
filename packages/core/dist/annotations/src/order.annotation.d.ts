import { AnnotationRef, Decorator } from '@aspectjs/core/commons';
/**
 * @public
 */
export declare const OrderAnnotation: ((order: number) => Decorator) & AnnotationRef;
/**
 * @public
 */
export declare type OrderType = typeof OrderAnnotation & {
    LOWEST_PRECEDENCE: number;
    HIGHEST_PRECEDENCE: number;
};
/**
 * @public
 */
export declare const Order: OrderType;
//# sourceMappingURL=order.annotation.d.ts.map