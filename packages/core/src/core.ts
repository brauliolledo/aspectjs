import {
    AnnotationLocationFactory,
    AnnotationRegistry,
    AnnotationTargetFactory,
    _getWeaverContext,
    RootAnnotationsBundle,
    _setWeaverContext,
    Weaver,
    AspectsRegistry,
    AnnotationTarget,
    AnnotationType,
    AspectType,
    Annotation,
    AnnotationContext,
    AnnotationLocation,
    AnnotationRef,
    AnnotationsBundle,
    ClassAnnotationLocation,
    ClassAnnotationsBundle,
    MethodAnnotationLocation,
    MethodAnnotationsBundle,
    ParameterAnnotationsBundle,
    ParametersAnnotationLocation,
    PropertyAnnotationLocation,
    PropertyAnnotationsBundle,
} from '@aspectjs/core/commons';
import { WeaverContextImpl } from './weaver/weaver-context.impl';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
let _AspectsRegistry: AspectsRegistry;
AnnotationLocationFactory;
AnnotationRegistry;
AnnotationTargetFactory;
RootAnnotationsBundle;

_setWeaverContext(new WeaverContextImpl());

export const WEAVER = new (class implements Weaver {
    enable(...aspects: AspectType[]): this {
        _getWeaverContext()
            .getWeaver()
            .enable(...aspects);
        return this;
    }
    disable(...aspects: (string | AspectType)[]): this {
        _getWeaverContext()
            .getWeaver()
            .disable(...aspects);
        return this;
    }
    enhance<T>(target: AnnotationTarget<T, AnnotationType>): void | Function | PropertyDescriptor {
        return _getWeaverContext().getWeaver().enhance(target);
    }
    setEnabled(aspect: AspectType, enabled: boolean): this {
        _getWeaverContext().getWeaver().setEnabled(aspect, enabled);
        return this;
    }
    getAspect<T extends AspectType>(aspect: string | (new () => T)): T {
        return _getWeaverContext().getWeaver().getAspect(aspect);
    }
    getAspects(): AspectType[] {
        return _getWeaverContext().getWeaver().getAspects();
    }
    [Symbol.iterator](): Iterator<AspectType, any, undefined> {
        return _getWeaverContext().getWeaver()[Symbol.iterator]();
    }
})();

export const ANNOTATIONS = new (class implements Omit<RootAnnotationsBundle, '_registry'> {
    at<T>(location: MethodAnnotationLocation<T>, searchParents?: boolean): MethodAnnotationsBundle<T>;
    at<T>(location: ParametersAnnotationLocation<T>, searchParents?: boolean): ParameterAnnotationsBundle<T>;
    at<T>(location: PropertyAnnotationLocation<T>, searchParents?: boolean): PropertyAnnotationsBundle<T>;
    at<T>(location: ClassAnnotationLocation<T>, searchParents?: boolean): ClassAnnotationsBundle<T>;
    at<T>(location: AnnotationLocation<T>, searchParents?: boolean): AnnotationsBundle<T>;
    at<T>(location: AnnotationLocation<T>, searchParents = true): AnnotationsBundle<T> {
        return _getWeaverContext().annotations.bundle.at(location, searchParents);
    }

    all(...annotations: (Annotation | string | AnnotationRef)[]): readonly AnnotationContext[] {
        return _getWeaverContext().annotations.bundle.all(...annotations);
    }
})();

export const LOCATION = new (class implements Omit<AnnotationLocationFactory, '_targerFactory'> {
    of<T>(obj: T | (new () => T)): ClassAnnotationLocation<T> {
        return _getWeaverContext().annotations.location.of(obj);
    }
})();
