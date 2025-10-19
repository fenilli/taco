import { Session, SessionEntity } from '#app/models/session';
import { DateUtils } from '#utils/date';

type CreateSessionData = Omit<SessionEntity, 'session_id' | 'created_at'>;
type UpdateSessionData = Pick<SessionEntity, 'user_agent' | 'expires_at'>;

export const SessionService = {
    findById: async (id: number) => Session.findOne({ session_id: id }),
    findActiveByUserId: async (user_id: number) => Session.find({ user_id, expires_at: { gt: DateUtils.now() } }),

    create: async ({ user_id, user_agent, expires_at }: CreateSessionData) => Session.create({ user_id, user_agent, expires_at }),

    update: async (id: number, data: UpdateSessionData) => Session.update({ session_id: id }, data),

    deleteById: async (id: number, userId: number) => Session.delete({ session_id: id, user_id: userId }),
};
