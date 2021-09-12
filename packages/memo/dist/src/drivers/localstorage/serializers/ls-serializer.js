import { isUndefined } from '@aspectjs/core/utils';
import { parse, stringify } from 'flatted';
import { MemoFrame } from '../../memo-frame';
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
export class SimpleLsSerializer {
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
//# sourceMappingURL=ls-serializer.js.map