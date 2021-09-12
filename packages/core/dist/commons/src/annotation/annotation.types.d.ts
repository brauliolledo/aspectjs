/**
 * @public
 */
export declare enum AnnotationType {
    CLASS = "AnnotationType.CLASS",
    PROPERTY = "AnnotationType.PROPERTY",
    METHOD = "AnnotationType.METHOD",
    PARAMETER = "AnnotationType.PARAMETER"
}
/**
 * @public
 */
export declare class AnnotationRef {
    readonly ref: string;
    readonly name: string;
    readonly groupId: string;
    constructor(ref: string);
    constructor(groupId: string, name: string);
    toString(): string;
}
/**
 * @public
 */
export declare type AnnotationStub<T extends Decorator> = (...args: any[]) => T & {
    name: string;
};
/**
 * An Annotation is an EcmaScript decorator with no behavior.
 * It relies on an aspect weaver configured with proper aspects to get things done.
 * @public
 */
export declare type Annotation<T extends AnnotationType = any> = (T extends AnnotationType.CLASS ? ClassAnnotation : T extends AnnotationType.METHOD ? MethodAnnotation : T extends AnnotationType.PARAMETER ? ParameterAnnotation : T extends AnnotationType.PROPERTY ? PropertyAnnotation : never) & // eslint-disable-next-line @typescript-eslint/ban-types
Function & AnnotationRef;
/**
 * @public
 */
export declare type Decorator<TFunction extends Function = any, T = any> = (target: TFunction | Object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<T> | number) => TFunction | void | TypedPropertyDescriptor<T>;
/**
 * @public
 */
export declare type ClassAnnotation = AnnotationStub<ClassDecorator> & AnnotationRef;
/**
 * @public
 */
export declare type MethodAnnotation = AnnotationStub<MethodDecorator> & AnnotationRef;
/**
 * @public
 */
export declare type ParameterAnnotation = AnnotationStub<ParameterDecorator> & AnnotationRef;
/**
 * @public
 */
export declare type PropertyAnnotation = AnnotationStub<PropertyDecorator> & AnnotationRef;
/**
 * @public
 */
export declare type ClassAnnotationStub = AnnotationStub<ClassDecorator>;
/**
 * @public
 */
export declare type MethodAnnotationStub = AnnotationStub<MethodDecorator>;
/**
 * @public
 */
export declare type PropertyAnnotationStub = AnnotationStub<PropertyDecorator>;
/**
 * @public
 */
export declare type ParameterAnnotationStub = AnnotationStub<ParameterDecorator>;
//# sourceMappingURL=annotation.types.d.ts.map