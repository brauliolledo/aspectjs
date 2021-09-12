import { _JoinpointFactory } from '@aspectjs/core/commons';
import { _getReferenceConstructor, _setReferenceConstructor, isUndefined, assert } from '@aspectjs/core/utils';
import { _defineFunctionProperties } from '../../utils.js';
import { _GenericWeavingStrategy } from './generic-weaving-strategy.js';

/**
 * @internal
 */
class _ClassWeavingStrategy extends _GenericWeavingStrategy {
    compile(ctxt, advices) {
        // if another @Compile advice has been applied
        // replace wrapped ctor by original ctor before it gets wrapped again
        ctxt.target.proto.constructor = _getReferenceConstructor(ctxt.target.proto);
        _setReferenceConstructor(ctxt.target.proto, ctxt.target.proto.constructor);
        let ctor;
        advices.forEach((advice) => {
            ctxt.advice = advice;
            ctor = advice(ctxt);
        });
        delete ctxt.advice;
        return (ctxt.target.proto.constructor = ctor !== null && ctor !== void 0 ? ctor : ctxt.target.proto.constructor);
    }
    preAround(ctxt) {
        // original ctor invocation will discard any changes done to instance before, so accessing ctxt.instance is forbidden
        this.originalInstance = ctxt.instance;
        ctxt.instance = null;
    }
    around(ctxt, advices, joinpoint) {
        advices.reverse().forEach((advice) => {
            const originalJp = joinpoint;
            const nextJp = _JoinpointFactory.create(advice, ctxt, (...args) => originalJp(args));
            joinpoint = (args) => {
                var _a;
                ctxt.joinpoint = nextJp;
                ctxt.args = args;
                ctxt.advice = advice;
                return (ctxt.instance = (_a = advice(ctxt, nextJp, args)) !== null && _a !== void 0 ? _a : ctxt.instance);
            };
        });
        return joinpoint;
    }
    initialJoinpoint(ctxt, originalCtor) {
        var _a;
        // We need to keep originalInstance as the instance, because of instanceof.
        // Merge the new instance into originalInstance;
        Object.assign(this.originalInstance, (_a = new originalCtor(...ctxt.args)) !== null && _a !== void 0 ? _a : this.originalInstance);
        ctxt.instance = this.originalInstance;
    }
    afterReturn(ctxt, advices) {
        let newInstance = ctxt.instance;
        advices.forEach((advice) => {
            ctxt.value = ctxt.instance;
            ctxt.advice = advice;
            newInstance = advice(ctxt, ctxt.value);
            if (!isUndefined(newInstance)) {
                ctxt.instance = newInstance;
            }
            delete ctxt.advice;
        });
        return ctxt.instance;
    }
    preAfterThrow(ctxt) {
        // as of ES6 classes, 'this' is no more available after ctor thrown.
        // replace 'this' with partial this
        ctxt.instance = this.originalInstance;
    }
    afterThrow(ctxt, advices) {
        if (!advices.length) {
            // pass-trough errors by default
            throw ctxt.error;
        }
        else {
            let newInstance = ctxt.instance;
            advices.forEach((advice) => {
                ctxt.advice = advice;
                newInstance = advice(ctxt, ctxt.error);
                if (!isUndefined(newInstance)) {
                    ctxt.instance = newInstance;
                }
                delete ctxt.advice;
            });
            return ctxt.instance;
        }
    }
    finalize(ctxt, joinpoint) {
        var _a;
        assert(!!((_a = ctxt.target) === null || _a === void 0 ? void 0 : _a.proto));
        const originalCtor = ctxt.target.proto.constructor;
        const ctorName = originalCtor.name;
        joinpoint = _defineFunctionProperties(joinpoint, ctorName, `class ${ctorName}$$advised {}`, originalCtor.toString.bind(originalCtor));
        joinpoint.prototype = ctxt.target.proto;
        joinpoint.prototype.constructor = joinpoint;
        return joinpoint;
    }
}

export { _ClassWeavingStrategy };
//# sourceMappingURL=class-weaving-strategy.js.map
