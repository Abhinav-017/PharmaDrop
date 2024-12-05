import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>PharmaDrop</h5>
            <p>Your trusted medicine delivery partner</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/about" className="text-light">About Us</a></li>
              <li><a href="/contact" className="text-light">Contact</a></li>
              <li><a href="/privacy" className="text-light">Privacy Policy</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>Email: support@pharmadrop.com</p>
            <p>Phone: (555) 123-4567</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">&copy; 2024 PharmaDrop. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
