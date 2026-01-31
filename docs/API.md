# API Documentation

This document describes the REST API endpoints for the MMA Gym Management application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Token) based authentication. Access tokens expire after 15 minutes and refresh tokens expire after 7 days.

### Headers

For protected endpoints, include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User

Creates a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** None required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | Password (minimum 8 characters) |
| firstName | string | No | User's first name |
| lastName | string | No | User's last name |

**Example Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Example Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Email and password are required | Missing required fields |
| 400 | Password must be at least 8 characters | Password too short |
| 400 | Invalid email format | Email validation failed |
| 400 | Invalid role | Role field was provided (not allowed) |
| 409 | Email already registered | Email address already in use |
| 500 | Internal server error | Server-side error |

---

### Login

Authenticates a user and returns tokens.

**Endpoint:** `POST /auth/login`

**Authentication:** None required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

**Example Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Email and password are required | Missing required fields |
| 401 | Invalid credentials | Wrong email or password |
| 500 | Internal server error | Server-side error |

---

### Refresh Token

Exchanges a refresh token for new access and refresh tokens.

**Endpoint:** `POST /auth/refresh`

**Authentication:** None required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | Yes | Valid refresh token |

**Example Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response (200 OK):**

```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Refresh token is required | Missing refresh token |
| 401 | Invalid refresh token | Token not found in database |
| 401 | Invalid or expired refresh token | Token verification failed |
| 401 | User not found | Associated user no longer exists |
| 500 | Internal server error | Server-side error |

---

### Get Current User

Returns the currently authenticated user's information.

**Endpoint:** `GET /auth/me`

**Authentication:** Required (Bearer token)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Example Response (200 OK):**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 401 | No token provided | Authorization header missing or malformed |
| 401 | Token expired | Access token has expired |
| 401 | Invalid token | Token verification failed |
| 401 | User not found | User associated with token no longer exists |
| 401 | Not authenticated | User object not present on request |
| 500 | Internal server error | Server-side error |

---

### Logout

Invalidates the provided refresh token.

**Endpoint:** `POST /auth/logout`

**Authentication:** None required (but typically called with a valid session)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | No | Refresh token to invalidate |

**Example Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 500 | Internal server error | Server-side error |

---

## Error Codes Reference

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions for the requested action |
| 404 | Not Found | Requested resource does not exist |
| 409 | Conflict | Resource conflict (e.g., duplicate email) |
| 500 | Internal Server Error | Unexpected server-side error |

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Authentication Errors

| Error Message | HTTP Status | Cause |
|---------------|-------------|-------|
| No token provided | 401 | Missing or malformed Authorization header |
| Token expired | 401 | Access token has expired, use refresh token |
| Invalid token | 401 | Token signature verification failed |
| User not found | 401 | User associated with token was deleted |
| Not authenticated | 401 | Request requires authentication |
| Insufficient permissions | 403 | User lacks required role/permissions |

### Validation Errors

| Error Message | HTTP Status | Cause |
|---------------|-------------|-------|
| Email and password are required | 400 | Missing required fields in request |
| Password must be at least 8 characters | 400 | Password does not meet minimum length |
| Invalid email format | 400 | Email failed regex validation |
| Email already registered | 409 | Duplicate email address |

---

## Endpoint Documentation Template

Use this template when documenting new endpoints:

```markdown
### Endpoint Name

Brief description of what this endpoint does.

**Endpoint:** `METHOD /path`

**Authentication:** Required / None required

**Request Body:** (if applicable)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| field | type | Yes/No | Description |

**Query Parameters:** (if applicable)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param | type | Yes/No | Description |

**Example Request:**

\`\`\`json
{
  "field": "value"
}
\`\`\`

**Example Response (200 OK):**

\`\`\`json
{
  "data": "response"
}
\`\`\`

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Error message | When this error occurs |
```
