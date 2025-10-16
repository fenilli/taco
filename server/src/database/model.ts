import { query, QueryResultRow } from '#/database';

export abstract class Model<T extends QueryResultRow> {
    protected abstract table: string;
    protected abstract primaryKey: string;

    async findById(id: number): Promise<T | null> {
        const queryStr = `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = $1`;
        const result = await query<T>(queryStr, [id]);

        return result.rows[0] || null;
    }

    async findAll(): Promise<T[]> {
        const queryStr = `SELECT * FROM ${this.table}`;
        const result = await query<T>(queryStr);

        return result.rows;
    }
};
