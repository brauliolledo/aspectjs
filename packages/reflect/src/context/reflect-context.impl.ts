import { AnnotationFactory } from '@aspectjs/common';
import { RootAnnotationsBundle } from '../../src/annotation/bundle/bundle';
import { AnnotationContextRegistry } from '../../src/annotation/context/annotation-context.registry';
import { _AnnotationContextImpl } from '../../src/annotation/context/annotation.context';
import { AnnotationRegistry } from '../../src/annotation/registry/annotation.registry';
import { AnnotationTargetFactory } from '../../src/annotation/target/annotation-target.factory';
import { AnnotationLocationFactory } from '../annotation/location/location.factory';
import { ReflectContext } from './reflect.context';

export class ReflectContextImpl implements ReflectContext {
    readonly annotations: {
        location: AnnotationLocationFactory;
        registry: AnnotationRegistry;
        targetFactory: AnnotationTargetFactory;
        bundle: RootAnnotationsBundle;
    };

    constructor() {
        const contextRegistry: AnnotationContextRegistry = {
            byTargetClassRef: {},
            byAnnotation: {},
        };

        const targetFactory = new AnnotationTargetFactory();
        const bundle = new RootAnnotationsBundle(contextRegistry);
        const registry = new AnnotationRegistry(contextRegistry);
        const location = new AnnotationLocationFactory(targetFactory, contextRegistry);

        this.annotations = {
            bundle,
            registry,
            location,
            targetFactory,
        };
        // add annotation factory hook to register annotations
        AnnotationFactory.bootstrapDecorators.set(
            '@aspectjs::registerAnnotation',
            (annotation, _stub, annotationArgs) => {
                return (...targetArgs: any[]) => {
                    const target = targetFactory.of(targetArgs);
                    const annotationContext = new _AnnotationContextImpl(target, annotationArgs, annotation);
                    registry.register(annotationContext);
                };
            },
        );
    }
}
