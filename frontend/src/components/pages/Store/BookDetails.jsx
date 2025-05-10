import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../redux/cart/cartSlice";
import toast from "react-hot-toast";
import { getBookDetails } from "../../../axios/storeApi";
import { getBooksByUser } from "../../../axios/userApi";
import { addReview } from "../../../axios/userApi"; // You'll create this API function

import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const BookDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [owned, setOwned] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);

  const { items } = useSelector((state) => state.cart);
  const { token, name } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await getBookDetails(id);
        setBook(data.book || {});
        if (token) {
          const response = await getBooksByUser();
          const userBooks = response.data.books;
          const isOwned = userBooks.some((userBook) => userBook._id === id);
          setOwned(isOwned);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, token]);

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        id: book._id,
        title: book.title,
        cover_url: book.cover_url,
        averageRating: book.averageRating,
        price: book.price,
        dateAdded: new Date().toString(),
      })
    );
    toast.success("📚 Book Added to Cart!");
  };

  const removeFromCartHandler = () => {
    dispatch(removeFromCart(book._id));
    toast("❌ Book Removed from Cart!", { icon: "🗑️" });
  };

  const buyNowHandler = () => {
    dispatch(
      addToCart({
        id: book._id,
        title: book.title,
        cover_url: book.cover_url,
        averageRating: book.averageRating,
        price: book.price,
        dateAdded: new Date().toString(),
      })
    );
    navigate("/cart");
    toast("🛒 Redirecting to Cart!", { icon: "✅" });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookId = id;
      const review = {
        rating: reviewData.rating,
        comment: reviewData.comment,
        username: name,
      };

      await addReview(bookId, review);
      toast.success("Review submitted!");
      setReviewData({ rating: 5, comment: "" });
      // Refresh book to show new review
      const { data } = await getBookDetails(id);
      setBook(data.book || {});
    } catch (err) {
      console.error("Error submitting review", err);
      toast.error("Failed to submit review.");
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa-star ${
          i < Math.round(rating) ? "fas text-warning" : "far text-muted"
        }`}
      ></i>
    ));

  if (loading || !book)
    return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-3">
      <div className="row">
        {/* Cover */}
        <div className="col-md-4 mb-3 d-flex align-items-start justify-content-center">
          <div
            className="card shadow-sm border-0"
            style={{ maxWidth: "250px" }}
          >
            <img
              src={book.cover_url}
              alt={book.title}
              className="card-img-top img-fluid p-2"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="col-md-8">
          <h4 className="fw-bold">{book.title}</h4>
          <h6 className="text-muted">{book.author}</h6>
          <div className="mb-2 small">
            {renderStars(book.averageRating)} ({book.averageRating?.toFixed(1)})
          </div>

          <p className="mb-1">
            <strong>Language:</strong> {book.language}
          </p>
          <p className="mb-1">
            <strong>Published:</strong> {book.published_year}
          </p>

          {/* Genres */}
          <div className="mb-2 text-center">
            <strong>Genres:</strong>
            <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
              {book.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="badge bg-light text-success border px-2 py-1"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <p className="small mt-3">{book.description}</p>

          {/* Buttons */}
          <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
            {owned ? (
              <>
                <span className="badge bg-success px-3 py-2 fs-6">
                  <i className="bi bi-check-circle-fill me-2"></i>Owned
                </span>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() =>
                    navigate(`/user/readbook`, {
                      state: { title: book.title, id: book._id },
                    })
                  }
                >
                  <i className="bi bi-book"></i> Read Now
                </button>
              </>
            ) : items.some((item) => item.id === book._id) ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={removeFromCartHandler}
              >
                <i className="bi bi-cart-dash"></i> Remove from Cart
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={addToCartHandler}
                >
                  <i className="bi bi-cart-plus"></i> Add to Cart
                </button>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={buyNowHandler}
                >
                  <i className="bi bi-credit-card"></i> Buy Now - ₹{book.price}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-4">
        <h5 className="mb-3">User Reviews</h5>
        {book.reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <div className="list-group">
            {book.reviews.map((review, idx) => (
              <div
                key={idx}
                className="list-group-item small shadow-sm mb-2 rounded"
              >
                <div className="d-flex justify-content-between mb-1">
                  <strong>{review.username}</strong>
                  <small className="text-muted">
                    {new Date(review.date).toLocaleDateString()}
                  </small>
                </div>
                <div className="mb-1">{renderStars(review.rating)}</div>
                <p className="mb-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        {owned && (
          <div className="mt-4">
            <h6>Add Your Review</h6>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-2">
                <label className="form-label small">Rating</label>
                <select
                  className="form-select form-select-sm"
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      rating: parseInt(e.target.value),
                    })
                  }
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 && "s"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label small">Comment</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  required
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                ></textarea>
              </div>
              <button type="submit" className="btn btn-success btn-sm">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
