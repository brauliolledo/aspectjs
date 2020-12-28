import { WeaverContextImpl } from '@aspectjs/weaver';
import { ReflectContext, _getReflectContext, _setReflectContext } from '../../../reflect/public_api';
import { JitWeaver } from '../../src/jit/jit-weaver';
import { Weaver } from '../../src/weaver/weaver';
import { WeaverContext, _getWeaverContext, _setWeaverContext } from '../../src/weaver/weaver-context';

export class WeaverTestingContext extends WeaverContextImpl {
    protected _createWeaver(): Weaver {
        return new JitWeaver(this, false);
    }
}

export function setupWeaverTestingContext(reflectContext?: ReflectContext): WeaverContext {
    reflectContext = reflectContext ?? _getReflectContext();
    _setReflectContext(reflectContext);
    const context = new WeaverTestingContext(reflectContext);
    _setWeaverContext(context);
    return context;
}
