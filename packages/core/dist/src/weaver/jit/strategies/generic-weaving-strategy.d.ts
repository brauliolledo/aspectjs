import { Advice, AdviceType, AfterAdvice, AfterReturnAdvice, AfterThrowAdvice, AnnotationType, AroundAdvice, BeforeAdvice, CompileAdvice, JoinPoint, MutableAdviceContext } from '@aspectjs/core/commons';
import { _WeavingStrategy } from '../../weaving-strategy';
/**
 * @internal
 */
export declare abstract class _GenericWeavingStrategy<T, A extends AdviceType> implements _WeavingStrategy<T, A> {
    after(ctxt: MutableAdviceContext<T, A>, advices: AfterAdvice<T, A>[]): void;
    afterReturn(ctxt: MutableAdviceContext<T, A>, advices: AfterReturnAdvice<T, A>[]): T;
    afterThrow(ctxt: MutableAdviceContext<T, A>, advices: AfterThrowAdvice<T, A>[], allowReturn?: boolean): any;
    around(ctxt: MutableAdviceContext<T, A>, advices: AroundAdvice<T, A>[], jp: JoinPoint<T>, allowReturn?: boolean): JoinPoint<T>;
    before(ctxt: MutableAdviceContext<T, A>, advices: BeforeAdvice<T, A>[]): void;
    abstract compile(ctxt: MutableAdviceContext<T, A>, advices: CompileAdvice<T, AdviceType>[]): A extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
    abstract initialJoinpoint(ctxt: MutableAdviceContext<T, A>, originalSymbol: A extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor): void;
    abstract finalize(ctxt: MutableAdviceContext<T, A>, joinpoint: (...args: any[]) => T): A extends AnnotationType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
    protected _applyNonReturningAdvices(ctxt: MutableAdviceContext<any>, advices: Advice[]): void;
}
//# sourceMappingURL=generic-weaving-strategy.d.ts.map