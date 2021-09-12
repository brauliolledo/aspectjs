import { AnnotationType, CompileAdvice, MutableAdviceContext } from '@aspectjs/core/commons';
import { _MethodWeavingStrategy } from './method-weaving-strategy';
export declare class _ParameterWeavingStrategy<T> extends _MethodWeavingStrategy<T> {
    constructor();
    compile(ctxt: MutableAdviceContext<T, AnnotationType.METHOD>, advices: CompileAdvice<T, AnnotationType.METHOD>[]): PropertyDescriptor & {
        value: (...args: any[]) => any;
    };
    finalize(ctxt: MutableAdviceContext<T, AnnotationType.METHOD>, jp: (args?: any[]) => T): PropertyDescriptor;
}
//# sourceMappingURL=parameter-weaving-strategy.d.ts.map