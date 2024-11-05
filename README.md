# Backend Authentication App

This is a Node.js-based backend project demonstrating authentication using **JWT** and **session management** with **MongoDB** for session storage. It includes user signup, login, and logout functionalities along with basic security features like rate limiting, helmet for security headers, CORS, and logging.

## Features

- **User Authentication**: Signup, login, and logout routes.
- **JWT**: JSON Web Token generates and verifies tokens.
- **Session Management**: Sessions are stored in MongoDB, supporting secure cookies.
- **Rate Limiting**: Prevents abuse with a rate limit of 100 requests per 15 minutes.
- **Security**: Includes Helmet for setting security-related HTTP headers.
- **CORS**: Cross-Origin Resource Sharing is enabled.
- **Custom Logging**: Logs requests and errors to a custom logger.
- **Testing**: Includes test cases for user authentication using `Jest` 
- **Error Handling**: Centralized error handling for all routes.


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayiaware/mern-auth-backend.git

2. Install dependencies:
   ```bash
   cd mern-auth-backend
   npm install

3. Create a .env file in the root directory and add the following variables:
  MONGO_URI=your_mongo_connection_string
  PORT=4000
  SECRET=your_jwt_secret
  SESSION_SECRET=your_session_secret

4. Start the server:
    ```bash
    npm start

## Testing
   ```bash
   npm test 
  ```

Dependencies
- Express: Framework for building server-side applications.
- Mongoose: ODM for MongoDB.
- jsonwebtoken: For generating JWT tokens.
- express-session: Session management.
- connect-mongo: Storing sessions in MongoDB.
- express-rate-limit: Rate limiting to prevent abuse.
- helmet: Security middleware for HTTP headers.
- cors: To enable cross-origin requests.
- jest: For testing.
- winston: For logging.
