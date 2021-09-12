export class MemoAspectError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
export class VersionConflictError extends MemoAspectError {
    constructor(message, context) {
        super(message);
        this.message = message;
        this.context = context;
    }
}
//# sourceMappingURL=errors.js.map