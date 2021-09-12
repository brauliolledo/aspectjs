import { Mutable } from '@aspectjs/core/utils';
import { AdviceType } from '../../advices/types';
import { AdviceTarget } from './annotation-target';
/**
 * @public
 */
export declare class AnnotationTargetFactory {
    private readonly _TARGET_GENERATORS;
    private readonly _REF_GENERATORS;
    of<T, A extends AdviceType>(args: any[]): AdviceTarget<T, A>;
    /**
     * Creates an AnnotationTarget from the given argument
     * @param target - the AnnotationTarget stub.
     * @param type - target type override
     */
    create<T, A extends AdviceType>(target: MutableAdviceTarget<T, A>, type?: AdviceType): AdviceTarget<T, A>;
}
/**
 * @public
 */
export declare type MutableAdviceTarget<T, A extends AdviceType> = Mutable<Partial<AdviceTarget<T, A>>>;
//# sourceMappingURL=annotation-target.factory.d.ts.map