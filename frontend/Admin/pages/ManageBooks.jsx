import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { getBooks,updateBook,deleteBook,addBook } from '../axios/adminApi';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  const fetchBooks = async () => {
    const res = await getBooks();
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditId(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setEditId(book._id);
    setFormData(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      fetchBooks(); 
    }
    catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateBook(editId, formData);
    } else {
      await addBook(formData);
    }
    setShowModal(false);
    fetchBooks();
  };

  return (
    <div className="container py-4">
      <h3>Manage Books</h3>
      <Button variant="primary" className="mb-3" onClick={handleAdd}>
        Add Book
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published_year}</td>
              <td>${book.price}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(book)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(book._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Book" : "Add Book"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Author</Form.Label>
              <Form.Control name="author" value={formData.author || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Published Year</Form.Label>
              <Form.Control name="published_year" type="number" value={formData.published_year || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" type="number" value={formData.price || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cover URL</Form.Label>
              <Form.Control name="cover_url" value={formData.cover_url || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>PDF URL</Form.Label>
              <Form.Control name="pdf_url" value={formData.pdf_url || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description || ""} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageBooks;
