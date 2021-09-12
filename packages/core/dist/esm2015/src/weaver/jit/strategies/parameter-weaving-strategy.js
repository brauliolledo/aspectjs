import { getOrComputeMetadata } from '@aspectjs/core/utils';
import { _MethodWeavingStrategy } from './method-weaving-strategy.js';

const _defineProperty = Object.defineProperty;
class _ParameterWeavingStrategy extends _MethodWeavingStrategy {
    constructor() {
        super();
    }
    compile(ctxt, advices) {
        const target = ctxt.target;
        // save & restore original descriptor
        const originalDescriptor = getOrComputeMetadata('aspectjs.originalPropertyDescriptor', target.proto, ctxt.target.propertyKey, () => {
            return Object.assign({}, Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey));
        }, true);
        Reflect.defineProperty(target.proto, target.propertyKey, originalDescriptor);
        Reflect.defineMetadata('aspectjs.originalMethodDescriptor', originalDescriptor, target.proto, target.propertyKey);
        return super.compile(ctxt, advices);
    }
    finalize(ctxt, jp) {
        const newDescriptor = super.finalize(ctxt, jp);
        Reflect.defineProperty(ctxt.target.proto, ctxt.target.propertyKey, newDescriptor);
        // We want any further method advice t use this descriptor as a reference
        Reflect.defineMetadata('aspectjs.originalMethodDescriptor', newDescriptor, ctxt.target.proto, ctxt.target.propertyKey);
        // Override method descriptor from parameter decorator is not allowed because return value of this parameter decorators is ignored
        // Moreover, Reflect.decorate will overwrite any changes made on proto[propertyKey]
        // We monkey patch Object.defineProperty to prevent this;
        Object.defineProperty = function (o, p, attributes) {
            if (o === ctxt.target.proto && p === ctxt.target.propertyKey) {
                // restore original defineProperty method
                Object.defineProperty = _defineProperty;
                // if attempt to write an enhanced descriptor... let go
                if (Reflect.getOwnMetadata('aspectjs.enhancedMethodDescriptor', attributes)) {
                    return Object.defineProperty(o, p, attributes);
                }
                else {
                    // prevent writing back old descriptor
                    return newDescriptor;
                }
            }
            return _defineProperty(o, p, attributes);
        };
        return newDescriptor;
    }
}

export { _ParameterWeavingStrategy };
//# sourceMappingURL=parameter-weaving-strategy.js.map
