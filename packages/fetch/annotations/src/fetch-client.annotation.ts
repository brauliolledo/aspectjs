import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/common';
import { FetchClientInit } from './types';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const FetchClient = ASPECTJS_ANNOTATION_FACTORY.create('FetchClient', (arg?: FetchClientInit): any => {
    return;
});
