import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';
import { FetchClientOptions } from './types';

export const FetchCLient = ASPECTJS_ANNOTATION_FACTORY.create(
    'FetchCLient',
    (arg: string | FetchClientOptions): any => {
        return;
    },
);
