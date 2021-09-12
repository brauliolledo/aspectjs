import { AdviceContext } from './advice.context.type';
import { AfterPointcut, AfterReturnPointcut, AfterThrowPointcut, AroundPointcut, BeforePointcut, CompilePointcut, PointcutPhase } from '../types';
import { AnnotationType } from '../annotation/annotation.types';
import { JoinPoint } from '../types';
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
export declare type BeforeAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: BeforePointcut<A>;
} & ((ctxt: AdviceContext<T, A>) => void);
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
export declare type AfterReturnAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: AfterReturnPointcut<A>;
} & ((ctxt: AdviceContext<T, A>, returnValue: any) => T | null | undefined);
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
export declare type AroundAdvice<T = unknown, A extends AnnotationType = any> = {
    name: string;
    aspect: object;
    pointcut?: AroundPointcut<A>;
} & ((ctxt: AdviceContext<T, A>, joinPoint: JoinPoint, args: any[]) => any);
/**
 * @public
 */
export declare type Advice<T = unknown, A extends AnnotationType = any, V extends PointcutPhase = any> = V extends PointcutPhase.COMPILE ? CompileAdvice<T, A> : V extends PointcutPhase.BEFORE ? BeforeAdvice<T, A> : V extends PointcutPhase.AROUND ? AroundAdvice<T, A> : V extends PointcutPhase.AFTERRETURN ? AfterReturnAdvice<T, A> : V extends PointcutPhase.AFTERTHROW ? AfterThrowAdvice<T, A> : V extends PointcutPhase.AFTER ? AfterAdvice<T, A> : never;
/**
 * @public
 */
export { AnnotationType as AdviceType };
/**
 * @public
 */
export * from './advice.context.type';
//# sourceMappingURL=types.d.ts.map