import { FetchMockStatic } from 'fetch-mock';
import { FetchResource, setupFetchAspect } from '../../testing/helpers';
import { Delete, Get, Patch, Post, Put } from '../public_api';
import { FetchClient } from './fetch-client.annotation';
import { FetchAspectOptions } from './types';

const BASE_URL = 'http://my-company.com';

// Common tests case for all fetch methods
// TODO test @Get(RequestInit)
// TODO test @PathParam
// TODO test @QueryParam
// TODO test @QueryParams
// TODO test @Headers
// TODO test @Body
// TODO test @Mapper
export function fetchMethodCommonTest(
    methodAnnotation: typeof Get | typeof Post | typeof Put | typeof Patch | typeof Delete,
) {
    let resource: FetchResource;
    let fetchAdapter: FetchMockStatic;
    let options: FetchAspectOptions;

    describe('calling a method', () => {
        beforeEach(() => {
            options = { url: BASE_URL } as any;
            setupFetchAspect(options);
            fetchAdapter = options.fetchAdapter as any;
            fetchAdapter.resetHistory();
        });

        const method: keyof FetchResource = methodAnnotation.name.toLocaleLowerCase() as any;

        describe(`annotated with ${methodAnnotation}()`, () => {
            describe(`when the class has no ${FetchClient}(<string>) annotation`, () => {
                beforeEach(() => {
                    class FetchResourceImpl implements FetchResource {
                        @((methodAnnotation as any)())
                        [method](): Promise<unknown> {
                            return;
                        }
                    }

                    resource = new FetchResourceImpl();
                });

                it(`should issue an http ${method.toUpperCase()} on ${BASE_URL}`, () => {
                    resource[method]();
                    expect(
                        fetchAdapter.called(options.url, {
                            method,
                        }),
                    ).toBeTrue();
                });
            });

            describe(`when the class has a ${FetchClient}() annotation`, () => {
                beforeEach(() => {
                    @FetchClient()
                    class FetchResourceImpl implements FetchResource {
                        @((methodAnnotation as any)())
                        [method](): Promise<unknown> {
                            return;
                        }
                    }

                    resource = new FetchResourceImpl();
                });

                it(`should issue an http ${method.toUpperCase()} on ${BASE_URL}`, () => {
                    resource[method]();
                    expect(
                        fetchAdapter.called(options.url, {
                            method,
                        }),
                    ).toBeTrue();
                });
            });

            describe(`when the class has a ${FetchClient}(/api) annotation`, () => {
                beforeEach(() => {
                    @FetchClient('/api')
                    class FetchResourceImpl implements FetchResource {
                        @((methodAnnotation as any)())
                        [method](): Promise<unknown> {
                            return;
                        }
                    }

                    resource = new FetchResourceImpl();
                });

                it(`should issue an http ${method.toUpperCase()} on ${BASE_URL}/api`, () => {
                    resource[method]();
                    expect(
                        fetchAdapter.called(`${options.url}/api`, {
                            method,
                        }),
                    ).toBeTrue();
                });
            });
            describe(`when the class has a ${FetchClient}(Request) annotation`, () => {
                beforeEach(() => {
                    @FetchClient({
                        url: 'api',
                    })
                    class FetchResourceImpl implements FetchResource {
                        @((methodAnnotation as any)())
                        [method](): Promise<unknown> {
                            return;
                        }
                    }

                    resource = new FetchResourceImpl();
                });

                it(`should issue an http ${method.toUpperCase()} on ${BASE_URL}/api`, () => {
                    resource[method]();
                    expect(
                        fetchAdapter.called(`${options.url}/api`, {
                            method,
                        }),
                    ).toBeTrue();
                });
            });
        });

        ['/api/users', 'api/users'].forEach((RESOURCE_PATH) => {
            describe(`annotated with ${methodAnnotation}(${RESOURCE_PATH})`, () => {
                const resourceUrl = `${BASE_URL}/api/users`;
                beforeEach(() => {
                    class FetchResourceImpl implements FetchResource {
                        @((methodAnnotation as any)(RESOURCE_PATH))
                        [method](): Promise<unknown> {
                            return;
                        }
                    }

                    resource = new FetchResourceImpl();
                });

                it(`should issue an http ${method.toUpperCase()} on ${resourceUrl}`, () => {
                    resource[method]();
                    expect(fetchAdapter.called(resourceUrl)).toBeTrue();
                });
            });
        });
    });
}
