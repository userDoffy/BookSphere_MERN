import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Store.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Store = ({ books, totalPages, page, setPage }) => {
  const [sortBy, setSortBy] = useState("none"); // State to manage sorting
  const [sortDirection, setSortDirection] = useState("asc"); // Direction for sorting (ascending or descending)

  const handleSort = (criteria) => {
    // Toggle the direction of sorting if the same criteria is selected
    if (sortBy === criteria) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(criteria);
      setSortDirection("asc");
    }
  };

  // Sorting logic based on selected criteria and direction
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "rating") {
      return sortDirection === "asc" ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
    } else if (sortBy === "price") {
      return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "year") {
      return sortDirection === "asc" ? a.published_year - b.published_year : b.published_year - a.published_year;
    }
    return 0;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa-star ${i < Math.round(rating) ? "fas text-warning" : "far text-muted"}`}
      ></i>
    ));
  };

  return (
    <div className="container py-4">
      {/* Sorting options */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-link p-0 text-muted me-2"
          onClick={() => handleSort("rating")}
          style={{ fontSize: "0.8rem" }}
        >
          Rating{" "}
          <i
            className={`bi bi-arrow-${sortBy === "rating" && sortDirection === "asc" ? "down" : "up"}`}
            style={{ fontSize: "0.8rem" }}
          ></i>
        </button>
        <button
          className="btn btn-link p-0 text-muted me-2"
          onClick={() => handleSort("price")}
          style={{ fontSize: "0.8rem" }}
        >
          Price{" "}
          <i
            className={`bi bi-arrow-${sortBy === "price" && sortDirection === "asc" ? "down" : "up"}`}
            style={{ fontSize: "0.8rem" }}
          ></i>
        </button>
        <button
          className="btn btn-link p-0 text-muted"
          onClick={() => handleSort("year")}
          style={{ fontSize: "0.8rem" }}
        >
          Year{" "}
          <i
            className={`bi bi-arrow-${sortBy === "year" && sortDirection === "asc" ? "down" : "up"}`}
            style={{ fontSize: "0.8rem" }}
          ></i>
        </button>
      </div>

      {/* Book list */}
      <div className="row g-3">
        {sortedBooks.map((book) => (
          <div key={book._id} className="col-6 col-sm-4 col-md-3">
            <Link to={`/book/${book._id}`} className="text-decoration-none text-dark">
              <div className="card latest-card shadow-sm h-100">
                <img
                  src={book.cover_url}
                  className="card-img-top latest-cover"
                  alt={book.title}
                />
                <div className="card-body p-2">
                  <h6 className="card-title mb-1 text-truncate">{book.title}</h6>
                  <p className="card-subtitle text-muted small text-truncate">{book.author}</p>
                  <div className="star-rating mt-1">{renderStars(book.averageRating)}</div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <span className="price-tag badge bg-success">${book.price}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-4 d-flex justify-content-center">
        <ul className="pagination pagination-sm">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              style={{ width: "32px", height: "32px" }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          <li className="page-item active">
            <span
              className="page-link border-0 fw-bold text-dark bg-light"
              style={{
                borderRadius: "1rem",
                padding: "0.4rem 1rem",
                fontSize: "0.9rem",
                backgroundColor: "#f1f1f1",
              }}
            >
              Page {page}
            </span>
          </li>

          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              style={{ width: "32px", height: "32px" }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Store;
