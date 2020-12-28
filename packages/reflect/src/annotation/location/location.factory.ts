import { AnnotationType } from '@aspectjs/common';
import { assert, getProto, locator } from '@aspectjs/common/utils';
import { AnnotationContextRegistry } from '../context/annotation-context.registry';
import { AnnotationContext } from '../context/annotation.context';
import {
    AdviceTarget,
    AnnotationTarget,
    ClassAdviceTarget,
    MethodAdviceTarget,
    ParameterAdviceTarget,
    PropertyAdviceTarget,
} from '../target/annotation-target';
import { AnnotationTargetFactory, RuntimeTargetContext } from '../target/annotation-target.factory';
import { AnnotationLocation, ClassAnnotationLocation } from './annotation-location';

/**
 * @public
 */
export class AnnotationLocationFactory {
    private _locationCache = new Map<string, _AnnotationLocationImpl<unknown>>();
    constructor(
        private _targetFactory: AnnotationTargetFactory,
        private _annotationContextRegistry: AnnotationContextRegistry,
    ) {}
    of<T>(obj: { new (...args: any[]): T } | T): ClassAnnotationLocation<T> {
        const proto = getProto(obj);
        if (proto === Object.prototype) {
            throw new TypeError('given object is neither a constructor nor a class instance');
        }

        const runtimeContext: RuntimeTargetContext<T> =
            obj !== proto && obj !== proto.constructor
                ? {
                      instance: obj as T,
                  }
                : undefined;

        const target = this._targetFactory.create({
            proto,
            type: AnnotationType.CLASS,
        }).declaringClass as ClassAdviceTarget<T>;

        const location = this.ofTarget(target);

        return _AnnotationLocationImpl.unwrap(location).bindRuntimeContext(runtimeContext)
            .location as ClassAnnotationLocation;
    }

    ofTarget<T = unknown, A extends AnnotationType = any>(target: AdviceTarget<T, A>): AnnotationLocation<T> {
        const locationImpl = locator(this._locationCache)
            .at(target.ref)
            .orElseCompute(() => {
                return [
                    ...(this._annotationContextRegistry.byTargetClassRef[target.ref]?.all ?? [])
                        .reduce((annotations, annotation) => {
                            // keep one context per target
                            annotations.set(annotation.target.ref, annotation);
                            return annotations;
                        }, new Map<string, AnnotationContext>())
                        .values(),
                ]
                    .map((a) => a.target)
                    .filter((annotationTarget) => ~annotationTarget.type & AnnotationType.CLASS)
                    .reduce(
                        (
                            loc,
                            annotationTarget:
                                | MethodAdviceTarget<T>
                                | ParameterAdviceTarget<T>
                                | PropertyAdviceTarget<T>,
                        ) => {
                            loc.addChildLocation(annotationTarget, this._targetFactory);
                            return loc;
                        },
                        new _AnnotationLocationImpl<T, A>(target, {}),
                    );
            });

        return locationImpl.location;
    }
}

export class _AnnotationLocationImpl<T, A extends AnnotationType = any> {
    constructor(
        public readonly target: AnnotationTarget<T, A>,
        public location: AnnotationLocation<T>,
        private _runtimeContext?: RuntimeTargetContext<T>,
        private _parent?: _AnnotationLocationImpl<T>,
    ) {
        Reflect.defineMetadata('@aspectjs::locationImpl', this, this.location);
    }

    bindRuntimeContext(context: RuntimeTargetContext<T>): this {
        this._runtimeContext = context;
        return this;
    }

    getRuntimeContext(): RuntimeTargetContext<T> {
        const rt = this._runtimeContext ?? this._parent?.getRuntimeContext();

        if (!rt) {
            throw new TypeError('location is not bound to a runtime context');
        }

        return rt;
    }

    isBound(): boolean {
        return !!(this._runtimeContext ?? this._parent?.isBound());
    }

    addChildLocation(
        target: MethodAdviceTarget<T> | PropertyAdviceTarget<T> | ParameterAdviceTarget<T>,
        targetFactory: AnnotationTargetFactory,
    ): void {
        if (target.type & (AnnotationType.METHOD | AnnotationType.PARAMETER)) {
            if ((this.location as any)[target.propertyKey] === undefined) {
                // create location for the method
                (this.location as any)[target.propertyKey] = new _AnnotationLocationImpl(
                    targetFactory.create<T, AnnotationType.METHOD>({
                        ...(target as any),
                        type: AnnotationType.METHOD,
                    }),
                    {},
                    this._runtimeContext,
                    this,
                ).location;
            }

            if ((this.location as any)[target.propertyKey].args === undefined) {
                // create location for all parameters

                (this.location as any)[target.propertyKey].args = new _AnnotationLocationImpl(
                    targetFactory.create<T, AnnotationType.PARAMETER>({
                        ...(target as any),
                        parameterIndex: NaN,
                    }),
                    [] as AnnotationLocation<T>,
                    this._runtimeContext,
                    this,
                ).location;
            }

            // if target is one parameter
            if (target.type & AnnotationType.PARAMETER) {
                // create location for the given parameter

                if ((this.location as any)[target.propertyKey].args[target.parameterIndex] === undefined) {
                    (this.location as any)[target.propertyKey].args[
                        target.parameterIndex
                    ] = new _AnnotationLocationImpl(target, {}, this._runtimeContext, this).location;
                }
            }
        } else {
            // if target is a property
            if ((this.location as any)[target.propertyKey] === undefined) {
                assert(target.type === AnnotationType.PROPERTY);
                (this.location as any)[target.propertyKey] = new _AnnotationLocationImpl(
                    targetFactory.create<T, AnnotationType.PROPERTY>({
                        ...(target as any),
                        type: AnnotationType.METHOD,
                    }),
                    {},
                    this._runtimeContext,
                    this,
                ).location;
            }
        }
    }

    static unwrap<T, A extends AnnotationType>(location: AnnotationLocation<T, A>): _AnnotationLocationImpl<T, A> {
        assert(location !== undefined);

        if (location instanceof _AnnotationLocationImpl) {
            return location;
        }
        const impl = Reflect.getOwnMetadata('@aspectjs::locationImpl', location);
        assert(!!impl);

        return impl;
    }
}
