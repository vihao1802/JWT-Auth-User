import express from "express";
import swaggerSpecs from "../api/docs/SwaggerDoc.js";
import swaggerUI from "swagger-ui-express";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/document");
});

router.use("/document", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

export default router;
