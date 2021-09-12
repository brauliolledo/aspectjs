import { AnnotationRef, ClassAnnotationStub, MethodAnnotationStub, ParameterAnnotationStub, PropertyAnnotationStub } from '../annotation.types';
/**
 * Factory to create some {@link Annotation}.
 * @public
 */
export declare class AnnotationFactory {
    private readonly _groupId;
    constructor(groupId: string);
    /**
     * Create a ClassAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends ClassAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a MethodAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends MethodAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a PropertyAnnotationStub.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends PropertyAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a ParameterAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    /**
     * Create a ParameterAnnotation.
     *
     * @param name - The annotation name.
     * @param annotationStub - The annotation signature.
     */
    create<A extends ParameterAnnotationStub>(name: string, annotationStub?: A): A & AnnotationRef;
    /**
     * Create a ClassAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends ClassAnnotationStub>(annotationStub?: A): A & AnnotationRef;
    /**
     * Create a MethodAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends MethodAnnotationStub>(annotationStub?: A): A & AnnotationRef;
    /**
     * Create a PropertyAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends PropertyAnnotationStub>(annotationStub?: A): A & AnnotationRef;
    /**
     * Create a ParameterAnnotation.
     *
     * @param annotationStub - The annotation signature.
     */
    create<A extends ParameterAnnotationStub>(annotationStub?: A): A & AnnotationRef;
}
//# sourceMappingURL=annotation.factory.d.ts.map