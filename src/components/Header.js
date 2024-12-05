import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPills, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/medicines">
          <FontAwesomeIcon icon={faPills} /> PharmaDrop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/medicines">Medicines</Nav.Link>
            <Nav.Link as={NavLink} to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} /> Cart
              {cartItemCount > 0 && (
                <span className="badge bg-danger ms-1">{cartItemCount}</span>
              )}
            </Nav.Link>
            {user ? (
              <>
                <NavDropdown 
                  title={
                    <span>
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      {user.name}
                    </span>
                  } 
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={NavLink} to="/dashboard">Dashboard</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
