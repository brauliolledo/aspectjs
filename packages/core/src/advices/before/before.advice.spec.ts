import { Aspect, Before } from '@aspectjs/core/annotations';
import { Weaver } from '@aspectjs/weaver';
import { _AClass, _AMethod, _AParameter, _AProperty, _Labeled } from '@root/testing';
import { setupAspectTestingContext } from '@aspectjs/core/testing';
import { BeforeContext } from './before.context';
import Spy = jasmine.Spy;
import { AdviceType } from '../../advice/advice.type';
import { on } from '../../advice/pointcut';
import { AdviceContext } from '../../advice/advice.context.type';

describe('@Before advice', () => {
    let advice: Spy;
    let aspectClass: any;
    let weaver: Weaver;

    beforeEach(() => {
        advice = jasmine.createSpy('advice');
        weaver = setupAspectTestingContext().weaverContext.getWeaver();
    });

    describe('applied on a class', () => {
        const ctor = jasmine.createSpy('ctor');
        let thisInstance: any;

        beforeEach(() => {
            @Aspect('AClassLabel')
            class AAspect {
                @Before(on.class.withAnnotations(_AClass))
                applyBefore(ctxt: BeforeContext<any, AdviceType.CLASS>): void {
                    thisInstance = ctxt.instance;

                    advice.bind(this)(ctxt);
                }
            }

            aspectClass = AAspect;

            weaver.enable(new AAspect());
        });
        it('should bind this to the aspect instance', () => {
            advice = jasmine.createSpy('advice').and.callFake(function () {
                expect(this).toEqual(jasmine.any(aspectClass));
            });

            @_AClass()
            class A {}

            new A();
            expect(advice).toHaveBeenCalled();
        });

        it('should call the aspect before the constructor', () => {
            @_AClass()
            class A {
                constructor() {
                    ctor();
                }
            }

            new A();
            expect(advice).toHaveBeenCalled();
            expect(ctor).toHaveBeenCalled();
            expect(advice).toHaveBeenCalledBefore(ctor);
        });

        it('should have a "null" context.instance', () => {
            @_AClass()
            class A {
                constructor() {}
            }
            new A();

            expect(thisInstance).toBeNull();
        });

        it(`should keep constructor's "toString()" method`, () => {
            let advisedClass: any;
            {
                @_AClass()
                class A {
                    constructor() {
                        console.log('original constructor');
                    }
                    x() {}
                }
                advisedClass = A;
            }
            let nonAdvisedClass: any;
            {
                @_AClass()
                class A {
                    constructor() {
                        console.log('original constructor');
                    }
                    x() {}
                }
                nonAdvisedClass = A;
            }

            expect(advisedClass.prototype.constructor.toString()).toEqual(
                nonAdvisedClass.prototype.constructor.toString(),
            );
            expect(advisedClass.constructor.toString()).toEqual(nonAdvisedClass.constructor.toString());
        });
    });

    describe('applied on a property', () => {
        let a: _Labeled;

        beforeEach(() => {
            @Aspect('AClassLabel')
            class AAspect {
                constructor() {}
                @Before(on.property.withAnnotations(_AProperty))
                applyBefore(ctxt: AdviceContext<any, AdviceType.PROPERTY>): void {
                    advice.bind(this)(ctxt);
                }
            }
            aspectClass = AAspect;

            weaver.enable(new AAspect());

            class A implements _Labeled {
                @_AProperty()
                labels: string[] = [];
            }

            a = new A();
        });

        it('should bind this to the aspect instance', () => {
            advice = jasmine.createSpy('advice').and.callFake(function () {
                expect(this).toEqual(jasmine.any(aspectClass));
            });
            const labels = a.labels;

            expect(advice).toHaveBeenCalled();
        });

        it('should call the aspect before the property is get', () => {
            expect(advice).not.toHaveBeenCalled();
            const labels = a.labels;
            expect(advice).toHaveBeenCalled();
        });

        it('should have a non null context.instance', () => {
            let thisInstance: any;
            advice = jasmine.createSpy('beforeAdvice').and.callFake((ctxt: BeforeContext<any, any>) => {
                thisInstance = ctxt.instance;
            });
            const labels = a.labels;
            expect(thisInstance).toEqual(a);
        });
    });

    describe('applied on a property setter', () => {
        let a: _Labeled;

        beforeEach(() => {
            @Aspect('AClassLabel')
            class AAspect {
                @Before(on.property.setter.withAnnotations(_AProperty))
                applyBefore(ctxt: AdviceContext<any, AdviceType.PROPERTY>): void {
                    advice.bind(this)(ctxt);
                }
            }
            aspectClass = AAspect;

            weaver.enable(new AAspect());

            class A implements _Labeled {
                @_AProperty()
                labels: string[] = [];
            }

            a = new A();
            advice = jasmine.createSpy('beforeAdvice').and.callFake(() => {});
        });

        it('should bind this to the aspect instance', () => {
            advice = jasmine.createSpy('advice').and.callFake(function () {
                expect(this).toEqual(jasmine.any(aspectClass));
            });
            a.labels = ['set'];

            expect(advice).toHaveBeenCalled();
        });

        it('should call the aspect before the property is set', () => {
            expect(advice).not.toHaveBeenCalled();
            a.labels = ['set'];
            expect(advice).toHaveBeenCalled();
        });

        it('should have a non null context.instance', () => {
            let thisInstance: any;
            advice = jasmine.createSpy('beforeAdvice').and.callFake((ctxt: BeforeContext) => {
                thisInstance = ctxt.instance;
            });
            a.labels = [];
            expect(thisInstance).toEqual(a);
        });
    });

    describe('applied on a method', () => {
        let a: any;

        beforeEach(() => {
            @Aspect('AClassLabel')
            class AAspect {
                @Before(on.method.withAnnotations(_AMethod))
                applyBefore(ctxt: AdviceContext<any, AdviceType.METHOD>): void {
                    advice.bind(this)(ctxt);
                }
            }

            aspectClass = AAspect;
            weaver.enable(new AAspect());

            class A {
                @_AMethod()
                addLabel(): any {}
            }

            a = new A();
            advice = jasmine
                .createSpy('beforeAdvice')
                .and.callFake((ctxt: BeforeContext<any, AdviceType.METHOD>) => {});
        });

        it('should bind this to the aspect instance', () => {
            advice = jasmine.createSpy('advice').and.callFake(function () {
                expect(this).toEqual(jasmine.any(aspectClass));
            });
            a.addLabel();

            expect(advice).toHaveBeenCalled();
        });

        it('should call the aspect before the method is called', () => {
            expect(advice).not.toHaveBeenCalled();
            a.addLabel();
            expect(advice).toHaveBeenCalled();
        });

        it('should have a non null context.instance', () => {
            let thisInstance: any;
            advice = jasmine.createSpy('beforeAdvice').and.callFake((ctxt: BeforeContext<any, any>) => {
                thisInstance = ctxt.instance;
            });
            a.addLabel();
            expect(thisInstance).toEqual(a);
        });

        it(`should keep property's "toString()" method`, () => {
            let advisedInstance: _Labeled;
            {
                class A implements _Labeled {
                    @_AMethod()
                    addLabel(): any {
                        console.log('addLabels');
                    }
                }
                advisedInstance = new A();
            }
            let nonAdvisedInstance: _Labeled;
            {
                class A implements _Labeled {
                    addLabel(): any {
                        console.log('addLabels');
                    }
                }
                nonAdvisedInstance = new A();
            }

            expect(Object.getPrototypeOf(advisedInstance).addLabel.toString()).toEqual(
                Object.getPrototypeOf(nonAdvisedInstance).addLabel.toString(),
            );
        });
    });

    describe('applied on a method parameter', () => {
        let a: _Labeled;
        let methodSpy: jasmine.Spy;
        beforeEach(() => {
            @Aspect()
            class AAspect {
                @Before(on.parameter.withAnnotations(_AParameter))
                applyBefore(ctxt: AdviceContext<any, AdviceType.PARAMETER>): void {
                    advice.bind(this)(ctxt);
                }
            }
            aspectClass = AAspect;
            methodSpy = jasmine.createSpy('methodSpy');
            weaver.enable(new AAspect());

            class A {
                addLabel(@_AParameter() param: any): any {
                    methodSpy();
                }
            }

            a = new A();
            advice = jasmine
                .createSpy('beforeAdvice')
                .and.callFake((ctxt: BeforeContext<any, AdviceType.METHOD>) => {});
        });

        it('should bind "this" to the aspect instance', () => {
            advice = jasmine
                .createSpy('beforeAdvice')
                .and.callFake(function (ctxt: BeforeContext<any, AdviceType.METHOD>) {
                    expect(this).toEqual(jasmine.any(aspectClass));
                });

            a.addLabel('a');
        });

        it('should call the aspect before the method is called', () => {
            a.addLabel('a');
            expect(methodSpy).toHaveBeenCalled();
            expect(advice).toHaveBeenCalled();
            expect(advice).toHaveBeenCalledBefore(methodSpy);
        });

        it('should have a non null context.instance', () => {
            let thisInstance: any;
            advice = jasmine.createSpy('beforeAdvice').and.callFake((ctxt: BeforeContext<any, any>) => {
                thisInstance = ctxt.instance;
            });
            a.addLabel();
            expect(thisInstance).toEqual(a);
        });
    });

    describe('applied on both a method & parameter ', () => {
        let a: _Labeled;
        let methodSpy: jasmine.Spy;
        let methodAdvice: jasmine.Spy;
        let parameterAdvice: jasmine.Spy;
        beforeEach(() => {
            methodAdvice = jasmine.createSpy('methodAdvice');
            parameterAdvice = jasmine.createSpy('parameterAdvice');

            @Aspect()
            class AAspect {
                @Before(on.parameter.withAnnotations(_AParameter))
                applyBeforeParameter(ctxt: AdviceContext<any, AdviceType.PARAMETER>): void {
                    parameterAdvice.bind(this)(ctxt);
                }
                @Before(on.method.withAnnotations(_AMethod))
                applyBeforeMethod(ctxt: AdviceContext<any, AdviceType.METHOD>): void {
                    methodAdvice.bind(this)(ctxt);
                }
            }
            methodSpy = jasmine.createSpy('methodSpy');
            weaver.enable(new AAspect());

            class A {
                @_AMethod()
                addLabel(@_AParameter() param: any): any {
                    methodSpy();
                }
            }

            a = new A();
        });
        it('should call both aspects', () => {
            expect(methodAdvice).not.toHaveBeenCalled();
            expect(parameterAdvice).not.toHaveBeenCalled();

            a.addLabel('x');
            expect(methodAdvice).toHaveBeenCalled();
            expect(parameterAdvice).toHaveBeenCalled();
        });
    });
});
