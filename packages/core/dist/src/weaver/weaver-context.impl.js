import { AnnotationLocationFactory, AnnotationRegistry, AnnotationTargetFactory, RootAnnotationsBundle, } from '@aspectjs/core/commons';
import { AspectsRegistryImpl } from '../aspect/aspect.registry.impl';
import { JitWeaver } from './jit/jit-weaver';
const bundleRegistry = {
    byTargetClassRef: {},
    byAnnotation: {},
};
const bundle = new RootAnnotationsBundle(bundleRegistry);
const annotationRegistry = new AnnotationRegistry(bundleRegistry);
/**
 * @public
 */
export class WeaverContextImpl {
    constructor() {
        this._targetFactory = new AnnotationTargetFactory();
        this.annotations = {
            location: new AnnotationLocationFactory(this._targetFactory),
            registry: annotationRegistry,
            targetFactory: this._targetFactory,
            bundle,
        };
        this.aspects = {
            registry: new AspectsRegistryImpl(this),
        };
        this.weaver = this._createWeaver();
    }
    _createWeaver() {
        return new JitWeaver(this);
    }
    /**
     * Get the global weaver
     */
    getWeaver() {
        return this.weaver;
    }
}
//# sourceMappingURL=weaver-context.impl.js.map