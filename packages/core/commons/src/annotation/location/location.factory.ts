import { AdviceType } from '../../advices/types';
import { AdviceTarget, AnnotationTarget, ClassAdviceTarget } from '../target/annotation-target';
import { AnnotationLocation, ClassAnnotationLocation } from './annotation-location';
import { AnnotationTargetFactory, _AnnotationLocationImpl } from '../target/annotation-target.factory';
import { getProto } from '@aspectjs/core/utils';

/**
 * @public
 */
export class AnnotationLocationFactory {
    constructor(private _targetFactory: AnnotationTargetFactory) {}

    of<T>(obj: { new (...args: any[]): T } | T): ClassAnnotationLocation<T> {
        const proto = getProto(obj);
        if (proto === Object.prototype) {
            throw new TypeError('given object is neither a constructor nor a class instance');
        }

        const target = this._targetFactory.create({
            proto,
            type: AdviceType.CLASS,
        }).declaringClass as ClassAdviceTarget<T>;

        let location = target.location;
        if (obj !== proto && obj !== proto.constructor) {
            // got a value. Bind the value to location
            location = _AnnotationLocationImpl.unwrap(target.location).bindRuntimeContext({
                instance: obj as T,
            }) as ClassAnnotationLocation<T>;
        }
        return location;
    }
}
