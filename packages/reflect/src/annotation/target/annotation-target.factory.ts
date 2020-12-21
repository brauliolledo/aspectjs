import { AnnotationType } from '@aspectjs/common';
import {
    assert,
    getOrComputeMetadata,
    getProto,
    isFunction,
    isNumber,
    isObject,
    isUndefined,
    Mutable,
    _getReferenceConstructor,
} from '@aspectjs/common/utils';
import {
    AdviceTarget,
    ClassAdviceTarget,
    MethodAdviceTarget,
    ParameterAdviceTarget,
    PropertyAdviceTarget,
} from './annotation-target';

let _globalTargetId = 0;
/**
 * @public
 */
export class AnnotationTargetFactory {
    private readonly _TARGET_GENERATORS = {
        [AnnotationType.CLASS]: _createClassAnnotationTarget,
        [AnnotationType.PROPERTY]: _createPropertyAnnotationTarget,
        [AnnotationType.METHOD]: _createMethodAnnotationTarget,
        [AnnotationType.PARAMETER]: _createParameterAnnotationTarget,
    };

    private readonly _REF_GENERATORS = {
        [AnnotationType.CLASS]: (d: Mutable<Partial<ClassAdviceTarget<any>>>) => {
            const ref = `c[${_getReferenceConstructor(d.proto).name}]`;

            return `${ref}#${getOrComputeMetadata('aspectjs.targetId', d.proto, () => _globalTargetId++)}`;
        },
        [AnnotationType.PROPERTY]: (d: Mutable<Partial<PropertyAdviceTarget<any>>>) => {
            return `${this._REF_GENERATORS[AnnotationType.CLASS](d as any)}.p[${d.propertyKey}]`;
        },
        [AnnotationType.METHOD]: (d: Mutable<Partial<MethodAdviceTarget<any>>>) => {
            return this._REF_GENERATORS[AnnotationType.PROPERTY](d as any);
        },
        [AnnotationType.PARAMETER]: (d: Mutable<Partial<ParameterAdviceTarget<any>>>) => {
            return `${this._REF_GENERATORS[AnnotationType.METHOD](d as any)}.a[${
                isNaN(d.parameterIndex) ? '*' : d.parameterIndex
            }]`;
        },
    };

    of<T, A extends AnnotationType>(args: any[]): AdviceTarget<T, A> {
        // ClassAnnotation = <TFunction extends Function>(target: TFunction) => TFunction | void;
        // PropertyAnnotation = (target: Object, propertyKey: string | symbol) => void;
        // MethodAnnotation = <A>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<A>) => TypedPropertyDescriptor<A> | void;
        // ParameterAnnotation = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;

        // eslint-disable-next-line @typescript-eslint/ban-types
        const target: Function | object = args[0];
        const propertyKey: string | undefined = isUndefined(args[1]) ? undefined : String(args[1]);
        const parameterIndex: number | undefined = isNumber(args[2]) ? args[2] : undefined;
        const proto = getProto(target);
        const descriptor: PropertyDescriptor | undefined = isObject(args[2]) ? args[2] : undefined;
        const atarget: MutableAdviceTarget<any, AnnotationType> = {
            proto,
            propertyKey,
            parameterIndex,
            descriptor,
        };

        return this.create(atarget as any);
    }

    /**
     * Creates an AnnotationTarget from the given argument
     * @param target - the AnnotationTarget stub.
     * @param type - target type override
     */
    create<T, A extends AnnotationType>(target: MutableAdviceTarget<T, A>, type?: AnnotationType): AdviceTarget<T, A> {
        // determine advice type
        if (isUndefined(type) && isUndefined(target.type)) {
            if (isNumber(((target as any) as ParameterAdviceTarget<T>).parameterIndex)) {
                type = AnnotationType.PARAMETER;
            } else if (!isUndefined(target.propertyKey)) {
                if (isObject(target.descriptor) && isFunction(target.descriptor.value)) {
                    type = AnnotationType.METHOD;
                } else {
                    type = AnnotationType.PROPERTY;
                }
            } else {
                type = AnnotationType.CLASS;
            }
        } else {
            type = type ?? target.type;
        }

        const ref = this._REF_GENERATORS[type](target as any);
        target.type = type as A;
        return getOrComputeMetadata(_metaKey(ref), target.proto, () => {
            const t = (this._TARGET_GENERATORS[type] as any)(this, target as any, this._REF_GENERATORS[type]);
            Reflect.setPrototypeOf(t, AnnotationTargetImpl.prototype);

            return t;
        });
    }
}

function _metaKey(ref: string): string {
    return `@aspectjs::target:${ref}`;
}

class AnnotationTargetImpl {
    toString() {
        return ((this as any) as AdviceTarget<any, any>).label;
    }
}

/**
 * @public
 */
export type MutableAdviceTarget<T, A extends AnnotationType> = Mutable<Partial<AdviceTarget<T, A>>>;

function _createClassAnnotationTarget<T, A extends AnnotationType.CLASS>(
    targetFactory: AnnotationTargetFactory,
    target: AnnotationTargetLike<T, A>,
    refGenerator: (d: Mutable<Partial<AdviceTarget>>) => string,
): AnnotationTargetLike<T, A> {
    target = _createAnnotationTarget(target, AnnotationType.CLASS, ['proto'], refGenerator) as Mutable<
        Partial<AdviceTarget<T, A>>
    >;
    target.label = `class "${target.proto.constructor.name}"`;
    target.name = target.proto.constructor.name;
    target.declaringClass = target as any;

    const parentClass = _parentClassTargetProperty(targetFactory, target);
    Object.defineProperties(target, {
        parent: parentClass,
        parentClass,
    });

    return target as AdviceTarget<T, A>;
}

