import { AnnotationType } from '@aspectjs/common';
import { AspectType } from '@aspectjs/core';
import { AdviceTarget, _getReflectContext } from '@aspectjs/reflect';
import { Weaver } from '../public_api';
import { _getWeaverContext, _setWeaverContext } from './weaver/weaver-context';
import { WeaverContextImpl } from './weaver/weaver-context.impl';

export * from './errors';
export * from './jit/jit-weaver';
export * from './joinpoint-factory';
export * from './weaver/plan.factory';
export * from './weaver/weaver';
export * from './weaver/weaver-context';
export * from './weaver/weaver-context.impl';

// TODO move into a new 'setupWeaver' function
_setWeaverContext(_getWeaverContext() ?? new WeaverContextImpl(_getReflectContext()));

// TODO create function getWeaver() instead
export const WEAVER: Weaver = new (class implements Weaver {
    enable(...aspects: AspectType[]): this {
        _getWeaverContext()
            .getWeaver()
            .enable(...aspects);
        return this;
    }
    disable(...aspects: (string | AspectType)[]): this {
        _getWeaverContext()
            .getWeaver()
            .disable(...aspects);
        return this;
    }
    setEnabled(aspect: AspectType, enabled: boolean): this {
        _getWeaverContext().getWeaver().setEnabled(aspect, enabled);
        return this;
    }
    getAspect<T extends AspectType>(aspect: string | (new () => T)): T {
        return _getWeaverContext().getWeaver().getAspect(aspect);
    }
    getAspects(): AspectType[] {
        return _getWeaverContext().getWeaver().getAspects();
    }
    [Symbol.iterator](): Iterator<AspectType> {
        return _getWeaverContext().getWeaver()[Symbol.iterator]();
    }
    enhance<T>(target: AdviceTarget<T, AnnotationType>): void | Function | PropertyDescriptor {
        return _getWeaverContext().getWeaver().enhance(target);
    }
})();
