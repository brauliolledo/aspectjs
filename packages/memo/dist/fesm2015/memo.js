import { WEAVER_CONTEXT } from '@aspectjs/core';
import { ASPECTJS_ANNOTATION_FACTORY, on, WeavingError, AspectError, WeaverProfile } from '@aspectjs/core/commons';
import { Compile, Aspect, Around } from '@aspectjs/core/annotations';
import { isObject, getOrComputeMetadata, assert, isPromise, isFunction, isUndefined, isArray as isArray$1, isString, getProto } from '@aspectjs/core/utils';

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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function Cacheable(typeId) {
    return;
}
/**
 * Indicates that the result of annotated method could be cached.
 * @public
 */
const _Cacheable = ASPECTJS_ANNOTATION_FACTORY.create(Cacheable);

/**
 * Assign a key to the prototype of a class into a CacheTypeStore,
 * so that Memo drivers can inflate memoized objects with proper types.
 *
 * @public
 */
let DefaultCacheableAspect = class DefaultCacheableAspect {
    constructor(cacheTypeStore = new _CacheTypeStoreImpl()) {
        this.cacheTypeStore = cacheTypeStore;
    }
    registerCacheKey(ctxt) {
        var _a;
        let options = ctxt.annotations.onSelf(_Cacheable)[0].args[0];
        if (!isObject(options)) {
            options = {
                typeId: options,
            };
        }
        const typeId = (_a = options.typeId) !== null && _a !== void 0 ? _a : _generateTypeId(ctxt.target.proto);
        this.cacheTypeStore.addPrototype(ctxt.target.proto, typeId, options.version);
    }
};
__decorate([
    Compile(on.class.withAnnotations(_Cacheable)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DefaultCacheableAspect.prototype, "registerCacheKey", null);
DefaultCacheableAspect = __decorate([
    Aspect('@aspectjs/cacheable'),
    __metadata("design:paramtypes", [Object])
], DefaultCacheableAspect);
/**
 * Store class prototypes along with a defined key.
 * @internal
 */
class _CacheTypeStoreImpl {
    constructor() {
        this._prototypes = new Map();
    }
    getPrototype(key) {
        assert(!!key, 'key must be defined');
        const entry = this._prototypes.get(key);
        if (!entry) {
            throw new Error(`no prototype found for key ${key}`);
        }
        return entry.proto;
    }
    getTypeKey(prototype) {
        return Reflect.getOwnMetadata('@aspectjs/cacheable:typekey', prototype);
    }
    addPrototype(proto, typeId, version) {
        var _a, _b;
        const existingProto = this._prototypes.get(typeId);
        if (existingProto && existingProto !== proto) {
            throw new Error(`Cannot call @Cacheable({typeId = ${typeId}}) on ${(_a = proto === null || proto === void 0 ? void 0 : proto.constructor) === null || _a === void 0 ? void 0 : _a.name}: typeId is already assigned to ${(_b = existingProto === null || existingProto === void 0 ? void 0 : existingProto.constructor) === null || _b === void 0 ? void 0 : _b.name}`);
        }
        this._prototypes.set(typeId, { proto, version });
    }
    getVersion(key) {
        var _a, _b;
        return (_b = (_a = this._prototypes.get(key)) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : undefined;
    }
}
let globalId = 0;
function _generateTypeId(proto) {
    return getOrComputeMetadata('@aspectjs/cacheable:typekey', proto, () => {
        return `${proto.constructor.name}#${globalId++}`;
    });
}

/**
 * Connects the MemoAspect to a storage back-end
 * @public
 */
class MemoDriver {
    /**
     * Get the priority this driver should be picked up to handle the given type.
     */
    getPriority(context) {
        return 0;
    }
    accepts(context) {
        return true;
    }
}

class MemoAspectError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
class VersionConflictError extends MemoAspectError {
    constructor(message, context) {
        super(message);
        this.message = message;
        this.context = context;
    }
}

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

/**
 * A MemoEntry once marshalled
 * @public
 */
class MemoFrame {
    constructor(frame) {
        Object.assign(this, frame);
    }
    setValue(value) {
        this._resolved = true;
        this.async = null;
        const frame = this;
        frame.value = value;
        return frame;
    }
    setAsyncValue(value) {
        const frame = this;
        this._resolved = false;
        this.async = value.then((v) => {
            frame.value = v;
            this._resolved = true;
            return frame.value;
        });
        return frame;
    }
    isAsync() {
        return isPromise(this.async);
    }
}

/**
 * In case a @Memo method returns a promise, the corresponding MemoValue
 * can be persisted only once the promise gets resolved. As a result, all subsequent operations should be deferred.
 * This stores all the pending operations for a given key in call order,
 * to ensure an operation does not occurs before the previous operations.
 */
let globalOperationId = 0;
class Scheduler {
    constructor() {
        this._pendingOps = {};
        this._lastOperationId = {};
    }
    /** Add the given promise to the promise queue for this key **/
    add(key, op) {
        const k = key.toString();
        if (this._pendingOps[k]) {
            const opId = globalOperationId++;
            this._lastOperationId[k] = opId;
            this._pendingOps[k] = this._pendingOps[k]
                .then(() => op())
                .then((r) => {
                if (this._lastOperationId[k] === opId) {
                    delete this._pendingOps[k];
                    delete this._lastOperationId[k];
                }
                return r;
            });
        }
        else {
            this._pendingOps[k] = op();
        }
        return this._pendingOps[k];
    }
}

var TransactionMode;
(function (TransactionMode) {
    TransactionMode["READONLY"] = "readonly";
    TransactionMode["READ_WRITE"] = "readwrite";
})(TransactionMode || (TransactionMode = {}));
/**
 * Memo driver to store async @Memo result into the Indexed Database.
 * @public
 */
class IdbMemoDriver extends MemoDriver {
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

/**
 *
 * @param str - the value to hash
 * @public
 */
function hash(str) {
    return str
        .split('')
        .map((v) => v.charCodeAt(0))
        .reduce((a, v) => (a + ((a << 7) + (a << 3))) ^ v)
        .toString(16);
}

/**
 * Like Promise.resolve, but call resolve synchronously as soon as '.then' gets called
 */
class InstantPromise {
    constructor() {
        this._onfulfilled = [];
        this._onrejected = [];
    }
    static resolve(value) {
        return new InstantPromise().resolve(value);
    }
    static all(...promises) {
        const results = [];
        let promise = new InstantPromise().resolve(results);
        promises.forEach((p, i) => {
            promise = promise.then(() => p).then((v) => (results[i] = v));
        });
        return promise;
    }
    then(onfulfilled, onrejected) {
        if (this._resolved) {
            const res = onfulfilled(this._value);
            if (isPromise(res)) {
                return res;
            }
            else {
                return new InstantPromise().resolve(res);
            }
        }
        else {
            const delegate = new InstantPromise();
            this._onfulfilled.push((r) => delegate.resolve(onfulfilled ? onfulfilled(r) : undefined));
            this._onrejected.push((r) => delegate.resolve(onrejected ? onrejected(r) : undefined));
            return delegate;
        }
    }
    resolve(value) {
        if (this._resolved) {
            throw new Error('promise already resolved');
        }
        this._resolved = true;
        this._value = value;
        if (this._onfulfilled) {
            this._onfulfilled.forEach((f) => f(value));
        }
        return this;
    }
    reject(rejectValue) {
        if (this._resolved) {
            throw new Error('promise already resolved');
        }
        this._resolved = true;
        this._rejectValue = rejectValue;
        if (this._onrejected) {
            this._onrejected.forEach((f) => f(rejectValue));
        }
        return this;
    }
}

function provider(arg) {
    return isFunction(arg) ? arg : () => arg;
}

/*! (c) 2020 Andrea Giammarchi */

const {parse: $parse, stringify: $stringify} = JSON;
const {keys} = Object;

const Primitive = String;   // it could be Number
const primitive = 'string'; // it could be 'number'

const ignore = {};
const object = 'object';

const noop = (_, value) => value;

const primitives = value => (
  value instanceof Primitive ? Primitive(value) : value
);

const Primitives = (_, value) => (
  typeof value === primitive ? new Primitive(value) : value
);

const revive = (input, parsed, output, $) => {
  const lazy = [];
  for (let ke = keys(output), {length} = ke, y = 0; y < length; y++) {
    const k = ke[y];
    const value = output[k];
    if (value instanceof Primitive) {
      const tmp = input[value];
      if (typeof tmp === object && !parsed.has(tmp)) {
        parsed.add(tmp);
        output[k] = ignore;
        lazy.push({k, a: [input, parsed, tmp, $]});
      }
      else
        output[k] = $.call(output, k, tmp);
    }
    else if (output[k] !== ignore)
      output[k] = $.call(output, k, value);
  }
  for (let {length} = lazy, i = 0; i < length; i++) {
    const {k, a} = lazy[i];
    output[k] = $.call(output, k, revive.apply(null, a));
  }
  return output;
};

const set = (known, input, value) => {
  const index = Primitive(input.push(value) - 1);
  known.set(value, index);
  return index;
};

const parse = (text, reviver) => {
  const input = $parse(text, Primitives).map(primitives);
  const value = input[0];
  const $ = reviver || noop;
  const tmp = typeof value === object && value ?
              revive(input, new Set, value, $) :
              value;
  return $.call({'': tmp}, '', tmp);
};

const stringify = (value, replacer, space) => {
  const $ = replacer && typeof replacer === object ?
            (k, v) => (k === '' || -1 < replacer.indexOf(k) ? v : void 0) :
            (replacer || noop);
  const known = new Map;
  const input = [];
  const output = [];
  let i = +set(known, input, $.call({'': value}, '', value));
  let firstRun = !i;
  while (i < input.length) {
    firstRun = true;
    output[i] = $stringify(input[i++], replace, space);
  }
  return '[' + output.join(',') + ']';
  function replace(key, value) {
    if (firstRun) {
      firstRun = !firstRun;
      return value;
    }
    const after = $.call(this, key, value);
    switch (typeof after) {
      case object:
        if (after === null) return after;
      case primitive:
        return known.get(after) || set(known, input, after);
    }
    return after;
  }
};

var RawMemoField;
(function (RawMemoField) {
    RawMemoField[RawMemoField["VALUE"] = 0] = "VALUE";
    RawMemoField[RawMemoField["TYPE"] = 1] = "TYPE";
    RawMemoField[RawMemoField["INSTANCE_TYPE"] = 2] = "INSTANCE_TYPE";
    RawMemoField[RawMemoField["EXPIRATION"] = 3] = "EXPIRATION";
    RawMemoField[RawMemoField["VERSION"] = 4] = "VERSION";
    RawMemoField[RawMemoField["SIGNATURE"] = 5] = "SIGNATURE";
    RawMemoField[RawMemoField["HASH"] = 6] = "HASH";
})(RawMemoField || (RawMemoField = {}));
const F = RawMemoField;
class SimpleLsSerializer {
    deserialize(serialized) {
        if (!serialized) {
            return null;
        }
        const raw = parse(serialized);
        return {
            expiration: raw[F.EXPIRATION] ? new Date(raw[F.EXPIRATION]) : undefined,
            frame: new MemoFrame({
                value: raw[F.VALUE],
                type: raw[F.TYPE],
                instanceType: raw[F.INSTANCE_TYPE],
                version: raw[F.VERSION],
                hash: raw[F.HASH],
            }),
            signature: raw[F.SIGNATURE],
        };
    }
    serialize(entry) {
        const raw = {};
        if (!isUndefined(entry.frame.value)) {
            raw[F.VALUE] = entry.frame.value;
        }
        if (!isUndefined(entry.frame.type)) {
            raw[F.TYPE] = entry.frame.type;
        }
        if (!isUndefined(entry.frame.instanceType)) {
            raw[F.INSTANCE_TYPE] = entry.frame.instanceType;
        }
        if (!isUndefined(entry.frame.version)) {
            raw[F.VERSION] = entry.frame.version;
        }
        if (!isUndefined(entry.frame.hash)) {
            raw[F.HASH] = entry.frame.hash;
        }
        if (!isUndefined(entry.expiration)) {
            raw[F.EXPIRATION] = entry.expiration;
        }
        if (!isUndefined(entry.signature)) {
            raw[F.SIGNATURE] = entry.signature;
        }
        return stringify(raw);
    }
}

/**
 * @public
 */
const DEFAULT_LS_DRIVER_OPTIONS = {
    serializer: new SimpleLsSerializer(),
};
/**
 * Memo driver to store async @Memo result into the Indexed Database.
 * @public
 */
class LsMemoDriver extends MemoDriver {
    constructor(options) {
        super();
        this.options = options;
        this.NAME = LsMemoDriver.NAME;
        this.options = Object.assign(Object.assign({}, DEFAULT_LS_DRIVER_OPTIONS), options);
        if (!this._ls) {
            throw new Error('localStorage not available on this platform, and no implementation was provided');
        }
    }
    get _ls() {
        var _a;
        return (_a = this.options.localStorage) !== null && _a !== void 0 ? _a : localStorage;
    }
    getKeys(namespace) {
        const res = [];
        for (let i = 0; i < this._ls.length; ++i) {
            const kStr = this._ls.key(i);
            const key = MemoKey.parse(kStr, false);
            if ((key === null || key === void 0 ? void 0 : key.namespace) === namespace) {
                res.push(key);
            }
        }
        return Promise.resolve(res);
    }
    /**
     * Accepts all kind of results
     * @param context - the marshalling context for the current 'to-be-stored' value
     */
    getPriority(context) {
        return 10;
    }
    read(key) {
        var _a, _b;
        const serializer = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.serializer) !== null && _b !== void 0 ? _b : DEFAULT_LS_DRIVER_OPTIONS.serializer;
        const frame = serializer.deserialize(this._ls.getItem(key.toString()));
        return frame
            ? Object.assign({ key }, frame) : undefined;
    }
    write(entry) {
        var _a, _b;
        const serializer = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.serializer) !== null && _b !== void 0 ? _b : DEFAULT_LS_DRIVER_OPTIONS.serializer;
        this._ls.setItem(entry.key.toString(), serializer.serialize(entry));
        return InstantPromise.resolve();
    }
    remove(key) {
        this._ls.removeItem(key.toString());
        return InstantPromise.resolve();
    }
}
LsMemoDriver.NAME = 'localStorage';

/*!
MIT License
Copyright (c) 2013 pieroxy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const f = String.fromCharCode;
function compressToUTF16(input) {
    if (input == null)
        return '';
    return (_compress(input, 15, function (a) {
        return f(a + 32);
    }) + ' ');
}
function decompressFromUTF16(compressed) {
    if (compressed == null)
        return '';
    if (compressed == '')
        return null;
    return _decompress(compressed.length, 16384, function (index) {
        return compressed.charCodeAt(index) - 32;
    });
}
function _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null)
        return '';
    const context_dictionary = {};
    const context_dictionaryToCreate = {};
    const context_data = [];
    let i, value, context_c = '', context_wc = '', context_w = '', context_enlargeIn = 2, // Compensate for the first entry which should not count
    context_dictSize = 3, context_numBits = 2, context_data_val = 0, context_data_position = 0;
    for (let ii = 0; ii < uncompressed.length; ii += 1) {
        context_c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
        }
        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
            context_w = context_wc;
        }
        else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = context_data_val << 1;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                else {
                    value = 1;
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
            }
            else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
            // Add wc to the dictionary.
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
        }
    }
    // Output the code for w.
    if (context_w !== '') {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            else {
                value = 1;
                for (i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | value;
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                    value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    }
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
        }
        else {
            value = context_dictionary[context_w];
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                }
                else {
                    context_data_position++;
                }
                value = value >> 1;
            }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
        }
    }
    // Mark the end of the stream
    value = 2;
    for (i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
        }
        else {
            context_data_position++;
        }
        value = value >> 1;
    }
    // Flush the last char
    while (true) {
        context_data_val = context_data_val << 1;
        if (context_data_position == bitsPerChar - 1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
        }
        else
            context_data_position++;
    }
    return context_data.join('');
}
function _decompress(length, resetValue, getNextValue) {
    let entry = '';
    const dictionary = [];
    const result = [];
    const data = { val: getNextValue(0), position: resetValue, index: 1 };
    let w;
    let enlargeIn = 4, dictSize = 4, numBits = 3, i, bits, resb, maxpower, power, c;
    for (i = 0; i < 3; i += 1) {
        dictionary[i] = i;
    }
    bits = 0;
    maxpower = Math.pow(2, 2);
    power = 1;
    while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
    }
    switch ((bits)) {
        case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            c = f(bits);
            break;
        case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            c = f(bits);
            break;
        case 2:
            return '';
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
        if (data.index > length) {
            return '';
        }
        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }
        switch ((c = bits)) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
            case 2:
                return result.join('');
        }
        if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
        if (dictionary[c]) {
            entry = dictionary[c];
        }
        else {
            if (c === dictSize) {
                entry = w + w.charAt(0);
            }
            else {
                return null;
            }
        }
        result.push(entry);
        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;
        if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
    }
}

/**
 * Uses lz-string to compress serialized values in order to save-up some LocalStorage space.
 * @public
 */
class LzMemoSerializer extends SimpleLsSerializer {
    deserialize(str) {
        if (!str) {
            return null;
        }
        return super.deserialize(decompressFromUTF16(str));
    }
    serialize(obj) {
        if (!obj) {
            return null;
        }
        return compressToUTF16(super.serialize(obj));
    }
}

var toStringFunction = Function.prototype.toString;
var create = Object.create, defineProperty = Object.defineProperty, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, getOwnPropertyNames = Object.getOwnPropertyNames, getOwnPropertySymbols = Object.getOwnPropertySymbols, getPrototypeOf = Object.getPrototypeOf;
var _a = Object.prototype, hasOwnProperty = _a.hasOwnProperty, propertyIsEnumerable = _a.propertyIsEnumerable;
/**
 * @enum
 *
 * @const {Object} SUPPORTS
 *
 * @property {boolean} SYMBOL_PROPERTIES are symbol properties supported
 * @property {boolean} WEAKMAP is WeakMap supported
 */
var SUPPORTS = {
    SYMBOL_PROPERTIES: typeof getOwnPropertySymbols === 'function',
    WEAKMAP: typeof WeakMap === 'function',
};
/**
 * @function createCache
 *
 * @description
 * get a new cache object to prevent circular references
 *
 * @returns the new cache object
 */
var createCache = function () {
    if (SUPPORTS.WEAKMAP) {
        return new WeakMap();
    }
    // tiny implementation of WeakMap
    var object = create({
        has: function (key) { return !!~object._keys.indexOf(key); },
        set: function (key, value) {
            object._keys.push(key);
            object._values.push(value);
        },
        get: function (key) { return object._values[object._keys.indexOf(key)]; },
    });
    object._keys = [];
    object._values = [];
    return object;
};
/**
 * @function getCleanClone
 *
 * @description
 * get an empty version of the object with the same prototype it has
 *
 * @param object the object to build a clean clone from
 * @param realm the realm the object resides in
 * @returns the empty cloned object
 */
var getCleanClone = function (object, realm) {
    if (!object.constructor) {
        return create(null);
    }
    var Constructor = object.constructor;
    var prototype = object.__proto__ || getPrototypeOf(object);
    if (Constructor === realm.Object) {
        return prototype === realm.Object.prototype ? {} : create(prototype);
    }
    if (~toStringFunction.call(Constructor).indexOf('[native code]')) {
        try {
            return new Constructor();
        }
        catch (_a) { }
    }
    return create(prototype);
};
/**
 * @function getObjectCloneLoose
 *
 * @description
 * get a copy of the object based on loose rules, meaning all enumerable keys
 * and symbols are copied, but property descriptors are not considered
 *
 * @param object the object to clone
 * @param realm the realm the object resides in
 * @param handleCopy the function that handles copying the object
 * @returns the copied object
 */
var getObjectCloneLoose = function (object, realm, handleCopy, cache) {
    var clone = getCleanClone(object, realm);
    // set in the cache immediately to be able to reuse the object recursively
    cache.set(object, clone);
    for (var key in object) {
        if (hasOwnProperty.call(object, key)) {
            clone[key] = handleCopy(object[key], cache);
        }
    }
    if (SUPPORTS.SYMBOL_PROPERTIES) {
        var symbols = getOwnPropertySymbols(object);
        var length_1 = symbols.length;
        if (length_1) {
            for (var index = 0, symbol = void 0; index < length_1; index++) {
                symbol = symbols[index];
                if (propertyIsEnumerable.call(object, symbol)) {
                    clone[symbol] = handleCopy(object[symbol], cache);
                }
            }
        }
    }
    return clone;
};
/**
 * @function getObjectCloneStrict
 *
 * @description
 * get a copy of the object based on strict rules, meaning all keys and symbols
 * are copied based on the original property descriptors
 *
 * @param object the object to clone
 * @param realm the realm the object resides in
 * @param handleCopy the function that handles copying the object
 * @returns the copied object
 */
var getObjectCloneStrict = function (object, realm, handleCopy, cache) {
    var clone = getCleanClone(object, realm);
    // set in the cache immediately to be able to reuse the object recursively
    cache.set(object, clone);
    var properties = SUPPORTS.SYMBOL_PROPERTIES
        ? getOwnPropertyNames(object).concat(getOwnPropertySymbols(object))
        : getOwnPropertyNames(object);
    var length = properties.length;
    if (length) {
        for (var index = 0, property = void 0, descriptor = void 0; index < length; index++) {
            property = properties[index];
            if (property !== 'callee' && property !== 'caller') {
                descriptor = getOwnPropertyDescriptor(object, property);
                if (descriptor) {
                    // Only clone the value if actually a value, not a getter / setter.
                    if (!descriptor.get && !descriptor.set) {
                        descriptor.value = handleCopy(object[property], cache);
                    }
                    try {
                        defineProperty(clone, property, descriptor);
                    }
                    catch (error) {
                        // Tee above can fail on node in edge cases, so fall back to the loose assignment.
                        clone[property] = descriptor.value;
                    }
                }
                else {
                    // In extra edge cases where the property descriptor cannot be retrived, fall back to
                    // the loose assignment.
                    clone[property] = handleCopy(object[property], cache);
                }
            }
        }
    }
    return clone;
};
/**
 * @function getRegExpFlags
 *
 * @description
 * get the flags to apply to the copied regexp
 *
 * @param regExp the regexp to get the flags of
 * @returns the flags for the regexp
 */
var getRegExpFlags = function (regExp) {
    var flags = '';
    if (regExp.global) {
        flags += 'g';
    }
    if (regExp.ignoreCase) {
        flags += 'i';
    }
    if (regExp.multiline) {
        flags += 'm';
    }
    if (regExp.unicode) {
        flags += 'u';
    }
    if (regExp.sticky) {
        flags += 'y';
    }
    return flags;
};

// utils
var isArray = Array.isArray;
var GLOBAL_THIS = (function () {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    if (console && console.error) {
        console.error('Unable to locate global object, returning "this".');
    }
})();
/**
 * @function copy
 *
 * @description
 * copy an object deeply as much as possible
 *
 * If `strict` is applied, then all properties (including non-enumerable ones)
 * are copied with their original property descriptors on both objects and arrays.
 *
 * The object is compared to the global constructors in the `realm` provided,
 * and the native constructor is always used to ensure that extensions of native
 * objects (allows in ES2015+) are maintained.
 *
 * @param object the object to copy
 * @param [options] the options for copying with
 * @param [options.isStrict] should the copy be strict
 * @param [options.realm] the realm (this) object the object is copied from
 * @returns the copied object
 */
function copy(object, options) {
    // manually coalesced instead of default parameters for performance
    var isStrict = !!(options && options.isStrict);
    var realm = (options && options.realm) || GLOBAL_THIS;
    var getObjectClone = isStrict
        ? getObjectCloneStrict
        : getObjectCloneLoose;
    /**
     * @function handleCopy
     *
     * @description
     * copy the object recursively based on its type
     *
     * @param object the object to copy
     * @returns the copied object
     */
    var handleCopy = function (object, cache) {
        if (!object || typeof object !== 'object') {
            return object;
        }
        if (cache.has(object)) {
            return cache.get(object);
        }
        var Constructor = object.constructor;
        // plain objects
        if (Constructor === realm.Object) {
            return getObjectClone(object, realm, handleCopy, cache);
        }
        var clone;
        // arrays
        if (isArray(object)) {
            // if strict, include non-standard properties
            if (isStrict) {
                return getObjectCloneStrict(object, realm, handleCopy, cache);
            }
            var length_1 = object.length;
            clone = new Constructor();
            cache.set(object, clone);
            for (var index = 0; index < length_1; index++) {
                clone[index] = handleCopy(object[index], cache);
            }
            return clone;
        }
        // dates
        if (object instanceof realm.Date) {
            return new Constructor(object.getTime());
        }
        // regexps
        if (object instanceof realm.RegExp) {
            clone = new Constructor(object.source, object.flags || getRegExpFlags(object));
            clone.lastIndex = object.lastIndex;
            return clone;
        }
        // maps
        if (realm.Map && object instanceof realm.Map) {
            clone = new Constructor();
            cache.set(object, clone);
            object.forEach(function (value, key) {
                clone.set(key, handleCopy(value, cache));
            });
            return clone;
        }
        // sets
        if (realm.Set && object instanceof realm.Set) {
            clone = new Constructor();
            cache.set(object, clone);
            object.forEach(function (value) {
                clone.add(handleCopy(value, cache));
            });
            return clone;
        }
        // blobs
        if (realm.Blob && object instanceof realm.Blob) {
            return object.slice(0, object.size, object.type);
        }
        // buffers (node-only)
        if (realm.Buffer && realm.Buffer.isBuffer(object)) {
            clone = realm.Buffer.allocUnsafe
                ? realm.Buffer.allocUnsafe(object.length)
                : new Constructor(object.length);
            cache.set(object, clone);
            object.copy(clone);
            return clone;
        }
        // arraybuffers / dataviews
        if (realm.ArrayBuffer) {
            // dataviews
            if (realm.ArrayBuffer.isView(object)) {
                clone = new Constructor(object.buffer.slice(0));
                cache.set(object, clone);
                return clone;
            }
            // arraybuffers
            if (object instanceof realm.ArrayBuffer) {
                clone = object.slice(0);
                cache.set(object, clone);
                return clone;
            }
        }
        // if the object cannot / should not be cloned, don't
        if (
        // promise-like
        typeof object.then === 'function' ||
            // errors
            object instanceof Error ||
            // weakmaps
            (realm.WeakMap && object instanceof realm.WeakMap) ||
            // weaksets
            (realm.WeakSet && object instanceof realm.WeakSet)) {
            return object;
        }
        // assume anything left is a custom constructor
        return getObjectClone(object, realm, handleCopy, cache);
    };
    return handleCopy(object, createCache());
}
// Adding reference to allow usage in CommonJS libraries compiled using TSC, which
// expects there to be a default property on the exported object. See
// [#37](https://github.com/planttheidea/fast-copy/issues/37) for details.
copy.default = copy;
/**
 * @function strictCopy
 *
 * @description
 * copy the object with `strict` option pre-applied
 *
 * @param object the object to copy
 * @param [options] the options for copying with
 * @param [options.realm] the realm (this) object the object is copied from
 * @returns the copied object
 */
copy.strict = function strictCopy(object, options) {
    return copy(object, {
        isStrict: true,
        realm: options ? options.realm : void 0,
    });
};

/**
 * @public
 */
class MemoMarshaller {
}

/**
 * Supports marshalling simple objects
 * @public
 */
class ObjectMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = ['Object', 'object'];
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    marshal(frame, context, defaultMarshal) {
        if (!frame.value) {
            return frame;
        }
        return frame.setValue([]
            .concat(Object.getOwnPropertyNames(frame.value))
            .concat(Object.getOwnPropertySymbols(frame.value))
            .reduce((w, k) => {
            const v = frame.value[k];
            w[k] = defaultMarshal(v);
            return w;
        }, {}));
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    unmarshal(frame, context, defaultUnmarshal) {
        if (frame.value === null) {
            return null;
        }
        const value = {};
        context.blacklist.set(frame, value);
        assert(!!frame.value);
        return []
            .concat(Object.getOwnPropertyNames(frame.value))
            .concat(Object.getOwnPropertySymbols(frame.value))
            .reduce((v, k) => {
            v[k] = defaultUnmarshal(frame.value[k]);
            return v;
        }, value);
    }
}

/**
 * Supports marshalling instances of classes annotated with @Cacheable
 * @public
 */
class CacheableMarshaller extends MemoMarshaller {
    constructor(options) {
        var _a, _b;
        super();
        this.types = '*';
        this._objectMarshaller = (_a = options === null || options === void 0 ? void 0 : options.objectMarshaller) !== null && _a !== void 0 ? _a : new ObjectMarshaller();
        this._nonCacheableHandler =
            (_b = options === null || options === void 0 ? void 0 : options.nonCacheableHandler) !== null && _b !== void 0 ? _b : ((proto) => {
                const name = proto.constructor.name;
                throw new TypeError(`Type "${name}" is not annotated with "${_Cacheable}". Please add "${_Cacheable}" on class "${name}", or register a proper ${MemoMarshaller.name} for this type.`);
            });
    }
    marshal(frame, context, defaultMarshal) {
        // delete wrap.type; // Do not store useless type, as INSTANCE_TYPE is used for objects of non-built-in types.
        const proto = Reflect.getPrototypeOf(frame.value);
        const ts = typeStore();
        const instanceType = ts.getTypeKey(proto);
        if (!instanceType) {
            this._nonCacheableHandler(proto);
        }
        const newFrame = this._objectMarshaller.marshal(frame, context, defaultMarshal);
        newFrame.hash = __createHash(proto);
        newFrame.instanceType = instanceType;
        newFrame.version = provider(ts.getVersion(instanceType))();
        return newFrame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        frame.value = this._objectMarshaller.unmarshal(frame, context, defaultUnmarshal);
        assert(!!frame.instanceType);
        const ts = typeStore();
        const proto = ts.getPrototype(frame.instanceType);
        const version = provider(ts.getVersion(frame.instanceType))();
        if (version !== frame.version) {
            if (version !== frame.version) {
                throw new VersionConflictError(`Object for key ${frame.instanceType} is of version ${version}, but incompatible version ${frame.version} was already cached`, context);
            }
        }
        if (version === undefined && frame.hash !== __createHash(proto)) {
            throw new VersionConflictError(`Hash changed for type ${frame.instanceType} `, context);
        }
        Reflect.setPrototypeOf(frame.value, proto);
        return frame.value;
    }
}
function typeStore() {
    const weaver = WEAVER_CONTEXT.getWeaver();
    if (!weaver) {
        throw new WeavingError('no weaver configured. Please call setWeaver()');
    }
    const cacheableAspect = weaver.getAspect('@aspectjs/cacheable');
    if (!cacheableAspect) {
        throw new WeavingError('MemoAspect requires an aspect to be registered for id "@aspectjs/cacheable".' +
            ' Did you forgot to call getWeaver().enable(new DefaultCacheableAspect()) ?');
    }
    return cacheableAspect.cacheTypeStore;
}
function __createHash(proto) {
    const s = [];
    let p = proto;
    while (p !== Object.prototype) {
        s.push(p.constructor.toString());
        p = Reflect.getPrototypeOf(p);
    }
    return hash(s.join());
}

/**
 * Supports marshalling arrays
 * @public
 */
class ArrayMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Array';
    }
    marshal(frame, context, defaultMarshal) {
        // array may contain promises
        frame.value = frame.value.map((i) => defaultMarshal(i));
        return frame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        // assert(wrapped[F.TYPE] === ValueType.ARRAY);
        const value = [];
        context.blacklist.set(frame, value);
        value.push(...frame.value.map((w) => defaultUnmarshal(w)));
        return value;
    }
}

