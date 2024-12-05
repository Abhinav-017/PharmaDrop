import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTruck, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import PaymentForm from './PaymentForm';
import { formatToRupees } from '../utils/currency';

const OrderSummary = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { cartItems, clearCart } = useCart();
  const [orderTotal, setOrderTotal] = useState({ subtotal: 0, delivery: 50.00, total: 0 });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = 50.00;
    setOrderTotal({
      subtotal,
      delivery,
      total: subtotal + delivery
    });
  }, [cartItems, navigate]);

  const [formData, setFormData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const newFormData = {
      customerInfo: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value
      },
      items: cartItems,
      total: orderTotal.total,
      date: new Date().toISOString()
    };

    setFormData(newFormData);
    setShowPayment(true);
    setValidated(true);
  };

  const handlePaymentSuccess = (details) => {
    setLoading(true);
    setError(null);

    const orderData = {
      ...formData,
      paymentDetails: {
        id: details.id,
        status: details.status,
        payerId: details.payer.payer_id,
        paymentMethod: 'Card'
      }
    };

    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    clearCart();
    setOrderPlaced(true);
    setLoading(false);
  };

  const handlePaymentError = (err) => {
    setError('Payment failed. Please try again.');
    setShowPayment(false);
  };

  if (orderPlaced) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center p-4">
              <Card.Body>
                <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="4x" />
                <h2 className="mb-3">Order Placed Successfully!</h2>
                <p className="mb-4">Thank you for your purchase of {formatToRupees(orderTotal.total)}</p>
                
                <div className="d-flex align-items-center justify-content-center text-primary mb-4">
                  <FontAwesomeIcon icon={faTruck} className="me-2" />
                  <span>Your items will be dispatched shortly</span>
                </div>

                <div className="d-flex align-items-center justify-content-center text-muted mb-4">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  <span>Order confirmation sent to your email</span>
                </div>

                <div className="border-top pt-4">
                  <p className="text-muted mb-4">Expected delivery within 3-5 business days</p>
                  <Button variant="primary" onClick={() => navigate('/medicines')} className="w-100">
                    Continue Shopping
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Checkout</h2>
      <Button 
        variant="outline-secondary" 
        className="mb-4"
        onClick={() => navigate('/cart')}
      >
        Back to Cart
      </Button>
      <Row>
        <Col md={8}>
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Delivery Information</h4>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your first name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your last name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    required
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid 10-digit phone number.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    name="address"
                    rows={3}
                    placeholder="Enter your complete delivery address"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your delivery address.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={loading || showPayment}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>

                {showPayment && (
                  <div className="mt-4">
                    <h5 className="mb-3">Payment Method</h5>
                    <PaymentForm
                      amount={orderTotal.total}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4 className="mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Items Total:</span>
                <span>{formatToRupees(orderTotal.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>{formatToRupees(orderTotal.delivery)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>{formatToRupees(orderTotal.total)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSummary;
