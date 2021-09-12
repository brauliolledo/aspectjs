import { _JoinpointFactory, } from '@aspectjs/core/commons';
import { assert, isFunction } from '@aspectjs/core/utils';
import { _GenericWeavingStrategy } from './generic-weaving-strategy';
/**
 * @internal
 */
export class _PropertySetWeavingStrategy extends _GenericWeavingStrategy {
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
//# sourceMappingURL=property-set-weaving-strategy.js.map