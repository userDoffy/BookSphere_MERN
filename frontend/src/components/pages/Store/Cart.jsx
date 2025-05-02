import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../../../redux/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import {toast} from "react-hot-toast"
import { Link } from "react-router-dom";
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast("❌ Book Removed from Cart!", { icon: "🗑️" });
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast("🗑️ Cart Cleared!", { icon: "✅" })
  };

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning me-1"></i>
        ))}
        {halfStar && <i className="bi bi-star-half text-warning me-1"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-warning me-1"></i>
        ))}
      </>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🛒 Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="list-group mb-4">
            {items.map((book) => (
              <div
                key={book.id}
                className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
              >
                {/* Cover + Title */}
                <div
                  className="d-flex align-items-center"
                  style={{ cursor: "pointer", flex: 2 }}
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    style={{ width: "60px", height: "90px", objectFit: "cover" }}
                    className="me-3 rounded shadow-sm"
                  />
                  <h6 className="mb-0">{book.title}</h6>
                </div>

                {/* Rating */}
                <div className="d-flex justify-content-center" style={{ flex: 1 }}>
                  {renderStars(book.averageRating)}
                </div>

                {/* Date Added */}
                <div className="text-muted small text-center" style={{ flex: 1 }}>
                  {new Date(book.dateAdded).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {/* Price + Remove */}
                <div className="d-flex align-items-center justify-content-end" style={{ flex: 1 }}>
                  <span className="fw-bold text-success me-3">
                    $.{book.price.toFixed(2)}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemove(book.id)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-top pt-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5>Total Items: {totalItems}</h5>
              <h5>
                Total Amount:{" "}
                <span className="text-primary fw-bold">${totalAmount.toFixed(2)}</span>
              </h5>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-danger" onClick={() => handleClear()}>
                <i className="bi bi-trash me-2"></i>Clear Cart
              </button>
              <Link to="/user/checkout" className="btn btn-success">
                <i className="bi bi-credit-card me-2"></i>Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
