import { isObject, isArray, assert } from '@aspectjs/core/utils';
import { MemoFrame } from '../drivers/memo-frame.js';
import { InstantPromise } from '../utils/instant-promise.js';

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
        if (isObject(value) || isArray(value)) {
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

export { MarshallersRegistry };
//# sourceMappingURL=marshallers-registry.js.map
