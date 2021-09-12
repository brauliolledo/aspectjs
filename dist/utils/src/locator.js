"use strict";
exports.__esModule = true;
exports.locator = exports.Locator = void 0;
/**
 * Null-safe navigation through object properties, that allows to generate missing properties on the fly.
 *
 * @public
 */
var Locator = /** @class */ (function () {
    function Locator(_obj, _parent, _parentKey) {
        this._obj = _obj;
        this._parent = _parent;
        this._parentKey = _parentKey;
    }
    /**
     * Descend to the given property of the object.
     * @param propertyName - the property to access to.
     */
    Locator.prototype.at = function (propertyName) {
        return new Locator(this._obj ? this._obj[propertyName] : undefined, this, propertyName);
    };
    /**
     * Get the property value
     * @returns the property value (can be null)
     */
    Locator.prototype.get = function () {
        return this._obj;
    };
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is then saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    Locator.prototype.orElseCompute = function (valueProvider) {
        return this.orElse(valueProvider, true);
    };
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is **not** saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    Locator.prototype.orElseGet = function (valueProvider) {
        return this.orElse(valueProvider, false);
    };
    /**
     * Get the property value, or generate a new one with the given function.
     * @param valueProvider - the function used to generate a new value
     * @param save - if the generated property should then be saved into the object.
     * @returns the property value
     */
    Locator.prototype.orElse = function (valueProvider, save) {
        var _a;
        if (save === void 0) { save = true; }
        var value = (_a = this._obj) !== null && _a !== void 0 ? _a : valueProvider();
        if (save) {
            this._obj = value;
            this._parent._patch(value, this._parentKey);
        }
        return value;
    };
    Locator.prototype._patch = function (value, key) {
        if (!this._obj) {
            this._obj = {};
            if (this._parent) {
                this._parent._patch(this._obj, this._parentKey);
            }
        }
        this._obj[key] = value;
    };
    return Locator;
}());
exports.Locator = Locator;
/**
 * @param obj - the object to navigate through.
 *
 * @public
 */
function locator(obj) {
    return new Locator(obj);
}
exports.locator = locator;
