import { AdviceType, AfterReturnAdvice, AfterThrowAdvice, AroundAdvice, AroundContext, CompileAdvice, JoinPoint, MutableAdviceContext } from '@aspectjs/core/commons';
import { Mutable } from '@aspectjs/core/utils';
import { _GenericWeavingStrategy } from './generic-weaving-strategy';
/**
 * @internal
 */
export declare class _ClassWeavingStrategy<T> extends _GenericWeavingStrategy<T, AdviceType.CLASS> {
    private originalInstance;
    compile(ctxt: MutableAdviceContext<T, AdviceType.CLASS>, advices: CompileAdvice<T, AdviceType.CLASS>[]): AdviceType.CLASS extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
    preAround(ctxt: MutableAdviceContext<T, AdviceType.CLASS>): void;
    around(ctxt: Mutable<AroundContext<T, AdviceType.CLASS>>, advices: AroundAdvice<T, AdviceType.CLASS>[], joinpoint: JoinPoint<T>): (args?: any[]) => any;
    initialJoinpoint(ctxt: MutableAdviceContext<T, AdviceType.CLASS>, originalCtor: {
        new (...args: any[]): T;
    }): void;
    afterReturn<T>(ctxt: MutableAdviceContext<T, AdviceType.CLASS>, advices: AfterReturnAdvice<T, AdviceType.CLASS>[]): T;
    preAfterThrow(ctxt: MutableAdviceContext<T, AdviceType.CLASS>): void;
    afterThrow(ctxt: MutableAdviceContext<T, AdviceType.CLASS>, advices: AfterThrowAdvice<T, AdviceType.CLASS>[]): T;
    finalize(ctxt: MutableAdviceContext<T, AdviceType.CLASS>, joinpoint: (...args: any[]) => T): new (...args: any[]) => T;
}
//# sourceMappingURL=class-weaving-strategy.d.ts.map