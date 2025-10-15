import { Model } from "#lib/model";

export interface UserEntity {
    user_id: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

class UserModel extends Model<UserEntity, 'user_id'> {
    protected table = 'users';
    protected primaryKey = 'user_id' as const;
};

export const User = new UserModel();