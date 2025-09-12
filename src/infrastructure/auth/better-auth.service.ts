import { Injectable } from '@nestjs/common';
import { mockBetterAuth, AuthUser, AuthSession } from './better-auth.config';

@Injectable()
export class BetterAuthService {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name: string) {
    try {
      return await mockBetterAuth.signUpEmail({
        email,
        password,
        name,
      });
    } catch (error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string) {
    try {
      return await mockBetterAuth.signInEmail({
        email,
        password,
      });
    } catch (error) {
      throw new Error(`Sign in failed: ${error.message}`);
    }
  }

  /**
   * Sign out a user
   */
  async signOut(sessionToken?: string) {
    if (!sessionToken) {
      return { success: true };
    }
    
    try {
      return await mockBetterAuth.signOut(sessionToken);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get session information
   */
  async getSession(sessionToken: string) {
    try {
      return await mockBetterAuth.getSession(sessionToken);
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate session and return user
   */
  async validateSession(sessionToken: string): Promise<{ session: AuthSession; user: AuthUser } | null> {
    try {
      const sessionData = await this.getSession(sessionToken);
      
      if (sessionData?.session && sessionData?.user) {
        return {
          session: sessionData.session as AuthSession,
          user: sessionData.user as AuthUser,
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }
}