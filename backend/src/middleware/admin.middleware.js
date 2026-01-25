const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      admin:req.user,
      message: "Admin access1 required",
    });
  }
  next();
};

module.exports = adminOnlyMiddleware;
