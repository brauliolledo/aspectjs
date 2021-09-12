import { WeaverProfile, AnnotationType, WeavingError } from '@aspectjs/core/commons';
import { isFunction } from '@aspectjs/core/utils';
import { _AdviceExecutionPlanFactory } from '../plan.factory.js';
import { _ClassWeavingStrategy } from './strategies/class-weaving-strategy.js';
import { _MethodWeavingStrategy } from './strategies/method-weaving-strategy.js';
import { _ParameterWeavingStrategy } from './strategies/parameter-weaving-strategy.js';
import { _PropertyGetWeavingStrategy } from './strategies/property-get-weaving-strategy.js';
import { _PropertySetWeavingStrategy } from './strategies/property-set-weaving-strategy.js';

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

export { JitWeaver };
//# sourceMappingURL=jit-weaver.js.map
