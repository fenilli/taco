import { bootstrap } from './bootstrap/app';
import config from '#config';

const app = await bootstrap();
app.listen(config.get('app.port'), () => {
    console.log(`Server running at ${config.get('app.url')}:${config.get('app.port')}`);
});