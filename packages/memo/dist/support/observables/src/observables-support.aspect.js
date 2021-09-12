var ObservableMemoSupportAspect_1;
import { __decorate, __metadata } from "tslib";
import { AfterReturn, Aspect } from '@aspectjs/core/annotations';
import { on, WeavingError } from '@aspectjs/core/commons';
import { Memo, MemoAspect } from '@aspectjs/memo';
import { isObservable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ObservableMarshaller } from './observable-marshaller';
/**
 * Enable support for Observables memoization.
 * @public
 */
let ObservableMemoSupportAspect = ObservableMemoSupportAspect_1 = class ObservableMemoSupportAspect {
    onEnable(weaver) {
        const memoAspect = weaver.getAspect(MemoAspect);
        if (!memoAspect) {
            throw new WeavingError(`Cannot enable ${ObservableMemoSupportAspect_1.name}: ${MemoAspect.name} should be enabled first`);
        }
        memoAspect.addMarshaller(new ObservableMarshaller());
    }
    onDisable(weaver) {
        var _a;
        (_a = weaver.getAspect(MemoAspect)) === null || _a === void 0 ? void 0 : _a.removeMarshaller(new ObservableMarshaller());
    }
    shareReplay(ctxt) {
        if (isObservable(ctxt.value)) {
            return ctxt.value.pipe(shareReplay(1));
        }
        return ctxt.value;
    }
};
__decorate([
    AfterReturn(on.method.withAnnotations(Memo)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ObservableMemoSupportAspect.prototype, "shareReplay", null);
ObservableMemoSupportAspect = ObservableMemoSupportAspect_1 = __decorate([
    Aspect('@aspectjs/memo:ObservableMemoSupportAspect')
], ObservableMemoSupportAspect);
export { ObservableMemoSupportAspect };
//# sourceMappingURL=observables-support.aspect.js.map