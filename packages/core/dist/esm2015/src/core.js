import { _getWeaverContext, _setWeaverContext } from '@aspectjs/core/commons';
import { WeaverContextImpl } from './weaver/weaver-context.impl.js';

/**
 * @public
 */
const WEAVER_CONTEXT = new (class {
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

export { WEAVER_CONTEXT };
//# sourceMappingURL=core.js.map
