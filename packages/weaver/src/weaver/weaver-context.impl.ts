import { Annotation, AnnotationBootstrapModule, AnnotationFactory, AnnotationType } from '@aspectjs/common';
import { ReflectContext, ReflectContextImpl } from '@aspectjs/reflect';
import { AspectsRegistryImpl } from '../aspect/aspect.registry.impl';
import { AspectsRegistry } from '../aspect/aspect.registry.type';
import { JitWeaver } from '../jit/jit-weaver';
import { Weaver } from './weaver';
import { WeaverContext, _getWeaverContext } from './weaver-context';

const JIT_WEAVER_ANNOTATION_BOOTSTRAP_MODULE: AnnotationBootstrapModule = {
    name: '@aspectjs::weaverDecorator',
    order: 100,
    decorator: (annotation: Annotation) => {
        throw new Error(
            `Cannot invoke annotation ${annotation.name ?? ''} before "setWeaverContext()" has been called`,
        );
    },
};

AnnotationFactory.addBootstrapModule(JIT_WEAVER_ANNOTATION_BOOTSTRAP_MODULE);

/**
 * @public
 */
export class WeaverContextImpl implements WeaverContext {
    readonly weaver: Weaver;

    readonly aspects: { registry: AspectsRegistry };

    readonly annotations: ReflectContext['annotations'];

    constructor(reflectContext: ReflectContextImpl) {
        this.aspects = {
            registry: new AspectsRegistryImpl(reflectContext),
        };
        this.annotations = reflectContext.annotations;
        this.weaver = this._createWeaver();
        this._registerWeaver();
    }
    private _registerWeaver() {
        const _weaverContext = this;
        JIT_WEAVER_ANNOTATION_BOOTSTRAP_MODULE.decorator = () => {
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
