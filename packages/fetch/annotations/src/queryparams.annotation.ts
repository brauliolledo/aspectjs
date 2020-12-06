import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

export const QueryParams = ASPECTJS_ANNOTATION_FACTORY.create(
    'QueryParams',
    (): ParameterDecorator => {
        return;
    },
);
