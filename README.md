# Backend Authentication App

This is a Node.js-based backend project demonstrating authentication using **JWT** and **session management** with **MongoDB** for session storage. It includes user signup, login, and logout functionalities along with basic security features like rate limiting, helmet for security headers, CORS, and logging.

## Features

- **User Authentication**: Signup, login, and logout routes.
- **JWT**: JSON Web Token is used to generate and verify tokens.
- **Session Management**: Sessions are stored in MongoDB, with support for secure cookies.
- **Rate Limiting**: Prevents abuse with a rate limit of 100 requests per 15 minutes.
- **Security**: Includes Helmet for setting security-related HTTP headers.
- **CORS**: Cross-Origin Resource Sharing is enabled.
- **Custom Logging**: Logs requests and errors to a custom logger.
- **Testing**: Includes test cases for user authentication using `Jest` or any testing framework.
- **Error Handling**: Centralized error handling for all routes.
