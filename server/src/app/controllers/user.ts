import { Request, Response } from 'express';
import { UserError } from '#app/errors/user-error';
import { UserService } from '#app/services/user';
import { ObjectUtils } from '#utils/object';
import { HttpStatus } from '#constants';

export const UserController = {
    me: async (req: Request, res: Response) => {
        const user = await UserService.findOneById(req.userId);
        if (!user) throw UserError.NotFound(req.userId);

        return res.status(HttpStatus.OK).json({ user: ObjectUtils.omit(user, ['password']) });
    },
};
