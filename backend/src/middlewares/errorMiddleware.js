export const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err.stack); // Logs full error stack in development
  
    const statusCode = err.statusCode || 500; // Default to 500 for server errors
    const message = err.message || "An unexpected error occurred.";
  
    res.status(statusCode).json({
      status: "error",
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack trace in development
    });
  };
  