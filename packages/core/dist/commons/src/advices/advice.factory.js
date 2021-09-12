import { AdviceType } from './types';
import { PointcutPhase } from '../types';
import { AdviceError, WeavingError } from '../weaver/errors';
import { assert, getProto, isFunction } from '@aspectjs/core/utils';
import { _getWeaverContext } from '../weaver';
/**
 * @internal
 */
export class _AdviceFactory {
    static create(pointcut, target) {
        var _a;
        assert(!(pointcut.type === AdviceType.PROPERTY) ||
            pointcut.ref.startsWith('property#get') ||
            pointcut.ref.startsWith('property#set'));
        const [aspect, propertyKey] = [target.proto, target.propertyKey];
        assert(isFunction(aspect[propertyKey]));
        let advice;
        if (pointcut.phase === PointcutPhase.COMPILE) {
            // prevent @Compile advices to be called twice
            advice = function (...args) {
                const a = advice;
                advice = (() => {
                    throw new WeavingError(`${a} already applied`);
                });
                return aspect[propertyKey].apply(this, args);
            };
        }
        else {
            advice = function (...args) {
                return aspect[propertyKey].apply(this, args);
            };
        }
        advice.pointcut = pointcut;
        advice.aspect = aspect;
        Reflect.defineProperty(advice, Symbol.toPrimitive, {
            value: () => `@${pointcut.phase}(${pointcut.annotation}) ${aspect.constructor.name}.${String(propertyKey)}()`,
        });
        Reflect.defineProperty(advice, 'name', {
            value: propertyKey,
        });
        if (pointcut.phase === PointcutPhase.COMPILE) {
            if (pointcut.ref.startsWith('property#set')) {
                // @Compile(on.property.setter) are forbidden
                // because PropertyDescriptor can only be setup for both setter & getter at once.
                throw new AdviceError(advice, `Advice cannot be applied on property setter`);
            }
        }
        // assert the weaver is loaded before invoking the underlying decorator
        const weaverContext = _getWeaverContext();
        if (!weaverContext) {
            throw new Error(`Cannot create aspect ${(_a = getProto(aspect).constructor.name) !== null && _a !== void 0 ? _a : ''} before "setWeaverContext()" has been called`);
        }
        return advice;
    }
}
//# sourceMappingURL=advice.factory.js.map