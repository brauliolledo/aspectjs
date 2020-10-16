import { getWeaver } from '@aspectjs/core';
import { defaultMemoProfile } from './src/profiles/default.profile';

export * from './src/profiles/default.profile';
export * from './src/memo.annotation';
export * from './src/memo.aspect';
export * from './src/memo.types';
export * from './src/cacheable/cacheable.annotation';
export * from './src/cacheable/cacheable.aspect';
export * from './src/drivers';
export * from './src/marshalling/marshallers';

export function registerDefaultMemo() {
    getWeaver().enable(defaultMemoProfile);
}