/**
 * Supports marshalling primitives
 * @public
 */
class BasicMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = ['Number', 'String', 'Boolean', 'symbol', 'number', 'string', 'boolean', 'symbol', 'undefined'];
    }
    marshal(frame) {
        return frame;
    }
    unmarshal(frame) {
        return frame.value;
    }
}

/**
 * Supports marshalling Dates
 * @public
 */
class DateMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Date';
    }
    marshal(frame) {
        return frame.setValue(stringify(frame.value));
    }
    unmarshal(frame) {
        return new Date(parse(frame.value));
    }
}

/**
 * Pass-through marshaller
 * @public
 */
class NoopMarshaller extends MemoMarshaller {
    marshal(value) {
        return new MemoFrame({
            value,
        });
    }
    unmarshal(frame) {
        return frame.value;
    }
}

/**
 * Supports marshalling promises
 * @public
 */
class PromiseMarshaller extends MemoMarshaller {
    constructor() {
        super(...arguments);
        this.types = 'Promise';
    }
    marshal(frame, context, defaultMarshal) {
        frame.setAsyncValue(frame.value.then((v) => defaultMarshal(v)));
        return frame;
    }
    unmarshal(frame, context, defaultUnmarshal) {
        if (frame.isAsync()) {
            return frame.async.then((v) => {
                return defaultUnmarshal(v);
            });
        }
        else {
            return Promise.resolve(defaultUnmarshal(frame.value));
        }
    }
}

