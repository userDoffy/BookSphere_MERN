import mongoose from 'mongoose';
import Book from '../models/bookModel.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DB_URI);

const updateBooks = async () => {
  try {
    const books = await Book.find();
    for (let book of books) {
      const randomRating = (Math.random() * 2 + 3).toFixed(1); // 3.0 - 5.0
      const randomPrice = Math.floor(Math.random() * (300 - 100 + 1)) + 100;

      book.averageRating = parseFloat(randomRating);
      book.price = randomPrice;
      await book.save();
    }
    console.log('Books updated successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

updateBooks();
