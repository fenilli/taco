import { query } from '#/database';
import { Model } from '#/database/model';
import date from '#/utils/date.utils';

export interface SessionEntity {
    session_id: number;
    user_id: number;
    user_agent?: string;
    created_at: Date;
    expires_at: Date;
};

export type CreateSessionData = Omit<SessionEntity, 'session_id' | 'created_at' | 'expires_at'>;
export type UpdateSessionData = Partial<Pick<SessionEntity, 'user_agent' | 'expires_at'>>;

class SessionModel extends Model<SessionEntity> {
    protected table = 'sessions';
    protected primaryKey = 'session_id';

    async create({ user_id, user_agent }: CreateSessionData): Promise<SessionEntity> {
        const queryStr = `
        INSERT INTO ${this.table} (user_id, user_agent, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *
        `;

        const values = [user_id, user_agent || 'unknown', date.add(date.now(), { days: 30 })];

        const result = await query<SessionEntity>(queryStr, values);

        if (result.rows.length === 0) throw new Error('Failed to create session record.');

        return result.rows[0];
    }

    async update(sessionId: number, data: UpdateSessionData): Promise<SessionEntity | null> {
        const keys = Object.keys(data);

        if (keys.length === 0) return await this.findById(sessionId);

        const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        const values = Object.values(data);
        values.push(sessionId.toString());

        const primaryKeyIndex = keys.length + 1;

        const queryStr = `
        UPDATE ${this.table}
        SET ${setClauses}
        WHERE ${this.primaryKey} = $${primaryKeyIndex}
        RETURNING *;
        `;

        const result = await query<SessionEntity>(queryStr, values);

        if (result.rows.length === 0) throw new Error('Failed to update session record.');

        return result.rows[0];
    }

    async delete(id: number): Promise<boolean> {
        const { rowCount } = await query(
            `DELETE FROM ${this.table} WHERE ${this.primaryKey as string} = $1`,
            [id],
        );

        return !!rowCount && rowCount > 0;
    }
}

export const Session = new SessionModel();
