import Users from "../models/userModel.js";
import Books from "../models/bookModel.js";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import axios from "axios";
import PDFDocument from "pdfkit";
import stream from "stream";
import iconv from "iconv-lite";

export const getCurrentUser = async (req, res) => {
  const _id = req.user._id;
  const user = await Users.findById(_id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  const { name, email, address, phone, role, isAccountVerified } = user;

  const host = req.protocol + "://" + req.get("host");
  const profilepic = user.profilepic ? `${host}${user.profilepic}` : "";

  res.status(200).json({
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


export const getBookPdf = async (req, res) => {
  const userId = req.user._id;
  const bookId = req.params.bookId;

  try {
    // Step 1: Check if user owns the book
    const user = await Users.findById(userId).populate('ownedBooks');
    const ownsBook = user.ownedBooks.some(book => book._id.toString() === bookId);
    if (!ownsBook) {
      return res.status(403).json({ message: 'You do not own this book' });
    }

    // Step 2: Fetch the book and validate its URL
    const book = await Books.findById(bookId);
    if (!book || !book.pdf_url.endsWith('.txt')) {
      return res.status(404).json({ message: 'Book or text version not found' });
    }

    // Step 3: Fetch the raw text file from Gutenberg
    const response = await axios.get(book.pdf_url, { responseType: 'arraybuffer' });
    const rawBuffer = Buffer.from(response.data);

    // Step 4: Decode using best-guess encoding (fallback to windows-1252 if UTF-8 has garbage)
    let textContent = iconv.decode(rawBuffer, 'utf-8');
    if (textContent.includes('Ð')) {
      textContent = iconv.decode(rawBuffer, 'windows-1252');
    }

    // Step 5: Clean and normalize the text
    textContent = textContent
      .replace(/Ð/g, '') // Remove stray Ð characters
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
      .replace(/[^\x00-\x7F]+/g, '') // Strip remaining non-ASCII
      .replace(/\*{3} START OF.*?\*{3}/s, '') // Remove Gutenberg START marker
      .replace(/\*{3} END OF.*?\*{3}/s, '') // Remove Gutenberg END marker
      .trim();

    // Step 6: Generate the PDF
    const doc = new PDFDocument({ margin: 50 });
    const streamPass = new stream.PassThrough();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${book.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`
    );

    doc.pipe(streamPass);
    doc.font('Times-Roman').fontSize(12).text(textContent, {
      align: 'left',
      lineGap: 4
    });
    doc.end();

    streamPass.pipe(res);

  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};
