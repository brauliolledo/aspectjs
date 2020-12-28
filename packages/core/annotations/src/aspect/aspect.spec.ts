import {
    AdviceType,
    AfterContext,
    AfterReturnContext,
    AfterThrowContext,
    AroundContext,
    BeforeContext,
    JoinPoint,
    on,
} from '@aspectjs/core';

import { setupAspectTestingContext } from '@aspectjs/core/testing';
import { Weaver } from '@aspectjs/weaver';
import { _AClass, _AMethod, _AProperty, _BMethod, _Labeled } from '@root/testing';

import { After, AfterReturn, AfterThrow, Around, Aspect, Before, Compile } from '..';
import { Order } from '../order.annotation';
import Spy = jasmine.Spy;

describe('@Aspect', () => {
    let weaver: Weaver;
    beforeEach(() => {
        weaver = setupAspectTestingContext().weaverContext.getWeaver();
    });
    describe('with an advice', () => {
        describe('targeted with multiple pointcuts', () => {
            let advice: Spy;
            beforeEach(() => {
                advice = jasmine.createSpy('advice');
                @Aspect()
                class LabelAspect {
                    @Around(on.method.withAnnotations(_AMethod))
                    @Around(on.method.withAnnotations(_BMethod))
                    advice(ctxt: AroundContext<any, any>, jp: JoinPoint) {
                        advice();
                        jp();
                    }
                }

                weaver.enable(new LabelAspect());
            });

            describe('when pointcuts match two times', () => {
                it('should call the advice twice', () => {
                    class SomeClass {
                        @_AMethod()
                        @_BMethod()
                        someMethod() {}
                    }

                    new SomeClass().someMethod();
                    expect(advice).toHaveBeenCalled();
                    expect(advice).toHaveBeenCalledTimes(2);
                });
            });

            describe('when pointcuts match one time', () => {
                it('should call the advice once', () => {
                    class SomeClass {
                        @_BMethod()
                        someMethod() {}
                    }

                    new SomeClass().someMethod();
                    expect(advice).toHaveBeenCalled();
                    expect(advice).toHaveBeenCalledTimes(1);
                });
            });
        });
    });

    describe('that inherits from other class that define advices', () => {
        let parentMethodAdvice1: jasmine.Spy;
        let parentMethodAdvice2: jasmine.Spy;
        let childMethodAdvice: jasmine.Spy;

        beforeEach(() => {
            parentMethodAdvice1 = jasmine.createSpy('parentMethodAdvice1');
            parentMethodAdvice2 = jasmine.createSpy('parentMethodAdvice2');
            childMethodAdvice = jasmine.createSpy('parentMethodAdvice');

            class ParentClass {
                @Before(on.class.withAnnotations(_AClass))
                parentMethod1() {
                    parentMethodAdvice1('parent');
                }

                @Before(on.class.withAnnotations(_AClass))
                parentMethod2() {
                    parentMethodAdvice2('parent');
                }
            }

            @Aspect()
            class ChildClass extends ParentClass {
                @Before(on.class.withAnnotations(_AClass))
                parentMethod2() {
                    parentMethodAdvice2('child');
                }

                @After(on.class.withAnnotations(_AClass))
                childMethod() {
                    childMethodAdvice('child');
                }
            }

            weaver.enable(new ChildClass());
        });

        it('should invoke advices of parent class', () => {
            expect(parentMethodAdvice1).not.toHaveBeenCalled();
            expect(parentMethodAdvice2).not.toHaveBeenCalled();
            expect(childMethodAdvice).not.toHaveBeenCalled();

            @_AClass()
            class C {}

            new C();
            expect(parentMethodAdvice1).toHaveBeenCalledTimes(1);
            expect(parentMethodAdvice2).toHaveBeenCalledTimes(1);
            expect(childMethodAdvice).toHaveBeenCalledTimes(1);
        });

        describe('when child class overrides advice of parent class', function () {
            it('should not invoke parent advice', () => {
                expect(parentMethodAdvice2).not.toHaveBeenCalled();

                @_AClass()
                class C {}

                new C();
                expect(parentMethodAdvice2).toHaveBeenCalledTimes(1);
                expect(parentMethodAdvice2).toHaveBeenCalledWith('child');
            });
        });
    });
});

