import { RequestHandler } from 'express';

import { HttpStatus } from '#/constants';
import { NotFoundError } from '#/error/http.error';
import { omit } from '#/utils/object.utils';
import { UserService } from './user.service';

export const getUserHandler: RequestHandler = async (req, res) => {
    const user = await UserService.findById(req.user_id);
    if (!user) throw new NotFoundError('User not found.');

    return res.status(HttpStatus.Ok).json({ user: omit(user, ['password']) });
};
