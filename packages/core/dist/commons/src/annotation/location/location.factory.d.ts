import { AnnotationTarget } from '../target/annotation-target';
import { AnnotationLocation, ClassAnnotationLocation } from './annotation-location';
import { AnnotationTargetFactory } from '../target/annotation-target.factory';
/**
 * @public
 */
export declare class AnnotationLocationFactory {
    private _targetFactory;
    constructor(_targetFactory: AnnotationTargetFactory);
    of<T>(obj: (new () => T) | T): ClassAnnotationLocation<T>;
    static getTarget<T>(location: AnnotationLocation<T>): AnnotationTarget<T>;
}
//# sourceMappingURL=location.factory.d.ts.map