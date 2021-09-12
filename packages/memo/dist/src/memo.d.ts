import { MemoProfile, MemoProfileFeatures } from './profiles/default.profile';
/**
 * @public
 */
declare class DefaultMemoProfile extends MemoProfile {
    register(): void;
    configure(features: MemoProfileFeatures): DefaultMemoProfile;
}
/**
 * @public
 */
export declare const MEMO_PROFILE: DefaultMemoProfile;
export {};
//# sourceMappingURL=memo.d.ts.map