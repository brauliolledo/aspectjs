import { UnmarshallingContext } from './marshalling/marshalling-context';
export declare class MemoAspectError extends Error {
    readonly message: string;
    constructor(message: string);
}
export declare class VersionConflictError extends MemoAspectError {
    readonly message: string;
    readonly context: UnmarshallingContext;
    constructor(message: string, context: UnmarshallingContext);
}
//# sourceMappingURL=errors.d.ts.map