function _createMethodAnnotationTarget<T, D extends AnnotationType.METHOD>(
    targetFactory: AnnotationTargetFactory,
    target: AnnotationTargetLike<T, D>,
    refGenerator: (d: Mutable<Partial<AdviceTarget>>) => string,
): AnnotationTargetLike<T, D> {
    target = _createAnnotationTarget(
        target,
        AnnotationType.METHOD,
        ['proto', 'propertyKey', 'descriptor'],
        refGenerator,
    );

    target.label = `method "${target.proto.constructor.name}.${String(target.propertyKey)}"`;
    target.name = target.propertyKey;
    Object.defineProperties(target, {
        declaringClass: _declaringClassTargetProperty(targetFactory, target),
        parent: _declaringClassTargetProperty(targetFactory, target),
        parentClass: _parentClassTargetProperty(targetFactory, target),
    });

    return target as AdviceTarget<T, D>;
}

function _createPropertyAnnotationTarget<T, D extends AnnotationType.PROPERTY>(
    targetFactory: AnnotationTargetFactory,
    target: AnnotationTargetLike<T, D>,
    refGenerator: (d: Mutable<Partial<AdviceTarget>>) => string,
): AnnotationTargetLike<T, D> {
    target = _createAnnotationTarget(target, AnnotationType.PROPERTY, ['proto', 'propertyKey'], refGenerator);

    target.label = `property "${target.proto.constructor.name}.${String(target.propertyKey)}"`;
    Object.defineProperties(target, {
        declaringClass: _declaringClassTargetProperty(targetFactory, target),
        parent: _declaringClassTargetProperty(targetFactory, target),
        parentClass: _parentClassTargetProperty(targetFactory, target),
    });

    assert(target.type === AnnotationType.PROPERTY);

    return target as AdviceTarget<T, D>;
}

function _createParameterAnnotationTarget<T, D extends AnnotationType.PARAMETER>(
    targetFactory: AnnotationTargetFactory,
    target: AnnotationTargetLike<T, D>,
    refGenerator: (d: Mutable<Partial<AdviceTarget>>) => string,
): AnnotationTargetLike<T, D> {
    target = _createAnnotationTarget<T, D>(
        target,
        AnnotationType.PARAMETER,
        ['parameterIndex', 'proto', 'propertyKey'],
        refGenerator,
    );
    target.label = `parameter "${target.proto.constructor.name}.${String(target.propertyKey)}(#${
        target.parameterIndex
    })"`;
    Object.defineProperties(target, {
        declaringClass: _declaringClassTargetProperty(targetFactory, target),
        parent: _declaringMethodTargetProperty(targetFactory, target),
        parentClass: _parentClassTargetProperty(targetFactory, target),
    });

    target.descriptor = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey) as any;

    return target;
}

function _createAnnotationTarget<T, D extends AnnotationType>(
    target: AnnotationTargetLike<T, D>,
    type: AnnotationType,
    requiredProperties: (keyof AdviceTarget<T, D>)[],
    refGenerator: (d: Mutable<Partial<AdviceTarget>>) => string,
): AnnotationTargetLike<T, D> {
    requiredProperties.forEach((n) => assert(!isUndefined(target[n]), `target.${n} is undefined`));

    target = { ...target };

    // delete useleff properties
    Object.keys(target)
        .filter((p) => requiredProperties.indexOf(p as any) < 0)
        .forEach((n: keyof AnnotationTargetLike<T, D>) => delete target[n]);

    target.type = type as any;
    target.ref = target.ref ?? refGenerator(target);

    return target as AdviceTarget<T, D>;
}

type AnnotationTargetLike<T, D extends AnnotationType> = Mutable<Partial<AdviceTarget<T, D>>>;

function _parentClassTargetProperty(
    targetFactory: AnnotationTargetFactory,
    dtarget: Partial<AdviceTarget<any, AnnotationType>>,
): PropertyDescriptor {
    return {
        get() {
            const parentProto = Reflect.getPrototypeOf(dtarget.proto);
            return parentProto === Object.prototype
                ? undefined
                : (targetFactory.of([parentProto]) as ClassAdviceTarget<any>);
        },
    } as PropertyDescriptor;
}

function _declaringClassTargetProperty(
    targetFactory: AnnotationTargetFactory,
    dtarget: Partial<AdviceTarget<any, AnnotationType>>,
): PropertyDescriptor {
    return {
        get() {
            return targetFactory.create({ ...dtarget }, AnnotationType.CLASS);
        },
    } as PropertyDescriptor;
}

function _declaringMethodTargetProperty(
    targetFactory: AnnotationTargetFactory,
    dtarget: Partial<AdviceTarget<any, AnnotationType>>,
): PropertyDescriptor {
    return {
        get() {
            return targetFactory.of([dtarget.proto, dtarget.propertyKey]) as any;
        },
    } as PropertyDescriptor;
}

export interface RuntimeTargetContext<T = unknown> {
    instance: T;
    args?: unknown[];
}
