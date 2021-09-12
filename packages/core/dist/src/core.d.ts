import { AnnotationLocationFactory, AnnotationRegistry, AnnotationTargetFactory, RootAnnotationsBundle, Weaver, AspectsRegistry } from '@aspectjs/core/commons';
/**
 * @public
 */
export declare const WEAVER_CONTEXT: {
    readonly aspects: {
        registry: AspectsRegistry;
    };
    readonly annotations: {
        location: AnnotationLocationFactory;
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
        bundle: RootAnnotationsBundle;
    };
    getWeaver(): Weaver;
};
//# sourceMappingURL=core.d.ts.map