describe('given several @Aspects', () => {
    let weaver: Weaver;
    beforeEach(() => {
        weaver = setupAspectTestingContext().weaverContext.getWeaver();
    });
    let labels: string[];

    beforeEach(() => {
        labels = [];
    });

    describe('that do not specify @Order', () => {
        beforeEach(() => {
            class LabelAspect {
                constructor(public id: string) {}

                @Compile(on.class.withAnnotations(_AClass))
                compileClass(ctxt: BeforeContext<_Labeled, AdviceType.CLASS>) {
                    const id = this.id;
                    return function () {
                        labels.push(`${id}_compileClass`);
                    };
                }

                @Before(on.class.withAnnotations(_AClass))
                beforeClass(ctxt: BeforeContext<_Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_beforeClass`);
                }

                @Around(on.class.withAnnotations(_AClass))
                aroundClass(ctxt: AroundContext<_Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AroundClass.before`);
                    const r = ctxt.joinpoint();
                    labels.push(`${this.id}_AroundClass.after`);
                    return r;
                }

                @After(on.class.withAnnotations(_AClass))
                afterClass(ctxt: AfterContext<_Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AfterClass`);
                }

                @AfterReturn(on.class.withAnnotations(_AClass))
                afterReturnClass(ctxt: AfterReturnContext<_Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AfterReturnClass`);
                    return ctxt.value;
                }

                @AfterThrow(on.class.withAnnotations(_AClass))
                afterThrowClass(ctxt: AfterThrowContext<_Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AfterThrowClass`);
                    throw ctxt.error;
                }

                @Compile(on.property.withAnnotations(_AProperty))
                compileProperty(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    const id = this.id;

                    return {
                        get() {
                            labels.push(`${id}_compilePropertyGet`);
                        },
                        set() {
                            labels.push(`${id}_compilePropertySet`);
                        },
                    };
                }
                @Before(on.property.withAnnotations(_AProperty))
                beforeProperty(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_beforePropertyGet`);
                }

                @Around(on.property.withAnnotations(_AProperty))
                aroundProperty(ctxt: AroundContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AroundPropertyGet.before`);
                    const r = ctxt.joinpoint();
                    labels.push(`${this.id}_AroundPropertyGet.after`);
                    return r;
                }

                @After(on.property.withAnnotations(_AProperty))
                afterProperty(ctxt: AfterContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterPropertyGet`);
                }

                @AfterReturn(on.property.withAnnotations(_AProperty))
                afterReturnProperty(ctxt: AfterReturnContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterReturnPropertyGet`);
                    return ctxt.value;
                }

                @AfterThrow(on.property.withAnnotations(_AProperty))
                afterThrowProperty(ctxt: AfterThrowContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterThrowPropertyGet`);
                    throw ctxt.error;
                }

                @Before(on.property.setter.withAnnotations(_AProperty))
                beforePropertySet(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_beforePropertySet`);
                }

                @Around(on.property.setter.withAnnotations(_AProperty))
                aroundPropertySet(ctxt: AroundContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AroundPropertySet.before`);
                    const r = ctxt.joinpoint();
                    labels.push(`${this.id}_AroundPropertySet.after`);
                    return r;
                }

                @After(on.property.setter.withAnnotations(_AProperty))
                afterPropertySet(ctxt: AfterContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterPropertySet`);
                }

                @AfterReturn(on.property.setter.withAnnotations(_AProperty))
                afterReturnPropertySet(ctxt: AfterReturnContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterReturnPropertySet`);
                }

                @AfterThrow(on.property.setter.withAnnotations(_AProperty))
                afterThrowPropertySet(ctxt: AfterThrowContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterThrowPropertySet`);
                    throw ctxt.error;
                }
            }

            @Aspect()
            class ALabelAspect extends LabelAspect {
                constructor() {
                    super('A');
                }
            }

            @Aspect()
            class BLabelAspect extends LabelAspect {
                constructor() {
                    super('B');
                }
            }
            weaver.enable(new ALabelAspect(), new BLabelAspect());
        });

        describe('constructing a class instance', () => {
            let A: any;

            beforeEach(() => {
                @_AClass()
                class A_ {
                    @_AProperty()
                    labels: string[];
                }

                A = A_;
            });

            it('should apply advices across all aspects in order', () => {
                expect(labels).toEqual([]);
                const a = new A();
                const expectedLabels = [
                    'A_AroundClass.before',
                    'B_AroundClass.before',
                    'A_beforeClass',
                    'B_beforeClass',
                    'B_compileClass',
                    'B_AfterReturnClass',
                    'A_AfterReturnClass',
                    'B_AfterClass',
                    'A_AfterClass',
                    'B_AroundClass.after',
                    'A_AroundClass.after',
                    // 'A_AfterThrowClass',
                    // 'B_AfterThrowClass',
                ];

                expect(labels).toEqual(expectedLabels);

                console.log(a.labels);
                expectedLabels.push(
                    'A_AroundPropertyGet.before',
                    'B_AroundPropertyGet.before',
                    'A_beforePropertyGet',
                    'B_beforePropertyGet',
                    'B_compilePropertyGet',
                    'B_AfterReturnPropertyGet',
                    'A_AfterReturnPropertyGet',
                    'B_AfterPropertyGet',
                    'A_AfterPropertyGet',
                    'B_AroundPropertyGet.after',
                    'A_AroundPropertyGet.after',

                    // 'A_AfterThrowPropertyGet',
                    // 'B_AfterThrowPropertyGet',
                );

                expect(labels).toEqual(expectedLabels);
                a.labels = [];

                expectedLabels.push(
                    'A_AroundPropertySet.before',
                    'B_AroundPropertySet.before',
                    'A_beforePropertySet',
                    'B_beforePropertySet',
                    'B_compilePropertySet',
                    'B_AfterReturnPropertySet',
                    'A_AfterReturnPropertySet',
                    'B_AfterPropertySet',
                    'A_AfterPropertySet',
                    'B_AroundPropertySet.after',
                    'A_AroundPropertySet.after',

                    // 'A_AfterThrowPropertySet',
                    // 'B_AfterThrowPropertySet',
                );

                expect(labels).toEqual(expectedLabels);
            });
        });
    });
    describe('when the advices specify an @Order', () => {
        let a: _Labeled;
        beforeEach(() => {
            @Aspect()
            class AAspect {
                @Order(10)
                @Before(on.class.withAnnotations(_AClass))
                beforeProperty(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_beforeClass');
                }

                @Order(10)
                @Around(on.property.withAnnotations(_AProperty))
                aroundProperty(ctxt: AroundContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('A_AroundPropertyGet.after');
                    return r;
                }
            }
            @Aspect()
            class BAspect {
                @Order(9)
                @Before(on.class.withAnnotations(_AClass))
                beforeProperty(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_beforeClass');
                }

                @Order(9)
                @Around(on.property.withAnnotations(_AProperty))
                aroundProperty(ctxt: AroundContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('B_AroundPropertyGet.after');
                    return r;
                }
            }
            weaver.enable(new AAspect(), new BAspect());
        });
        it('should call the advices in order of precedence', () => {
            @_AClass()
            class A implements _Labeled {
                @_AProperty()
                labels: string[];
            }

            expect(labels).toEqual([]);
            a = new A();
            expect(labels).toEqual(['B_beforeClass', 'A_beforeClass']);
            console.log(a.labels);
            expect(labels).toEqual([
                'B_beforeClass',
                'A_beforeClass',
                'B_AroundPropertyGet.before',
                'A_AroundPropertyGet.before',
                'A_AroundPropertyGet.after',
                'B_AroundPropertyGet.after',
            ]);
        });
    });
    describe('when the aspects specify an @Order', () => {
        let a: _Labeled;
        beforeEach(() => {
            @Aspect()
            @Order(0)
            class AAspect {
                @Before(on.class.withAnnotations(_AClass))
                beforeProperty(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_beforeClass');
                }

                @Around(on.property.withAnnotations(_AProperty))
                aroundProperty(ctxt: AroundContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('A_AroundPropertyGet.after');
                    return r;
                }
            }
            @Order(1)
            @Aspect()
            class BAspect {
                @Before(on.class.withAnnotations(_AClass))
                beforeProperty(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_beforeClass');
                }

                @Around(on.property.withAnnotations(_AProperty))
                aroundProperty(ctxt: AroundContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('B_AroundPropertyGet.after');
                    return r;
                }
            }

            @Order(Order.HIGHEST_PRECEDENCE)
            @Aspect()
            class CAspect {
                @Before(on.class.withAnnotations(_AClass))
                beforeProperty(ctxt: BeforeContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('C_beforeClass');
                }

                @Around(on.property.withAnnotations(_AProperty))
                aroundProperty(ctxt: AroundContext<_Labeled, AdviceType.PROPERTY>) {
                    labels.push('C_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('C_AroundPropertyGet.after');
                    return r;
                }
            }
            weaver.enable(new AAspect(), new BAspect(), new CAspect());
        });
        it('should call the advices in order of precedence', () => {
            @_AClass()
            class A implements _Labeled {
                @_AProperty()
                labels: string[];
            }

            expect(labels).toEqual([]);
            a = new A();
            expect(labels).toEqual(['C_beforeClass', 'A_beforeClass', 'B_beforeClass']);
            console.log(a.labels);
            expect(labels).toEqual([
                'C_beforeClass',
                'A_beforeClass',
                'B_beforeClass',

                'C_AroundPropertyGet.before',
                'A_AroundPropertyGet.before',
                'B_AroundPropertyGet.before',

                'B_AroundPropertyGet.after',
                'A_AroundPropertyGet.after',
                'C_AroundPropertyGet.after',
            ]);
        });
    });
});
