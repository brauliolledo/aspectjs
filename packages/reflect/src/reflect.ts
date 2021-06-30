import { AnnotationRef, AnnotationStub, AnnotationType } from '@aspectjs/common';
import {
    ClassAnnotationsBundle,
    MethodAnnotationsBundle,
    ParameterAnnotationsBundle,
    PropertyAnnotationsBundle,
    RootAnnotationsBundle,
} from './annotation/bundle/bundle';
import { AnnotationContext } from './annotation/context/annotation.context';
import {
    ClassAnnotationLocation,
    MethodAnnotationLocation,
    ParametersAnnotationLocation,
    PropertyAnnotationLocation,
} from './annotation/location/annotation-location';
import { AnnotationLocationFactory } from './annotation/location/location.factory';
import { AdviceTarget } from './annotation/target/annotation-target';
import { ReflectContextImpl } from './context/reflect-context.impl';
import { _getReflectContext, _setReflectContext } from './context/reflect.context';

export * from './annotation/bundle/bundle';
export * from './annotation/context/annotation-context.registry';
export * from './annotation/context/annotation.context';
export * from './annotation/location/annotation-location';
export * from './annotation/location/location.factory';
export * from './annotation/registry/annotation.registry';
export * from './annotation/target/annotation-target';
export * from './annotation/target/annotation-target.factory';
export * from './context/reflect-context.impl';
export * from './context/reflect.context';

export const ANNOTATIONS = new (class implements Pick<RootAnnotationsBundle, 'at' | 'all'> {
    at<T>(location: MethodAnnotationLocation<T, unknown>, searchParents?: boolean): MethodAnnotationsBundle<T>;
    at<T>(location: ParametersAnnotationLocation<T>, searchParents?: boolean): ParameterAnnotationsBundle<T>;
    at<T>(location: PropertyAnnotationLocation<T, unknown>, searchParents?: boolean): PropertyAnnotationsBundle<T>;
    at<T>(location: ClassAnnotationLocation<T>, searchParents?: boolean): ClassAnnotationsBundle<T>;
    at<T>(
        location:
            | ParametersAnnotationLocation<T>
            | PropertyAnnotationLocation<unknown, unknown>
            | MethodAnnotationLocation<unknown, unknown>
            | ClassAnnotationLocation<T>,
        searchParents?: boolean,
    ):
        | ClassAnnotationsBundle<T>
        | MethodAnnotationsBundle<T>
        | ParameterAnnotationsBundle<T>
        | PropertyAnnotationsBundle<T> {
        return _getReflectContext().annotations.bundle.at(location, searchParents);
    }
    all(
        ...annotations: (
            | string
            | AnnotationRef
            | (AnnotationStub<ClassDecorator> & AnnotationRef & Function)
            | (AnnotationStub<MethodDecorator> & AnnotationRef & Function)
            | (AnnotationStub<ParameterDecorator> & AnnotationRef & Function)
            | (AnnotationStub<PropertyDecorator> & AnnotationRef & Function)
        )[]
    ): readonly AnnotationContext<unknown, any>[] {
        return _getReflectContext().annotations.bundle.all(...annotations);
    }
})();

export const LOCATION = new (class implements Pick<AnnotationLocationFactory, 'of' | 'ofTarget'> {
    of<T>(obj: T | (new (...args: any[]) => T)): ClassAnnotationLocation<T> {
        return _getReflectContext().annotations.location.of(obj);
    }
    ofTarget<T = unknown, A extends AnnotationType = any>(
        target: AdviceTarget<T, A>,
    ):
        | ParametersAnnotationLocation<T>
        | PropertyAnnotationLocation<unknown, unknown>
        | MethodAnnotationLocation<unknown, unknown>
        | ClassAnnotationLocation<T> {
        return _getReflectContext().annotations.location.ofTarget(target);
    }
})();
_setReflectContext(_getReflectContext() ?? new ReflectContextImpl());

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
RootAnnotationsBundle;
AnnotationLocationFactory;
