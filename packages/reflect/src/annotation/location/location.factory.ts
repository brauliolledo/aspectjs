import { AnnotationType } from '@aspectjs/common';
import { assert, getProto, locator } from '@aspectjs/common/utils';
import { AnnotationContextRegistry } from '../context/annotation-context.registry';
import { AnnotationTarget, ClassAdviceTarget } from '../target/annotation-target';
import { AnnotationTargetFactory, RuntimeTargetContext } from '../target/annotation-target.factory';
import { AnnotationLocation, ClassAnnotationLocation } from './annotation-location';

/**
 * @public
 */
export class AnnotationLocationFactory {
    private _locationCache = new Map<string, _AnnotationLocationImpl<any>>();
    constructor(
        private _targetFactory: AnnotationTargetFactory,
        private _annotationContextRegistry: AnnotationContextRegistry,
    ) {}

    of<T>(obj: { new (...args: any[]): T } | T): ClassAnnotationLocation<T> {
        const proto = getProto(obj);
        if (proto === Object.prototype) {
            throw new TypeError('given object is neither a constructor nor a class instance');
        }

        const target = this._targetFactory.create({
            proto,
            type: AnnotationType.CLASS,
        }).declaringClass as ClassAdviceTarget<T>;

        const annotations = this._annotationContextRegistry.byTargetClassRef[target.ref]?.all ?? [];
        const runtimeContext: RuntimeTargetContext<T> =
            obj !== proto && obj !== proto.constructor
                ? {
                      instance: obj as T,
                  }
                : undefined;

        const locationImpl = locator(this._locationCache)
            .at(target.ref)
            .orElseCompute(() => {
                return annotations.reduce((loc, annotation) => {
                    const annotationTarget = annotation.target;
                    if (~annotationTarget.type & AnnotationType.CLASS) {
                        if (annotationTarget.type & (AnnotationType.METHOD | AnnotationType.PARAMETER)) {
                            // create location for the method
                            const methodAnnotationTarget = this._targetFactory.create({
                                ...(annotationTarget as any),
                                type: AnnotationType.METHOD,
                            });

                            (loc.location as any)[methodAnnotationTarget.propertyKey] =
                                (loc.location as any)[methodAnnotationTarget.propertyKey] ??
                                new _AnnotationLocationImpl(methodAnnotationTarget, {}, runtimeContext).location;

                            // create location for all parameters
                            const allParamsAnnotationTarget = this._targetFactory.create({
                                ...annotationTarget,
                                parameterIndex: NaN,
                            });
                            (loc.location as any)[annotationTarget.propertyKey].args =
                                (loc.location as any)[annotationTarget.propertyKey].args ??
                                new _AnnotationLocationImpl(allParamsAnnotationTarget, [], runtimeContext).location;

                            // if target is one parameter
                            if (annotationTarget.type & AnnotationType.PARAMETER) {
                                // create location for the given parameter

                                (loc.location as any)[annotationTarget.propertyKey].args[
                                    annotationTarget.parameterIndex
                                ] = new _AnnotationLocationImpl(annotationTarget, {}, runtimeContext).location;
                            }
                        } else {
                            // if target is a property
                            assert(annotationTarget.type === AnnotationType.PROPERTY);
                            const propertyAnnotationTarget = this._targetFactory.create({
                                ...(annotationTarget as any),
                                type: AnnotationType.METHOD,
                            });

                            (loc.location as any)[propertyAnnotationTarget.propertyKey] =
                                (loc.location as any)[propertyAnnotationTarget.propertyKey] ??
                                new _AnnotationLocationImpl(propertyAnnotationTarget, {}, runtimeContext).location;
                        }
                    }
                    return loc;
                }, new _AnnotationLocationImpl<T, AnnotationType.CLASS>(target, {}, runtimeContext));
            });
        return locationImpl.location as ClassAnnotationLocation;
    }
}

export class _AnnotationLocationImpl<T, A extends AnnotationType = any> {
    constructor(
        public readonly target: AnnotationTarget<T, A>,
        public location: AnnotationLocation<T>,
        private _runtimeContext?: RuntimeTargetContext<T>,
    ) {
        Reflect.defineMetadata('@aspectjs::locationImpl', this, this.location);
    }

    bindRuntimeContext(context: RuntimeTargetContext<T>): this {
        this._runtimeContext = context;
        return this;
    }

    getRuntimeContext(): RuntimeTargetContext<T> {
        if (!this.isBound()) {
            throw new TypeError('location is not bound to a runtime context');
        }
        return this._runtimeContext;
    }

    isBound(): boolean {
        return !!this._runtimeContext;
    }

    static unwrap<T, A extends AnnotationType>(location: AnnotationLocation<T, A>): _AnnotationLocationImpl<T, A> {
        assert(!!location);

        const impl = Reflect.getOwnMetadata('@aspectjs::locationImpl', location);
        assert(!!impl);

        return impl;
    }
}
