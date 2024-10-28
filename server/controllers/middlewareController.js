import jwt from "jsonwebtoken";

const middlewareController = {
  // verify token
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      // Bearer abc123
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
          return res
            .status(403)
            .json({ status: "Forbidden", message: "Invalid token" });
        console.log(user);
        req.user = user; // used for function verifyTokenAndAdminAuth() below
        next();
      });
    } else {
      return res
        .status(401)
        .json({
          status: "Not authenticated",
          message: "You're not sign in or haven't passed access token yet",
        });
    }
  },
  // verify for delete user
  // if you're user not admin , you can not delete other
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "You're not allowed to delete other" });
      }
    });
  },
};

export default middlewareController;
