export const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      try {
        // Ensure user role exists on the request object
        if (!req.user || !req.user.role) {
          return res.status(403).json({
            status: "error",
            message: "Access denied. No role information available.",
          });
        }
  
        // Check if the user's role matches the required role
        if (req.user.role !== requiredRole) {
          return res.status(403).json({
            status: "error",
            message: "Access denied. Insufficient permissions.",
          });
        }
  
        // User has the required role, proceed to the next middleware
        next();
      } catch (error) {
        console.error("Error in role middleware:", error.message);
        res.status(500).json({
          status: "error",
          message: "An error occurred while checking permissions.",
        });
      }
    };
  };
  
  