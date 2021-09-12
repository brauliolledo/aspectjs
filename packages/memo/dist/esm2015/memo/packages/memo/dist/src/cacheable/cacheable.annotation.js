import { ASPECTJS_ANNOTATION_FACTORY } from '@aspectjs/core/commons';

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