class MarshallersRegistry {
    constructor() {
        this._marshallers = {};
    }
    addMarshaller(...marshallers) {
        (marshallers !== null && marshallers !== void 0 ? marshallers : []).forEach((marshaller) => {
            [marshaller.types].flat().forEach((type) => {
                this._marshallers[type] = marshaller;
            });
        });
        return this;
    }
    removeMarshaller(...marshallers) {
        (marshallers !== null && marshallers !== void 0 ? marshallers : []).forEach((marshaller) => {
            [marshaller.types].flat().forEach((type) => {
                delete this._marshallers[type];
            });
        });
        return this;
    }
    getMarshaller(typeName) {
        var _a;
        const marshaller = (_a = this._marshallers[typeName]) !== null && _a !== void 0 ? _a : this._marshallers['*'];
        if (!marshaller) {
            throw new TypeError(`No marshaller to handle value of type ${typeName}`);
        }
        return marshaller;
    }
    marshal(value) {
        return new MarshallingContextImpl(this, value);
    }
    unmarshal(frame) {
        return new UnmarshallingContextImpl(this, frame).frame.value;
    }
}
class MarshallingContextImpl {
    constructor(_marshallersRegistry, value) {
        this._marshallersRegistry = _marshallersRegistry;
        this.value = value;
        this._blacklist = new Map();
        this._promises = [];
        this.frame = this._defaultMarshal(this.value);
    }
    _defaultMarshal(value) {
        var _a;
        if (this._blacklist.has(value)) {
            return this._blacklist.get(value);
        }
        const type = (_a = value === null || value === void 0 ? void 0 : value.constructor.name) !== null && _a !== void 0 ? _a : typeof value;
        const marshaller = this._marshallersRegistry.getMarshaller(type);
        const baseFrame = new MemoFrame({ value, type });
        if (isObject(value) || isArray$1(value)) {
            this._blacklist.set(value, baseFrame);
        }
        const frame = marshaller.marshal(baseFrame, this, this._defaultMarshal.bind(this));
        if (frame.isAsync()) {
            this._promises.push(frame.async);
        }
        return frame;
    }
    then(onfulfilled, onrejected) {
        return InstantPromise.all(...this._promises)
            .then(() => this.frame)
            .then(onfulfilled, onrejected);
    }
}
class UnmarshallingContextImpl {
    constructor(_marshallersRegistry, frame) {
        this._marshallersRegistry = _marshallersRegistry;
        this.frame = frame;
        this.blacklist = new Map();
        this._defaultUnmarshal(this.frame);
    }
    _defaultUnmarshal(frame) {
        var _a;
        assert(!!frame);
        if (this.blacklist.has(frame)) {
            return this.blacklist.get(frame);
        }
        if (!frame) {
            return null;
        }
        if (!(frame instanceof MemoFrame)) {
            Reflect.setPrototypeOf(frame, MemoFrame.prototype);
        }
        assert(!!frame.type);
        const typeName = (_a = frame.type) !== null && _a !== void 0 ? _a : '*';
        const marshaller = this._marshallersRegistry.getMarshaller(typeName);
        frame.value = marshaller.unmarshal(frame, this, this._defaultUnmarshal.bind(this));
        return frame.value;
    }
}

