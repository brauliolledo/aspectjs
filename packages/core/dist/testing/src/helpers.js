import { _setWeaverContext, AnnotationFactory, AnnotationRef } from '@aspectjs/core/commons';
import { TestingWeaverContext } from './testing-weaver-context.impl';
// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;
/**
 * Setup a brand new WEAVER_CONTEXT for test purposes
 * @public
 */
export function setupTestingWeaverContext(...aspects) {
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
export const AClass = new AnnotationFactory('tests').create(function AClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const BClass = new AnnotationFactory('tests').create(function BClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const CClass = new AnnotationFactory('tests').create(function CClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const DClass = new AnnotationFactory('tests').create(function DClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const XClass = new AnnotationFactory('tests').create(function XClass() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const AProperty = new AnnotationFactory('tests').create(function AProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const BProperty = new AnnotationFactory('tests').create(function BProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const CProperty = new AnnotationFactory('tests').create(function CProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const DProperty = new AnnotationFactory('tests').create(function DProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const XProperty = new AnnotationFactory('tests').create(function XProperty() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const AMethod = new AnnotationFactory('tests').create(function AMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const BMethod = new AnnotationFactory('tests').create(function BMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const CMethod = new AnnotationFactory('tests').create(function CMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const DMethod = new AnnotationFactory('tests').create(function DMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const XMethod = new AnnotationFactory('tests').create(function XMethod() {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const AParameter = new AnnotationFactory('tests').create(function AParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const BParameter = new AnnotationFactory('tests').create(function BParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const CParameter = new AnnotationFactory('tests').create(function CParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const DParameter = new AnnotationFactory('tests').create(function DParameter(...args) {
    return;
});
/**
 * Dummy annotation useful for tests
 * @public
 */
export const XParameter = new AnnotationFactory('tests').create(function XParameter(...args) {
    return;
});
//# sourceMappingURL=helpers.js.map