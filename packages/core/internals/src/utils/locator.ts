/**
 * Null-safe navigation through object properties, that allows to generate missing properties on the fly.
 */
class Locator<U> {
    constructor(private _obj: U, private _parent?: Locator<any>, private _parentKey?: string | number | symbol) {}

    /**
     * Descend to the given property of the object.
     * @param propertyName - the property to access to.
     */
    at<K extends keyof U>(propertyName: K): Locator<U[K]> {
        return new Locator(this._obj ? this._obj[propertyName] : undefined, this, propertyName);
    }

    /**
     * Get the property value
     * @return the property value (can be null)
     */
    get(): U {
        return this._obj;
    }

    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is then saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @return the property value
     */
    orElseCompute(valueProvider: () => U): U {
        return this.orElse(valueProvider, true);
    }

    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is **not** saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @return the property value
     */
    orElseGet(valueProvider: () => U): U {
        return this.orElse(valueProvider, false);
    }

    /**
     * Get the property value, or generate a new one with the given function.
     * @param valueProvider - the function used to generate a new value
     * @param save - if the generated property should then be saved into the object.
     * @return the property value
     */
    orElse(valueProvider: () => U, save = true): U {
        const value = this._obj ?? valueProvider();
        if (save) {
            this._obj = value;
            this._parent._patch(value, this._parentKey);
        }
        return value;
    }

    private _patch<K extends keyof U>(value: U[K], key: K) {
        if (!this._obj) {
            this._obj = {} as U;
            if (this._parent) {
                this._parent._patch(this._obj, this._parentKey);
            }
        }
        this._obj[key] = value;
    }
}

/**
 * @internal
 * @param obj
 */
export function locator<U = unknown>(obj: U) {
    return new Locator(obj);
}
