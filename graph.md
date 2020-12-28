core(reflect, common, core/annotations) -> Aspect, PointcutExpression, AspectjsContext
core/annotations(core) -> Before, After, ...
core/testing(core, weaver) -> Before, After, ...

weaver(core, reflect) -> JitWeaver, AspectsRegistry, WeaverContext
common() -> common/utils  
reflect(common) -> Annotation[Bundle|Context|Location|Registry|Target], ReflectContext
