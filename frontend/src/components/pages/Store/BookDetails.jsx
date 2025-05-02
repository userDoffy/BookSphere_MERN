import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart,removeFromCart } from "../../../redux/cart/cartSlice";
import toast, { Toaster } from "react-hot-toast";
import { getBookDetails } from "../../../axios/storeApi";
import { useNavigate } from "react-router-dom";

const BookDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await getBookDetails(id);
        setBook(data.book || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchBook();
  }, [id]);

  

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
    toast("📚 Book Added to Cart!", { icon: "✅" });;
  };

  const removeFromCartHandler = () => {
    dispatch(removeFromCart(book._id));
    toast("❌ Book Removed from Cart!", { icon: "🗑️" });
  }

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
  }
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa-star ${
          i < Math.round(rating) ? "fas text-warning" : "far text-muted"
        }`}
      ></i>
    ));

  if (!book) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-4">
      
      <div className="row">
        {/* Left: Cover Image */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <img
              src={book.cover_url}
              alt={book.title}
              className="card-img-top"
            />
          </div>
        </div>

        {/* Right: Book Info */}
        <div className="col-md-8">
          <h2>{book.title}</h2>
          <h5 className="text-muted">{book.author}</h5>
          <div className="mb-2">
            {renderStars(book.averageRating)} ({book.averageRating.toFixed(1)})
          </div>

          <p>
            <strong>Language:</strong> {book.language}
          </p>
          <p>
            <strong>Published:</strong> {book.published_year}
          </p>

          <div className="mb-2">
            <strong>Genres:</strong>
            <div className="mt-1 d-flex flex-wrap gap-2 justify-content-center">
              {book.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="badge rounded-pill bg-success-subtle text-success px-3 py-2"
                  style={{ backgroundColor: "#e6f4ea", color: "#198754" }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-3">{book.description}</p>

          <div className="d-flex gap-3 mt-4 justify-content-center">
            {items.some((item) => item.id === book._id) ? (
              <button
                className="btn btn-danger d-flex align-items-center gap-2"
                onClick={removeFromCartHandler}
              >
                <i className="bi bi-cart-dash"></i> Remove from Cart
              </button>
            ) : (
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={addToCartHandler}
              >
                <i className="bi bi-cart-plus"></i> Add to Cart
              </button>
            )}
            
            <button className="btn btn-outline-success d-flex align-items-center gap-2" onClick={buyNowHandler}>
              <i className="bi bi-credit-card"></i> Buy Now - $.{book.price}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h4 className="mb-4">User Reviews</h4>
        {book.reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <div className="list-group">
            {book.reviews.map((review, idx) => (
              <div key={idx} className="list-group-item mb-3 shadow-sm rounded">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>{review.username}</strong>
                  <small className="text-muted">
                    {new Date(review.date).toLocaleDateString()}
                  </small>
                </div>
                <div className="mb-1">{renderStars(review.rating)}</div>
                <p className="mb-0">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
