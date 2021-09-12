import { __decorate, __metadata } from "tslib";
import { setupTestingWeaverContext } from '@aspectjs/core/testing';
import { Memo } from '../memo.annotation';
import { MemoAspect } from '../memo.aspect';
import { DefaultCacheableAspect } from '../cacheable/cacheable.aspect';
import { IdbMemoDriver, LsMemoDriver } from '../drivers';
export function createMemoMethod(method, options) {
    class MemoClassImpl {
        memoMethod(...args) {
            return method(...args);
        }
    }
    __decorate([
        Memo(options),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Object)
    ], MemoClassImpl.prototype, "memoMethod", null);
    const r = new MemoClassImpl();
    return r.memoMethod.bind(r);
}
export function setupMemoAspect(memoAspectOptions) {
    var _a;
    return setupTestingWeaverContext(new MemoAspect(Object.assign(Object.assign({}, memoAspectOptions), { drivers: (_a = memoAspectOptions === null || memoAspectOptions === void 0 ? void 0 : memoAspectOptions.drivers) !== null && _a !== void 0 ? _a : [new LsMemoDriver(), new IdbMemoDriver()] })), new DefaultCacheableAspect()).getWeaver();
}
//# sourceMappingURL=spec-helpers.js.map