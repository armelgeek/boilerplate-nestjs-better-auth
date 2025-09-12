import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BetterAuthService } from '../auth/better-auth.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private betterAuthService: BetterAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const sessionToken = this.extractSessionFromRequest(request);

    if (!sessionToken) {
      throw new UnauthorizedException('No session token provided');
    }

    try {
      const sessionData = await this.betterAuthService.validateSession(sessionToken);
      if (!sessionData) {
        throw new UnauthorizedException('Invalid session');
      }

      // Attach user to request for use in controllers
      request.user = {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
        emailVerified: sessionData.user.emailVerified,
        image: sessionData.user.image,
        createdAt: sessionData.user.createdAt,
        updatedAt: sessionData.user.updatedAt,
      };

      request.session = { 
        id: sessionData.session.id,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractSessionFromRequest(request: any): string | undefined {
    // Try to get session from Authorization header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }

    // Try to get session from cookies
    const sessionToken = request.cookies?.['better-auth.session_token'];
    if (sessionToken) {
      return sessionToken;
    }

    return undefined;
  }
}
