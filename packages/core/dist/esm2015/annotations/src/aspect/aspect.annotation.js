import { isString, setAspectOptions } from '@aspectjs/core/utils';
import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';

let _globalAspectId = 0;
/**
 * @public
 */
const Aspect = ASPECTJS_ANNOTATION_FACTORY.create(function Aspect(id = {}) {
    return function (target) {
        var _a;
        const options = isString(id) ? { id: id } : (_a = id) !== null && _a !== void 0 ? _a : {};
        if (options.id === undefined) {
            options.id = `AnonymousAspect#${_globalAspectId++}`;
        }
        else if (!isString(options.id)) {
            throw new TypeError(`Aspect ${target.name} should have a string id. Got: ${options.id}`);
        }
        setAspectOptions(target, options);
    };
});

export { Aspect };
//# sourceMappingURL=aspect.annotation.js.map
