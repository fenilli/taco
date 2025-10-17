import bcrypt from 'bcrypt';

import { User, UserEntity } from './user.model';

type CreateUserData = Omit<UserEntity, 'user_id' | 'created_at' | 'updated_at'>;

export const UserService = {
    findById: async (user_id: number) => User.findOne({ user_id }),
    findByEmail: async (email: string) => User.findOne({ email }),
    create: async (data: CreateUserData) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return User.create({ email: data.email, password: hashedPassword });
    },
};
