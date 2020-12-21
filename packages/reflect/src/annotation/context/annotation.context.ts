import { AdviceTarget } from '../target/annotation-target';
import { AnnotationRef, AnnotationType } from '@aspectjs/common';

/**
 * @public
 */
export abstract class AnnotationContext<T = unknown, A extends AnnotationType = any> extends AnnotationRef {
    readonly args: any[];
    readonly target: AdviceTarget<T, A>;
    readonly ref: string;
    readonly name: string;
    readonly groupId: string;
}

export class _AnnotationContextImpl<T = unknown, A extends AnnotationType = any> extends AnnotationContext<T, A> {
    constructor(
        public readonly target: AdviceTarget<T, A>,
        public readonly args: any[],
        private readonly _annotation: AnnotationRef,
    ) {
        super(_annotation.groupId, _annotation.name);
    }

    get value(): any {
        throw new TypeError('annotation is not bound to a value');
    }

    withValue<V>(valueProvider: () => V): ValuedAnnotationContext<T, A, V> {
        return new ValuedAnnotationContext<T, A, V>(this, this._annotation, valueProvider);
    }
}

/**
 * @public
 */
export class ValuedAnnotationContext<
    T = unknown,
    A extends AnnotationType = any,
    V = unknown
> extends _AnnotationContextImpl<T, A> {
    constructor(
        annotationContext: _AnnotationContextImpl<T, A>,
        annotation: AnnotationRef,
        private readonly _valueProvider: () => V,
    ) {
        super(annotationContext.target, annotationContext.args, annotation);
    }

    get value(): V {
        return this._valueProvider();
    }
}
