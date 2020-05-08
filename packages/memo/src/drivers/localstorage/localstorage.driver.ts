import { MemoDriver, MemoDriverOptions } from '../memo.driver';
import { MemoKey, MemoValue } from '../../memo.types';
import { parse, stringify } from 'flatted';
import { MemoWrap } from '../memo-wrap';

export interface LsMemoDriverOptions extends MemoDriverOptions {
    localStorage?: typeof localStorage;
}

export const DEFAULT_LS_DRIVER_OPTIONS = {
    serializer: {
        deserialize(rawValue: string): MemoWrap {
            return parse(rawValue);
        },
        serialize(obj: MemoWrap): string {
            return stringify(obj);
        },
    },
};

export class LsMemoDriver extends MemoDriver {
    protected readonly _params: LsMemoDriverOptions;

    constructor(options?: LsMemoDriverOptions) {
        super({ ...DEFAULT_LS_DRIVER_OPTIONS, ...options });

        if (!this._ls) {
            throw new Error('localStorage not available on this platform, and no implementation was provided');
        }
    }

    private get _ls(): typeof localStorage {
        return this._params.localStorage ?? localStorage;
    }

    get NAME(): string {
        return 'localstorage';
    }

    getKeys(namespace: string): Promise<MemoKey[]> {
        const res: string[] = [];
        for (let i = 0; i < this._ls.length; ++i) {
            const k = this._ls.key(i);
            if (k.startsWith(namespace)) {
                res.push();
            }
        }

        return Promise.resolve(res.map(MemoKey.parse));
    }

    /**
     * Accepts all kind of results
     * @param type
     */
    getPriority(type: any): number {
        return 10;
    }

    doGetValue(key: MemoKey): any | undefined {
        return this._ls.getItem(key.toString());
    }

    doSetValue(key: MemoKey, value: any): void {
        this._ls.setItem(key.toString(), value);
    }

    doRemove(key: MemoKey): void {
        this._ls.removeItem(key.toString());
    }
}
