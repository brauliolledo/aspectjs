import { _getWeaverContext, PointcutPhase, _AdviceFactory, Pointcut, AnnotationLocationFactory, WeavingError, _JoinpointFactory, AdviceError, WeaverProfile, AnnotationType, RootAnnotationsBundle, AnnotationRegistry, AnnotationTargetFactory, _setWeaverContext } from '@aspectjs/core/commons';
import { Compile, Before, Around, After, AfterReturn, AfterThrow, Order } from '@aspectjs/core/annotations';
import { locator, assert, assertIsAspect, isUndefined, _getReferenceConstructor, _setReferenceConstructor, getOrComputeMetadata, isFunction } from '@aspectjs/core/utils';

/**
 * Stores the aspects along with their advices.
 * @public
 */
class AspectsRegistryImpl {
    constructor(_weaverContext) {
        this._weaverContext = _weaverContext;
        this._advicesRegistry = {
            byPointcut: {},
            byTarget: {},
            byAspect: {},
        };
        this._dirty = true;
        this._aspectsToLoad = new Set();
        this._loadedAspects = new Set();
        this._advicesRegistryKey = `aspectjs.adviceRegistry.byAspects`; // TODO increment key with AspectsRegistry instance ?
    }
    /**
     * Register a new advice, with the aspect it belongs to.
     * @param aspects - The aspects to register
     */
    register(...aspects) {
        (aspects !== null && aspects !== void 0 ? aspects : []).forEach((aspect) => {
            // get annotations bundle
            const annotationsContext = _getWeaverContext().annotations;
            const bundle = annotationsContext.bundle.at(annotationsContext.location.of(aspect));
            // get @Aspect options
            const target = this._getTarget(aspect);
            const byAspectRegistry = locator(this._advicesRegistry.byAspect)
                .at(target.ref)
                .orElseCompute(() => ({}));
            this._aspectsToLoad.add(aspect);
            [
                [Compile, PointcutPhase.COMPILE],
                [Before, PointcutPhase.BEFORE],
                [Around, PointcutPhase.AROUND],
                [After, PointcutPhase.AFTER],
                [AfterReturn, PointcutPhase.AFTERRETURN],
                [AfterThrow, PointcutPhase.AFTERTHROW],
            ].forEach((adviceDef) => {
                bundle.onMethod(adviceDef[0]).forEach((annotation) => {
                    const expr = annotation.args[0];
                    assert(!!expr);
                    const advice = _AdviceFactory.create(Pointcut.of(adviceDef[1], expr), annotation.target);
                    const k = `${advice.pointcut.ref}=>${advice.name}`;
                    byAspectRegistry[k] = advice;
                });
            });
        });
    }
    remove(...aspects) {
        this._dirty = true;
        if (this._aspectsToLoad.size) {
            aspects.forEach((a) => {
                // remove aspect from the list of aspects to load
                this._aspectsToLoad.delete(a);
                // remove aspect from registry
                delete this._advicesRegistry.byAspect[this._getTarget(a).ref];
            });
        }
        // force all aspects to reload
        this._loadedAspects.forEach((a) => this._aspectsToLoad.add(a));
        this._loadedAspects.clear();
    }
    /**
     * Get all advices that belongs to the given aspect
     * @param aspect - the aspect to get advices for.
     */
    getAdvicesByAspect(aspect) {
        var _a;
        assertIsAspect(aspect);
        const target = this._getTarget(aspect);
        return Object.values((_a = this._advicesRegistry.byAspect[target.ref]) !== null && _a !== void 0 ? _a : {})
            .flat()
            .map((advice) => {
            const bound = advice.bind(aspect);
            Object.defineProperties(bound, Object.getOwnPropertyDescriptors(advice));
            return bound;
        });
    }
    getAdvicesByTarget(target, filter, ...phases) {
        this._load();
        const targetRegistry = locator(this._advicesRegistry)
            .at('byTarget')
            .at(`${target.ref}${(filter === null || filter === void 0 ? void 0 : filter.name) ? `:${filter === null || filter === void 0 ? void 0 : filter.name}` : ''}`)
            .orElseGet(() => ({}));
        // get all advices that correspond to all the annotations of this context
        const bundle = this._weaverContext.annotations.bundle.at(target.location);
        const annotationContexts = bundle.onSelf();
        (phases !== null && phases !== void 0 ? phases : []).forEach((phase) => {
            if (!targetRegistry[phase]) {
                let advices = annotationContexts
                    .map((annotationContext) => locator(this._advicesRegistry)
                    .at('byPointcut')
                    .at(phase)
                    .at(target.type)
                    .at('byAnnotation')
                    .at(annotationContext.ref)
                    .orElseGet(() => []))
                    .flat()
                    .sort((a1, a2) => {
                    var _a, _b;
                    // sort by advice order
                    const a = this._weaverContext.annotations;
                    const o1 = (_a = a.bundle.at(a.location.of(a1.aspect)[a1.name]).onMethod(Order)[0]) === null || _a === void 0 ? void 0 : _a.args[0];
                    const o2 = (_b = a.bundle.at(a.location.of(a2.aspect)[a1.name]).onMethod(Order)[0]) === null || _b === void 0 ? void 0 : _b.args[0];
                    return _compareOrder(o1, o2);
                });
                if (filter) {
                    advices = advices.filter(filter.fn);
                }
                targetRegistry[phase] = advices;
            }
        });
        return targetRegistry;
    }
    /**
     * @internal
     */
    _getTarget(obj) {
        return AnnotationLocationFactory.getTarget(this._weaverContext.annotations.location.of(obj));
    }
    /**
     * Sort the aspects according to their precedence & store by target, by phase & type
     * @private
     */
    _load() {
        if (this._dirty) {
            this._advicesRegistry.byPointcut = {};
            this._advicesRegistry.byTarget = {};
        }
        if (!this._aspectsToLoad.size) {
            return;
        }
        [...this._aspectsToLoad]
            .sort((a1, a2) => {
            var _a, _b;
            // sort by aspect order
            const a = this._weaverContext.annotations;
            const o1 = (_a = a.bundle.at(a.location.of(a1)).onClass(Order)[0]) === null || _a === void 0 ? void 0 : _a.args[0];
            const o2 = (_b = a.bundle.at(a.location.of(a2)).onClass(Order)[0]) === null || _b === void 0 ? void 0 : _b.args[0];
            return _compareOrder(o1, o2);
        })
            .map((a) => {
            this._loadedAspects.add(a);
            return a;
        })
            .map((aspect) => this.getAdvicesByAspect(aspect))
            .flat()
            .forEach((advice) => {
            const pc = advice.pointcut;
            locator(this._advicesRegistry)
                .at('byPointcut')
                .at(pc.phase)
                .at(pc.type)
                .at('byAnnotation')
                .at(pc.annotation.ref)
                .orElseCompute(() => [])
                .push(advice);
        });
        this._dirty = false;
        this._aspectsToLoad.clear();
    }
}
function _compareOrder(o1, o2) {
    if (o1 === Order.LOWEST_PRECEDENCE || o1 === undefined) {
        return 1;
    }
    if (o2 === Order.LOWEST_PRECEDENCE || o2 === undefined) {
        return -1;
    }
    if (o1 === Order.HIGHEST_PRECEDENCE) {
        return -1;
    }
    if (o2 === Order.HIGHEST_PRECEDENCE) {
        return 1;
    }
    return o1 - o2;
}

