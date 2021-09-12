export declare class Scheduler {
    private readonly _pendingOps;
    private readonly _lastOperationId;
    /** Add the given promise to the promise queue for this key **/
    add<T>(key: string, op: () => PromiseLike<T>): T extends Promise<any> ? T : PromiseLike<T>;
}
//# sourceMappingURL=scheduler.d.ts.map