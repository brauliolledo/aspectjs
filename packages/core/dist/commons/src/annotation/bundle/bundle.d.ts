import { Annotation, AnnotationRef, AnnotationType } from '../annotation.types';
import { AnnotationContext } from '../context/annotation.context';
import { AnnotationLocation, ClassAnnotationLocation, MethodAnnotationLocation, ParametersAnnotationLocation, PropertyAnnotationLocation } from '../location/annotation-location';
/**
 * @public
 */
export declare type AnnotationBundleRegistry<T = unknown, A extends AnnotationType = any> = {
    byTargetClassRef: {
        [classTargetRef: string]: {
            byAnnotation: {
                [annotationRef: string]: AnnotationContext[];
            };
            all: AnnotationContext[];
        };
    };
    byAnnotation: {
        [annotationRef: string]: AnnotationContext[];
    };
};
/**
 * @public
 */
export declare type AnnotationsBundle<T = unknown> = ClassAnnotationsBundle<T> | MethodAnnotationsBundle<T> | ParameterAnnotationsBundle<T> | PropertyAnnotationsBundle<T>;
/**
 * @public
 */
export interface PropertyAnnotationsBundle<T = unknown> {
    all(...annotation: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<unknown, AnnotationType.PROPERTY>[];
    onProperty(...annotation: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PROPERTY>[];
    onSelf(...annotation: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PROPERTY>[];
}
/**
 * @public
 */
export interface MethodAnnotationsBundle<T = unknown> {
    all(...annotation: (Annotation<AnnotationType.METHOD | AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD | AnnotationType.PARAMETER>[];
    onParameter(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    onMethod(...annotation: (Annotation<AnnotationType.METHOD> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD | AnnotationType.PARAMETER>[];
    onSelf(...annotation: (Annotation<AnnotationType.METHOD> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD | AnnotationType.PARAMETER>[];
}
/**
 * @public
 */
export interface ParameterAnnotationsBundle<T = unknown> {
    all(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    onSelf(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    onParameter(...annotation: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
}
/**
 * @public
 */
export declare class RootAnnotationsBundle {
    protected _registry: AnnotationBundleRegistry;
    constructor(_registry: AnnotationBundleRegistry);
    at<T>(location: MethodAnnotationLocation<T>, searchParents?: boolean): MethodAnnotationsBundle<T>;
    at<T>(location: ParametersAnnotationLocation<T>, searchParents?: boolean): ParameterAnnotationsBundle<T>;
    at<T>(location: PropertyAnnotationLocation<T>, searchParents?: boolean): PropertyAnnotationsBundle<T>;
    at<T>(location: ClassAnnotationLocation<T>, searchParents?: boolean): ClassAnnotationsBundle<T>;
    at<T>(location: AnnotationLocation<T>, searchParents?: boolean): AnnotationsBundle<T>;
    all(...annotations: (Annotation | string | AnnotationRef)[]): readonly AnnotationContext[];
}
/**
 * @public
 */
export declare class ClassAnnotationsBundle<T = unknown> extends RootAnnotationsBundle {
    private searchParents;
    private _target;
    constructor(registry: AnnotationBundleRegistry, location: AnnotationLocation, searchParents: boolean);
    all(...annotations: (Annotation | string | AnnotationRef)[]): readonly AnnotationContext<T>[];
    onClass(...annotations: (Annotation<AnnotationType.CLASS> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.CLASS>[];
    onSelf(...annotations: (Annotation<AnnotationType.CLASS> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.CLASS>[];
    onProperty(...annotations: (Annotation<AnnotationType.PROPERTY> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PROPERTY>[];
    onMethod(...annotations: (Annotation<AnnotationType.METHOD> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.METHOD>[];
    onParameter(...annotations: (Annotation<AnnotationType.PARAMETER> | string | AnnotationRef)[]): readonly AnnotationContext<T, AnnotationType.PARAMETER>[];
    private _allWithFilter;
}
//# sourceMappingURL=bundle.d.ts.map