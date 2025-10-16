import { Session, SessionEntity, CreateSessionData, UpdateSessionData } from './session.model';

export const createSession = async (data: CreateSessionData): Promise<SessionEntity> => {
    return Session.create(data);
};

export const updateSession = async (id: number, data: UpdateSessionData): Promise<SessionEntity | null> => {
    return Session.update(id, data);
};

export const deleteSession = async (id: number) => {
    return Session.delete(id);
};

export const findUserById = async (id: number): Promise<SessionEntity | null> => {
    return Session.findById(id);
};