/**
 * @internal
 */
class _AdviceExecutionPlanFactory {
    create(target, hooks, filter) {
        let compiled = false;
        let compiledSymbol;
        const linkFn = (ctxt) => {
            var _a;
            if (!compiled) {
                compileFn(ctxt);
            }
            assert(!!compiledSymbol);
            const jp = function (...args) {
                var _a;
                ctxt.args = args;
                ctxt.instance = this;
                const advicesReg = _getWeaverContext().aspects.registry.getAdvicesByTarget(ctxt.target, filter, PointcutPhase.BEFORE, PointcutPhase.AROUND, PointcutPhase.AFTERRETURN, PointcutPhase.AFTERTHROW, PointcutPhase.AFTER);
                // create the joinpoint for the original method
                const jp = _JoinpointFactory.create(null, ctxt, (...args) => {
                    var _a, _b, _c, _d;
                    const restoreJp = ctxt.joinpoint;
                    const restoreArgs = ctxt.args;
                    ctxt.args = args;
                    delete ctxt.joinpoint;
                    try {
                        (_a = hooks.preBefore) === null || _a === void 0 ? void 0 : _a.call(hooks, ctxt);
                        hooks.before(ctxt, advicesReg[PointcutPhase.BEFORE]);
                        hooks.initialJoinpoint.call(hooks, ctxt, compiledSymbol);
                        (_b = hooks.preAfterReturn) === null || _b === void 0 ? void 0 : _b.call(hooks, ctxt);
                        return hooks.afterReturn(ctxt, advicesReg[PointcutPhase.AFTERRETURN]);
                    }
                    catch (e) {
                        // consider WeavingErrors as not recoverable by an aspect
                        if (e instanceof WeavingError) {
                            throw e;
                        }
                        ctxt.error = e;
                        (_c = hooks.preAfterThrow) === null || _c === void 0 ? void 0 : _c.call(hooks, ctxt);
                        return hooks.afterThrow(ctxt, advicesReg[PointcutPhase.AFTERTHROW]);
                    }
                    finally {
                        delete ctxt.error;
                        (_d = hooks.preAfter) === null || _d === void 0 ? void 0 : _d.call(hooks, ctxt);
                        hooks.after(ctxt, advicesReg[PointcutPhase.AFTER]);
                        ctxt.joinpoint = restoreJp;
                        ctxt.args = restoreArgs;
                    }
                });
                (_a = hooks.preAround) === null || _a === void 0 ? void 0 : _a.call(hooks, ctxt);
                return hooks.around(ctxt, advicesReg[PointcutPhase.AROUND], jp)(args);
            };
            return (_a = hooks.finalize.call(hooks, ctxt, jp)) !== null && _a !== void 0 ? _a : jp;
        };
        const compileFn = (ctxt) => {
            const compileAdvices = _getWeaverContext().aspects.registry.getAdvicesByTarget(ctxt.target, filter, PointcutPhase.COMPILE)[PointcutPhase.COMPILE];
            compiledSymbol = hooks.compile(ctxt, compileAdvices);
            compiled = true;
            if (!compiledSymbol) {
                throw new WeavingError(`${Reflect.getPrototypeOf(hooks).constructor.name}.compile() did not returned a symbol`);
            }
            return compiledSymbol;
        };
        return new _ExecutionPlan(compileFn, linkFn);
    }
}
/**
 * Sort the advices according to their precedence & store by phase & type, so they are ready to execute.
 * @internal
 */
