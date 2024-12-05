import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { formatToRupees } from '../utils/currency';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, loading, error } = useCart();
  const navigate = useNavigate();

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = 50.00; // Changed to ₹50

  return (
    <Container className="my-4">
      <h2 className="mb-4">Shopping Cart</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Alert variant="info">Updating cart...</Alert>}
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your cart is empty</h4>
          <Button variant="primary" onClick={() => navigate('/medicines')} className="mt-3">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup>
              {cartItems.map(item => (
                <ListGroup.Item key={item.id} className="mb-2">
                  <Row className="align-items-center">
                    <Col xs={3}>
                      <img src={item.image} alt={item.name} className="img-fluid rounded" />
                    </Col>
                    <Col xs={4}>
                      <h5>{item.name}</h5>
                      <p className="text-muted mb-0">{formatToRupees(item.price)}</p>
                    </Col>
                    <Col xs={3}>
                      <div className="d-flex align-items-center">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={loading || item.quantity <= 1}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                    </Col>
                    <Col xs={2} className="text-end">
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>{formatToRupees(calculateTotal())}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Delivery:</span>
                    <span>{formatToRupees(deliveryFee)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>{formatToRupees(calculateTotal() + deliveryFee)}</span>
                  </ListGroup.Item>
                </ListGroup>
                <Button 
                  variant="primary" 
                  className="w-100 mt-3"
                  onClick={() => navigate('/checkout')}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
