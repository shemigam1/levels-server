# 🚀 Levels Backend API

## Overview

A robust backend service built with TypeScript, Node.js, and Express, designed to manage booking operations and integrate with the Paystack payment gateway. It features a secure administrative interface and a flexible daily booking system powered by MongoDB.

## Features

- **User Authentication (Admin):** Secure admin signup and login using JWT for access control.
- **Booking Management:** Facilitates daily booking of resources, incorporating capacity checks to prevent overbooking.
- **Payment Integration:** Seamless integration with Paystack for initializing and verifying payment transactions.
- **Robust Data Validation:** Utilizes Zod for comprehensive and TypeScript-first input validation across all API requests.
- **Modular Architecture:** Structured with maintainability in mind, promoting clear separation of concerns for future scalability.

## Technologies Used

| Category           | Technology                                               | Description                                             |
| :----------------- | :------------------------------------------------------- | :------------------------------------------------------ |
| **Backend**        | [Node.js](https://nodejs.org/en/)                        | JavaScript runtime environment.                         |
|                    | [Express.js](https://expressjs.com/)                     | Fast, unopinionated, minimalist web framework.          |
|                    | [TypeScript](https://www.typescriptlang.org/)            | Superset of JavaScript for type safety and scalability. |
| **Database**       | [MongoDB](https://www.mongodb.com/)                      | NoSQL document database.                                |
|                    | [Mongoose](https://mongoosejs.com/)                      | MongoDB object data modeling (ODM) for Node.js.         |
| **Authentication** | [JWT](https://jwt.io/)                                   | JSON Web Tokens for secure, stateless authentication.   |
|                    | [bcrypt](https://github.com/kelektiv/node.bcrypt.js)     | Library to hash passwords securely.                     |
| **Validation**     | [Zod](https://zod.dev/)                                  | TypeScript-first schema declaration and validation.     |
| **Payments**       | [Paystack API](https://paystack.com/developers)          | Payment gateway integration for online transactions.    |
| **Utilities**      | [Axios](https://axios-http.com/)                         | Promise-based HTTP client for the browser and Node.js.  |
| **Development**    | [ts-node-dev](https://github.com/whitecolor/ts-node-dev) | Hot-reloading development server for TypeScript.        |
|                    | [dotenv](https://github.com/motdotla/dotenv)             | Loads environment variables from a `.env` file.         |

## Getting Started

To get a copy of this project up and running on your local machine for development and testing purposes, follow these steps.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:shemigam1/levels-server.git
    cd levels-server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory of the project and populate it with the following environment variables:

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/levels_db
PAYSTACK_SECRET_KEY=sk_test_********************
PAYSTACK_URL=https://api.paystack.co
JWT_SECRET=supersecretjwtkey
```

- `PORT`: The port on which the server will run. Defaults to `3000`.
- `DATABASE_URL`: Your MongoDB connection string.
- `PAYSTACK_SECRET_KEY`: Your secret key obtained from Paystack for API authentication.
- `PAYSTACK_URL`: The base URL for the Paystack API (e.g., `https://api.paystack.co`).
- `JWT_SECRET`: A strong, secret key used for signing JSON Web Tokens.

### Usage

To start the development server with live reloading, run:

```bash
npm run dev
```

The server will be accessible at `http://localhost:<PORT>` (e.g., `http://localhost:3000`).

## API Documentation

### Base URL

`http://localhost:3000` (or the port configured in your `.env` file)

### Endpoints

#### GET /health

Checks the health and status of the API server.

**Request**:
(No payload)

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2024-07-20T12:34:56.789Z"
}
```

**Errors**:

- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /

Creates a new daily booking.

**Request**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "date": "2025-01-01",
  "type_of_booking": "Meeting Room A"
}
```

- `name` (string, required): The full name of the person making the booking. Max 50 characters.
- `email` (string, required): The email address of the person making the booking. Must be a valid email format.
- `date` (string, required): The specific date for the booking, in `YYYY-MM-DD` format. Must be a future date.
- `type_of_booking` (string, optional): The specific type of booking (e.g., "Any Meeting Room"). Defaults to "Daily".

**Response**:

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "date": "2025-01-01",
    "type_of_booking": "Meeting Room A",
    "_id": "60e1d2c3e4f5a6b7c8d9e0f1",
    "createdAt": "2024-07-20T12:34:56.789Z",
    "updatedAt": "2024-07-20T12:34:56.789Z",
    "__v": 0
  }
}
```

**Errors**:

- `400 Bad Request`:
  - Missing required fields (`name`, `email`, `date`).
  - Invalid `email` format.
  - Invalid `date` format (must be `YYYY-MM-DD`) or date is in the past.
  - `name` exceeds 50 characters.
  - "Not enough slots left for this day" if the daily booking capacity (currently 50) is reached.
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /admin/signup

Registers a new administrator user.

**Request**:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "StrongPassword123",
  "date": "2025-01-01"
}
```

- `name` (string, required): The full name of the admin user. Max 50 characters.
- `email` (string, required): The email address for the admin user. Must be a valid email format.
- `password` (string, required): The password for the admin user.
- `date` (string, required for validation): A placeholder date in `YYYY-MM-DD` format. This field is required by the validation middleware but is not directly used by the signup logic. Must be a future date.
- `type_of_booking` (string, optional for validation): An optional placeholder field for validation.

**Response**:

```json
{
  "success": true,
  "message": "signup successful",
  "code": 201,
  "data": {
    "name": "Admin User",
    "email": "admin@example.com",
    "_id": "60e1d2c3e4f5a6b7c8d9e0f2",
    "createdAt": "2024-07-20T12:34:56.789Z",
    "updatedAt": "2024-07-20T12:34:56.789Z",
    "__v": 0
  }
}
```

**Errors**:

- `400 Bad Request`:
  - Missing required fields (`name`, `email`, `password`, `date`).
  - Invalid `email` format.
  - `name` exceeds 50 characters.
  - Invalid `date` format or date is in the past (due to validation middleware).
  - "user exists already" if the email is already registered.
  - "signup failed" if there's an issue during user creation.
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /admin/login

Authenticates an administrator user and returns a JWT token.

**Request**:

```json
{
  "email": "admin@example.com",
  "password": "StrongPassword123",
  "name": "Any Name",
  "date": "2025-01-01"
}
```

- `email` (string, required): The registered email address of the admin user. Must be a valid email format.
- `password` (string, required): The password for the admin user.
- `name` (string, required for validation): A placeholder name. This field is required by the validation middleware but is not directly used by the login logic. Max 50 characters.
- `date` (string, required for validation): A placeholder date in `YYYY-MM-DD` format. This field is required by the validation middleware but is not directly used by the login logic. Must be a future date.
- `type_of_booking` (string, optional for validation): An optional placeholder field for validation.

**Response**:

```json
{
  "success": true,
  "message": "login successful",
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60e1d2c3e4f5a6b7c8d9e0f2",
      "email": "admin@example.com",
      "name": "Admin User"
    }
  }
}
```

**Errors**:

- `400 Bad Request`:
  - "invalid email or password" if the user is not found or the password does not match.
  - Invalid `email` format.
  - `name` exceeds 50 characters (due to validation middleware).
  - Invalid `date` format or date is in the past (due to validation middleware).
- `422 Unprocessable Entity`: "unprocessable entity" if there's an issue generating the JWT token.
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /admin/activate-booking

Activates a specific booking. This endpoint requires admin authentication.

**Headers**:
`Authorization: Bearer <JWT_TOKEN>`

**Request**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "date": "2025-01-01",
  "type_of_booking": "Meeting Room A"
}
```

- `name` (string, required): The full name associated with the booking. Max 50 characters.
- `email` (string, required): The email address associated with the booking. Must be a valid email format.
- `date` (string, required): The date of the booking, in `YYYY-MM-DD` format. Must be a future date.
- `type_of_booking` (string, optional): The specific type of booking.

**Response**:

```json
{
  "success": true,
  "message": "Booking activated successfully"
}
```

(Note: The current implementation for this endpoint is empty and will not return this exact response. This is a placeholder for intended functionality.)

**Errors**:

- `400 Bad Request`:
  - Missing required fields (`name`, `email`, `date`).
  - Invalid `email` format.
  - Invalid `date` format or date is in the past.
  - `name` exceeds 50 characters.
- `401 Unauthorized`:
  - "invalid or missing token" if the `Authorization` header is missing or malformed.
  - If the provided JWT token is invalid or expired.
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /admin/deactivate-booking

Deactivates a specific booking. This endpoint requires admin authentication.

**Headers**:
`Authorization: Bearer <JWT_TOKEN>`

**Request**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "date": "2025-01-01",
  "type_of_booking": "Meeting Room A"
}
```

- `name` (string, required): The full name associated with the booking. Max 50 characters.
- `email` (string, required): The email address associated with the booking. Must be a valid email format.
- `date` (string, required): The date of the booking, in `YYYY-MM-DD` format. Must be a future date.
- `type_of_booking` (string, optional): The specific type of booking.

**Response**:

```json
{
  "success": true,
  "message": "Booking deactivated successfully"
}
```

(Note: The current implementation for this endpoint is empty and will not return this exact response. This is a placeholder for intended functionality.)

**Errors**:

- `400 Bad Request`:
  - Missing required fields (`name`, `email`, `date`).
  - Invalid `email` format.
  - Invalid `date` format or date is in the past.
  - `name` exceeds 50 characters.
- `401 Unauthorized`:
  - "invalid or missing token" if the `Authorization` header is missing or malformed.
  - If the provided JWT token is invalid or expired.
- `500 Internal Server Error`: An unexpected server error occurred.

#### POST /payments/init

Initializes a new payment transaction with Paystack.

**Request**:

```json
{
  "email": "customer@example.com",
  "amount": 1000
}
```

- `email` (string, required): The email address of the customer.
- `amount` (number, required): The transaction amount in NGN. Currently, this endpoint is configured to only accept `1000 NGN`.

**Response**:

```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/abcdefgh",
    "access_code": "abcdefgh",
    "reference": "your_transaction_reference"
  }
}
```

**Errors**:

- `400 Bad Request`:
  - "Invalid amount. Amount must be 1000 NGN." if the `amount` is not 1000.
  - Other errors propagated from Paystack API (e.g., invalid email).
- `500 Internal Server Error`:
  - "Internal server error" for unexpected issues.
  - Errors propagated from Paystack API if the request to Paystack fails.

#### POST /payments/verify

Verifies the status of a Paystack transaction using its reference.

**Request**:

```json
{
  "reference": "your_transaction_reference"
}
```

- `reference` (string, required): The unique transaction reference obtained from the `/payments/init` endpoint or Paystack webhook.

**Response**:

```json
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "id": 5607308650,
    "domain": "test",
    "status": "abandoned",
    "reference": "your_transaction_reference",
    "amount": 100000,
    "gateway_response": "The transaction was not completed",
    "paid_at": null,
    "created_at": "2025-12-06T00:26:27.000Z",
    "channel": "card",
    "currency": "NGN",
    "customer": {
      "id": 324043262,
      "first_name": null,
      "last_name": null,
      "email": "customer@example.com",
      "customer_code": "CUS_cys6nfw7c3k7c1o",
      "phone": null,
      "metadata": null,
      "risk_action": "default",
      "international_format_phone": null
    },
    "plan": null,
    "transaction_date": "2025-12-06T00:26:27.000Z"
  }
}
```

(Note: The `amount` in the response data is typically in kobo, so `1000 NGN` translates to `100000`.)

**Errors**:

- `400 Bad Request`:
  - "Invalid Transaction" if the `reference` is missing.
  - Other errors propagated from Paystack API.
- `500 Internal Server Error`:
  - "Internal server error" for unexpected issues.
  - Errors propagated from Paystack API if the verification request fails.

### Badges

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Express.js](https://img.shields.io/badge/Express.js-5.x-informational?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4.x%2B-green?logo=mongodb)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-red?logo=mongoose)
![Zod](https://img.shields.io/badge/Zod-4.x-blueviolet?logo=zod)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
