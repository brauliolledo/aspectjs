import { FetchMockStatic } from 'fetch-mock';
import fetchMock from 'fetch-mock';

import { Get } from '../annotations/public_api';
import { FetchAspectOptions } from '../annotations/src/types';
import { setupFetchAspect } from '../testing/helpers';

describe('FetchAspect', () => {
    let options: FetchAspectOptions;
    function fetchAdapter(): FetchMockStatic {
        return options.fetchAdapter as any;
    }

    beforeEach(() => {
        options = {} as FetchAspectOptions;
    });

    describe('given "options.fetchAdapter" parameter', () => {
        it('should use that fetch as an implementation', () => {
            setupFetchAspect(options);
            expect(fetchAdapter()).toBeDefined();

            class X {
                @Get()
                get() {}
            }

            expect(fetchAdapter().called()).toBeFalse();
            new X().get();
            expect(fetchAdapter().called()).toBeTrue();
        });
    });

    describe('given no "options.fetchAdapter" parameter', () => {
        beforeEach(() => {
            fetchMock.mock('*', 200);
        });

        afterEach(() => {
            fetchMock.restore();
        });
        it('should use that fetch as an implementation', async () => {
            setupFetchAspect(options);
            delete options.fetchAdapter;
            expect(fetchAdapter()).toBeUndefined();

            class X {
                @Get()
                get(): Promise<Response> {
                    return;
                }
            }

            expect(fetchMock.called()).toBeFalse();
            await new X().get();
            expect(fetchMock.called()).toBeTrue();
        });
    });
});
