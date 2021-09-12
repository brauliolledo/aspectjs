import { AdviceType, AnnotationType, CompileAdvice, MutableAdviceContext } from '@aspectjs/core/commons';
import { _GenericWeavingStrategy } from './generic-weaving-strategy';
/**
 * @internal
 */
export declare class _PropertyGetWeavingStrategy<T> extends _GenericWeavingStrategy<T, AdviceType.PROPERTY> {
    private compiledDescriptor;
    compile(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, advices: CompileAdvice<T, AdviceType.PROPERTY>[]): AdviceType.PROPERTY extends AdviceType.METHOD ? () => T : AdviceType.PROPERTY extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
    preBefore(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>): void;
    initialJoinpoint(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>, originalDescriptor: PropertyDescriptor): void;
    finalize(ctxt: MutableAdviceContext<T, AnnotationType.PROPERTY>, joinpoint: (...args: any[]) => T): AnnotationType.PROPERTY extends AnnotationType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
}
//# sourceMappingURL=property-get-weaving-strategy.d.ts.map