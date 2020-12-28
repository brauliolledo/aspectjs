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

export type AnnotationBootstrapModule<A extends AnnotationType = any, S extends Annotation<AnnotationType> = any> = {
    decorator: (annotation: Annotation<A>, annotationStub: S, annotationArgs: any[]) => Decorator | void;
    order: number;
    name: string;
};

/**
 * Factory to create some {@link Annotation}.
 * @public
 */
export class AnnotationFactory {
    private readonly _groupId: string;

    private static readonly _bootstrapConfigs: Map<string, AnnotationBootstrapModule> = new Map([
        [
            '@aspectjs::annotationStub',
            {
                name: '@aspectjs::annotationStub',
                order: 0,
                decorator: (_annotation, annotationStub, annotationArgs) => {
                    return annotationStub(...annotationArgs);
                },
            },
        ],
    ]);

    static addBootstrapModule(bootstrapConfig: AnnotationBootstrapModule) {
        assert(!!bootstrapConfig.name);
        AnnotationFactory._bootstrapConfigs.set(bootstrapConfig.name, bootstrapConfig);
    }
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
        const _factory = this;

        // create the annotation (ie: decorator factory)
        const annotation = _createAnnotation(
            name as string,
            groupId,
            annotationStub,
            function (...annotationArgs: any[]): Decorator {
                return _factory._createBootstrapDecorator(annotation as any, annotationStub, annotationArgs);
            },
        );

        return annotation;
    }

    _createBootstrapDecorator<A extends AnnotationType, S extends Annotation<AnnotationType>>(
        annotation: Annotation<A>,
        annotationStub: S,
        annotationArgs: any[],
    ): Decorator {
        return function (...targetArgs: any[]): Function | PropertyDescriptor | void {
            return [...AnnotationFactory._bootstrapConfigs.values()]
                .sort((c1, c2) => c1.order - c2.order)
                .reduce((decoree, { name, decorator }) => {
                    try {
                        decoree =
                            decorator
                                .apply(this, [annotation, annotationStub, annotationArgs])
                                ?.apply(this, targetArgs) ?? decoree;
                        return decoree;
                    } catch (e) {
                        console.error(`Error applying bootstrap decorator ${name}: ${(e as Error).message}`);
                        throw e;
                    }
                }, noopDecorator.apply(this, targetArgs));
        };
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
