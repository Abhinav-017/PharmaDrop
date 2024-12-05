import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import { formatToRupees } from '../utils/currency';

// Sample medicine data with prices in INR
const sampleMedicines = [
  {
    id: 1,
    name: "Paracetamol",
    description: "Pain reliever and fever reducer. Effective for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.",
    price: 449.25, // ₹449.25 (converted from $5.99)
    image: "/Parecetomol.jpg",
    category: "Pain Relief",
    dosage: "500mg",
    quantity_available: 100
  },
  {
    id: 2,
    name: "Amoxicillin",
    description: "Antibiotic medication used to treat bacterial infections. Effective against respiratory tract, ear, nose, throat infections.",
    price: 974.25, // ₹974.25 (converted from $12.99)
    image: "/Amoxicillin.jpg",
    category: "Antibiotics",
    dosage: "250mg",
    quantity_available: 50
  },
  {
    id: 3,
    name: "Vitamin C",
    description: "Essential nutrient for immune system support. Helps maintain healthy skin, blood vessels, bones and cartilage.",
    price: 674.25, // ₹674.25 (converted from $8.99)
    image: "/Vitamin C.jpg",
    category: "Vitamins",
    dosage: "1000mg",
    quantity_available: 200
  },
  {
    id: 4,
    name: "Aspirin",
    description: "Blood-thinning pain reliever. Used for pain, fever, and inflammation. Also prescribed for heart attack prevention.",
    price: 524.25, // ₹524.25 (converted from $6.99)
    image: "/Aspirin.jpg",
    category: "Pain Relief",
    dosage: "325mg",
    quantity_available: 150
  },
  {
    id: 5,
    name: "Omeprazole",
    description: "Reduces stomach acid production. Treats heartburn, acid reflux, and gastroesophageal reflux disease (GERD).",
    price: 1199.25, // ₹1199.25 (converted from $15.99)
    image: "/Omeprazole.jpg",
    category: "Digestive Health",
    dosage: "20mg",
    quantity_available: 75
  },
  {
    id: 6,
    name: "Ibuprofen",
    description: "Nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.",
    price: 599.25, // ₹599.25 (converted from $7.99)
    image: "/Ibuprofen.jpg",
    category: "Pain Relief",
    dosage: "200mg",
    quantity_available: 120
  },
  {
    id: 7,
    name: "Cetirizine",
    description: "Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.",
    price: 749.25, // ₹749.25 (converted from $9.99)
    image: "/Cetirizine.jpg",
    category: "Allergy Relief",
    dosage: "10mg",
    quantity_available: 90
  },
  {
    id: 8,
    name: "Metformin",
    description: "Oral diabetes medicine that helps control blood sugar levels in patients with type 2 diabetes.",
    price: 899.25, // ₹899.25 (converted from $11.99)
    image: "/Metformin.jpg",
    category: "Diabetes",
    dosage: "500mg",
    quantity_available: 60
  }
];

const MedicineList = () => {
  const { addToCart, loading: cartLoading } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines] = useState(sampleMedicines);
  const [addingToCart, setAddingToCart] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddToCart = (medicine) => {
    if (cartLoading || addingToCart) return;
    
    setAddingToCart(medicine.id);
    addToCart(medicine);
    showFeedback(`${medicine.name} added to cart successfully!`, 'success');
    setAddingToCart(null);
  };

  return (
    <Container className="my-4">
      {feedback.show && (
        <Row>
          <Col md={12}>
            <Alert variant={feedback.type} className="mb-3" dismissible onClose={() => setFeedback({ show: false, message: '', type: '' })}>
              {feedback.message}
            </Alert>
          </Col>
        </Row>
      )}
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-primary" className="ms-2">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {filteredMedicines.map(medicine => (
          <Col key={medicine.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={medicine.image} />
              <Card.Body>
                <Card.Title>{medicine.name}</Card.Title>
                <Card.Text className="mb-1">
                  <small className="text-muted">Category: {medicine.category}</small>
                </Card.Text>
                <Card.Text className="mb-2">
                  <small className="text-muted">Dosage: {medicine.dosage}</small>
                </Card.Text>
                <Card.Text className="mb-3">{medicine.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-primary fw-bold">{formatToRupees(medicine.price)}</span>
                  <small className="text-muted">
                    {medicine.quantity_available} in stock
                  </small>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => handleAddToCart(medicine)}
                  className="w-100"
                  disabled={cartLoading || addingToCart === medicine.id}
                >
                  <FontAwesomeIcon icon={faCartPlus} className="me-2" />
                  {addingToCart === medicine.id ? 'Adding...' : cartLoading ? 'Please wait...' : 'Add to Cart'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MedicineList;
