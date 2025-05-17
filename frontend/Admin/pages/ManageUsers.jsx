import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Image } from "react-bootstrap";
import { getUsers, deleteUser, updateUser } from "../axios/adminApi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setFormData(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(editId, formData);
    setShowModal(false);
    fetchUsers();
  };

  return (
    <div className="container py-4">
      <h3>Manage Users</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Verified</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {user.profilepic ? (
                  <Image
                    src={user.profilepic}
                    roundedCircle
                    width={40}
                    height={40}
                  />
                ) : (
                  <span>No Pic</span>
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.isAccountVerified ? "Yes" : "No"}</td>
              <td>{user.role}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role || "User"}
                onChange={handleChange}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Profile Picture URL</Form.Label>
              <Form.Control
                name="profilepic"
                value={formData.profilepic || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
