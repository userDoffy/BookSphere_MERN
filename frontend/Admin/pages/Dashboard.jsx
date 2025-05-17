import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAllOrders, getBooks, getUsers } from "../axios/adminApi";

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, users: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, usersRes, ordersRes] = await Promise.all([
          getBooks(),
          getUsers(),
          getAllOrders()
        ]);
        setStats({
          books: booksRes.data.length,
          users: usersRes.data.length,
          orders: ordersRes.data.length
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">Admin Dashboard</h3>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Books</Card.Title>
              <Card.Text className="fs-4">{stats.books}</Card.Text>
              <Link to="/admin/manage-books">
                <Button variant="primary" size="sm">Manage Books</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="fs-4">{stats.users}</Card.Text>
              <Link to="/admin/manage-users">
                <Button variant="primary" size="sm">Manage Users</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text className="fs-4">{stats.orders}</Card.Text>
              <Link to="/admin/manage-orders">
                <Button variant="primary" size="sm">Manage Orders</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mt-4">
        <Card.Body>
          <Card.Title>Quick Actions</Card.Title>
          <div className="d-flex gap-3 mt-2 align-items-center justify-content-center"> 
            <Link to="/admin/manage-books"><Button variant="outline-dark">Books</Button></Link>
            <Link to="/admin/manage-users"><Button variant="outline-dark">Users</Button></Link>
            <Link to="/admin/manage-orders"><Button variant="outline-dark">Orders</Button></Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
