/**
 * Connects the MemoAspect to a storage back-end
 * @public
 */
export class MemoDriver {
    /**
     * Get the priority this driver should be picked up to handle the given type.
     */
    getPriority(context) {
        return 0;
    }
    accepts(context) {
        return true;
    }
}
//# sourceMappingURL=memo.driver.js.map