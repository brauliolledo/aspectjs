export declare class InstantPromise<T> implements PromiseLike<T> {
    private _resolved;
    private _value?;
    private _rejectValue?;
    private _onfulfilled;
    private _onrejected;
    constructor();
    static resolve<T>(value?: T): InstantPromise<T>;
    static all(...promises: PromiseLike<any>[]): PromiseLike<any[]>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
    resolve(value: T): this;
    reject(rejectValue: any): this;
}
//# sourceMappingURL=instant-promise.d.ts.map