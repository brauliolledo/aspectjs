import { _getReferenceConstructor, getOrComputeMetadata, isUndefined, isNumber, getProto, isObject, isFunction, locator, assert } from '@aspectjs/core/utils';
import { AnnotationType } from '../annotation.types.js';

let _globalTargetId = 0;
/**
 * @public
 */
class AnnotationTargetFactory {
    constructor() {
        this._TARGET_GENERATORS = {
            [AnnotationType.CLASS]: _createClassAnnotationTarget,
            [AnnotationType.PROPERTY]: _createPropertyAnnotationTarget,
            [AnnotationType.METHOD]: _createMethodAnnotationTarget,
            [AnnotationType.PARAMETER]: _createParameterAnnotationTarget,
        };
        this._REF_GENERATORS = {
            [AnnotationType.CLASS]: (d) => {
                const ref = `c[${_getReferenceConstructor(d.proto).name}]`;
                return `${ref}#${getOrComputeMetadata('aspectjs.targetId', d.proto, () => _globalTargetId++)}`;
            },
            [AnnotationType.PROPERTY]: (d) => {
                return `${this._REF_GENERATORS[AnnotationType.CLASS](d)}.p[${d.propertyKey}]`;
            },
            [AnnotationType.METHOD]: (d) => {
                return this._REF_GENERATORS[AnnotationType.PROPERTY](d);
            },
            [AnnotationType.PARAMETER]: (d) => {
                return `${this._REF_GENERATORS[AnnotationType.METHOD](d)}.a[${isNaN(d.parameterIndex) ? '*' : d.parameterIndex}]`;
            },
        };
    }
    of(args) {
        // ClassAnnotation = <TFunction extends Function>(target: TFunction) => TFunction | void;
        // PropertyAnnotation = (target: Object, propertyKey: string | symbol) => void;
        // MethodAnnotation = <A>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<A>) => TypedPropertyDescriptor<A> | void;
        // ParameterAnnotation = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
        // eslint-disable-next-line @typescript-eslint/ban-types
        const target = args[0];
        const propertyKey = isUndefined(args[1]) ? undefined : String(args[1]);
        const parameterIndex = isNumber(args[2]) ? args[2] : undefined;
        const proto = getProto(target);
        const descriptor = isObject(args[2]) ? args[2] : undefined;
        const atarget = {
            proto,
            propertyKey,
            parameterIndex,
            descriptor,
        };
        return this.create(atarget);
    }
    /**
     * Creates an AnnotationTarget from the given argument
     * @param target - the AnnotationTarget stub.
     * @param type - target type override
     */
    create(target, type) {
        // determine advice type
        if (isUndefined(type) && isUndefined(target.type)) {
            if (isNumber(target.parameterIndex)) {
                type = AnnotationType.PARAMETER;
            }
            else if (!isUndefined(target.propertyKey)) {
                if (isObject(target.descriptor) && isFunction(target.descriptor.value)) {
                    type = AnnotationType.METHOD;
                }
                else {
                    type = AnnotationType.PROPERTY;
                }
            }
            else {
                type = AnnotationType.CLASS;
            }
        }
        else {
            type = type !== null && type !== void 0 ? type : target.type;
        }
        const ref = this._REF_GENERATORS[type](target);
        target.type = type;
        return getOrComputeMetadata(_metaKey(ref), target.proto, () => {
            const t = this._TARGET_GENERATORS[type](this, target, this._REF_GENERATORS[type]);
            Reflect.setPrototypeOf(t, AnnotationTargetImpl.prototype);
            return t;
        });
    }
}
function _metaKey(ref) {
    return `Decorizer.target:${ref}`;
}
class AnnotationTargetImpl {
    toString() {
        return this.ref;
    }
}
function _createClassAnnotationTarget(targetFactory, target, refGenerator) {
    var _a;
    target = _createAnnotationTarget(target, AnnotationType.CLASS, ['proto'], refGenerator);
    target.label = `class "${target.proto.constructor.name}"`;
    target.name = target.proto.constructor.name;
    target.declaringClass = target;
    target.location = (_a = target.location) !== null && _a !== void 0 ? _a : _createLocation(target);
    const parentClass = _parentClassTargetProperty(targetFactory, target);
    Object.defineProperties(target, {
        parent: parentClass,
        parentClass,
    });
    return target;
}
function _createMethodAnnotationTarget(targetFactory, target, refGenerator) {
    target = _createAnnotationTarget(target, AnnotationType.METHOD, ['proto', 'propertyKey', 'descriptor'], refGenerator);
    target.label = `method "${target.proto.constructor.name}.${String(target.propertyKey)}"`;
    target.name = target.propertyKey;
    Object.defineProperties(target, {
        declaringClass: _declaringClassTargetProperty(targetFactory, target),
        parent: _declaringClassTargetProperty(targetFactory, target),
        parentClass: _parentClassTargetProperty(targetFactory, target),
    });
    if (!target.location) {
        target.location = locator(_getDeclaringClassLocation(target))
            .at(target.propertyKey)
            .orElseCompute(() => _createLocation(target));
        target.location.args = _createAllParametersAnnotationTarget(targetFactory, target, refGenerator)
            .location;
    }
    return target;
}
function _getDeclaringClassLocation(target) {
    // retrieve the declaringClass location (location of the declaringClass target)
    return locator(target.declaringClass)
        .at('location')
        .orElseCompute(() => _createLocation(target.declaringClass)); // if no rootLocation exists, create a new one.
}
function _createPropertyAnnotationTarget(targetFactory, target, refGenerator) {
    var _a;
    target = _createAnnotationTarget(target, AnnotationType.PROPERTY, ['proto', 'propertyKey'], refGenerator);
    target.label = `property "${target.proto.constructor.name}.${String(target.propertyKey)}"`;
    Object.defineProperties(target, {
        declaringClass: _declaringClassTargetProperty(targetFactory, target),
        parent: _declaringClassTargetProperty(targetFactory, target),
        parentClass: _parentClassTargetProperty(targetFactory, target),
    });
    assert(target.type === AnnotationType.PROPERTY);
    target.location =
        (_a = target.location) !== null && _a !== void 0 ? _a : locator(_getDeclaringClassLocation(target))
            .at(target.propertyKey)
            .orElseCompute(() => _createLocation(target));
    return target;
}
function _createAllParametersAnnotationTarget(targetFactory, target, refGenerator) {
    var _a;
    target = _createAnnotationTarget(Object.assign(Object.assign({}, target), { parameterIndex: NaN }), AnnotationType.PARAMETER, ['parameterIndex', 'proto', 'propertyKey'], refGenerator);
    target.label = `parameter "${target.proto.constructor.name}.${String(target.propertyKey)}(*)})"`;
    Object.defineProperties(target, {
        declaringClass: _declaringClassTargetProperty(targetFactory, target),
        parent: _declaringMethodTargetProperty(targetFactory, target),
        parentClass: _parentClassTargetProperty(targetFactory, target),
    });
    target.location = (_a = target.location) !== null && _a !== void 0 ? _a : _createLocation(target, []);
    return target;
}
function _createParameterAnnotationTarget(targetFactory, target, refGenerator) {
    target = _createAnnotationTarget(target, AnnotationType.PARAMETER, ['parameterIndex', 'proto', 'propertyKey'], refGenerator);
    target.label = `parameter "${target.proto.constructor.name}.${String(target.propertyKey)}(#${target.parameterIndex})"`;
    Object.defineProperties(target, {
        declaringClass: _declaringClassTargetProperty(targetFactory, target),
        parent: _declaringMethodTargetProperty(targetFactory, target),
        parentClass: _parentClassTargetProperty(targetFactory, target),
    });
    if (!target.location) {
        const methodLocation = locator(_getDeclaringClassLocation(target))
            .at(target.propertyKey)
            .orElseCompute(() => {
            return targetFactory.create({
                proto: target.proto,
                propertyKey: target.propertyKey,
                descriptor: Object.getOwnPropertyDescriptor(target.proto, target.propertyKey),
            }, AnnotationType.METHOD).location;
        });
        target.location = locator(methodLocation.args)
            .at(target.parameterIndex)
            .orElseCompute(() => _createLocation(target));
    }
    target.descriptor = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey);
    return target;
}
function _createAnnotationTarget(target, type, requiredProperties, refGenerator) {
    var _a;
    requiredProperties.forEach((n) => assert(!isUndefined(target[n]), `target.${n} is undefined`));
    target = Object.assign({}, target);
    // delete useleff properties
    Object.keys(target)
        .filter((p) => requiredProperties.indexOf(p) < 0)
        .forEach((n) => delete target[n]);
    target.type = type;
    target.ref = (_a = target.ref) !== null && _a !== void 0 ? _a : refGenerator(target);
    return target;
}
function _parentClassTargetProperty(targetFactory, dtarget) {
    return {
        get() {
            const parentProto = Reflect.getPrototypeOf(dtarget.proto);
            return parentProto === Object.prototype
                ? undefined
                : targetFactory.of([parentProto]);
        },
    };
}
function _declaringClassTargetProperty(targetFactory, dtarget) {
    return {
        get() {
            return targetFactory.create(Object.assign({}, dtarget), AnnotationType.CLASS);
        },
    };
}
function _declaringMethodTargetProperty(targetFactory, dtarget) {
    return {
        get() {
            return targetFactory.of([dtarget.proto, dtarget.propertyKey]);
        },
    };
}
function _createLocation(target, locationStub = new AdviceLocationImpl()) {
    const proto = Object.create(Reflect.getPrototypeOf(locationStub));
    proto.getTarget = () => {
        return target;
    };
    Reflect.setPrototypeOf(locationStub, proto);
    return locationStub;
}
class AdviceLocationImpl {
    getTarget() {
        throw new Error('No target registered');
    }
}

export { AnnotationTargetFactory };
//# sourceMappingURL=annotation-target.factory.js.map
