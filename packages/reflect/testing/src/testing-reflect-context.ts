import { ReflectContext, _setReflectContext } from '../../src/context/reflect.context';
import { ReflectContextImpl } from '../../src/context/reflect-context.impl';

export class ReflectTestingContext extends ReflectContextImpl {}

/**
 * Setup a brand new ReflectContext for test purposes
 * @public
 */
export function setupReflectTestingContext(): ReflectContext {
    const context = new ReflectTestingContext();
    _setReflectContext(context);
    return context;
}
