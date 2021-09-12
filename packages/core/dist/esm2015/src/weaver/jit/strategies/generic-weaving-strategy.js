import { AdviceError, _JoinpointFactory } from '@aspectjs/core/commons';
import { isUndefined, assert } from '@aspectjs/core/utils';

/**
 * @internal
 */
class _GenericWeavingStrategy {
    after(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
    }
    afterReturn(ctxt, advices) {
        ctxt.value = ctxt.value; // force key 'value' to be present
        advices.forEach((advice) => {
            ctxt.value = advice(ctxt, ctxt.value);
        });
        return ctxt.value;
    }
    afterThrow(ctxt, advices, allowReturn = true) {
        var _a;
        if (advices.length) {
            ctxt.value = (_a = ctxt.value) !== null && _a !== void 0 ? _a : undefined; // force key 'value' to be present
            advices.forEach((advice) => {
                ctxt.advice = advice;
                ctxt.value = advice(ctxt, ctxt.error);
                delete ctxt.advice;
                if (!allowReturn && !isUndefined(ctxt.value)) {
                    throw new AdviceError(advice, `Returning from advice is not supported`);
                }
            });
            return ctxt.value;
        }
        else {
            assert(!!ctxt.error);
            // pass-trough errors by default
            throw ctxt.error;
        }
    }
    around(ctxt, advices, jp, allowReturn = true) {
        advices.reverse().forEach((advice) => {
            const originalJp = jp;
            const nextJp = _JoinpointFactory.create(advice, ctxt, (...args) => originalJp(args));
            jp = (args) => {
                ctxt.joinpoint = nextJp;
                ctxt.args = args;
                ctxt.advice = advice;
                ctxt.value = advice(ctxt, nextJp, args);
                if (ctxt.value !== undefined && !allowReturn) {
                    throw new AdviceError(advice, `Returning from advice is not supported`);
                }
                return ctxt.value;
            };
        });
        return jp;
    }
    before(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
    }
    _applyNonReturningAdvices(ctxt, advices) {
        advices.forEach((advice) => {
            ctxt.advice = advice;
            const retVal = advice(ctxt);
            delete ctxt.advice;
            if (!isUndefined(retVal)) {
                throw new AdviceError(advice, `Returning from advice is not supported`);
            }
        });
    }
}

export { _GenericWeavingStrategy };
//# sourceMappingURL=generic-weaving-strategy.js.map
