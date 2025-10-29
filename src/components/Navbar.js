import React from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaQrcode, FaClipboardList, FaBoxOpen, FaRecycle, FaUser, FaMoon, FaSun, FaSignOutAlt, FaCoins, FaHistory } from 'react-icons/fa';

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar 
      expand="lg" 
      className="shadow-sm" 
      style={{
        background: isDark 
          ? 'rgba(0, 0, 0, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${isDark ? 'rgba(79, 172, 254, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
      }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className={isDark ? 'text-primary' : 'text-dark'}>
          <FaRecycle className="me-2" />
          <strong>EcoPuntos Recolector</strong>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/" className={isDark ? 'text-white' : 'text-dark'}>
              <FaClipboardList className="me-2" />
              Dashboard
            </Nav.Link>
            
            <Nav.Link as={Link} to="/generar-qr" className={isDark ? 'text-white' : 'text-dark'}>
              <FaQrcode className="me-2" />
              Generar QR
            </Nav.Link>
            
            <Nav.Link as={Link} to="/mis-qrs" className={isDark ? 'text-white' : 'text-dark'}>
              <FaBoxOpen className="me-2" />
              Mis QRs
            </Nav.Link>
            
            <Nav.Link as={Link} to="/entregas" className={isDark ? 'text-white' : 'text-dark'}>
              <FaBoxOpen className="me-2" />
              Entregas
            </Nav.Link>
            
            <Nav.Link as={Link} to="/historial-entregas" className={isDark ? 'text-white' : 'text-dark'}>
              <FaHistory className="me-2" />
              Historial
            </Nav.Link>
            
            <Nav.Link as={Link} to="/perfil" className={isDark ? 'text-white' : 'text-dark'}>
              <FaUser className="me-2" />
              Perfil
            </Nav.Link>

            {user && (
              <div className="mx-3">
                <Badge bg="primary" className="p-2">
                  <FaCoins className="me-1" />
                  {user.puntos || 0} pts
                </Badge>
              </div>
            )}
            
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={toggleTheme}
              className="mx-2"
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </Button>
            
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Salir
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
