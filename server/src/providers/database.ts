import { Pool, type QueryResultRow } from 'pg';
import { Config } from '#config';

export const Database = new Pool({
    host: Config.database.host,
    user: Config.database.username,
    password: Config.database.password,
    database: Config.database.name,
});

Database.query('SELECT 1').catch(err => {
    console.error('DB connection failed:', err);

    process.exit(1);
});

export type { QueryResultRow };
