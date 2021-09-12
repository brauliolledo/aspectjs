import { assert, isFunction } from '@aspectjs/core/utils';
import { _getWeaverContext } from '../../weaver';
import { AnnotationRef, AnnotationType, } from '../annotation.types';
import { AnnotationContext } from '../context/annotation.context';
let generatedId = 0;
/**
 * Factory to create some {@link Annotation}.
 * @public
 */
export class AnnotationFactory {
    constructor(groupId) {
        this._groupId = groupId;
    }
    create(name, annotationStub) {
        const groupId = this._groupId;
        if (isFunction(name)) {
            annotationStub = name;
            name = annotationStub.name;
        }
        if (!annotationStub) {
            annotationStub = function () { };
        }
        if (!name) {
            name = `anonymousAnnotation#${generatedId++}`;
        }
        // create the annotation (ie: decorator provider)
        const annotation = _createAnnotation(name, groupId, annotationStub, function (...annotationArgs) {
            return _createBootstrapDecorator(annotation, annotationStub, annotationArgs);
        });
        return annotation;
    }
}
function _createAnnotation(name, groupId, annotationStub, fn) {
    assert(typeof fn === 'function');
    // ensure annotation has a name.
    annotationStub = annotationStub !== null && annotationStub !== void 0 ? annotationStub : function () { };
    const annotationRef = new AnnotationRef(groupId, name);
    const annotation = fn;
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationStub));
    Object.defineProperties(annotation, Object.getOwnPropertyDescriptors(annotationRef));
    assert(Object.getOwnPropertySymbols(annotation).indexOf(Symbol.toPrimitive) >= 0);
    return annotation;
}
function _createBootstrapDecorator(annotation, annotationStub, annotationArgs) {
    return function (...targetArgs) {
        var _a, _b;
        // eslint-disable-next-line prefer-spread
        (_a = annotationStub(...annotationArgs)) === null || _a === void 0 ? void 0 : _a.apply(null, targetArgs);
        // assert the weaver is loaded before invoking the underlying decorator
        const weaverContext = _getWeaverContext();
        if (!weaverContext) {
            throw new Error(`Cannot invoke annotation ${(_b = annotation.name) !== null && _b !== void 0 ? _b : ''} before "setWeaverContext()" has been called`);
        }
        const target = _getWeaverContext().annotations.targetFactory.of(targetArgs);
        const annotationContext = new AnnotationContextImpl(target, annotationArgs, annotation);
        weaverContext.annotations.registry.register(annotationContext);
        const enhanced = weaverContext.getWeaver().enhance(target);
        if (target.type === AnnotationType.CLASS) {
            Object.defineProperties(enhanced, Object.getOwnPropertyDescriptors(targetArgs[0]));
        }
        return enhanced;
    };
}
class AnnotationContextImpl extends AnnotationContext {
    constructor(target, args, annotation) {
        super(annotation.groupId, annotation.name);
        this.target = target;
        this.args = args;
    }
}
//# sourceMappingURL=annotation.factory.js.map