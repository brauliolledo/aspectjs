import { AdviceError } from '@aspectjs/core/commons';
import { getOrComputeMetadata, isUndefined, isFunction } from '@aspectjs/core/utils';
import { _defineFunctionProperties } from '../../utils.js';
import { _GenericWeavingStrategy } from './generic-weaving-strategy.js';

/**
 * @internal
 */
class _MethodWeavingStrategy extends _GenericWeavingStrategy {
    compile(ctxt, advices) {
        var _a;
        const target = ctxt.target;
        // save & restore original descriptor
        Reflect.defineProperty(target.proto, target.propertyKey, getOrComputeMetadata('aspectjs.originalMethodDescriptor', target.proto, ctxt.target.propertyKey, () => {
            return Object.assign({}, Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey));
        }, true));
        let lastCompileAdvice = advices[0];
        let newDescriptor;
        advices.forEach((advice) => {
            var _a;
            lastCompileAdvice = advice;
            ctxt.advice = advice;
            newDescriptor =
                (_a = advice(ctxt)) !== null && _a !== void 0 ? _a : newDescriptor;
        });
        delete ctxt.advice;
        if (isUndefined(newDescriptor)) {
            return Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey);
        }
        else {
            if (((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) === null || _a === void 0 ? void 0 : _a.configurable) === false) {
                throw new AdviceError(lastCompileAdvice, `${target.label} is not configurable`);
            }
            // ensure value is a function
            if (!isFunction(newDescriptor.value)) {
                throw new AdviceError(lastCompileAdvice, `Expected advice to return a method descriptor. Got: ${newDescriptor.value}`);
            }
            if (isUndefined(newDescriptor.enumerable)) {
                newDescriptor.enumerable = false;
            }
            if (isUndefined(newDescriptor.configurable)) {
                newDescriptor.configurable = true;
            }
            // test property validity
            newDescriptor = Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
            Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
            return newDescriptor;
        }
    }
    initialJoinpoint(ctxt, refDescriptor) {
        ctxt.value = refDescriptor.value.apply(ctxt.instance, ctxt.args);
    }
    finalize(ctxt, jp) {
        const newDescriptor = Object.getOwnPropertyDescriptor(ctxt.target.proto, ctxt.target.propertyKey);
        newDescriptor.value = jp;
        const originalFn = ctxt.target.proto[ctxt.target.propertyKey];
        newDescriptor.value = _defineFunctionProperties(newDescriptor.value, originalFn.name, originalFn.toString().split('\n')[0], originalFn.toString.bind(originalFn));
        Reflect.defineMetadata('aspectjs.enhancedMethodDescriptor', true, newDescriptor);
        return newDescriptor;
    }
}

export { _MethodWeavingStrategy };
//# sourceMappingURL=method-weaving-strategy.js.map
