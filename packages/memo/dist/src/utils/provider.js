import { isFunction } from '@aspectjs/core/utils';
export function provider(arg) {
    return isFunction(arg) ? arg : () => arg;
}
//# sourceMappingURL=provider.js.map