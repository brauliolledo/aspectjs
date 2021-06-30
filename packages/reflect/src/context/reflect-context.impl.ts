import { AnnotationFactory } from '@aspectjs/common';
import { RootAnnotationsBundle } from '../annotation/bundle/bundle';
import { AnnotationContextRegistry } from '../annotation/context/annotation-context.registry';
import { _AnnotationContextImpl } from '../annotation/context/annotation.context';
import { AnnotationRegistry } from '../annotation/registry/annotation.registry';
import { AnnotationTargetFactory } from '../annotation/target/annotation-target.factory';
import { AnnotationLocationFactory } from '../annotation/location/location.factory';
import { ReflectContext } from './reflect.context';

export class ReflectContextImpl implements ReflectContext {
    readonly annotations: {
        location: AnnotationLocationFactory; // All known annotation locations
        registry: AnnotationRegistry; // Registers new annotations
        targetFactory: AnnotationTargetFactory; // Create annotation targets for annotations
        bundle: RootAnnotationsBundle; // Access all registered annotations
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
        AnnotationFactory.addAnnotationsHook({
            name: '@aspectjs::hook:registerAnnotation',
            decorator: (annotation, _stub, annotationArgs) => {
                return (...targetArgs: any[]) => {
                    const target = targetFactory.of(targetArgs);
                    const annotationContext = new _AnnotationContextImpl(target, annotationArgs, annotation);
                    registry.register(annotationContext);
                };
            },
            order: 10,
        });
    }
}
