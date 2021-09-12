import { _getWeaverContext, _JoinpointFactory, PointcutPhase, WeavingError, } from '@aspectjs/core/commons';
import { assert } from '@aspectjs/core/utils';
/**
 * @internal
 */
export class _AdviceExecutionPlanFactory {
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
export class _ExecutionPlan {
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
//# sourceMappingURL=plan.factory.js.map