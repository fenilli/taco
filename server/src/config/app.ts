import { EnvUtils } from '#utils/env';

export const app = {
    env: EnvUtils.get('APP_ENV', 'prod') as 'dev' | 'prod',
    url: EnvUtils.get('APP_URL', 'http://localhost')
};
