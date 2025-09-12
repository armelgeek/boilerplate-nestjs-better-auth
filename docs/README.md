# Documentation Index

Welcome to the NestJS Better Auth Boilerplate documentation.

## Quick Links

- [Getting Started](getting-started.md) - Setup and installation guide
- [Architecture](architecture.md) - Detailed architecture documentation  
- [API Reference](api.md) - API endpoints and usage

## What's This Project?

This is a NestJS boilerplate project that implements authentication using Better Auth with a simplified hexagonal architecture. It provides a solid foundation for building scalable web applications with clean architecture principles.

## Key Features

- **NestJS Framework**: Modern Node.js framework with TypeScript support
- **Better Auth Integration**: Robust authentication system
- **Hexagonal Architecture**: Clean architecture with clear separation of concerns
- **Simplified Design**: Removed complex value objects for easier maintenance
- **Repository Pattern**: Interface-based data access layer
- **Session Management**: Secure session-based authentication
- **TypeScript**: Full type safety throughout the application
- **Docker Support**: Containerized deployment ready

## Architecture Overview

The project follows a simplified hexagonal architecture with these layers:

```
src/
├── domain/                  # Business logic and entities
├── application/            # Use cases and repository interfaces  
├── infrastructure/         # External adapters and frameworks
└── shared/                # Shared utilities and types
```

## Recent Changes

This boilerplate has been refactored to:
- Remove value objects for simplicity
- Rename "ports" to "repositories" for clarity
- Use primitive types (string) instead of complex value objects
- Maintain clean architecture principles while reducing complexity

## Getting Started

1. **Quick Start**: Follow the [Getting Started Guide](getting-started.md)
2. **Understand the Architecture**: Read the [Architecture Documentation](architecture.md)
3. **Use the API**: Check the [API Reference](api.md)

## Project Goals

- **Simplicity**: Easy to understand and modify
- **Maintainability**: Clean code with clear separation of concerns
- **Scalability**: Prepared for future growth and features
- **Best Practices**: Following NestJS and TypeScript best practices
- **Developer Experience**: Good tooling and documentation

## Contributing

We welcome contributions! Please:
1. Read the architecture documentation to understand the design
2. Follow the existing code patterns
3. Add tests for new features
4. Update documentation when needed

## License

MIT License - see LICENSE file for details.