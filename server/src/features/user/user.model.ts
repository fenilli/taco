import { query } from '#/database';
import { Model } from '#/database/model';

export interface UserEntity {
    user_id: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
};

export type CreateUserData = Omit<UserEntity, 'user_id' | 'created_at' | 'updated_at'>;

class UserModel extends Model<UserEntity> {
    protected table = 'users';
    protected primaryKey = 'user_id';

    async create({ email, password }: CreateUserData): Promise<UserEntity> {
        const queryStr = `
            INSERT INTO ${this.table} (email, password)
            VALUES ($1, $2)
            RETURNING *
            `;

        const values = [email, password];

        const result = await query<UserEntity>(queryStr, values);

        if (result.rows.length === 0) throw new Error('Failed to create user record.');

        return result.rows[0];
    }

    async findOneByEmail(email: string): Promise<UserEntity | null> {
        const queryStr = `SELECT * FROM ${this.table} WHERE email = $1`;
        const result = await query<UserEntity>(queryStr, [email]);
        return result.rows[0] || null;
    }
}

export const User = new UserModel();
