import { AnnotationType } from '@aspectjs/common';
import { assert, isFunction } from '@aspectjs/common/utils';
import { AdviceType, AroundAdvice, JoinPoint, AfterReturnAdvice, AfterThrowAdvice, AfterAdvice } from '@aspectjs/core';
import { _JoinpointFactory } from '@aspectjs/weaver';
import { MutableAdviceContext } from '../../../src/mutable-advice.context.type';
import { _CompiledSymbol } from '../../../src/weaver/weaving-strategy';
import { _GenericWeavingStrategy } from './generic-weaving-strategy';
import { _PropertyGetWeavingStrategy } from './property-get-weaving-strategy';

/**
 * @internal
 */
export class _PropertySetWeavingStrategy<T> extends _GenericWeavingStrategy<T, AdviceType.PROPERTY> {
    private compiledDescriptor: PropertyDescriptor;

    constructor(private getterHooks: _PropertyGetWeavingStrategy<T>) {
        super();
    }

    compile(
        ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>,
    ): AdviceType.PROPERTY extends AdviceType.CLASS ? { new (...args: any[]): T } : PropertyDescriptor {
        return (this.compiledDescriptor = this.getterHooks.compile(ctxt, null));
    }

    initialJoinpoint(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, refDescriptor: PropertyDescriptor): void {
        assert(isFunction(refDescriptor?.set));
        ctxt.value = _JoinpointFactory.create(null, ctxt, refDescriptor.set)(ctxt.args);
    }

    around(
        ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>,
        compiledSymbol: _CompiledSymbol<T, AdviceType.PROPERTY>,
        advices: AroundAdvice<T, AdviceType.PROPERTY>[],
        jp: JoinPoint<T>,
    ): JoinPoint<T> {
        return super.around(ctxt, compiledSymbol, advices, jp, false);
    }

    afterReturn(
        ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>,
        compiledSymbol: _CompiledSymbol<T, AdviceType.PROPERTY>,
        advices: AfterReturnAdvice<T, AdviceType.PROPERTY>[],
    ): any {
        return this._applyNonReturningAdvices(ctxt, compiledSymbol, advices);
    }

    afterThrow(
        ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>,
        compiledSymbol: _CompiledSymbol<T, AdviceType.PROPERTY>,
        advices: AfterThrowAdvice<T, AdviceType.PROPERTY>[],
    ): any {
        super.afterThrow(ctxt, compiledSymbol, advices, false);
    }

    after(
        ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>,
        compiledSymbol: _CompiledSymbol<T, AdviceType.PROPERTY>,
        advices: AfterAdvice<T, AdviceType.PROPERTY>[],
    ): void {
        this._applyNonReturningAdvices(ctxt, compiledSymbol, advices);
    }

    finalize(
        ctxt: MutableAdviceContext<T, AnnotationType.PROPERTY>,
        joinpoint: (...args: any[]) => T,
    ): AnnotationType.PROPERTY extends AnnotationType.CLASS ? { new (...args: any[]): T } : PropertyDescriptor {
        const newDescriptor = {
            ...this.compiledDescriptor,
            set: joinpoint,
        };

        // test property validity
        Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');

        return newDescriptor;
    }
}
