import { AnnotationType, Annotation, AnnotationRef } from '../annotation.types';
import { AnnotationContext, ValuedAnnotationContext } from '../context/annotation.context';
import { AnnotationTarget } from '../target/annotation-target';
import { ClassAnnotationsBundle, AnnotationsBundle } from './bundle';

export type AnnotationContextResolver<T = unknown> = (c: AnnotationContext<T>) => ValuedAnnotationContext<T>;
export class ResolvableAnnotation<T = unknown> extends ClassAnnotationsBundle<T> {
    constructor(annotationBundle: AnnotationsBundle, private _resolveContext: AnnotationContextResolver<T>) {
        super(registry, location, searchParents);
    }

    protected _findAnnotationContexts(
        target: AnnotationTarget,
        filter: keyof Filters[AnnotationType],
        annotations: (Annotation | string | AnnotationRef)[],
    ): AnnotationContext<T>[] {
        return super._findAnnotationContexts(target, filter, annotations).map((c) => this._resolveContext(c));
    }
}
