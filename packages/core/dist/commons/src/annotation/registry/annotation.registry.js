import { locator } from '@aspectjs/core/utils';
/**
 * @public
 */
export class AnnotationRegistry {
    constructor(_bundleRegistry) {
        this._bundleRegistry = _bundleRegistry;
    }
    /**
     * Registers a new annotation by its AnnotationContext,
     * so that it can be picked up wy an annotation weaver, or used through AnnotationBundle
     * @param context - the annotation context to register
     */
    register(context) {
        const byTargetReg = locator(this._bundleRegistry.byTargetClassRef)
            .at(context.target.declaringClass.ref)
            .orElseCompute(() => ({
            byAnnotation: {},
            all: [],
        }));
        [byTargetReg, this._bundleRegistry].forEach((reg) => {
            locator(reg.byAnnotation)
                .at(context.ref)
                .orElseCompute(() => [])
                .push(context);
        });
        byTargetReg.all.push(context);
    }
}
//# sourceMappingURL=annotation.registry.js.map