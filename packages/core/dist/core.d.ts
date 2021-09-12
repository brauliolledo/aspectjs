import { Advice } from '@aspectjs/core/commons';
import { AdviceTarget } from '@aspectjs/core/commons';
import { AdviceType } from '@aspectjs/core/commons';
import { AfterAdvice } from '@aspectjs/core/commons';
import { AfterReturnAdvice } from '@aspectjs/core/commons';
import { AfterThrowAdvice } from '@aspectjs/core/commons';
import { AnnotationLocationFactory } from '@aspectjs/core/commons';
import { AnnotationRegistry } from '@aspectjs/core/commons';
import { AnnotationTarget } from '@aspectjs/core/commons';
import { AnnotationTargetFactory } from '@aspectjs/core/commons';
import { AroundAdvice } from '@aspectjs/core/commons';
import { AspectsRegistry } from '@aspectjs/core/commons';
import { AspectType } from '@aspectjs/core/commons';
import { BeforeAdvice } from '@aspectjs/core/commons';
import { CompileAdvice } from '@aspectjs/core/commons';
import { JoinPoint } from '@aspectjs/core/commons';
import { MutableAdviceContext } from '@aspectjs/core/commons';
import { RootAnnotationsBundle } from '@aspectjs/core/commons';
import { Weaver } from '@aspectjs/core/commons';
import { WeaverContext } from '@aspectjs/core/commons';
import { WeaverProfile } from '@aspectjs/core/commons';

/**
 * @internal
 */
export declare class _AdviceExecutionPlanFactory {
    create<T, A extends AdviceType = any>(target: AdviceTarget<T, A>, hooks: _WeavingStrategy<T, A>, filter?: {
        name: string;
        fn: (a: Advice) => boolean;
    }): _ExecutionPlan<T, A>;
}

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

/**
 * The JitWeaver wires up advices to the corresponding annotations as soon as the annotation gets processed by JS interpreter.
 * @public
 */
export declare class JitWeaver extends WeaverProfile implements Weaver {
    private _context;
    private _prod;
    private _planFactory;
    private _enhancers;
    /**
     *
     * @param _context - the weaver context to attach this weaver to.
     * @param _prod - When prod mode is activated, enabling an aspect after Annotation compilation is prohibed.
     */
    constructor(_context: WeaverContext, _prod?: boolean);
    enable(...aspects: (AspectType | WeaverProfile)[]): this;
    disable(...aspects: (AspectType | WeaverProfile)[]): this;
    reset(): this;
    enhance<T>(target: AnnotationTarget<T>): void | Function | PropertyDescriptor;
    private _enhanceClass;
    private _enhanceProperty;
    private _enhanceMethod;
    private _enhanceParameter;
}

/**
 * @public
 */
export declare const WEAVER_CONTEXT: {
    readonly aspects: {
        registry: AspectsRegistry;
    };
    readonly annotations: {
        location: AnnotationLocationFactory;
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
        bundle: RootAnnotationsBundle;
    };
    getWeaver(): Weaver;
};

declare type WeaverCompile<T = unknown, A extends AdviceType = any> = (ctxt: MutableAdviceContext<T, A>) => A extends AdviceType.CLASS ? {
    new (...args: any[]): T;
} : PropertyDescriptor;

/**
 * @public
 */
export declare class WeaverContextImpl implements WeaverContext {
    readonly weaver: Weaver;
    private readonly _targetFactory;
    readonly aspects: {
        registry: AspectsRegistry;
    };
    readonly annotations: {
        location: AnnotationLocationFactory;
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
        bundle: RootAnnotationsBundle;
    };
    constructor();
    protected _createWeaver(): Weaver;
    /**
     * Get the global weaver
     */
    getWeaver(): Weaver;
}

declare type WeaverLink<T = unknown, A extends AdviceType = any> = (ctxt: MutableAdviceContext<T, A>, initialSymbol: A extends AdviceType.CLASS ? {
    new (...args: any[]): T;
} : PropertyDescriptor) => A extends AdviceType.CLASS ? {
    new (...args: any[]): T;
} : PropertyDescriptor;

/**
 * @internal
 */
declare interface _WeavingStrategy<T, A extends AdviceType> {
    compile(ctxt: MutableAdviceContext<T, A>, advice: CompileAdvice<T, A>[]): A extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
    preBefore?(ctxt: MutableAdviceContext<T, A>): void;
    before(ctxt: MutableAdviceContext<T, A>, beforeAdvices: BeforeAdvice<T, A>[]): void;
    initialJoinpoint(ctxt: MutableAdviceContext<T, A>, originalSymbol: A extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor): void;
    preAfterReturn?(ctxt: MutableAdviceContext<T, A>): void;
    afterReturn(ctxt: MutableAdviceContext<T, A>, afterReturnAdvices: AfterReturnAdvice<T, A>[]): T;
    preAfterThrow?(ctxt: MutableAdviceContext<T, A>): void;
    afterThrow(ctxt: MutableAdviceContext<T, A>, afterThrowAdvices: AfterThrowAdvice<T, A>[]): T;
    preAfter?(ctxt: MutableAdviceContext<T, A>): void;
    after(ctxt: MutableAdviceContext<T, A>, afterAdvices: AfterAdvice<T, A>[]): void;
    preAround?(ctxt: MutableAdviceContext<T, A>): void;
    around(ctxt: MutableAdviceContext<T, A>, aroundAdvices: AroundAdvice<T, A>[], jp: (args?: any[]) => T): JoinPoint<T>;
    finalize(ctxt: MutableAdviceContext<T, A>, joinpoint: (...args: any[]) => T): A extends AdviceType.CLASS ? {
        new (...args: any[]): T;
    } : PropertyDescriptor;
}

export { }
