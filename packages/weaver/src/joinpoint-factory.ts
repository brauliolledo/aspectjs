import { isArray, Mutable } from '@aspectjs/common/utils';
import { AdviceError, AroundAdvice, AroundContext, JoinPoint } from '@aspectjs/core';

/**
 * @internal
 */
export class _JoinpointFactory {
    static create<T>(
        advice: AroundAdvice<T>,
        ctxt: Mutable<AroundContext<T>>,
        fn: (...args: any[]) => any,
    ): JoinPoint<T> {
        function alreadyCalledFn(): void {
            throw new AdviceError(ctxt, `joinPoint already proceeded`);
        }

        return function (args?: unknown[]) {
            args = args ?? ctxt.args;
            if (!isArray(args)) {
                throw new AdviceError(ctxt, `Joinpoint arguments expected to be array. Got: ${args}`);
            }
            const jp = fn;
            fn = alreadyCalledFn;
            return jp.apply(ctxt.instance, args);
        };
    }
}
