import { Mutable } from '@aspectjs/core/utils';
import { AroundAdvice, AroundContext } from '../advices';
import { JoinPoint } from '../types';
/**
 * @internal
 */
export declare class _JoinpointFactory {
    static create<T>(advice: AroundAdvice<T>, ctxt: Mutable<AroundContext<T>>, fn: (...args: any[]) => any): JoinPoint<T>;
}
//# sourceMappingURL=joinpoint-factory.d.ts.map