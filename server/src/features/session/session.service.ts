import { Session, SessionEntity } from './session.model';
import date from '#/utils/date.utils';

type CreateSessionData = Omit<SessionEntity, 'session_id' | 'created_at' | 'expires_at'>;
type UpdateSessionData = Partial<Pick<SessionEntity, 'user_agent' | 'expires_at'>>;

export const SessionService = {
    findAllById: async (session_id: number) => Session.find({ session_id }),
    findById: async (session_id: number) => Session.findOne({ session_id }),
    findActiveByUserId: async (user_id: number) => Session.find({ user_id, expires_at: { gt: date.now() } }),
    create: async (data: CreateSessionData) => {
        const thirtyDaysFromNow = date.add(date.now(), { days: 30 });
        return Session.create({ user_id: data.user_id, user_agent: data.user_agent, expires_at: thirtyDaysFromNow });
    },
    update: async (session_id: number, data: UpdateSessionData) => Session.update({ session_id }, data),
    delete: (...args: Parameters<typeof Session.delete>) => Session.delete(...args),
};
