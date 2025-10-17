import z from 'zod';
import { RequestHandler } from 'express';

import { HttpStatus } from '#/constants';
import { HttpError } from '#/errors/http.error';
import { pick } from '#/utils/object.utils';
import { SessionService } from './session.service';
import { clearAuthCookies } from '#/features/auth/auth.utils';

export const getSessionsHandler: RequestHandler = async (req, res) => {
    const sessions = await SessionService.findActiveByUserId(req.user_id);

    return res.status(HttpStatus.Ok).json({
        sessions: sessions.map((session) => ({
            ...pick(session, ['session_id', 'user_agent', 'expires_at']),
            ...(session.session_id === req.session_id && { isCurrent: true })
        }))
    });
};

export const deleteSessionHandler: RequestHandler = async (req, res) => {
    const sessionId = z.coerce.number().parse(req.params.id);

    const deleteds = await SessionService.delete({
        session_id: sessionId,
        user_id: req.user_id,
    });

    if (deleteds === 0) throw new HttpError('Session not found.', HttpStatus.NotFound);

    if (sessionId === req.session_id) clearAuthCookies(res);

    return res.status(HttpStatus.Ok).json({ message: 'Session removed.' });
};
