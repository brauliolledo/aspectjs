import { AnnotationFactory } from './annotation.factory';

let factory: AnnotationFactory;

const FACTORY_GROUP_TEST_ID = 'testFactory';

interface Labeled {
    label: any;
}

describe('Annotation created through AnnotationFactory', () => {
    const AClassStub = function AClass(x?: string, y?: number): ClassDecorator {
        return;
    };

    const APropertyStub = function AProperty(x?: string, y?: number): PropertyDecorator {
        return;
    };

    let AClass: typeof AClassStub;
    let AProperty: typeof APropertyStub;

    beforeEach(() => {
        factory = new AnnotationFactory(FACTORY_GROUP_TEST_ID);
    });

    describe('.create(<AnnotationStub>)', () => {
        it('should return a decorator with the same name', () => {
            AClass = factory.create(AClassStub);

            expect(AClass.name).toEqual('AClass');
        });

        it(`should assign a the annotation's groupId to the factory's groupId`, () => {
            const _AClass = factory.create(AClassStub);

            expect(_AClass.groupId).toEqual(FACTORY_GROUP_TEST_ID);
        });
    });

    describe('.create(name, <AnnotationStub>)', () => {
        it('should return a decorator with the given name', () => {
            AClass = factory.create('AClass', (): ClassDecorator => undefined);

            expect(AClass.name).toEqual('AClass');
        });
    });

    describe('.create(<ClassAnnotationStub>)', () => {
        it('should return a class decorator', () => {
            AClass = factory.create(AClassStub);

            const annotation = AClass('0', 0);
            expect(annotation).toEqual(jasmine.any(Function));
            const ctor = (annotation as any)(class A {});
            expect(ctor).toEqual(jasmine.any(Function));
            expect(ctor.name).toEqual('A');
        });

        it('should keep the class instance type', () => {
            AClass = factory.create(AClassStub);

            @AClass('', 0)
            class A {
                someProp: any;
            }

            expect(new A()).toEqual(jasmine.any(A));
        });

        it(`should keep the class static properties`, () => {
            AClass = factory.create(AClassStub);

            class A {
                someProp: any;
                static someStaticProp = 'someStaticProp';
            }

            const enhancedA = (AClass('', 0)(A) as any) as typeof A;

            expect(A.someStaticProp).toBeTruthy();
            expect(enhancedA.someStaticProp).toEqual(A.someStaticProp);
        });
    });

    describe('.create(<PropertyAnnotationStub>)', () => {
        let labeled: Labeled;
        let stubSpy: jasmine.Spy;

        beforeEach(() => {
            stubSpy = jasmine.createSpy('APropertyStub', APropertyStub).and.callThrough();
            AProperty = factory.create(stubSpy);

            class A implements Labeled {
                @AProperty()
                label: any;
            }

            labeled = new A();
        });
        it('should not alter the property', () => {
            expect(labeled.label).toEqual(undefined);
            labeled.label = 'somePropValue';
            expect(labeled.label).toEqual('somePropValue');
        });

        it('should call the original annotation stub', () => {
            labeled.label = 'somePropValue';
            expect(stubSpy).toHaveBeenCalled();
        });
    });
});