class _ExecutionPlan {
    constructor(compileFn, linkFn) {
        this.compileFn = compileFn;
        this.linkFn = linkFn;
    }
    compile(ctxt) {
        const compiled = this.compileFn(ctxt);
        const link = this.linkFn;
        return {
            /**
             * Returns a function that executes the plan for the Before, Around, AfterReturn, AfterThrow & After advices.
             */
            link: () => link(ctxt, compiled),
        };
    }
}

/**
 *
 * @param fn
 * @param name
 * @param tag
 * @param toString
 * @internal
 */
function _defineFunctionProperties(fn, name, tag, toString) {
    assert(typeof fn === 'function');
    // const newFn = fn;
    const newFn = new Function('fn', `return function ${name}(...args) { return fn.apply(this, args) };`)(fn);
    Object.defineProperty(newFn, 'name', {
        value: name,
    });
    tag = tag !== null && tag !== void 0 ? tag : name;
    Object.defineProperty(newFn, Symbol.toPrimitive, {
        enumerable: false,
        configurable: true,
        value: () => tag,
    });
    newFn.prototype.toString = toString;
    newFn.toString = toString;
    return newFn;
}

/**
 * @internal
 */
class _GenericWeavingStrategy {
    after(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
    }
    afterReturn(ctxt, advices) {
        ctxt.value = ctxt.value; // force key 'value' to be present
        advices.forEach((advice) => {
            ctxt.value = advice(ctxt, ctxt.value);
        });
        return ctxt.value;
    }
    afterThrow(ctxt, advices, allowReturn = true) {
        var _a;
        if (advices.length) {
            ctxt.value = (_a = ctxt.value) !== null && _a !== void 0 ? _a : undefined; // force key 'value' to be present
            advices.forEach((advice) => {
                ctxt.advice = advice;
                ctxt.value = advice(ctxt, ctxt.error);
                delete ctxt.advice;
                if (!allowReturn && !isUndefined(ctxt.value)) {
                    throw new AdviceError(advice, `Returning from advice is not supported`);
                }
            });
            return ctxt.value;
        }
        else {
            assert(!!ctxt.error);
            // pass-trough errors by default
            throw ctxt.error;
        }
    }
    around(ctxt, advices, jp, allowReturn = true) {
        advices.reverse().forEach((advice) => {
            const originalJp = jp;
            const nextJp = _JoinpointFactory.create(advice, ctxt, (...args) => originalJp(args));
            jp = (args) => {
                ctxt.joinpoint = nextJp;
                ctxt.args = args;
                ctxt.advice = advice;
                ctxt.value = advice(ctxt, nextJp, args);
                if (ctxt.value !== undefined && !allowReturn) {
                    throw new AdviceError(advice, `Returning from advice is not supported`);
                }
                return ctxt.value;
            };
        });
        return jp;
    }
    before(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
    }
    _applyNonReturningAdvices(ctxt, advices) {
        advices.forEach((advice) => {
            ctxt.advice = advice;
            const retVal = advice(ctxt);
            delete ctxt.advice;
            if (!isUndefined(retVal)) {
                throw new AdviceError(advice, `Returning from advice is not supported`);
            }
        });
    }
}

