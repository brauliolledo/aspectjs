import { AnnotationsBundle, AdviceTarget } from '@aspectjs/reflect';
import { AdviceType } from '../../advice/advice.type';
import { Advice } from '../types';

/**
 * @public
 */
export interface CompileContext<T = unknown, A extends AdviceType = any> {
    /** The applied advice **/
    readonly advice: Advice<T, A>;
    /** The annotation contexts **/
    readonly annotations: AnnotationsBundle<T>;
    /** The symbol targeted by this advice (class, method, property or parameter **/
    readonly target: AdviceTarget<T, A>;
    /** any data set by the advices, shared across all advice going through this execution context **/
    readonly data: Record<string, any>;
}
