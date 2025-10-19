import bcrypt from 'bcrypt';
import { User, UserEntity } from '#app/models/user';

type CreateUserData = Omit<UserEntity, 'user_id' | 'created_at' | 'updated_at'>;

export const UserService = {
    findOneById: async (id: number) => User.findOne({ user_id: id }),
    findOneByEmail: async (email: string) => User.findOne({ email }),

    create: async ({ email, password }: CreateUserData) => {
        return User.create({ email, password: await bcrypt.hash(password, 10) });
    },
};
