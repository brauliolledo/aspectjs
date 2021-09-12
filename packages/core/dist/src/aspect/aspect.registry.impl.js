import { After, AfterReturn, AfterThrow, Around, Before, Compile, Order } from '@aspectjs/core/annotations';
import { _AdviceFactory, _getWeaverContext, AnnotationLocationFactory, Pointcut, PointcutPhase, } from '@aspectjs/core/commons';
import { assert, assertIsAspect, locator } from '@aspectjs/core/utils';
/**
 * Stores the aspects along with their advices.
 * @public
 */
export class AspectsRegistryImpl {
    constructor(_weaverContext) {
        this._weaverContext = _weaverContext;
        this._advicesRegistry = {
            byPointcut: {},
            byTarget: {},
            byAspect: {},
        };
        this._dirty = true;
        this._aspectsToLoad = new Set();
        this._loadedAspects = new Set();
        this._advicesRegistryKey = `aspectjs.adviceRegistry.byAspects`; // TODO increment key with AspectsRegistry instance ?
    }
    /**
     * Register a new advice, with the aspect it belongs to.
     * @param aspects - The aspects to register
     */
    register(...aspects) {
        (aspects !== null && aspects !== void 0 ? aspects : []).forEach((aspect) => {
            // get annotations bundle
            const annotationsContext = _getWeaverContext().annotations;
            const bundle = annotationsContext.bundle.at(annotationsContext.location.of(aspect));
            // get @Aspect options
            const target = this._getTarget(aspect);
            const byAspectRegistry = locator(this._advicesRegistry.byAspect)
                .at(target.ref)
                .orElseCompute(() => ({}));
            this._aspectsToLoad.add(aspect);
            [
                [Compile, PointcutPhase.COMPILE],
                [Before, PointcutPhase.BEFORE],
                [Around, PointcutPhase.AROUND],
                [After, PointcutPhase.AFTER],
                [AfterReturn, PointcutPhase.AFTERRETURN],
                [AfterThrow, PointcutPhase.AFTERTHROW],
            ].forEach((adviceDef) => {
                bundle.onMethod(adviceDef[0]).forEach((annotation) => {
                    const expr = annotation.args[0];
                    assert(!!expr);
                    const advice = _AdviceFactory.create(Pointcut.of(adviceDef[1], expr), annotation.target);
                    const k = `${advice.pointcut.ref}=>${advice.name}`;
                    byAspectRegistry[k] = advice;
                });
            });
        });
    }
    remove(...aspects) {
        this._dirty = true;
        if (this._aspectsToLoad.size) {
            aspects.forEach((a) => {
                // remove aspect from the list of aspects to load
                this._aspectsToLoad.delete(a);
                // remove aspect from registry
                delete this._advicesRegistry.byAspect[this._getTarget(a).ref];
            });
        }
        // force all aspects to reload
        this._loadedAspects.forEach((a) => this._aspectsToLoad.add(a));
        this._loadedAspects.clear();
    }
    /**
     * Get all advices that belongs to the given aspect
     * @param aspect - the aspect to get advices for.
     */
    getAdvicesByAspect(aspect) {
        var _a;
        assertIsAspect(aspect);
        const target = this._getTarget(aspect);
        return Object.values((_a = this._advicesRegistry.byAspect[target.ref]) !== null && _a !== void 0 ? _a : {})
            .flat()
            .map((advice) => {
            const bound = advice.bind(aspect);
            Object.defineProperties(bound, Object.getOwnPropertyDescriptors(advice));
            return bound;
        });
    }
    getAdvicesByTarget(target, filter, ...phases) {
        this._load();
        const targetRegistry = locator(this._advicesRegistry)
            .at('byTarget')
            .at(`${target.ref}${(filter === null || filter === void 0 ? void 0 : filter.name) ? `:${filter === null || filter === void 0 ? void 0 : filter.name}` : ''}`)
            .orElseGet(() => ({}));
        // get all advices that correspond to all the annotations of this context
        const bundle = this._weaverContext.annotations.bundle.at(target.location);
        const annotationContexts = bundle.onSelf();
        (phases !== null && phases !== void 0 ? phases : []).forEach((phase) => {
            if (!targetRegistry[phase]) {
                let advices = annotationContexts
                    .map((annotationContext) => locator(this._advicesRegistry)
                    .at('byPointcut')
                    .at(phase)
                    .at(target.type)
                    .at('byAnnotation')
                    .at(annotationContext.ref)
                    .orElseGet(() => []))
                    .flat()
                    .sort((a1, a2) => {
                    var _a, _b;
                    // sort by advice order
                    const a = this._weaverContext.annotations;
                    const o1 = (_a = a.bundle.at(a.location.of(a1.aspect)[a1.name]).onMethod(Order)[0]) === null || _a === void 0 ? void 0 : _a.args[0];
                    const o2 = (_b = a.bundle.at(a.location.of(a2.aspect)[a1.name]).onMethod(Order)[0]) === null || _b === void 0 ? void 0 : _b.args[0];
                    return _compareOrder(o1, o2);
                });
                if (filter) {
                    advices = advices.filter(filter.fn);
                }
                targetRegistry[phase] = advices;
            }
        });
        return targetRegistry;
    }
    /**
     * @internal
     */
    _getTarget(obj) {
        return AnnotationLocationFactory.getTarget(this._weaverContext.annotations.location.of(obj));
    }
    /**
     * Sort the aspects according to their precedence & store by target, by phase & type
     * @private
     */
    _load() {
        if (this._dirty) {
            this._advicesRegistry.byPointcut = {};
            this._advicesRegistry.byTarget = {};
        }
        if (!this._aspectsToLoad.size) {
            return;
        }
        [...this._aspectsToLoad]
            .sort((a1, a2) => {
            var _a, _b;
            // sort by aspect order
            const a = this._weaverContext.annotations;
            const o1 = (_a = a.bundle.at(a.location.of(a1)).onClass(Order)[0]) === null || _a === void 0 ? void 0 : _a.args[0];
            const o2 = (_b = a.bundle.at(a.location.of(a2)).onClass(Order)[0]) === null || _b === void 0 ? void 0 : _b.args[0];
            return _compareOrder(o1, o2);
        })
            .map((a) => {
            this._loadedAspects.add(a);
            return a;
        })
            .map((aspect) => this.getAdvicesByAspect(aspect))
            .flat()
            .forEach((advice) => {
            const pc = advice.pointcut;
            locator(this._advicesRegistry)
                .at('byPointcut')
                .at(pc.phase)
                .at(pc.type)
                .at('byAnnotation')
                .at(pc.annotation.ref)
                .orElseCompute(() => [])
                .push(advice);
        });
        this._dirty = false;
        this._aspectsToLoad.clear();
    }
}
function _compareOrder(o1, o2) {
    if (o1 === Order.LOWEST_PRECEDENCE || o1 === undefined) {
        return 1;
    }
    if (o2 === Order.LOWEST_PRECEDENCE || o2 === undefined) {
        return -1;
    }
    if (o1 === Order.HIGHEST_PRECEDENCE) {
        return -1;
    }
    if (o2 === Order.HIGHEST_PRECEDENCE) {
        return 1;
    }
    return o1 - o2;
}
//# sourceMappingURL=aspect.registry.impl.js.map