import { assert } from '@aspectjs/core/utils';

/**
 * @public
 */
/**
 * @public
 */
var AnnotationType;
(function (AnnotationType) {
    AnnotationType["CLASS"] = "AnnotationType.CLASS";
    AnnotationType["PROPERTY"] = "AnnotationType.PROPERTY";
    AnnotationType["METHOD"] = "AnnotationType.METHOD";
    AnnotationType["PARAMETER"] = "AnnotationType.PARAMETER";
})(AnnotationType || (AnnotationType = {}));
/**
 * @public
 */
class AnnotationRef {
    constructor(groupIdOrRef, name) {
        if (!name) {
            this.ref = groupIdOrRef;
            const ANNOTATION_REF_REGEX = /(?<groupId>\S+):(?<name>\S+)/;
            const macth = ANNOTATION_REF_REGEX.exec(this.ref);
            this.groupId = macth.groups.groupId;
            this.name = macth.groups.name;
        }
        else {
            this.ref = `${groupIdOrRef}:${name}`;
            this.name = name;
            this.groupId = groupIdOrRef;
        }
        if (!this.name) {
            assert(false);
            throw new Error('cannot create annotation without name');
        }
        if (!this.groupId) {
            throw new Error('cannot create annotation without groupId');
        }
        Object.defineProperty(this, Symbol.toPrimitive, {
            enumerable: false,
            value: () => {
                return `@${this.name}`;
            },
        });
    }
    toString() {
        return `@${this.groupId}:${this.name}`;
    }
}

export { AnnotationRef, AnnotationType };
//# sourceMappingURL=annotation.types.js.map
