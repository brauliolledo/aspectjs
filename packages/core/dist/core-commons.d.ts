import { Advice as Advice_2 } from '@aspectjs/core/commons';
import { AdviceTarget as AdviceTarget_2 } from '@aspectjs/core/commons';
import { AnnotationsBundle as AnnotationsBundle_2 } from '@aspectjs/core/commons';
import { Mutable } from '@aspectjs/core/utils';

/**
 * @public
 */
export declare type Advice<T = unknown, A extends AnnotationType = any, V extends PointcutPhase = any> = V extends PointcutPhase.COMPILE ? CompileAdvice<T, A> : V extends PointcutPhase.BEFORE ? BeforeAdvice<T, A> : V extends PointcutPhase.AROUND ? AroundAdvice<T, A> : V extends PointcutPhase.AFTERRETURN ? AfterReturnAdvice<T, A> : V extends PointcutPhase.AFTERTHROW ? AfterThrowAdvice<T, A> : V extends PointcutPhase.AFTER ? AfterAdvice<T, A> : never;

/**
 * @public
 */
export declare type AdviceContext<T = unknown, A extends AnnotationType = any> = AfterContext<T, A> | BeforeContext<T, A> | AfterReturnContext<T, A> | AfterThrowContext<T, A> | AroundContext<T, A> | CompileContext<T, A>;

/**
 * Error thrown when an advice has an unexpected behavior (eg: returns a value that is not permitted)
 * @public
 */
export declare class AdviceError extends WeavingError {
    constructor(advice: Advice, message: string);
}

/**
 * @internal
 */
export declare class _AdviceFactory {
    static create(pointcut: Pointcut, target: AdviceTarget): Advice;
}

/**
 * Allows AspectsRegistry.getAdvicesByTarget() to return (& cache results) for filtered advices.
 * @public
 */
export declare interface AdvicesFilter {
    name: string;
    fn: (a: Advice) => boolean;
}

/**
 * Stores the aspects along with their advices.
 * @public
 */
export declare interface AdvicesRegistry {
    byPointcut: {
        [phase in PointcutPhase]?: {
            [type in AnnotationType]?: {
                byAnnotation: {
                    [annotationRef: string]: Advice<unknown, type, phase>[];
                };
            };
        };
    };
    byTarget: {
        [targetRef: string]: {
            [phase in PointcutPhase]?: Advice<unknown, AnnotationType, phase>[];
        };
    };
    byAspect: {
        [targetRef: string]: {
            [adviceName: string]: Advice<unknown, AnnotationType, PointcutPhase>;
        };
    };
}

/**
 * @public
 */
export declare type AdviceTarget<T = unknown, A extends AnnotationType = any> = AnnotationTarget<T, A>;

/**
 * @public
 */
export declare type AfterAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: AfterPointcut<A>;
} & ((ctxt: AdviceContext<T, A>) => void);

/**
 * @public
 */
export declare interface AfterContext<T = unknown, A extends AnnotationType = any> {
    /** The applied advice **/
    readonly advice: Advice_2<T, A>;
    /** The annotations contexts **/
    readonly annotations: AnnotationsBundle_2<T>;
    /** The 'this' instance bound to the current execution context **/
    readonly instance: T;
    /** the arguments originally passed to the joinpoint **/
    readonly args: any[];
    /** The symbol targeted by this advice (class, method, property or parameter **/
    readonly target: AdviceTarget<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    readonly data: Record<string, any>;
}

/**
 * @public
 */
export declare interface AfterPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTER;
}

/**
 * @public
 */
export declare type AfterReturnAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: AfterReturnPointcut<A>;
} & ((ctxt: AdviceContext<T, A>, returnValue: any) => T | null | undefined);

/**
 * @public
 */
export declare interface AfterReturnContext<T = unknown, A extends AnnotationType = any> {
    /** The applied advice **/
    readonly advice: Advice_2<T, A>;
    /** The annotation contexts **/
    readonly annotations: AnnotationsBundle_2<T>;
    /** The 'this' instance bound to the current execution context **/
    readonly instance: T;
    /** the arguments originally passed to the joinpoint **/
    readonly args: any[];
    /** The value originally returned by the joinpoint **/
    readonly value: any;
    /** The symbol targeted by this advice (class, method, property or parameter **/
    readonly target: AdviceTarget_2<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    readonly data: Record<string, any>;
}

/**
 * @public
 */
