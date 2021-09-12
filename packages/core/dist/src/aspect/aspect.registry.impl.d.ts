import { Advice, AdvicesFilter, AdvicesRegistry, AdviceTarget, AdviceType, AspectsRegistry, AspectType, PointcutPhase, WeaverContext } from '@aspectjs/core/commons';
/**
 * Stores the aspects along with their advices.
 * @public
 */
export declare class AspectsRegistryImpl implements AspectsRegistry {
    private _weaverContext;
    private readonly _advicesRegistryKey;
    private _advicesRegistry;
    private _dirty;
    private readonly _aspectsToLoad;
    private readonly _loadedAspects;
    constructor(_weaverContext: WeaverContext);
    /**
     * Register a new advice, with the aspect it belongs to.
     * @param aspects - The aspects to register
     */
    register(...aspects: AspectType[]): void;
    remove(...aspects: AspectType[]): void;
    /**
     * Get all advices that belongs to the given aspect
     * @param aspect - the aspect to get advices for.
     */
    getAdvicesByAspect(aspect: AspectType): Advice[];
    getAdvicesByTarget<T, A extends AdviceType, P extends PointcutPhase>(target: AdviceTarget<T, A>, filter?: AdvicesFilter, ...phases: PointcutPhase[]): AdvicesRegistry['byTarget'][string];
    /**
     * @internal
     */
    private _getTarget;
    /**
     * Sort the aspects according to their precedence & store by target, by phase & type
     * @private
     */
    private _load;
}
//# sourceMappingURL=aspect.registry.impl.d.ts.map