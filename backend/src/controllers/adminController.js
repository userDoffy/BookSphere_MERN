import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
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
      secure: true,
      sameSite: "None",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged in successfully!"});
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

export const getAdmin= async (req, res) => {
  const _id = req.user._id;
  const user = await Admin.findById(_id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  const {name,email,address,phone,role} = user

  res.status(200).json({ status: "success", user: {_id, name,email,address,phone,role} });
};

//for manageing books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// Add a new book
export const addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Failed to add book" });
  }
};

// Update book by ID
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Failed to update book" });
  }
};

// Delete book by ID
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book" });
  }
};

//for managing users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -Otp -OtpExpireAt"); // Exclude sensitive info
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("books.book", "title");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// UPDATE order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { isPaid, isCompleted, isCancelled } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(
      id,
      { isPaid, isCompleted, isCancelled },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// DELETE order
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};