import { AnnotationType } from '@aspectjs/common';
import { assert, isFunction } from '@aspectjs/common/utils';
import { WeaverProfile, AspectType, Pointcut, AdviceType, Advice, JoinPoint } from '@aspectjs/core';
import { AnnotationTarget, AdviceTarget, AnnotationsBundle, _AnnotationLocationImpl } from '@aspectjs/reflect';
import { WeavingError } from '../errors';
import { MutableAdviceContext } from '../mutable-advice.context.type';
import { _AdviceExecutionPlanFactory } from '../weaver/plan.factory';
import { Weaver } from '../weaver/weaver';
import { WeaverContext } from '../weaver/weaver-context';
import { _ClassWeavingStrategy } from './strategies/class-weaving-strategy';
import { _MethodWeavingStrategy } from './strategies/method-weaving-strategy';
import { _ParameterWeavingStrategy } from './strategies/parameter-weaving-strategy';
import { _PropertyGetWeavingStrategy } from './strategies/property-get-weaving-strategy';
import { _PropertySetWeavingStrategy } from './strategies/property-set-weaving-strategy';

/**
 * The JitWeaver wires up advices to the corresponding annotations as soon as the annotation gets processed by JS interpreter.
 * @public
 */
export class JitWeaver extends WeaverProfile implements Weaver {
    private _planFactory: _AdviceExecutionPlanFactory;
    private _enhancers = {
        [AnnotationType.CLASS]: this._enhanceClass.bind(this),
        [AnnotationType.PROPERTY]: this._enhanceProperty.bind(this),
        [AnnotationType.METHOD]: this._enhanceMethod.bind(this),
        [AnnotationType.PARAMETER]: this._enhanceParameter.bind(this),
    };
    /**
     *
     * @param _context - the weaver context to attach this weaver to.
     * @param _prod - When prod mode is activated, enabling an aspect after Annotation compilation is prohibed.
     */
    constructor(private _context: WeaverContext, private _prod = true) {
        super();
        this._planFactory = new _AdviceExecutionPlanFactory();
    }

    enable(...aspects: (AspectType | WeaverProfile)[]): this {
        const _aspects = new WeaverProfile().enable(...aspects).getAspects();
        try {
            this._context.aspects.registry.register(...aspects);
            if (this._prod) {
                // check annotations has not already been processed
                const alreadyProcessedAnnotations = new Map<Pointcut, AspectType>();
                _aspects.forEach((aspect) => {
                    this._context.aspects.registry
                        .getAdvicesByAspect(aspect)
                        .forEach((a) => alreadyProcessedAnnotations.set(a.pointcut, aspect));
                });

                alreadyProcessedAnnotations.forEach((aspect: AspectType, pointcut: Pointcut) => {
                    if (this._context.annotations.bundle.all(pointcut.annotation.ref).length) {
                        throw new WeavingError(
                            `Cannot enable aspect ${aspect.constructor?.name ?? aspect} because annotation ${
                                pointcut.annotation
                            } has already been applied`,
                        );
                    }
                });
            }

            const r = super.enable(..._aspects);
            _aspects.filter((a) => isFunction(a.onEnable)).forEach((a) => a.onEnable.call(a, this));

            return r;
        } catch (e) {
            this._context.aspects.registry.remove(..._aspects);
            throw e;
        }
    }

    disable(...aspects: (AspectType | WeaverProfile)[]): this {
        const _aspects = new WeaverProfile().enable(...aspects).getAspects();
        _aspects.filter((a) => isFunction(a.onDisable)).forEach((a) => a.onEnable.call(a, this));

        return super.disable(..._aspects);
    }

    enhance<T>(target: AnnotationTarget<T>): void | Function | PropertyDescriptor {
        const ctxt = new AdviceContextImpl(target, this._context);

        return this._enhancers[target.type](ctxt);
    }

    private _enhanceClass<T>(ctxt: MutableAdviceContext<T, AdviceType.CLASS>): new (...args: any[]) => T {
        const plan = this._planFactory.create(new _ClassWeavingStrategy());
        return plan.compile(ctxt).link();
    }

    private _enhanceProperty<T>(ctxt: MutableAdviceContext<T, AdviceType.PROPERTY>): PropertyDescriptor {
        const getterHooks = new _PropertyGetWeavingStrategy();
        const gettersPlan = this._planFactory.create(getterHooks, {
            name: 'get',
            fn: _isPropertyGet,
        });

        const newDescriptor = gettersPlan.compile(ctxt).link();

        if (_isDescriptorWritable(newDescriptor)) {
            const settersPlan = this._planFactory.create(new _PropertySetWeavingStrategy(getterHooks), {
                name: 'set',
                fn: _isPropertySet,
            });

            newDescriptor.set = settersPlan.compile(ctxt).link().set;
            delete newDescriptor.writable;
        } else {
            delete newDescriptor.set;
        }

        const target = ctxt.target;
        Reflect.defineProperty(target.proto, target.propertyKey, newDescriptor);

        return newDescriptor;
    }

    private _enhanceMethod<T>(ctxt: MutableAdviceContext<T, AdviceType.METHOD>): PropertyDescriptor {
        const plan = this._planFactory.create(new _MethodWeavingStrategy());
        return plan.compile(ctxt).link();
    }

    private _enhanceParameter<T>(ctxt: MutableAdviceContext<T, AdviceType.METHOD>): PropertyDescriptor {
        const plan = this._planFactory.create(new _ParameterWeavingStrategy());
        return plan.compile(ctxt).link();
    }
}

function _isPropertyGet(a: Advice) {
    return a.pointcut.ref.startsWith('property#get');
}

function _isPropertySet(a: Advice) {
    return a.pointcut.ref.startsWith('property#set');
}

function _isDescriptorWritable(propDescriptor: PropertyDescriptor) {
    const desc = propDescriptor as Record<string, any>;
    return !desc || (desc.hasOwnProperty('writable') && desc.writable) || isFunction(desc.set);
}

class AdviceContextImpl<T, A extends AdviceType> implements MutableAdviceContext<unknown, A> {
    public advice: Advice<T, A>;
    public error: Error;
    public instance: T;
    public value: T | unknown;
    public args: any[];
    public joinpoint: JoinPoint;
    public target: AdviceTarget<T, A>;
    public data: Record<string, any>;

    constructor(target: AdviceTarget<any, A>, private readonly _weaverContext: WeaverContext) {
        this.target = target;
        this.data = {};
    }

    get annotations(): AnnotationsBundle {
        assert(this.target.location !== undefined);
        return this._weaverContext.annotations.bundle.at(
            _AnnotationLocationImpl.unwrap(this.target.location).bindRuntimeContext({
                instance: this.instance,
                args: this.args,
            }) as any, // TODO refactor
        );
    }

    clone(): this {
        return Object.assign(Object.create(Reflect.getPrototypeOf(this)) as MutableAdviceContext<unknown, A>, this);
    }

    toString(): string {
        return `${this.advice} on ${this.target.label}`;
    }
}
