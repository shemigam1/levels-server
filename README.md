# Levels Server API 🚀

## Overview

This is a robust backend API built with **TypeScript**, **Node.js**, and **Express.js**, leveraging **Mongoose** for seamless MongoDB integration. It provides core functionalities for managing bookings, user authentication, and integrating with the Paystack payment gateway.

## Features

- **User Authentication & Authorization**: Secure signup and login for administrative users with JWT-based authentication.
- **Booking Management**: Create and retrieve bookings, with checks for date validity and available slots.
- **Payment Integration**: Seamlessly initialize and verify transactions using the Paystack API.
- **Data Validation**: Ensures data integrity through robust input validation.
- **Error Handling**: Centralized error handling for a consistent API experience.

## Getting Started

To get this project up and running on your local machine, follow these steps.

### Installation

⚙️ Clone the repository:

```bash
git clone git@github.com:shemigam1/levels-server.git
cd levels-server
```

📦 Install dependencies:

```bash
npm install
```

🚀 Start the development server:

```bash
npm run dev
```

The server will be accessible at `http://localhost:3000` (or your configured port).

### Environment Variables

Create a `.env` file in the root directory of the project and populate it with the following variables:

```
PORT=3000
DATABASE_URL="mongodb://localhost:27017/levelsdb"
PAYSTACK_SECRET_KEY="sk_test_********************************"
PAYSTACK_URL="https://api.paystack.co"
JWT_SECRET="your_strong_jwt_secret_key"
```

## API Documentation

This section details all available API endpoints, including request and response structures.

### Base URL

`http://localhost:PORT` (where `PORT` is defined in your environment variables, default is `3000`)

### Endpoints

#### GET /health

Checks the health of the API server.

**Request**:
No request body.

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /

Creates a new booking.

**Request**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "date": "2024-07-25T10:00:00.000Z",
  "type_of_booking": "Meeting Room A"
}
```

**Required Fields**: `name`, `email`, `date`, `type_of_booking`

**Response**:

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "date": "2024-07-25",
    "type_of_booking": "Meeting Room A",
    "_id": "651a23b3a4c5e6d7f8a9b0c1",
    "createdAt": "2024-07-24T12:00:00.000Z",
    "updatedAt": "2024-07-24T12:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**:

- `400 Bad Request`: "Missing required fields"
- `400 Bad Request`: "date cannot be in the past"
- `401 Unauthorized`: "the hub is fully booked"
- `500 Internal Server Error`: "something went wrong"

#### GET /today

Retrieves all bookings scheduled for the current day.

**Request**:
No request body. The date is determined server-side.

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "date": "2024-07-24",
      "type_of_booking": "Workspace",
      "_id": "651a23b3a4c5e6d7f8a9b0c2",
      "createdAt": "2024-07-24T09:00:00.000Z",
      "updatedAt": "2024-07-24T09:00:00.000Z",
      "__v": 0
    }
  ]
}
```

**Errors**:

- `400 Bad Request`: "the hub is fully booked"
- `500 Internal Server Error`: "something went wrong"

#### POST /admin/login

Authenticates an administrator user and returns a JWT token.

**Request**:

