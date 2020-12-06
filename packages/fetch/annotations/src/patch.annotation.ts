import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchEndpointInit } from './types';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const Patch = ASPECTJS_ANNOTATION_FACTORY.create(
    'Patch',
    (init?: FetchEndpointInit): MethodDecorator => {
        return;
    },
);
