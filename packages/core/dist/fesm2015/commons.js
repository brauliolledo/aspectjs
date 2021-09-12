import { assert, isArray, isObject, isString, getAspectOptions, isFunction, getProto, locator, _getReferenceConstructor, getOrComputeMetadata, isUndefined, isNumber } from '@aspectjs/core/utils';

/**
 * @public
 */
/**
 * @public
 */
var AnnotationType;
(function (AnnotationType) {
    AnnotationType["CLASS"] = "AnnotationType.CLASS";
    AnnotationType["PROPERTY"] = "AnnotationType.PROPERTY";
    AnnotationType["METHOD"] = "AnnotationType.METHOD";
    AnnotationType["PARAMETER"] = "AnnotationType.PARAMETER";
})(AnnotationType || (AnnotationType = {}));
/**
 * @public
 */
class AnnotationRef {
    constructor(groupIdOrRef, name) {
        if (!name) {
            this.ref = groupIdOrRef;
            const ANNOTATION_REF_REGEX = /(?<groupId>\S+):(?<name>\S+)/;
            const macth = ANNOTATION_REF_REGEX.exec(this.ref);
            this.groupId = macth.groups.groupId;
            this.name = macth.groups.name;
        }
        else {
            this.ref = `${groupIdOrRef}:${name}`;
            this.name = name;
            this.groupId = groupIdOrRef;
        }
        if (!this.name) {
            assert(false);
            throw new Error('cannot create annotation without name');
        }
        if (!this.groupId) {
            throw new Error('cannot create annotation without groupId');
        }
        Object.defineProperty(this, Symbol.toPrimitive, {
            enumerable: false,
            value: () => {
                return `@${this.name}`;
            },
        });
    }
    toString() {
        return `@${this.groupId}:${this.name}`;
    }
}

/**
 * Thrown by aspects in case some error occurred during the aspect execution.
 * @public
 */
class AspectError extends Error {
    constructor(ctxt, message) {
        super(`Error applying advice ${ctxt.advice} on ${ctxt.target.label}: ${message}`);
    }
}

/**
 * Error thrown during the weaving process meaning the weaver has illegal state.
 * @public
 */
class WeavingError extends Error {
}

/**
 * Error thrown when an advice has an unexpected behavior (eg: returns a value that is not permitted)
 * @public
 */
class AdviceError extends WeavingError {
    constructor(advice, message) {
        super(`${advice}: ${message}`);
    }
}

/**
 * @public
 */
class PointcutExpression {
    constructor(_label, _annotations = []) {
        this._label = _label;
        this._annotations = _annotations;
        this._name = '*'; // TODO
        this._expr = _trimSpaces(`${this._label} ${this._annotations.map((a) => `@${a.ref}`).join(',')} ${this._name}`);
    }
    static of(type, annotation) {
        return AnnotationPointcutExpressionBuilders[type].withAnnotations(annotation);
    }
    toString() {
        return this._expr;
    }
}
/**
 * @public
 */
class AnnotationPointcutExpressionBuilder {
    constructor(_label) {
        this._label = _label;
    }
    withAnnotations(...annotation) {
        return new PointcutExpression(this._label, annotation);
    }
}
/**
 * @public
 */
class PropertyAnnotationPointcutExpressionBuilder {
    constructor() {
        this.setter = new AnnotationPointcutExpressionBuilder('property#set');
    }
    withAnnotations(...annotation) {
        return new PointcutExpression('property#get', annotation);
    }
}
const AnnotationPointcutExpressionBuilders = {
    [AnnotationType.CLASS]: new AnnotationPointcutExpressionBuilder('class'),
    [AnnotationType.METHOD]: new AnnotationPointcutExpressionBuilder('method'),
    [AnnotationType.PARAMETER]: new AnnotationPointcutExpressionBuilder('parameter'),
    [AnnotationType.PROPERTY]: new PropertyAnnotationPointcutExpressionBuilder(),
};
/**
 * @public
 */
const on = {
    class: AnnotationPointcutExpressionBuilders[AnnotationType.CLASS],
    method: AnnotationPointcutExpressionBuilders[AnnotationType.METHOD],
    parameter: AnnotationPointcutExpressionBuilders[AnnotationType.PARAMETER],
    property: AnnotationPointcutExpressionBuilders[AnnotationType.PROPERTY],
};
/**
 * @public
 */
