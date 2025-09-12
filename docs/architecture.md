# Architecture Documentation

## Overview

This ClickNVape backend application follows a simplified hexagonal (clean) architecture pattern with Drizzle ORM integration. The architecture emphasizes separation of concerns and maintainability while keeping complexity to a minimum.

## Project Structure

```
src/
├── domain/                  # Business logic and entities
│   ├── entities/           # Domain entities (User)
│   └── interfaces/         # Repository interfaces
├── application/            # Application services
│   └── services/           # Application use case services
├── infrastructure/         # External adapters and frameworks
│   ├── auth/               # Authentication repositories
│   ├── controllers/        # NestJS REST controllers
│   ├── database/           # Drizzle ORM configuration and schemas
│   ├── modules/            # NestJS modules
│   ├── repositories/       # Data persistence adapters
│   └── services/           # Infrastructure services
└── shared/                # Shared utilities and types
    ├── errors/            # Domain errors
    ├── types/             # Type definitions
    └── utils/             # Common utilities
```

## Architecture Layers

### 1. Domain Layer (`src/domain/`)

The domain layer contains the core business logic and entities.

#### Entities (`src/domain/entities/`)
- **User**: Core user entity with business logic
- Uses primitive types (string) for identifiers and properties
- Contains business methods like `updateProfile()`, `verifyEmail()`

#### Services (`src/domain/services/`)
- **UserDomainService**: Contains domain-specific user logic
- Validates business rules like email uniqueness and user existence

### 2. Application Layer (`src/application/`)

The application layer orchestrates business operations and contains application services.

#### Services (`src/application/services/`)
- **AuthService**: Handles authentication flows (login, register, logout, refresh)
- **UserService**: Manages user operations (get user, update profile)

### 3. Infrastructure Layer (`src/infrastructure/`)

The infrastructure layer implements external concerns and adapters.

#### Auth (`src/infrastructure/auth/`)
- **DrizzleAuthRepository**: Implements `AuthRepository` interface
- Handles user creation, password verification, session management
- Uses Drizzle ORM with database persistence

#### Database (`src/infrastructure/database/`)
- **connection.ts**: Database connection configuration
- **schema.ts**: Drizzle ORM schema definitions for users and sessions

#### Controllers (`src/infrastructure/controllers/`)
- **AuthController**: REST endpoints for authentication
- **UserController**: REST endpoints for user management
- **DTOs**: Data Transfer Objects for API requests/responses



#### Modules (`src/infrastructure/modules/`)
- **AuthModule**: NestJS module configuration
- Configures dependency injection and providers

#### Repositories (`src/infrastructure/repositories/`)
- **DrizzleUserRepository**: Implements `UserRepository` interface
- Drizzle ORM implementation for user data persistence

#### Services (`src/infrastructure/services/`)
- **LoggerService**: Implements `Logger` interface
- Provides logging functionality

### 4. Shared Layer (`src/shared/`)

Contains common utilities and types used across layers.

#### Errors (`src/shared/errors/`)
- Domain-specific error definitions

#### Types (`src/shared/types/`)
- Common type definitions for authentication

#### Utils (`src/shared/utils/`)
- **CommonUtils**: Utility functions for ID generation, password hashing

## Key Architectural Decisions

### 1. Simplified Entity Model
- **Removed Value Objects**: Entities now use primitive types (string) instead of value objects for simplicity
- **Direct Property Access**: User entity properties are accessed directly without `.value` wrapper

### 2. Repository Pattern
- **Interface Segregation**: Separate interfaces for different concerns (Auth, User, Email, Logger)
- **Clean Dependencies**: Application layer depends only on interfaces, not implementations

### 3. Dependency Injection
- **NestJS Container**: Leverages NestJS dependency injection for clean architecture
- **Interface-based**: All dependencies are injected through interfaces

### 4. Authentication Strategy
- **Session-based**: Uses session tokens for authentication
- **Drizzle ORM Integration**: Database-backed authentication with Drizzle ORM
- **Token-based Access**: Supports Bearer token authentication

### 5. Error Handling
- **Domain Errors**: Business logic errors thrown from domain layer
- **Infrastructure Errors**: Technical errors handled in infrastructure layer
- **Graceful Degradation**: Proper error responses for API consumers

## Data Flow

### Authentication Flow
1. Client sends login request to `AuthController`
2. Controller calls `AuthService.login()`
3. `AuthService` uses `AuthRepository` to verify credentials
4. `AuthRepository` validates password and creates session
5. Session token returned to client
6. Subsequent requests use `AuthGuard` for validation

### User Management Flow
1. Client sends request to `UserController`
2. Authentication middleware validates session and attaches user to request
3. Controller calls appropriate `UserService` method
4. `UserService` orchestrates domain operations
5. `UserRepository` handles data persistence with Drizzle ORM
6. Response returned to client

## Testing Strategy

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test layer interactions
- **E2E Tests**: Test complete user flows
- **Mock External Dependencies**: Use mocks for repositories and services

## Deployment Considerations

- **Environment Configuration**: Use environment variables for different environments
- **Database**: Uses Drizzle ORM with SQL database (SQLite/PostgreSQL)
- **Security**: Implements proper password hashing and session security with database persistence
- **Monitoring**: Add comprehensive logging and monitoring
- **Scalability**: Database-backed session storage supports horizontal scaling