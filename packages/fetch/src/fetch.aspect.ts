import { ANNOTATIONS } from '@aspectjs/core';
import { AfterReturn, Aspect } from '@aspectjs/core/annotations';
import { AfterContext, AnnotationContext, AnnotationType, AspectError, on } from '@aspectjs/core/commons';
import {
    Delete,
    FetchAnnotationType,
    FetchClient,
    Get,
    Patch,
    PathParam,
    Post,
    Put,
} from '@aspectjs/fetch/annotations';
import { assert } from 'console';
import { FetchAspectOptions } from 'fetch/annotations/src/types';

type PathParamTemplate = {
    placeholder: string;
    name: string;
    value: any;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

@Aspect()
export class FetchAspect {
    constructor(private options?: FetchAspectOptions) {
        if (!options.fetchAdapter && !(global || window).fetch) {
            throw new Error(`fetch was not found in global scope, and no fetch adapter was provided`);
        }
        this.options = this.options ?? ({} as FetchAspectOptions);
    }

    @AfterReturn(on.method.withAnnotations(Get))
    protected _doGet(context: AfterContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'GET', Get);
    }

    @AfterReturn(on.method.withAnnotations(Post))
    protected _doPost(context: AfterContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'POST', Post);
    }

    @AfterReturn(on.method.withAnnotations(Put))
    protected _doPut(context: AfterContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'PUT', Put);
    }

    @AfterReturn(on.method.withAnnotations(Patch))
    protected _doPatch(context: AfterContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'PATCH', Patch);
    }

    @AfterReturn(on.method.withAnnotations(Delete))
    protected _doDelete(context: AfterContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'DELETE', Delete);
    }

    protected _doFetch(
        context: AfterContext<unknown, AnnotationType.METHOD>,
        method: string,
        annotation: FetchAnnotationType,
    ) {
        const requestTemplates = [
            this.options,
            ...[
                ANNOTATIONS.at(context.target.declaringClass.location).onSelf(FetchClient)[0],
                context.annotations.onSelf(annotation)[0],
            ]
                .filter((c) => !!c?.args[0])
                .map((c) => c.args[0])
                .map((r) => {
                    return (typeof r === 'string'
                        ? {
                              url: r as string,
                          }
                        : r) as Request;
                }),
        ];

        const request = this._createRequest(method, requestTemplates);
        request.url = this._processPathParams(context, request);

        return this._fetch()(request.url, request);
    }

    protected _getPathParamTemplates(request: Request): PathParamTemplate[] {
        return [...request.url.matchAll(/\${(\w+?)}/gi)].map((r) => ({
            name: r[1],
            placeholder: r[0],
            value: undefined,
        }));
    }

    protected _processPathParams(context: AfterContext, request: Request): string {
        const pathParams = context.annotations.all(PathParam);
        const paramTemplates = this._getPathParamTemplates(request).reduce((params, param) => {
            params.set(param.name, param);
            return params;
        }, new Map<string, PathParamTemplate>());

        const namedPathParams: Record<string, AnnotationContext> = {};
        const positionalPathParams: AnnotationContext[] = [];

        // split named params & positional params
        pathParams.forEach((annotation) => {
            if (annotation.args[0]) {
                const paramName = annotation.args[0];
                if (namedPathParams[paramName]) {
                    throw new AspectError(
                        context,
                        `${PathParam} name "${paramName}" is specified for both ${annotation.target.label} & ${namedPathParams[paramName].target.label}`,
                    );
                }
                namedPathParams[paramName] = annotation;
            } else {
                positionalPathParams.push(annotation);
            }
        });

        let url = request.url;

        const replacePathParam = (url: string, pathParamTemplate: PathParamTemplate, annotation: AnnotationContext) => {
            assert(pathParamTemplate || annotation);
            if (!pathParams && !annotation) {
                return url;
            } else if (!annotation && pathParamTemplate) {
                throw new AspectError(
                    context,
                    `Unbound ${PathParam.name} placeholder: ${pathParamTemplate.placeholder}`,
                );
            } else if (!pathParamTemplate && annotation) {
                throw new AspectError(
                    context,
                    `Unbound ${PathParam}(${annotation.args[0] ?? ''}) on ${annotation.target.label}`,
                );
            }
            return replaceAll(url, pathParamTemplate.placeholder, this._getArgValue(context, annotation));
        };

        // apply named @PathParams
        Object.entries(namedPathParams)
            .sort(([k1, p1], [k2, p2]) => p1.target.parameterIndex - p2.target.parameterIndex)
            .forEach(([k, v]) => {
                url = replacePathParam(url, paramTemplates.get(k), v);
                paramTemplates.delete(k);
            });

        // apply positionnal @PathParams
        const remainingParams = [...paramTemplates.values()];
        positionalPathParams
            .sort((p1, p2) => p1.target.parameterIndex - p2.target.parameterIndex)
            .forEach((p) => (url = replacePathParam(url, remainingParams.shift(), p)));
        if (remainingParams.length) {
            throw new AspectError(
                context,
                `Unbound ${PathParam.name} placeholders: ${remainingParams.map((p) => p.placeholder).join(', ')}`,
            );
        }

        return url;
    }

    protected _getArgValue(context: AfterContext, annotation: AnnotationContext) {
        // get parameter value of the annotated argument
        const targetArg = annotation.target;
        const argValue = context.args[targetArg.parameterIndex];
        const strValue = `${argValue}`;
        if (strValue === {}.toString() || strValue === 'undefined') {
            console.warn(`${annotation} on ${targetArg.label}: value resolved to ${strValue}`);
        }

        return strValue;
    }
    protected _createRequest(method: string, requestTemplates: Request[]): Mutable<Request> {
        const request = requestTemplates.reduce(
            (request, r) => {
                let url = request.url;
                if (r.url) {
                    url = r.url.match(/:\/\//) ? r.url : `${url}/${r.url.replace(/\/$/, '').replace(/^\//, '')}`;
                }
                return { ...request, ...r, url };
            },
            ({
                url: 'http://',
            } as any) as Request,
        );

        (request as RequestInit).method = method;
        return request as Request;
    }

    private _fetch(): typeof fetch {
        if (this.options.fetchAdapter) {
            return this.options.fetchAdapter.bind(this.options.fetchAdapter);
        }
        if ((global || window).fetch) {
            return (global || window).fetch;
        }
        throw new Error(`fetch was not found in global scope, and no fetch adapter was provided`);
    }
}

function replaceAll(str: string, patternStr: string, value: string) {
    let oldStr = str;
    do {
        oldStr = str;
        str = str.replace(patternStr, value);
    } while (oldStr !== str);

    return str;
}
