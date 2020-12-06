import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchEndpointOptions } from './types';

export const Get = ASPECTJS_ANNOTATION_FACTORY.create(
    'Get',
    (arg: string | FetchEndpointOptions): MethodDecorator => {
        return;
    },
);
