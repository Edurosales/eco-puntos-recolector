import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import { recolectorService } from '../services/recolectorService';
import { FaBoxOpen, FaCheck, FaClock } from 'react-icons/fa';

const CanjesPendientes = () => {
  const { success, error } = useNotification();
  const [canjes, setCanjes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entregando, setEntregando] = useState(null);

  useEffect(() => {
    loadCanjes();
  }, []);

  const loadCanjes = async () => {
    try {
      const data = await recolectorService.getCanjesPendientes();
      console.log('=== DEBUG CANJES PENDIENTES ===');
      console.log('Respuesta completa:', data);
      console.log('Total de canjes:', Array.isArray(data) ? data.length : (data.data ? data.data.length : 0));
      console.log('Es array:', Array.isArray(data));
      console.log('Tiene data:', data.data);
      console.log('Primer canje:', Array.isArray(data) ? data[0] : data.data?.[0]);
      console.log('==============================');
      setCanjes(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('=== ERROR AL CARGAR CANJES ===');
      console.error('Error completo:', err);
      console.error('Respuesta del error:', err.response);
      console.error('Mensaje:', err.response?.data?.message);
      console.error('==============================');
      error('Error al cargar canjes pendientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarEntregado = async (id) => {
    if (!window.confirm('¿Confirmar que el artículo fue entregado al cliente?')) {
      return;
    }

    setEntregando(id);

    try {
      await recolectorService.marcarComoEntregado(id);
      success('¡Artículo marcado como entregado!');
      loadCanjes(); // Recargar la lista
    } catch (err) {
      error(err.response?.data?.message || 'Error al marcar como entregado');
      console.error(err);
    } finally {
      setEntregando(null);
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
              <FaBoxOpen className="me-2" />
              Entregas Pendientes
            </h2>
            <p className="text-muted">Artículos canjeados que debes entregar a los clientes</p>
          </Col>
        </Row>

        {canjes.length === 0 ? (
          <Alert variant="info">
            <Alert.Heading>No hay entregas pendientes</Alert.Heading>
            <p className="mb-0">¡Genial! No tienes artículos por entregar en este momento.</p>
          </Alert>
        ) : (
          <>
            <Row className="mb-3">
              <Col>
                <Badge bg="warning" className="p-2">
                  <FaClock className="me-2" />
                  {canjes.length} {canjes.length === 1 ? 'entrega pendiente' : 'entregas pendientes'}
                </Badge>
              </Col>
            </Row>

            <Row className="g-4">
              {canjes.map((canje) => (
                <Col key={canje.id_transaccion} md={6} lg={4}>
                  <Card className="h-100 shadow-sm">
                    {canje.articuloTienda?.imagen_url && (
                      <Card.Img
                        variant="top"
                        src={canje.articuloTienda.imagen_url}
                        alt={canje.articuloTienda.nombre}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <h5 className="mb-3">
                        {canje.articuloTienda?.nombre || 'Artículo'}
                      </h5>
                      
                      <div className="mb-3">
                        <p className="text-muted small mb-1">
                          <strong>Cliente:</strong><br />
                          {canje.usuario?.nombre} {canje.usuario?.apellido}
                        </p>
                        <p className="text-muted small mb-1">
                          <strong>DNI:</strong> {canje.usuario?.dni || 'No disponible'}
                        </p>
                        <p className="text-muted small mb-1">
                          <strong>Puntos canjeados:</strong>{' '}
                          <Badge bg="primary">{canje.puntos} pts</Badge>
                        </p>
                        <p className="text-muted small mb-1">
                          <strong>Código:</strong>{' '}
                          <code className="small">{canje.codigo_reclamacion}</code>
                        </p>
                        <p className="text-muted small mb-0">
                          <strong>Fecha canje:</strong><br />
                          {new Date(canje.created_at).toLocaleString()}
                        </p>
                      </div>

                      <Button
                        variant="success"
                        className="w-100"
                        onClick={() => handleMarcarEntregado(canje.id_transaccion)}
                        disabled={entregando === canje.id_transaccion}
                      >
                        {entregando === canje.id_transaccion ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                            Marcando...
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-2" />
                            Marcar como Entregado
                          </>
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Información adicional */}
        <Card className="shadow-sm mt-4">
          <Card.Body>
            <h6 className="mb-3">Instrucciones para la Entrega</h6>
            <ul className="small text-muted mb-0">
              <li>Verifica el DNI del cliente antes de entregar el artículo</li>
              <li>Asegúrate de que el nombre coincida con el registrado en el sistema</li>
              <li>Una vez entregado, marca el artículo como entregado en el sistema</li>
              <li>El cliente debe firmar o confirmar la recepción del premio</li>
              <li>Si el cliente no puede recoger su premio, contacta con administración</li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CanjesPendientes;
