import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../application/use-cases/auth.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
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
    const sessionId = this.extractSessionFromRequest(request);

    if (!sessionId) {
      throw new UnauthorizedException('No session token provided');
    }

    try {
      const user = await this.authService.validateSession(sessionId);
      if (!user) {
        throw new UnauthorizedException('Invalid session');
      }

      // Attach user to request for use in controllers
      request.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      request.session = { id: sessionId };

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
    const sessionId = request.cookies?.['session-id'];
    if (sessionId) {
      return sessionId;
    }

    return undefined;
  }
}
