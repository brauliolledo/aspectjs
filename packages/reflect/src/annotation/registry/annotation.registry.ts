import { AnnotationType } from '@aspectjs/common';
import { locator } from '@aspectjs/common/utils';
import { AnnotationContextRegistry } from '../context/annotation-context.registry';
import { AnnotationContext } from '../context/annotation.context';

/**
 * @public
 */
export class AnnotationRegistry {
    constructor(private readonly _annotationContextRegistry: AnnotationContextRegistry) {}

    /**
     * Registers a new annotation by its AnnotationContext,
     * so that it can be picked up by an annotation weaver, or accessed with AnnotationBundle
     * @param context - the annotation context to register
     */
    register<A extends AnnotationType, T = unknown>(context: AnnotationContext<T, A>) {
        const byTargetReg = locator(this._annotationContextRegistry.byTargetClassRef)
            .at(context.target.declaringClass.ref)
            .orElseCompute(() => ({
                byAnnotation: {},
                all: [],
            }));

        [byTargetReg, this._annotationContextRegistry].forEach((reg) => {
            locator(reg.byAnnotation)
                .at(context.ref)
                .orElseCompute(() => [])
                .push(context);
        });

        byTargetReg.all.push(context);
    }
}
