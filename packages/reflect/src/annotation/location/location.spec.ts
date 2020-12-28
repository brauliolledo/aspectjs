import { AnnotationFactory } from '@aspectjs/common';
import { setupReflectTestingContext } from '@aspectjs/reflect/testing';

import { ReflectContext } from '../../context/reflect.context';
import { _AnnotationLocationImpl } from './location.factory';

import { _AMethod, _AParameter } from '@root/testing';

describe('AnnotationLocationFactory', () => {
    let reflectContext: ReflectContext;
    beforeEach(() => {
        reflectContext = setupReflectTestingContext();
    });
    class Decorated {
        value: any;

        method(...args: any[]): string {
            return undefined;
        }
    }
    const factory = new AnnotationFactory('test');

    const APropertyAnnotation = factory.create(function APropertyAnnotation() {
        // (target: Object, propertyKey: string | symbol) => void;
        return (target: Record<string, any>, propertyKey: string | symbol) => {};
    });

    describe('of([Object object])', () => {
        it('should throw an error', () => {
            const x = {
                value: 'value',
                method() {},
            };

            expect(() => reflectContext.annotations.location.of(x)).toThrow(
                new Error('given object is neither a constructor nor a class instance'),
            );
        });
    });

    describe('.of(SomeClass)', () => {
        let AClass: typeof Decorated;
        beforeEach(() => {
            AClass = class _AClass extends Decorated {
                constructor(public value: any) {
                    super();
                }
            } as any;
        });
        it('should target the class', () => {
            const location = reflectContext.annotations.location.of(AClass);
            expect(_AnnotationLocationImpl.unwrap(location).target.proto.constructor).toEqual(AClass);
        });
        it('should get a location with no value bound', () => {
            const location = reflectContext.annotations.location.of(AClass);
            expect(() => _AnnotationLocationImpl.unwrap(location).getRuntimeContext()).toThrow(
                new TypeError('location is not bound to a runtime context'),
            );
        });
    });
    describe('.of(new SomeClass())', () => {
        let AClass: typeof Decorated;
        let aClass: Decorated;
        beforeEach(() => {
            class _AClass extends Decorated {
                constructor(public value: any) {
                    super();
                }
            }
            AClass = _AClass as any;
            aClass = new _AClass('value');
        });

        it('should get the same location as .of(new SomeClass()', () => {
            const target = _AnnotationLocationImpl.unwrap(reflectContext.annotations.location.of(aClass)).target;
            expect(target).toEqual(
                _AnnotationLocationImpl.unwrap(reflectContext.annotations.location.of(AClass)).target,
            );
        });
        it('should bind value to the class instance', () => {
            const loc = reflectContext.annotations.location.of(aClass);
            expect(_AnnotationLocationImpl.unwrap(loc).getRuntimeContext().instance).toEqual(aClass);
        });
    });
    describe('.of(new SomeClass()).somePropertyWithoutAnnotation', () => {
        let aClass: Decorated;
        let AClass: typeof Decorated;
        beforeEach(() => {
            class _AClass extends Decorated {
                value: any;

                constructor(value: any) {
                    super();
                    this.value = value;
                }
            }
            AClass = _AClass as any;
            aClass = new _AClass('value');
        });
        it('should be undefined', () => {
            const loc = reflectContext.annotations.location.of(aClass).value;
            expect(loc).toBeUndefined();
        });
    });
    describe('.of(new SomeClass()).somePropertyWithAnnotations', () => {
        let aClass: Decorated;
        let AClass: typeof Decorated;
        beforeEach(() => {
            class _AClass extends Decorated {
                @APropertyAnnotation()
                value: any;

                constructor(value: any) {
                    super();
                    this.value = value;
                }
            }
            AClass = _AClass as any;
            aClass = new _AClass('value');
        });

        it('should be defined', () => {
            const loc = reflectContext.annotations.location.of(aClass).value;

            expect(loc).toBeDefined();
        });
        it('should be bound to the class instance', () => {
            const loc = reflectContext.annotations.location.of(aClass).value;
            expect(_AnnotationLocationImpl.unwrap(loc).getRuntimeContext().instance).toEqual(aClass as any);
        });
        it('should target the property', () => {
            const loc = reflectContext.annotations.location.of(aClass).value;
            const target = _AnnotationLocationImpl.unwrap(loc).target;
            expect(target.propertyKey).toEqual('value');
        });
    });

    describe('.of(new SomeClass()).someMethodWithAnnotation', () => {
        let aClass: Decorated;
        let AClass: typeof Decorated;
        beforeEach(() => {
            class _AClass extends Decorated {
                constructor(value: any) {
                    super();
                    this.value = value;
                }

                @_AMethod()
                method(): any {}
            }
            AClass = _AClass as any;
            aClass = new _AClass('value');
        });

        it('should be defined', () => {
            const loc = reflectContext.annotations.location.of(aClass).method;

            expect(loc).toBeDefined();
        });
        it("should be bound to the property's value", () => {
            const loc = reflectContext.annotations.location.of(aClass).method;
            expect(_AnnotationLocationImpl.unwrap(loc).getRuntimeContext().instance).toEqual(aClass as any);
        });
    });

    describe('.of(new SomeClass()).someMethodWithAnnotation.args', () => {
        let aClass: Decorated;
        let AClass: typeof Decorated;
        beforeEach(() => {
            class _AClass extends Decorated {
                constructor(value: any) {
                    super();
                    this.value = value;
                }

                @_AMethod()
                method(@_AParameter() a?: string): any {}
            }
            AClass = _AClass as any;
            aClass = new _AClass('value');
        });

        it('should be defined', () => {
            const loc = reflectContext.annotations.location.of(aClass).method.args;
            expect(loc).toBeDefined();
        });
        it('should be an array', () => {
            const loc = reflectContext.annotations.location.of(aClass).method.args;
            expect(loc).toEqual(jasmine.any(Array));
        });
        it('should have as many values as arguments with annotations', () => {
            const loc = reflectContext.annotations.location.of(aClass).method.args;
            expect(loc.length).toEqual(1);
        });
    });
});
