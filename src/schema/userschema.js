const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: false,
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    number: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      enum: ["seller", "buyer"],
      default: "buyer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);