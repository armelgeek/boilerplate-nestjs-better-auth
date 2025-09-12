# API Documentation

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "sessionId": "session-token"
}
```

**Errors:**
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists

### POST /auth/login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "sessionId": "session-token"
}
```

**Errors:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid credentials

### POST /auth/logout
Terminate the current user session.

**Headers:**
```
Authorization: Bearer session-token
```

**Request Body:**
```json
{
  "sessionId": "session-token"
}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or expired session

### POST /auth/refresh
Refresh the current session token.

**Headers:**
```
Authorization: Bearer session-token
```

**Request Body:**
```json
{
  "sessionId": "session-token"
}
```

**Response:**
```json
{
  "sessionId": "new-session-token"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or expired session

## User Endpoints

### GET /user/:id
Get user information by ID.

**Headers:**
```
Authorization: Bearer session-token
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "emailVerified": false,
  "image": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or expired session
- `404 Not Found`: User not found

### PUT /user/:id/profile
Update user profile information.

**Headers:**
```
Authorization: Bearer session-token
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "image": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "emailVerified": false,
  "image": "https://example.com/new-avatar.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or expired session
- `404 Not Found`: User not found

## Authentication

All protected endpoints require authentication via session tokens. Include the session token in one of the following ways:

### Bearer Token (Recommended)
```
Authorization: Bearer your-session-token
```

### Cookie
```
Cookie: session-id=your-session-token
```

## Error Responses

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Error Codes
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- Other endpoints: 100 requests per minute per user

## Data Validation

All request bodies are validated according to the following rules:

### Email
- Must be a valid email format
- Maximum length: 254 characters

### Password
- Minimum length: 8 characters
- Must contain at least one letter and one number

### Name
- Minimum length: 2 characters
- Maximum length: 100 characters
- Only letters, spaces, and hyphens allowed

### Image URL
- Must be a valid URL
- Maximum length: 500 characters
- Optional field