export declare interface AfterReturnPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTERRETURN;
}

/**
 * @public
 */
export declare type AfterThrowAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: AfterThrowPointcut<A>;
} & ((ctxt: AdviceContext<T, A>, thrownError: Error) => T | null | undefined);

/**
 * @public
 */
export declare interface AfterThrowContext<T = unknown, A extends AnnotationType = any> {
    /** The applied advice **/
    readonly advice: Advice_2<T, A>;
    /** The annotation contexts **/
    readonly annotations: AnnotationsBundle_2<T>;
    /** The 'this' instance bound to the current execution context **/
    readonly instance: T;
    /** the arguments originally passed to the joinpoint **/
    readonly args: any[];
    /** The error originally thrown by the joinpoint **/
    readonly error: Error;
    /** The value originally returned by the joinpoint **/
    readonly value: any;
    /** The symbol targeted by this advice (class, method, property or parameter **/
    readonly target: AdviceTarget_2<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    readonly data: Record<string, any>;
}

/**
 * @public
 */
export declare interface AfterThrowPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTERTHROW;
}

/**
 * An Annotation is an EcmaScript decorator with no behavior.
 * It relies on an aspect weaver configured with proper aspects to get things done.
 * @public
 */
export declare type Annotation<T extends AnnotationType = any> = (T extends AnnotationType.CLASS ? ClassAnnotation : T extends AnnotationType.METHOD ? MethodAnnotation : T extends AnnotationType.PARAMETER ? ParameterAnnotation : T extends AnnotationType.PROPERTY ? PropertyAnnotation : never) & // eslint-disable-next-line @typescript-eslint/ban-types
Function & AnnotationRef;

/**
 * @public
 */
export declare type AnnotationBundleRegistry<T = unknown, A extends AnnotationType = any> = {
    byTargetClassRef: {
        [classTargetRef: string]: {
            byAnnotation: {
                [annotationRef: string]: AnnotationContext[];
            };
            all: AnnotationContext[];
        };
    };
    byAnnotation: {
        [annotationRef: string]: AnnotationContext[];
    };
};

/**
 * @public
 */
export declare abstract class AnnotationContext<T = unknown, A extends AnnotationType = any> extends AnnotationRef {
    readonly args: any[];
    readonly target: AdviceTarget<T, A>;
}

/**
 * Factory to create some {@link Annotation}.
 * @public
 */
