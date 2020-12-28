import {
    AdviceType,
    CompileAdvice,
    BeforeAdvice,
    AfterReturnAdvice,
    AfterThrowAdvice,
    AfterAdvice,
    AroundAdvice,
    JoinPoint,
} from '@aspectjs/core';
import { MutableAdviceContext } from '../mutable-advice.context.type';

/**
 * @internal
 */
export type _CompiledSymbol<T, A extends AdviceType> = A extends AdviceType.CLASS
    ? { new (...args: any[]): T }
    : PropertyDescriptor;

/**
 * @internal
 */
export interface _WeavingStrategy<T, A extends AdviceType> {
    preCompile?(ctxt: MutableAdviceContext<T, A>, advices: CompileAdvice<T, A>[]): void;
    compile(ctxt: MutableAdviceContext<T, A>, advices: CompileAdvice<T, A>[]): _CompiledSymbol<T, A>;

    preBefore?(ctxt: MutableAdviceContext<T, A>): void;
    before(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        beforeAdvices: BeforeAdvice<T, A>[],
    ): void;

    initialJoinpoint(ctxt: MutableAdviceContext<T, A>, originalSymbol: _CompiledSymbol<T, A>): void;

    preAfterReturn?(ctxt: MutableAdviceContext<T, A>): void;
    afterReturn(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        afterReturnAdvices: AfterReturnAdvice<T, A>[],
    ): T;

    preAfterThrow?(ctxt: MutableAdviceContext<T, A>): void;
    afterThrow(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        afterThrowAdvices: AfterThrowAdvice<T, A>[],
    ): T;

    preAfter?(ctxt: MutableAdviceContext<T, A>): void;
    after(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        afterAdvices: AfterAdvice<T, A>[],
    ): void;

    preAround?(ctxt: MutableAdviceContext<T, A>): void;
    around(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        aroundAdvices: AroundAdvice<T, A>[],
        jp: (args?: any[]) => T,
    ): JoinPoint<T>;
    finalize(
        ctxt: MutableAdviceContext<T, A>,
        joinpoint: (...args: any[]) => T,
    ): A extends AdviceType.CLASS ? { new (...args: any[]): T } : PropertyDescriptor;
}
