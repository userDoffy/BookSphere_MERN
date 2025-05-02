import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getOrders } from "../../../axios/userApi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const success = query.get("success");
    const canceled = query.get("canceled");

    if (success) {
      toast.success("Payment successful!");
    } else if (canceled) {
      toast.error("Payment was cancelled.");
    }

    const fetchOrders = async () => {
      try {
        const { data } = await getOrders();
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders.");
      }
    };

    fetchOrders();
  }, [location.search, token]);

  return (
    <div className="container py-4">
      <h4 className="mb-4">My Orders</h4>
      {orders.length === 0 ? (
        <div className="text-muted">No orders found.</div>
      ) : (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Books</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Completed</th>
              <th>Cancelled</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>
                  {order.books.map((b, i) => (
                    <div key={i}>- {b.book.title}</div>
                  ))}
                </td>
                <td>$ {order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isCompleted ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isCancelled ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MyOrders;
