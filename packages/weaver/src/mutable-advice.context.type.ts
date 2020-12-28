import { Advice, AdviceType, JoinPoint } from '@aspectjs/core';
import { AnnotationsBundle, AdviceTarget } from '@aspectjs/reflect';

/**
 * @internal
 */
export interface MutableAdviceContext<T = unknown, A extends AdviceType = any> {
    advice: Advice<T, A>;
    annotations: AnnotationsBundle<T>;
    instance: T;
    value: unknown;
    args: unknown[];
    error: Error;
    joinpoint: JoinPoint;
    target: AdviceTarget<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    data: Record<string, any>;

    clone(): this;
}
