import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import MedicineList from './components/MedicineList';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Navigate to="/medicines" />} />
              <Route path="/medicines" element={<MedicineList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <OrderSummary />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
