import { isArray } from '@aspectjs/core/utils';
import { AdviceError } from './errors/advice-error.js';

/**
 * @internal
 */
class _JoinpointFactory {
    static create(advice, ctxt, fn) {
        function alreadyCalledFn() {
            throw new AdviceError(advice, `joinPoint already proceeded`);
        }
        return function (args) {
            args = args !== null && args !== void 0 ? args : ctxt.args;
            if (!isArray(args)) {
                throw new AdviceError(advice, `Joinpoint arguments expected to be array. Got: ${args}`);
            }
            const jp = fn;
            fn = alreadyCalledFn;
            return jp.apply(ctxt.instance, args);
        };
    }
}

export { _JoinpointFactory };
//# sourceMappingURL=joinpoint-factory.js.map
