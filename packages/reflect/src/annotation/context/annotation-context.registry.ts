import { AnnotationContext } from './annotation.context';

/**
 * @public
 */
export type AnnotationContextRegistry = {
    // TODO use WeakMap instead
    byTargetClassRef: {
        [classTargetRef: string]: {
            byAnnotation: {
                [annotationRef: string]: AnnotationContext[];
            };
            all: AnnotationContext[];
        };
    };
    byAnnotation: {
        [annotationRef: string]: AnnotationContext[];
    };
};
