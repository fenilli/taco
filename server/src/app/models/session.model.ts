import { Model } from "#lib/model";

export interface SessionEntity {
    session_id: number;
    user_id: number;
    user_agent: string;
    created_at: Date;
    expires_at: Date;
}

class SessionModel extends Model<SessionEntity, 'session_id'> {
    protected table = 'sessions';
    protected primaryKey = 'session_id' as const;
};

export const Session = new SessionModel();