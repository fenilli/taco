import { Pool, PoolClient, QueryConfig, QueryConfigValues, QueryResult, QueryResultRow } from 'pg';

import config from '#config';

class Database {
    private static instance: Database;
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: config.get('db.host'),
            port: config.get('db.port'),
            database: config.get('db.database'),
            user: config.get('db.username'),
            password: config.get('db.password'),
        });

        this.pool.on('error', (err) => {
            console.error('Unexpected database error:', err);
            process.exit(1);
        });
    }

    static getInstance(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    async query<R extends QueryResultRow = any, I = any[]>(queryTextOrConfig: string | QueryConfig<I>, values?: QueryConfigValues<I>,): Promise<QueryResult<R>> {
        return this.pool.query<R, I>(queryTextOrConfig, values);
    }

    async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');
            const result = await fn(client);
            await client.query('COMMIT');

            return result;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
};

export default Database.getInstance();