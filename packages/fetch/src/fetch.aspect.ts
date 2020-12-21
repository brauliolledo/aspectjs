import { ANNOTATIONS, LOCATION } from '@aspectjs/core';
import { AfterReturn, Aspect } from '@aspectjs/core/annotations';
import {
    AfterReturnContext,
    Annotation,
    AnnotationContext,
    AnnotationType,
    AspectError,
    on,
} from '@aspectjs/core/commons';
import {
    Delete,
    FetchAnnotationType,
    FetchClient,
    Get,
    Patch,
    PathParam,
    Post,
    Put,
    QueryParam,
} from '@aspectjs/fetch/annotations';
import { FetchAspectOptions } from 'fetch/annotations/src/types';

type PathParamTemplate = {
    placeholder: string;
    name: string;
    value: any;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type RequestLike = Mutable<Request>;

@Aspect()
export class FetchAspect {
    constructor(private options?: FetchAspectOptions) {
        if (!options.fetchAdapter && !(global || window).fetch) {
            throw new Error(`fetch was not found in global scope, and no fetch adapter was provided`);
        }
        this.options = this.options ?? ({} as FetchAspectOptions);
    }

    @AfterReturn(on.method.withAnnotations(Get))
    protected _doGet(context: AfterReturnContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'GET', Get);
    }

    @AfterReturn(on.method.withAnnotations(Post))
    protected _doPost(context: AfterReturnContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'POST', Post);
    }

    @AfterReturn(on.method.withAnnotations(Put))
    protected _doPut(context: AfterReturnContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'PUT', Put);
    }

    @AfterReturn(on.method.withAnnotations(Patch))
    protected _doPatch(context: AfterReturnContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'PATCH', Patch);
    }

    @AfterReturn(on.method.withAnnotations(Delete))
    protected _doDelete(context: AfterReturnContext<unknown, AnnotationType.METHOD>) {
        return this._doFetch(context, 'DELETE', Delete);
    }

    protected _doFetch(
        context: AfterReturnContext<unknown, AnnotationType.METHOD>,
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
        this._processPathParams(context, request);
        this._processQueryParams(context, request);
        return this._fetch()(request.url, request);
    }

    protected _getPathParamTemplates(request: Request): PathParamTemplate[] {
        return [...request.url.matchAll(/\${(\w+?)}/gi)].map((r) => ({
            name: r[1],
            placeholder: r[0],
            value: undefined,
        }));
    }

    protected _processPathParams(context: AfterReturnContext, request: RequestLike): Request {
        const pathParamAnnotations = context.annotations.all(PathParam);
        const paramTemplates = this._getPathParamTemplates(request).reduce((params, param) => {
            params.set(param.name, param);
            return params;
        }, new Map<string, PathParamTemplate>());

        const namedPathParams: Record<string, AnnotationContext> = {};
        const positionalPathParams: AnnotationContext[] = [];

        // split named params & positional params
        pathParamAnnotations.forEach((annotation) => {
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

        const replacePathParam = (url: string, pathParamTemplate: PathParamTemplate, annotation: AnnotationContext) => {
            assert(pathParamTemplate || annotation);
            if (!pathParamAnnotations && !annotation) {
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
            return replaceAll(
                url,
                pathParamTemplate.placeholder,
                this._serializeAnnotatedValue(context.args[annotation.target.parameterIndex], annotation),
            );
        };

        // apply named @PathParams
        Object.entries(namedPathParams)
            .sort(([k1, p1], [k2, p2]) => p1.target.parameterIndex - p2.target.parameterIndex)
            .forEach(([k, v]) => {
                request.url = replacePathParam(request.url, paramTemplates.get(k), v);
                paramTemplates.delete(k);
            });

        // apply positionnal @PathParams
        const remainingParams = [...paramTemplates.values()];
        positionalPathParams
            .sort((p1, p2) => p1.target.parameterIndex - p2.target.parameterIndex)
            .forEach((p) => (request.url = replacePathParam(request.url, remainingParams.shift(), p)));
        if (remainingParams.length) {
            throw new AspectError(
                context,
                `Unbound ${PathParam.name} placeholders: ${remainingParams.map((p) => p.placeholder).join(', ')}`,
            );
        }

        return request;
    }

    protected _processQueryParams(context: AfterReturnContext, request: RequestLike): Request {
        // search @QueryParams on parameters
        const queryParamAnnotations = [...context.annotations.all(QueryParam)];

        // resolve @QueryParams values
        const queryParams = queryParamAnnotations.reduce((qps, annotation) => {
            const targetArg = annotation.target;
            const argValue = context.args[targetArg.parameterIndex];
            let nestedQueryParamAnnotations: readonly AnnotationContext[] = [];
            // search for nested @QueryParam
            if (typeof argValue === 'object') {
                nestedQueryParamAnnotations = ANNOTATIONS.at(LOCATION.of(argValue)).all(QueryParam);
            }
            if (nestedQueryParamAnnotations.length) {
                const rootName = this._serialize(annotation.args[0], () => undefined);
                nestedQueryParamAnnotations.forEach((a) => {
                    const name = [rootName, a.args[0]].filter((p) => !!p).join('.');
                    const strValue = this._serializeAnnotatedValue(a.args, a);
                    qps.unshift([name, strValue]);
                });
            } else {
                const name = this._serialize(annotation.args[0], () => {
                    throw new AspectError(context, `${QueryParam} on ${annotation.target} does not have a name`);
                });

                const strValue = this._serializeAnnotatedValue(
                    context.args[annotation.target.parameterIndex],
                    annotation,
                );

                qps.unshift([name, strValue]);
            }

            return qps;
        }, [] as [string, string][]);

        const url = new URL(request.url);
        const search = url.search.replace(/^\?/, '');
        const queryString = [search, new URLSearchParams(queryParams).toString()].filter((q) => !!q).join('&');
        url.search = queryString.length ? `?${queryString}` : '';
        request.url = url.toString();

        return request;
    }

    protected _serializeAnnotatedValue(value: unknown, annotation: AnnotationContext) {
        // get parameter value of the annotated argument
        return this._serialize(value, (s) => {
            console.warn(`${annotation} on ${annotation.target.label}: value resolved to ${s}`);
            return s;
        });
    }

    protected _serialize(obj: any, undefinedCb = (arg: any): any => {}): string {
        const strValue = `${obj}`;
        if (strValue === {}.toString() || strValue === 'undefined') {
            return undefinedCb(strValue);
        }

        return strValue;
    }

    protected _createRequest(method: string, requestTemplates: Request[]): RequestLike {
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