export declare class AnnotationFactory {
    private readonly _groupId;
    constructor(groupId: string);
    /**
     * Create a ClassAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends ClassAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a MethodAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends MethodAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a PropertyAnnotationStub.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends PropertyAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a ParameterAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    /**
     * Create a ParameterAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends ParameterAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a ClassAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends ClassAnnotationStub>(annotationStub?: A): A & AnnotationRef;
    /**
     * Create a MethodAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends MethodAnnotationStub>(annotationStub?: A): A & AnnotationRef;
    /**
     * Create a PropertyAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends PropertyAnnotationStub>(annotationStub?: A): A & AnnotationRef;
    /**
     * Create a ParameterAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends ParameterAnnotationStub>(annotationStub?: A): A & AnnotationRef;
}

/**
 * @public
 */
export declare type AnnotationLocation<T = unknown, A extends AnnotationType = any> = undefined | A extends AnnotationType.CLASS ? ClassAnnotationLocation<T> : A extends AnnotationType.PROPERTY ? PropertyAnnotationLocation : A extends AnnotationType.METHOD ? MethodAnnotationLocation : ParametersAnnotationLocation;

/**
 * @public
 */
export declare class AnnotationLocationFactory {
    private _targetFactory;
    constructor(_targetFactory: AnnotationTargetFactory);
    of<T>(obj: (new () => T) | T): ClassAnnotationLocation<T>;
    static getTarget<T>(location: AnnotationLocation<T>): AnnotationTarget<T>;
}

/**
 * @public
 */
export declare class AnnotationPointcutExpressionBuilder<A extends Annotation> {
    private _label;
    constructor(_label: string);
    withAnnotations(...annotation: Annotation[]): PointcutExpression;
}

/**
 * @public
 */
export declare class AnnotationRef {
    readonly ref: string;
    readonly name: string;
    readonly groupId: string;
    constructor(ref: string);
    constructor(groupId: string, name: string);
    toString(): string;
}

/**
 * @public
 */
export declare class AnnotationRegistry {
    private readonly _bundleRegistry;
    constructor(_bundleRegistry: AnnotationBundleRegistry);
    /**
     * Registers a new annotation by its AnnotationContext,
     * so that it can be picked up wy an annotation weaver, or used through AnnotationBundle
     * @param context - the annotation context to register
     */
    register<A extends AnnotationType, T = unknown>(context: AnnotationContext<T, A>): void;
}

/**
 * @public
 */
export declare type AnnotationsBundle<T = unknown> = ClassAnnotationsBundle<T> | MethodAnnotationsBundle<T> | ParameterAnnotationsBundle<T> | PropertyAnnotationsBundle<T>;

/**
 * @public
 */
export declare type AnnotationStub<T extends Decorator> = (...args: any[]) => T & {
    name: string;
};

/**
 * @public
 */
export declare interface AnnotationTarget<T = unknown, A extends AnnotationType = AnnotationType> {
    readonly location: AnnotationLocation<T, A>;
    readonly type: A;
    readonly proto: Record<string, any> & {
        constructor: new (...args: any[]) => any;
    };
    readonly name: string;
    readonly label: string;
    readonly ref: string;
    readonly propertyKey: A extends AnnotationType.PROPERTY | AnnotationType.METHOD | AnnotationType.PARAMETER ? string : never;
    readonly descriptor: A extends AnnotationType.METHOD ? TypedPropertyDescriptor<T> : never;
    readonly parameterIndex: A extends AnnotationType.PARAMETER ? number : never;
    readonly parent: A extends AnnotationType.METHOD ? AnnotationTarget<any, AnnotationType.CLASS> : A extends AnnotationType.PROPERTY ? AnnotationTarget<any, AnnotationType.CLASS> : A extends AnnotationType.PARAMETER ? AnnotationTarget<any, AnnotationType.METHOD> : ClassAdviceTarget<any>;
    readonly declaringClass: ClassAdviceTarget<T>;
    readonly parentClass: ClassAdviceTarget<T>;
}

/**
 * @public
 */
export declare class AnnotationTargetFactory {
    private readonly _TARGET_GENERATORS;
    private readonly _REF_GENERATORS;
    of<T, A extends AnnotationType>(args: any[]): AdviceTarget<T, A>;
    /**
     * Creates an AnnotationTarget from the given argument
     * @param target - the AnnotationTarget stub.
     * @param type - target type override
     */
    create<T, A extends AnnotationType>(target: MutableAdviceTarget<T, A>, type?: AnnotationType): AdviceTarget<T, A>;
}

/**
 * @public
 */
declare enum AnnotationType {
    CLASS = "AnnotationType.CLASS",
    PROPERTY = "AnnotationType.PROPERTY",
    METHOD = "AnnotationType.METHOD",
    PARAMETER = "AnnotationType.PARAMETER"
}
export { AnnotationType as AdviceType }
export { AnnotationType }

/**
 * @public
 */
export declare type AroundAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: AroundPointcut<A>;
} & ((ctxt: AdviceContext<T, A>, joinPoint: JoinPoint, args: any[]) => any);

/**
 * @public
 */
export declare interface AroundContext<T = unknown, A extends AnnotationType = any> {
    /** The applied advice **/
    readonly advice: Advice_2<T, A>;
    /** The annotation contexts **/
    readonly annotations: AnnotationsBundle_2<T>;
    /** The 'this' instance bound to the current execution context **/
    readonly instance: T;
    /** the arguments originally passed to the joinpoint **/
    readonly args: any[];
    /** Hold the original function, bound to its execution context and it original parameters **/
    readonly joinpoint: JoinPoint;
    /** The symbol targeted by this advice (class, method, property or parameter **/
    readonly target: AdviceTarget<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    readonly data: Record<string, any>;
}

/**
 * @public
 */
export declare interface AroundPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AROUND;
}

/**
 * Thrown by aspects in case some error occurred during the aspect execution.
 * @public
 */
export declare class AspectError extends Error {
    constructor(ctxt: AdviceContext, message?: string);
}

/**
 * The AnnotationFactory used to create annotations of the Aspectjs framework
 * @public
 */
export declare const ASPECTJS_ANNOTATION_FACTORY: AnnotationFactory;

/**
 * Register aspects enabled for the current weaver context.
 * @public
 */
