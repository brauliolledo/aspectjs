import { AdviceType, CompileAdvice, JoinPoint, MutableAdviceContext } from '@aspectjs/core/commons';
import { _GenericWeavingStrategy } from './generic-weaving-strategy';
declare type MethodPropertyDescriptor = PropertyDescriptor & {
    value: (...args: any[]) => any;
};
/**
 * @internal
 */
export declare class _MethodWeavingStrategy<T> extends _GenericWeavingStrategy<T, AdviceType.METHOD> {
    compile(ctxt: MutableAdviceContext<T, AdviceType.METHOD>, advices: CompileAdvice<T, AdviceType.METHOD>[]): MethodPropertyDescriptor;
    initialJoinpoint(ctxt: MutableAdviceContext<T, AdviceType.METHOD>, refDescriptor: PropertyDescriptor): void;
    finalize(ctxt: MutableAdviceContext<T, AdviceType.METHOD>, jp: JoinPoint): PropertyDescriptor;
}
export {};
//# sourceMappingURL=method-weaving-strategy.d.ts.map