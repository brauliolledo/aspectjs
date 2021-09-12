import { AdviceType } from '../../advices/types';
import { getProto } from '@aspectjs/core/utils';
/**
 * @public
 */
export class AnnotationLocationFactory {
    constructor(_targetFactory) {
        this._targetFactory = _targetFactory;
    }
    of(obj) {
        const proto = getProto(obj);
        if (proto === Object.prototype) {
            throw new Error('given object is neither a constructor nor a class instance');
        }
        const target = this._targetFactory.create({
            proto,
            type: AdviceType.CLASS,
        }).declaringClass;
        return target.location;
    }
    static getTarget(location) {
        if (!location) {
            return undefined;
        }
        return Object.getPrototypeOf(location).getTarget();
    }
}
//# sourceMappingURL=location.factory.js.map