import Book from "../models/bookModel.js";

export const latest = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 16;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments();

        res.status(200).json({
            status: 'success',
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const popular = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 16;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ averageRating: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments();

        res.status(200).json({
            status: 'success',
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ status: "error", message: "Book not found" });
        }   
        res.status(200).json({ status: "success", book });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }       
}

export const searchBooks = async (req, res) => {
  try {
    const { keyword = "" } = req.query;

    const query = {};

    // Keyword search (if provided)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { author: { $regex: keyword, $options: "i" } },
      ];
    }

    // Paginate and retrieve books
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({ books, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Error searching books" });
  }
};
