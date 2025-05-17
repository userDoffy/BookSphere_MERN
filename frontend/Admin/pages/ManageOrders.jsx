import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Badge } from "react-bootstrap";
import { getAllOrders,updateOrderStatus,deleteOrder } from "../axios/adminApi";
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await getAllOrders();
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, field, value) => {
    const order = orders.find(o => o._id === id);
    await updateOrderStatus(id, {
      isPaid: field === "isPaid" ? value : order.isPaid,
      isCompleted: field === "isCompleted" ? value : order.isCompleted,
      isCancelled: field === "isCancelled" ? value : order.isCancelled,
    });
  
    fetchOrders();
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    fetchOrders();
  };

  return (
    <div className="container py-4">
      <h3>Manage Orders</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Books</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Completed</th>
            <th>Cancelled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.user?.name} <br /> <small>{order.user?.email}</small></td>
              <td>
                {order.books.map((b, idx) => (
                  <div key={idx}>
                    {b.title} - ₹{b.price}
                  </div>
                ))}
              </td>
              <td>₹{order.totalPrice}</td>
              <td>
                <Form.Check
                  type="switch"
                  checked={order.isPaid}
                  onChange={(e) => handleStatusUpdate(order._id, "isPaid", e.target.checked)}
                />
              </td>
              <td>
                <Form.Check
                  type="switch"
                  checked={order.isCompleted}
                  onChange={(e) => handleStatusUpdate(order._id, "isCompleted", e.target.checked)}
                />
              </td>
              <td>
                <Form.Check
                  type="switch"
                  checked={order.isCancelled}
                  onChange={(e) => handleStatusUpdate(order._id, "isCancelled", e.target.checked)}
                />
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(order._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageOrders;
