import express from "express";
import authenController from "../controllers/authenControllers.js";
import middlewareController from "../controllers/middlewareController.js";

const router = express.Router();

router.route("/register").post(authenController.registerUser);
router.route("/login").post(authenController.loginUser);
router.route("/refresh").post(authenController.requestRefreshToken);
router
  .route("/logout")
  .post(middlewareController.verifyToken, authenController.userLogout);

export default router;
