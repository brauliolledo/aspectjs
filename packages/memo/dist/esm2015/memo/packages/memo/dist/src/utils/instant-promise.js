import { isPromise } from '@aspectjs/core/utils';

/**
 * Like Promise.resolve, but call resolve synchronously as soon as '.then' gets called
 */
class InstantPromise {
    constructor() {
        this._onfulfilled = [];
        this._onrejected = [];
    }
    static resolve(value) {
        return new InstantPromise().resolve(value);
    }
    static all(...promises) {
        const results = [];
        let promise = new InstantPromise().resolve(results);
        promises.forEach((p, i) => {
            promise = promise.then(() => p).then((v) => (results[i] = v));
        });
        return promise;
    }
    then(onfulfilled, onrejected) {
        if (this._resolved) {
            const res = onfulfilled(this._value);
            if (isPromise(res)) {
                return res;
            }
            else {
                return new InstantPromise().resolve(res);
            }
        }
        else {
            const delegate = new InstantPromise();
            this._onfulfilled.push((r) => delegate.resolve(onfulfilled ? onfulfilled(r) : undefined));
            this._onrejected.push((r) => delegate.resolve(onrejected ? onrejected(r) : undefined));
            return delegate;
        }
    }
    resolve(value) {
        if (this._resolved) {
            throw new Error('promise already resolved');
        }
        this._resolved = true;
        this._value = value;
        if (this._onfulfilled) {
            this._onfulfilled.forEach((f) => f(value));
        }
        return this;
    }
    reject(rejectValue) {
        if (this._resolved) {
            throw new Error('promise already resolved');
        }
        this._resolved = true;
        this._rejectValue = rejectValue;
        if (this._onrejected) {
            this._onrejected.forEach((f) => f(rejectValue));
        }
        return this;
    }
}

export { InstantPromise };
//# sourceMappingURL=instant-promise.js.map
