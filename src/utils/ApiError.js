class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
// ApiError is a custom error class that extends JavaScript’s built-in Error.
// It allows throwing structured API errors with HTTP status codes, success flag,
// and optional validation errors. This helps maintain consistent error responses
// across the application and works with asyncHandler + Express error middleware
// for centralized error handling.
