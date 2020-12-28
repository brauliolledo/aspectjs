import { assert, isFunction } from '@aspectjs/common/utils';
import { AdviceTarget } from '@aspectjs/reflect';
import { Advice } from '../advices/types';
import { AdviceError } from './advice-error';
import { AdviceType } from './advice.type';
import { Pointcut, PointcutPhase } from './pointcut';

/**
 * @internal
 */
export class _AdviceFactory {
    static create(pointcut: Pointcut, target: AdviceTarget): Advice {
        assert(
            pointcut.type !== AdviceType.PROPERTY ||
                pointcut.ref.startsWith('property#get') ||
                pointcut.ref.startsWith('property#set'),
        );
        const [aspect, propertyKey] = [target.proto, target.propertyKey];

        assert(isFunction(aspect[propertyKey]));
        let advice: Advice;

        advice = function (...args: any[]) {
            return aspect[propertyKey].apply(this, args);
        } as Advice;

        advice.pointcut = pointcut;
        advice.aspect = aspect;

        Reflect.defineProperty(advice, Symbol.toPrimitive, {
            value: () =>
                `@${PointcutPhase.toString(pointcut.phase)}(${pointcut.annotation}) ${aspect.constructor.name}.${String(
                    propertyKey,
                )}()`,
        });

        Reflect.defineProperty(advice, 'name', {
            value: propertyKey,
        });

        if (pointcut.phase === PointcutPhase.COMPILE) {
            if (pointcut.ref.startsWith('property#set')) {
                // @Compile(on.property.setter) are forbidden
                // because PropertyDescriptor can only be setup for both setter & getter at once.
                throw new AdviceError(
                    {
                        advice,
                        target,
                    },
                    `Advice cannot be applied on property setter`,
                );
            }
        }

        return advice;
    }
}
