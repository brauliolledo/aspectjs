import { _setWeaverContext, AnnotationFactory, AnnotationRef, AspectType, WeaverContext } from '@aspectjs/core/commons';
import { TestingWeaverContext } from './testing-weaver-context.impl';

// TODO remove when https://github.com/microsoft/rushstack/issues/1050 is resolved
AnnotationRef;

/**
 * Dummy object interface used for test purpose
 * @public
 */
export interface Labeled {
    labels?: string[];
    addLabel?: (...args: any[]) => any;
}

/**
 * Setup a brand new WeaverContext for test purposes
 * @public
 */
export function setupTestingWeaverContext(...aspects: AspectType[]): WeaverContext {
    const context = new TestingWeaverContext();
    _setWeaverContext(context);
    const weaver = context.getWeaver();
    weaver.enable(...aspects);
    return context;
}

const af = new AnnotationFactory('tests');
/**
 * Dummy annotation useful for tests
 * @public
 */
export const AClass = af.create(function AClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const BClass = af.create(function BClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const CClass = af.create(function CClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const DClass = af.create(function DClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const XClass = af.create(function XClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const AProperty = af.create(function AProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const BProperty = af.create(function BProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const CProperty = af.create(function CProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const DProperty = af.create(function DProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const XProperty = af.create(function XProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const AMethod = af.create(function AMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const BMethod = af.create(function BMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const CMethod = af.create(function CMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const DMethod = af.create(function DMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const XMethod = af.create(function XMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const AParameter = af.create(function AParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const BParameter = af.create(function BParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const CParameter = af.create(function CParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const DParameter = af.create(function DParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @public
 */
export const XParameter = af.create(function XParameter(...args: any[]): ParameterDecorator {
    return;
});
