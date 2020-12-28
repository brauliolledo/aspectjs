import { setupReflectTestingContext } from '@aspectjs/reflect/testing';
import { setupWeaverTestingContext } from '@aspectjs/weaver/testing';
import { WeaverContext } from '@aspectjs/weaver';
import { ReflectContext } from '../../../reflect/public_api';

export function setupAspectTestingContext(): {
    weaverContext: WeaverContext;
    reflectContext: ReflectContext;
} {
    const reflectContext = setupReflectTestingContext();
    return { reflectContext, weaverContext: setupWeaverTestingContext(reflectContext) };
}
