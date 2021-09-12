import { _setWeaverContext, AnnotationFactory } from '@aspectjs/core/commons';
import { WeaverContextImpl, JitWeaver } from '@aspectjs/core';

class TestingWeaverContext extends WeaverContextImpl {
    _createWeaver() {
        return new JitWeaver(this, false);
    }
}

/**
 * Setup a brand new WEAVER_CONTEXT for test purposes
 * @public
 */
function setupTestingWeaverContext(...aspects) {
    const context = new TestingWeaverContext();
    _setWeaverContext(context);
    const weaver = context.getWeaver();
    weaver.enable(...aspects);
    return context;
}
/**
 * Dummy annotation useful for tests
 * @public
 */
const AClass = new AnnotationFactory('tests').create(function AClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const BClass = new AnnotationFactory('tests').create(function BClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const CClass = new AnnotationFactory('tests').create(function CClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const DClass = new AnnotationFactory('tests').create(function DClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const XClass = new AnnotationFactory('tests').create(function XClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const AProperty = new AnnotationFactory('tests').create(function AProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const BProperty = new AnnotationFactory('tests').create(function BProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const CProperty = new AnnotationFactory('tests').create(function CProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const DProperty = new AnnotationFactory('tests').create(function DProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const XProperty = new AnnotationFactory('tests').create(function XProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const AMethod = new AnnotationFactory('tests').create(function AMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const BMethod = new AnnotationFactory('tests').create(function BMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const CMethod = new AnnotationFactory('tests').create(function CMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const DMethod = new AnnotationFactory('tests').create(function DMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const XMethod = new AnnotationFactory('tests').create(function XMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const AParameter = new AnnotationFactory('tests').create(function AParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const BParameter = new AnnotationFactory('tests').create(function BParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const CParameter = new AnnotationFactory('tests').create(function CParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const DParameter = new AnnotationFactory('tests').create(function DParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
const XParameter = new AnnotationFactory('tests').create(function XParameter(...args) {
    return;
});

export { AClass, AMethod, AParameter, AProperty, BClass, BMethod, BParameter, BProperty, CClass, CMethod, CParameter, CProperty, DClass, DMethod, DParameter, DProperty, XClass, XMethod, XParameter, XProperty, setupTestingWeaverContext };
//# sourceMappingURL=testing.js.map
