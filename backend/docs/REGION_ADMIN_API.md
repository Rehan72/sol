# Region Admin CRUD API Documentation

## Overview

Complete CRUD API for managing Region Admins in the Solar Platform. Region Admins are users with the `REGION_ADMIN` role who manage regional operations.

## Base URL

```
http://localhost:3000/region-admin
```

## Authentication

All endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Endpoints

### 1. Create Region Admin

**POST** `/region-admin`

**Access:** SUPER_ADMIN only

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "password": "SecurePass123",
  "state": "Maharashtra",
  "city": "Mumbai",
  "pincode": "400001",
  "location": "Western Region Office"
}
```

**Required Fields:**

- `name` (string)
- `email` (string, valid email)
- `phone` (string)
- `password` (string, min 6 characters)

**Optional Fields:**

- `state` (string)
- `city` (string)
- `pincode` (string)
- `location` (string)

**Response (201):**

```json
{
  "id": "uuid-here",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "state": "Maharashtra",
  "city": "Mumbai",
  "pincode": "400001",
  "location": "Western Region Office",
  "role": "REGION_ADMIN",
  "isOnboarded": true,
  "termAccepted": true
}
```

**Error Responses:**

- `409 Conflict` - Email already exists
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Insufficient permissions

---

### 2. Get All Region Admins

**GET** `/region-admin`

**Access:** SUPER_ADMIN, REGION_ADMIN

**Response (200):**

```json
[
  {
    "id": "uuid-1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "state": "Maharashtra",
    "city": "Mumbai",
    "pincode": "400001",
    "location": "Western Region Office",
    "role": "REGION_ADMIN",
    "isOnboarded": true
  },
  {
    "id": "uuid-2",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+919876543211",
    "state": "Karnataka",
    "city": "Bangalore",
    "pincode": "560001",
    "location": "Southern Region Office",
    "role": "REGION_ADMIN",
    "isOnboarded": true
  }
]
```

---

### 3. Get Region Admin by ID

**GET** `/region-admin/:id`

**Access:** SUPER_ADMIN, REGION_ADMIN

**Parameters:**

- `id` (UUID) - Region Admin ID

**Response (200):**

```json
{
  "id": "uuid-here",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "state": "Maharashtra",
  "city": "Mumbai",
  "pincode": "400001",
  "location": "Western Region Office",
  "role": "REGION_ADMIN",
  "isOnboarded": true
}
```

**Error Responses:**

- `404 Not Found` - Region Admin not found

---

### 4. Update Region Admin

**PATCH** `/region-admin/:id`

**Access:** SUPER_ADMIN, REGION_ADMIN

**Parameters:**

- `id` (UUID) - Region Admin ID

**Request Body (all fields optional):**

```json
{
  "name": "John Updated Doe",
  "phone": "+919876543211",
  "state": "Maharashtra",
  "city": "Pune",
  "pincode": "411001",
  "location": "Pune Regional Office"
}
```

**Response (200):**

```json
{
  "id": "uuid-here",
  "name": "John Updated Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543211",
  "state": "Maharashtra",
  "city": "Pune",
  "pincode": "411001",
  "location": "Pune Regional Office",
  "role": "REGION_ADMIN",
  "isOnboarded": true
}
```

**Error Responses:**

- `404 Not Found` - Region Admin not found

---

### 5. Delete Region Admin

**DELETE** `/region-admin/:id`

**Access:** SUPER_ADMIN only

**Parameters:**

- `id` (UUID) - Region Admin ID

**Response (200):**

```json
{
  "message": "Region Admin John Doe deleted successfully"
}
```

**Error Responses:**

- `404 Not Found` - Region Admin not found
- `403 Forbidden` - Insufficient permissions

---

### 6. Get Statistics

**GET** `/region-admin/statistics`

**Access:** SUPER_ADMIN only

**Response (200):**

```json
{
  "total": 15,
  "active": 12,
  "byState": [
    {
      "state": "Maharashtra",
      "count": 5
    },
    {
      "state": "Karnataka",
      "count": 4
    },
    {
      "state": "Tamil Nadu",
      "count": 3
    }
  ]
}
```

---

## Testing with cURL

### Create Region Admin

```bash
curl -X POST http://localhost:3000/region-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "password": "SecurePass123",
    "state": "Maharashtra",
    "city": "Mumbai",
    "pincode": "400001",
    "location": "Western Region Office"
  }'
```

### Get All Region Admins

```bash
curl -X GET http://localhost:3000/region-admin \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Region Admin by ID

```bash
curl -X GET http://localhost:3000/region-admin/uuid-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Region Admin

```bash
curl -X PATCH http://localhost:3000/region-admin/uuid-here \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "John Updated Doe",
    "city": "Pune"
  }'
```

### Delete Region Admin

```bash
curl -X DELETE http://localhost:3000/region-admin/uuid-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Statistics

```bash
curl -X GET http://localhost:3000/region-admin/statistics \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Features

✅ **Complete CRUD Operations**

- Create new region admins
- Read all region admins or by ID
- Update region admin details
- Delete region admins

✅ **Security**

- Password hashing with bcrypt
- JWT authentication required
- Role-based access control
- Sensitive data excluded from responses

✅ **Validation**

- Email format validation
- Required field validation
- Duplicate email prevention
- Minimum password length

✅ **Statistics**

- Total region admin count
- Active region admin count
- Distribution by state

✅ **API Documentation**

- Swagger/OpenAPI integration
- Detailed endpoint descriptions
- Request/response examples

---

## Role Permissions

| Endpoint                     | SUPER_ADMIN | REGION_ADMIN |
| ---------------------------- | ----------- | ------------ |
| POST /region-admin           | ✅          | ❌           |
| GET /region-admin            | ✅          | ✅           |
| GET /region-admin/:id        | ✅          | ✅           |
| PATCH /region-admin/:id      | ✅          | ✅           |
| DELETE /region-admin/:id     | ✅          | ❌           |
| GET /region-admin/statistics | ✅          | ❌           |

---

## Notes

1. **Password Security**: Passwords are hashed using bcrypt before storage
2. **Auto-populated Fields**: `role`, `termAccepted`, and `isOnboarded` are set automatically
3. **Sensitive Data**: Password and refresh tokens are never returned in responses
4. **Email Uniqueness**: Email addresses must be unique across all users
5. **UUID**: All IDs are UUIDs generated by the database