/**
 * Memoize the return value of a method. The return value can be sored in LocalStorage or in IndexedDb according to configured drivers.
 * @see MEMO_PROFILE
 * @public
 */
const Memo = ASPECTJS_ANNOTATION_FACTORY.create(function Memo(options) {
    return;
});

/**
 * @public marshallers that gets configured with default MemoAspect
 */
const DEFAULT_MARSHALLERS = [
    new ObjectMarshaller(),
    new ArrayMarshaller(),
    new DateMarshaller(),
    new PromiseMarshaller(),
    new CacheableMarshaller(),
    new BasicMarshaller(),
];
Object.freeze(DEFAULT_MARSHALLERS);
const MEMO_ID_REFLECT_KEY = '@aspectjs:memo/id';
let internalId = 0;
const DEFAULT_MEMO_ASPECT_OPTIONS = {
    id: (ctxt) => {
        var _a, _b;
        const { id, _id, hashcode, _hashcode } = ctxt.instance;
        const result = (_b = (_a = id !== null && id !== void 0 ? id : _id) !== null && _a !== void 0 ? _a : hashcode) !== null && _b !== void 0 ? _b : _hashcode;
        if (isUndefined(result)) {
            return getOrComputeMetadata(MEMO_ID_REFLECT_KEY, ctxt.instance, () => internalId++);
        }
        return result;
    },
    namespace: '',
    createMemoKey: (ctxt) => {
        return new MemoKey({
            namespace: ctxt.data.namespace,
            instanceId: ctxt.data.instanceId,
            argsKey: hash(stringify(ctxt.args)),
            targetKey: hash(`${ctxt.target.ref}`),
        });
    },
    expiration: undefined,
    marshallers: DEFAULT_MARSHALLERS,
    drivers: [],
};
/**
 * Enable Memoization of a method's return value.
 * @public
 */
