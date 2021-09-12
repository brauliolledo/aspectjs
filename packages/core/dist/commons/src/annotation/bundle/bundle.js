import { isString, locator } from '@aspectjs/core/utils';
import { AnnotationType } from '../annotation.types';
import { AnnotationLocationFactory } from '../location/location.factory';
/**
 * @public
 */
export class RootAnnotationsBundle {
    constructor(_registry) {
        this._registry = _registry;
    }
    at(location, searchParents = true) {
        return new ClassAnnotationsBundle(this._registry, location, searchParents);
    }
    all(...annotations) {
        if (annotations && annotations.length === 1) {
            return locator(this._registry.byAnnotation)
                .at(getAnnotationRef(annotations[0]))
                .orElseGet(() => []);
        }
        let entries = Object.entries(this._registry.byAnnotation);
        if (annotations && annotations.length) {
            const annotationsSet = new Set(annotations.map((a) => getAnnotationRef(a)));
            entries = entries.filter((e) => annotationsSet.has(e[0]));
        }
        return entries.map((e) => e[1]).flat();
    }
}
/**
 * @public
 */
export class ClassAnnotationsBundle extends RootAnnotationsBundle {
    constructor(registry, location, searchParents) {
        super(registry);
        this.searchParents = searchParents;
        this._target = AnnotationLocationFactory.getTarget(location);
    }
    all(...annotations) {
        return this._allWithFilter(this._target, 'all', annotations);
    }
    onClass(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.CLASS, annotations);
    }
    onSelf(...annotations) {
        return this._allWithFilter(this._target, this._target.type, annotations);
    }
    onProperty(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.PROPERTY, annotations);
    }
    onMethod(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.METHOD, annotations);
    }
    onParameter(...annotations) {
        return this._allWithFilter(this._target, AnnotationType.PARAMETER, annotations);
    }
    _allWithFilter(target, filter, annotations) {
        if (!target) {
            return [];
        }
        const parentContext = target.parentClass && this.searchParents
            ? this._allWithFilter(target.parentClass, filter, annotations)
            : [];
        const reg = locator(this._registry.byTargetClassRef).at(target.declaringClass.ref).get();
        if (!reg) {
            return parentContext;
        }
        const annotationsRef = (annotations !== null && annotations !== void 0 ? annotations : []).map(getAnnotationRef);
        let contexts = reg.all;
        if (annotationsRef.length) {
            contexts = annotationsRef
                .map((annotationRef) => locator(reg.byAnnotation)
                .at(annotationRef)
                .orElseGet(() => []))
                .flat();
        }
        contexts = contexts.filter((a) => FILTERS[target.type][filter](target, a));
        return [...parentContext, ...contexts];
    }
}
const falseFilter = () => false;
const FILTERS = {
    [AnnotationType.CLASS]: {
        all(target, a) {
            // keep all if location is the class
            return true;
        },
        [AnnotationType.CLASS](target, a) {
            // keep only annotations on classes
            return a.target.type === AnnotationType.CLASS;
        },
        [AnnotationType.PROPERTY](target, a) {
            // keep only annotations on properties
            return a.target.type === AnnotationType.PROPERTY;
        },
        [AnnotationType.METHOD](target, a) {
            // keep only annotations on properties
            return a.target.type === AnnotationType.METHOD;
        },
        [AnnotationType.PARAMETER](target, a) {
            // keep only annotations on properties
            return a.target.type === AnnotationType.PARAMETER;
        },
    },
    [AnnotationType.PROPERTY]: {
        all(target, a) {
            // keep if same propertyKey
            return target.propertyKey === a.target.propertyKey;
        },
        [AnnotationType.CLASS]: falseFilter,
        [AnnotationType.PROPERTY](target, a) {
            return FILTERS[target.type].all(target, a);
        },
        [AnnotationType.METHOD]: falseFilter,
        [AnnotationType.PARAMETER]: falseFilter,
    },
    [AnnotationType.METHOD]: {
        all(target, a) {
            const aTarget = a.target;
            // keep if same propertyKey
            return (target.propertyKey === aTarget.propertyKey &&
                (aTarget.type === AnnotationType.PARAMETER || aTarget.type === AnnotationType.METHOD));
        },
        [AnnotationType.CLASS]: falseFilter,
        [AnnotationType.PROPERTY]: falseFilter,
        [AnnotationType.METHOD](target, a) {
            return (
            // keep only annotations on properties
            a.target.type === AnnotationType.METHOD &&
                // keep only the required method if location is the method
                target.propertyKey === a.target.propertyKey);
        },
        [AnnotationType.PARAMETER](target, a) {
            return (
            // keep only annotations on properties
            a.target.type === AnnotationType.PARAMETER &&
                // keep all parameters on method if location is the method
                target.propertyKey === a.target.propertyKey);
        },
    },
    [AnnotationType.PARAMETER]: {
        all(target, a) {
            const aTarget = a.target;
            return (
            // keep if same propertyKey
            target.propertyKey === aTarget.propertyKey &&
                // keep parameters if location is parameters
                aTarget.type === AnnotationType.PARAMETER &&
                (isNaN(target.parameterIndex) || target.parameterIndex === aTarget.parameterIndex));
        },
        [AnnotationType.CLASS]: falseFilter,
        [AnnotationType.PROPERTY]: falseFilter,
        [AnnotationType.METHOD]: falseFilter,
        [AnnotationType.PARAMETER](target, a) {
            return FILTERS[target.type].all(target, a);
        },
    },
};
function getAnnotationRef(annotation) {
    return isString(annotation) ? annotation : annotation === null || annotation === void 0 ? void 0 : annotation.ref;
}
//# sourceMappingURL=bundle.js.map