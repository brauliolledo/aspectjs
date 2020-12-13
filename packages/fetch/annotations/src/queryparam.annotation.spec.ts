import { FetchMockStatic } from 'fetch-mock';
import { setupFetchAspect } from '../../testing/helpers';
import { Get, QueryParam } from '../public_api';
import { FetchAspectOptions } from './types';

describe(`calling a ${Get} method`, () => {
    let options: FetchAspectOptions;
    let fetch: FetchMockStatic;
    beforeEach(() => {
        options = setupFetchAspect();
        fetch = options.fetchAdapter as any;
    });
    describe(`that have one ${QueryParam}("search") parameter`, () => {
        it('should append query parameter to the url using the parameter name=value', () => {
            class X {
                @Get('/api/users')
                get(@QueryParam('search') search: string): Promise<Response> {
                    return;
                }
            }

            new X().get('joe');
            expect(fetch.calls().length).toBeGreaterThan(0);
            expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users?search=joe');
        });

        it('should not conflict with already existing query params', () => {
            class X {
                @Get('/api/users?search=jack')
                get(@QueryParam('search') search: string): Promise<Response> {
                    return;
                }
            }

            new X().get('joe');
            expect(fetch.calls().length).toBeGreaterThan(0);
            expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users?search=jack&search=joe');
        });
    });
    describe(`that have multiple ${QueryParam}("search") parameter`, () => {
        it('should append query parameters to the url', () => {
            class X {
                @Get('/api/users')
                get(
                    @QueryParam('name') search: string,
                    @QueryParam('name') search2: string,
                    @QueryParam('lastname') lastname: string,
                ): Promise<Response> {
                    return;
                }
            }

            new X().get('joe', 'jack', 'dalton');
            expect(fetch.calls().length).toBeGreaterThan(0);
            expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users?name=joe&name=jack&lastname=dalton');
        });
    });

    describe(`that have one ${QueryParam}() parameter that have ${QueryParam}("search") attributes`, () => {
        let user: any;
        beforeEach(() => {
            class User {
                @QueryParam('name') public name: string;
                @QueryParam('lastName') public lastName: string;
                constructor(name: string, lastName: string) {
                    this.name = name;
                    this.lastName = lastName;
                }
            }
            user = new User('joe', 'dalton');
        });
        xit('should append query parameters to the url', () => {
            class X {
                @Get('/api/users')
                get(@QueryParam() user: any): Promise<Response> {
                    return;
                }
            }

            new X().get(user);

            expect(fetch.calls().length).toBeGreaterThan(0);
            expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users?name=joe&lastname=dalton');
        });
    });
    xdescribe(`that have one ${QueryParam}('user') parameter that have ${QueryParam}("search") attributes`, () => {
        let user: any;
        beforeEach(() => {
            class User {
                @QueryParam('name') public name: string;
                @QueryParam('lastName') public lastName: string;
                constructor(name: string, lastName: string) {
                    this.name = name;
                    this.lastName = lastName;
                }
            }
            user = new User('joe', 'dalton');
        });
        it('should append query parameters to the url', () => {
            class X {
                @Get('/api/users')
                get(@QueryParam('user') user: any): Promise<Response> {
                    return;
                }
            }

            new X().get(user);

            expect(fetch.calls().length).toBeGreaterThan(0);
            expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users?user.name=joe&user.lastname=dalton');
        });
    });
});
