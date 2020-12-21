import { getAspectOptions, assert, isObject, isString } from '@aspectjs/common/utils';
import { AspectType } from '../aspect';

/**
 * A WeaverProfile is a set of Aspects that can be enabled or disabled.
 * The profile itself is meant to be enabled on a Weaver, making it easy to enable multiples aspects at once.
 * @public
 */
export class WeaverProfile {
    private _aspectsRegistry: {
        [aspectId: string]: AspectType;
    } = {};

    /**
     * Enable some aspects.
     * @param aspects - the aspects to enable
     */
    enable(...aspects: (AspectType | WeaverProfile)[]): this {
        aspects.forEach((p) => {
            if (p instanceof WeaverProfile) {
                Object.values(p._aspectsRegistry).forEach((p) => this.enable(p));
            } else {
                this.setEnabled(p, true);
            }
        });
        return this;
    }

    /**
     * Disable some aspects.
     * @param aspects - the aspects to disable
     */
    disable(...aspects: (AspectType | string | WeaverProfile)[]): this {
        aspects.forEach((p) => {
            if (p instanceof WeaverProfile) {
                // disable profile
                Object.values(p._aspectsRegistry).forEach((p) => this.disable(p));
            } else if (isObject(p)) {
                // disable aspect
                this.setEnabled(p, false);
            } else {
                assert(isString(p));
                // delete aspect by id
                delete this._aspectsRegistry[p];
            }
        });
        return this;
    }

    /**
     * Enable or disable an aspect
     * @param aspect - the aspect to enable or disable
     * @param enabled - enable or disable the given aspect
     */
    setEnabled(aspect: AspectType, enabled: boolean): this {
        const id = getAspectOptions(aspect).id;
        if (enabled) {
            // avoid enabling an aspect twice
            const oldAspect = this._aspectsRegistry[id];
            if (oldAspect && oldAspect !== aspect) {
                console.warn(
                    `Aspect ${aspect.constructor.name} overrides aspect "${
                        oldAspect?.constructor.name ?? 'unknown'
                    }" already registered for name ${id}`,
                );
            }

            this._aspectsRegistry[id] = aspect;
        } else {
            delete this._aspectsRegistry[id];
        }

        return this;
    }

    /**
     * Find an aspect among registered aspect given its aspect id or constructor.
     * @param aspect - the aspect id or constructor to find.
     * @returns The aspect if registered, undefined otherwise
     */
    getAspect<T extends AspectType>(aspect: string | (new () => T)): T | undefined {
        if (isString(aspect)) {
            return this._aspectsRegistry[aspect] as T;
        } else {
            return this._aspectsRegistry[getAspectOptions(aspect).id] as T;
        }
    }

    /**
     * Get all registered aspects
     */
    getAspects(): AspectType[] {
        return Object.values(this._aspectsRegistry);
    }

    /**
     * iterate over all registered aspects
     */
    [Symbol.iterator](): Iterator<AspectType> {
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
