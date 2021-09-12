import { AdviceError, _JoinpointFactory } from '@aspectjs/core/commons';
import { getOrComputeMetadata, isUndefined, assert, isFunction } from '@aspectjs/core/utils';
import { _GenericWeavingStrategy } from './generic-weaving-strategy.js';

/**
 * @internal
 */
class _PropertyGetWeavingStrategy extends _GenericWeavingStrategy {
    compile(ctxt, advices) {
        var _a;
        const target = ctxt.target;
        if (this.compiledDescriptor) {
            return this.compiledDescriptor;
        }
        // if another @Compile advice has been applied
        // replace wrapped descriptor by original descriptor before it gets wrapped again
        target.descriptor = getOrComputeMetadata('aspectjs.originalDescriptor', target.proto, target.propertyKey, () => {
            var _a;
            return ((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) !== null && _a !== void 0 ? _a : {
                configurable: true,
                enumerable: true,
                get() {
                    return Reflect.getOwnMetadata(`aspectjs.propValue`, this, target.propertyKey);
                },
                set(value) {
                    Reflect.defineMetadata(`aspectjs.propValue`, value, this, target.propertyKey);
                },
            });
        }, true);
        let advice;
        let newDescriptor = ctxt.target.descriptor;
        advices.forEach((advice) => {
            var _a;
            ctxt.advice = advice;
            newDescriptor = (_a = advice(ctxt)) !== null && _a !== void 0 ? _a : newDescriptor;
        });
        delete ctxt.advice;
        if (newDescriptor) {
            if (((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) === null || _a === void 0 ? void 0 : _a.configurable) === false) {
                throw new AdviceError(advice, `${target.label} is not configurable`);
            }
            // test property validity
            const surrogate = { prop: '' };
            const surrogateProp = Reflect.getOwnPropertyDescriptor(surrogate, 'prop');
            if (isUndefined(newDescriptor.enumerable)) {
                newDescriptor.enumerable = surrogateProp.enumerable;
            }
            if (isUndefined(newDescriptor.configurable)) {
                newDescriptor.configurable = surrogateProp.configurable;
            }
            // normalize the descriptor
            newDescriptor = Object.getOwnPropertyDescriptor(Object.defineProperty(surrogate, 'newProp', newDescriptor), 'newProp');
            Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
        }
        if (newDescriptor.hasOwnProperty('value')) {
            const propValue = newDescriptor.value;
            newDescriptor.get = () => propValue;
            delete newDescriptor.writable;
            delete newDescriptor.value;
        }
        return (this.compiledDescriptor = newDescriptor);
    }
    preBefore(ctxt) {
        ctxt.args = [];
    }
    initialJoinpoint(ctxt, originalDescriptor) {
        assert(isFunction(originalDescriptor.get));
        ctxt.value = _JoinpointFactory.create(null, ctxt, originalDescriptor.get)();
    }
    finalize(ctxt, joinpoint) {
        const newDescriptor = Object.assign(Object.assign({}, this.compiledDescriptor), { get: joinpoint });
        // test property validity
        Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
        return newDescriptor;
    }
}

export { _PropertyGetWeavingStrategy };
//# sourceMappingURL=property-get-weaving-strategy.js.map
