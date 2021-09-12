import { Weaver } from '@aspectjs/core/commons';
import { MemoOptions } from '../memo.annotation';
import { MemoAspectOptions } from '../memo.aspect';
export declare function createMemoMethod(method?: (...args: any[]) => any, options?: MemoOptions): any;
export declare function setupMemoAspect(memoAspectOptions?: MemoAspectOptions): Weaver;
//# sourceMappingURL=spec-helpers.d.ts.map