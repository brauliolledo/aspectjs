import { WeavingError } from '../weaver/errors';
import { AnnotationRef, AnnotationType, } from '../annotation/annotation.types';
import { AdviceType } from '../advices/types';
import { assert } from '@aspectjs/core/utils';
/**
 * @public
 */
export class PointcutExpression {
    constructor(_label, _annotations = []) {
        this._label = _label;
        this._annotations = _annotations;
        this._name = '*'; // TODO
        this._expr = _trimSpaces(`${this._label} ${this._annotations.map((a) => `@${a.ref}`).join(',')} ${this._name}`);
    }
    static of(type, annotation) {
        return AnnotationPointcutExpressionBuilders[type].withAnnotations(annotation);
    }
    toString() {
        return this._expr;
    }
}
/**
 * @public
 */
export class AnnotationPointcutExpressionBuilder {
    constructor(_label) {
        this._label = _label;
    }
    withAnnotations(...annotation) {
        return new PointcutExpression(this._label, annotation);
    }
}
/**
 * @public
 */
export class PropertyAnnotationPointcutExpressionBuilder {
    constructor() {
        this.setter = new AnnotationPointcutExpressionBuilder('property#set');
    }
    withAnnotations(...annotation) {
        return new PointcutExpression('property#get', annotation);
    }
}
const AnnotationPointcutExpressionBuilders = {
    [AnnotationType.CLASS]: new AnnotationPointcutExpressionBuilder('class'),
    [AnnotationType.METHOD]: new AnnotationPointcutExpressionBuilder('method'),
    [AnnotationType.PARAMETER]: new AnnotationPointcutExpressionBuilder('parameter'),
    [AnnotationType.PROPERTY]: new PropertyAnnotationPointcutExpressionBuilder(),
};
/**
 * @public
 */
export const on = {
    class: AnnotationPointcutExpressionBuilders[AnnotationType.CLASS],
    method: AnnotationPointcutExpressionBuilders[AnnotationType.METHOD],
    parameter: AnnotationPointcutExpressionBuilders[AnnotationType.PARAMETER],
    property: AnnotationPointcutExpressionBuilders[AnnotationType.PROPERTY],
};
/**
 * @public
 */
export var PointcutPhase;
(function (PointcutPhase) {
    PointcutPhase["COMPILE"] = "Compile";
    PointcutPhase["AROUND"] = "Around";
    PointcutPhase["BEFORE"] = "Before";
    PointcutPhase["AFTERRETURN"] = "AfterReturn";
    PointcutPhase["AFTER"] = "After";
    PointcutPhase["AFTERTHROW"] = "AfterThrow";
})(PointcutPhase || (PointcutPhase = {}));
/**
 * @public
 */
export var Pointcut;
(function (Pointcut) {
    const POINTCUT_REGEXPS = {
        [AdviceType.CLASS]: new RegExp('class(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AdviceType.PROPERTY]: new RegExp('property#(?:get|set)(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AdviceType.METHOD]: new RegExp('method(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AdviceType.PARAMETER]: new RegExp('parameter(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
    };
    function of(phase, exp) {
        const ref = exp.toString();
        let pointcut;
        for (const entry of Object.entries(POINTCUT_REGEXPS)) {
            const [type, regex] = entry;
            const match = regex.exec(ref);
            if (match === null || match === void 0 ? void 0 : match.groups.name) {
                assert(!!match.groups.annotation, 'only annotation pointcuts are supported');
                pointcut = {
                    type: type,
                    phase,
                    annotation: new AnnotationRef(match.groups.annotation),
                    name: match.groups.name,
                    ref,
                };
                Reflect.defineProperty(pointcut, Symbol.toPrimitive, {
                    value: () => `${phase}(${ref})`,
                });
                return pointcut;
            }
        }
        throw new WeavingError(`expression ${ref} not recognized as valid pointcut expression`);
    }
    Pointcut.of = of;
})(Pointcut || (Pointcut = {}));
function _trimSpaces(s) {
    return s.replace(/\s+/, ' ');
}
//# sourceMappingURL=pointcut.js.map