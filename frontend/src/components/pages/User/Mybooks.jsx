import React, { useEffect, useState } from 'react';
import { getBooksByUser } from '../../../axios/userApi';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Eye, ChatDots } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Mybooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooksByUser();
        setBooks(response.data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleView = (id) => {
    navigate(`/user/readbook/${id}`);
  };

  const handleReview = (id) => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Books</h3>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead className="table">
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Language</th>
                <th>Rating</th>
                <th>Price</th>
                <th>Read</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id}>
                  <td>
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      style={{ width: '60px', height: 'auto' }}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.published_year}</td>
                  <td>{book.language}</td>
                  <td>{book.averageRating} ⭐</td>
                  <td>₹{book.price}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleView(book._id)}
                    >
                      <Eye />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleReview(book._id)}
                    >
                      <ChatDots />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Mybooks;