```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

**Required Fields**: `email`, `password`

**Response**:

```json
{
  "success": true,
  "message": "login successful",
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "651a23b3a4c5e6d7f8a9b0c3",
      "email": "admin@example.com",
      "name": "Admin User"
    }
  }
}
```

**Errors**:

- `400 Bad Request`: "invalid email or password"
- `422 Unprocessable Entity`: "unprocessable entity" (if JWT token generation fails)
- `500 Internal Server Error`: "something went wrong"

#### POST /admin/signup

Registers a new administrator user.

**Request**:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

**Required Fields**: `name`, `email`, `password`

**Response**:

```json
{
  "success": true,
  "message": "signup successful",
  "code": 201,
  "data": {
    "name": "Admin User",
    "email": "admin@example.com",
    "_id": "651a23b3a4c5e6d7f8a9b0c3",
    "createdAt": "2024-07-24T12:00:00.000Z",
    "updatedAt": "2024-07-24T12:00:00.000Z",
    "__v": 0
  }
}
```

**Errors**:

- `400 Bad Request`: "missing required fields"
- `400 Bad Request`: "user exists already"
- `400 Bad Request`: "signup failed"
- `500 Internal Server Error`: "something went wrong"

#### POST /admin/activate-booking

(Admin Protected) Activates a booking. The functionality for this endpoint is currently an empty handler.

**Request**:
Authentication: Bearer Token required in `Authorization` header.
No request body is processed by the current empty handler.

**Response**:
The current handler is empty, so no explicit success response is defined.

**Errors**:

- `401 Unauthorized`: "invalid or missing token" (if authentication fails)
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /admin/deactivate-booking

(Admin Protected) Deactivates a booking. The functionality for this endpoint is currently an empty handler.

**Request**:
Authentication: Bearer Token required in `Authorization` header.
No request body is processed by the current empty handler.

**Response**:
The current handler is empty, so no explicit success response is defined.

**Errors**:

- `401 Unauthorized`: "invalid or missing token" (if authentication fails)
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /payments/init

Initializes a payment transaction through Paystack.

**Request**:

```json
{
  "email": "customer@example.com",
  "amount": 3000
}
```

**Required Fields**: `email`, `amount` (amount is expected in Naira, converted to kobo internally by Paystack)

**Response**:

```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "...",
    "reference": "..."
  }
}
```

**Errors**:

- `4xx/5xx`: Error response directly from Paystack API.
- `500 Internal Server Error`: "Internal server error"

#### POST /payments/verify

Verifies a payment transaction with Paystack using its reference.

**Request**:

```json
{
  "reference": "your_transaction_reference"
}
```

**Required Fields**: `reference`

**Response**:

```json
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "id": 123456,
    "domain": "test",
    "status": "success",
    "reference": "your_transaction_reference",
    "amount": 300000,
    "currency": "NGN",
    "customer": {
      "email": "customer@example.com",
      "id": 7890,
      "...": "..."
    },
    "...": "..."
  }
}
```

**Errors**:

- `400 Bad Request`: "Invalid Transaction"
- `4xx/5xx`: Error response directly from Paystack API.
- `500 Internal Server Error`: "Internal server error"

## Usage

After starting the server, you can interact with the API using tools like Postman, Insomnia, or `curl`.

**Example: Creating a Booking**

```bash
curl -X POST \
  http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Alice Wonderland",
    "email": "alice@example.com",
    "date": "2025-01-01T10:00:00.000Z",
    "type_of_booking": "day"
  }'
```

**Example: Admin Login**

```bash
curl -X POST \
  http://localhost:3000/admin/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }'
```

**Example: Initializing a Paystack Payment**

```bash
curl -X POST \
  http://localhost:3000/payments/init \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "amount": 5000
  }'
```

## Technologies Used

| Technology     | Description                                    | Link                                                             |
| :------------- | :--------------------------------------------- | :--------------------------------------------------------------- |
| **Node.js**    | JavaScript runtime environment                 | [nodejs.org](https://nodejs.org/)                                |
| **Express.js** | Web application framework for Node.js          | [expressjs.com](https://expressjs.com/)                          |
| **TypeScript** | Typed superset of JavaScript                   | [typescriptlang.org](https://www.typescriptlang.org/)            |
| **Mongoose**   | MongoDB object data modeling (ODM) for Node.js | [mongoosejs.com](https://mongoosejs.com/)                        |
| **MongoDB**    | NoSQL document database                        | [mongodb.com](https://www.mongodb.com/)                          |
| **JWT**        | JSON Web Tokens for secure authentication      | [jwt.io](https://jwt.io/)                                        |
| **Bcrypt**     | Library for hashing passwords                  | [npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt) |
| **Axios**      | Promise-based HTTP client                      | [axios-http.com](https://axios-http.com/)                        |
| **Paystack**   | Online payment gateway                         | [paystack.com](https://paystack.com/)                            |

## License

This project is licensed under the ISC License.

## Author Info

**Shemigam**

- GitHub: [@shemigam1](https://github.com/shemigam1)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/semiloreomotade@gmail.com)
- Twitter: [@yourtwitterhandle](https://twitter.com/shemigam1)

## Badges

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x%2B-green?logo=mongodb)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.x-red?logo=mongoose)](https://mongoosejs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
