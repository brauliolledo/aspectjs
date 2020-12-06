import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const PathParam = ASPECTJS_ANNOTATION_FACTORY.create(
    'PathParam',
    (name?: string): ParameterDecorator => {
        return;
    },
);
