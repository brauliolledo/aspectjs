import { AnnotationLocationFactory, AnnotationRegistry, AnnotationTargetFactory, _getWeaverContext, RootAnnotationsBundle, _setWeaverContext, } from '@aspectjs/core/commons';
import { WeaverContextImpl } from './weaver/weaver-context.impl';
// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
let _AspectsRegistry;
AnnotationLocationFactory;
AnnotationRegistry;
AnnotationTargetFactory;
RootAnnotationsBundle;
/**
 * @public
 */
export const WEAVER_CONTEXT = new (class {
    // Allow setWeaverContext to switch implementation of weaver.
    // This is used for resetWaverContext as a convenience for tests
    get aspects() {
        return _getWeaverContext().aspects;
    }
    get annotations() {
        return _getWeaverContext().annotations;
    }
    getWeaver() {
        return _getWeaverContext().getWeaver();
    }
})();
_setWeaverContext(new WeaverContextImpl());
//# sourceMappingURL=core.js.map