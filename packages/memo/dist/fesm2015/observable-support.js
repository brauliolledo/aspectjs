import { MemoMarshaller, MemoAspect, Memo } from '@aspectjs/memo';
import { from, isObservable } from 'rxjs';
import { shareReplay, share } from 'rxjs/operators';
import { AfterReturn, Aspect } from '@aspectjs/core/annotations';
import { WeavingError, on } from '@aspectjs/core/commons';

/**
 * Supports marshalling Observables
 * @public
 */
class ObservableMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Observable';
    }
    marshal(frame, context, defaultMarshal) {
        frame.setAsyncValue(frame.value
            .pipe(shareReplay(1))
            .toPromise()
            .then((v) => defaultMarshal(v)));
        return frame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        if (frame.isAsync()) {
            return from(frame.async.then((v) => defaultUnmarshal(v))).pipe(share());
        }
        else {
            return from(Promise.resolve(defaultUnmarshal(frame.value)));
        }
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

var ObservableMemoSupportAspect_1;
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

export { ObservableMarshaller, ObservableMemoSupportAspect };
//# sourceMappingURL=observable-support.js.map
