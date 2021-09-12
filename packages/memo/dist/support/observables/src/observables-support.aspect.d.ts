import { AfterReturnContext, AspectType, WeaverProfile } from '@aspectjs/core/commons';
/**
 * Enable support for Observables memoization.
 * @public
 */
export declare class ObservableMemoSupportAspect implements AspectType {
    onEnable(weaver: WeaverProfile): void;
    onDisable(weaver: WeaverProfile): void;
    shareReplay(ctxt: AfterReturnContext): any;
}
//# sourceMappingURL=observables-support.aspect.d.ts.map