/**
 * @internal
 */
class _ClassWeavingStrategy extends _GenericWeavingStrategy {
    compile(ctxt, advices) {
        // if another @Compile advice has been applied
        // replace wrapped ctor by original ctor before it gets wrapped again
        ctxt.target.proto.constructor = _getReferenceConstructor(ctxt.target.proto);
        _setReferenceConstructor(ctxt.target.proto, ctxt.target.proto.constructor);
        let ctor;
        advices.forEach((advice) => {
            ctxt.advice = advice;
            ctor = advice(ctxt);
        });
        delete ctxt.advice;
        return (ctxt.target.proto.constructor = ctor !== null && ctor !== void 0 ? ctor : ctxt.target.proto.constructor);
    }
    preAround(ctxt) {
        // original ctor invocation will discard any changes done to instance before, so accessing ctxt.instance is forbidden
        this.originalInstance = ctxt.instance;
        ctxt.instance = null;
    }
    around(ctxt, advices, joinpoint) {
        advices.reverse().forEach((advice) => {
            const originalJp = joinpoint;
            const nextJp = _JoinpointFactory.create(advice, ctxt, (...args) => originalJp(args));
            joinpoint = (args) => {
                var _a;
                ctxt.joinpoint = nextJp;
                ctxt.args = args;
                ctxt.advice = advice;
                return (ctxt.instance = (_a = advice(ctxt, nextJp, args)) !== null && _a !== void 0 ? _a : ctxt.instance);
            };
        });
        return joinpoint;
    }
    initialJoinpoint(ctxt, originalCtor) {
        var _a;
        // We need to keep originalInstance as the instance, because of instanceof.
        // Merge the new instance into originalInstance;
        Object.assign(this.originalInstance, (_a = new originalCtor(...ctxt.args)) !== null && _a !== void 0 ? _a : this.originalInstance);
        ctxt.instance = this.originalInstance;
    }
    afterReturn(ctxt, advices) {
        let newInstance = ctxt.instance;
        advices.forEach((advice) => {
            ctxt.value = ctxt.instance;
            ctxt.advice = advice;
            newInstance = advice(ctxt, ctxt.value);
            if (!isUndefined(newInstance)) {
                ctxt.instance = newInstance;
            }
            delete ctxt.advice;
        });
        return ctxt.instance;
    }
    preAfterThrow(ctxt) {
        // as of ES6 classes, 'this' is no more available after ctor thrown.
        // replace 'this' with partial this
        ctxt.instance = this.originalInstance;
    }
    afterThrow(ctxt, advices) {
        if (!advices.length) {
            // pass-trough errors by default
            throw ctxt.error;
        }
        else {
            let newInstance = ctxt.instance;
            advices.forEach((advice) => {
                ctxt.advice = advice;
                newInstance = advice(ctxt, ctxt.error);
                if (!isUndefined(newInstance)) {
                    ctxt.instance = newInstance;
                }
                delete ctxt.advice;
            });
            return ctxt.instance;
        }
    }
    finalize(ctxt, joinpoint) {
        var _a;
        assert(!!((_a = ctxt.target) === null || _a === void 0 ? void 0 : _a.proto));
        const originalCtor = ctxt.target.proto.constructor;
        const ctorName = originalCtor.name;
        joinpoint = _defineFunctionProperties(joinpoint, ctorName, `class ${ctorName}$$advised {}`, originalCtor.toString.bind(originalCtor));
        joinpoint.prototype = ctxt.target.proto;
        joinpoint.prototype.constructor = joinpoint;
        return joinpoint;
    }
}

