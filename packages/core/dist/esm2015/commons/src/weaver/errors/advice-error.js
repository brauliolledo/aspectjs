import { WeavingError } from './weaving-error.js';

/**
 * Error thrown when an advice has an unexpected behavior (eg: returns a value that is not permitted)
 * @public
 */
class AdviceError extends WeavingError {
    constructor(advice, message) {
        super(`${advice}: ${message}`);
    }
}

export { AdviceError };
//# sourceMappingURL=advice-error.js.map
