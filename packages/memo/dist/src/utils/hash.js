/**
 *
 * @param str - the value to hash
 * @public
 */
export function hash(str) {
    return str
        .split('')
        .map((v) => v.charCodeAt(0))
        .reduce((a, v) => (a + ((a << 7) + (a << 3))) ^ v)
        .toString(16);
}
//# sourceMappingURL=hash.js.map