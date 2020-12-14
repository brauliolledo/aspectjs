import { WeaverContext } from '../../weaver/weaver-context';
import { AnnotationFactory } from '../../annotation/factory/annotation.factory';
import { AMethod, AParameter, setupTestingWeaverContext } from '@aspectjs/core/testing';
import { AnnotationLocationFactory } from './location.factory';
import { _AnnotationLocationImpl } from '../target/annotation-target.factory';

describe('AnnotationLocationFactory', () => {
    let weaverContext: WeaverContext;
    beforeEach(() => {
        weaverContext = setupTestingWeaverContext();
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

            expect(() => weaverContext.annotations.location.of(x)).toThrow(
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
            const location = weaverContext.annotations.location.of(AClass);
            expect(_AnnotationLocationImpl.unwrap(location).getTarget().proto.constructor).toEqual(AClass);
        });
        it('should get a location with no value bound', () => {
            const location = weaverContext.annotations.location.of(AClass);
            expect(() => _AnnotationLocationImpl.unwrap(location).getRuntimeContext()).toThrow(
                new TypeError('location is not bound to a value'),
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
            const target = _AnnotationLocationImpl.unwrap(weaverContext.annotations.location.of(aClass)).getTarget();
            expect(target).toEqual(
                _AnnotationLocationImpl.unwrap(weaverContext.annotations.location.of(AClass)).getTarget(),
            );
        });
        it('should bind value to the class instance', () => {
            const loc = weaverContext.annotations.location.of(aClass);
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
            const loc = weaverContext.annotations.location.of(aClass).value;
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
            const loc = weaverContext.annotations.location.of(aClass).value;

            expect(loc).toBeDefined();
        });
        it('should be bound to the class instance', () => {
            const loc = weaverContext.annotations.location.of(aClass).value;
            expect(_AnnotationLocationImpl.unwrap(loc).getRuntimeContext().instance).toEqual(aClass as any);
        });
        it('should target the property', () => {
            const loc = weaverContext.annotations.location.of(aClass).value;
            const target = _AnnotationLocationImpl.unwrap(loc).getTarget();
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

                @AMethod()
                method(): any {}
            }
            AClass = _AClass as any;
            aClass = new _AClass('value');
        });

        it('should be defined', () => {
            const loc = weaverContext.annotations.location.of(aClass).method;

            expect(loc).toBeDefined();
        });
        it("should be bound to the property's value", () => {
            const loc = weaverContext.annotations.location.of(aClass).method;
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

                @AMethod()
                method(@AParameter() a?: string): any {}
            }
            AClass = _AClass as any;
            aClass = new _AClass('value');
        });

        it('should be defined', () => {
            const loc = weaverContext.annotations.location.of(aClass).method.args;
            expect(loc).toBeDefined();
        });
        it('should be an array', () => {
            const loc = weaverContext.annotations.location.of(aClass).method.args;
            expect(loc).toEqual(jasmine.any(Array));
        });
        it('should have as many values as arguments with annotations', () => {
            const loc = weaverContext.annotations.location.of(aClass).method.args;
            expect(loc.length).toEqual(1);
        });
    });
});
