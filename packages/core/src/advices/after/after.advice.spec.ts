import { After, Aspect } from '@aspectjs/core/annotations';
import { Weaver } from '@aspectjs/weaver';
import { setupAspectTestingContext } from '../../../testing';
import { _AClass, _AMethod, _AProperty, _Labeled } from '@root/testing';

import Spy = jasmine.Spy;
import { AdviceContext, AfterContext } from '../../advice/advice.context.type';
import { on } from '../../advice/pointcut';
import { AdviceType } from '../../advice/advice.type';

let advice: Spy;

describe('@After advice', () => {
    let aspectClass: any;
    let weaver: Weaver;
    beforeEach(() => {
        weaver = setupAspectTestingContext().weaverContext.getWeaver();
    });
    describe('applied on a class', () => {
        beforeEach(() => {
            @Aspect('AClassLabel')
            class AfterAspect {
                @After(on.class.withAnnotations(_AClass))
                apply(ctxt: AdviceContext<any, AdviceType.CLASS>): void {
                    advice.bind(this)(ctxt);
                }
            }
            aspectClass = AfterAspect;

            advice = jasmine.createSpy('advice').and.callFake(function (ctxt) {
                ctxt.instance.labels = ctxt.instance.labels ?? [];
                ctxt.instance.labels.push('AClass');
            });
            weaver.enable(new AfterAspect());
        });

        it('should bind this to the aspect instance', () => {
            advice = jasmine.createSpy('advice').and.callFake(function () {
                expect(this).toEqual(jasmine.any(aspectClass));
            });

            @_AClass()
            class X {}
            new X();
            expect(advice).toHaveBeenCalled();
        });
        describe('when advice returns a value', () => {
            it('should throw an error', () => {
                @Aspect('AClassLabel')
                class BadAfterAspect {
                    @After(on.class.withAnnotations(_AClass))
                    apply(ctxt: AdviceContext<any, AdviceType.CLASS>) {
                        return function () {};
                    }
                }

                weaver.enable(new BadAfterAspect());

                expect(() => {
                    @_AClass()
                    class X {}

                    new X();
                }).toThrow(
                    new Error(
                        'Error applying advice @After(@AClass) BadAfterAspect.apply() on class "X": Returning from advice is not supported',
                    ),
                );
            });
        });

        describe('creating an instance of this class', () => {
            it('should invoke the aspect', () => {
                @_AClass()
                class A implements _Labeled {}

                const instance = new A() as _Labeled;
                const labels = instance.labels;
                expect(labels).toBeDefined();
                expect(labels).toEqual(['AClass']);
            });

            it('should produce a class of the same class instance', () => {
                @_AClass()
                class A implements _Labeled {}

                const instance = new A();
                expect(instance instanceof A).toBeTrue();
            });
            it('should call the original constructor after the aspect', () => {
                @_AClass()
                class A implements _Labeled {
                    labels: string[];
                    constructor() {
                        this.labels = (this.labels ?? []).concat('ctor');
                    }
                }

                const labels = (new A() as _Labeled).labels;
                expect(labels).toBeDefined();
                expect(labels).toEqual(['ctor', 'AClass']);
            });

            it('should pass down the constructor argument', () => {
                @_AClass()
                class A implements _Labeled {
                    labels: string[];
                    constructor(lbl: string) {
                        this.labels = (this.labels ?? []).concat(lbl);
                    }
                }

                const labels = (new A('lbl') as _Labeled).labels;
                expect(labels).toBeDefined();
                expect(labels).toEqual(['lbl', 'AClass']);
            });

            describe('when the constructor throws', () => {
                it('should call the "after" advice', () => {
                    @_AClass()
                    class A {
                        constructor() {
                            throw new Error('');
                        }
                    }
                    expect(advice).not.toHaveBeenCalled();

                    try {
                        new A();
                    } catch (e) {}
                    expect(advice).toHaveBeenCalled();
                });
            });
        });
    });

    describe('applied on a property', () => {
        beforeEach(() => {
            @Aspect('APropertyLabel')
            class AfterAspect {
                @After(on.property.withAnnotations(_AProperty))
                apply(ctxt: AdviceContext<any, AdviceType.PROPERTY>): void {
                    advice.bind(this)(ctxt);
                }
            }
            aspectClass = AfterAspect;

            advice = jasmine.createSpy('advice').and.callFake(function () {});

            weaver.enable(new AfterAspect());
        });

        it('should bind this to the aspect instance', () => {
            advice = jasmine.createSpy('advice').and.callFake(function () {
                expect(this).toEqual(jasmine.any(aspectClass));
            });
            class A implements _Labeled {
                @_AProperty()
                labels?: string[];
            }

            const instance = new A() as _Labeled;
            const labels = instance.labels;

            expect(advice).toHaveBeenCalled();
        });

        describe('getting the annotated property', () => {
            it('should invoke the aspect', () => {
                class A implements _Labeled {
                    @_AProperty()
                    labels?: string[];
                }

                const instance = new A() as _Labeled;
                const labels = instance.labels;

                expect(advice).toHaveBeenCalled();
            });

            it("should return the original property's value", () => {
                class A implements _Labeled {
                    @_AProperty()
                    labels = ['a'];
                }

                const instance = new A() as _Labeled;
                const labels = instance.labels;

                expect(labels).toEqual(['a']);
            });
        });

        describe('when the advice returns a value', () => {
            it('should throw an error', () => {
                @Aspect('APropertyLabel')
                class BadAfterAspect {
                    @After(on.property.setter.withAnnotations(_AProperty))
                    apply(ctxt: AdviceContext<any, AdviceType.PROPERTY>) {
                        return Object.getOwnPropertyDescriptor({ test: 'test' }, 'test');
                    }
                }

                weaver.enable(new BadAfterAspect());
                expect(() => {
                    class X {
                        @_AProperty()
                        someProp: string;
                    }

                    new X().someProp = '';
                }).toThrow(
                    new Error(
                        'Error applying advice @After(@AProperty) BadAfterAspect.apply() on property "X.someProp": Returning from advice is not supported',
                    ),
                );
            });
        });
    });

    describe('applied on a method', () => {
        let a: _Labeled;
        beforeEach(() => {
            @Aspect('AMethod')
            class AfterAspect {
                @After(on.method.withAnnotations(_AMethod))
                apply(ctxt: AdviceContext<any, AdviceType.METHOD>): void {
                    advice.bind(this)(ctxt);
                }
            }

            aspectClass = AfterAspect;
            advice = jasmine
                .createSpy('advice')
                .and.callFake(function (ctxt: AfterContext<any, AdviceType.PROPERTY>) {});

            weaver.enable(new AfterAspect());

            class A implements _Labeled {
                @_AMethod()
                addLabel() {
                    return ['value'];
                }
            }

            a = new A() as _Labeled;
        });

        it('should bind this to the aspect instance', () => {
            advice = jasmine.createSpy('advice').and.callFake(function () {
                expect(this).toEqual(jasmine.any(aspectClass));
            });
            a.addLabel();
            expect(advice).toHaveBeenCalled();
        });

        describe('calling the method', () => {
            it('should invoke the aspect', () => {
                expect(advice).not.toHaveBeenCalled();
                a.addLabel();
                expect(advice).toHaveBeenCalled();
            });

            it("should return the original property's value", () => {
                expect(a.addLabel()).toEqual(['value']);
            });
        });

        describe('when the advice returns a value', () => {
            it('should throw an error', () => {
                @Aspect('AMethod')
                class BadAfterAspect {
                    @After(on.method.withAnnotations(_AMethod))
                    apply(ctxt: AdviceContext<any, AdviceType.PROPERTY>) {
                        return Object.getOwnPropertyDescriptor({ test: 'test' }, 'test');
                    }
                }

                weaver.enable(new BadAfterAspect());
                expect(() => {
                    class X implements _Labeled {
                        @_AMethod()
                        addLabel() {}
                    }

                    const prop = new X().addLabel();
                }).toThrow(
                    new Error(
                        'Error applying advice @After(@AMethod) BadAfterAspect.apply() on method "X.addLabel": Returning from advice is not supported',
                    ),
                );
            });
        });
    });

    xdescribe('applied on a method parameter', () => {
        describe('calling the method', () => {
            it('should invoke the aspect', () => {});

            it("should return the original property's value", () => {});
        });

        describe('when the advice returns a value', () => {
            it('should throw an error', () => {});
        });
    });
});