export declare interface AspectsRegistry {
    /**
     * Register a new advice, with the aspect is belongs to.
     * @param aspects - The aspects to register
     */
    register(...aspects: AspectType[]): void;
    remove(...aspects: AspectType[]): void;
    /**
     * Get all advices that belongs to the given aspect
     * @param aspect - the aspect to get advices for.
     */
    getAdvicesByAspect(aspect: AspectType): Advice[];
    getAdvicesByTarget<T, A extends AnnotationType, P extends PointcutPhase>(target: AdviceTarget<T, A>, filter?: AdvicesFilter, ...phases: PointcutPhase[]): AdvicesRegistry['byTarget'][string];
}

export declare type AspectType = object & {
    onEnable?: (weaver: WeaverProfile) => void;
    onDisable?: (weaver: WeaverProfile) => void;
};

/**
 * @public
 */
export declare type BeforeAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: BeforePointcut<A>;
} & ((ctxt: AdviceContext<T, A>) => void);

/**
 * @public
 */
export declare interface BeforeContext<T = unknown, A extends AnnotationType = any> {
    /** The applied advice **/
    readonly advice: Advice_2<T, A>;
    /** The annotation contexts **/
    readonly annotations: AnnotationsBundle_2<T>;
    /** The 'this' instance bound to the current execution context **/
    readonly instance: A extends AnnotationType.CLASS ? never : T;
    /** the arguments originally passed to the joinpoint **/
    readonly args: any[];
    /** The symbol targeted by this advice (class, method, property or parameter **/
    readonly target: AdviceTarget<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    readonly data: Record<string, any>;
}

/**
 * @public
 */
export declare interface BeforePointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.BEFORE;
}

/**
 * @public
 */
export declare interface ClassAdviceTarget<T> extends AdviceTarget<T, AnnotationType.CLASS> {
    readonly location: ClassAnnotationLocation<T>;
    readonly parent: ClassAdviceTarget<any>;
}

/**
 * @public
 */
export declare type ClassAnnotation = AnnotationStub<ClassDecorator> & AnnotationRef;

/**
 * @public
 */
export declare type ClassAnnotationLocation<T = unknown> = {
    [prop in keyof T]: T[prop] extends (...any: any[]) => any ? MethodAnnotationLocation<T, T[prop]> : PropertyAnnotationLocation<T, T[prop]>;
};

/**
 * @public
 */
