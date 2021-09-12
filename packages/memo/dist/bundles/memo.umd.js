(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@aspectjs/core'), require('@aspectjs/core/commons'), require('@aspectjs/core/annotations'), require('@aspectjs/core/utils')) :
  typeof define === 'function' && define.amd ? define(['exports', '@aspectjs/core', '@aspectjs/core/commons', '@aspectjs/core/annotations', '@aspectjs/core/utils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.aspectjs = global.aspectjs || {}, global.aspectjs.memo = {}), global.aspectjs.core, global.aspectjs.core_commons, global.aspectjs.core_annotations, global.aspectjs.core_utils));
}(this, (function (exports, core, commons, annotations, utils) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function __rest(s, e) {
    var t = {};

    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }

    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  }
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __metadata(metadataKey, metadataValue) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }

  function Cacheable(typeId) {
    return;
  }
  /**
   * Indicates that the result of annotated method could be cached.
   * @public
   */


  var _Cacheable = commons.ASPECTJS_ANNOTATION_FACTORY.create(Cacheable);

  /**
   * Assign a key to the prototype of a class into a CacheTypeStore,
   * so that Memo drivers can inflate memoized objects with proper types.
   *
   * @public
   */

  exports.DefaultCacheableAspect = /*#__PURE__*/function () {
    function DefaultCacheableAspect() {
      var cacheTypeStore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _CacheTypeStoreImpl();

      _classCallCheck(this, DefaultCacheableAspect);

      this.cacheTypeStore = cacheTypeStore;
    }

    _createClass(DefaultCacheableAspect, [{
      key: "registerCacheKey",
      value: function registerCacheKey(ctxt) {
        var _a;

        var options = ctxt.annotations.onSelf(_Cacheable)[0].args[0];

        if (!utils.isObject(options)) {
          options = {
            typeId: options
          };
        }

        var typeId = (_a = options.typeId) !== null && _a !== void 0 ? _a : _generateTypeId(ctxt.target.proto);
        this.cacheTypeStore.addPrototype(ctxt.target.proto, typeId, options.version);
      }
    }]);

    return DefaultCacheableAspect;
  }();

  __decorate([annotations.Compile(commons.on.class.withAnnotations(_Cacheable)), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], exports.DefaultCacheableAspect.prototype, "registerCacheKey", null);

  exports.DefaultCacheableAspect = __decorate([annotations.Aspect('@aspectjs/cacheable'), __metadata("design:paramtypes", [Object])], exports.DefaultCacheableAspect);
  /**
   * Store class prototypes along with a defined key.
   * @internal
   */

  var _CacheTypeStoreImpl = /*#__PURE__*/function () {
    function _CacheTypeStoreImpl() {
      _classCallCheck(this, _CacheTypeStoreImpl);

      this._prototypes = new Map();
    }

    _createClass(_CacheTypeStoreImpl, [{
      key: "getPrototype",
      value: function getPrototype(key) {
        utils.assert(!!key, 'key must be defined');

        var entry = this._prototypes.get(key);

        if (!entry) {
          throw new Error("no prototype found for key ".concat(key));
        }

        return entry.proto;
      }
    }, {
      key: "getTypeKey",
      value: function getTypeKey(prototype) {
        return Reflect.getOwnMetadata('@aspectjs/cacheable:typekey', prototype);
      }
    }, {
      key: "addPrototype",
      value: function addPrototype(proto, typeId, version) {
        var _a, _b;

        var existingProto = this._prototypes.get(typeId);

        if (existingProto && existingProto !== proto) {
          throw new Error("Cannot call @Cacheable({typeId = ".concat(typeId, "}) on ").concat((_a = proto === null || proto === void 0 ? void 0 : proto.constructor) === null || _a === void 0 ? void 0 : _a.name, ": typeId is already assigned to ").concat((_b = existingProto === null || existingProto === void 0 ? void 0 : existingProto.constructor) === null || _b === void 0 ? void 0 : _b.name));
        }

        this._prototypes.set(typeId, {
          proto: proto,
          version: version
        });
      }
    }, {
      key: "getVersion",
      value: function getVersion(key) {
        var _a, _b;

        return (_b = (_a = this._prototypes.get(key)) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : undefined;
      }
    }]);

    return _CacheTypeStoreImpl;
  }();
  var globalId = 0;

  function _generateTypeId(proto) {
    return utils.getOrComputeMetadata('@aspectjs/cacheable:typekey', proto, function () {
      return "".concat(proto.constructor.name, "#").concat(globalId++);
    });
  }

  /**
   * Connects the MemoAspect to a storage back-end
   * @public
   */
  var MemoDriver = /*#__PURE__*/function () {
    function MemoDriver() {
      _classCallCheck(this, MemoDriver);
    }

    _createClass(MemoDriver, [{
      key: "getPriority",
      value:
      /**
       * Get the priority this driver should be picked up to handle the given type.
       */
      function getPriority(context) {
        return 0;
      }
    }, {
      key: "accepts",
      value: function accepts(context) {
        return true;
      }
    }]);

    return MemoDriver;
  }();

  var MemoAspectError = /*#__PURE__*/function (_Error) {
    _inherits(MemoAspectError, _Error);

    var _super = _createSuper(MemoAspectError);

    function MemoAspectError(message) {
      var _this;

      _classCallCheck(this, MemoAspectError);

      _this = _super.call(this, message);
      _this.message = message;
      return _this;
    }

    return MemoAspectError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));
  var VersionConflictError = /*#__PURE__*/function (_MemoAspectError) {
    _inherits(VersionConflictError, _MemoAspectError);

    var _super2 = _createSuper(VersionConflictError);

    function VersionConflictError(message, context) {
      var _this2;

      _classCallCheck(this, VersionConflictError);

      _this2 = _super2.call(this, message);
      _this2.message = message;
      _this2.context = context;
      return _this2;
    }

    return VersionConflictError;
  }(MemoAspectError);

  var KEY_IDENTIFIER = '@aspectjs:Memo';
  /**
   * @public
   */

  var MemoKey = /*#__PURE__*/function () {
    function MemoKey(key, namespace) {
      _classCallCheck(this, MemoKey);

      this.namespace = namespace !== null && namespace !== void 0 ? namespace : key.namespace;
      this.targetKey = key.targetKey;
      this.instanceId = key.instanceId;
      this.argsKey = key.argsKey;
      this._strValue = "".concat(KEY_IDENTIFIER, ":ns=").concat(this.namespace, "&tk=").concat(this.targetKey, "&id=").concat(this.instanceId, "&ak=").concat(this.argsKey);
    }

    _createClass(MemoKey, [{
      key: "toString",
      value: function toString() {
        return this._strValue;
      }
    }], [{
      key: "parse",
      value: function parse(str) {
        var throwIfInvalid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (!str.startsWith(KEY_IDENTIFIER)) {
          throw new TypeError("Key ".concat(str, " is not a memo key"));
        }

        var rx = new RegExp("".concat(KEY_IDENTIFIER, ":ns=(?<namespace>.*?)&tk=(?<targetKey>.*?)&id=(?<instanceId>.*?)&ak=(?<argsKey>.*)"));
        var r = rx.exec(str);

        if (!r) {
          if (throwIfInvalid) {
            throw new MemoAspectError("given expression is not a MemoKey: ".concat(str));
          }

          return null;
        }

        return new MemoKey(r.groups);
      }
    }]);

    return MemoKey;
  }();

  /**
   * A MemoEntry once marshalled
   * @public
   */

  var MemoFrame = /*#__PURE__*/function () {
    function MemoFrame(frame) {
      _classCallCheck(this, MemoFrame);

      Object.assign(this, frame);
    }

    _createClass(MemoFrame, [{
      key: "setValue",
      value: function setValue(value) {
        this._resolved = true;
        this.async = null;
        var frame = this;
        frame.value = value;
        return frame;
      }
    }, {
      key: "setAsyncValue",
      value: function setAsyncValue(value) {
        var _this = this;

        var frame = this;
        this._resolved = false;
        this.async = value.then(function (v) {
          frame.value = v;
          _this._resolved = true;
          return frame.value;
        });
        return frame;
      }
    }, {
      key: "isAsync",
      value: function isAsync() {
        return utils.isPromise(this.async);
      }
    }]);

    return MemoFrame;
  }();

  /**
   * In case a @Memo method returns a promise, the corresponding MemoValue
   * can be persisted only once the promise gets resolved. As a result, all subsequent operations should be deferred.
   * This stores all the pending operations for a given key in call order,
   * to ensure an operation does not occurs before the previous operations.
   */
  var globalOperationId = 0;
  var Scheduler = /*#__PURE__*/function () {
    function Scheduler() {
      _classCallCheck(this, Scheduler);

      this._pendingOps = {};
      this._lastOperationId = {};
    }
    /** Add the given promise to the promise queue for this key **/


    _createClass(Scheduler, [{
      key: "add",
      value: function add(key, op) {
        var _this = this;

        var k = key.toString();

        if (this._pendingOps[k]) {
          var opId = globalOperationId++;
          this._lastOperationId[k] = opId;
          this._pendingOps[k] = this._pendingOps[k].then(function () {
            return op();
          }).then(function (r) {
            if (_this._lastOperationId[k] === opId) {
              delete _this._pendingOps[k];
              delete _this._lastOperationId[k];
            }

            return r;
          });
        } else {
          this._pendingOps[k] = op();
        }

        return this._pendingOps[k];
      }
    }]);

    return Scheduler;
  }();

  var TransactionMode;

  (function (TransactionMode) {
    TransactionMode["READONLY"] = "readonly";
    TransactionMode["READ_WRITE"] = "readwrite";
  })(TransactionMode || (TransactionMode = {}));
  /**
   * Memo driver to store async @Memo result into the Indexed Database.
   * @public
   */


  var IdbMemoDriver = /*#__PURE__*/function (_MemoDriver) {
    _inherits(IdbMemoDriver, _MemoDriver);

    var _super = _createSuper(IdbMemoDriver);

    function IdbMemoDriver() {
      var _this;

      var _params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, IdbMemoDriver);

      _this = _super.call(this);
      _this._params = _params;
      _this.NAME = IdbMemoDriver.NAME;
      _this._scheduler = new Scheduler();
      _this._init$ = _this._openDb();
      return _this;
    }

    _createClass(IdbMemoDriver, [{
      key: "_idb",
      get: function get() {
        var _a;

        return (_a = this._params.indexedDB) !== null && _a !== void 0 ? _a : indexedDB;
      }
    }, {
      key: "_ls",
      get: function get() {
        this._localStorageDriver = this._findLsDriver();
        return this._localStorageDriver;
      }
    }, {
      key: "getKeys",
      value: function getKeys(namespace) {
        return this._runTransactional(function (store) {
          return store.getAllKeys();
        }, TransactionMode.READONLY).then(function (result) {
          return result.map(function (id) {
            return id.toString();
          }).map(function (str) {
            return MemoKey.parse(str, false);
          }).filter(function (k) {
            return !!k;
          });
        });
      }
    }, {
      key: "_openDb",
      value: function _openDb() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var dbRequest = _this2._idb.open(IdbMemoDriver.DATABASE_NAME, IdbMemoDriver.DATABASE_VERSION);

          dbRequest.addEventListener('upgradeneeded', function () {
            var db = dbRequest.result;
            var store = db.createObjectStore(IdbMemoDriver.STORE_NAME, {
              keyPath: 'ref',
              autoIncrement: false
            });
            store.createIndex('by_key', 'key', {
              unique: true
            });
          });
          dbRequest.addEventListener('success', function () {
            return resolve(dbRequest.result);
          });
          dbRequest.addEventListener('error', function (err) {
            return reject(err);
          });
        });
      }
    }, {
      key: "getPriority",
      value: function getPriority(context) {
        return 100;
      }
    }, {
      key: "accepts",
      value: function accepts(context) {
        return context.frame.isAsync();
      }
    }, {
      key: "read",
      value: function read(key) {
        var _this3 = this;

        var _a;

        var metaKey = createMetaKey(key);

        var metaEntry = this._ls.read(metaKey);

        if (!metaEntry) {
          return null;
        }

        utils.assert(!!((_a = metaEntry.frame) === null || _a === void 0 ? void 0 : _a.type));
        utils.assert(!!metaEntry.key);

        var asyncValue = this._runTransactional(function (tx) {
          return tx.get(key.toString());
        }).then(function (frame) {
          if (!frame) {
            _this3._ls.remove(metaKey);

            throw new MemoAspectError("No data found for key ".concat(key));
          }

          return frame.value;
        });

        var frame = new MemoFrame(Object.assign(Object.assign({}, metaEntry), metaEntry.frame)).setAsyncValue(asyncValue);

        this._scheduler.add(key.toString(), function () {
          return frame.async;
        });

        return frame ? Object.assign(Object.assign({}, metaEntry), {
          key: key,
          frame: frame
        }) : undefined;
      }
    }, {
      key: "remove",
      value: function remove(key) {
        var _this4 = this;

        return this._scheduler.add(key.toString(), function () {
          return _this4._deleteIdbEntry(key).then(function () {
            return _this4._deleteLsEntry(key);
          });
        }).then(function () {});
      }
    }, {
      key: "write",
      value: function write(entry) {
        var _this5 = this;

        return this._scheduler.add(entry.key.toString(), function () {
          var _a = entry.frame,
              value = _a.value,
              metaFrame = __rest(_a, ["value"]);

          var metaEntry = Object.assign(Object.assign({}, entry), {
            key: createMetaKey(entry.key),
            frame: metaFrame
          }); // store only the Memo without its value

          _this5._ls.write(metaEntry);

          var valueFrame = {
            ref: entry.key.toString(),
            value: value
          };
          return _this5._runTransactional(function (s) {
            return s.put(valueFrame);
          });
        });
      }
    }, {
      key: "_deleteIdbEntry",
      value: function _deleteIdbEntry(key) {
        return this._runTransactional(function (s) {
          return s.delete(key.toString());
        });
      }
    }, {
      key: "_deleteLsEntry",
      value: function _deleteLsEntry(key) {
        this._ls.remove(key);
      }
    }, {
      key: "_runTransactional",
      value: function _runTransactional(transactionFn) {
        var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TransactionMode.READ_WRITE;
        return this._init$.then(function (database) {
          return new Promise(function (resolve, reject) {
            var store = database.transaction(IdbMemoDriver.STORE_NAME, mode).objectStore(IdbMemoDriver.STORE_NAME);
            var request = transactionFn(store);
            request.addEventListener('success', function () {
              return resolve(request.result);
            });
            request.addEventListener('error', function (r) {
              var _a, _b;

              var error = (_b = (_a = r.target) === null || _a === void 0 ? void 0 : _a.error) !== null && _b !== void 0 ? _b : r;
              console.error(error);
              return reject(error);
            });
          });
        });
      }
    }, {
      key: "_findLsDriver",
      value: function _findLsDriver() {
        if (this._localStorageDriver) {
          return this._localStorageDriver;
        }

        if (this._params.localStorageDriver) {
          return this._params.localStorageDriver;
        }

        var drivers = core.WEAVER_CONTEXT.getWeaver().getAspect('@aspectjs/memo').getDrivers();

        if (!drivers['localStorage']) {
          throw new MemoAspectError("".concat(IdbMemoDriver.prototype.constructor.name, " requires a \"localStorage\" driver, but option \"localStorageDriver\" is not set and no driver could be found with name \"localStorage\""));
        }

        return drivers['localStorage'];
      }
    }]);

    return IdbMemoDriver;
  }(MemoDriver);
  IdbMemoDriver.NAME = 'indexedDb';
  IdbMemoDriver.DATABASE_NAME = 'IndexedDbMemoAspect_db';
  IdbMemoDriver.STORE_NAME = 'results';
  IdbMemoDriver.DATABASE_VERSION = 1; // change this value whenever a backward-incompatible change is made to the store

  function createMetaKey(key) {
    return new MemoKey(key, "".concat(key.namespace, "[idb_meta]"));
  }

  /**
   *
   * @param str - the value to hash
   * @public
   */
  function hash(str) {
    return str.split('').map(function (v) {
      return v.charCodeAt(0);
    }).reduce(function (a, v) {
      return a + ((a << 7) + (a << 3)) ^ v;
    }).toString(16);
  }

  var InstantPromise = /*#__PURE__*/function () {
    function InstantPromise() {
      _classCallCheck(this, InstantPromise);

      this._onfulfilled = [];
      this._onrejected = [];
    }

    _createClass(InstantPromise, [{
      key: "then",
      value: function then(onfulfilled, onrejected) {
        if (this._resolved) {
          var res = onfulfilled(this._value);

          if (utils.isPromise(res)) {
            return res;
          } else {
            return new InstantPromise().resolve(res);
          }
        } else {
          var delegate = new InstantPromise();

          this._onfulfilled.push(function (r) {
            return delegate.resolve(onfulfilled ? onfulfilled(r) : undefined);
          });

          this._onrejected.push(function (r) {
            return delegate.resolve(onrejected ? onrejected(r) : undefined);
          });

          return delegate;
        }
      }
    }, {
      key: "resolve",
      value: function resolve(value) {
        if (this._resolved) {
          throw new Error('promise already resolved');
        }

        this._resolved = true;
        this._value = value;

        if (this._onfulfilled) {
          this._onfulfilled.forEach(function (f) {
            return f(value);
          });
        }

        return this;
      }
    }, {
      key: "reject",
      value: function reject(rejectValue) {
        if (this._resolved) {
          throw new Error('promise already resolved');
        }

        this._resolved = true;
        this._rejectValue = rejectValue;

        if (this._onrejected) {
          this._onrejected.forEach(function (f) {
            return f(rejectValue);
          });
        }

        return this;
      }
    }], [{
      key: "resolve",
      value: function resolve(value) {
        return new InstantPromise().resolve(value);
      }
    }, {
      key: "all",
      value: function all() {
        var results = [];
        var promise = new InstantPromise().resolve(results);

        for (var _len = arguments.length, promises = new Array(_len), _key = 0; _key < _len; _key++) {
          promises[_key] = arguments[_key];
        }

        promises.forEach(function (p, i) {
          promise = promise.then(function () {
            return p;
          }).then(function (v) {
            return results[i] = v;
          });
        });
        return promise;
      }
    }]);

    return InstantPromise;
  }();

  function provider(arg) {
    return utils.isFunction(arg) ? arg : function () {
      return arg;
    };
  }

  /*! (c) 2020 Andrea Giammarchi */
  var $parse = JSON.parse,
      $stringify = JSON.stringify;
  var keys = Object.keys;
  var Primitive = String; // it could be Number

  var primitive = 'string'; // it could be 'number'

  var ignore = {};
  var object = 'object';

  var noop = function noop(_, value) {
    return value;
  };

  var primitives = function primitives(value) {
    return value instanceof Primitive ? Primitive(value) : value;
  };

  var Primitives = function Primitives(_, value) {
    return _typeof(value) === primitive ? new Primitive(value) : value;
  };

  var revive = function revive(input, parsed, output, $) {
    var lazy = [];

    for (var ke = keys(output), length = ke.length, y = 0; y < length; y++) {
      var k = ke[y];
      var value = output[k];

      if (value instanceof Primitive) {
        var tmp = input[value];

        if (_typeof(tmp) === object && !parsed.has(tmp)) {
          parsed.add(tmp);
          output[k] = ignore;
          lazy.push({
            k: k,
            a: [input, parsed, tmp, $]
          });
        } else output[k] = $.call(output, k, tmp);
      } else if (output[k] !== ignore) output[k] = $.call(output, k, value);
    }

    for (var _length = lazy.length, i = 0; i < _length; i++) {
      var _lazy$i = lazy[i],
          _k = _lazy$i.k,
          a = _lazy$i.a;
      output[_k] = $.call(output, _k, revive.apply(null, a));
    }

    return output;
  };

  var set = function set(known, input, value) {
    var index = Primitive(input.push(value) - 1);
    known.set(value, index);
    return index;
  };

  var parse = function parse(text, reviver) {
    var input = $parse(text, Primitives).map(primitives);
    var value = input[0];
    var $ = reviver || noop;
    var tmp = _typeof(value) === object && value ? revive(input, new Set(), value, $) : value;
    return $.call({
      '': tmp
    }, '', tmp);
  };
  var stringify = function stringify(value, replacer, space) {
    var $ = replacer && _typeof(replacer) === object ? function (k, v) {
      return k === '' || -1 < replacer.indexOf(k) ? v : void 0;
    } : replacer || noop;
    var known = new Map();
    var input = [];
    var output = [];
    var i = +set(known, input, $.call({
      '': value
    }, '', value));
    var firstRun = !i;

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

      var after = $.call(this, key, value);

      switch (_typeof(after)) {
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

  var F = RawMemoField;
  var SimpleLsSerializer = /*#__PURE__*/function () {
    function SimpleLsSerializer() {
      _classCallCheck(this, SimpleLsSerializer);
    }

    _createClass(SimpleLsSerializer, [{
      key: "deserialize",
      value: function deserialize(serialized) {
        if (!serialized) {
          return null;
        }

        var raw = parse(serialized);
        return {
          expiration: raw[F.EXPIRATION] ? new Date(raw[F.EXPIRATION]) : undefined,
          frame: new MemoFrame({
            value: raw[F.VALUE],
            type: raw[F.TYPE],
            instanceType: raw[F.INSTANCE_TYPE],
            version: raw[F.VERSION],
            hash: raw[F.HASH]
          }),
          signature: raw[F.SIGNATURE]
        };
      }
    }, {
      key: "serialize",
      value: function serialize(entry) {
        var raw = {};

        if (!utils.isUndefined(entry.frame.value)) {
          raw[F.VALUE] = entry.frame.value;
        }

        if (!utils.isUndefined(entry.frame.type)) {
          raw[F.TYPE] = entry.frame.type;
        }

        if (!utils.isUndefined(entry.frame.instanceType)) {
          raw[F.INSTANCE_TYPE] = entry.frame.instanceType;
        }

        if (!utils.isUndefined(entry.frame.version)) {
          raw[F.VERSION] = entry.frame.version;
        }

        if (!utils.isUndefined(entry.frame.hash)) {
          raw[F.HASH] = entry.frame.hash;
        }

        if (!utils.isUndefined(entry.expiration)) {
          raw[F.EXPIRATION] = entry.expiration;
        }

        if (!utils.isUndefined(entry.signature)) {
          raw[F.SIGNATURE] = entry.signature;
        }

        return stringify(raw);
      }
    }]);

    return SimpleLsSerializer;
  }();

  /**
   * @public
   */

  var DEFAULT_LS_DRIVER_OPTIONS = {
    serializer: new SimpleLsSerializer()
  };
  /**
   * Memo driver to store async @Memo result into the Indexed Database.
   * @public
   */

  var LsMemoDriver = /*#__PURE__*/function (_MemoDriver) {
    _inherits(LsMemoDriver, _MemoDriver);

    var _super = _createSuper(LsMemoDriver);

    function LsMemoDriver(options) {
      var _this;

      _classCallCheck(this, LsMemoDriver);

      _this = _super.call(this);
      _this.options = options;
      _this.NAME = LsMemoDriver.NAME;
      _this.options = Object.assign(Object.assign({}, DEFAULT_LS_DRIVER_OPTIONS), options);

      if (!_this._ls) {
        throw new Error('localStorage not available on this platform, and no implementation was provided');
      }

      return _this;
    }

    _createClass(LsMemoDriver, [{
      key: "_ls",
      get: function get() {
        var _a;

        return (_a = this.options.localStorage) !== null && _a !== void 0 ? _a : localStorage;
      }
    }, {
      key: "getKeys",
      value: function getKeys(namespace) {
        var res = [];

        for (var i = 0; i < this._ls.length; ++i) {
          var kStr = this._ls.key(i);

          var key = MemoKey.parse(kStr, false);

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

    }, {
      key: "getPriority",
      value: function getPriority(context) {
        return 10;
      }
    }, {
      key: "read",
      value: function read(key) {
        var _a, _b;

        var serializer = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.serializer) !== null && _b !== void 0 ? _b : DEFAULT_LS_DRIVER_OPTIONS.serializer;
        var frame = serializer.deserialize(this._ls.getItem(key.toString()));
        return frame ? Object.assign({
          key: key
        }, frame) : undefined;
      }
    }, {
      key: "write",
      value: function write(entry) {
        var _a, _b;

        var serializer = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.serializer) !== null && _b !== void 0 ? _b : DEFAULT_LS_DRIVER_OPTIONS.serializer;

        this._ls.setItem(entry.key.toString(), serializer.serialize(entry));

        return InstantPromise.resolve();
      }
    }, {
      key: "remove",
      value: function remove(key) {
        this._ls.removeItem(key.toString());

        return InstantPromise.resolve();
      }
    }]);

    return LsMemoDriver;
  }(MemoDriver);
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
  var f = String.fromCharCode;
  function compressToUTF16(input) {
    if (input == null) return '';
    return _compress(input, 15, function (a) {
      return f(a + 32);
    }) + ' ';
  }
  function decompressFromUTF16(compressed) {
    if (compressed == null) return '';
    if (compressed == '') return null;
    return _decompress(compressed.length, 16384, function (index) {
      return compressed.charCodeAt(index) - 32;
    });
  }

  function _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    var context_dictionary = {};
    var context_dictionaryToCreate = {};
    var context_data = [];
    var i,
        value,
        context_c = '',
        context_wc = '',
        context_w = '',
        context_enlargeIn = 2,
        // Compensate for the first entry which should not count
    context_dictSize = 3,
        context_numBits = 2,
        context_data_val = 0,
        context_data_position = 0;

    for (var ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);

      if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;

      if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1;

              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }

            value = context_w.charCodeAt(0);

            for (i = 0; i < 8; i++) {
              context_data_val = context_data_val << 1 | value & 1;

              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }

              value = value >> 1;
            }
          } else {
            value = 1;

            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value;

              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }

              value = 0;
            }

            value = context_w.charCodeAt(0);

            for (i = 0; i < 16; i++) {
              context_data_val = context_data_val << 1 | value & 1;

              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
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
        } else {
          value = context_dictionary[context_w];

          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value & 1;

            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = value >> 1;
          }
        }

        context_enlargeIn--;

        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        } // Add wc to the dictionary.


        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    } // Output the code for w.


    if (context_w !== '') {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1;

            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }

          value = context_w.charCodeAt(0);

          for (i = 0; i < 8; i++) {
            context_data_val = context_data_val << 1 | value & 1;

            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = value >> 1;
          }
        } else {
          value = 1;

          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value;

            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }

            value = 0;
          }

          value = context_w.charCodeAt(0);

          for (i = 0; i < 16; i++) {
            context_data_val = context_data_val << 1 | value & 1;

            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
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
      } else {
        value = context_dictionary[context_w];

        for (i = 0; i < context_numBits; i++) {
          context_data_val = context_data_val << 1 | value & 1;

          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
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
    } // Mark the end of the stream


    value = 2;

    for (i = 0; i < context_numBits; i++) {
      context_data_val = context_data_val << 1 | value & 1;

      if (context_data_position == bitsPerChar - 1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }

      value = value >> 1;
    } // Flush the last char


    while (true) {
      context_data_val = context_data_val << 1;

      if (context_data_position == bitsPerChar - 1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      } else context_data_position++;
    }

    return context_data.join('');
  }

  function _decompress(length, resetValue, getNextValue) {
    var entry = '';
    var dictionary = [];
    var result = [];
    var data = {
      val: getNextValue(0),
      position: resetValue,
      index: 1
    };
    var w;
    var enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        i,
        bits,
        resb,
        maxpower,
        power,
        c;

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

    switch (bits) {
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

      switch (c = bits) {
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
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }

      result.push(entry); // Add w+entry[0] to the dictionary.

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

  var LzMemoSerializer = /*#__PURE__*/function (_SimpleLsSerializer) {
    _inherits(LzMemoSerializer, _SimpleLsSerializer);

    var _super = _createSuper(LzMemoSerializer);

    function LzMemoSerializer() {
      _classCallCheck(this, LzMemoSerializer);

      return _super.apply(this, arguments);
    }

    _createClass(LzMemoSerializer, [{
      key: "deserialize",
      value: function deserialize(str) {
        if (!str) {
          return null;
        }

        return _get(_getPrototypeOf(LzMemoSerializer.prototype), "deserialize", this).call(this, decompressFromUTF16(str));
      }
    }, {
      key: "serialize",
      value: function serialize(obj) {
        if (!obj) {
          return null;
        }

        return compressToUTF16(_get(_getPrototypeOf(LzMemoSerializer.prototype), "serialize", this).call(this, obj));
      }
    }]);

    return LzMemoSerializer;
  }(SimpleLsSerializer);

  var toStringFunction = Function.prototype.toString;
  var create = Object.create,
      defineProperty = Object.defineProperty,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      getOwnPropertyNames = Object.getOwnPropertyNames,
      getOwnPropertySymbols = Object.getOwnPropertySymbols,
      getPrototypeOf = Object.getPrototypeOf;
  var _a = Object.prototype,
      hasOwnProperty = _a.hasOwnProperty,
      propertyIsEnumerable = _a.propertyIsEnumerable;
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
    WEAKMAP: typeof WeakMap === 'function'
  };
  /**
   * @function createCache
   *
   * @description
   * get a new cache object to prevent circular references
   *
   * @returns the new cache object
   */

  var createCache = function createCache() {
    if (SUPPORTS.WEAKMAP) {
      return new WeakMap();
    } // tiny implementation of WeakMap


    var object = create({
      has: function has(key) {
        return !!~object._keys.indexOf(key);
      },
      set: function set(key, value) {
        object._keys.push(key);

        object._values.push(value);
      },
      get: function get(key) {
        return object._values[object._keys.indexOf(key)];
      }
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


  var getCleanClone = function getCleanClone(object, realm) {
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
      } catch (_a) {}
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


  var getObjectCloneLoose = function getObjectCloneLoose(object, realm, handleCopy, cache) {
    var clone = getCleanClone(object, realm); // set in the cache immediately to be able to reuse the object recursively

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


  var getObjectCloneStrict = function getObjectCloneStrict(object, realm, handleCopy, cache) {
    var clone = getCleanClone(object, realm); // set in the cache immediately to be able to reuse the object recursively

    cache.set(object, clone);
    var properties = SUPPORTS.SYMBOL_PROPERTIES ? getOwnPropertyNames(object).concat(getOwnPropertySymbols(object)) : getOwnPropertyNames(object);
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
            } catch (error) {
              // Tee above can fail on node in edge cases, so fall back to the loose assignment.
              clone[property] = descriptor.value;
            }
          } else {
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


  var getRegExpFlags = function getRegExpFlags(regExp) {
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
  }; // utils


  var isArray = Array.isArray;

  var GLOBAL_THIS = function () {
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
  }();
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
    var realm = options && options.realm || GLOBAL_THIS;
    var getObjectClone = isStrict ? getObjectCloneStrict : getObjectCloneLoose;
    /**
     * @function handleCopy
     *
     * @description
     * copy the object recursively based on its type
     *
     * @param object the object to copy
     * @returns the copied object
     */

    var handleCopy = function handleCopy(object, cache) {
      if (!object || _typeof(object) !== 'object') {
        return object;
      }

      if (cache.has(object)) {
        return cache.get(object);
      }

      var Constructor = object.constructor; // plain objects

      if (Constructor === realm.Object) {
        return getObjectClone(object, realm, handleCopy, cache);
      }

      var clone; // arrays

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
      } // dates


      if (object instanceof realm.Date) {
        return new Constructor(object.getTime());
      } // regexps


      if (object instanceof realm.RegExp) {
        clone = new Constructor(object.source, object.flags || getRegExpFlags(object));
        clone.lastIndex = object.lastIndex;
        return clone;
      } // maps


      if (realm.Map && object instanceof realm.Map) {
        clone = new Constructor();
        cache.set(object, clone);
        object.forEach(function (value, key) {
          clone.set(key, handleCopy(value, cache));
        });
        return clone;
      } // sets


      if (realm.Set && object instanceof realm.Set) {
        clone = new Constructor();
        cache.set(object, clone);
        object.forEach(function (value) {
          clone.add(handleCopy(value, cache));
        });
        return clone;
      } // blobs


      if (realm.Blob && object instanceof realm.Blob) {
        return object.slice(0, object.size, object.type);
      } // buffers (node-only)


      if (realm.Buffer && realm.Buffer.isBuffer(object)) {
        clone = realm.Buffer.allocUnsafe ? realm.Buffer.allocUnsafe(object.length) : new Constructor(object.length);
        cache.set(object, clone);
        object.copy(clone);
        return clone;
      } // arraybuffers / dataviews


      if (realm.ArrayBuffer) {
        // dataviews
        if (realm.ArrayBuffer.isView(object)) {
          clone = new Constructor(object.buffer.slice(0));
          cache.set(object, clone);
          return clone;
        } // arraybuffers


        if (object instanceof realm.ArrayBuffer) {
          clone = object.slice(0);
          cache.set(object, clone);
          return clone;
        }
      } // if the object cannot / should not be cloned, don't


      if ( // promise-like
      typeof object.then === 'function' || // errors
      object instanceof Error || realm.WeakMap && object instanceof realm.WeakMap || realm.WeakSet && object instanceof realm.WeakSet) {
        return object;
      } // assume anything left is a custom constructor


      return getObjectClone(object, realm, handleCopy, cache);
    };

    return handleCopy(object, createCache());
  } // Adding reference to allow usage in CommonJS libraries compiled using TSC, which
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
      realm: options ? options.realm : void 0
    });
  };

  /**
   * @public
   */
  var MemoMarshaller = function MemoMarshaller() {
    _classCallCheck(this, MemoMarshaller);
  };

  /**
   * Supports marshalling simple objects
   * @public
   */

  var ObjectMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(ObjectMarshaller, _MemoMarshaller);

    var _super = _createSuper(ObjectMarshaller);

    function ObjectMarshaller() {
      var _this;

      _classCallCheck(this, ObjectMarshaller);

      _this = _super.apply(this, arguments);
      _this.types = ['Object', 'object'];
      return _this;
    } // eslint-disable-next-line @typescript-eslint/ban-types


    _createClass(ObjectMarshaller, [{
      key: "marshal",
      value: function marshal(frame, context, defaultMarshal) {
        if (!frame.value) {
          return frame;
        }

        return frame.setValue([].concat(Object.getOwnPropertyNames(frame.value)).concat(Object.getOwnPropertySymbols(frame.value)).reduce(function (w, k) {
          var v = frame.value[k];
          w[k] = defaultMarshal(v);
          return w;
        }, {}));
      } // eslint-disable-next-line @typescript-eslint/ban-types

    }, {
      key: "unmarshal",
      value: function unmarshal(frame, context, defaultUnmarshal) {
        if (frame.value === null) {
          return null;
        }

        var value = {};
        context.blacklist.set(frame, value);
        utils.assert(!!frame.value);
        return [].concat(Object.getOwnPropertyNames(frame.value)).concat(Object.getOwnPropertySymbols(frame.value)).reduce(function (v, k) {
          v[k] = defaultUnmarshal(frame.value[k]);
          return v;
        }, value);
      }
    }]);

    return ObjectMarshaller;
  }(MemoMarshaller);

  /**
   * Supports marshalling instances of classes annotated with @Cacheable
   * @public
   */

  var CacheableMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(CacheableMarshaller, _MemoMarshaller);

    var _super = _createSuper(CacheableMarshaller);

    function CacheableMarshaller(options) {
      var _this;

      _classCallCheck(this, CacheableMarshaller);

      var _a, _b;

      _this = _super.call(this);
      _this.types = '*';
      _this._objectMarshaller = (_a = options === null || options === void 0 ? void 0 : options.objectMarshaller) !== null && _a !== void 0 ? _a : new ObjectMarshaller();
      _this._nonCacheableHandler = (_b = options === null || options === void 0 ? void 0 : options.nonCacheableHandler) !== null && _b !== void 0 ? _b : function (proto) {
        var name = proto.constructor.name;
        throw new TypeError("Type \"".concat(name, "\" is not annotated with \"").concat(_Cacheable, "\". Please add \"").concat(_Cacheable, "\" on class \"").concat(name, "\", or register a proper ").concat(MemoMarshaller.name, " for this type."));
      };
      return _this;
    }

    _createClass(CacheableMarshaller, [{
      key: "marshal",
      value: function marshal(frame, context, defaultMarshal) {
        // delete wrap.type; // Do not store useless type, as INSTANCE_TYPE is used for objects of non-built-in types.
        var proto = Reflect.getPrototypeOf(frame.value);
        var ts = typeStore();
        var instanceType = ts.getTypeKey(proto);

        if (!instanceType) {
          this._nonCacheableHandler(proto);
        }

        var newFrame = this._objectMarshaller.marshal(frame, context, defaultMarshal);

        newFrame.hash = __createHash(proto);
        newFrame.instanceType = instanceType;
        newFrame.version = provider(ts.getVersion(instanceType))();
        return newFrame;
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame, context, defaultUnmarshal) {
        frame.value = this._objectMarshaller.unmarshal(frame, context, defaultUnmarshal);
        utils.assert(!!frame.instanceType);
        var ts = typeStore();
        var proto = ts.getPrototype(frame.instanceType);
        var version = provider(ts.getVersion(frame.instanceType))();

        if (version !== frame.version) {
          if (version !== frame.version) {
            throw new VersionConflictError("Object for key ".concat(frame.instanceType, " is of version ").concat(version, ", but incompatible version ").concat(frame.version, " was already cached"), context);
          }
        }

        if (version === undefined && frame.hash !== __createHash(proto)) {
          throw new VersionConflictError("Hash changed for type ".concat(frame.instanceType, " "), context);
        }

        Reflect.setPrototypeOf(frame.value, proto);
        return frame.value;
      }
    }]);

    return CacheableMarshaller;
  }(MemoMarshaller);

  function typeStore() {
    var weaver = core.WEAVER_CONTEXT.getWeaver();

    if (!weaver) {
      throw new commons.WeavingError('no weaver configured. Please call setWeaver()');
    }

    var cacheableAspect = weaver.getAspect('@aspectjs/cacheable');

    if (!cacheableAspect) {
      throw new commons.WeavingError('MemoAspect requires an aspect to be registered for id "@aspectjs/cacheable".' + ' Did you forgot to call getWeaver().enable(new DefaultCacheableAspect()) ?');
    }

    return cacheableAspect.cacheTypeStore;
  }

  function __createHash(proto) {
    var s = [];
    var p = proto;

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

  var ArrayMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(ArrayMarshaller, _MemoMarshaller);

    var _super = _createSuper(ArrayMarshaller);

    function ArrayMarshaller() {
      var _this;

      _classCallCheck(this, ArrayMarshaller);

      _this = _super.apply(this, arguments);
      _this.types = 'Array';
      return _this;
    }

    _createClass(ArrayMarshaller, [{
      key: "marshal",
      value: function marshal(frame, context, defaultMarshal) {
        // array may contain promises
        frame.value = frame.value.map(function (i) {
          return defaultMarshal(i);
        });
        return frame;
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame, context, defaultUnmarshal) {
        // assert(wrapped[F.TYPE] === ValueType.ARRAY);
        var value = [];
        context.blacklist.set(frame, value);
        value.push.apply(value, _toConsumableArray(frame.value.map(function (w) {
          return defaultUnmarshal(w);
        })));
        return value;
      }
    }]);

    return ArrayMarshaller;
  }(MemoMarshaller);

  /**
   * Supports marshalling primitives
   * @public
   */

  var BasicMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(BasicMarshaller, _MemoMarshaller);

    var _super = _createSuper(BasicMarshaller);

    function BasicMarshaller() {
      var _this;

      _classCallCheck(this, BasicMarshaller);

      _this = _super.apply(this, arguments);
      _this.types = ['Number', 'String', 'Boolean', 'symbol', 'number', 'string', 'boolean', 'symbol', 'undefined'];
      return _this;
    }

    _createClass(BasicMarshaller, [{
      key: "marshal",
      value: function marshal(frame) {
        return frame;
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame) {
        return frame.value;
      }
    }]);

    return BasicMarshaller;
  }(MemoMarshaller);

  /**
   * Supports marshalling Dates
   * @public
   */

  var DateMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(DateMarshaller, _MemoMarshaller);

    var _super = _createSuper(DateMarshaller);

    function DateMarshaller() {
      var _this;

      _classCallCheck(this, DateMarshaller);

      _this = _super.apply(this, arguments);
      _this.types = 'Date';
      return _this;
    }

    _createClass(DateMarshaller, [{
      key: "marshal",
      value: function marshal(frame) {
        return frame.setValue(stringify(frame.value));
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame) {
        return new Date(parse(frame.value));
      }
    }]);

    return DateMarshaller;
  }(MemoMarshaller);

  /**
   * Pass-through marshaller
   * @public
   */

  var NoopMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(NoopMarshaller, _MemoMarshaller);

    var _super = _createSuper(NoopMarshaller);

    function NoopMarshaller() {
      _classCallCheck(this, NoopMarshaller);

      return _super.apply(this, arguments);
    }

    _createClass(NoopMarshaller, [{
      key: "marshal",
      value: function marshal(value) {
        return new MemoFrame({
          value: value
        });
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame) {
        return frame.value;
      }
    }]);

    return NoopMarshaller;
  }(MemoMarshaller);

  /**
   * Supports marshalling promises
   * @public
   */

  var PromiseMarshaller = /*#__PURE__*/function (_MemoMarshaller) {
    _inherits(PromiseMarshaller, _MemoMarshaller);

    var _super = _createSuper(PromiseMarshaller);

    function PromiseMarshaller() {
      var _this;

      _classCallCheck(this, PromiseMarshaller);

      _this = _super.apply(this, arguments);
      _this.types = 'Promise';
      return _this;
    }

    _createClass(PromiseMarshaller, [{
      key: "marshal",
      value: function marshal(frame, context, defaultMarshal) {
        frame.setAsyncValue(frame.value.then(function (v) {
          return defaultMarshal(v);
        }));
        return frame;
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame, context, defaultUnmarshal) {
        if (frame.isAsync()) {
          return frame.async.then(function (v) {
            return defaultUnmarshal(v);
          });
        } else {
          return Promise.resolve(defaultUnmarshal(frame.value));
        }
      }
    }]);

    return PromiseMarshaller;
  }(MemoMarshaller);

  var MarshallersRegistry = /*#__PURE__*/function () {
    function MarshallersRegistry() {
      _classCallCheck(this, MarshallersRegistry);

      this._marshallers = {};
    }

    _createClass(MarshallersRegistry, [{
      key: "addMarshaller",
      value: function addMarshaller() {
        var _this = this;

        for (var _len = arguments.length, marshallers = new Array(_len), _key = 0; _key < _len; _key++) {
          marshallers[_key] = arguments[_key];
        }

        (marshallers !== null && marshallers !== void 0 ? marshallers : []).forEach(function (marshaller) {
          [marshaller.types].flat().forEach(function (type) {
            _this._marshallers[type] = marshaller;
          });
        });
        return this;
      }
    }, {
      key: "removeMarshaller",
      value: function removeMarshaller() {
        var _this2 = this;

        for (var _len2 = arguments.length, marshallers = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          marshallers[_key2] = arguments[_key2];
        }

        (marshallers !== null && marshallers !== void 0 ? marshallers : []).forEach(function (marshaller) {
          [marshaller.types].flat().forEach(function (type) {
            delete _this2._marshallers[type];
          });
        });
        return this;
      }
    }, {
      key: "getMarshaller",
      value: function getMarshaller(typeName) {
        var _a;

        var marshaller = (_a = this._marshallers[typeName]) !== null && _a !== void 0 ? _a : this._marshallers['*'];

        if (!marshaller) {
          throw new TypeError("No marshaller to handle value of type ".concat(typeName));
        }

        return marshaller;
      }
    }, {
      key: "marshal",
      value: function marshal(value) {
        return new MarshallingContextImpl(this, value);
      }
    }, {
      key: "unmarshal",
      value: function unmarshal(frame) {
        return new UnmarshallingContextImpl(this, frame).frame.value;
      }
    }]);

    return MarshallersRegistry;
  }();

  var MarshallingContextImpl = /*#__PURE__*/function () {
    function MarshallingContextImpl(_marshallersRegistry, value) {
      _classCallCheck(this, MarshallingContextImpl);

      this._marshallersRegistry = _marshallersRegistry;
      this.value = value;
      this._blacklist = new Map();
      this._promises = [];
      this.frame = this._defaultMarshal(this.value);
    }

    _createClass(MarshallingContextImpl, [{
      key: "_defaultMarshal",
      value: function _defaultMarshal(value) {
        var _a;

        if (this._blacklist.has(value)) {
          return this._blacklist.get(value);
        }

        var type = (_a = value === null || value === void 0 ? void 0 : value.constructor.name) !== null && _a !== void 0 ? _a : _typeof(value);

        var marshaller = this._marshallersRegistry.getMarshaller(type);

        var baseFrame = new MemoFrame({
          value: value,
          type: type
        });

        if (utils.isObject(value) || utils.isArray(value)) {
          this._blacklist.set(value, baseFrame);
        }

        var frame = marshaller.marshal(baseFrame, this, this._defaultMarshal.bind(this));

        if (frame.isAsync()) {
          this._promises.push(frame.async);
        }

        return frame;
      }
    }, {
      key: "then",
      value: function then(onfulfilled, onrejected) {
        var _this3 = this;

        return InstantPromise.all.apply(InstantPromise, _toConsumableArray(this._promises)).then(function () {
          return _this3.frame;
        }).then(onfulfilled, onrejected);
      }
    }]);

    return MarshallingContextImpl;
  }();

  var UnmarshallingContextImpl = /*#__PURE__*/function () {
    function UnmarshallingContextImpl(_marshallersRegistry, frame) {
      _classCallCheck(this, UnmarshallingContextImpl);

      this._marshallersRegistry = _marshallersRegistry;
      this.frame = frame;
      this.blacklist = new Map();

      this._defaultUnmarshal(this.frame);
    }

    _createClass(UnmarshallingContextImpl, [{
      key: "_defaultUnmarshal",
      value: function _defaultUnmarshal(frame) {
        var _a;

        utils.assert(!!frame);

        if (this.blacklist.has(frame)) {
          return this.blacklist.get(frame);
        }

        if (!frame) {
          return null;
        }

        if (!(frame instanceof MemoFrame)) {
          Reflect.setPrototypeOf(frame, MemoFrame.prototype);
        }

        utils.assert(!!frame.type);
        var typeName = (_a = frame.type) !== null && _a !== void 0 ? _a : '*';

        var marshaller = this._marshallersRegistry.getMarshaller(typeName);

        frame.value = marshaller.unmarshal(frame, this, this._defaultUnmarshal.bind(this));
        return frame.value;
      }
    }]);

    return UnmarshallingContextImpl;
  }();

  /**
   * Memoize the return value of a method. The return value can be sored in LocalStorage or in IndexedDb according to configured drivers.
   * @see MEMO_PROFILE
   * @public
   */

  var Memo = commons.ASPECTJS_ANNOTATION_FACTORY.create(function Memo(options) {
    return;
  });

  /**
   * @public marshallers that gets configured with default MemoAspect
   */

  var DEFAULT_MARSHALLERS = [new ObjectMarshaller(), new ArrayMarshaller(), new DateMarshaller(), new PromiseMarshaller(), new CacheableMarshaller(), new BasicMarshaller()];
  Object.freeze(DEFAULT_MARSHALLERS);
  var MEMO_ID_REFLECT_KEY = '@aspectjs:memo/id';
  var internalId = 0;
  var DEFAULT_MEMO_ASPECT_OPTIONS = {
    id: function id(ctxt) {
      var _a, _b;

      var _ctxt$instance = ctxt.instance,
          id = _ctxt$instance.id,
          _id = _ctxt$instance._id,
          hashcode = _ctxt$instance.hashcode,
          _hashcode = _ctxt$instance._hashcode;
      var result = (_b = (_a = id !== null && id !== void 0 ? id : _id) !== null && _a !== void 0 ? _a : hashcode) !== null && _b !== void 0 ? _b : _hashcode;

      if (utils.isUndefined(result)) {
        return utils.getOrComputeMetadata(MEMO_ID_REFLECT_KEY, ctxt.instance, function () {
          return internalId++;
        });
      }

      return result;
    },
    namespace: '',
    createMemoKey: function createMemoKey(ctxt) {
      return new MemoKey({
        namespace: ctxt.data.namespace,
        instanceId: ctxt.data.instanceId,
        argsKey: hash(stringify(ctxt.args)),
        targetKey: hash("".concat(ctxt.target.ref))
      });
    },
    expiration: undefined,
    marshallers: DEFAULT_MARSHALLERS,
    drivers: []
  };
  /**
   * Enable Memoization of a method's return value.
   * @public
   */

  exports.MemoAspect = /*#__PURE__*/function () {
    function MemoAspect(params) {
      _classCallCheck(this, MemoAspect);

      var _a, _b;

      this._drivers = {};
      /** maps memo keys with its unregister function for garbage collector timeouts */

      this._entriesGc = new Map();
      this._pendingResults = new Map();
      this._options = Object.assign(Object.assign({}, DEFAULT_MEMO_ASPECT_OPTIONS), params);
      this._marshallers = new MarshallersRegistry();
      this.addMarshaller.apply(this, DEFAULT_MARSHALLERS.concat(_toConsumableArray((_a = this._options.marshallers) !== null && _a !== void 0 ? _a : [])));
      this.addDriver.apply(this, _toConsumableArray((_b = params === null || params === void 0 ? void 0 : params.drivers) !== null && _b !== void 0 ? _b : []));
    }

    _createClass(MemoAspect, [{
      key: "getDrivers",
      value: function getDrivers() {
        return this._drivers;
      }
    }, {
      key: "addDriver",
      value: function addDriver() {
        var _this = this;

        for (var _len = arguments.length, drivers = new Array(_len), _key = 0; _key < _len; _key++) {
          drivers[_key] = arguments[_key];
        }

        (drivers !== null && drivers !== void 0 ? drivers : []).forEach(function (d) {
          var _a, _b;

          var existingDriver = _this._drivers[d.NAME];

          if (existingDriver === d) {
            return;
          }

          if (existingDriver) {
            throw new Error("both ".concat((_a = d.constructor) === null || _a === void 0 ? void 0 : _a.name, " & ").concat((_b = existingDriver.constructor) === null || _b === void 0 ? void 0 : _b.name, " configured for name ").concat(d.NAME));
          }

          _this._drivers[d.NAME] = d;

          if (_this._enabled) {
            _this._initGc(d);
          }
        });
        return this;
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        var _this2 = this;

        this._enabled = true;
        Object.values(this._drivers).forEach(function (d) {
          return _this2._initGc(d);
        });
      }
    }, {
      key: "addMarshaller",
      value: function addMarshaller() {
        var _this$_marshallers;

        (_this$_marshallers = this._marshallers).addMarshaller.apply(_this$_marshallers, arguments);
      }
    }, {
      key: "removeMarshaller",
      value: function removeMarshaller() {
        var _this$_marshallers2;

        (_this$_marshallers2 = this._marshallers).removeMarshaller.apply(_this$_marshallers2, arguments);
      }
      /**
       * Apply the memo pattern. That is, get the result from cache if any, or call the original method and store the result otherwise.
       */

    }, {
      key: "applyMemo",
      value: function applyMemo(ctxt, jp) {
        var _this3 = this;

        var _a, _b, _c, _d;

        var memoParams = ctxt.annotations.onSelf(Memo)[0].args[0];
        ctxt.data.namespace = (_a = provider(memoParams === null || memoParams === void 0 ? void 0 : memoParams.namespace)()) !== null && _a !== void 0 ? _a : provider((_b = this._options) === null || _b === void 0 ? void 0 : _b.namespace)();
        ctxt.data.instanceId = "".concat((_c = provider(memoParams === null || memoParams === void 0 ? void 0 : memoParams.id)(ctxt)) !== null && _c !== void 0 ? _c : provider((_d = this._options) === null || _d === void 0 ? void 0 : _d.id)(ctxt));

        var key = this._options.createMemoKey(ctxt);

        if (!key) {
          throw new Error("".concat(this._options.createMemoKey.name, " function did not return a valid MemoKey"));
        }

        var options = ctxt.annotations.onSelf(Memo)[0].args[0];
        var expiration = this.getExpiration(ctxt, options);

        var drivers = _selectCandidateDrivers(this._drivers, ctxt);

        var proceedJoinpoint = function proceedJoinpoint() {
          var _a, _b, _c; // value not cached. Call the original method


          var value = jp();

          _this3._pendingResults.set(key.toString(), value); // marshall the value into a frame


          var marshallingContext = _this3._marshallers.marshal(value);

          var driver = drivers.filter(function (d) {
            return d.accepts(marshallingContext);
          }).map(function (d) {
            return [d, d.getPriority(marshallingContext)];
          }).sort(function (dp1, dp2) {
            return dp2[1] - dp1[1];
          }).map(function (dp) {
            return dp[0];
          })[0];

          if (!driver) {
            throw new commons.AspectError(ctxt, "Driver ".concat(drivers[0].NAME, " does not accept value of type ").concat((_c = (_b = (_a = utils.getProto(value)) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : _typeof(value), " returned by ").concat(ctxt.target.label));
          }

          if (expiration) {
            _this3._scheduleCleaner(driver, key, expiration);
          }

          marshallingContext.then(function (frame) {
            // promise resolution may not arrive in time in case the same method is called right after.
            // store the result in a temporary variable in order to be available right away
            var entry = {
              key: key,
              expiration: expiration,
              frame: frame,
              signature: __createContextSignature(ctxt)
            };
            driver.write(entry).then(function () {
              var pendingResults = _this3._pendingResults.get(key.toString());

              if (pendingResults === value) {
                _this3._pendingResults.delete(key.toString());
              }
            });
          });
          return value;
        };

        var pendingResults = this._pendingResults.get(key.toString());

        if (pendingResults) {
          return copy(pendingResults);
        }

        var _iterator = _createForOfIteratorHelper(drivers),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var d = _step.value;

            try {
              var entry = d.read(key);

              if (entry) {
                if (entry.expiration && entry.expiration < new Date()) {
                  // remove data if expired
                  this._removeValue(d, key);
                } else if (entry.signature && entry.signature !== __createContextSignature(ctxt)) {
                  // remove data if signature mismatch
                  console.debug("".concat(ctxt.target.label, " hash mismatch. Removing memoized data..."));

                  this._removeValue(d, key);
                } else {
                  return this._marshallers.unmarshal(entry.frame);
                }
              }
            } catch (e) {
              // mute errors in ase of version mismatch, & just remove old version
              if (e instanceof VersionConflictError || e instanceof MemoAspectError) {
                console.error(e);

                this._removeValue(d, key);
              } else {
                throw e;
              }
            }
          } // found no driver for this value. Call the real method

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return proceedJoinpoint();
      }
    }, {
      key: "_removeValue",
      value: function _removeValue(driver, key) {
        driver.remove(key); // get gc timeout handle

        var t = this._entriesGc.get(key.toString());

        this._pendingResults.delete(key.toString());

        if (t !== undefined) {
          // this entry is not eligible for gc
          this._entriesGc.delete(key.toString()); // remove gc timeout


          clearTimeout(t);
        }
      }
    }, {
      key: "_scheduleCleaner",
      value: function _scheduleCleaner(driver, key, expiration) {
        var _this4 = this;

        var ttl = expiration.getTime() - new Date().getTime();

        if (ttl <= 0) {
          this._removeValue(driver, key);
        } else {
          this._entriesGc.set(key.toString(), setTimeout(function () {
            return _this4._removeValue(driver, key);
          }, ttl));
        }
      }
    }, {
      key: "_initGc",
      value: function _initGc(driver) {
        var _this5 = this;

        driver.getKeys().then(function (keys) {
          keys.forEach(function (k) {
            Promise.resolve(driver.read(k)).then(function (memo) {
              if (memo === null || memo === void 0 ? void 0 : memo.expiration) {
                _this5._scheduleCleaner(driver, k, memo.expiration);
              }
            });
          });
        });
      }
    }, {
      key: "getExpiration",
      value: function getExpiration(ctxt, options) {
        var exp = provider(options === null || options === void 0 ? void 0 : options.expiration)();

        if (exp) {
          if (exp instanceof Date) {
            return exp;
          } else if (typeof exp === 'number' && exp > 0) {
            return new Date(new Date().getTime() + exp * 1000);
          } else if (exp === 0) {
            return;
          }

          throw new commons.AspectError(ctxt, "expiration should be either a Date or a positive number. Got: ".concat(exp));
        }
      }
    }]);

    return MemoAspect;
  }();

  __decorate([annotations.Around(commons.on.method.withAnnotations(Memo)), __metadata("design:type", Function), __metadata("design:paramtypes", [Object, Function]), __metadata("design:returntype", Object)], exports.MemoAspect.prototype, "applyMemo", null);

  exports.MemoAspect = __decorate([annotations.Aspect('@aspectjs/memo'), __metadata("design:paramtypes", [Object])], exports.MemoAspect);

  function _selectCandidateDrivers(drivers, ctxt) {
    var _a, _b;

    var annotationOptions = (_a = ctxt.annotations.onSelf(Memo)[0].args[0]) !== null && _a !== void 0 ? _a : {};

    if (!annotationOptions.driver) {
      // return all drivers
      return Object.values(drivers);
    } else {
      if (utils.isString(annotationOptions.driver)) {
        var candidates = Object.values(drivers).filter(function (d) {
          return d.NAME === annotationOptions.driver;
        });

        if (!candidates.length) {
          throw new commons.AspectError(ctxt, "No candidate driver available for driver name \"".concat(annotationOptions.driver, "\""));
        }

        return candidates;
      } else if (utils.isFunction(annotationOptions.driver)) {
        var _candidates = Object.values(drivers).filter(function (d) {
          return d.constructor === annotationOptions.driver;
        });

        if (!_candidates.length) {
          throw new commons.AspectError(ctxt, "No candidate driver available for driver \"".concat((_b = annotationOptions.driver) === null || _b === void 0 ? void 0 : _b.name, "\""));
        }

        return _candidates;
      } else {
        throw new commons.AspectError(ctxt, "driver option should be a string or a Driver constructor. Got: ".concat(annotationOptions.driver));
      }
    }
  }

  function __createContextSignature(ctxt) {
    var s = [];
    var proto = ctxt.target.proto;
    var property = proto[ctxt.target.propertyKey];

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

  var MemoProfile = /*#__PURE__*/function (_WeaverProfile) {
    _inherits(MemoProfile, _WeaverProfile);

    var _super = _createSuper(MemoProfile);

    function MemoProfile(memoProfileFeatures) {
      var _this;

      _classCallCheck(this, MemoProfile);

      var _a, _b, _c, _d;

      _this = _super.call(this);
      _this._features = {
        useLocalStorage: true,
        useIndexedDb: true,
        useLzString: true,
        options: {}
      };

      _this.enable(new exports.DefaultCacheableAspect());

      _this._features.options = (_a = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.options) !== null && _a !== void 0 ? _a : _this._features.options;
      _this._features.useIndexedDb = (_b = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useIndexedDb) !== null && _b !== void 0 ? _b : _this._features.useIndexedDb;
      _this._features.useLzString = (_c = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useLzString) !== null && _c !== void 0 ? _c : _this._features.useLzString;
      _this._features.useLocalStorage = (_d = memoProfileFeatures === null || memoProfileFeatures === void 0 ? void 0 : memoProfileFeatures.useLocalStorage) !== null && _d !== void 0 ? _d : _this._features.useLocalStorage;

      var marshallers = _toConsumableArray(DEFAULT_MARSHALLERS);

      var drivers = [];

      if (_this._features.useIndexedDb) {
        drivers.push(new IdbMemoDriver());
      }

      if (_this._features.useLocalStorage) {
        var serializer;

        if (_this._features.useLzString) {
          serializer = new LzMemoSerializer();
        }

        drivers.push(new LsMemoDriver({
          serializer: serializer
        }));
      }

      var memoAspect = new exports.MemoAspect(Object.assign(Object.assign({}, _this._features.options), {
        marshallers: marshallers,
        drivers: drivers
      }));

      _this.enable(memoAspect);

      return _this;
    }

    _createClass(MemoProfile, [{
      key: "configure",
      value: function configure(features) {
        return new MemoProfile(Object.assign(Object.assign({}, this._features), features));
      }
    }]);

    return MemoProfile;
  }(commons.WeaverProfile);

  /**
   * @public
   */

  var DefaultMemoProfile = /*#__PURE__*/function (_MemoProfile) {
    _inherits(DefaultMemoProfile, _MemoProfile);

    var _super = _createSuper(DefaultMemoProfile);

    function DefaultMemoProfile() {
      _classCallCheck(this, DefaultMemoProfile);

      return _super.apply(this, arguments);
    }

    _createClass(DefaultMemoProfile, [{
      key: "register",
      value: function register() {
        core.WEAVER_CONTEXT.getWeaver().enable(this);
      }
    }, {
      key: "configure",
      value: function configure(features) {
        return new DefaultMemoProfile(Object.assign(Object.assign({}, this._features), features));
      }
    }]);

    return DefaultMemoProfile;
  }(MemoProfile);
  /**
   * @public
   */


  var MEMO_PROFILE = new DefaultMemoProfile();

  exports.ArrayMarshaller = ArrayMarshaller;
  exports.BasicMarshaller = BasicMarshaller;
  exports.Cacheable = _Cacheable;
  exports.CacheableMarshaller = CacheableMarshaller;
  exports.DEFAULT_LS_DRIVER_OPTIONS = DEFAULT_LS_DRIVER_OPTIONS;
  exports.DEFAULT_MARSHALLERS = DEFAULT_MARSHALLERS;
  exports.DateMarshaller = DateMarshaller;
  exports.IdbMemoDriver = IdbMemoDriver;
  exports.LsMemoDriver = LsMemoDriver;
  exports.LzMemoSerializer = LzMemoSerializer;
  exports.MEMO_PROFILE = MEMO_PROFILE;
  exports.Memo = Memo;
  exports.MemoDriver = MemoDriver;
  exports.MemoFrame = MemoFrame;
  exports.MemoKey = MemoKey;
  exports.MemoMarshaller = MemoMarshaller;
  exports.MemoProfile = MemoProfile;
  exports.NoopMarshaller = NoopMarshaller;
  exports.ObjectMarshaller = ObjectMarshaller;
  exports.PromiseMarshaller = PromiseMarshaller;
  exports.SimpleLsSerializer = SimpleLsSerializer;
  exports._CacheTypeStoreImpl = _CacheTypeStoreImpl;

})));
//# sourceMappingURL=memo.umd.js.map
