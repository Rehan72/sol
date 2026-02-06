# Solar Platform - Backend API

Backend API for the Solar Platform application built with NestJS, TypeScript, and PostgreSQL.

## 🚀 Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: Zod + class-validator

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker (optional, for containerized database)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=solar_user
DB_PASSWORD=your_password
DB_NAME=solar_platform

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d

# Server
PORT=3000
```

## 🏃 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Watch mode
npm run start:watch
```

## 🐳 Docker Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Run migrations
npm run migration:run
```

## 📚 API Documentation

Once the server is running, access the API documentation at:

- Swagger UI: `http://localhost:3000/api/docs`

## 🗂️ Project Structure

```
src/
├── auth/           # Authentication module
├── customer/       # Customer management
├── entities/       # Database entities
├── common/         # Shared utilities
├── config/         # Configuration files
└── main.ts         # Application entry point
```

## 🔐 Authentication

The API uses JWT-based authentication. Include the token in requests:

```
Authorization: Bearer <your_token>
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

## 📝 License

This project is proprietary and confidential.
