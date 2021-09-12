import { WeaverContextImpl, JitWeaver } from '@aspectjs/core';

class TestingWeaverContext extends WeaverContextImpl {
    _createWeaver() {
        return new JitWeaver(this, false);
    }
}

export { TestingWeaverContext };
//# sourceMappingURL=testing-weaver-context.impl.js.map
