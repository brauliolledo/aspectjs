import { AnnotationContext } from '../context/annotation-context';
import { Annotation, AnnotationType } from '../annotation.types';
import { AdviceLocation } from '../../advice/target/advice-target';

export interface AnnotationsBundle<T> extends AnnotationContextSelector<T, AnnotationType> {
    at<A extends AnnotationType>(location: AdviceLocation<T, A>): AnnotationContextSelector<T, A>;
    all<A extends AnnotationType>(annotation?: Annotation<A>): readonly AnnotationContext<T, A>[];
    class<A extends AnnotationType>(annotation?: Annotation<A>): readonly AnnotationContext<T, A>[];
    properties<A extends AnnotationType>(annotation?: Annotation<A>): readonly AnnotationContext<T, A>[];
    methods<A extends AnnotationType>(annotation?: Annotation<A>): readonly AnnotationContext<T, A>[];
    parameters<A extends AnnotationType>(annotation?: Annotation<A>): readonly AnnotationContext<T, A>[];
}

export interface AnnotationContextSelector<T, A extends AnnotationType> {
    all(annotation?: Annotation<A> | string): readonly AnnotationContext<T, A>[];
}
