import { Annotation, AnnotationRef, ClassAnnotation, MethodAnnotation, ParameterAnnotation, PropertyAnnotation } from '../annotation/annotation.types';
import { AdviceType } from '../advices/types';
/**
 * @public
 */
export declare class PointcutExpression {
    private _label;
    private _annotations;
    private readonly _name;
    private readonly _expr;
    static of<T extends AdviceType>(type: T, annotation: AnnotationRef): PointcutExpression;
    constructor(_label: string, _annotations?: AnnotationRef[]);
    toString(): string;
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
export declare class PropertyAnnotationPointcutExpressionBuilder {
    readonly setter: AnnotationPointcutExpressionBuilder<ParameterAnnotation>;
    withAnnotations(...annotation: PropertyAnnotation[]): PointcutExpression;
}
/**
 * @public
 */
export interface PointcutExpressionBuilder {
    readonly class: AnnotationPointcutExpressionBuilder<ClassAnnotation>;
    readonly property: PropertyAnnotationPointcutExpressionBuilder;
    readonly method: AnnotationPointcutExpressionBuilder<MethodAnnotation>;
    readonly parameter: AnnotationPointcutExpressionBuilder<ParameterAnnotation>;
}
/**
 * @public
 */
export declare const on: PointcutExpressionBuilder;
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
export interface Pointcut<A extends AdviceType = any> {
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
    function of(phase: PointcutPhase, exp: PointcutExpression | string): Pointcut;
}
/**
 * @public
 */
export interface CompilePointcut<A extends AdviceType = any> extends Pointcut<A> {
    phase: PointcutPhase.COMPILE;
}
/**
 * @public
 */
export interface AroundPointcut<A extends AdviceType = any> extends Pointcut<A> {
    phase: PointcutPhase.AROUND;
}
/**
 * @public
 */
export interface BeforePointcut<A extends AdviceType = any> extends Pointcut<A> {
    phase: PointcutPhase.BEFORE;
}
/**
 * @public
 */
export interface AfterReturnPointcut<A extends AdviceType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTERRETURN;
}
/**
 * @public
 */
export interface AfterPointcut<A extends AdviceType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTER;
}
/**
 * @public
 */
export interface AfterThrowPointcut<A extends AdviceType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTERTHROW;
}
//# sourceMappingURL=pointcut.d.ts.map