import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/common';
import { FetchEndpointInit } from './types';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const Put = ASPECTJS_ANNOTATION_FACTORY.create(
    'Put',
    (init?: FetchEndpointInit): MethodDecorator => {
        return;
    },
);
