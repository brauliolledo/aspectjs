/**
 * Connects the MemoAspect to a storage back-end
 * @public
 */
class MemoDriver {
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

export { MemoDriver };
//# sourceMappingURL=memo.driver.js.map
