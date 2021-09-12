import { JitWeaver, WeaverContextImpl } from '@aspectjs/core';
export class TestingWeaverContext extends WeaverContextImpl {
    _createWeaver() {
        return new JitWeaver(this, false);
    }
}
//# sourceMappingURL=testing-weaver-context.impl.js.map