import bcrypt from 'bcrypt';

import { User, UserEntity, CreateUserData } from './user.model';

export const createUser = async (data: CreateUserData) => {
    return User.create({ email: data.email, password: await bcrypt.hash(data.password, 10) });
};

export const findUserByEmail = async (email: string): Promise<UserEntity | null> => {
    return User.findOneByEmail(email);
};
