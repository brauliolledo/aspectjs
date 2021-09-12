import { AnnotationLocationFactory, AnnotationRegistry, AnnotationTargetFactory, AspectsRegistry, RootAnnotationsBundle, Weaver, WeaverContext } from '@aspectjs/core/commons';
/**
 * @public
 */
export declare class WeaverContextImpl implements WeaverContext {
    readonly weaver: Weaver;
    private readonly _targetFactory;
    readonly aspects: {
        registry: AspectsRegistry;
    };
    readonly annotations: {
        location: AnnotationLocationFactory;
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
        bundle: RootAnnotationsBundle;
    };
    constructor();
    protected _createWeaver(): Weaver;
    /**
     * Get the global weaver
     */
    getWeaver(): Weaver;
}
//# sourceMappingURL=weaver-context.impl.d.ts.map