/**
 * Null-safe navigation through object properties, that allows to generate missing properties on the fly.
 *
 * @public
 */
export class Locator {
    constructor(_obj, _parent, _parentKey) {
        this._obj = _obj;
        this._parent = _parent;
        this._parentKey = _parentKey;
    }
    /**
     * Descend to the given property of the object.
     * @param propertyName - the property to access to.
     */
    at(propertyName) {
        return new Locator(this._obj ? this._obj[propertyName] : undefined, this, propertyName);
    }
    /**
     * Get the property value
     * @returns the property value (can be null)
     */
    get() {
        return this._obj;
    }
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is then saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    orElseCompute(valueProvider) {
        return this.orElse(valueProvider, true);
    }
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is **not** saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    orElseGet(valueProvider) {
        return this.orElse(valueProvider, false);
    }
    /**
     * Get the property value, or generate a new one with the given function.
     * @param valueProvider - the function used to generate a new value
     * @param save - if the generated property should then be saved into the object.
     * @returns the property value
     */
    orElse(valueProvider, save = true) {
        var _a;
        const value = (_a = this._obj) !== null && _a !== void 0 ? _a : valueProvider();
        if (save) {
            this._obj = value;
            this._parent._patch(value, this._parentKey);
        }
        return value;
    }
    _patch(value, key) {
        if (!this._obj) {
            this._obj = {};
            if (this._parent) {
                this._parent._patch(this._obj, this._parentKey);
            }
        }
        this._obj[key] = value;
    }
}
/**
 * @param obj - the object to navigate through.
 *
 * @public
 */
export function locator(obj) {
    return new Locator(obj);
}
//# sourceMappingURL=locator.js.map