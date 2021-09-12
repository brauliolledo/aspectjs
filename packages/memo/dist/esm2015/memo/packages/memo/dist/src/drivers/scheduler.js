/**
 * In case a @Memo method returns a promise, the corresponding MemoValue
 * can be persisted only once the promise gets resolved. As a result, all subsequent operations should be deferred.
 * This stores all the pending operations for a given key in call order,
 * to ensure an operation does not occurs before the previous operations.
 */
let globalOperationId = 0;
class Scheduler {
    constructor() {
        this._pendingOps = {};
        this._lastOperationId = {};
    }
    /** Add the given promise to the promise queue for this key **/
    add(key, op) {
        const k = key.toString();
        if (this._pendingOps[k]) {
            const opId = globalOperationId++;
            this._lastOperationId[k] = opId;
            this._pendingOps[k] = this._pendingOps[k]
                .then(() => op())
                .then((r) => {
                if (this._lastOperationId[k] === opId) {
                    delete this._pendingOps[k];
                    delete this._lastOperationId[k];
                }
                return r;
            });
        }
        else {
            this._pendingOps[k] = op();
        }
        return this._pendingOps[k];
    }
}

export { Scheduler };
//# sourceMappingURL=scheduler.js.map
