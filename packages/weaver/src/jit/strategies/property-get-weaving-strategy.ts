import { AnnotationType } from '@aspectjs/common';
import { assert, getOrComputeMetadata, isFunction, isUndefined, Mutable } from '@aspectjs/common/utils';
import { AdviceType, CompileAdvice, AdviceError } from '@aspectjs/core';
import { AdviceTarget } from '@aspectjs/reflect';
import { _JoinpointFactory } from '@aspectjs/weaver';
import { MutableAdviceContext } from '../../mutable-advice.context.type';
import { _GenericWeavingStrategy } from './generic-weaving-strategy';

/**
 * @internal
 */
export class _PropertyGetWeavingStrategy<T> extends _GenericWeavingStrategy<T, AdviceType.PROPERTY> {
    private compiledDescriptor: PropertyDescriptor;

    compile(
        ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>,
        advices: CompileAdvice<T, AdviceType.PROPERTY>[],
    ): AdviceType.PROPERTY extends AdviceType.METHOD
        ? () => T
        : AdviceType.PROPERTY extends AdviceType.CLASS
        ? { new (...args: any[]): T }
        : PropertyDescriptor {
        const target = ctxt.target;
        if (this.compiledDescriptor) {
            return this.compiledDescriptor;
        }

        // if another @Compile advice has been applied
        // replace wrapped descriptor by original descriptor before it gets wrapped again
        (target as Mutable<AdviceTarget>).descriptor = getOrComputeMetadata(
            'aspectjs.originalDescriptor',
            target.proto,
            target.propertyKey,
            () => {
                return (
                    Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey) ?? {
                        configurable: true,
                        enumerable: true,
                        get() {
                            return Reflect.getOwnMetadata(`aspectjs.propValue`, this, target.propertyKey);
                        },
                        set(value: any) {
                            Reflect.defineMetadata(`aspectjs.propValue`, value, this, target.propertyKey);
                        },
                    }
                );
            },
            true,
        );

        let newDescriptor: PropertyDescriptor = ctxt.target.descriptor;

        advices.forEach((a) => {
            ctxt.advice = a;
            newDescriptor = a(ctxt) ?? newDescriptor;
        });
        delete ctxt.advice;

        if (newDescriptor) {
            if (Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)?.configurable === false) {
                throw new AdviceError(ctxt, `${target.label} is not configurable`);
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
            newDescriptor = Object.getOwnPropertyDescriptor(
                Object.defineProperty(surrogate, 'newProp', newDescriptor),
                'newProp',
            );

            Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
        }

        if ((newDescriptor as Record<string, any>).hasOwnProperty('value')) {
            const propValue = newDescriptor.value;
            newDescriptor.get = () => propValue;
            delete newDescriptor.writable;
            delete newDescriptor.value;
        }

        return (this.compiledDescriptor = newDescriptor);
    }

    preBefore(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>): void {
        ctxt.args = [];
    }

    initialJoinpoint(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, originalDescriptor: PropertyDescriptor): any {
        assert(isFunction(originalDescriptor.get));
        return (ctxt.value = _JoinpointFactory.create(null, ctxt, originalDescriptor.get)());
    }

    finalize(
        ctxt: MutableAdviceContext<T, AnnotationType.PROPERTY>,
        joinpoint: (...args: any[]) => T,
    ): AnnotationType.PROPERTY extends AnnotationType.CLASS ? { new (...args: any[]): T } : PropertyDescriptor {
        const newDescriptor = {
            ...this.compiledDescriptor,
            get: joinpoint,
        };

        // test property validity
        Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');

        return newDescriptor;
    }
}