/**
 * @internal
 */
class _MethodWeavingStrategy extends _GenericWeavingStrategy {
    compile(ctxt, advices) {
        var _a;
        const target = ctxt.target;
        // save & restore original descriptor
        Reflect.defineProperty(target.proto, target.propertyKey, getOrComputeMetadata('aspectjs.originalMethodDescriptor', target.proto, ctxt.target.propertyKey, () => {
            return Object.assign({}, Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey));
        }, true));
        let lastCompileAdvice = advices[0];
        let newDescriptor;
        advices.forEach((advice) => {
            var _a;
            lastCompileAdvice = advice;
            ctxt.advice = advice;
            newDescriptor =
                (_a = advice(ctxt)) !== null && _a !== void 0 ? _a : newDescriptor;
        });
        delete ctxt.advice;
        if (isUndefined(newDescriptor)) {
            return Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey);
        }
        else {
            if (((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) === null || _a === void 0 ? void 0 : _a.configurable) === false) {
                throw new AdviceError(lastCompileAdvice, `${target.label} is not configurable`);
            }
            // ensure value is a function
            if (!isFunction(newDescriptor.value)) {
                throw new AdviceError(lastCompileAdvice, `Expected advice to return a method descriptor. Got: ${newDescriptor.value}`);
            }
            if (isUndefined(newDescriptor.enumerable)) {
                newDescriptor.enumerable = false;
            }
            if (isUndefined(newDescriptor.configurable)) {
                newDescriptor.configurable = true;
            }
            // test property validity
            newDescriptor = Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
            Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
            return newDescriptor;
        }
    }
    initialJoinpoint(ctxt, refDescriptor) {
        ctxt.value = refDescriptor.value.apply(ctxt.instance, ctxt.args);
    }
    finalize(ctxt, jp) {
        const newDescriptor = Object.getOwnPropertyDescriptor(ctxt.target.proto, ctxt.target.propertyKey);
        newDescriptor.value = jp;
        const originalFn = ctxt.target.proto[ctxt.target.propertyKey];
        newDescriptor.value = _defineFunctionProperties(newDescriptor.value, originalFn.name, originalFn.toString().split('\n')[0], originalFn.toString.bind(originalFn));
        Reflect.defineMetadata('aspectjs.enhancedMethodDescriptor', true, newDescriptor);
        return newDescriptor;
    }
}

