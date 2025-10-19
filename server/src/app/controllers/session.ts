import z from 'zod';
import { Request, Response } from 'express';
import { SessionError } from '#app/errors/session-error';
import { SessionService } from '#app/services/session';
import { ObjectUtils } from '#utils/object';
import { AuthCookieUtils } from '#utils/auth/cookie';
import { HttpStatus } from '#constants';

export const SessionController = {
    index: async (req: Request, res: Response) => {
        const sessions = (await SessionService.findActiveByUserId(req.userId)).map((session) => ({
            ...ObjectUtils.pick(session, ['session_id', 'user_agent', 'expires_at']),
            ...(session.session_id === req.sessionId && { is_current: true }),
        }));

        return res.status(HttpStatus.OK).json({ sessions });
    },

    destroy: async (req: Request, res: Response) => {
        const sessionId = z.coerce.number().parse(req.params.id);

        const deleted = await SessionService.deleteById(sessionId, req.userId);
        if (deleted === 0) throw SessionError.NotFound(sessionId);

        if (sessionId === req.sessionId) AuthCookieUtils.clearAuthTokens(res);

        return res.status(HttpStatus.OK).json({ message: 'Session cleared' });
    },
};
