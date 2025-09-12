# NestJS + Drizzle ORM Boilerplate with Hexagonal Architecture

A production-ready backend boilerplate that integrates **NestJS**, **Drizzle ORM**, and **Hexagonal Architecture** (Ports & Adapters pattern) to provide a clean, maintainable, and testable foundation for authentication-enabled APIs.

## 🏗️ Architecture

This boilerplate follows the **Hexagonal Architecture** pattern with clear separation of concerns:

```
src/
├── domain/                  # Business logic and entities
│   ├── entities/           # Domain entities (User)
│   ├── services/           # Domain services  
│   └── value-objects/      # Value objects (Email, UserId)
├── application/            # Application use cases and ports
│   ├── ports/              # Interfaces (inbound/outbound)
│   └── use-cases/          # Application services
├── infrastructure/         # External adapters and frameworks
│   ├── database/          # Drizzle ORM configuration and schemas
│   ├── controllers/       # NestJS REST controllers
│   ├── guards/            # Authentication guards
│   ├── modules/           # NestJS modules
│   ├── repositories/      # Data persistence adapters
│   └── services/          # Infrastructure services
└── shared/                # Shared utilities and types
    ├── errors/            # Domain errors
    ├── types/             # Type definitions
    └── utils/             # Common utilities
```

## ✨ Features

- **🔐 Authentication System**: Complete auth flow with session-based authentication
- **🏛️ Hexagonal Architecture**: Clean separation of domain, application, and infrastructure layers
- **🗄️ Drizzle ORM**: Type-safe database operations with SQLite
- **🛡️ Protected Routes**: Session-based authentication with guards
- **📝 API Documentation**: Auto-generated Swagger/OpenAPI docs
- **🧪 Type Safety**: Full TypeScript support with strict typing
- **🔧 Production Ready**: Error handling, logging, and validation
- **📦 Modular Design**: Easy to extend and maintain

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boilerplate-nestjs-better-auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start:dev
   ```

4. **Access the application**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api

## 📖 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| POST | `/auth/refresh` | Refresh session token | ❌ |
| POST | `/auth/me` | Get current user info | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/:id` | Get user by ID | ✅ |
| PUT | `/users/profile` | Update user profile | ✅ |

## 🔧 Usage Examples

### Register a new user

```bash
curl -X POST "http://localhost:3000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access protected endpoint

```bash
curl -X POST "http://localhost:3000/auth/me" \
  -H "Authorization: Bearer <session-token>"
```

### Update user profile

```bash
curl -X PUT "http://localhost:3000/users/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-token>" \
  -d '{
    "name": "Jane Doe",
    "image": "https://example.com/avatar.jpg"
  }'
```

## 🏗️ Architecture Principles

### Domain Layer
- **Pure business logic** with no external dependencies
- **Domain entities** like `User` with encapsulated behavior
- **Value objects** for type safety (`Email`, `UserId`)
- **Domain services** for business rules

### Application Layer
- **Use cases** that orchestrate domain objects
- **Ports** (interfaces) that define contracts with external systems
- **DTOs** for data transfer between layers

### Infrastructure Layer
- **Adapters** that implement ports (Better Auth, repositories)
- **Controllers** that handle HTTP requests
- **Guards** for authentication and authorization
- **External services** integration

## 🔌 Drizzle ORM Integration

This boilerplate includes a fully functional [Drizzle ORM](https://orm.drizzle.team) integration that provides:

- **Type-Safe Database Operations**: Full TypeScript support with Drizzle ORM
- **SQLite Database**: Simple setup with SQLite for development and production
- **Schema Management**: Versioned database migrations
- **Session Management**: Secure session handling with database persistence
- **Password Security**: bcrypt hashing for secure password storage

### Database Features

The implementation includes:

- **User Management**: Complete user CRUD operations with proper relations
- **Session Handling**: Database-backed session management with expiration
- **Schema Migrations**: Drizzle Kit for managing database schema changes
- **Type Safety**: Full TypeScript integration with database operations

### Technical Implementation

The Drizzle integration follows the repository pattern:

```typescript
// Drizzle Repository
@Injectable()
export class DrizzleAuthRepository implements AuthRepository {
  async createUser(email: string, password: string, name: string) {
    const hashedPassword = await PasswordUtils.hash(password);
    
    await db.insert(users).values({
      id: userId,
      email,
      name,
      password: hashedPassword,
      emailVerified: false,
    });

    return user;
  }

  async validateSession(sessionId: string) {
    const sessionResult = await db.select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);
    // Returns user and session data for valid sessions
  }
}
```

### Database Schema

The database schema includes:

```typescript
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  image: text('image'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
```

### Authentication Flow

1. **Registration**: `POST /auth/register`
2. **Login**: `POST /auth/login`
3. **Profile**: `POST /auth/me` (Protected)
4. **Logout**: `POST /auth/logout` (Protected)
5. **Refresh**: `POST /auth/refresh`

### Session Management

Sessions are managed using HTTP-only cookies and Bearer tokens with database persistence:

```typescript
// Session stored in database with Drizzle ORM
await db.insert(sessions).values({
  id: sessionId,
  userId,
  expiresAt: expiresAt.toISOString(),
  createdAt: new Date().toISOString(),
});
```

### Database Commands

```bash
# Generate database migrations
npm run db:generate

# Apply migrations to create/update database
npm run db:migrate
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start server in debug mode
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Drizzle database migrations
- `npm run db:migrate` - Apply database migrations

## 🔒 Security Features

- **Password hashing** with bcrypt
- **Session management** with database persistence and expiration
- **Request validation** with class-validator
- **Type-safe APIs** with TypeScript
- **CORS protection** enabled
- **Error handling** without sensitive data exposure

## 🚀 Production Deployment

### Environment Variables

Create a `.env` file with:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
```

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/main"]
```

### Build for Production

```bash
npm run build
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) - Architectural pattern by Alistair Cockburn
