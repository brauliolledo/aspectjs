import { AdviceType, AfterAdvice, AfterReturnAdvice, AfterThrowAdvice, AnnotationType, AroundAdvice, JoinPoint, MutableAdviceContext } from '@aspectjs/core/commons';
import { _GenericWeavingStrategy } from './generic-weaving-strategy';
import { _PropertyGetWeavingStrategy } from './property-get-weaving-strategy';
/**
 * @internal
 */
export declare class _PropertySetWeavingStrategy<T> extends _GenericWeavingStrategy<T, AdviceType.PROPERTY> {
    private getterHooks;
    private compiledDescriptor;
    constructor(getterHooks: _PropertyGetWeavingStrategy<T>);
    compile(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>): AdviceType.PROPERTY extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
    initialJoinpoint(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, refDescriptor: PropertyDescriptor): void;
    around(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, advices: AroundAdvice<T, AdviceType.PROPERTY>[], jp: JoinPoint<T>): JoinPoint<T>;
    afterReturn(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, advices: AfterReturnAdvice<T, AdviceType.PROPERTY>[]): any;
    afterThrow(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, advices: AfterThrowAdvice<T, AdviceType.PROPERTY>[]): any;
    after(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, advices: AfterAdvice<T, AdviceType.PROPERTY>[]): void;
    finalize(ctxt: MutableAdviceContext<T, AnnotationType.PROPERTY>, joinpoint: (...args: any[]) => T): AnnotationType.PROPERTY extends AnnotationType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
}
//# sourceMappingURL=property-set-weaving-strategy.d.ts.map