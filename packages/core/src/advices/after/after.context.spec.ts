import { _AClass, _AMethod, _AParameter, _AProperty, _BClass, _BMethod, _BParameter, _BProperty } from '@root/testing';
import { Weaver } from '@aspectjs/weaver';
import { AfterContext, AdviceType, AdviceContext, AfterReturnContext, on } from '../../..';
import { setupAspectTestingContext } from '../../../testing';
import { Aspect, Order, After } from '../../../annotations';

describe('AfterReturnContext', () => {
    let weaver: Weaver;
    let afterAAdvice = jasmine.createSpy('afterAAdvice');
    let afterBAdvice = jasmine.createSpy('afterBAdvice');

    beforeEach(() => {
        weaver = setupAspectTestingContext().weaverContext.getWeaver();
        afterAAdvice = jasmine.createSpy('afterAAdvice');
        afterBAdvice = jasmine.createSpy('afterBAdvice');
    });

    describe('on a class', () => {
        let classAspectB: any;
        beforeEach(() => {
            @Aspect()
            class ClassAspectA {
                @Order(1)
                @After(on.class.withAnnotations(_AClass))
                afterA(ctxt: AfterContext<any, AdviceType.PROPERTY>): void {
                    afterAAdvice(ctxt);
                }
            }
            @Aspect()
            class ClassAspectB {
                @Order(0)
                @After(on.class.withAnnotations(_BClass))
                afterB(ctxt: AfterContext<any, AdviceType.PROPERTY>): void {
                    afterBAdvice(ctxt);
                }
            }
            classAspectB = ClassAspectB;
            weaver.enable(new ClassAspectA(), new ClassAspectB());
        });
        describe('attribute "ctxt.data"', () => {
            let data: any;

            function pushData(ctxt: AdviceContext<any, any>, message: string): void {
                data = ctxt.data;
                ctxt.data.advices = ctxt.data.advices ?? [];
                ctxt.data.advices.push(message);
            }

            beforeEach(() => {
                data = null;

                afterAAdvice.and.callFake((ctxt) => pushData(ctxt, 'afterA'));
                afterBAdvice.and.callFake((ctxt) => pushData(ctxt, 'afterB'));
            });
            it('should be shared across two @After advices on the same class', () => {
                @_AClass()
                @_BClass()
                class Test {}
                new Test();
                expect(afterAAdvice).toHaveBeenCalled();
                expect(afterBAdvice).toHaveBeenCalled();
                expect(data.advices).toEqual(['afterA', 'afterB']);
            });

            it('should not be shared across two @After advices on different classes', () => {
                @_AClass()
                class Test1 {}
                new Test1();
                expect(data.advices).toEqual(['afterA']);
                @_BClass()
                class Test2 {}
                new Test2();

                expect(data.advices).toEqual(['afterB']);
            });
        });
    });

    describe('on a property', () => {
        let propertyAspectB: any;
        beforeEach(() => {
            @Aspect()
            class PropertyAspectA {
                @Order(1)
                @After(on.property.withAnnotations(_AProperty))
                afterA(ctxt: AfterContext<any, AdviceType.CLASS>): void {
                    afterAAdvice(ctxt);
                }
            }
            @Aspect()
            class PropertyAspectB {
                @Order(0)
                @After(on.property.withAnnotations(_BProperty))
                afterB(ctxt: AfterContext<any, AdviceType.CLASS>): void {
                    afterBAdvice(ctxt);
                }
            }
            propertyAspectB = PropertyAspectB;
            weaver.enable(new PropertyAspectA(), new PropertyAspectB());
        });
        describe('attribute "ctxt.data"', () => {
            let data: any;

            function pushData(ctxt: AdviceContext<any, any>, message: string): void {
                data = ctxt.data;
                ctxt.data.advices = ctxt.data.advices ?? [];
                ctxt.data.advices.push(message);
            }

            beforeEach(() => {
                data = null;

                afterAAdvice.and.callFake((ctxt: AfterReturnContext<any, any>) => pushData(ctxt, 'afterA'));
                afterBAdvice.and.callFake((ctxt: AfterReturnContext<any, any>) => pushData(ctxt, 'afterB'));
            });
            it('should be shared across two @After advices on the same property', () => {
                class Test {
                    @_AProperty()
                    @_BProperty()
                    prop: any;
                }

                [afterAAdvice, afterBAdvice].forEach((f) => expect(f).not.toHaveBeenCalled());
                new Test().prop;
                [afterAAdvice, afterBAdvice].forEach((f) => expect(f).toHaveBeenCalled());
                expect(data.advices).toEqual(['afterA', 'afterB']);
            });

            it('should not be shared across two @After advices on different properties', () => {
                @_AClass()
                class Test {
                    @_AProperty()
                    prop1: any;
                    @_BProperty()
                    prop2: any;
                }
                const t = new Test();

                [afterAAdvice, afterBAdvice].forEach((f) => expect(f).not.toHaveBeenCalled());
                t.prop1;
                t.prop2;
                [afterAAdvice, afterBAdvice].forEach((f) => expect(f).toHaveBeenCalled());

                expect(data.advices).toEqual(['afterB']);
            });
        });
    });

    describe('on a property setter', () => {
        let propertyAspectB: any;
        beforeEach(() => {
            @Aspect()
            class PropertyAspectA {
                @Order(1)
                @After(on.property.setter.withAnnotations(_AProperty))
                afterA(ctxt: AfterContext<any, AdviceType.CLASS>): void {
                    afterAAdvice(ctxt);
                }
            }
            @Aspect()
            class PropertyAspectB {
                @Order(0)
                @After(on.property.setter.withAnnotations(_BProperty))
                afterB(ctxt: AfterContext<any, AdviceType.CLASS>): void {
                    afterBAdvice(ctxt);
                }
            }
            propertyAspectB = PropertyAspectB;
            weaver.enable(new PropertyAspectA(), new PropertyAspectB());
        });
        describe('attribute "ctxt.data"', () => {
            let data: any;

            function pushData(ctxt: AdviceContext<any, any>, message: string): void {
                data = ctxt.data;
                ctxt.data.advices = ctxt.data.advices ?? [];
                ctxt.data.advices.push(message);
            }

            beforeEach(() => {
                data = null;

                afterAAdvice.and.callFake((ctxt: AfterReturnContext<any, any>) => {
                    pushData(ctxt, 'afterA');
                });
                afterBAdvice.and.callFake((ctxt: AfterReturnContext<any, any>) => {
                    pushData(ctxt, 'afterB');
                });
            });
            it('should be shared across two @After advices on the same property', () => {
                class Test {
                    @_AProperty()
                    @_BProperty()
                    prop: any;
                }
                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).not.toHaveBeenCalled());
                new Test().prop = 'toto';
                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).toHaveBeenCalled());
                expect(data.advices).toEqual(['afterA', 'afterB']);
            });

            it('should not be shared across two @After advices on different properties', () => {
                @_AClass()
                class Test {
                    @_AProperty()
                    prop1: any;

                    @_BProperty()
                    prop2: any;
                }

                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).not.toHaveBeenCalled());
                const t = new Test();
                t.prop1 = 'toto';
                t.prop2 = 'toto';
                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).toHaveBeenCalled());

                expect(data.advices).toEqual(['afterB']);
            });
        });
    });

    describe('on a method', () => {
        let methodAspectB: any;
        beforeEach(() => {
            @Aspect()
            class PropertyAspectA {
                @Order(1)
                @After(on.method.withAnnotations(_AMethod))
                afterA(ctxt: AfterContext<any, AdviceType.METHOD>): void {
                    afterAAdvice(ctxt);
                }
            }
            @Aspect()
            class PropertyAspectB {
                @Order(0)
                @After(on.method.withAnnotations(_BMethod))
                afterB(ctxt: AfterContext<any, AdviceType.METHOD>): void {
                    afterBAdvice(ctxt);
                }
            }
            methodAspectB = PropertyAspectB;
            weaver.enable(new PropertyAspectA(), new PropertyAspectB());
        });
        describe('attribute "ctxt.data"', () => {
            let data: any;

            function pushData(ctxt: AdviceContext<any, any>, message: string): void {
                data = ctxt.data;
                ctxt.data.advices = ctxt.data.advices ?? [];
                ctxt.data.advices.push(message);
            }

            beforeEach(() => {
                data = null;

                afterAAdvice.and.callFake((ctxt) => pushData(ctxt, 'afterA'));
                afterBAdvice.and.callFake((ctxt) => pushData(ctxt, 'afterB'));
            });

            it('should be shared across two @After advices on the same method', () => {
                class Test {
                    @_AMethod()
                    @_BMethod()
                    someMethod(): any {}
                }
                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).not.toHaveBeenCalled());
                new Test().someMethod();
                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).toHaveBeenCalled());

                expect(data.advices).toEqual(['afterA', 'afterB']);
            });

            it('should not be shared across two @After advices on different method', () => {
                @_AClass()
                class Test {
                    @_AMethod()
                    method1(): any {}

                    @_BMethod()
                    method2(): any {}
                }

                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).not.toHaveBeenCalled());
                const t = new Test();
                t.method1();
                t.method2();
                [afterAAdvice, afterBAdvice].forEach((fn) => expect(fn).toHaveBeenCalled());

                expect(data.advices).toEqual(['afterB']);
            });
        });
    });

    describe('on a parameter', () => {
        beforeEach(() => {
            @Aspect()
            class ParameterAspectA {
                @Order(1)
                @After(on.parameter.withAnnotations(_AParameter))
                afterA(ctxt: AfterContext<any, AdviceType.PARAMETER>): void {
                    afterAAdvice(ctxt);
                }
            }
            @Aspect()
            class ParameterAspectB {
                @Order(0)
                @After(on.parameter.withAnnotations(_BParameter))
                afterB(ctxt: AfterContext<any, AdviceType.PARAMETER>): void {
                    afterBAdvice(ctxt);
                }
            }
            weaver.enable(new ParameterAspectA(), new ParameterAspectB());
        });
        describe('attribute "ctxt.data"', () => {
            let data: any;

            function pushData(ctxt: AdviceContext<any, any>, message: string) {
                data = ctxt.data;
                ctxt.data.advices = ctxt.data.advices ?? [];
                ctxt.data.advices.push(message);
            }

            beforeEach(() => {
                data = null;

                afterAAdvice.and.callFake((ctxt) => pushData(ctxt, 'afterA'));
                afterBAdvice.and.callFake((ctxt) => pushData(ctxt, 'afterB'));
            });
            it('should be shared across two @After advices on the same parameter', () => {
                class Test {
                    someMethod(@_AParameter() @_BParameter() param: any): any {}
                }

                new Test().someMethod('');

                expect(data.advices).toEqual(['afterA', 'afterB']);
            });

            it('should not be shared across two @After advices on different parameters', () => {
                class Test {
                    someMethod(@_AParameter() paramA: any, @_BParameter() paramB: any): any {}
                }
                new Test().someMethod('', '');

                expect(data.advices).toEqual(['afterA']);
            });
        });
    });
});
