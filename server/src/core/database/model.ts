import db from '#core/database';

export abstract class Model<T extends Record<string, any>> {
    protected abstract table: string;
    protected abstract primaryKey: string;

    omit<H extends keyof T>(rowOrRows: T | T[], fields: H[]): Omit<T, H> | Omit<T, H>[] {
        const omitField = (row: T, fields: H[]): Omit<T, H> => {
            const clone = { ...row };

            for (const field of fields) delete clone[field as string];
            return clone as Omit<T, H>;
        };

        if (!Array.isArray(rowOrRows)) return omitField(rowOrRows, fields);

        return rowOrRows.map((row) => {
            const clone = { ...row };

            for (const field of fields) delete clone[field as string];
            return clone as Omit<T, H>;
        });
    }

    async all(): Promise<T[]> {
        const { rows } = await db.query<T>(`SELECT * from ${this.table}`);

        return rows;
    }

    async findBy(where: Partial<T>, limit = 0): Promise<T[] | null> {
        const keys = Object.keys(where);
        if (keys.length === 0) throw new Error('findBy requires at least one field to query');

        const values = Object.values(where);
        const conditions = keys.map((k, i) => `${k} = $${i + 1}`).join(' AND ');

        let sql = `SELECT * FROM ${this.table} WHERE ${conditions}`;
        if (limit > 0) sql += ` LIMIT ${limit}`;

        try {
            const { rows } = await db.query<T>(sql, values);

            return rows;
        } catch (_) {
            return null;
        }
    }

    async findOne(where: Partial<T>): Promise<T | null> {
        const results = await this.findBy(where, 1);

        return results?.[0] ?? null;
    }

    async findById(id: number): Promise<T | null> {
        return this.findOne({ [this.primaryKey]: id } as any);
    }

    async create(data: Partial<T>): Promise<T> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const { rows } = await db.query<T>(
            `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values,
        );

        return rows[0];
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        const keys = Object.keys(data);
        if (keys.length === 0) return this.findById(id);

        const values = Object.values(data);
        const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const pkPlaceholderIndex = values.length + 1;

        const { rows } = await db.query<T>(
            `UPDATE ${this.table} SET ${setClauses} WHERE ${this.primaryKey as string} = $${pkPlaceholderIndex} RETURNING *`,
            [...values, id],
        );

        return rows.length > 0 ? rows[0] : null;
    }

    async delete(id: number): Promise<boolean> {
        const { rowCount } = await db.query(
            `DELETE FROM ${this.table} WHERE ${this.primaryKey as string} = $1`,
            [id],
        );

        return !!rowCount && rowCount > 0;
    }
}