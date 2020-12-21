import { RootAnnotationsBundle } from './bundle';

import {
    setupTestingReflectContext,
    _AClass,
    _BClass,
    _CClass,
    _DClass,
    _AProperty,
    _BProperty,
    _CProperty,
    _DProperty,
    _AMethod,
    _BMethod,
    _AParameter,
    _BParameter,
    _CMethod,
    _DMethod,
    _CParameter,
    _DParameter,
    _XProperty,
    _XClass,
    _XMethod,
    _XParameter,
} from '@aspectjs/reflect/testing';

import { ReflectContext } from '../../context/reflect.context';

describe('RootAnnotationsBundle', () => {
    let rootBundle: RootAnnotationsBundle;
    let reflectContext: ReflectContext;
    beforeEach(() => {
        reflectContext = setupTestingReflectContext();
        rootBundle = reflectContext.annotations.bundle;
    });

    class Empty {
        somePropAB: string;
        somePropCD: string;

        someMethodAB(...args: any[]) {}
        someMethodCD(...args: any[]) {}
    }

    const empty = new Empty();
    let abcd: Empty;
    let x: Empty;
    beforeEach(() => {
        @_AClass()
        @_BClass()
        @_CClass()
        @_DClass()
        class _ABCD extends Empty {
            @_AProperty()
            @_BProperty()
            somePropAB: any;

            @_CProperty()
            @_DProperty()
            somePropCD: any;

            @_AMethod()
            @_BMethod()
            someMethodAB(@_AParameter() @_BParameter() arg1: any, @_AParameter() @_BParameter() arg2: any) {}

            @_CMethod()
            @_DMethod()
            someMethodCD(@_CParameter() @_DParameter() arg1: any, @_CParameter() @_DParameter() arg2: any) {}
        }

        abcd = new _ABCD();
        abcd.somePropAB = 'somePropABValue';
        abcd.somePropCD = 'somePropCDValue';

        @_XClass()
        class X extends _ABCD {
            @_XProperty()
            somePropAB: any;

            @_XMethod()
            someMethodAB(@_XParameter() arg1: any) {}
        }

        x = new X();
    });

    describe('all()', () => {
        it('should give all annotations across all symbols', () => {
            const annotationsName = rootBundle.all().map((a) => a.name);
            expect(annotationsName).toContain(_AClass.name);
            expect(annotationsName).toContain(_XClass.name);
            expect(annotationsName).toContain(_AParameter.name);
            expect(annotationsName).toContain(_XParameter.name);
            expect(annotationsName).toContain(_AProperty.name);
            expect(annotationsName).toContain(_XProperty.name);
            expect(annotationsName).toContain(_AMethod.name);
            expect(annotationsName).toContain(_XMethod.name);
        });
    });
    describe('all(Annotation)', () => {
        it('should give all annotations across all symbols', () => {
            const annotationsName = rootBundle.all(_AClass, _XParameter).map((a) => a.name);
            expect(annotationsName).toContain(_AClass.name);
            expect(annotationsName).not.toContain(_XClass.name);
            expect(annotationsName).not.toContain(_AParameter.name);
            expect(annotationsName).toContain(_XParameter.name);
            expect(annotationsName).not.toContain(_AProperty.name);
            expect(annotationsName).not.toContain(_XProperty.name);
            expect(annotationsName).not.toContain(_AMethod.name);
            expect(annotationsName).not.toContain(_XMethod.name);
        });
    });
    describe('.at(classLocation)', () => {
        function emptyClassBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(Empty));
        }

        function abcdClassBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(abcd));
        }

        function xClassBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(x));
        }
        describe('.all()', () => {
            describe('when located class uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(Object.keys(emptyClassBundle().all()).length).toEqual(0);
                });
            });
            describe('when located class uses some annotations', () => {
                it('should return all class, properties , methods & parameters annotations', () => {
                    const annotations = abcdClassBundle().all();
                    expect(annotations.length).toEqual(20);
                    const annotationsName = annotations.map((c) => c.name);
                    expect(annotationsName).toContain(_AClass.name);
                    expect(annotationsName).toContain(_BClass.name);
                    expect(annotationsName).toContain(_DClass.name);
                    expect(annotationsName).toContain(_DClass.name);
                    expect(annotationsName).toContain(_AParameter.name);
                    expect(annotationsName).toContain(_BParameter.name);
                    expect(annotationsName).toContain(_CParameter.name);
                    expect(annotationsName).toContain(_DParameter.name);
                    expect(annotationsName).toContain(_AProperty.name);
                    expect(annotationsName).toContain(_BProperty.name);
                    expect(annotationsName).toContain(_CProperty.name);
                    expect(annotationsName).toContain(_DProperty.name);
                    expect(annotationsName).toContain(_AMethod.name);
                    expect(annotationsName).toContain(_BMethod.name);
                    expect(annotationsName).toContain(_CMethod.name);
                    expect(annotationsName).toContain(_DMethod.name);
                });
            });

            describe('when parent of located class uses some annotations', () => {
                it('should return all class, properties , methods & parameters annotations of parent class', () => {
                    const annotations = xClassBundle().all();
                    expect(annotations.length).toEqual(24);
                    const annotationsName = annotations.map((c) => c.name);
                    expect(annotationsName).toContain(_XClass.name);
                    expect(annotationsName).toContain(_XMethod.name);
                    expect(annotationsName).toContain(_XProperty.name);
                    expect(annotationsName).toContain(_XParameter.name);
                    expect(annotationsName).toContain(_AClass.name);
                    expect(annotationsName).toContain(_BClass.name);
                    expect(annotationsName).toContain(_DClass.name);
                    expect(annotationsName).toContain(_DClass.name);
                    expect(annotationsName).toContain(_AParameter.name);
                    expect(annotationsName).toContain(_BParameter.name);
                    expect(annotationsName).toContain(_CParameter.name);
                    expect(annotationsName).toContain(_DParameter.name);
                    expect(annotationsName).toContain(_AProperty.name);
                    expect(annotationsName).toContain(_BProperty.name);
                    expect(annotationsName).toContain(_CProperty.name);
                    expect(annotationsName).toContain(_DProperty.name);
                    expect(annotationsName).toContain(_AMethod.name);
                    expect(annotationsName).toContain(_BMethod.name);
                    expect(annotationsName).toContain(_CMethod.name);
                    expect(annotationsName).toContain(_DMethod.name);
                });
            });
        });

        describe('.all(Annotation)', () => {
            describe('when specified annotation does not exists within the class', () => {
                it('should return an empty array', () => {
                    expect(abcdClassBundle().all(_XClass)).toEqual([]);
                });
            });

            describe('when specified a CLASS annotation that exists on the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().all(_AClass);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AClass.name);
                });
            });

            describe('when specified a METHOD annotation that exists within the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().all(_AMethod);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AMethod.name);
                });
            });

            describe('when specified a PROPERTY annotation that exists within the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().all(_AProperty);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AProperty.name);
                });
            });

            describe('when specified a PARAMETER annotation that exists within the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().all(_AParameter);
                    expect(annotations.length).toEqual(2);
                    expect(annotations.map((a) => a.name)).toEqual([_AParameter.name, _AParameter.name]);
                });
            });
        });
        describe('.onProperty()', () => {
            describe('when located property uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(emptyClassBundle().onProperty().length).toEqual(0);
                });
            });
            describe('when located property uses some annotations', () => {
                it('should return all property annotations', () => {
                    const annotations = abcdClassBundle().onProperty();
                    expect(annotations.length).toEqual(4);
                    const annotationsName = annotations.map((a) => a.name);
                    expect(annotationsName).toContain(_AProperty.name);
                    expect(annotationsName).toContain(_BProperty.name);
                    expect(annotationsName).toContain(_CProperty.name);
                    expect(annotationsName).toContain(_DProperty.name);
                    expect(annotationsName).not.toContain(_XProperty.name);
                });
            });
        });

        describe('.onProperty(Annotation)', () => {
            describe('when specified annotation does not exist within the class', () => {
                it('should return an empty array', () => {
                    const annotations = abcdClassBundle().onProperty(_XProperty);
                    expect(annotations.length).toEqual(0);
                });
            });

            describe('when specified annotation exists within the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().onProperty(_AProperty);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AProperty.name);
                });
            });
        });
        describe('.onMethod()', () => {
            describe('when located class uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(emptyClassBundle().onMethod().length).toEqual(0);
                });
            });

            describe('when located class uses some annotations', () => {
                it('should return all method annotations', () => {
                    const annotations = abcdClassBundle().onMethod();
                    expect(annotations.length).toEqual(4);
                    expect(annotations.map((a) => a.name)).toContain(_AMethod.name);
                    expect(annotations.map((a) => a.name)).toContain(_BMethod.name);
                    expect(annotations.map((a) => a.name)).toContain(_CMethod.name);
                    expect(annotations.map((a) => a.name)).toContain(_DMethod.name);
                    expect(annotations.map((a) => a.name)).not.toContain(_XMethod.name);
                });
            });
        });
        describe('.onMethod(Annotation)', () => {
            describe('when the given an annotation does not exist within the class', () => {
                it('should return an empty array', () => {
                    expect(abcdClassBundle().onMethod(_XMethod).length).toEqual(0);
                });
            });

            describe('when the given an annotation exists within the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().onMethod(_AMethod);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AMethod.name);
                });
            });
        });
        describe('.onParameter()', () => {
            describe('when located class uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(emptyClassBundle().onParameter().length).toEqual(0);
                });
            });
            describe('when located class uses some annotations', () => {
                it('should return all parameters annotations', () => {
                    const annotations = abcdClassBundle().onParameter();
                    expect(annotations.length).toEqual(8);
                    const annotationsName = annotations.map((a) => a.name);
                    expect(annotationsName).toContain(_AParameter.name);
                    expect(annotationsName).toContain(_BParameter.name);
                    expect(annotationsName).toContain(_CParameter.name);
                    expect(annotationsName).toContain(_DParameter.name);
                    expect(annotationsName).not.toContain(_XParameter.name);
                });
            });
        });
        describe('.onParameter(Annotation)', () => {
            describe('when the given an annotation does not exist within the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().onParameter(_XParameter);
                    expect(annotations.length).toEqual(0);
                });
            });
            describe('when the given an annotation exists within the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().onParameter(_AParameter);
                    expect(annotations.length).toEqual(2);
                    expect(annotations.map((a) => a.name)).toEqual([_AParameter.name, _AParameter.name]);
                });
            });
        });
        describe('.onClass()', () => {
            describe('when located class does not use no annotation', () => {
                it('should return an empty array', () => {
                    expect(emptyClassBundle().onClass().length).toEqual(0);
                });
            });
            describe('when located class uses some annotations', () => {
                it('should return all class annotations on the class', () => {
                    const annotations = abcdClassBundle().onClass();
                    expect(annotations.length).toEqual(4);
                    const annotationsName = annotations.map((a) => a.name);
                    expect(annotationsName).toContain(_AClass.name);
                    expect(annotationsName).toContain(_BClass.name);
                    expect(annotationsName).toContain(_CClass.name);
                    expect(annotationsName).toContain(_DClass.name);
                    expect(annotationsName).not.toContain(_XClass.name);
                });
            });
        });

        describe('.onClass(Annotation)', () => {
            describe('when the given an annotation does not exist on the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().onClass(_XClass);
                    expect(annotations.length).toEqual(0);
                });
            });

            describe('when the given an annotation exists on the class', () => {
                it('should return the requested annotation', () => {
                    const annotations = abcdClassBundle().onClass(_AClass);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AClass.name);
                });
            });
        });
    });

    describe('.at(propertyLocation)', () => {
        function emptyPropertyBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(Empty).somePropAB);
        }

        function abPropertyBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(abcd).somePropAB);
        }
        describe('.all()', () => {
            describe('when located property uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(Object.keys(emptyPropertyBundle().all()).length).toEqual(0);
                });
            });
            describe('when located property uses some annotations', () => {
                it('should return all property annotations', () => {
                    const annotations = abPropertyBundle().all();
                    expect(annotations.length).toEqual(2);
                    const annotationsName = annotations.map((c) => c.name);
                    expect(annotationsName).toContain(_AProperty.name);
                    expect(annotationsName).toContain(_BProperty.name);
                    expect(annotationsName).not.toContain(_CProperty.name);
                    expect(annotationsName).not.toContain(_DProperty.name);
                });
            });
        });

        describe('.all(Annotation)', () => {
            describe('when specified annotation does not exists on the property', () => {
                it('should return an empty array', () => {
                    expect(abPropertyBundle().all(_CProperty)).toEqual([]);
                });
            });

            describe('when specified a PROPERTY annotation that exists on the property', () => {
                it('should return the requested annotation', () => {
                    const annotations = abPropertyBundle().all(_AProperty);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AProperty.name);
                });
            });
        });
        describe('.onProperty()', () => {
            describe('when located property uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(emptyPropertyBundle().onProperty().length).toEqual(0);
                });
            });

            describe('when located property uses some annotations', () => {
                it('should return all property annotations', () => {
                    const annotations = abPropertyBundle().onProperty();
                    expect(annotations.length).toEqual(2);
                    const annotationsName = annotations.map((a) => a.name);
                    expect(annotationsName).toContain(_AProperty.name);
                    expect(annotationsName).toContain(_BProperty.name);
                    expect(annotationsName).not.toContain(_CProperty.name);
                    expect(annotationsName).not.toContain(_DProperty.name);
                });
            });
        });
        describe('.onProperty(Annotation)', () => {
            describe('when the given an annotation does not exist on the property', () => {
                it('should return an empty array', () => {
                    expect(abPropertyBundle().onProperty(_CProperty).length).toEqual(0);
                });
            });

            describe('when the given an annotation exists on the property', () => {
                it('should return the requested annotation', () => {
                    const annotations = abPropertyBundle().onProperty(_AProperty);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AProperty.name);
                });
            });
        });
    });

    describe('.at(methodLocation)', () => {
        function emptyMethodBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(Empty).someMethodAB);
        }

        function abMethodBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(abcd).someMethodAB);
        }
        describe('.all()', () => {
            describe('when located method uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(Object.keys(emptyMethodBundle().all()).length).toEqual(0);
                });
            });
            describe('when located method uses some annotations', () => {
                it('should return all methods & parameters annotations', () => {
                    const annotations = abMethodBundle().all();
                    expect(annotations.length).toEqual(6);
                    const annotationsName = annotations.map((c) => c.name);
                    expect(annotationsName).toContain(_AParameter.name);
                    expect(annotationsName).toContain(_BParameter.name);
                    expect(annotationsName).toContain(_AMethod.name);
                    expect(annotationsName).toContain(_BMethod.name);
                    expect(annotationsName).not.toContain(_DMethod.name);
                    expect(annotationsName).not.toContain(_DParameter.name);
                });
            });
        });

        describe('.all(Annotation)', () => {
            describe('when specified annotation does not exists on the method', () => {
                it('should return an empty array', () => {
                    expect(abMethodBundle().all(_CMethod)).toEqual([]);
                });
            });

            describe('when specified a METHOD annotation that exists on the method', () => {
                it('should return the requested annotation', () => {
                    const annotations = abMethodBundle().all(_AMethod);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AMethod.name);
                });
            });

            describe("when specified a PARAMETER annotation that on the method's parameters", () => {
                it('should return the requested annotation', () => {
                    const annotations = abMethodBundle().all(_AParameter);
                    expect(annotations.length).toEqual(2);
                    expect(annotations.map((a) => a.name)).toEqual([_AParameter.name, _AParameter.name]);
                });
            });
        });
        describe('.onMethod()', () => {
            describe('when located method uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(emptyMethodBundle().onMethod().length).toEqual(0);
                });
            });

            describe('when located method uses some annotations', () => {
                it('should return all method annotations', () => {
                    const annotations = abMethodBundle().onMethod();
                    expect(annotations.length).toEqual(2);
                    expect(annotations.map((a) => a.name)).toContain(_AMethod.name);
                    expect(annotations.map((a) => a.name)).toContain(_BMethod.name);
                    expect(annotations.map((a) => a.name)).not.toContain(_CMethod.name);
                    expect(annotations.map((a) => a.name)).not.toContain(_DMethod.name);
                    expect(annotations.map((a) => a.name)).not.toContain(_AParameter.name);
                });
            });
        });
        describe('.onMethod(Annotation)', () => {
            describe('when the given an annotation does not exist on the method', () => {
                it('should return an empty array', () => {
                    expect(abMethodBundle().onMethod(_XMethod).length).toEqual(0);
                });
            });

            describe('when the given an annotation exists on the method', () => {
                it('should return the requested annotation', () => {
                    const annotations = abMethodBundle().onMethod(_AMethod);
                    expect(annotations.length).toEqual(1);
                    expect(annotations[0].name).toEqual(_AMethod.name);
                });
            });
        });
        describe('.onParameter()', () => {
            describe('when located method has no parameter with annotations', () => {
                it('should return an empty array', () => {
                    expect(emptyMethodBundle().onParameter().length).toEqual(0);
                });
            });
            describe('when located method has some parameters with annotations', () => {
                it('should return all parameters annotations', () => {
                    const annotations = abMethodBundle().onParameter();
                    expect(annotations.length).toEqual(4);
                    const annotationsName = annotations.map((a) => a.name);
                    expect(annotationsName).toContain(_AParameter.name);
                    expect(annotationsName).toContain(_BParameter.name);
                    expect(annotationsName).not.toContain(_CParameter.name);
                    expect(annotationsName).not.toContain(_DParameter.name);
                });
            });
        });
        describe('.onParameter(Annotation)', () => {
            describe("when the given an annotation does not exist on the method's parameters", () => {
                it('should return the requested annotation', () => {
                    const annotations = abMethodBundle().onParameter(_XParameter);
                    expect(annotations.length).toEqual(0);
                });
            });
            describe("when the given an annotation exists within the method's parameters", () => {
                it('should return the requested annotation', () => {
                    const annotations = abMethodBundle().onParameter(_AParameter);
                    expect(annotations.length).toEqual(2);
                    expect(annotations.map((a) => a.name)).toEqual([_AParameter.name, _AParameter.name]);
                });
            });
        });
    });

    describe('.at(parametersLocation)', () => {
        function emptyParametersBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(Empty).someMethodAB?.args);
        }

        function abParametersBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(abcd).someMethodAB.args);
        }
        describe('.all()', () => {
            describe('when located parameters uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(Object.keys(emptyParametersBundle().all()).length).toEqual(0);
                });
            });
            describe('when located parameters uses some annotations', () => {
                it('should return all parameters annotations', () => {
                    const annotations = abParametersBundle().all();
                    expect(annotations.length).toEqual(4);
                    const annotationsName = annotations.map((c) => c.name);
                    expect(annotationsName).toContain(_AParameter.name);
                    expect(annotationsName).toContain(_BParameter.name);
                    expect(annotationsName).not.toContain(_AMethod.name);
                    expect(annotationsName).not.toContain(_BMethod.name);
                    expect(annotationsName).not.toContain(_CParameter.name);
                    expect(annotationsName).not.toContain(_DParameter.name);
                });
            });
        });

        describe('.all(Annotation)', () => {
            describe('when specified annotation does not exists on one of the parameters', () => {
                it('should return an empty array', () => {
                    expect(abParametersBundle().all(_CParameter)).toEqual([]);
                });
            });

            describe('when specified a PARAMETER annotation that exists on one of the parameters', () => {
                it('should return the requested annotation', () => {
                    const annotations = abParametersBundle().all(_AParameter);
                    expect(annotations.length).toEqual(2);
                    expect(annotations.map((a) => a.name)).toEqual([_AParameter.name, _AParameter.name]);
                });
            });
        });
    });
    describe('.at(parametersLocation[i])', () => {
        function emptyParametersBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(Empty).someMethodAB?.args[0]);
        }

        function abParametersBundle() {
            return rootBundle.at(reflectContext.annotations.location.of(abcd).someMethodAB.args[0]);
        }
        describe('.all()', () => {
            describe('when located parameter uses no annotation', () => {
                it('should return an empty array', () => {
                    expect(Object.keys(emptyParametersBundle().all()).length).toEqual(0);
                });
            });
            describe('when located parameter uses some annotations', () => {
                it('should return all parameter annotations', () => {
                    const annotations = abParametersBundle().all();
                    expect(annotations.length).toEqual(2);
                    const annotationsName = annotations.map((c) => c.name);
                    expect(annotationsName).toContain(_AParameter.name);
                    expect(annotationsName).toContain(_BParameter.name);
                    expect(annotationsName).not.toContain(_DParameter.name);
                });
            });
        });

        describe('.all(Annotation)', () => {
            describe('when specified annotation does not exists on that specific parameter', () => {
                it('should return an empty array', () => {
                    expect(abParametersBundle().all(_CParameter)).toEqual([]);
                });
            });

            describe('when specified a PARAMETER annotation that exists on that specific parameter', () => {
                it('should return the requested annotation', () => {
                    const annotations = abParametersBundle().all(_AParameter);
                    expect(annotations.length).toEqual(1);
                    expect(annotations.map((a) => a.name)).toEqual([_AParameter.name]);
                });
            });
        });
    });
});
