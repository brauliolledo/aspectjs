import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const Body = ASPECTJS_ANNOTATION_FACTORY.create(
    'Body',
    (name?: string): ParameterDecorator => {
        return;
    },
);
