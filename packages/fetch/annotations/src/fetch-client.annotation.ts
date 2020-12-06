import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchClientInit } from './types';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const FetchClient = ASPECTJS_ANNOTATION_FACTORY.create('FetchCLient', (arg?: FetchClientInit): any => {
    return;
});