const _defineProperty = Object.defineProperty;
class _ParameterWeavingStrategy extends _MethodWeavingStrategy {
    constructor() {
        super();
    }
    compile(ctxt, advices) {
        const target = ctxt.target;
        // save & restore original descriptor
        const originalDescriptor = getOrComputeMetadata('aspectjs.originalPropertyDescriptor', target.proto, ctxt.target.propertyKey, () => {
            return Object.assign({}, Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey));
        }, true);
        Reflect.defineProperty(target.proto, target.propertyKey, originalDescriptor);
        Reflect.defineMetadata('aspectjs.originalMethodDescriptor', originalDescriptor, target.proto, target.propertyKey);
        return super.compile(ctxt, advices);
    }
    finalize(ctxt, jp) {
        const newDescriptor = super.finalize(ctxt, jp);
        Reflect.defineProperty(ctxt.target.proto, ctxt.target.propertyKey, newDescriptor);
        // We want any further method advice t use this descriptor as a reference
        Reflect.defineMetadata('aspectjs.originalMethodDescriptor', newDescriptor, ctxt.target.proto, ctxt.target.propertyKey);
        // Override method descriptor from parameter decorator is not allowed because return value of this parameter decorators is ignored
        // Moreover, Reflect.decorate will overwrite any changes made on proto[propertyKey]
        // We monkey patch Object.defineProperty to prevent this;
        Object.defineProperty = function (o, p, attributes) {
            if (o === ctxt.target.proto && p === ctxt.target.propertyKey) {
                // restore original defineProperty method
                Object.defineProperty = _defineProperty;
                // if attempt to write an enhanced descriptor... let go
                if (Reflect.getOwnMetadata('aspectjs.enhancedMethodDescriptor', attributes)) {
                    return Object.defineProperty(o, p, attributes);
                }
                else {
                    // prevent writing back old descriptor
                    return newDescriptor;
                }
            }
            return _defineProperty(o, p, attributes);
        };
        return newDescriptor;
    }
}

/**
 * @internal
 */
class _PropertyGetWeavingStrategy extends _GenericWeavingStrategy {
    compile(ctxt, advices) {
        var _a;
        const target = ctxt.target;
        if (this.compiledDescriptor) {
            return this.compiledDescriptor;
        }
        // if another @Compile advice has been applied
        // replace wrapped descriptor by original descriptor before it gets wrapped again
        target.descriptor = getOrComputeMetadata('aspectjs.originalDescriptor', target.proto, target.propertyKey, () => {
            var _a;
            return ((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) !== null && _a !== void 0 ? _a : {
                configurable: true,
                enumerable: true,
                get() {
                    return Reflect.getOwnMetadata(`aspectjs.propValue`, this, target.propertyKey);
                },
                set(value) {
                    Reflect.defineMetadata(`aspectjs.propValue`, value, this, target.propertyKey);
                },
            });
        }, true);
        let advice;
        let newDescriptor = ctxt.target.descriptor;
        advices.forEach((advice) => {
            var _a;
            ctxt.advice = advice;
            newDescriptor = (_a = advice(ctxt)) !== null && _a !== void 0 ? _a : newDescriptor;
        });
        delete ctxt.advice;
        if (newDescriptor) {
            if (((_a = Reflect.getOwnPropertyDescriptor(target.proto, target.propertyKey)) === null || _a === void 0 ? void 0 : _a.configurable) === false) {
                throw new AdviceError(advice, `${target.label} is not configurable`);
            }
            // test property validity
            const surrogate = { prop: '' };
            const surrogateProp = Reflect.getOwnPropertyDescriptor(surrogate, 'prop');
            if (isUndefined(newDescriptor.enumerable)) {
                newDescriptor.enumerable = surrogateProp.enumerable;
            }
            if (isUndefined(newDescriptor.configurable)) {
                newDescriptor.configurable = surrogateProp.configurable;
            }
            // normalize the descriptor
            newDescriptor = Object.getOwnPropertyDescriptor(Object.defineProperty(surrogate, 'newProp', newDescriptor), 'newProp');
            Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
        }
        if (newDescriptor.hasOwnProperty('value')) {
            const propValue = newDescriptor.value;
            newDescriptor.get = () => propValue;
            delete newDescriptor.writable;
            delete newDescriptor.value;
        }
        return (this.compiledDescriptor = newDescriptor);
    }
    preBefore(ctxt) {
        ctxt.args = [];
    }
    initialJoinpoint(ctxt, originalDescriptor) {
        assert(isFunction(originalDescriptor.get));
        ctxt.value = _JoinpointFactory.create(null, ctxt, originalDescriptor.get)();
    }
    finalize(ctxt, joinpoint) {
        const newDescriptor = Object.assign(Object.assign({}, this.compiledDescriptor), { get: joinpoint });
        // test property validity
        Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
        return newDescriptor;
    }
}

