import Users from "../models/userModel.js";
import Books from "../models/bookModel.js";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";

export const getCurrentUser = async (req, res) => {
  const _id = req.user._id;
  const user = await Users.findById(_id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  const { name, email, address, phone, role, isAccountVerified } = user;

  const host = req.protocol + "://" + req.get("host");
  const profilepic = user.profilepic ? `${host}${user.profilepic}` : "";

  res
    .status(200)
    .json({
      status: "success",
      user: {
        _id,
        name,
        email,
        address,
        phone,
        role,
        profilepic,
        isAccountVerified,
      },
    });
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

    const updatedUser = await Users.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

export const getBooksByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const books = await Users.findById(userId).populate("ownedBooks");
    if (!books) {
      return res
        .status(404)
        .json({ success: false, message: "No books found" });
    }
    res.status(200).json({ success: true, books: books.ownedBooks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};

export const addReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    const { rating, comment, username } = req.body.reviewData;
    
    const user = await Users.findById(userId).populate("ownedBooks");
    const ownsBook = user.ownedBooks.some(
      (book) => book._id.toString() === bookId
    );
    if (!ownsBook) {
      return res
        .status(403)
        .json({ success: false, message: "You do not own this book" });
    }

    // Find the book
    const book = await Books.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Add review
    const newReview = {
      username,
      rating,
      comment,
      date: new Date(),
    };

    book.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
    book.averageRating =
      book.reviews.length > 0 ? totalRating / book.reviews.length : 0;

    await book.save();

    res
      .status(200)
      .json({ success: true, message: "Review added successfully", book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

export const getBookforUser = async (req, res) => {
  const userId = req.user._id
  const bookId = req.params.bookId;
  try {
    const user = await Users.findById(userId).populate("ownedBooks");
    const ownsBook = user.ownedBooks.some(
      (book) => book._id.toString() === bookId
    );
    if (!ownsBook) {
      return res
        .status(403)
        .json({ success: false, message: "You do not own this book" });
    }

    const book = await Books.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch book" });
  }
}