# Greensol Node API

A Node.js RESTful API built with Express and MongoDB, featuring user authentication, managing products, and currency conversion using real-time exchange rates. Swagger is used for API documentation.

---

## Project Structure

- `server.js`: Application entry point
- `routes/`: Express route definitions
- `controllers/`: Request handling logic
- `models/`: Mongoose models
- `middleware/`: Authentication, error handling, etc.
- `swagger/`: Swagger setup
- `.env`: Environment configuration file

---

## Features

- User authentication via JWT
- Secure password hashing with bcrypt
- Create and retrieve product listings
- Convert product prices from NGN to other currencies
- Swagger-based API docs at `/api-docs`
- Validation with Joi
- Real-time exchange rates with ExchangeRate API

---

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/PreciousJac0b/api-service-dev.git
cd api-service-dev
```

## Setup Instructions

### 1. Install Dependencies

The following are the key dependencies used in this project:

| Package                | Version    | Description                                      |
|------------------------|------------|--------------------------------------------------|
| `axios`                | ^1.9.0     | Promise-based HTTP client for the browser/node  |
| `bcrypt`               | ^5.1.1     | Library to hash passwords                        |
| `dotenv`               | ^16.5.0    | Loads environment variables from a `.env` file   |
| `express`              | ^5.1.0     | Fast, minimalist web framework for Node.js       |
| `express-async-handler`| ^1.2.0     | Simplifies async error handling in Express       |
| `joi`                  | ^17.13.3   | Object schema description and validation         |
| `jsonwebtoken`         | ^9.0.2     | For generating and verifying JWTs                |
| `lodash`               | ^4.17.21   | Utility library delivering consistency            |
| `mongoose`             | ^8.14.1    | ODM for MongoDB and Node.js                      |
| `swagger-jsdoc`        | ^6.2.8     | Generates Swagger docs from JSDoc                |
| `swagger-ui-express`   | ^5.0.1     | Serves Swagger UI for your API docs              |

Run the command below to install them:
```
npm install
```

### 2. Create Environment Configuration

* Create a .env file in the root directory with the following content:
* Replace the values with yours.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CURRENCY_API_KEY=your_exchange_rate_api_key
```

### 3. Start the Server

```
npm run start

or simply run:

```
nodemon
```


* The server will run on http://localhost:5000


# API Documentation

Swagger documentation is available and testable at:

```
http://localhost:5000/api-docs
```