let MemoAspect = class MemoAspect {
    constructor(params) {
        var _a, _b;
        this._drivers = {};
        /** maps memo keys with its unregister function for garbage collector timeouts */
        this._entriesGc = new Map();
        this._pendingResults = new Map();
        this._options = Object.assign(Object.assign({}, DEFAULT_MEMO_ASPECT_OPTIONS), params);
        this._marshallers = new MarshallersRegistry();
        this.addMarshaller(...DEFAULT_MARSHALLERS, ...((_a = this._options.marshallers) !== null && _a !== void 0 ? _a : []));
        this.addDriver(...((_b = params === null || params === void 0 ? void 0 : params.drivers) !== null && _b !== void 0 ? _b : []));
    }
    getDrivers() {
        return this._drivers;
    }
    addDriver(...drivers) {
        (drivers !== null && drivers !== void 0 ? drivers : []).forEach((d) => {
            var _a, _b;
            const existingDriver = this._drivers[d.NAME];
            if (existingDriver === d) {
                return;
            }
            if (existingDriver) {
                throw new Error(`both ${(_a = d.constructor) === null || _a === void 0 ? void 0 : _a.name} & ${(_b = existingDriver.constructor) === null || _b === void 0 ? void 0 : _b.name} configured for name ${d.NAME}`);
            }
            this._drivers[d.NAME] = d;
            if (this._enabled) {
                this._initGc(d);
            }
        });
        return this;
    }
    onEnable() {
        this._enabled = true;
        Object.values(this._drivers).forEach((d) => this._initGc(d));
    }
    addMarshaller(...marshallers) {
        this._marshallers.addMarshaller(...marshallers);
    }
    removeMarshaller(...marshallers) {
        this._marshallers.removeMarshaller(...marshallers);
    }
    /**
     * Apply the memo pattern. That is, get the result from cache if any, or call the original method and store the result otherwise.
     */
    applyMemo(ctxt, jp) {
        var _a, _b, _c, _d;
        const memoParams = ctxt.annotations.onSelf(Memo)[0].args[0];
        ctxt.data.namespace = (_a = provider(memoParams === null || memoParams === void 0 ? void 0 : memoParams.namespace)()) !== null && _a !== void 0 ? _a : provider((_b = this._options) === null || _b === void 0 ? void 0 : _b.namespace)();
        ctxt.data.instanceId = `${(_c = provider(memoParams === null || memoParams === void 0 ? void 0 : memoParams.id)(ctxt)) !== null && _c !== void 0 ? _c : provider((_d = this._options) === null || _d === void 0 ? void 0 : _d.id)(ctxt)}`;
        const key = this._options.createMemoKey(ctxt);
        if (!key) {
            throw new Error(`${this._options.createMemoKey.name} function did not return a valid MemoKey`);
        }
        const options = ctxt.annotations.onSelf(Memo)[0].args[0];
        const expiration = this.getExpiration(ctxt, options);
        const drivers = _selectCandidateDrivers(this._drivers, ctxt);
        const proceedJoinpoint = () => {
            var _a, _b, _c;
            // value not cached. Call the original method
            const value = jp();
            this._pendingResults.set(key.toString(), value);
            // marshall the value into a frame
            const marshallingContext = this._marshallers.marshal(value);
            const driver = drivers
                .filter((d) => d.accepts(marshallingContext))
                .map((d) => [d, d.getPriority(marshallingContext)])
                .sort((dp1, dp2) => dp2[1] - dp1[1])
                .map((dp) => dp[0])[0];
            if (!driver) {
                throw new AspectError(ctxt, `Driver ${drivers[0].NAME} does not accept value of type ${(_c = (_b = (_a = getProto(value)) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : typeof value} returned by ${ctxt.target.label}`);
            }
            if (expiration) {
                this._scheduleCleaner(driver, key, expiration);
            }
            marshallingContext.then((frame) => {
                // promise resolution may not arrive in time in case the same method is called right after.
                // store the result in a temporary variable in order to be available right away
                const entry = {
                    key,
                    expiration,
                    frame,
                    signature: __createContextSignature(ctxt),
                };
                driver.write(entry).then(() => {
                    const pendingResults = this._pendingResults.get(key.toString());
                    if (pendingResults === value) {
                        this._pendingResults.delete(key.toString());
                    }
                });
            });
            return value;
        };
        const pendingResults = this._pendingResults.get(key.toString());
        if (pendingResults) {
            return copy(pendingResults);
        }
        for (const d of drivers) {
            try {
                const entry = d.read(key);
                if (entry) {
                    if (entry.expiration && entry.expiration < new Date()) {
                        // remove data if expired
                        this._removeValue(d, key);
                    }
                    else if (entry.signature && entry.signature !== __createContextSignature(ctxt)) {
                        // remove data if signature mismatch
                        console.debug(`${ctxt.target.label} hash mismatch. Removing memoized data...`);
                        this._removeValue(d, key);
                    }
                    else {
                        return this._marshallers.unmarshal(entry.frame);
                    }
                }
            }
            catch (e) {
                // mute errors in ase of version mismatch, & just remove old version
                if (e instanceof VersionConflictError || e instanceof MemoAspectError) {
                    console.error(e);
                    this._removeValue(d, key);
                }
                else {
                    throw e;
                }
            }
        }
        // found no driver for this value. Call the real method
        return proceedJoinpoint();
    }
    _removeValue(driver, key) {
        driver.remove(key);
        // get gc timeout handle
        const t = this._entriesGc.get(key.toString());
        this._pendingResults.delete(key.toString());
        if (t !== undefined) {
            // this entry is not eligible for gc
            this._entriesGc.delete(key.toString());
            // remove gc timeout
            clearTimeout(t);
        }
    }
    _scheduleCleaner(driver, key, expiration) {
        const ttl = expiration.getTime() - new Date().getTime();
        if (ttl <= 0) {
            this._removeValue(driver, key);
        }
        else {
            this._entriesGc.set(key.toString(), setTimeout(() => this._removeValue(driver, key), ttl));
        }
    }
    _initGc(driver) {
        driver.getKeys().then((keys) => {
            keys.forEach((k) => {
                Promise.resolve(driver.read(k)).then((memo) => {
                    if (memo === null || memo === void 0 ? void 0 : memo.expiration) {
                        this._scheduleCleaner(driver, k, memo.expiration);
                    }
                });
            });
        });
    }
    getExpiration(ctxt, options) {
        const exp = provider(options === null || options === void 0 ? void 0 : options.expiration)();
        if (exp) {
            if (exp instanceof Date) {
                return exp;
            }
            else if (typeof exp === 'number' && exp > 0) {
                return new Date(new Date().getTime() + exp * 1000);
            }
            else if (exp === 0) {
                return;
            }
            throw new AspectError(ctxt, `expiration should be either a Date or a positive number. Got: ${exp}`);
        }
    }
};
__decorate([
    Around(on.method.withAnnotations(Memo)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Object)
], MemoAspect.prototype, "applyMemo", null);
MemoAspect = __decorate([
    Aspect('@aspectjs/memo'),
    __metadata("design:paramtypes", [Object])
], MemoAspect);
function _selectCandidateDrivers(drivers, ctxt) {
    var _a, _b;
    const annotationOptions = ((_a = ctxt.annotations.onSelf(Memo)[0].args[0]) !== null && _a !== void 0 ? _a : {});
    if (!annotationOptions.driver) {
        // return all drivers
        return Object.values(drivers);
    }
    else {
        if (isString(annotationOptions.driver)) {
            const candidates = Object.values(drivers).filter((d) => d.NAME === annotationOptions.driver);
            if (!candidates.length) {
                throw new AspectError(ctxt, `No candidate driver available for driver name "${annotationOptions.driver}"`);
            }
            return candidates;
        }
        else if (isFunction(annotationOptions.driver)) {
            const candidates = Object.values(drivers).filter((d) => d.constructor === annotationOptions.driver);
            if (!candidates.length) {
                throw new AspectError(ctxt, `No candidate driver available for driver "${(_b = annotationOptions.driver) === null || _b === void 0 ? void 0 : _b.name}"`);
            }
            return candidates;
        }
        else {
            throw new AspectError(ctxt, `driver option should be a string or a Driver constructor. Got: ${annotationOptions.driver}`);
        }
    }
}
function __createContextSignature(ctxt) {
    const s = [];
    let proto = ctxt.target.proto;
    let property = proto[ctxt.target.propertyKey];
    while (proto !== Object.prototype && property) {
        s.push(ctxt.target.proto[ctxt.target.propertyKey].toString());
        proto = Reflect.getPrototypeOf(proto);
        property = proto[ctxt.target.propertyKey];
    }
    return hash(s.join());
}

