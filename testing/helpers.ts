import { AnnotationFactory } from '@aspectjs/common';

const af = new AnnotationFactory('tests');
/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _AClass = af.create(function AClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _BClass = af.create(function BClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _CClass = af.create(function CClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _DClass = af.create(function DClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _XClass = af.create(function XClass(): ClassDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _AProperty = af.create(function AProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _BProperty = af.create(function BProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _CProperty = af.create(function CProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _DProperty = af.create(function DProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _XProperty = af.create(function XProperty(): PropertyDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _AMethod = af.create(function AMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _BMethod = af.create(function BMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _CMethod = af.create(function CMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _DMethod = af.create(function DMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _XMethod = af.create(function XMethod(): MethodDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _AParameter = af.create(function AParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _BParameter = af.create(function BParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _CParameter = af.create(function CParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _DParameter = af.create(function DParameter(...args: any[]): ParameterDecorator {
    return;
});

/**
 * Dummy annotation useful for tests
 * @internal
 */
export const _XParameter = af.create(function XParameter(...args: any[]): ParameterDecorator {
    return;
});

export class _Labeled {
    public labels?: string[] = [];

    addLabel?(...labels: string[]): any {
        this.labels = this.labels ?? [];
        if (labels.length) {
            this.labels.push(...labels);
        }

        return this.labels;
    }
}
