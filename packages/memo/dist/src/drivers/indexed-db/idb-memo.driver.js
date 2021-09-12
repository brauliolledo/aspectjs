import { __rest } from "tslib";
import { WEAVER_CONTEXT } from '@aspectjs/core';
import { MemoDriver } from '../memo.driver';
import { MemoKey } from '../../memo.types';
import { assert } from '@aspectjs/core/utils';
import { MemoFrame } from '../memo-frame';
import { MemoAspectError } from '../../errors';
import { Scheduler } from '../scheduler';
var TransactionMode;
(function (TransactionMode) {
    TransactionMode["READONLY"] = "readonly";
    TransactionMode["READ_WRITE"] = "readwrite";
})(TransactionMode || (TransactionMode = {}));
/**
 * Memo driver to store async @Memo result into the Indexed Database.
 * @public
 */
export class IdbMemoDriver extends MemoDriver {
    constructor(_params = {}) {
        super();
        this._params = _params;
        this.NAME = IdbMemoDriver.NAME;
        this._scheduler = new Scheduler();
        this._init$ = this._openDb();
    }
    get _idb() {
        var _a;
        return (_a = this._params.indexedDB) !== null && _a !== void 0 ? _a : indexedDB;
    }
    get _ls() {
        this._localStorageDriver = this._findLsDriver();
        return this._localStorageDriver;
    }
    getKeys(namespace) {
        return this._runTransactional((store) => store.getAllKeys(), TransactionMode.READONLY).then((result) => {
            return result
                .map((id) => id.toString())
                .map((str) => MemoKey.parse(str, false))
                .filter((k) => !!k);
        });
    }
    _openDb() {
        return new Promise((resolve, reject) => {
            const dbRequest = this._idb.open(IdbMemoDriver.DATABASE_NAME, IdbMemoDriver.DATABASE_VERSION);
            dbRequest.addEventListener('upgradeneeded', () => {
                const db = dbRequest.result;
                const store = db.createObjectStore(IdbMemoDriver.STORE_NAME, {
                    keyPath: 'ref',
                    autoIncrement: false,
                });
                store.createIndex('by_key', 'key', { unique: true });
            });
            dbRequest.addEventListener('success', () => resolve(dbRequest.result));
            dbRequest.addEventListener('error', (err) => reject(err));
        });
    }
    getPriority(context) {
        return 100;
    }
    accepts(context) {
        return context.frame.isAsync();
    }
    read(key) {
        var _a;
        const metaKey = createMetaKey(key);
        const metaEntry = this._ls.read(metaKey);
        if (!metaEntry) {
            return null;
        }
        assert(!!((_a = metaEntry.frame) === null || _a === void 0 ? void 0 : _a.type));
        assert(!!metaEntry.key);
        const asyncValue = this._runTransactional((tx) => tx.get(key.toString())).then((frame) => {
            if (!frame) {
                this._ls.remove(metaKey);
                throw new MemoAspectError(`No data found for key ${key}`);
            }
            return frame.value;
        });
        const frame = new MemoFrame(Object.assign(Object.assign({}, metaEntry), metaEntry.frame)).setAsyncValue(asyncValue);
        this._scheduler.add(key.toString(), () => frame.async);
        return frame
            ? Object.assign(Object.assign({}, metaEntry), { key,
                frame }) : undefined;
    }
    remove(key) {
        return this._scheduler
            .add(key.toString(), () => this._deleteIdbEntry(key).then(() => this._deleteLsEntry(key)))
            .then(() => { });
    }
    write(entry) {
        return this._scheduler.add(entry.key.toString(), () => {
            const _a = entry.frame, { value } = _a, metaFrame = __rest(_a, ["value"]);
            const metaEntry = Object.assign(Object.assign({}, entry), { key: createMetaKey(entry.key), frame: metaFrame });
            // store only the Memo without its value
            this._ls.write(metaEntry);
            const valueFrame = { ref: entry.key.toString(), value };
            return this._runTransactional((s) => s.put(valueFrame));
        });
    }
    _deleteIdbEntry(key) {
        return this._runTransactional((s) => s.delete(key.toString()));
    }
    _deleteLsEntry(key) {
        this._ls.remove(key);
    }
    _runTransactional(transactionFn, mode = TransactionMode.READ_WRITE) {
        return this._init$.then((database) => new Promise((resolve, reject) => {
            const store = database
                .transaction(IdbMemoDriver.STORE_NAME, mode)
                .objectStore(IdbMemoDriver.STORE_NAME);
            const request = transactionFn(store);
            request.addEventListener('success', () => resolve(request.result));
            request.addEventListener('error', (r) => {
                var _a, _b;
                const error = (_b = (_a = r.target) === null || _a === void 0 ? void 0 : _a.error) !== null && _b !== void 0 ? _b : r;
                console.error(error);
                return reject(error);
            });
        }));
    }
    _findLsDriver() {
        if (this._localStorageDriver) {
            return this._localStorageDriver;
        }
        if (this._params.localStorageDriver) {
            return this._params.localStorageDriver;
        }
        const drivers = WEAVER_CONTEXT.getWeaver().getAspect('@aspectjs/memo').getDrivers();
        if (!drivers['localStorage']) {
            throw new MemoAspectError(`${IdbMemoDriver.prototype.constructor.name} requires a "localStorage" driver, but option "localStorageDriver" is not set and no driver could be found with name "localStorage"`);
        }
        return drivers['localStorage'];
    }
}
IdbMemoDriver.NAME = 'indexedDb';
IdbMemoDriver.DATABASE_NAME = 'IndexedDbMemoAspect_db';
IdbMemoDriver.STORE_NAME = 'results';
IdbMemoDriver.DATABASE_VERSION = 1; // change this value whenever a backward-incompatible change is made to the store
function createMetaKey(key) {
    return new MemoKey(key, `${key.namespace}[idb_meta]`);
}
//# sourceMappingURL=idb-memo.driver.js.map