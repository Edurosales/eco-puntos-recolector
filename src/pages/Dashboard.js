import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { recolectorService } from '../services/recolectorService';
import StatCard from '../components/StatCard';
import { FaCoins, FaQrcode, FaBoxOpen, FaRecycle, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await recolectorService.getMisPuntos();
      setStats(data);
    } catch (err) {
      error('Error al cargar estadísticas');
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
        {/* Bienvenida */}
        <Row className="mb-4">
          <Col>
            <h1 className="mb-2">
              ¡Hola, {user?.nombre}! 👋
            </h1>
            <p className="text-muted">Resumen de tu actividad como recolector</p>
          </Col>
        </Row>

        {/* Tarjetas de estadísticas */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <StatCard
              title="Puntos Distribuidos"
              value={stats?.total_puntos_distribuidos || 0}
              icon={FaCoins}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title="QRs Generados"
              value={stats?.total_residuos_registrados || 0}
              icon={FaQrcode}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title="Entregas Pendientes"
              value={stats?.articulos_pendientes_entrega || 0}
              icon={FaBoxOpen}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title="Kg Recogidos"
              value={`${stats?.total_kg_recolectados || 0} kg`}
              icon={FaRecycle}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            />
          </Col>
        </Row>

        {/* Sección de información del punto de acopio */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="shadow-sm h-100">
              <Card.Header>
                <h5 className="mb-0">
                  <FaRecycle className="me-2" />
                  Mi Punto de Acopio
                </h5>
              </Card.Header>
              <Card.Body>
                {stats?.punto_acopio ? (
                  <>
                    <h4>{stats.punto_acopio.nombre_lugar || stats.punto_acopio.nombre}</h4>
                    <p className="text-muted mb-2">
                      <strong>Dirección:</strong><br />
                      {stats.punto_acopio.direccion}
                    </p>
                    <p className="mb-0">
                      <strong>Estado:</strong>{' '}
                      <Badge bg={stats.punto_acopio.estado === 'aprobado' ? 'success' : 'warning'}>
                        {stats.punto_acopio.estado}
                      </Badge>
                    </p>
                  </>
                ) : (
                  <p className="text-muted mb-0">No tienes un punto de acopio asignado</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm h-100">
              <Card.Header>
                <h5 className="mb-0">
                  <FaClock className="me-2" />
                  Resumen de QRs
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-around align-items-center h-100">
                  <div className="text-center">
                    <h3 className="text-success mb-0">{stats?.qrs_disponibles || 0}</h3>
                    <p className="text-muted mb-0">Disponibles</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-primary mb-0">{stats?.qrs_reclamados || 0}</h3>
                    <p className="text-muted mb-0">Reclamados</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-warning mb-0">{stats?.articulos_pendientes_entrega || 0}</h3>
                    <p className="text-muted mb-0">Pendientes</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Guía rápida */}
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Guía Rápida</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <h6 className="text-primary">1. Generar QR</h6>
                    <p className="small">Registra los residuos recogidos, selecciona el tipo y cantidad en kg. El sistema generará un código QR único.</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="text-primary">2. Cliente Reclama</h6>
                    <p className="small">El cliente escanea el QR y reclama sus puntos. Tú ganas puntos automáticamente por cada transacción.</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="text-primary">3. Entregar Premios</h6>
                    <p className="small">Revisa los canjes pendientes y marca como entregado cuando el cliente recoja su premio.</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
