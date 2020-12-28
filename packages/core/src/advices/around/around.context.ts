import { AnnotationsBundle, AdviceTarget } from '@aspectjs/reflect';
import { Advice } from '../types';
import { AdviceType } from '../../advice/advice.type';
import { JoinPoint } from '../..//advice/joinpoint';

/**
 * @public
 */
export interface AroundContext<T = unknown, A extends AdviceType = any> {
    /** The applied advice **/
    readonly advice: Advice<T, A>;
    /** The annotation contexts **/
    readonly annotations: AnnotationsBundle<T>;
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
