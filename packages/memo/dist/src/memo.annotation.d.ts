import { AnnotationRef } from '@aspectjs/core/commons';
import { MemoAspectOptions } from './memo.aspect';
import { MemoDriver } from './drivers';
/**
 * Memoize the return value of a method. The return value can be sored in LocalStorage or in IndexedDb according to configured drivers.
 * @see MEMO_PROFILE
 * @public
 */
export declare const Memo: ((options?: MemoOptions) => MethodDecorator) & AnnotationRef;
/**
 * Options supported by the @Memo annotation
 * @public
 */
export interface MemoOptions extends MemoAspectOptions {
    driver?: string | typeof MemoDriver;
}
//# sourceMappingURL=memo.annotation.d.ts.map