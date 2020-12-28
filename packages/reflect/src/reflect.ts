import { ReflectContextImpl } from './context/reflect-context.impl';
import { _setReflectContext } from './context/reflect.context';

export * from './annotation/bundle/bundle';
export * from './annotation/context/annotation-context.registry';
export * from './annotation/context/annotation.context';
export * from './annotation/location/annotation-location';
export * from './annotation/location/location.factory';
export * from './annotation/registry/annotation.registry';
export * from './annotation/target/annotation-target';
export * from './annotation/target/annotation-target.factory';
export * from './context/reflect-context.impl';
export * from './context/reflect.context';

export const REFLECT = new ReflectContextImpl();
export const ANNOTATIONS = REFLECT.annotations.bundle;
export const LOCATION = REFLECT.annotations.location;
_setReflectContext(REFLECT);
