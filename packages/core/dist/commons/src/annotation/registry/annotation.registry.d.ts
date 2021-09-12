import { AnnotationType } from '../annotation.types';
import { AnnotationBundleRegistry } from '../bundle/bundle';
import { AnnotationContext } from '../context/annotation.context';
/**
 * @public
 */
export declare class AnnotationRegistry {
    private readonly _bundleRegistry;
    constructor(_bundleRegistry: AnnotationBundleRegistry);
    /**
     * Registers a new annotation by its AnnotationContext,
     * so that it can be picked up wy an annotation weaver, or used through AnnotationBundle
     * @param context - the annotation context to register
     */
    register<A extends AnnotationType, T = unknown>(context: AnnotationContext<T, A>): void;
}
//# sourceMappingURL=annotation.registry.d.ts.map