import { RootAnnotationsBundle } from '../annotation/bundle/bundle';
import { AnnotationLocationFactory } from '../annotation/location/location.factory';
import { AnnotationRegistry } from '../annotation/registry/annotation.registry';
import { AnnotationTargetFactory } from '../annotation/target/annotation-target.factory';

export interface ReflectContext {
    readonly annotations: {
        location: AnnotationLocationFactory;
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
        bundle: RootAnnotationsBundle;
    };
}

let _reflectContext: ReflectContext;

/**
 * @internal
 * @param reflectContext
 */
export function _setReflectContext(reflectContext: ReflectContext) {
    _reflectContext = reflectContext;
}

/**
 * @internal
 */
export function _getReflectContext(): ReflectContext {
    return _reflectContext;
}
