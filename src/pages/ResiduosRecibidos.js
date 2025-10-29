import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, Spinner } from 'react-bootstrap';
import { recolectorService } from '../services/recolectorService';
import { useNotification } from '../context/NotificationContext';
import { FaRecycle, FaCalendarAlt, FaWeight, FaFilter, FaCoins, FaCheckCircle, FaClock } from 'react-icons/fa';

const ResiduosRecibidos = () => {
  const { error } = useNotification();
  const [residuos, setResiduos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    estado: '',
    tipo_residuo: ''
  });
  const [tiposResiduos, setTiposResiduos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalKg: 0,
    totalPuntos: 0,
    pendientes: 0,
    reclamados: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [residuosResponse, tiposData] = await Promise.all([
        recolectorService.getResiduosRecibidos(),
        recolectorService.getTiposResiduos()
      ]);

      // El backend devuelve { residuos, precios_actuales, estadisticas_por_tipo }
      const residuosData = residuosResponse.residuos || [];
      setResiduos(residuosData);
      setTiposResiduos(tiposData);
      calcularEstadisticas(residuosData);
    } catch (err) {
      error('Error al cargar residuos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (data) => {
    const stats = {
      total: data.length,
      totalKg: data.reduce((sum, r) => sum + parseFloat(r.cantidad_kg || 0), 0),
      totalPuntos: data.reduce((sum, r) => sum + parseFloat(r.puntos_otorgados || 0), 0),
      pendientes: data.filter(r => r.estado === 'disponible').length,
      reclamados: data.filter(r => r.estado === 'reclamado').length
    };
    setStats(stats);
  };

  const aplicarFiltros = () => {
    let resultado = [...residuos];

    if (filtros.fecha_inicio) {
      resultado = resultado.filter(r => new Date(r.fecha_recepcion) >= new Date(filtros.fecha_inicio));
    }
    if (filtros.fecha_fin) {
      resultado = resultado.filter(r => new Date(r.fecha_recepcion) <= new Date(filtros.fecha_fin));
    }
    if (filtros.estado) {
      resultado = resultado.filter(r => r.estado === filtros.estado);
    }
    if (filtros.tipo_residuo) {
      resultado = resultado.filter(r => r.tipo_residuo === filtros.tipo_residuo);
    }

    return resultado;
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: '',
      fecha_fin: '',
      estado: '',
      tipo_residuo: ''
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'disponible': <Badge bg="warning"><FaClock className="me-1" />Disponible</Badge>,
      'reclamado': <Badge bg="success"><FaCheckCircle className="me-1" />Reclamado</Badge>
    };
    return badges[estado] || <Badge bg="secondary">{estado}</Badge>
  };

  const residuosFiltrados = aplicarFiltros();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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
              <FaRecycle className="me-2" />
              Residuos Recibidos
            </h2>
            <p className="text-white-50">Historial completo de residuos registrados</p>
          </Col>
        </Row>

        {/* Estadísticas */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}>
              <Card.Body className="text-white text-center">
                <FaRecycle style={{ fontSize: '2rem', marginBottom: '10px' }} />
                <h3 className="mb-0">{stats.total}</h3>
                <small>Total Registros</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm" style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none'
            }}>
              <Card.Body className="text-white text-center">
                <FaWeight style={{ fontSize: '2rem', marginBottom: '10px' }} />
                <h3 className="mb-0">{stats.totalKg.toFixed(2)}</h3>
                <small>Kg Recogidos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm" style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none'
            }}>
              <Card.Body className="text-white text-center">
                <FaCoins style={{ fontSize: '2rem', marginBottom: '10px' }} />
                <h3 className="mb-0">{stats.totalPuntos.toFixed(0)}</h3>
                <small>Puntos Generados</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm" style={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              border: 'none'
            }}>
              <Card.Body className="text-white text-center">
                <FaClock style={{ fontSize: '2rem', marginBottom: '10px' }} />
                <h3 className="mb-0">{stats.pendientes}</h3>
                <small>Pendientes</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Card className="shadow-sm mb-4" style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(79, 172, 254, 0.3)'
        }}>
          <Card.Header className="bg-transparent border-bottom border-secondary">
            <h5 className="text-white mb-0">
              <FaFilter className="me-2" />
              Filtros
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.fecha_inicio}
                    onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(79, 172, 254, 0.3)',
                      color: 'white'
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.fecha_fin}
                    onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(79, 172, 254, 0.3)',
                      color: 'white'
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Tipo de Residuo</Form.Label>
                  <Form.Select
                    value={filtros.tipo_residuo}
                    onChange={(e) => setFiltros({ ...filtros, tipo_residuo: e.target.value })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(79, 172, 254, 0.3)',
                      color: 'white'
                    }}
                  >
                    <option value="">Todos</option>
                    {tiposResiduos.map(tipo => (
                      <option key={tipo.id_tipo} value={tipo.nombre} style={{ color: 'black' }}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Estado</Form.Label>
                  <Form.Select
                    value={filtros.estado}
                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(79, 172, 254, 0.3)',
                      color: 'white'
                    }}
                  >
                    <option value="">Todos</option>
                    <option value="disponible" style={{ color: 'black' }}>Disponible</option>
                    <option value="reclamado" style={{ color: 'black' }}>Reclamado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="outline-light" size="sm" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
          </Card.Body>
        </Card>

        {/* Tabla de Residuos */}
        <Card className="shadow-sm" style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(79, 172, 254, 0.3)'
        }}>
          <Card.Header className="bg-transparent border-bottom border-secondary">
            <h5 className="text-white mb-0">
              Historial ({residuosFiltrados.length} registros)
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover variant="dark" className="mb-0">
                <thead>
                  <tr>
                    <th>Código QR</th>
                    <th>Tipo Residuo</th>
                    <th>Cantidad (Kg)</th>
                    <th>Puntos</th>
                    <th>Fecha Recepción</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {residuosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-white-50 py-4">
                        No hay residuos registrados con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    residuosFiltrados.map((residuo) => (
                      <tr key={residuo.id_residuo}>
                        <td>
                          <code className="text-primary">{residuo.codigo_qr}</code>
                        </td>
                        <td>
                          <Badge bg="info">
                            {residuo.tipo_residuo || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <FaWeight className="me-1 text-warning" />
                          {parseFloat(residuo.cantidad_kg).toFixed(2)} kg
                        </td>
                        <td>
                          <FaCoins className="me-1 text-success" />
                          {parseFloat(residuo.puntos_otorgados || 0).toFixed(0)} pts
                        </td>
                        <td>
                          <FaCalendarAlt className="me-1 text-info" />
                          {new Date(residuo.fecha_recepcion).toLocaleDateString()}
                        </td>
                        <td>{getEstadoBadge(residuo.estado)}</td>
                        <td className="text-white-50" style={{ maxWidth: '200px', fontSize: '0.85rem' }}>
                          {residuo.observaciones || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ResiduosRecibidos;
