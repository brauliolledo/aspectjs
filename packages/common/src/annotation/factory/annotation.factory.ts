import { assert, isFunction } from '@aspectjs/common/utils';
import {
    Annotation,
    AnnotationRef,
    AnnotationType,
    ClassAnnotationStub,
    Decorator,
    MethodAnnotationStub,
    ParameterAnnotationStub,
    PropertyAnnotationStub,
} from '../annotation.types';

let generatedId = 0;

export type BootstrapDecoratorFactory = <A extends AnnotationType, S extends Annotation<AnnotationType>>(
    annotation: Annotation<A>,
    annotationStub: S,
    annotationArgs: any[],
) => Decorator | void;

/**
 * Factory to create some {@link Annotation}.
 * @public
 */
export class AnnotationFactory {
    private readonly _groupId: string;

    public static readonly bootstrapDecorators: Map<string, BootstrapDecoratorFactory> = new Map([
        [
            '@aspectjs::annotationStub',
            (_annotation, annotationStub, annotationArgs) => {
                return annotationStub(...annotationArgs);
            },
        ],
    ]);
    constructor(groupId: string) {
        this._groupId = groupId;
    }

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

    create<A extends Annotation<AnnotationType>>(name?: string | A, annotationStub?: A): A & AnnotationRef {
        const groupId = this._groupId;

        if (isFunction(name)) {
            annotationStub = name as A;
            name = annotationStub.name;
        }
        if (!annotationStub) {
            annotationStub = function () {} as any;
        }
        if (!name) {
            name = `anonymousAnnotation#${generatedId++}`;
        }
        // create the annotation (ie: decorator provider)
        const annotation = _createAnnotation(
            name as string,
            groupId,
            annotationStub,
            function (...annotationArgs: any[]): Decorator {
                return _createBootstrapDecorator(annotation as any, annotationStub, annotationArgs);
            },
        );

        return annotation;
    }
}

function _createAnnotation<A extends Annotation<AnnotationType>, D extends Decorator>(
    name: string,
    groupId: string,
    annotationStub: A,
    fn: Function & D,
): A {
    assert(typeof fn === 'function');

    // ensure annotation has a name.
    annotationStub = annotationStub ?? (function () {} as A);

    const annotationRef = new AnnotationRef(groupId, name);
    const annotation = (fn as any) as AnnotationRef & A;
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationStub));
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationRef));
    assert(Object.getOwnPropertySymbols(annotation).indexOf(Symbol.toPrimitive) >= 0);

    return annotation;
}

function _createBootstrapDecorator<A extends AnnotationType, S extends Annotation<AnnotationType>>(
    annotation: Annotation<A>,
    annotationStub: S,
    annotationArgs: any[],
): Decorator {
    return function (...targetArgs: any[]): Function | PropertyDescriptor | void {
        return [...AnnotationFactory.bootstrapDecorators.entries()].reduce((decoree, [name, decorator]) => {
            try {
                decoree =
                    decorator.apply(this, [annotation, annotationStub, annotationArgs])?.apply(this, targetArgs) ??
                    decoree;
                return decoree;
            } catch (e) {
                (e as Error).message = `Error applying bootstrap decorator ${name}: ${(e as Error).message}`;
                throw e;
            }
        }, noopDecorator.apply(this, targetArgs));

        // TODO move into bootstrapDecorators
        // // assert the weaver is loaded before invoking the underlying decorator
        // const weaverContext = _getWeaverContext();
        // if (!weaverContext) {
        //     throw new Error(
        //         `Cannot invoke annotation ${annotation.name ?? ''} before "setWeaverContext()" has been called`,
        //     );
        // }
        // const target = _getWeaverContext().annotations.targetFactory.of(targetArgs);
        // const annotationContext = new _AnnotationContextImpl(target, annotationArgs, annotation);
        // weaverContext.annotations.registry.register(annotationContext);
        // const enhanced = weaverContext.getWeaver().enhance(target);
        // if (target.type === AnnotationType.CLASS) {
        //     Object.defineProperties(enhanced, Object.getOwnPropertyDescriptors(targetArgs[0]));
        // }
        // return enhanced;
    };
}

const noopDecorator: Decorator = <TFunction extends Function>(
    target: TFunction,
    propertyKey: string | symbol,
    parameterIndex: number,
): unknown => {
    if (propertyKey !== undefined) {
        return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), propertyKey);
    }

    return target;
};
