// RBAC middleware: checks if user has required role
module.exports = function(requiredRole) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.roles || !user.roles.includes(requiredRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}; 