import { Weaver } from '@aspectjs/core/src/weaver/weaver';
import { AnnotationRegistry } from '../annotation/registry/annotation.registry';
import { AnnotationTargetFactory } from '../annotation/target/annotation-target.factory';
import { AspectsRegistry } from '../aspect';

/**
 * @public
 */
export interface WeaverContext {
    readonly aspects: {
        registry: AspectsRegistry;
    };
    readonly annotations: {
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
    };

    /**
     * Get the global weaver
     */
    getWeaver(): Weaver;
}

let _weaverContext: WeaverContext;

/**
 * @internal
 */
export function _getWeaverContext(): WeaverContext {
    return _weaverContext;
}

/**
 * @internal
 */
export function _setWeaverContext(weaverContext: WeaverContext) {
    _weaverContext = weaverContext;
}
