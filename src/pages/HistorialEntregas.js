import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Table } from 'react-bootstrap';
import { FaCheckCircle, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { recolectorService } from '../services/recolectorService';
import { useNotification } from '../context/NotificationContext';

const HistorialEntregas = () => {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useNotification();

  useEffect(() => {
    loadEntregas();
  }, []);

  const loadEntregas = async () => {
    setLoading(true);

    try {
      const data = await recolectorService.getCanjesCompletados();
      console.log('=== HISTORIAL ENTREGAS ===');
      console.log('Entregas completadas:', data);
      console.log('=========================');
      setEntregas(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      error('Error al cargar historial de entregas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="mb-2">
              <FaCheckCircle className="me-2 text-success" />
              Historial de Entregas
            </h2>
            <p className="text-muted">Artículos que ya fueron entregados a los clientes</p>
          </Col>
        </Row>

        {/* Estadísticas */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Entregas</h6>
                <h3 className="mb-0 text-primary">{entregas.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h6 className="text-muted mb-2">Puntos Canjeados</h6>
                <h3 className="mb-0 text-success">
                  {entregas.reduce((sum, e) => sum + Math.abs(e.puntos), 0)} pts
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h6 className="text-muted mb-2">Este Mes</h6>
                <h3 className="mb-0 text-info">
                  {entregas.filter(e => {
                    const fecha = new Date(e.updated_at);
                    const ahora = new Date();
                    return fecha.getMonth() === ahora.getMonth() && 
                           fecha.getFullYear() === ahora.getFullYear();
                  }).length}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {entregas.length === 0 ? (
          <Alert variant="info">
            <Alert.Heading>No hay entregas completadas</Alert.Heading>
            <p className="mb-0">Cuando entregues artículos a los clientes, aparecerán aquí.</p>
          </Alert>
        ) : (
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th>Fecha Entrega</th>
                      <th>Artículo</th>
                      <th>Cliente</th>
                      <th>DNI</th>
                      <th>Puntos</th>
                      <th>Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entregas.map((entrega) => (
                      <tr key={entrega.id_transaccion}>
                        <td>
                          <FaCalendarAlt className="me-2 text-muted" />
                          {new Date(entrega.updated_at).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                          <br />
                          <small className="text-muted">
                            {new Date(entrega.updated_at).toLocaleTimeString('es-PE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </td>
                        <td>
                          <strong>{entrega.articuloTienda?.nombre || 'N/A'}</strong>
                          {entrega.articuloTienda?.imagen_url && (
                            <div className="mt-1">
                              <img 
                                src={entrega.articuloTienda.imagen_url} 
                                alt={entrega.articuloTienda.nombre}
                                style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td>
                          <FaUser className="me-2 text-muted" />
                          {entrega.usuario?.nombre} {entrega.usuario?.apellido}
                          <br />
                          <small className="text-muted">{entrega.usuario?.email}</small>
                        </td>
                        <td>
                          <Badge bg="secondary">{entrega.usuario?.dni || 'N/A'}</Badge>
                        </td>
                        <td>
                          <Badge bg="primary">{Math.abs(entrega.puntos)} pts</Badge>
                        </td>
                        <td>
                          <code className="small">{entrega.id_transaccion}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default HistorialEntregas;
