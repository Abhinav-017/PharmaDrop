import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatToRupees } from '../utils/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load orders from localStorage and add status and estimated delivery
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersWithStatus = savedOrders.map(order => ({
      ...order,
      status: 'dispatched', // Set initial status as dispatched
      estimatedDelivery: getEstimatedDelivery(order.date),
      trackingStatus: getTrackingStatus(order.date)
    }));
    setOrders(ordersWithStatus);
  }, []);

  const getEstimatedDelivery = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5); // Add 5 days for delivery
    return deliveryDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTrackingStatus = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const hoursSinceOrder = Math.floor((now - orderTime) / (1000 * 60 * 60));

    if (hoursSinceOrder < 24) {
      return 'Order Confirmed & Processing';
    } else if (hoursSinceOrder < 48) {
      return 'Dispatched from Warehouse';
    } else if (hoursSinceOrder < 72) {
      return 'In Transit';
    } else {
      return 'Out for Delivery';
    }
  };

  const getStatusBadge = (status, orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const hoursSinceOrder = Math.floor((now - orderTime) / (1000 * 60 * 60));

    if (hoursSinceOrder < 24) {
      return (
        <Badge bg="info" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faClock} className="me-1" />
          Processing
        </Badge>
      );
    } else {
      return (
        <Badge bg="success" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faTruck} className="me-1" />
          Dispatched
        </Badge>
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          Please login to access the dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Profile</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name:</strong> {user.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {user.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Role:</strong> {user.role}
                </ListGroup.Item>
              </ListGroup>
              <Button 
                variant="outline-primary" 
                className="w-100 mt-3"
                onClick={() => navigate('/medicines')}
              >
                Browse Medicines
              </Button>
              <Button 
                variant="outline-danger" 
                className="w-100 mt-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4">Order History</Card.Title>
              {orders.length === 0 ? (
                <Alert variant="info">
                  No orders found. Start shopping to see your orders here!
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {orders.map((order, index) => (
                    <ListGroup.Item key={index} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <h6 className="mb-1">Order #{order.paymentDetails?.id.slice(-8) || index + 1}</h6>
                          <small className="text-muted">
                            Ordered on: {new Date(order.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                        <div className="text-end">
                          <h6 className="mb-1">{formatToRupees(order.total)}</h6>
                          {getStatusBadge(order.status, order.date)}
                        </div>
                      </div>

                      <Card className="bg-light mb-3">
                        <Card.Body>
                          <h6 className="mb-2">Tracking Status</h6>
                          <p className="mb-1">
                            <FontAwesomeIcon icon={faTruck} className="me-2 text-primary" />
                            {order.trackingStatus}
                          </p>
                          <small className="text-muted">
                            Estimated Delivery: {order.estimatedDelivery}
                          </small>
                        </Card.Body>
                      </Card>

                      <div className="mb-3">
                        <h6 className="mb-2">Items Ordered:</h6>
                        <ListGroup variant="flush">
                          {order.items.map((item, i) => (
                            <ListGroup.Item key={i} className="bg-light">
                              <div className="d-flex justify-content-between align-items-center">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{formatToRupees(item.price * item.quantity)}</span>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>

                      <div>
                        <h6 className="mb-2">Delivery Address:</h6>
                        <p className="mb-0 text-muted">
                          {order.customerInfo.firstName} {order.customerInfo.lastName}<br />
                          {order.customerInfo.address}
                        </p>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
