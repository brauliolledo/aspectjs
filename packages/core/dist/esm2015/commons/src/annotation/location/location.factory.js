import { AnnotationType } from '../annotation.types.js';
import { getProto } from '@aspectjs/core/utils';

/**
 * @public
 */
class AnnotationLocationFactory {
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
            type: AnnotationType.CLASS,
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

export { AnnotationLocationFactory };
//# sourceMappingURL=location.factory.js.map
