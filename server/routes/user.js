import express from "express";
import userController from "../controllers/userController.js";
import middlewareController from "../controllers/middlewareController.js";

const router = express.Router();

// Get all users
router
  .route("/getallusers")
  .get(middlewareController.verifyToken, userController.getAllUser);

// Delete user
router
  .route("/deleteuser/:id")
  .delete(
    middlewareController.verifyTokenAndAdminAuth,
    userController.deleteUser
  );

export default router;
