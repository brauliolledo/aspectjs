import { getAspectOptions, assert, isObject, isString } from '@aspectjs/core/utils';
/**
 * A WeaverProfile is a set of Aspects that can be enabled or disabled.
 * The profile itself is meant to be enabled on a Weaver, making it easy to enable multiples aspects at once.
 * @public
 */
export class WeaverProfile {
    constructor() {
        this._aspectsRegistry = {};
    }
    enable(...aspects) {
        aspects.forEach((p) => {
            if (p instanceof WeaverProfile) {
                Object.values(p._aspectsRegistry).forEach((p) => this.enable(p));
            }
            else {
                this.setEnabled(p, true);
            }
        });
        return this;
    }
    disable(...aspects) {
        aspects.forEach((p) => {
            if (p instanceof WeaverProfile) {
                // disable profile
                Object.values(p._aspectsRegistry).forEach((p) => this.disable(p));
            }
            else if (isObject(p)) {
                // disable aspect
                this.setEnabled(p, false);
            }
            else {
                assert(isString(p));
                // delete aspect by id
                delete this._aspectsRegistry[p];
            }
        });
        return this;
    }
    reset() {
        this._aspectsRegistry = {};
        return this;
    }
    setEnabled(aspect, enabled) {
        var _a;
        const id = getAspectOptions(aspect).id;
        if (enabled) {
            // avoid enabling an aspect twice
            const oldAspect = this._aspectsRegistry[id];
            if (oldAspect && oldAspect !== aspect) {
                console.warn(`Aspect ${aspect.constructor.name} overrides aspect "${(_a = oldAspect === null || oldAspect === void 0 ? void 0 : oldAspect.constructor.name) !== null && _a !== void 0 ? _a : 'unknown'}" already registered for name ${id}`);
            }
            this._aspectsRegistry[id] = aspect;
        }
        else {
            delete this._aspectsRegistry[id];
        }
        return this;
    }
    getAspect(aspect) {
        if (isString(aspect)) {
            return this._aspectsRegistry[aspect];
        }
        else {
            return this._aspectsRegistry[getAspectOptions(aspect).id];
        }
    }
    getAspects() {
        return Object.values(this._aspectsRegistry);
    }
    [Symbol.iterator]() {
        const aspects = this.getAspects();
        let i = 0;
        return {
            next: () => {
                if (i >= aspects.length) {
                    return { value: undefined, done: true };
                }
                return { value: aspects[i++], done: false };
            },
        };
    }
}
//# sourceMappingURL=profile.js.map