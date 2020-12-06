import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchEndpointInit } from './types';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const Delete = ASPECTJS_ANNOTATION_FACTORY.create(
    'Delete',
    (init?: FetchEndpointInit): MethodDecorator => {
        return;
    },
);
