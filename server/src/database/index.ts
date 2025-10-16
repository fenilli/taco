import { Pool, QueryResult, QueryResultRow } from 'pg';

import config from '#/config';

const pool = new Pool({
    connectionString: config.db.uri,
});

export const query = async <T extends QueryResultRow>(query: string, params: any[] = []): Promise<QueryResult<T>> => {
    return pool.query(query, params);
};

export const connect = async (): Promise<void> => {
    try {
        await pool.query('SELECT NOW()');
        console.info('DB Connected successfully.')
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
};

export type { QueryResultRow };
