import { Model } from '#core/database/model';

export interface SessionEntity {
    session_id: number;
    user_id: number;
    user_agent: string;
    created_at: Date;
    expires_at: Date;
}

class SessionModel extends Model<SessionEntity> {
    protected table = 'sessions';
    protected primaryKey = 'session_id';
};

export const Session = new SessionModel();