import { Get } from './get.annotation';

describe('@Get() annotation', () => {
    class FetchResource {
        @Get('/')
        getUser() {}
    }
});
