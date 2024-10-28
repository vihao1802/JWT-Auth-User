import bcrypt from "bcrypt";
import User from "../mongoDB/models/user.model.js";
import jwt from "jsonwebtoken";

let refreshTokens = [];

const authenController = {
  // Register
  registerUser: async (req, res) => {
    //  Check empty
    if (!req.body.username)
      return res
        .status(400)
        .json({ status: "error", message: "Username is required" });
    if (!req.body.email)
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    if (!req.body.password)
      return res
        .status(400)
        .json({ status: "error", message: "Password is required" });

    // Check length
    if (req.body.username.length < 6)
      return res.status(400).json({
        status: "error",
        message: "Your username must be at least 6 characters long.",
      });
    if (req.body.email.length < 10)
      return res.status(400).json({
        status: "error",
        message: "Your email must be at least 10 characters long.",
      });
    if (req.body.password.length < 6)
      return res.status(400).json({
        status: "error",
        message: "Your password must be at least 6 characters long.",
      });

    // Check exist
    const existUsername = await User.findOne({
      username: req.body.username,
    });
    if (existUsername)
      // 409: Conflict
      return res.status(409).json({
        status: "error",
        message: "Username already exist",
      });

    const existEmail = await User.findOne({
      email: req.body.email,
    });
    if (existEmail)
      return res.status(409).json({
        status: "error",
        message: "Email already exist",
      });

    console.log(req.body);
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //Save to DB
      const user = await newUser.save();

      res.status(200).json({ message: "Create successful", data: user });
    } catch (error) {
      res.status(500).json({ message: "Register failed", error: error });
    }
  },

  // Generate ACCESS_TOKEN_SECRET
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
  },

  // Generate REFRESH_TOKEN_SECRET
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );
  },

  // Login
  loginUser: async (req, res) => {
    try {
      // Check empty
      if (!req.body.username)
        return res
          .status(400)
          .json({ status: "Bad request", message: "Username is required" });
      if (!req.body.password)
        return res
          .status(400)
          .json({ status: "Bad request", message: "Password is required" });

      //  Find the username in database
      const user = await User.findOne({
        username: req.body.username,
      });

      // Check username is valid
      if (!user) {
        return res.status(404).json({ message: "Wrong username" });
      }

      // Check password is equal
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      // Check password is valid
      if (!validPassword)
        return res.status(404).json({ message: "Wrong password" });

      const accessToken = authenController.generateAccessToken(user);
      const refreshToken = authenController.generateRefreshToken(user);

      refreshTokens.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict", // ngăn chặn CSRF -> request chỉ đến được từ site này
      });
      // bỏ cái password ra khỏi user thông qua others
      // ._doc when use monggodb and other cases is unnecessary
      const { password, ...others } = user._doc;

      res.status(200).json({
        message: "Login successful",
        others,
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error });
    }
  },

  // REQUEST REFRESH TOKEN
  // có thể dùng Redis để lưu refresh token
  requestRefreshToken: async (req, res) => {
    // Take refresh token from user
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ message: "You're not signed in" });

    if (!refreshTokens.includes(refreshToken))
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ status: "Forbidden", message: "Invalid token" });

      // Remove refreshToken out of refreshTokens
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Create new accessToken and refreshToken
      const newAccessToken = authenController.generateAccessToken(user);
      const newRefreshToken = authenController.generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict", // ngăn chặn CSRF -> request chỉ đến được từ site này
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  // Logout
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json({ message: "Logout successful" });
  },
};

/* 
  STORAGE TOKEN
  1) Local storage:
  - Dễ bị tấn công XSS
  2) HTTPONLY Cookies: 
  - Dễ bị tấn công CSRF -> Khắc phục SAMESITE
  3) 
  - REDUX store -> ACCESS TOKEN
  - HTTPONLY Cookies -> REFRESH TOKEN

  // Có thể ngăn chặn những điều trên bằng
  - BFF PATTERN (Backend For Frontend)
  -> tối ưu bảo mật

*/

export default authenController;
