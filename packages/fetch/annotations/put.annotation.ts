import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchEndpointOptions } from './types';

export const Put = ASPECTJS_ANNOTATION_FACTORY.create(
    'Put',
    (arg: string | FetchEndpointOptions): MethodDecorator => {
        return;
    },
);
