import User from "../mongoDB/models/user.model.js";

const userController = {
  // Get all user
  getAllUser: async (req, res) => {
    try {
      const users = await User.find();

      res
        .status(200)
        .json({ message: "Get all users successful", data: users });
    } catch (error) {
      res.status(500).json({ status: "error", message: error });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ message: "Delete user successful" });
    } catch (error) {
      res.status(500).json({ status: "Error", message: error });
    }
  },
};

export default userController;