export declare class ClassAnnotationsBundle<T = unknown> extends RootAnnotationsBundle {
    private searchParents;
    private _target;
    constructor(registry: AnnotationBundleRegistry, location: AnnotationLocation, searchParents: boolean);
    all(...annotations: (Annotation | string | AnnotationRef)[]): readonly AnnotationContext<T>[];
    onClass(...annotations: (Annotation<AnnotationType.CLASS> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.CLASS>[];
    onSelf(...annotations: (Annotation<AnnotationType.CLASS> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.CLASS>[];
    onProperty(...annotations: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PROPERTY>[];
    onMethod(...annotations: (Annotation<AnnotationType.METHOD> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD>[];
    onParameter(...annotations: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    private _allWithFilter;
}

/**
 * @public
 */
export declare type ClassAnnotationStub = AnnotationStub<ClassDecorator>;

/**
 * @public
 */
export declare type CompileAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: CompilePointcut<A>;
} & ((ctxt: AdviceContext<T, A>) => A extends AnnotationType.CLASS ? undefined | Function : PropertyDescriptor);

/**
 * @public
 */
export declare interface CompileContext<T = unknown, A extends AnnotationType = any> {
    /** The applied advice **/
    readonly advice: Advice_2<T, A>;
    /** The annotation contexts **/
    readonly annotations: AnnotationsBundle_2<T>;
    /** The symbol targeted by this advice (class, method, property or parameter **/
    readonly target: AdviceTarget<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    readonly data: Record<string, any>;
}

/**
 * @public
 */
export declare interface CompilePointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.COMPILE;
}

/**
 * @public
 */
export declare type Decorator<TFunction extends Function = any, T = any> = (target: TFunction | Object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<T> | number) => TFunction | void | TypedPropertyDescriptor<T>;

/**
 * @internal
 */
export declare function _getWeaverContext(): WeaverContext;

/**
 * Hold the original function,
 * bound to its execution context and it original parameters.
 * - Call this method without parameters to call the original function with its original parameters.
 * - Call this method with an array of new parameters to call the original function with the given parameters.
 * - Call this method with an empty array to call the original function with the given parameters.
 *
 * In any way, calling a joinpoint twice will throw a WeavingError
 * @public
 * **/
export declare type JoinPoint<T = unknown> = (args?: any[]) => T;

/**
 * @internal
 */
export declare class _JoinpointFactory {
    static create<T>(advice: AroundAdvice<T>, ctxt: Mutable<AroundContext<T>>, fn: (...args: any[]) => any): JoinPoint<T>;
}

/**
 * @public
 */
export declare interface MethodAdviceTarget<T> extends AdviceTarget<T, AnnotationType.METHOD> {
    readonly descriptor: TypedPropertyDescriptor<T>;
    readonly location: MethodAnnotationLocation<T>;
    readonly parent: ClassAdviceTarget<T>;
}

/**
 * @public
 */
export declare type MethodAnnotation = AnnotationStub<MethodDecorator> & AnnotationRef;

/**
 * @public
 */
export declare type MethodAnnotationLocation<T = unknown, P = unknown> = {
    args: ParametersAnnotationLocation<T>;
};

/**
 * @public
 */
export declare interface MethodAnnotationsBundle<T = unknown> {
    all(...annotation: (Annotation<AnnotationType.METHOD | AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD | AnnotationType.PARAMETER>[];
    onParameter(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    onMethod(...annotation: (Annotation<AnnotationType.METHOD> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD | AnnotationType.PARAMETER>[];
    onSelf(...annotation: (Annotation<AnnotationType.METHOD> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD | AnnotationType.PARAMETER>[];
}

/**
 * @public
 */
export declare type MethodAnnotationStub = AnnotationStub<MethodDecorator>;

/**
 * @public
 */
export declare interface MutableAdviceContext<T = unknown, A extends AnnotationType = any> {
    advice: Advice<T, A>;
    annotations: AnnotationsBundle<T>;
    instance: T;
    value: unknown;
    args: unknown[];
    error: Error;
    joinpoint: JoinPoint;
    target: AdviceTarget<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    data: Record<string, any>;
    clone(): this;
}

/**
 * @public
 */
export declare type MutableAdviceTarget<T, A extends AnnotationType> = Mutable<Partial<AdviceTarget<T, A>>>;

/**
 * @public
 */
export declare const on: PointcutExpressionBuilder;

/**
 * @public
 */
export declare interface ParameterAdviceTarget<T> extends AdviceTarget<T, AnnotationType.PARAMETER> {
    readonly propertyKey: string;
    readonly parameterIndex: number;
    readonly location: ParametersAnnotationLocation<T>;
    readonly parent: MethodAdviceTarget<T>;
}

/**
 * @public
 */
export declare type ParameterAnnotation = AnnotationStub<ParameterDecorator> & AnnotationRef;

/**
 * @public
 */
export declare interface ParameterAnnotationsBundle<T = unknown> {
    all(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    onSelf(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    onParameter(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
}

/**
 * @public
 */
export declare type ParameterAnnotationStub = AnnotationStub<ParameterDecorator>;

/**
 * @public
 */
export declare type ParametersAnnotationLocation<T = unknown> = {
    [prop: string]: never;
} & [];

/**
 * @public
 */
export declare interface Pointcut<A extends AnnotationType = any> {
    readonly type: A;
    readonly annotation: AnnotationRef;
    readonly name: string;
    readonly phase: PointcutPhase;
    readonly ref: string;
}

/**
 * @public
 */
export declare namespace Pointcut {
    export function of(phase: PointcutPhase, exp: PointcutExpression | string): Pointcut;
}

/**
 * @public
 */
export declare class PointcutExpression {
    private _label;
    private _annotations;
    private readonly _name;
    private readonly _expr;
    static of<T extends AnnotationType>(type: T, annotation: AnnotationRef): PointcutExpression;
    constructor(_label: string, _annotations?: AnnotationRef[]);
    toString(): string;
}

/**
 * @public
 */
export declare interface PointcutExpressionBuilder {
    readonly class: AnnotationPointcutExpressionBuilder<ClassAnnotation>;
    readonly property: PropertyAnnotationPointcutExpressionBuilder;
    readonly method: AnnotationPointcutExpressionBuilder<MethodAnnotation>;
    readonly parameter: AnnotationPointcutExpressionBuilder<ParameterAnnotation>;
}

/**
 * @public
 */
export declare enum PointcutPhase {
    COMPILE = "Compile",
    AROUND = "Around",
    BEFORE = "Before",
    AFTERRETURN = "AfterReturn",
    AFTER = "After",
    AFTERTHROW = "AfterThrow"
}

/**
 * @public
 */
export declare interface PropertyAdviceTarget<T> extends AdviceTarget<T, AnnotationType.PROPERTY> {
    readonly propertyKey: string;
    readonly location: PropertyAnnotationLocation<T>;
    readonly parent: ClassAdviceTarget<T>;
}

/**
 * @public
 */
export declare type PropertyAnnotation = AnnotationStub<PropertyDecorator> & AnnotationRef;

/**
 * @public
 */
export declare type PropertyAnnotationLocation<T = unknown, P = unknown> = {
    [prop: string]: never;
};

/**
 * @public
 */
export declare class PropertyAnnotationPointcutExpressionBuilder {
    readonly setter: AnnotationPointcutExpressionBuilder<ParameterAnnotation>;
    withAnnotations(...annotation: PropertyAnnotation[]): PointcutExpression;
}

/**
 * @public
 */
export declare interface PropertyAnnotationsBundle<T = unknown> {
    all(...annotation: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<unknown, AnnotationType.PROPERTY>[];
    onProperty(...annotation: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PROPERTY>[];
    onSelf(...annotation: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PROPERTY>[];
}

/**
 * @public
 */
export declare type PropertyAnnotationStub = AnnotationStub<PropertyDecorator>;

/**
 * @public
 */
export declare class RootAnnotationsBundle {
    protected _registry: AnnotationBundleRegistry;
    constructor(_registry: AnnotationBundleRegistry);
    at<T>(location: MethodAnnotationLocation<T>, searchParents?: boolean): MethodAnnotationsBundle<T>;
    at<T>(location: ParametersAnnotationLocation<T>, searchParents?: boolean): ParameterAnnotationsBundle<T>;
    at<T>(location: PropertyAnnotationLocation<T>, searchParents?: boolean): PropertyAnnotationsBundle<T>;
    at<T>(location: ClassAnnotationLocation<T>, searchParents?: boolean): ClassAnnotationsBundle<T>;
    at<T>(location: AnnotationLocation<T>, searchParents?: boolean): AnnotationsBundle<T>;
    all(...annotations: (Annotation | string | AnnotationRef)[]): readonly AnnotationContext[];
}

/**
 * @internal
 */
export declare function _setWeaverContext(weaverContext: WeaverContext): void;

/**
 * A Weaver is some sort of processor that invoke the advices according to the enabled aspects
 * @public
 */
export declare interface Weaver extends WeaverProfile {
    /**
     * Enable some aspects.
     * @param aspects - the aspects to enable
     */
    enable(...aspects: AspectType[]): this;
    /**
     * Disable some aspects.
     * @param aspects - the aspects to disable
     */
    disable(...aspects: (AspectType | string)[]): this;
    /**
     * Disable all aspects.
     */
    reset(): this;
    enhance<T>(target: AnnotationTarget<T, AnnotationType>): Function | PropertyDescriptor | void;
}

/**
 * @public
 */
export declare interface WeaverContext {
    readonly aspects: {
        registry: AspectsRegistry;
    };
    readonly annotations: {
        location: AnnotationLocationFactory;
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
        bundle: RootAnnotationsBundle;
    };
    /**
     * Get the global weaver
     */
    getWeaver(): Weaver;
}

/**
 * A WeaverProfile is a set of Aspects that can be enabled or disabled.
 * The profile itself is meant to be enabled on a Weaver, making it easy to enable multiples aspects at once.
 * @public
 */
export declare class WeaverProfile {
    protected _aspectsRegistry: {
        [aspectId: string]: AspectType;
    };
    constructor();
    enable(...aspects: (AspectType | WeaverProfile)[]): this;
    disable(...aspects: (AspectType | string | WeaverProfile)[]): this;
    reset(): this;
    setEnabled(aspect: AspectType, enabled: boolean): this;
    getAspect<T extends AspectType>(aspect: string | (new () => T)): T | undefined;
    getAspects<T extends AspectType>(): AspectType[];
    [Symbol.iterator](): Iterator<AspectType>;
}

/**
 * Error thrown during the weaving process meaning the weaver has illegal state.
 * @public
 */
export declare class WeavingError extends Error {
}

export { }