var PointcutPhase;
(function (PointcutPhase) {
    PointcutPhase["COMPILE"] = "Compile";
    PointcutPhase["AROUND"] = "Around";
    PointcutPhase["BEFORE"] = "Before";
    PointcutPhase["AFTERRETURN"] = "AfterReturn";
    PointcutPhase["AFTER"] = "After";
    PointcutPhase["AFTERTHROW"] = "AfterThrow";
})(PointcutPhase || (PointcutPhase = {}));
/**
 * @public
 */
var Pointcut;
(function (Pointcut) {
    const POINTCUT_REGEXPS = {
        [AnnotationType.CLASS]: new RegExp('class(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AnnotationType.PROPERTY]: new RegExp('property#(?:get|set)(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AnnotationType.METHOD]: new RegExp('method(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AnnotationType.PARAMETER]: new RegExp('parameter(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
    };
    function of(phase, exp) {
        const ref = exp.toString();
        let pointcut;
        for (const entry of Object.entries(POINTCUT_REGEXPS)) {
            const [type, regex] = entry;
            const match = regex.exec(ref);
            if (match === null || match === void 0 ? void 0 : match.groups.name) {
                assert(!!match.groups.annotation, 'only annotation pointcuts are supported');
                pointcut = {
                    type: type,
                    phase,
                    annotation: new AnnotationRef(match.groups.annotation),
                    name: match.groups.name,
                    ref,
                };
                Reflect.defineProperty(pointcut, Symbol.toPrimitive, {
                    value: () => `${phase}(${ref})`,
                });
                return pointcut;
            }
        }
        throw new WeavingError(`expression ${ref} not recognized as valid pointcut expression`);
    }
    Pointcut.of = of;
})(Pointcut || (Pointcut = {}));
function _trimSpaces(s) {
    return s.replace(/\s+/, ' ');
}

/**
 * @internal
 */
class _JoinpointFactory {
    static create(advice, ctxt, fn) {
        function alreadyCalledFn() {
            throw new AdviceError(advice, `joinPoint already proceeded`);
        }
        return function (args) {
            args = args !== null && args !== void 0 ? args : ctxt.args;
            if (!isArray(args)) {
                throw new AdviceError(advice, `Joinpoint arguments expected to be array. Got: ${args}`);
            }
            const jp = fn;
            fn = alreadyCalledFn;
            return jp.apply(ctxt.instance, args);
        };
    }
}

/**
 * A WeaverProfile is a set of Aspects that can be enabled or disabled.
 * The profile itself is meant to be enabled on a Weaver, making it easy to enable multiples aspects at once.
 * @public
 */
class WeaverProfile {
    constructor() {
        this._aspectsRegistry = {};
    }
    enable(...aspects) {
        aspects.forEach((p) => {
            if (p instanceof WeaverProfile) {
                Object.values(p._aspectsRegistry).forEach((p) => this.enable(p));
            }
            else {
                this.setEnabled(p, true);
            }
        });
        return this;
    }
    disable(...aspects) {
        aspects.forEach((p) => {
            if (p instanceof WeaverProfile) {
                // disable profile
                Object.values(p._aspectsRegistry).forEach((p) => this.disable(p));
            }
            else if (isObject(p)) {
                // disable aspect
                this.setEnabled(p, false);
            }
            else {
                assert(isString(p));
                // delete aspect by id
                delete this._aspectsRegistry[p];
            }
        });
        return this;
    }
    reset() {
        this._aspectsRegistry = {};
        return this;
    }
    setEnabled(aspect, enabled) {
        var _a;
        const id = getAspectOptions(aspect).id;
        if (enabled) {
            // avoid enabling an aspect twice
            const oldAspect = this._aspectsRegistry[id];
            if (oldAspect && oldAspect !== aspect) {
                console.warn(`Aspect ${aspect.constructor.name} overrides aspect "${(_a = oldAspect === null || oldAspect === void 0 ? void 0 : oldAspect.constructor.name) !== null && _a !== void 0 ? _a : 'unknown'}" already registered for name ${id}`);
            }
            this._aspectsRegistry[id] = aspect;
        }
        else {
            delete this._aspectsRegistry[id];
        }
        return this;
    }
    getAspect(aspect) {
        if (isString(aspect)) {
            return this._aspectsRegistry[aspect];
        }
        else {
            return this._aspectsRegistry[getAspectOptions(aspect).id];
        }
    }
    getAspects() {
        return Object.values(this._aspectsRegistry);
    }
    [Symbol.iterator]() {
        const aspects = this.getAspects();
        let i = 0;
        return {
            next: () => {
                if (i >= aspects.length) {
                    return { value: undefined, done: true };
                }
                return { value: aspects[i++], done: false };
            },
        };
    }
}

let _weaverContext;
/**
 * @internal
 */
function _getWeaverContext() {
    return _weaverContext;
}
/**
 * @internal
 */
function _setWeaverContext(weaverContext) {
    _weaverContext = weaverContext;
}

/**
 * @internal
 */
class _AdviceFactory {
    static create(pointcut, target) {
        var _a;
        assert(!(pointcut.type === AnnotationType.PROPERTY) ||
            pointcut.ref.startsWith('property#get') ||
            pointcut.ref.startsWith('property#set'));
        const [aspect, propertyKey] = [target.proto, target.propertyKey];
        assert(isFunction(aspect[propertyKey]));
        let advice;
        if (pointcut.phase === PointcutPhase.COMPILE) {
            // prevent @Compile advices to be called twice
            advice = function (...args) {
                const a = advice;
                advice = (() => {
                    throw new WeavingError(`${a} already applied`);
                });
                return aspect[propertyKey].apply(this, args);
            };
        }
        else {
            advice = function (...args) {
                return aspect[propertyKey].apply(this, args);
            };
        }
        advice.pointcut = pointcut;
        advice.aspect = aspect;
        Reflect.defineProperty(advice, Symbol.toPrimitive, {
            value: () => `@${pointcut.phase}(${pointcut.annotation}) ${aspect.constructor.name}.${String(propertyKey)}()`,
        });
        Reflect.defineProperty(advice, 'name', {
            value: propertyKey,
        });
        if (pointcut.phase === PointcutPhase.COMPILE) {
            if (pointcut.ref.startsWith('property#set')) {
                // @Compile(on.property.setter) are forbidden
                // because PropertyDescriptor can only be setup for both setter & getter at once.
                throw new AdviceError(advice, `Advice cannot be applied on property setter`);
            }
        }
        // assert the weaver is loaded before invoking the underlying decorator
        const weaverContext = _getWeaverContext();
        if (!weaverContext) {
            throw new Error(`Cannot create aspect ${(_a = getProto(aspect).constructor.name) !== null && _a !== void 0 ? _a : ''} before "setWeaverContext()" has been called`);
        }
        return advice;
    }
}

/**
 * @public
 */
class AnnotationContext extends AnnotationRef {
}

/**
 * @public
 */
class AnnotationRegistry {
    constructor(_bundleRegistry) {
        this._bundleRegistry = _bundleRegistry;
    }
    /**
     * Registers a new annotation by its AnnotationContext,
     * so that it can be picked up wy an annotation weaver, or used through AnnotationBundle
     * @param context - the annotation context to register
     */
    register(context) {
        const byTargetReg = locator(this._bundleRegistry.byTargetClassRef)
            .at(context.target.declaringClass.ref)
            .orElseCompute(() => ({
            byAnnotation: {},
            all: [],
        }));
        [byTargetReg, this._bundleRegistry].forEach((reg) => {
            locator(reg.byAnnotation)
                .at(context.ref)
                .orElseCompute(() => [])
                .push(context);
        });
        byTargetReg.all.push(context);
    }
}

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

/**
 * @public
 */
class RootAnnotationsBundle {
    constructor(_registry) {
        this._registry = _registry;
    }
    at(location, searchParents = true) {
        return new ClassAnnotationsBundle(this._registry, location, searchParents);
    }
    all(...annotations) {
        if (annotations && annotations.length === 1) {
            return locator(this._registry.byAnnotation)
                .at(getAnnotationRef(annotations[0]))
                .orElseGet(() => []);
        }
        let entries = Object.entries(this._registry.byAnnotation);
        if (annotations && annotations.length) {
            const annotationsSet = new Set(annotations.map((a) => getAnnotationRef(a)));
            entries = entries.filter((e) => annotationsSet.has(e[0]));
        }
        return entries.map((e) => e[1]).flat();
    }
}
/**
 * @public
 */
class ClassAnnotationsBundle extends RootAnnotationsBundle {
    constructor(registry, location, searchParents) {
        super(registry);
        this.searchParents = searchParents;
        this._target = AnnotationLocationFactory.getTarget(location);
    }
    all(...annotations) {
        return this._allWithFilter(this._target, 'all', annotations);
    }
    onClass(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.CLASS, annotations);
    }
    onSelf(...annotations) {
        return this._allWithFilter(this._target, this._target.type, annotations);
    }
    onProperty(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.PROPERTY, annotations);
    }
    onMethod(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.METHOD, annotations);
    }
    onParameter(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.PARAMETER, annotations);
    }
    _allWithFilter(target, filter, annotations) {
        if (!target) {
            return [];
        }
        const parentContext = target.parentClass && this.searchParents
            ? this._allWithFilter(target.parentClass, filter, annotations)
            : [];
        const reg = locator(this._registry.byTargetClassRef).at(target.declaringClass.ref).get();
        if (!reg) {
            return parentContext;
        }
        const annotationsRef = (annotations !== null && annotations !== void 0 ? annotations : []).map(getAnnotationRef);
        let contexts = reg.all;
        if (annotationsRef.length) {
            contexts = annotationsRef
                .map((annotationRef) => locator(reg.byAnnotation)
                .at(annotationRef)
                .orElseGet(() => []))
                .flat();
        }
        contexts = contexts.filter((a) => FILTERS[target.type][filter](target, a));
        return [...parentContext, ...contexts];
    }
}
const falseFilter = () => false;
const FILTERS = {
    [AnnotationType.CLASS]: {
        all(target, a) {
            // keep all if location is the class
            return true;
        },
        [AnnotationType.CLASS](target, a) {
            // keep only annotations on classes
            return a.target.type === AnnotationType.CLASS;
        },
        [AnnotationType.PROPERTY](target, a) {
            // keep only annotations on properties
            return a.target.type === AnnotationType.PROPERTY;
        },
        [AnnotationType.METHOD](target, a) {
            // keep only annotations on properties
            return a.target.type === AnnotationType.METHOD;
        },
        [AnnotationType.PARAMETER](target, a) {
            // keep only annotations on properties
            return a.target.type === AnnotationType.PARAMETER;
        },
    },
    [AnnotationType.PROPERTY]: {
        all(target, a) {
            // keep if same propertyKey
            return target.propertyKey === a.target.propertyKey;
        },
        [AnnotationType.CLASS]: falseFilter,
        [AnnotationType.PROPERTY](target, a) {
            return FILTERS[target.type].all(target, a);
        },
        [AnnotationType.METHOD]: falseFilter,
        [AnnotationType.PARAMETER]: falseFilter,
    },
    [AnnotationType.METHOD]: {
        all(target, a) {
            const aTarget = a.target;
            // keep if same propertyKey
            return (target.propertyKey === aTarget.propertyKey &&
                (aTarget.type === AnnotationType.PARAMETER || aTarget.type === AnnotationType.METHOD));
        },
        [AnnotationType.CLASS]: falseFilter,
        [AnnotationType.PROPERTY]: falseFilter,
        [AnnotationType.METHOD](target, a) {
            return (
            // keep only annotations on properties
            a.target.type === AnnotationType.METHOD &&
                // keep only the required method if location is the method
                target.propertyKey === a.target.propertyKey);
        },
        [AnnotationType.PARAMETER](target, a) {
            return (
            // keep only annotations on properties
            a.target.type === AnnotationType.PARAMETER &&
                // keep all parameters on method if location is the method
                target.propertyKey === a.target.propertyKey);
        },
    },
    [AnnotationType.PARAMETER]: {
        all(target, a) {
            const aTarget = a.target;
            return (
            // keep if same propertyKey
            target.propertyKey === aTarget.propertyKey &&
                // keep parameters if location is parameters
                aTarget.type === AnnotationType.PARAMETER &&
                (isNaN(target.parameterIndex) || target.parameterIndex === aTarget.parameterIndex));
        },
        [AnnotationType.CLASS]: falseFilter,
        [AnnotationType.PROPERTY]: falseFilter,
        [AnnotationType.METHOD]: falseFilter,
        [AnnotationType.PARAMETER](target, a) {
            return FILTERS[target.type].all(target, a);
        },
    },
};
function getAnnotationRef(annotation) {
    return isString(annotation) ? annotation : annotation === null || annotation === void 0 ? void 0 : annotation.ref;
}

