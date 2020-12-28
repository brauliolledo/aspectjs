import { AspectError } from '@aspectjs/common';

/**
 * Error thrown during the weaving process meaning the weaver has illegal state.
 * @public
 */
export class WeavingError extends AspectError {
    constructor(msg: string) {
        super(msg);
    }
}
