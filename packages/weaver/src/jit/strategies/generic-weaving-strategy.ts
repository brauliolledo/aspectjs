import { AnnotationType } from '@aspectjs/common';
import { assert, isUndefined } from '@aspectjs/common/utils';
import {
    AdviceType,
    CompileAdvice,
    AdviceError,
    Advice,
    AfterAdvice,
    AfterReturnAdvice,
    AfterThrowAdvice,
    AroundAdvice,
    JoinPoint,
    BeforeAdvice,
} from '@aspectjs/core';
import { _JoinpointFactory } from '../../joinpoint-factory';
import { MutableAdviceContext } from '../../mutable-advice.context.type';
import { _CompiledSymbol, _WeavingStrategy } from '../../weaver/weaving-strategy';

/**
 * @internal
 */
export abstract class _GenericWeavingStrategy<T, A extends AdviceType> implements _WeavingStrategy<T, A> {
    after(ctxt: MutableAdviceContext<T, A>, compiledSymbol: _CompiledSymbol<T, A>, advices: AfterAdvice<T, A>[]): void {
        this._applyNonReturningAdvices(ctxt, compiledSymbol, advices);
    }

    afterReturn(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        advices: AfterReturnAdvice<T, A>[],
    ): T {
        ctxt.value = ctxt.value ?? ctxt.value; // force key 'value' to be present

        advices.forEach((advice) => {
            ctxt.advice = advice;
            ctxt.value = this._safeCallAdvice(ctxt as any, compiledSymbol, advice, [ctxt, ctxt.value]);
            delete ctxt.advice;
        });

        return ctxt.value as T;
    }

    afterThrow(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        advices: AfterThrowAdvice<T, A>[],
        allowReturn = true,
    ): any {
        if (advices.length) {
            ctxt.value = ctxt.value ?? undefined; // force key 'value' to be present
            advices.forEach((advice: AfterThrowAdvice) => {
                try {
                    ctxt.value = this._safeCallAdvice(ctxt as any, compiledSymbol, advice, [ctxt, ctxt.error]);
                    if (!allowReturn && !isUndefined(ctxt.value)) {
                        ctxt.advice = advice as any;
                        throw new AdviceError(ctxt, `Returning from advice is not supported`);
                    }
                } finally {
                    delete ctxt.advice;
                }
            });
            return ctxt.value;
        } else {
            assert(!!ctxt.error);
            // pass-trough errors by default
            throw ctxt.error;
        }
    }

    around(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        advices: AroundAdvice<T, A>[],
        jp: JoinPoint<T>,
        allowReturn = true,
    ): JoinPoint<T> {
        [...advices].reverse().forEach((advice) => {
            const originalJp = jp;
            const nextJp = _JoinpointFactory.create(advice, ctxt, (...args: unknown[]) => originalJp(args));
            jp = (args: any[]) => {
                ctxt.joinpoint = nextJp;
                ctxt.args = args;
                ctxt.value = this._safeCallAdvice(ctxt as any, compiledSymbol, advice, [ctxt, nextJp, args]);
                if (ctxt.value !== undefined && !allowReturn) {
                    throw new AdviceError(ctxt, `Returning from advice is not supported`);
                }
                return ctxt.value as T;
            };
        });

        return jp;
    }

    before(
        ctxt: MutableAdviceContext<T, A>,
        compiledSymbol: _CompiledSymbol<T, A>,
        advices: BeforeAdvice<T, A>[],
    ): void {
        this._applyNonReturningAdvices(ctxt, compiledSymbol, advices);
    }

    preCompile(ctxt: MutableAdviceContext<T, A>, advices: CompileAdvice<T, A>[]): void {
        // TODO remove ?
        // advices.forEach((a) => {
        //     if (Reflect.getOwnMetadata('@aspectjs::isCompiled', a, ctxt.target.ref)) {
        //         // prevent @Compile advices to be called twice
        //         throw new AdviceError(a, `Advice already applied`);
        //     }
        //     Reflect.defineMetadata('@aspectjs::isCompiled', true, a, ctxt.target.ref);
        // });
    }

    abstract compile(ctxt: MutableAdviceContext<T, A>, advices: CompileAdvice<T, AdviceType>[]): _CompiledSymbol<T, A>;

    abstract initialJoinpoint(
        ctxt: MutableAdviceContext<T, A>,
        originalSymbol: A extends AdviceType.CLASS ? { new (...args: any[]): T } : PropertyDescriptor,
    ): void;

    abstract finalize(
        ctxt: MutableAdviceContext<T, A>,
        joinpoint: (...args: any[]) => T,
    ): A extends AnnotationType.CLASS ? { new (...args: any[]): T } : PropertyDescriptor;

    protected _applyNonReturningAdvices(
        ctxt: MutableAdviceContext<any>,
        compiledSymbol: _CompiledSymbol<T, A>,
        advices: Advice[],
    ) {
        advices.forEach((advice: AfterAdvice) => {
            const retVal = this._safeCallAdvice(ctxt, compiledSymbol, advice, [ctxt]);
            if (!isUndefined(retVal)) {
                try {
                    ctxt.advice = advice;
                    throw new AdviceError(ctxt, `Returning from advice is not supported`);
                } finally {
                    delete ctxt.advice;
                }
            }
        });
    }

    private _safeCallAdvice(
        ctxt: MutableAdviceContext<any>,
        compiledSymbol: _CompiledSymbol<T, A>,
        advice: Advice,
        args: any[],
    ): unknown {
        // prevent access ctxt.value from within the before advice triggering the before advice again
        if (Reflect.getOwnMetadata('@aspectjs::called', advice)) {
            return this.initialJoinpoint(ctxt, compiledSymbol);
        }
        ctxt.advice = advice;
        Reflect.defineMetadata('@aspectjs::called', true, advice);
        const retVal = advice.apply(this, args);
        delete ctxt.advice;
        Reflect.defineMetadata('@aspectjs::called', false, advice);

        return retVal;
    }
}
