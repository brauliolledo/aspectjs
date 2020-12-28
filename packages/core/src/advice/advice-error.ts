import { AspectError } from '@aspectjs/common';
import { AdviceContext } from './advice.context.type';

/**
 * Error thrown when an advice has an unexpected behavior (eg: returns a value that is not permitted)
 * @public
 */
export class AdviceError extends AspectError {
    constructor(ctxt: Pick<AdviceContext, 'advice' | 'target'>, message: string) {
        super(`Error applying advice ${ctxt.advice} on ${ctxt.target.label}: ${message}`);
    }
}
