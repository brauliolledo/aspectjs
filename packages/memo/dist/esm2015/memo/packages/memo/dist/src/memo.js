import { WEAVER_CONTEXT } from '@aspectjs/core';
import { MemoProfile } from './profiles/default.profile.js';

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

export { MEMO_PROFILE };
//# sourceMappingURL=memo.js.map
