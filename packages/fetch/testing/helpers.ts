import fetchMock from 'fetch-mock';

import { FetchAspectOptions } from '../annotations/src/types';
import { setupTestingWeaverContext } from '@aspectjs/core/testing';

import { FetchAspect } from '../src/fetch.aspect';
import { Delete, Get, Patch, Post, Put } from '../annotations/public_api';

const ALL_HTTP_ANNOTATIONS = [Get, Post, Put, Delete, Patch];

export function setupFetchAspect(options?: Partial<FetchAspectOptions>): FetchAspectOptions {
    options = options ?? {};
    options.url = options.url ?? 'http://my-company.com';
    options.fetchAdapter = options.fetchAdapter ?? _setupFetchMock(`${options.url}`);

    setupTestingWeaverContext(new FetchAspect(options as any));

    return options as FetchAspectOptions;
}

function _setupFetchMock(baseUrl: string): typeof fetch {
    let fetch = fetchMock
        .sandbox()
        .mock(
            {
                url: baseUrl,
            },
            {
                status: 404,
            },
        )
        .mock(
            {
                url: /\/api$/,
            },
            {
                status: 404,
            },
        )
        .mock(
            {
                method: 'get',
                url: /\/api\/users$/,
            },
            {
                status: 200,
                body: {
                    content: _generateUsers(),
                },
            },
        )
        .mock(
            {
                method: 'get',
                url: /\/api\/users\/\d+$/,
            },
            {
                status: 200,
                body: {
                    content: _generateUsers()[0],
                },
            },
        )
        .mock(
            {
                method: 'get',
                url: /\/api\/users\/\d+\/books$/,
            },
            {
                status: 200,
                body: {
                    content: _generateBooks(),
                },
            },
        )
        .mock(
            {
                method: 'get',
                url: /\/api\/users\/\d+\/books\/(\w|-)+$/,
            },
            {
                status: 200,
                body: {
                    content: _generateBooks(),
                },
            },
        );

    ALL_HTTP_ANNOTATIONS.map((a) => a.name.toLocaleLowerCase())
        .filter((m) => m !== 'get')
        .forEach((method) => {
            fetch = fetch.mock(
                {
                    method,
                    url: /\/api\/users$/,
                },
                {
                    status: 200,
                },
            );
        });

    return fetch;
}

export interface FetchResource {
    get?(...args: any[]): Promise<unknown>;
    post?(...args: any[]): Promise<unknown>;
    put?(...args: any[]): Promise<unknown>;
    delete?(...args: any[]): Promise<unknown>;
    patch?(...args: any[]): Promise<unknown>;
}

function _generateUsers() {
    return [...Array(10).keys()].map((i) => ({
        firstName: `user_${i}`,
        lastName: `USER_${i}`,
        id: i,
    }));
}

function _generateBooks() {
    return [...Array(10).keys()].map((i) => ({
        title: `book_${i}`,
        author: `Author_${i}`,
        id: i,
        isbn: `isbn_${i}`,
    }));
}
