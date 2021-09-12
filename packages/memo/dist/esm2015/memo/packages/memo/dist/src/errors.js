class MemoAspectError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
class VersionConflictError extends MemoAspectError {
    constructor(message, context) {
        super(message);
        this.message = message;
        this.context = context;
    }
}

export { MemoAspectError, VersionConflictError };
//# sourceMappingURL=errors.js.map
