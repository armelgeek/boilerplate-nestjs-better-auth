# Getting Started

## Prerequisites

- Node.js (v18 or later)
- npm or yarn package manager
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ClickNVape-backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# App Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=database.db

# ClickNVape Authentication
AUTH_SECRET=your-secret-key-here
```

## Development

### Start Development Server
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`.

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start:prod
```

## Testing

### Run Unit Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Generate Coverage Report
```bash
npm run test:cov
```

## Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## API Testing

You can test the API using tools like Postman, curl, or any HTTP client.

### Example: Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Example: Get user (with authentication)
```bash
curl -X GET http://localhost:3000/user/USER_ID \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```



## Project Structure

```
├── src/                     # Source code
│   ├── domain/             # Business logic layer
│   ├── application/        # Application layer
│   ├── infrastructure/     # Infrastructure layer
│   ├── shared/            # Shared utilities
│   ├── app.module.ts      # Main application module
│   └── main.ts            # Application entry point
├── test/                   # E2E tests
├── docs/                   # Documentation
├── .env.example           # Environment variables template
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── package.json           # Dependencies and scripts
```

## Next Steps

1. **Database Configuration**: Configure your database connection in the .env file
2. **Email Service**: Implement email verification and password reset (if needed)
3. **File Upload**: Add profile image upload functionality (if needed)
4. **Role-Based Access**: Implement user roles and permissions
5. **API Documentation**: Set up Swagger/OpenAPI documentation
6. **Monitoring**: Add logging, metrics, and health checks
7. **Testing**: Expand test coverage
8. **Security**: Implement rate limiting, CORS, and security headers

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in .env file or kill process
lsof -ti:3000 | xargs kill -9
```

**Dependencies issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Clean build
npm run build --clean
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## Support

For issues and questions:
- Check the documentation in the `docs/` folder
- Create an issue in the repository
- Review the codebase for examples and patterns