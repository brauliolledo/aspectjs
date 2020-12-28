import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/common';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const QueryParam = ASPECTJS_ANNOTATION_FACTORY.create('QueryParam', (name?: string): any => {
    return;
});
