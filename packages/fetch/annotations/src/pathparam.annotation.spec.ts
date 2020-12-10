import { FetchMockStatic } from 'fetch-mock';
import { setupFetchAspect } from '../../testing/helpers';
import { Get } from '../public_api';
import { PathParam } from './pathparam.annotation';
import { FetchAspectOptions } from './types';

describe(`calling a ${Get} method`, () => {
    let options: FetchAspectOptions;
    let fetch: FetchMockStatic;
    beforeEach(() => {
        options = setupFetchAspect();
        fetch = options.fetchAdapter as any;
    });
    describe(`that have ${PathParam}() parameters`, () => {
        describe('and an URL with the right number ${placeholder}', () => {
            it('should replace one ${placeholder} with one param value', () => {
                class X {
                    @Get('/api/users/${id}/books')
                    get(@PathParam() param: number): Promise<Response> {
                        return;
                    }
                }

                new X().get(1);
                expect(fetch.calls().length).toBeGreaterThan(0);
                expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users/1/books');
            });

            it(`should replace all \${placeholder} with all ${PathParam}() values`, () => {
                class X {
                    @Get('/api/users/${id}/books/${bookId}')
                    get(@PathParam() id: number, @PathParam() isbn: string): Promise<Response> {
                        return;
                    }
                }

                new X().get(1, '978-2-7654');
                expect(fetch.calls().length).toBeGreaterThan(0);
                expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users/1/books/978-2-7654');
            });
        });

        describe(`and has more \${placeholder} than ${PathParam}() parameter`, () => {
            it('should throw an error', () => {
                class X {
                    @Get('/api/users/${id}/books/${bookId}')
                    get(@PathParam() id: number, isbn: string): Promise<Response> {
                        return;
                    }
                }

                expect(() => new X().get(1, '978-2-7654')).toThrow(
                    new Error(
                        'Error applying advice @AfterReturn(@Get) FetchAspect._doGet() on method "X.get": Unbound PathParam placeholders: ${bookId}',
                    ),
                );
            });
        });
        describe(`and has less \${placeholder} than ${PathParam}() parameter`, () => {
            it('should throw an error', () => {
                class X {
                    @Get('/api/users/1/books/978-2-7654')
                    get(@PathParam() id: number, isbn: string): Promise<Response> {
                        return;
                    }
                }

                expect(() => new X().get(1, '978-2-7654')).toThrow(
                    new Error(
                        'Error applying advice @AfterReturn(@Get) FetchAspect._doGet() on method "X.get": Unbound @PathParam() on parameter "X.get(#0)"',
                    ),
                );
            });
        });
    });

    describe(`that have ${PathParam}("param") parameters`, () => {
        describe('and an URL with the right ${placeholders}', () => {
            it(`'should replace one \${placeholder} with the proper ${PathParam}('param') value`, () => {
                class X {
                    @Get('/api/users/${id}/books')
                    get(@PathParam('id') param: number): Promise<Response> {
                        return;
                    }
                }

                new X().get(1);
                expect(fetch.calls().length).toBeGreaterThan(0);
                expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users/1/books');
            });

            it(`should replace all \${placeholder} with their proper ${PathParam}('param') values`, () => {
                class X {
                    @Get('/api/users/${id}/books/${bookId}')
                    get(@PathParam('bookId') isbn: string, @PathParam('id') id: number): Promise<Response> {
                        return;
                    }
                }

                new X().get('978-2-7654', 1);
                expect(fetch.calls().length).toBeGreaterThan(0);
                expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users/1/books/978-2-7654');
            });
        });

        describe(`and has not the \${placeholder} matching ${PathParam}('param') parameter`, () => {
            it('should throw an error', () => {
                class X {
                    @Get('/api/users/${id}/books/${bookId}')
                    get(@PathParam('xx') id: number, @PathParam('yy') isbn: string): Promise<Response> {
                        return;
                    }
                }

                expect(() => new X().get(1, '978-2-7654')).toThrow(
                    new Error(
                        'Error applying advice @AfterReturn(@Get) FetchAspect._doGet() on method "X.get": Unbound @PathParam(xx) on parameter "X.get(#0)"',
                    ),
                );
            });
        });
    });

    describe(`that have both ${PathParam}() & ${PathParam}("param") parameters`, () => {
        it(`should apply ${PathParam} then ${PathParam}('param')`, () => {
            class X {
                @Get('/api/${userResource}/${userId}/${booksResource}/${bookId}')
                get(
                    @PathParam() userResources: 'users',
                    @PathParam('userId') userId: number,
                    @PathParam('booksResource') books: 'books',
                    @PathParam() bookId: string,
                ): Promise<Response> {
                    return;
                }
            }

            new X().get('users', 1, 'books', '978-2-7654');
            expect(fetch.calls().length).toBeGreaterThan(0);
            expect(fetch.calls()[0][0]).toEqual('http://my-company.com/api/users/1/books/978-2-7654');
        });
    });
});
