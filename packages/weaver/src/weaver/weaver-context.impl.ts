import { Annotation, AnnotationsHook, AnnotationFactory, AnnotationType } from '@aspectjs/common';
import { assert } from '@aspectjs/common/utils';
import { ReflectContext, ReflectContextImpl } from '@aspectjs/reflect';
import { AspectsRegistryImpl } from '../aspect/aspect.registry.impl';
import { AspectsRegistry } from '../aspect/aspect.registry.type';
import { JitWeaver } from '../jit/jit-weaver';
import { Weaver } from './weaver';
import { WeaverContext } from './weaver-context';

const JIT_WEAVER_ANNOTATIONS_HOOK: AnnotationsHook = {
    name: '@aspectjs::hook:weaverDecorator',
    order: 100,
    decorator: (annotation: Annotation) => {
        throw new Error(
            `Cannot invoke annotation ${annotation.name ?? ''} before "setWeaverContext()" has been called`,
        );
    },
};

AnnotationFactory.addAnnotationsHook(JIT_WEAVER_ANNOTATIONS_HOOK);

/**
 * @public
 */
export class WeaverContextImpl implements WeaverContext {
    readonly weaver: Weaver;

    readonly aspects: { registry: AspectsRegistry };

    readonly annotations: ReflectContext['annotations'];

    constructor(reflectContext: ReflectContextImpl) {
        assert(!!reflectContext);

        this.aspects = {
            registry: new AspectsRegistryImpl(reflectContext),
        };
        this.annotations = reflectContext.annotations;
        this.weaver = this._createWeaver();
        this._registerWeaver();
    }
    private _registerWeaver() {
        const _weaverContext = this;
        JIT_WEAVER_ANNOTATIONS_HOOK.decorator = () => {
            return function (...targetArgs) {
                const target = _weaverContext.annotations.targetFactory.of(targetArgs);
                const enhanced = _weaverContext.weaver.enhance(target);
                if (target.type === AnnotationType.CLASS) {
                    Object.defineProperties(enhanced, Object.getOwnPropertyDescriptors(targetArgs[0]));
                }
                return enhanced;
            };
        };
    }

    protected _createWeaver(): Weaver {
        return new JitWeaver(this);
    }
    /**
     * Get the global weaver
     */
    getWeaver(): Weaver {
        return this.weaver;
    }
}
