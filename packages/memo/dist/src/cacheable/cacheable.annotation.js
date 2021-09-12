import { ASPECTJS_ANNOTATION_FACTORY, AnnotationRef } from '@aspectjs/core/commons';
// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;
function Cacheable(typeId) {
    return;
}
/**
 * Indicates that the result of annotated method could be cached.
 * @public
 */
const _Cacheable = ASPECTJS_ANNOTATION_FACTORY.create(Cacheable);
export { _Cacheable as Cacheable };
//# sourceMappingURL=cacheable.annotation.js.map