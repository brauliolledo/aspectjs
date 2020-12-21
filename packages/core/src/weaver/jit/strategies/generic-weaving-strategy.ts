import {
    Advice,
    AdviceError,
    AdviceType,
    AfterAdvice,
    AfterReturnAdvice,
    AfterThrowAdvice,
    AnnotationType,
    AroundAdvice,
    BeforeAdvice,
    CompileAdvice,
    JoinPoint,
    MutableAdviceContext,
    _JoinpointFactory,
} from '@aspectjs/core/commons';
import { assert, isUndefined } from '@aspectjs/common/utils';
import { _CompiledSymbol, _WeavingStrategy } from '../../weaving-strategy';

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
                ctxt.advice = advice as any;
                ctxt.value = this._safeCallAdvice(ctxt as any, compiledSymbol, advice, [ctxt, ctxt.error]);
                delete ctxt.advice;
                if (!allowReturn && !isUndefined(ctxt.value)) {
                    throw new AdviceError(advice, `Returning from advice is not supported`);
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
                    throw new AdviceError(advice, `Returning from advice is not supported`);
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
                throw new AdviceError(advice, `Returning from advice is not supported`);
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
