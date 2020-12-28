import { ReflectContext } from '@aspectjs/reflect';
import { AspectsRegistry } from '../aspect/aspect.registry.type';
import { Weaver } from './weaver';

/**
 * @public
 */
export interface WeaverContext {
    readonly aspects: {
        registry: AspectsRegistry;
    };
    readonly annotations: ReflectContext['annotations'];

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
