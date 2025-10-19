import { EnvUtils } from '#utils/env';

export const app = {
    env: EnvUtils.get('APP_ENV', 'prod') as 'dev' | 'prod',
    clientOrigin: EnvUtils.get('CLIENT_ORIGIN', 'http://client.localhost'),
};
