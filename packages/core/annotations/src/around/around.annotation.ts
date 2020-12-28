import { AnnotationRef, ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/common';
import { PointcutExpression } from '@aspectjs/core';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

/**
 * @public
 */
export const Around = ASPECTJS_ANNOTATION_FACTORY.create(function Around(
    pointcutExp: PointcutExpression,
): MethodDecorator {
    return;
});
