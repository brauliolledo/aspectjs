import { AfterContext } from '../advices/after/after.context';
import { BeforeContext } from '../advices/before/before.context';
import { AfterReturnContext } from '../advices/after-return/after-return.context';
import { AfterThrowContext } from '../advices/after-throw/after-throw.context';
import { AroundContext } from '../advices/around/around.context';
import { CompileContext } from '../advices/compile/compile.context';
import { AdviceType } from './advice.type';

/**
 * @public
 */
export type AdviceContext<T = unknown, A extends AdviceType = any> =
    | AfterContext<T, A>
    | BeforeContext<T, A>
    | AfterReturnContext<T, A>
    | AfterThrowContext<T, A>
    | AroundContext<T, A>
    | CompileContext<T, A>;

/**
 * @public
 */
export { AfterContext, BeforeContext, AfterReturnContext, AfterThrowContext, AroundContext, CompileContext };
