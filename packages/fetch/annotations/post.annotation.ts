import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchEndpointOptions } from './types';

export const Post = ASPECTJS_ANNOTATION_FACTORY.create(
    'Post',
    (arg: string | FetchEndpointOptions): MethodDecorator => {
        return;
    },
);
