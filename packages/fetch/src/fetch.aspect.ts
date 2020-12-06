import { AfterReturn, Aspect } from '@aspectjs/core/annotations';
import { AfterContext, AnnotationType, on } from '@aspectjs/core/commons';
import { Delete, FetchAnnotationType, FetchClient, Get, Patch, Post, Put } from '@aspectjs/fetch/annotations';
import { FetchAspectOptions } from 'fetch/annotations/src/types';

@Aspect()
export class FetchAspect {
    constructor(private options?: FetchAspectOptions) {}

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
            ...[context.annotations.onClass(FetchClient)[0], context.annotations.onSelf(annotation)[0]]
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
        return this.options.fetchAdapter.bind(this.options.fetchAdapter)(request.url, request);
    }

    protected _createRequest(method: string, requestTemplates: Request[]): Request {
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

        // const { requestHandlers, responseHandlers, fetchAdapter, ...request } = this.options;
        (request as RequestInit).method = method;
        return request as Request;
    }
}
