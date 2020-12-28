import { AnnotationFactory } from '@aspectjs/common';
import { on } from '@aspectjs/core';
import { Aspect, Compile } from '@aspectjs/core/annotations';
import { ReflectContextImpl } from '@aspectjs/reflect/public_api';
import { Weaver, WeaverContext, WeaverContextImpl, WeavingError, _setWeaverContext } from '../weaver';

let weaver: Weaver;

function setupWeaverTestingContext(): WeaverContext {
    const context = new WeaverContextImpl(new ReflectContextImpl());
    _setWeaverContext(context);
    return context;
}

/**
 * Dummy annotation useful for tests
 * @public
 */
export const AClass = new AnnotationFactory('tests').create(function AClass(): ClassDecorator {
    return;
});

describe('JitWeaver', () => {
    beforeEach(() => {
        weaver = setupWeaverTestingContext().getWeaver();
    });

    describe('.enable()', () => {
        describe('after any annotation has been applied already', () => {
            it('should throw an error', () => {
                @AClass()
                class A {}

                @Aspect()
                class LateCompileAspectA {
                    @Compile(on.class.withAnnotations(AClass))
                    shouldThrow() {}
                }

                expect(() => {
                    weaver.enable(new LateCompileAspectA());
                }).toThrow(
                    new WeavingError(
                        'Cannot enable aspect LateCompileAspectA because annotation @AClass has already been applied',
                    ),
                );
            });
        });
    });
});
