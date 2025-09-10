# NestJS + Better Auth Boilerplate with Hexagonal Architecture

A production-ready backend boilerplate that integrates **NestJS**, **Better Auth**, and **Hexagonal Architecture** (Ports & Adapters pattern) to provide a clean, maintainable, and testable foundation for authentication-enabled APIs.

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
│   ├── auth/              # Better Auth adapter
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

- **🔐 Authentication System**: Complete auth flow with Better Auth integration
- **🏛️ Hexagonal Architecture**: Clean separation of domain, application, and infrastructure layers
- **🛡️ Protected Routes**: JWT-based authentication with guards
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

## 🔌 Better Auth Integration

This boilerplate integrates with [Better Auth](https://better-auth.com) through an adapter pattern. The current implementation uses in-memory storage for demonstration, but can be easily extended to use:

- **Database providers**: PostgreSQL, MySQL, SQLite, MongoDB
- **Social providers**: Google, GitHub, Twitter, etc.
- **Advanced features**: 2FA, email verification, password reset

### Extending with Database

To use a real database, replace the `BetterAuthAdapter` with a proper Better Auth configuration:

```typescript
// In production, configure Better Auth with your database
const auth = betterAuth({
  database: {
    provider: 'pg', // or 'mysql', 'sqlite', etc.
    url: process.env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
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

## 🔒 Security Features

- **Password hashing** with secure algorithms
- **Session management** with expiration
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
- [Better Auth](https://better-auth.com/) - Modern authentication library
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) - Architectural pattern by Alistair Cockburn
