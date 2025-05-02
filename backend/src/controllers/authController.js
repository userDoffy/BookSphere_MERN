import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";
import { sendOtpEmail } from "../utils/nodemailer.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res, next) => {
  try {
    const { name, email, password,phone,address } = req.body;
    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const Otp = Math.floor(100000 + Math.random() * 900000).toString();
    const OtpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      Otp,
      OtpExpireAt,
    });
    await sendOtpEmail(email, Otp);

    res
      .status(201)
      .json({
        status: "success",
        message: "User registered! Please verify OTP to continue",
        email,
      });
  } catch (error) {
    next(error);
  }
};

export const verifyotp = async (req, res, next) => {
  try {
    const { email, Otp } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (user.Otp !== Otp || user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired OTP" });
    }
    user.Otp = null;
    user.OtpExpireAt = null;
    user.isAccountVerified = true;
    await user.save();
    res
      .status(200)
      .json({ status: "success", message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid || !user.isAccountVerified) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password." });
    }

    if (!(user.role === role)) {
      return res
        .status(400)
        .json({ status: "error", message: "Your role doesn't match." });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged in successfully!"});
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const _id = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await Users.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: "error", message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  const _id = req.user._id;
  const user = await Users.findById(_id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  const {name,email,address,phone,role,isAccountVerified} = user
  
  const host = req.protocol + "://" + req.get("host");
  const profilepic = user.profilepic ? `${host}${user.profilepic}` : "";

  res.status(200).json({ status: "success", user: { name,email,address,phone,role,profilepic,isAccountVerified } });
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    // Handle profile picture upload
    if (req.file) {
      const newPicPath = `/uploads/profilepics/${req.file.filename}`;
      updates.profilepic = newPicPath;

      // Delete old profile pic if exists
      const user = await Users.findById(userId);
      if (user.profilepic && user.profilepic !== "") {
        const oldPath = path.join("uploads", user.profilepic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updatedUser = await Users.findByIdAndUpdate(userId, updates, { new: true });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};