/**
 * @internal
 */
class _PropertySetWeavingStrategy extends _GenericWeavingStrategy {
    constructor(getterHooks) {
        super();
        this.getterHooks = getterHooks;
    }
    compile(ctxt) {
        return (this.compiledDescriptor = this.getterHooks.compile(ctxt, null));
    }
    initialJoinpoint(ctxt, refDescriptor) {
        assert(isFunction(refDescriptor === null || refDescriptor === void 0 ? void 0 : refDescriptor.set));
        ctxt.value = _JoinpointFactory.create(null, ctxt, refDescriptor.set)(ctxt.args);
    }
    around(ctxt, advices, jp) {
        return super.around(ctxt, advices, jp, false);
    }
    afterReturn(ctxt, advices) {
        return this._applyNonReturningAdvices(ctxt, advices);
    }
    afterThrow(ctxt, advices) {
        super.afterThrow(ctxt, advices, false);
    }
    after(ctxt, advices) {
        this._applyNonReturningAdvices(ctxt, advices);
    }
    finalize(ctxt, joinpoint) {
        const newDescriptor = Object.assign(Object.assign({}, this.compiledDescriptor), { set: joinpoint });
        // test property validity
        Object.getOwnPropertyDescriptor(Object.defineProperty({}, 'surrogate', newDescriptor), 'surrogate');
        return newDescriptor;
    }
}

/**
 * The JitWeaver wires up advices to the corresponding annotations as soon as the annotation gets processed by JS interpreter.
 * @public
 */
