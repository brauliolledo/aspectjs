/**
 * Null-safe navigation through object properties, that allows to generate missing properties on the fly.
 *
 * @public
 */
export declare class Locator<U> {
    private _obj;
    private _parent?;
    private _parentKey?;
    constructor(_obj: U, _parent?: Locator<any>, _parentKey?: string | number | symbol);
    /**
     * Descend to the given property of the object.
     * @param propertyName - the property to access to.
     */
    at<K extends keyof U>(propertyName: K): Locator<U[K]>;
    /**
     * Get the property value
     * @returns the property value (can be null)
     */
    get(): U;
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is then saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    orElseCompute(valueProvider: () => U): U;
    /**
     * Get the property value, or generate a new one with the given function.
     * The generated property is **not** saved into the object.
     * @param valueProvider - the function used to generate a new value
     * @returns the property value
     */
    orElseGet(valueProvider: () => U): U;
    /**
     * Get the property value, or generate a new one with the given function.
     * @param valueProvider - the function used to generate a new value
     * @param save - if the generated property should then be saved into the object.
     * @returns the property value
     */
    orElse(valueProvider: () => U, save?: boolean): U;
    private _patch;
}
/**
 * @param obj - the object to navigate through.
 *
 * @public
 */
export declare function locator<U = unknown>(obj: U): Locator<U>;
//# sourceMappingURL=locator.d.ts.map