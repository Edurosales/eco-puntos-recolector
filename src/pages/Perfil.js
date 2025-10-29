import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { recolectorService } from '../services/recolectorService';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaCoins } from 'react-icons/fa';

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    dni: user?.dni || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await recolectorService.updatePerfil(formData);
      updateUser(data.user || formData);
      success('Perfil actualizado correctamente');
    } catch (err) {
      error(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await recolectorService.cambiarPassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      });
      success('Contraseña cambiada correctamente');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (err) {
      error(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 20%, rgba(79, 172, 254, 0.15) 0%, rgba(0, 0, 0, 1) 60%)',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-white mb-2">
              <FaUser className="me-2" />
              Mi Perfil
            </h2>
            <p className="text-white-50">Gestiona tu información personal y configuración</p>
          </Col>
        </Row>

        <Row>
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm" style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(79, 172, 254, 0.3)'
            }}>
              <Card.Body className="text-center">
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '3rem',
                  color: 'white'
                }}>
                  <FaUser />
                </div>
                <h4 className="text-white mb-1">
                  {user?.nombre} {user?.apellido}
                </h4>
                <p className="text-white-50 mb-3">{user?.email}</p>
                <div className="d-flex justify-content-center gap-3 mb-3">
                  <div className="text-center">
                    <Badge bg="primary" className="p-2">
                      <FaCoins className="me-2" />
                      {user?.puntos || 0} pts
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge bg="success" className="p-2">
                      {user?.rol}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {/* Formulario de datos personales */}
            <Card className="shadow-sm mb-4" style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(79, 172, 254, 0.3)'
            }}>
              <Card.Header className="bg-transparent border-bottom border-secondary">
                <h5 className="text-white mb-0">Información Personal</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpdatePerfil}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">
                          <FaUser className="me-2" />
                          Nombre
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          required
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(79, 172, 254, 0.3)',
                            color: 'white'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.apellido}
                          onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                          required
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(79, 172, 254, 0.3)',
                            color: 'white'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">
                      <FaEnvelope className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(79, 172, 254, 0.3)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">
                          <FaIdCard className="me-2" />
                          DNI
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.dni}
                          onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                          required
                          maxLength={8}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(79, 172, 254, 0.3)',
                            color: 'white'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">
                          <FaPhone className="me-2" />
                          Teléfono
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(79, 172, 254, 0.3)',
                            color: 'white'
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Formulario de cambio de contraseña */}
            <Card className="shadow-sm" style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(79, 172, 254, 0.3)'
            }}>
              <Card.Header className="bg-transparent border-bottom border-secondary">
                <h5 className="text-white mb-0">
                  <FaLock className="me-2" />
                  Cambiar Contraseña
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Contraseña Actual</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      required
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(79, 172, 254, 0.3)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Nueva Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      required
                      minLength={6}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(79, 172, 254, 0.3)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Confirmar Nueva Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                      required
                      minLength={6}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(79, 172, 254, 0.3)',
                        color: 'white'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="warning"
                    disabled={loading}
                  >
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Perfil;
