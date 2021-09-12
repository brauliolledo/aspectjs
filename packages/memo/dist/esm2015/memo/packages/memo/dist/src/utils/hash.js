/**
 *
 * @param str - the value to hash
 * @public
 */
function hash(str) {
    return str
        .split('')
        .map((v) => v.charCodeAt(0))
        .reduce((a, v) => (a + ((a << 7) + (a << 3))) ^ v)
        .toString(16);
}

export { hash };
//# sourceMappingURL=hash.js.map
