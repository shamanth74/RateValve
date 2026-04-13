const express = require("express");
const jwtAuthMiddleware = require("../middleware/jwtAuth.middleware");
const adminOnlyMiddleware = require("../middleware/admin.middleware");
const {
  listUsers,
  getUserDetails,
  changeTier,
  blockUserHandler,
  unblockUserHandler,
} = require("../controllers/admin.controller");

const router = express.Router();

// All admin routes require JWT + admin role
router.use(jwtAuthMiddleware, adminOnlyMiddleware);

router.get("/users", listUsers);
router.get("/users/:id", getUserDetails);
router.patch("/users/:id/tier", changeTier);
router.patch("/users/:id/block", blockUserHandler);
router.patch("/users/:id/unblock", unblockUserHandler);

module.exports = router;
