import { Model } from '#app/models/model';

export interface UserEntity {
    user_id: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
};

class UserModel extends Model<UserEntity> {
    protected table = 'users';
    protected primaryKey = 'user_id';
}

export const User = new UserModel();
