import { AnnotationType } from '@aspectjs/common';

/**
 * @public
 */
export interface AnnotationTarget<T = unknown, A extends AnnotationType = AnnotationType> {
    readonly type: A;
    readonly proto: Record<string, any> & { constructor: new (...args: any[]) => any };
    readonly name: string;
    readonly label: string;
    readonly ref: string;

    readonly propertyKey: A extends AnnotationType.PROPERTY | AnnotationType.METHOD | AnnotationType.PARAMETER
        ? string
        : never;
    readonly descriptor: A extends AnnotationType.METHOD ? TypedPropertyDescriptor<T> : never;
    readonly parameterIndex: A extends AnnotationType.PARAMETER ? number : never;
    readonly parent: A extends AnnotationType.METHOD
        ? AnnotationTarget<any, AnnotationType.CLASS>
        : A extends AnnotationType.PROPERTY
        ? AnnotationTarget<any, AnnotationType.CLASS>
        : A extends AnnotationType.PARAMETER
        ? AnnotationTarget<any, AnnotationType.METHOD>
        : ClassAdviceTarget<any>;
    readonly declaringClass: ClassAdviceTarget<T>;
    readonly parentClass: ClassAdviceTarget<T>;
}
/**
 * @public
 */
export type AdviceTarget<T = unknown, A extends AnnotationType = any> = AnnotationTarget<T, A>;

/**
 * @public
 */
export interface ClassAdviceTarget<T> extends AdviceTarget<T, AnnotationType.CLASS> {
    readonly parent: ClassAdviceTarget<any>;
}

/**
 * @public
 */
export interface PropertyAdviceTarget<T> extends AdviceTarget<T, AnnotationType.PROPERTY> {
    readonly propertyKey: string;
    readonly parent: ClassAdviceTarget<T>;
}

/**
 * @public
 */
export interface MethodAdviceTarget<T> extends AdviceTarget<T, AnnotationType.METHOD> {
    readonly descriptor: TypedPropertyDescriptor<T>;
    readonly parent: ClassAdviceTarget<T>;
}

/**
 * @public
 */
export interface ParameterAdviceTarget<T> extends AdviceTarget<T, AnnotationType.PARAMETER> {
    readonly propertyKey: string;
    readonly parameterIndex: number;
    readonly parent: MethodAdviceTarget<T>;
}
