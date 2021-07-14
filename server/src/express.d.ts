import User from './entity/User';

interface UserSession {
  id: number,
  username: String,
  email: String,
  lastLogin: Date,
  sessionCreated: Date
}

declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}

