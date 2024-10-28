import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 6,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      min: 10,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    admin: {
      type: Boolean,
      default: false, //set type default is false
    },
  },
  { timestamps: true }
);

const userSchema = mongoose.model("User", userModel);

export default userSchema;
