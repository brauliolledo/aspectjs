import { RootAnnotationsBundle, AnnotationRegistry, AnnotationTargetFactory, AnnotationLocationFactory } from '@aspectjs/core/commons';
import { AspectsRegistryImpl } from '../aspect/aspect.registry.impl.js';
import { JitWeaver } from './jit/jit-weaver.js';

const bundleRegistry = {
    byTargetClassRef: {},
    byAnnotation: {},
};
const bundle = new RootAnnotationsBundle(bundleRegistry);
const annotationRegistry = new AnnotationRegistry(bundleRegistry);
/**
 * @public
 */
class WeaverContextImpl {
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

export { WeaverContextImpl };
//# sourceMappingURL=weaver-context.impl.js.map
