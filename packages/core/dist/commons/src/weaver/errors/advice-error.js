import { WeavingError } from './weaving-error';
/**
 * Error thrown when an advice has an unexpected behavior (eg: returns a value that is not permitted)
 * @public
 */
export class AdviceError extends WeavingError {
    constructor(advice, message) {
        super(`${advice}: ${message}`);
    }
}
//# sourceMappingURL=advice-error.js.map