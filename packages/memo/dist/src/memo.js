import { WEAVER_CONTEXT } from '@aspectjs/core';
import { MemoProfile } from './profiles/default.profile';
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
export const MEMO_PROFILE = new DefaultMemoProfile();
//# sourceMappingURL=memo.js.map