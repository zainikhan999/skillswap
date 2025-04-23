import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookiesOptions = {
  expires: 15 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const connectDB = (uri) => {
  mongoose
    .connect(uri)
    .then((data) => {
      console.log(`MongoDB connected successfully : ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

const sendToken = (req, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
  return res.status(code).cookie("token", token, cookiesOptions).json({
    success: true,
    user,
    message,
  });
};

export { connectDB, cookiesOptions, sendToken };
