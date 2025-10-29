import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Spinner, Button, Modal } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import { recolectorService } from '../services/recolectorService';
import { QRCodeSVG } from 'qrcode.react';
import { FaQrcode, FaFilter, FaEye } from 'react-icons/fa';

const MisQRs = () => {
  const { error } = useNotification();
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    loadQRs();
  }, [filtro]);

  const loadQRs = async () => {
    try {
      const params = filtro ? { estado: filtro } : {};
      const data = await recolectorService.getMisQRs(params);
      setQrs(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      error('Error al cargar QRs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerQR = (qr) => {
    setSelectedQR(qr);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      'disponible': 'warning',
      'reclamado': 'success',
      'expirado': 'danger'
    };
    const labels = {
      'disponible': 'Disponible',
      'reclamado': 'Reclamado',
      'expirado': 'Expirado'
    };
    return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
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
              <FaQrcode className="me-2" />
              Mis Códigos QR
            </h2>
            <p className="text-muted">Gestiona todos los QRs que has generado</p>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Header>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small mb-1">
                    <FaFilter className="me-2" />
                    Filtrar por estado
                  </Form.Label>
                  <Form.Select
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="disponible">Disponibles</option>
                    <option value="reclamado">Reclamados</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={8} className="text-end">
                <span className="text-muted">
                  Total: <strong>{qrs.length}</strong> QRs
                </span>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="p-0">
            {qrs.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-0">
                  No se encontraron QRs {filtro && `con estado "${filtro}"`}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Tipo Residuo</th>
                      <th>Cantidad</th>
                      <th>Puntos</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qrs.map((qr) => (
                      <tr key={qr.id_transaccion}>
                        <td>
                          <small className="font-monospace">
                            {qr.codigo_reclamacion?.substring(0, 12)}...
                          </small>
                        </td>
                        <td>{qr.tipo_residuo}</td>
                        <td>{qr.cantidad_kg} kg</td>
                        <td>
                          <Badge bg="primary">{qr.puntos} pts</Badge>
                        </td>
                        <td>
                          {qr.usuario_cliente?.nombre 
                            ? `${qr.usuario_cliente.nombre} ${qr.usuario_cliente.apellido || ''}`.trim()
                            : 'Sin reclamar'}
                        </td>
                        <td>{getStatusBadge(qr.estado)}</td>
                        <td>
                          <small>
                            {new Date(qr.created_at).toLocaleDateString()}
                          </small>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleVerQR(qr)}
                          >
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal para ver QR */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          borderBottom: '1px solid rgba(79, 172, 254, 0.3)'
        }}>
          <Modal.Title>Detalles del QR</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white'
        }} className="text-center">
          {selectedQR && (
            <>
              <div className="mb-4">
                <QRCodeSVG
                  value={selectedQR.codigo_qr}
                  size={250}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="text-start">
                <p className="mb-2"><strong>Código:</strong> {selectedQR.codigo_qr}</p>
                <p className="mb-2"><strong>Tipo:</strong> {selectedQR.tipo_residuo}</p>
                <p className="mb-2"><strong>Cantidad:</strong> {selectedQR.cantidad_kg} kg</p>
                <p className="mb-2"><strong>Puntos:</strong> {selectedQR.puntos} pts</p>
                <p className="mb-2">
                  <strong>Estado:</strong> {getStatusBadge(selectedQR.estado)}
                </p>
                <p className="mb-2">
                  <strong>Fecha:</strong> {new Date(selectedQR.created_at).toLocaleString()}
                </p>
                {selectedQR.usuario_cliente && (
                  <p className="mb-0">
                    <strong>Reclamado por:</strong>{' '}
                    {selectedQR.usuario_cliente.nombre} {selectedQR.usuario_cliente.apellido}
                  </p>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{
          background: 'rgba(0, 0, 0, 0.9)',
          borderTop: '1px solid rgba(79, 172, 254, 0.3)'
        }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MisQRs;
