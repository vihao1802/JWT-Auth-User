import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./mongoDB/connectDB.js";
import authenRoutes from "./routes/authenUser.js";
import userRoutes from "./routes/user.js";
import apiRoutes from "./routes/api.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors()); // prevent error cross origin from browser
app.use(express.json()); // request , response formatted in json
app.use(cookieParser());

//use routes here
app.use("/v1/auth", authenRoutes);
app.use("/v1/user", userRoutes);
app.use("/api-docs", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hello from JWT");
});

const startServer = () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (error) {}
};

startServer();
