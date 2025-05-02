import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

const bookSchema = mongoose.Schema(
  {
    id: Number,
    title: String,
    author: String,
    language: String,
    genres: [String],
    published_year: Number,
    description: String,
    pdf_url: String,
    cover_url: String,
    price: Number,
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 }
  },
  { timestamps: true }
);
export default mongoose.model("Book", bookSchema);
