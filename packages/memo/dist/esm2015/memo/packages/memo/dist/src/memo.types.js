import { MemoAspectError } from './errors.js';

const KEY_IDENTIFIER = '@aspectjs:Memo';
/**
 * @public
 */
class MemoKey {
    constructor(key, namespace) {
        this.namespace = namespace !== null && namespace !== void 0 ? namespace : key.namespace;
        this.targetKey = key.targetKey;
        this.instanceId = key.instanceId;
        this.argsKey = key.argsKey;
        this._strValue = `${KEY_IDENTIFIER}:ns=${this.namespace}&tk=${this.targetKey}&id=${this.instanceId}&ak=${this.argsKey}`;
    }
    static parse(str, throwIfInvalid = true) {
        if (!str.startsWith(KEY_IDENTIFIER)) {
            throw new TypeError(`Key ${str} is not a memo key`);
        }
        const rx = new RegExp(`${KEY_IDENTIFIER}:ns=(?<namespace>.*?)&tk=(?<targetKey>.*?)&id=(?<instanceId>.*?)&ak=(?<argsKey>.*)`);
        const r = rx.exec(str);
        if (!r) {
            if (throwIfInvalid) {
                throw new MemoAspectError(`given expression is not a MemoKey: ${str}`);
            }
            return null;
        }
        return new MemoKey(r.groups);
    }
    toString() {
        return this._strValue;
    }
}

export { MemoKey };
//# sourceMappingURL=memo.types.js.map