let generatedId = 0;
/**
 * Factory to create some {@link Annotation}.
 * @public
 */
class AnnotationFactory {
    constructor(groupId) {
        this._groupId = groupId;
    }
    create(name, annotationStub) {
        const groupId = this._groupId;
        if (isFunction(name)) {
            annotationStub = name;
            name = annotationStub.name;
        }
        if (!annotationStub) {
            annotationStub = function () { };
        }
        if (!name) {
            name = `anonymousAnnotation#${generatedId++}`;
        }
        // create the annotation (ie: decorator provider)
        const annotation = _createAnnotation(name, groupId, annotationStub, function (...annotationArgs) {
            return _createBootstrapDecorator(annotation, annotationStub, annotationArgs);
        });
        return annotation;
    }
}
function _createAnnotation(name, groupId, annotationStub, fn) {
    assert(typeof fn === 'function');
    // ensure annotation has a name.
    annotationStub = annotationStub !== null && annotationStub !== void 0 ? annotationStub : function () { };
    const annotationRef = new AnnotationRef(groupId, name);
    const annotation = fn;
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationStub));
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationRef));
    assert(Object.getOwnPropertySymbols(annotation).indexOf(Symbol.toPrimitive) >= 0);
    return annotation;
}
function _createBootstrapDecorator(annotation, annotationStub, annotationArgs) {
    return function (...targetArgs) {
        var _a, _b;
        // eslint-disable-next-line prefer-spread
        (_a = annotationStub(...annotationArgs)) === null || _a === void 0 ? void 0 : _a.apply(null, targetArgs);
        // assert the weaver is loaded before invoking the underlying decorator
        const weaverContext = _getWeaverContext();
        if (!weaverContext) {
            throw new Error(`Cannot invoke annotation ${(_b = annotation.name) !== null && _b !== void 0 ? _b : ''} before "setWeaverContext()" has been called`);
        }
        const target = _getWeaverContext().annotations.targetFactory.of(targetArgs);
        const annotationContext = new AnnotationContextImpl(target, annotationArgs, annotation);
        weaverContext.annotations.registry.register(annotationContext);
        const enhanced = weaverContext.getWeaver().enhance(target);
        if (target.type === AnnotationType.CLASS) {
            Object.defineProperties(enhanced, Object.getOwnPropertyDescriptors(targetArgs[0]));
        }
        return enhanced;
    };
}
class AnnotationContextImpl extends AnnotationContext {
    constructor(target, args, annotation) {
        super(annotation.groupId, annotation.name);
        this.target = target;
        this.args = args;
    }
}

/**
 * The AnnotationFactory used to create annotations of the Aspectjs framework
 * @public
 */
const ASPECTJS_ANNOTATION_FACTORY = new AnnotationFactory('aspectjs');

export { ASPECTJS_ANNOTATION_FACTORY, AdviceError, AnnotationType as AdviceType, AnnotationContext, AnnotationFactory, AnnotationLocationFactory, AnnotationPointcutExpressionBuilder, AnnotationRef, AnnotationRegistry, AnnotationTargetFactory, AnnotationType, AspectError, ClassAnnotationsBundle, Pointcut, PointcutExpression, PointcutPhase, PropertyAnnotationPointcutExpressionBuilder, RootAnnotationsBundle, WeaverProfile, WeavingError, _AdviceFactory, _JoinpointFactory, _getWeaverContext, _setWeaverContext, on };
//# sourceMappingURL=commons.js.map
