# ClickNVape Backend Documentation

Welcome to the ClickNVape Backend documentation.

## Quick Links

- [Getting Started](getting-started.md) - Setup and installation guide
- [Architecture](architecture.md) - Detailed architecture documentation  

## What's This Project?

This is the ClickNVape backend application built with NestJS that implements authentication using Drizzle ORM with a simplified hexagonal architecture. It provides a solid foundation for the ClickNVape platform with clean architecture principles.

## Key Features

- **NestJS Framework**: Modern Node.js framework with TypeScript support
- **Drizzle ORM Integration**: Type-safe database operations with SQL databases
- **Hexagonal Architecture**: Clean architecture with clear separation of concerns
- **Simplified Design**: Streamlined interfaces for easier maintenance
- **Repository Pattern**: Interface-based data access layer
- **Session Management**: Secure session-based authentication with database persistence
- **TypeScript**: Full type safety throughout the application

## Architecture Overview

The project follows a simplified hexagonal architecture with these layers:

```
src/
├── domain/                  # Business logic and entities
├── application/            # Application services  
├── infrastructure/         # External adapters and frameworks
└── shared/                # Shared utilities and types
```

## Recent Architecture

This ClickNVape backend has been built with:
- Simplified repository interfaces for clarity
- Application services pattern instead of complex use cases
- Drizzle ORM for type-safe database operations
- Clean hexagonal architecture principles with reduced complexity

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