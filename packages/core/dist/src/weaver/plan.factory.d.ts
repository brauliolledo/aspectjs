import { Advice, AdviceTarget, AdviceType, MutableAdviceContext } from '@aspectjs/core/commons';
import { _WeavingStrategy } from './weaving-strategy';
/**
 * @internal
 */
export declare class _AdviceExecutionPlanFactory {
    create<T, A extends AdviceType = any>(target: AdviceTarget<T, A>, hooks: _WeavingStrategy<T, A>, filter?: {
        name: string;
        fn: (a: Advice) => boolean;
    }): _ExecutionPlan<T, A>;
}
declare type WeaverCompile<T = unknown, A extends AdviceType = any> = (ctxt: MutableAdviceContext<T, A>) => A extends AdviceType.CLASS ? {
    new (...args: any[]): T;
} : PropertyDescriptor;
declare type WeaverLink<T = unknown, A extends AdviceType = any> = (ctxt: MutableAdviceContext<T, A>, initialSymbol: A extends AdviceType.CLASS ? {
    new (...args: any[]): T;
} : PropertyDescriptor) => A extends AdviceType.CLASS ? {
    new (...args: any[]): T;
} : PropertyDescriptor;
/**
 * Sort the advices according to their precedence & store by phase & type, so they are ready to execute.
 * @internal
 */
export declare class _ExecutionPlan<T = unknown, A extends AdviceType = any> {
    private compileFn;
    private linkFn;
    constructor(compileFn: WeaverCompile<T, A>, linkFn: WeaverLink<T, A>);
    compile<C extends MutableAdviceContext<T, A>>(ctxt: C): {
        link: () => A extends AdviceType.CLASS ? {
            new (...args: any[]): T;
        } : PropertyDescriptor;
    };
}
export {};
//# sourceMappingURL=plan.factory.d.ts.map