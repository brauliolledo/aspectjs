import {
    Annotation,
    AnnotationRef,
    AnnotationType,
    ClassAnnotation,
    MethodAnnotation,
    ParameterAnnotation,
    PropertyAnnotation,
} from '../annotation/annotation.types';
import { assert } from '@aspectjs/common/utils';

/**
 * @public
 */
export class PointcutExpression {
    private readonly _name = '*'; // TODO
    private readonly _expr: string;

    static of<T extends AnnotationType>(type: T, annotation: AnnotationRef) {
        return AnnotationPointcutExpressionBuilders[type].withAnnotations(annotation as any);
    }
    constructor(private _label: string, private _annotations: AnnotationRef[] = []) {
        this._expr = _trimSpaces(`${this._label} ${this._annotations.map((a) => `@${a.ref}`).join(',')} ${this._name}`);
    }
    toString(): string {
        return this._expr;
    }
}

/**
 * @public
 */
export class AnnotationPointcutExpressionBuilder<A extends Annotation> {
    constructor(private _label: string) {}

    withAnnotations(...annotation: Annotation[]): PointcutExpression {
        return new PointcutExpression(this._label, annotation);
    }
}

/**
 * @public
 */
export class PropertyAnnotationPointcutExpressionBuilder {
    readonly setter = new AnnotationPointcutExpressionBuilder<ParameterAnnotation>('property#set');

    withAnnotations(...annotation: PropertyAnnotation[]): PointcutExpression {
        return new PointcutExpression('property#get', annotation);
    }
}

/**
 * @public
 */
export interface PointcutExpressionBuilder {
    readonly class: AnnotationPointcutExpressionBuilder<ClassAnnotation>;
    readonly property: PropertyAnnotationPointcutExpressionBuilder;
    readonly method: AnnotationPointcutExpressionBuilder<MethodAnnotation>;
    readonly parameter: AnnotationPointcutExpressionBuilder<ParameterAnnotation>;
}

const AnnotationPointcutExpressionBuilders = {
    [AnnotationType.CLASS]: new AnnotationPointcutExpressionBuilder<ClassAnnotation>('class'),
    [AnnotationType.METHOD]: new AnnotationPointcutExpressionBuilder<MethodAnnotation>('method'),
    [AnnotationType.PARAMETER]: new AnnotationPointcutExpressionBuilder<MethodAnnotation>('parameter'),
    [AnnotationType.PROPERTY]: new PropertyAnnotationPointcutExpressionBuilder(),
};
/**
 * @public
 */
export const on: PointcutExpressionBuilder = {
    class: AnnotationPointcutExpressionBuilders[AnnotationType.CLASS],
    method: AnnotationPointcutExpressionBuilders[AnnotationType.METHOD],
    parameter: AnnotationPointcutExpressionBuilders[AnnotationType.PARAMETER],
    property: AnnotationPointcutExpressionBuilders[AnnotationType.PROPERTY],
};

/**
 * @public
 */
export enum PointcutPhase {
    COMPILE,
    BEFORE,
    AROUND,
    AFTERRETURN,
    AFTERTHROW,
    AFTER,
}

export namespace PointcutPhase {
    const strings: string[] = [];
    strings[PointcutPhase.COMPILE] = 'Compile';
    strings[PointcutPhase.BEFORE] = 'Before';
    strings[PointcutPhase.AROUND] = 'Around';
    strings[PointcutPhase.AFTERRETURN] = 'AfterReturn';
    strings[PointcutPhase.AFTERTHROW] = 'AfterThrow';
    strings[PointcutPhase.AFTER] = 'After';

    export function toString(phase: PointcutPhase): string {
        return strings[phase];
    }
}

/**
 * @public
 */
export interface Pointcut<A extends AnnotationType = any> {
    readonly type: A;
    readonly annotation: AnnotationRef;
    readonly name: string;
    readonly phase: PointcutPhase;
    readonly ref: string;
}

/**
 * @public
 */
export namespace Pointcut {
    const POINTCUT_REGEXPS = {
        [AnnotationType.CLASS]: new RegExp('class(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AnnotationType.PROPERTY]: new RegExp(
            'property#(?:get|set)(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*',
        ),
        [AnnotationType.METHOD]: new RegExp('method(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*'),
        [AnnotationType.PARAMETER]: new RegExp(
            'parameter(?:\\s+\\@(?<annotation>\\S+?:\\S+))?(?:\\s+(?<name>\\S+?))\\s*',
        ),
    };

    export function of(phase: PointcutPhase, exp: PointcutExpression | string): Pointcut {
        const ref = exp.toString();

        let pointcut: Pointcut;

        for (const entry of Object.entries(POINTCUT_REGEXPS)) {
            const [type, regex] = entry;
            const match = regex.exec(ref);

            if (match?.groups.name) {
                assert(!!match.groups.annotation, 'only annotation pointcuts are supported');
                pointcut = {
                    type: type as AnnotationType,
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

        throw new TypeError(`expression ${ref} not recognized as valid pointcut expression`);
    }
}

/**
 * @public
 */
export interface CompilePointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.COMPILE;
}
/**
 * @public
 */
export interface AroundPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AROUND;
}
/**
 * @public
 */
export interface BeforePointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.BEFORE;
}
/**
 * @public
 */
export interface AfterReturnPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTERRETURN;
}
/**
 * @public
 */
export interface AfterPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTER;
}
/**
 * @public
 */
export interface AfterThrowPointcut<A extends AnnotationType = any> extends Pointcut<A> {
    phase: PointcutPhase.AFTERTHROW;
}

function _trimSpaces(s: string) {
    return s.replace(/\s+/, ' ');
}