import { query, QueryResultRow } from '#/database';

type Operator =
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'like';

type ConditionValue =
    | string
    | number
    | boolean
    | null
    | Date
    | ConditionOperators;

type ConditionOperators = {
    [K in Operator]?: ConditionValue | ConditionValue[];
};

type Where<T> = {
    [K in keyof T]?: T[K] | ConditionOperators;
};

type LogicGroup<T> = {
    AND?: (Where<T> | LogicGroup<T>)[];
    OR?: (Where<T> | LogicGroup<T>)[];
};

type Filter<T> = Where<T> | LogicGroup<T>;

export abstract class Model<T extends QueryResultRow> {
    protected abstract table: string;
    protected abstract primaryKey: string;

    private mapOperator(op: Operator): string {
        switch (op) {
            case 'eq': return '=';
            case 'ne': return '!=';
            case 'gt': return '>';
            case 'gte': return '>=';
            case 'lt': return '<';
            case 'lte': return '<=';
            case 'in': return 'IN';
            case 'nin': return 'NOT IN';
            case 'like': return 'LIKE';
            default: throw new SyntaxError(`Unknown operator ${op}`);
        }
    }

    private buildWhereClause(filter: Filter<T>, startIndex = 1): { sql: string; values: any[] } {
        if (Object.keys(filter).length === 0) return { sql: '', values: [] };

        const values: any[] = [];
        let i = startIndex;

        const build = (node: Filter<T>): string => {
            if ('OR' in node || 'AND' in node) {
                const key = 'OR' in node ? 'OR' : 'AND';
                const subNodes = (node as LogicGroup<T>)[key];
                if (!Array.isArray(subNodes)) return '1=1';

                const parts = subNodes.map((sub) => `(${build(sub)})`);
                return parts.join(` ${key} `);
            }

            const parts: string[] = [];
            for (const [field, value] of Object.entries(node as Where<T>)) {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    for (const [op, opVal] of Object.entries(value)) {
                        const operator = this.mapOperator(op as Operator);
                        parts.push(`${field} ${operator} $${i++}`);
                        values.push(opVal);
                    }
                } else {
                    parts.push(`${field} = $${i++}`);
                    values.push(value);
                }
            }

            return parts.join(' AND ');
        };

        const sql = `WHERE ${build(filter)}`;

        return { sql, values };
    }

    async all(): Promise<T[]> {
        const queryStr = `SELECT * FROM ${this.table}`;
        const result = await query<T>(queryStr);

        return result.rows;
    }

    async find(filter: Filter<T>): Promise<T[]> {
        const { sql, values } = this.buildWhereClause(filter);

        const queryStr = `SELECT * FROM ${this.table} ${sql}`;
        const result = await query<T>(queryStr, values);

        return result.rows;
    }

    async findOne(filter: Filter<T>): Promise<T | null> {
        const { sql, values } = this.buildWhereClause(filter);

        const queryStr = `SELECT * FROM ${this.table} ${sql} LIMIT 1`;
        const result = await query<T>(queryStr, values);

        return result.rows[0] ?? null;
    }

    async create(data: Partial<T>): Promise<T> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const queryStr = `
            INSERT INTO ${this.table} (${keys.join(', ')})
            VALUES (${placeholders})
            RETURNING *`;
        const result = await query<T>(queryStr, values);

        return result.rows[0];
    }

    async update(filter: Filter<T>, data: Partial<T>): Promise<number> {
        const setKeys = Object.keys(data);
        const setValues = Object.values(data);
        const setClause = setKeys.map((k, i) => `${k} = $${i + 1}`).join(', ');

        const { sql, values } = this.buildWhereClause(filter, setKeys.length + 1);
        const queryStr = `
            UPDATE ${this.table}
            SET ${setClause}
            ${sql}`;
        const result = await query(queryStr, [...setValues, ...values]);

        return result.rowCount ?? 0;
    }

    async delete(filter: Filter<T>): Promise<number> {
        const { sql, values } = this.buildWhereClause(filter);

        const queryStr = `DELETE FROM ${this.table} ${sql}`;
        const result = await query(queryStr, values);

        return result.rowCount ?? 0;
    }
};
