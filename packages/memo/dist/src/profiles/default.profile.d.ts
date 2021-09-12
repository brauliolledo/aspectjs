import { WeaverProfile } from '@aspectjs/core/commons';
import { MemoAspectOptions } from '../memo.aspect';
/**
 * @public
 */
export interface MemoProfileFeatures {
    useLocalStorage?: boolean;
    useIndexedDb?: boolean;
    useLzString?: boolean;
    options?: MemoAspectOptions;
}
/**
 * Weaver profile configured with
 * - LsMemoAspect (for synchronous @Memo methods)
 *     - LzMemoHandler to compress data stored in LocalStorage
 * - IndexedDbMemoAspect (for asynchronous @Memo methods)
 * @public
 */
export declare class MemoProfile extends WeaverProfile {
    protected _features: MemoProfileFeatures;
    constructor(memoProfileFeatures?: MemoProfileFeatures);
    configure(features: MemoProfileFeatures): MemoProfile;
}
//# sourceMappingURL=default.profile.d.ts.map