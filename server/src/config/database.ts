import { EnvUtils } from '#utils/env';

export const database = {
    host: EnvUtils.get('DB_HOST'),
    username: EnvUtils.get('DB_USERNAME'),
    password: EnvUtils.get('DB_PASSWORD'),
    name: EnvUtils.get('DB_NAME')
};
