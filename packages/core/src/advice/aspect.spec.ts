import { Before } from './before/before.annotation';
import { on } from './pointcut';
import { AfterContext, AfterReturnContext, AfterThrowContext, AroundContext, BeforeContext } from './advice-context';
import { AClass, AMethod, AProperty, BMethod, Labeled, setupWeaver } from '../../testing/src/helpers';
import { Around } from './around/around.annotation';
import { After } from './after/after.annotation';
import { AfterReturn } from './after-return/after-return.annotation';
import { AfterThrow } from './after-throw/after-throw.annotation';
import { Aspect } from './aspect';
import { Compile } from './compile/compile.annotation';
import Spy = jasmine.Spy;
import { JoinPoint } from '../weaver/types';
import { AdviceType } from './types';

describe('@Aspect', () => {
    beforeEach(() => setupWeaver());
    describe('with an advice', () => {
        describe('targeted with multiple pointcuts', () => {
            let advice: Spy;
            beforeEach(() => {
                advice = jasmine.createSpy('advice');
                @Aspect()
                class LabelAspect {
                    @Around(on.method.withAnnotations(AMethod))
                    @Around(on.method.withAnnotations(BMethod))
                    advice(ctxt: AroundContext<any, any>, jp: JoinPoint) {
                        advice();
                        jp();
                    }
                }

                setupWeaver(new LabelAspect());
            });

            describe('when pointcuts match two times', () => {
                it('should call the advice twice', () => {
                    class SomeClass {
                        @AMethod()
                        @BMethod()
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
                        @BMethod()
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
                @Before(on.class.withAnnotations(AClass))
                parentMethod1() {
                    parentMethodAdvice1('parent');
                }

                @Before(on.class.withAnnotations(AClass))
                parentMethod2() {
                    parentMethodAdvice2('parent');
                }
            }

            @Aspect()
            class ChildClass extends ParentClass {
                @Before(on.class.withAnnotations(AClass))
                parentMethod2() {
                    parentMethodAdvice2('child');
                }

                @After(on.class.withAnnotations(AClass))
                childMethod() {
                    childMethodAdvice('child');
                }
            }

            setupWeaver(new ChildClass());
        });

        it('should invoke advices of parent class', () => {
            expect(parentMethodAdvice1).not.toHaveBeenCalled();
            expect(childMethodAdvice).not.toHaveBeenCalled();

            @AClass()
            class C {}

            new C();
            expect(parentMethodAdvice1).toHaveBeenCalledTimes(1);
            expect(childMethodAdvice).toHaveBeenCalledTimes(1);
        });

        describe('when child class overrides advice of parent class', function () {
            it('should not invoke parent advice', () => {
                expect(parentMethodAdvice2).not.toHaveBeenCalled();

                @AClass()
                class C {}

                new C();
                expect(parentMethodAdvice2).toHaveBeenCalledTimes(1);
                expect(parentMethodAdvice2).toHaveBeenCalledWith('child');
            });
        });
    });
});

describe('given several @Aspects', () => {
    let labels: string[];

    beforeEach(() => {
        labels = [];
    });

    describe('that do not specify a priority', () => {
        beforeEach(() => {
            @Aspect()
            class LabelAspect {
                constructor(public id: string) {}

                @Compile(on.class.withAnnotations(AClass))
                compileClass(ctxt: BeforeContext<Labeled, AdviceType.CLASS>) {
                    const id = this.id;
                    return function () {
                        labels.push(`${id}_compileClass`);
                    };
                }

                @Before(on.class.withAnnotations(AClass))
                beforeClass(ctxt: BeforeContext<Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_beforeClass`);
                }

                @Around(on.class.withAnnotations(AClass))
                aroundClass(ctxt: AroundContext<Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AroundClass.before`);
                    const r = ctxt.joinpoint();
                    labels.push(`${this.id}_AroundClass.after`);
                    return r;
                }

                @After(on.class.withAnnotations(AClass))
                afterClass(ctxt: AfterContext<Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AfterClass`);
                }

                @AfterReturn(on.class.withAnnotations(AClass))
                afterReturnClass(ctxt: AfterReturnContext<Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AfterReturnClass`);
                    return ctxt.value;
                }

                @AfterThrow(on.class.withAnnotations(AClass))
                afterThrowClass(ctxt: AfterThrowContext<Labeled, AdviceType.CLASS>) {
                    labels.push(`${this.id}_AfterThrowClass`);
                    throw ctxt.error;
                }

                @Compile(on.property.withAnnotations(AProperty))
                compileProperty(ctxt: BeforeContext<Labeled, AdviceType.PROPERTY>) {
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
                @Before(on.property.withAnnotations(AProperty))
                beforeProperty(ctxt: BeforeContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_beforePropertyGet`);
                }

                @Around(on.property.withAnnotations(AProperty))
                aroundProperty(ctxt: AroundContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AroundPropertyGet.before`);
                    const r = ctxt.joinpoint();
                    labels.push(`${this.id}_AroundPropertyGet.after`);
                    return r;
                }

                @After(on.property.withAnnotations(AProperty))
                afterProperty(ctxt: AfterContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterPropertyGet`);
                }

                @AfterReturn(on.property.withAnnotations(AProperty))
                afterReturnProperty(ctxt: AfterReturnContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterReturnPropertyGet`);
                    return ctxt.value;
                }

                @AfterThrow(on.property.withAnnotations(AProperty))
                afterThrowProperty(ctxt: AfterThrowContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterThrowPropertyGet`);
                    throw ctxt.error;
                }

                @Before(on.property.setter.withAnnotations(AProperty))
                beforePropertySet(ctxt: BeforeContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_beforePropertySet`);
                }

                @Around(on.property.setter.withAnnotations(AProperty))
                aroundPropertySet(ctxt: AroundContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AroundPropertySet.before`);
                    const r = ctxt.joinpoint();
                    labels.push(`${this.id}_AroundPropertySet.after`);
                    return r;
                }

                @After(on.property.setter.withAnnotations(AProperty))
                afterPropertySet(ctxt: AfterContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterPropertySet`);
                }

                @AfterReturn(on.property.setter.withAnnotations(AProperty))
                afterReturnPropertySet(ctxt: AfterReturnContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterReturnPropertySet`);
                }

                @AfterThrow(on.property.setter.withAnnotations(AProperty))
                afterThrowPropertySet(ctxt: AfterThrowContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push(`${this.id}_AfterThrowPropertySet`);
                    throw ctxt.error;
                }
            }

            setupWeaver(new LabelAspect('A'), new LabelAspect('B'));
        });

        describe('constructing a class instance', () => {
            let A: any;

            beforeEach(() => {
                @AClass()
                class A_ {
                    @AProperty()
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
                    'A_AfterReturnClass',
                    'B_AfterReturnClass',
                    'A_AfterClass',
                    'B_AfterClass',
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
                    'A_AfterReturnPropertyGet',
                    'B_AfterReturnPropertyGet',
                    'A_AfterPropertyGet',
                    'B_AfterPropertyGet',
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
                    'A_AfterReturnPropertySet',
                    'B_AfterReturnPropertySet',
                    'A_AfterPropertySet',
                    'B_AfterPropertySet',
                    'B_AroundPropertySet.after',
                    'A_AroundPropertySet.after',

                    // 'A_AfterThrowPropertySet',
                    // 'B_AfterThrowPropertySet',
                );

                expect(labels).toEqual(expectedLabels);
            });
        });
    });
    describe('when the advices specify a priority', () => {
        let a: Labeled;
        beforeEach(() => {
            @Aspect()
            class AAspect {
                @Before(on.class.withAnnotations(AClass), { priority: 10 })
                beforeProperty(ctxt: BeforeContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_beforeClass');
                }

                @Around(on.property.withAnnotations(AProperty), { priority: 10 })
                aroundProperty(ctxt: AroundContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('A_AroundPropertyGet.after');
                    return r;
                }
            }
            @Aspect()
            class BAspect {
                @Before(on.class.withAnnotations(AClass), { priority: 20 })
                beforeProperty(ctxt: BeforeContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_beforeClass');
                }

                @Around(on.property.withAnnotations(AProperty), { priority: 20 })
                aroundProperty(ctxt: AroundContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('B_AroundPropertyGet.after');
                    return r;
                }
            }
            setupWeaver(new AAspect(), new BAspect());
        });
        it('should call the advices in priority order', () => {
            @AClass()
            class A implements Labeled {
                @AProperty()
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
    describe('when the aspects specify a priority', () => {
        let a: Labeled;
        beforeEach(() => {
            @Aspect({ priority: 10 })
            class AAspect {
                @Before(on.class.withAnnotations(AClass))
                beforeProperty(ctxt: BeforeContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_beforeClass');
                }

                @Around(on.property.withAnnotations(AProperty))
                aroundProperty(ctxt: AroundContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('A_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('A_AroundPropertyGet.after');
                    return r;
                }
            }
            @Aspect({ priority: 20 })
            class BAspect {
                @Before(on.class.withAnnotations(AClass))
                beforeProperty(ctxt: BeforeContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_beforeClass');
                }

                @Around(on.property.withAnnotations(AProperty))
                aroundProperty(ctxt: AroundContext<Labeled, AdviceType.PROPERTY>) {
                    labels.push('B_AroundPropertyGet.before');
                    const r = ctxt.joinpoint();
                    labels.push('B_AroundPropertyGet.after');
                    return r;
                }
            }
            setupWeaver(new AAspect(), new BAspect());
        });
        it('should call the advices in priority order', () => {
            @AClass()
            class A implements Labeled {
                @AProperty()
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
});