/**
 * Weaver profile configured with
 * - LsMemoAspect (for synchronous @Memo methods)
 *     - LzMemoHandler to compress data stored in LocalStorage
 * - IndexedDbMemoAspect (for asynchronous @Memo methods)
 * @public
 */
class MemoProfile extends WeaverProfile {
    constructor(memoProfileFeatures) {
        var _a, _b, _c, _d;
        super();
        this._features = {
            useLocalStorage: true,
            useIndexedDb: true,
            useLzString: true,
            options: {},
        };
        this.enable(new DefaultCacheableAspect());
        this._features.options = (_a = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.options) !== null && _a !== void 0 ? _a : this._features.options;
        this._features.useIndexedDb = (_b = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useIndexedDb) !== null && _b !== void 0 ? _b : this._features.useIndexedDb;
        this._features.useLzString = (_c = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useLzString) !== null && _c !== void 0 ? _c : this._features.useLzString;
        this._features.useLocalStorage = (_d = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useLocalStorage) !== null && _d !== void 0 ? _d : this._features.useLocalStorage;
        const marshallers = [...DEFAULT_MARSHALLERS];
        const drivers = [];
        if (this._features.useIndexedDb) {
            drivers.push(new IdbMemoDriver());
        }
        if (this._features.useLocalStorage) {
            let serializer;
            if (this._features.useLzString) {
                serializer = new LzMemoSerializer();
            }
            drivers.push(new LsMemoDriver({
                serializer,
            }));
        }
        const memoAspect = new MemoAspect(Object.assign(Object.assign({}, this._features.options), { marshallers,
            drivers }));
        this.enable(memoAspect);
    }
    configure(features) {
        return new MemoProfile(Object.assign(Object.assign({}, this._features), features));
    }
}

/**
 * @public
 */
class DefaultMemoProfile extends MemoProfile {
    register() {
        WEAVER_CONTEXT.getWeaver().enable(this);
    }
    configure(features) {
        return new DefaultMemoProfile(Object.assign(Object.assign({}, this._features), features));
    }
}
/**
 * @public
 */
const MEMO_PROFILE = new DefaultMemoProfile();

export { ArrayMarshaller, BasicMarshaller, _Cacheable as Cacheable, CacheableMarshaller, DEFAULT_LS_DRIVER_OPTIONS, DEFAULT_MARSHALLERS, DateMarshaller, DefaultCacheableAspect, IdbMemoDriver, LsMemoDriver, LzMemoSerializer, MEMO_PROFILE, Memo, MemoAspect, MemoDriver, MemoFrame, MemoKey, MemoMarshaller, MemoProfile, NoopMarshaller, ObjectMarshaller, PromiseMarshaller, SimpleLsSerializer, _CacheTypeStoreImpl };
//# sourceMappingURL=memo.js.map
