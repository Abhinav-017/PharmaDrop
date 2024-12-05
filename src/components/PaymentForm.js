import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col, Modal } from 'react-bootstrap';
import { formatToRupees } from '../utils/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTruck } from '@fortawesome/free-solid-svg-icons';

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock payment processing
    setTimeout(() => {
      // Simulate successful payment
      const mockPaymentDetails = {
        id: 'MOCK_' + Math.random().toString(36).substr(2, 9),
        status: 'COMPLETED',
        payer: {
          payer_id: 'MOCK_PAYER_' + Math.random().toString(36).substr(2, 9)
        },
        amount: amount,
        currency: 'INR',
        timestamp: new Date().toISOString()
      };

      setLoading(false);
      setShowSuccessModal(true);
      
      // Call onSuccess after showing the modal
      setTimeout(() => {
        onSuccess(mockPaymentDetails);
      }, 3000); // Wait 3 seconds before redirecting
    }, 2000); // 2 second delay to simulate processing
  };

  const SuccessModal = () => (
    <Modal show={showSuccessModal} centered backdrop="static">
      <Modal.Body className="text-center py-4">
        <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="3x" />
        <h4 className="mb-3">Payment Successful!</h4>
        <p className="mb-3">Thank you for your purchase of {formatToRupees(amount)}</p>
        <div className="d-flex align-items-center justify-content-center text-primary mb-3">
          <FontAwesomeIcon icon={faTruck} className="me-2" />
          <span>Your items will be dispatched shortly</span>
        </div>
        <p className="text-muted small mb-0">You will receive an email confirmation with tracking details</p>
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Payment Details</h5>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="mb-3">
            <h6>Amount to Pay: {formatToRupees(amount)}</h6>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                required
                maxLength="16"
                pattern="[0-9]{16}"
                disabled={loading}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    required
                    maxLength="5"
                    pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength="3"
                    pattern="[0-9]{3}"
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing Payment...
                </>
              ) : 'Pay Now'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <SuccessModal />
    </>
  );
};

export default PaymentForm;
