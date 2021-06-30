import { WeaverContextImpl } from '@aspectjs/weaver';
import { ReflectContextImpl, _getReflectContext, _setReflectContext } from '../../../reflect/public_api';
import { JitWeaver } from '../../src/jit/jit-weaver';
import { Weaver } from '../../src/weaver/weaver';
import { WeaverContext, _setWeaverContext } from '../../src/weaver/weaver-context';

export class WeaverTestingContext extends WeaverContextImpl {
    protected _createWeaver(): Weaver {
        return new JitWeaver(this, false);
    }
}

export function setupWeaverTestingContext(): WeaverContext {
    _setReflectContext(new ReflectContextImpl());
    const context = new WeaverTestingContext(_getReflectContext());
    _setWeaverContext(context);
    return context;
}
