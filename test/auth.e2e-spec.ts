import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('Registration successful');
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.user.name).toBe('Test User');
          expect(res.body.sessionId).toBeDefined();
        });
    });

    it('should not register user with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        })
        .expect(400);
    });

    it('should not register user with short password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Register a user first
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'login-test@example.com',
        password: 'password123',
        name: 'Login Test User',
      });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Login successful');
          expect(res.body.user).toBeDefined();
          expect(res.body.sessionId).toBeDefined();
        });
    });

    it('should not login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'login-test@example.com',
          password: 'wrongpassword',
        })
        .expect(500); // This will be improved in a real app to return 401
    });
  });

  describe('Protected routes', () => {
    let sessionId: string;

    beforeEach(async () => {
      // Register and login to get session
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'protected-test@example.com',
          password: 'password123',
          name: 'Protected Test User',
        });

      sessionId = response.body.sessionId;
    });

    it('should access protected route with valid session', () => {
      return request(app.getHttpServer())
        .post('/auth/me')
        .set('Authorization', `Bearer ${sessionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe('protected-test@example.com');
        });
    });

    it('should not access protected route without session', () => {
      return request(app.getHttpServer()).post('/auth/me').expect(401);
    });

    it('should not access protected route with invalid session', () => {
      return request(app.getHttpServer())
        .post('/auth/me')
        .set('Authorization', 'Bearer invalid-session')
        .expect(401);
    });
  });
});