class JitWeaver extends WeaverProfile {
    /**
     *
     * @param _context - the weaver context to attach this weaver to.
     * @param _prod - When prod mode is activated, enabling an aspect after Annotation compilation is prohibed.
     */
    constructor(_context, _prod = true) {
        super();
        this._context = _context;
        this._prod = _prod;
        this._enhancers = {
            [AnnotationType.CLASS]: this._enhanceClass.bind(this),
            [AnnotationType.PROPERTY]: this._enhanceProperty.bind(this),
            [AnnotationType.METHOD]: this._enhanceMethod.bind(this),
            [AnnotationType.PARAMETER]: this._enhanceParameter.bind(this),
        };
        this._planFactory = new _AdviceExecutionPlanFactory();
    }
    enable(...aspects) {
        const _aspects = new WeaverProfile().enable(...aspects).getAspects();
        try {
            this._context.aspects.registry.register(..._aspects);
            if (this._prod) {
                // check annotations has not already been processed
                const alreadyProcessedAnnotations = new Map();
                _aspects.forEach((aspect) => {
                    this._context.aspects.registry
                        .getAdvicesByAspect(aspect)
                        .forEach((a) => alreadyProcessedAnnotations.set(a.pointcut, aspect));
                });
                alreadyProcessedAnnotations.forEach((aspect, pointcut) => {
                    var _a, _b;
                    if (this._context.annotations.bundle.all(pointcut.annotation.ref).length) {
                        throw new WeavingError(`Cannot enable aspect ${(_b = (_a = aspect.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : aspect} because annotation ${pointcut.annotation} has already been applied`);
                    }
                });
            }
            const r = super.enable(..._aspects);
            _aspects.filter((a) => isFunction(a.onEnable)).forEach((a) => a.onEnable.call(a, this));
            return r;
        }
        catch (e) {
            this._context.aspects.registry.remove(..._aspects);
            throw e;
        }
    }
    disable(...aspects) {
        const _aspects = new WeaverProfile().enable(...aspects).getAspects();
        _aspects.filter((a) => isFunction(a.onDisable)).forEach((a) => a.onEnable.call(a, this));
        return super.disable(..._aspects);
    }
    reset() {
        this._planFactory = new _AdviceExecutionPlanFactory();
        return super.reset();
    }
    enhance(target) {
        const ctxt = new AdviceContextImpl(target, this._context.annotations.bundle.at(target.location));
        return this._enhancers[target.type](ctxt);
    }
    _enhanceClass(ctxt) {
        const plan = this._planFactory.create(ctxt.target, new _ClassWeavingStrategy());
        return plan.compile(ctxt).link();
    }
    _enhanceProperty(ctxt) {
        const getterHooks = new _PropertyGetWeavingStrategy();
        const gettersPlan = this._planFactory.create(ctxt.target, getterHooks, {
            name: 'get',
            fn: _isPropertyGet,
        });
        const newDescriptor = gettersPlan.compile(ctxt).link();
        if (_isDescriptorWritable(newDescriptor)) {
            const settersPlan = this._planFactory.create(ctxt.target, new _PropertySetWeavingStrategy(getterHooks), {
                name: 'set',
                fn: _isPropertySet,
            });
            newDescriptor.set = settersPlan.compile(ctxt).link().set;
            delete newDescriptor.writable;
        }
        else {
            delete newDescriptor.set;
        }
        const target = ctxt.target;
        Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);
        return newDescriptor;
    }
    _enhanceMethod(ctxt) {
        const plan = this._planFactory.create(ctxt.target, new _MethodWeavingStrategy());
        return plan.compile(ctxt).link();
    }
    _enhanceParameter(ctxt) {
        const plan = this._planFactory.create(ctxt.target, new _ParameterWeavingStrategy());
        return plan.compile(ctxt).link();
    }
}
function _isPropertyGet(a) {
    return a.pointcut.ref.startsWith('property#get');
}
function _isPropertySet(a) {
    return a.pointcut.ref.startsWith('property#set');
}
function _isDescriptorWritable(propDescriptor) {
    const desc = propDescriptor;
    return !desc || (desc.hasOwnProperty('writable') && desc.writable) || isFunction(desc.set);
}
class AdviceContextImpl {
    constructor(target, bundle) {
        this.target = target;
        this.data = {};
        this.annotations = bundle;
    }
    clone() {
        return Object.assign(Object.create(Reflect.getPrototypeOf(this)), this);
    }
    toString() {
        return `${this.advice} on ${this.target.label}`;
    }
}

const bundleRegistry = {
    byTargetClassRef: {},
    byAnnotation: {},
};
const bundle = new RootAnnotationsBundle(bundleRegistry);
const annotationRegistry = new AnnotationRegistry(bundleRegistry);
/**
 * @public
 */
class WeaverContextImpl {
    constructor() {
        this._targetFactory = new AnnotationTargetFactory();
        this.annotations = {
            location: new AnnotationLocationFactory(this._targetFactory),
            registry: annotationRegistry,
            targetFactory: this._targetFactory,
            bundle,
        };
        this.aspects = {
            registry: new AspectsRegistryImpl(this),
        };
        this.weaver = this._createWeaver();
    }
    _createWeaver() {
        return new JitWeaver(this);
    }
    /**
     * Get the global weaver
     */
    getWeaver() {
        return this.weaver;
    }
}

/**
 * @public
 */
const WEAVER_CONTEXT = new (class {
    // Allow setWeaverContext to switch implementation of weaver.
    // This is used for resetWaverContext as a convenience for tests
    get aspects() {
        return _getWeaverContext().aspects;
    }
    get annotations() {
        return _getWeaverContext().annotations;
    }
    getWeaver() {
        return _getWeaverContext().getWeaver();
    }
})();
_setWeaverContext(new WeaverContextImpl());

export { JitWeaver, WEAVER_CONTEXT, WeaverContextImpl, _AdviceExecutionPlanFactory, _ExecutionPlan };
//# sourceMappingURL=core.js.map
