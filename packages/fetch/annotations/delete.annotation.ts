import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchEndpointOptions } from './types';

export const Delete = ASPECTJS_ANNOTATION_FACTORY.create(
    'Delete',
    (arg: string | FetchEndpointOptions): MethodDecorator => {
        return;
    },
);
