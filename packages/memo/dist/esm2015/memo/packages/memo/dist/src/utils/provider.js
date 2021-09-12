import { isFunction } from '@aspectjs/core/utils';

function provider(arg) {
    return isFunction(arg) ? arg : () => arg;
}

export { provider };
//# sourceMappingURL=provider.js.map
