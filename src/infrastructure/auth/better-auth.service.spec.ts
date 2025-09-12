import { Test, TestingModule } from '@nestjs/testing';
import { BetterAuthService } from '../../../src/infrastructure/auth/better-auth.service';

describe('BetterAuthService Integration', () => {
  let service: BetterAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetterAuthService],
    }).compile();

    service = module.get<BetterAuthService>(BetterAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const result = await service.signUp(
      'test@example.com',
      'password123',
      'Test User'
    );

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.name).toBe('Test User');
    expect(result.session).toBeDefined();
  });

  it('should sign in an existing user', async () => {
    // First register a user
    await service.signUp('signin@example.com', 'password123', 'Sign In User');

    // Then sign in
    const result = await service.signIn('signin@example.com', 'password123');

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('signin@example.com');
    expect(result.session).toBeDefined();
  });

  it('should validate a session', async () => {
    // Register and get session
    const signUpResult = await service.signUp(
      'session@example.com',
      'password123',
      'Session User'
    );

    // Validate session
    const sessionData = await service.validateSession(signUpResult.session.id);

    expect(sessionData).toBeDefined();
    expect(sessionData.user.email).toBe('session@example.com');
    expect(sessionData.session.id).toBe(signUpResult.session.id);
  });

  it('should sign out a user', async () => {
    // Register and get session
    const signUpResult = await service.signUp(
      'signout@example.com',
      'password123',
      'Sign Out User'
    );

    // Sign out
    const result = await service.signOut(signUpResult.session.id);

    expect(result.success).toBe(true);

    // Session should no longer be valid
    const sessionData = await service.validateSession(signUpResult.session.id);
    expect(sessionData).toBeNull();
  });
});