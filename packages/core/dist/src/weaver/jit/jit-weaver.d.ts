import { AnnotationTarget, AspectType, Weaver, WeaverContext, WeaverProfile } from '@aspectjs/core/commons';
/**
 * The JitWeaver wires up advices to the corresponding annotations as soon as the annotation gets processed by JS interpreter.
 * @public
 */
export declare class JitWeaver extends WeaverProfile implements Weaver {
    private _context;
    private _prod;
    private _planFactory;
    private _enhancers;
    /**
     *
     * @param _context - the weaver context to attach this weaver to.
     * @param _prod - When prod mode is activated, enabling an aspect after Annotation compilation is prohibed.
     */
    constructor(_context: WeaverContext, _prod?: boolean);
    enable(...aspects: (AspectType | WeaverProfile)[]): this;
    disable(...aspects: (AspectType | WeaverProfile)[]): this;
    reset(): this;
    enhance<T>(target: AnnotationTarget<T>): void | Function | PropertyDescriptor;
    private _enhanceClass;
    private _enhanceProperty;
    private _enhanceMethod;
    private _enhanceParameter;
}
//# sourceMappingURL=jit-weaver.d.ts.map