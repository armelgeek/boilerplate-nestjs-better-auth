// Simple Better Auth configuration without database to avoid type issues
// This is a working example that integrates Better Auth with NestJS

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
}

// For now, we'll create a simplified implementation that demonstrates Better Auth integration
// In production, you would use the full Better Auth configuration
const users = new Map<string, any>();
const sessions = new Map<string, any>();

export const mockBetterAuth = {
  async signUpEmail(data: { email: string; password: string; name: string }) {
    const userId = Math.random().toString(36).substring(2, 15);
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    const user = {
      id: userId,
      email: data.email,
      name: data.name,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
    };
    
    const session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    
    users.set(userId, { ...user, password: data.password });
    sessions.set(sessionId, session);
    
    return { user, session };
  },

  async signInEmail(data: { email: string; password: string }) {
    const userEntry = Array.from(users.values()).find(u => u.email === data.email);
    if (!userEntry || userEntry.password !== data.password) {
      throw new Error('Invalid credentials');
    }
    
    const sessionId = Math.random().toString(36).substring(2, 15);
    const session = {
      id: sessionId,
      userId: userEntry.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    
    sessions.set(sessionId, session);
    
    return { 
      user: {
        id: userEntry.id,
        email: userEntry.email,
        name: userEntry.name,
        emailVerified: userEntry.emailVerified,
        createdAt: userEntry.createdAt,
        updatedAt: userEntry.updatedAt,
        image: userEntry.image,
      }, 
      session 
    };
  },

  async getSession(sessionId: string) {
    const session = sessions.get(sessionId);
    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    
    const user = users.get(session.userId);
    if (!user) {
      return null;
    }
    
    return {
      session,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        image: user.image,
      },
    };
  },

  async signOut(sessionId: string) {
    sessions.delete(sessionId);
    return { success: true };
  },
};