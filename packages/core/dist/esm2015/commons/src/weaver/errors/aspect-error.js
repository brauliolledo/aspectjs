/**
 * Thrown by aspects in case some error occurred during the aspect execution.
 * @public
 */
class AspectError extends Error {
    constructor(ctxt, message) {
        super(`Error applying advice ${ctxt.advice} on ${ctxt.target.label}: ${message}`);
    }
}

export { AspectError };
//# sourceMappingURL=aspect-error.js.map
