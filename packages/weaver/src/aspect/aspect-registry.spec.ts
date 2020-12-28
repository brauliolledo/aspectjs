import { After, Aspect, Before } from '@aspectjs/core/annotations';
import { setupWeaverTestingContext } from '../../testing';
import { _AClass } from '../../../../testing/helpers';
import { AspectsRegistry } from './aspect.registry.type';
import { _getWeaverContext } from '../weaver';
import { AspectType, on, PointcutPhase } from '@aspectjs/core';
import { WeaverContext } from '../weaver/weaver-context';

describe('AspectsRegistry', () => {
    let aspectsRegistry: AspectsRegistry;
    let weaverContext: WeaverContext;
    beforeEach(() => {
        weaverContext = setupWeaverTestingContext();
        aspectsRegistry = weaverContext.aspects.registry;
    });
    describe('method getAdvicesByAspect()', () => {
        describe('given an object that is not an aspect', () => {
            it('should throw an WeavingError', () => {
                expect(() => aspectsRegistry.getAdvicesByAspect({})).toThrow(new TypeError('Object is not an Aspect'));

                expect(() => aspectsRegistry.getAdvicesByAspect(new (class A {})())).toThrow(
                    new TypeError('A is not an Aspect'),
                );
            });
        });

        describe('given an aspect instance', () => {
            let aspect: AspectType;

            describe('that defines no advices', () => {
                beforeEach(() => {
                    @Aspect()
                    class AAspect {}
                    aspect = new AAspect();

                    weaverContext.getWeaver().enable(aspect);
                    aspectsRegistry = _getWeaverContext().aspects.registry;
                });

                it('should return empty array', () => {
                    expect(aspectsRegistry.getAdvicesByAspect(aspect)).toEqual([]);
                });
            });

            describe('that defines some advices', () => {
                beforeEach(() => {
                    @Aspect()
                    class AAspect {
                        @Before(on.class.withAnnotations(_AClass))
                        beforeAdvice1() {}

                        @After(on.class.withAnnotations(_AClass))
                        afterAdvice1() {}
                    }
                    aspect = new AAspect();
                    weaverContext.getWeaver().enable(aspect);
                    aspectsRegistry = _getWeaverContext().aspects.registry;
                });

                it('should return an array with corresponding advices', () => {
                    const advices = aspectsRegistry.getAdvicesByAspect(aspect);
                    expect(advices.length).toEqual(2);
                    expect(advices[0].name).toEqual('beforeAdvice1');
                    expect(advices[0].pointcut.phase).toEqual(PointcutPhase.BEFORE);
                    expect(advices[1].name).toEqual('afterAdvice1');
                    expect(advices[1].pointcut.phase).toEqual(PointcutPhase.AFTER);
                });
            });
        });
    });
});
