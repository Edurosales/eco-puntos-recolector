import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import { recolectorService } from '../services/recolectorService';
import { QRCodeSVG } from 'qrcode.react';
import { FaQrcode, FaRecycle, FaWeight, FaCheck } from 'react-icons/fa';

const GenerarQR = () => {
  const { success, error } = useNotification();
  const [tiposResiduos, setTiposResiduos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [qrGenerado, setQrGenerado] = useState(null);
  
  const [formData, setFormData] = useState({
    tipo_residuo: '',
    cantidad_kg: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const tipos = await recolectorService.getTiposResiduos();
      setTiposResiduos(Array.isArray(tipos) ? tipos : tipos.data || []);
    } catch (err) {
      error('Error al cargar tipos de residuos');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tipo_residuo || !formData.cantidad_kg) {
      error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const data = await recolectorService.generarQR({
        tipo_residuo: formData.tipo_residuo,
        cantidad_kg: parseFloat(formData.cantidad_kg)
      });

      setQrGenerado(data);
      success('¡QR generado exitosamente!');
      setShowModal(true);
      
      // Limpiar formulario
      setFormData({
        tipo_residuo: '',
        cantidad_kg: ''
      });
    } catch (err) {
      error(err.response?.data?.message || 'Error al generar QR');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QR-${qrGenerado.codigo}.png`;
      link.href = url;
      link.click();
    }
  };

  const tipoSeleccionado = tiposResiduos.find(t => t.nombre === formData.tipo_residuo);
  const puntosEstimados = tipoSeleccionado && formData.cantidad_kg 
    ? Math.round(parseFloat(formData.cantidad_kg) * (tipoSeleccionado.puntos_por_kg || 0))
    : 0;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-lg">
              <Card.Header>
                <h4 className="mb-0">
                  <FaQrcode className="me-2" />
                  Generar Código QR
                </h4>
                <p className="text-white-50 mb-0 small mt-2">
                  Registra los residuos recogidos y genera un QR para que el cliente reclame sus puntos
                </p>
              </Card.Header>
              
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaRecycle className="me-2" />
                          Tipo de Residuo *
                        </Form.Label>
                        <Form.Select
                          value={formData.tipo_residuo}
                          onChange={(e) => setFormData({ ...formData, tipo_residuo: e.target.value })}
                          required
                        >
                          <option value="">Selecciona un tipo</option>
                          {tiposResiduos.map((tipo) => (
                            <option key={tipo.id_tipo} value={tipo.nombre}>
                              {tipo.nombre} ({tipo.puntos_por_kg} pts/kg)
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaWeight className="me-2" />
                          Cantidad (kg) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="Ej: 2.5"
                          value={formData.cantidad_kg}
                          onChange={(e) => setFormData({ ...formData, cantidad_kg: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {puntosEstimados > 0 && (
                    <Alert variant="info">
                      <strong>Puntos estimados para el cliente:</strong> {puntosEstimados} puntos
                    </Alert>
                  )}

                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                    >
                      <FaQrcode className="me-2" />
                      {loading ? 'Generando...' : 'Generar QR'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Información adicional */}
            <Card className="shadow-sm mt-4">
              <Card.Body>
                <h6 className="mb-3">
                  <FaCheck className="me-2 text-success" />
                  ¿Cómo funciona?
                </h6>
                <ul className="small mb-0 text-muted">
                  <li>Pesa los residuos que recogiste del cliente</li>
                  <li>Selecciona el tipo de material y registra la cantidad en kilogramos</li>
                  <li>El sistema calculará automáticamente los puntos según el tipo de residuo</li>
                  <li>Se generará un código QR único que el cliente deberá escanear</li>
                  <li>El cliente reclama sus puntos y tú ganas puntos por la transacción</li>
                  <li>Puedes descargar el QR o mostrarlo directamente desde tu dispositivo</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal con QR generado */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>¡QR Generado Exitosamente!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {qrGenerado && (
            <>
              <div className="mb-4">
                <QRCodeSVG
                  id="qr-code"
                  value={qrGenerado.codigo}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <Alert variant="success">
                <h5 className="mb-3">Detalles del Registro</h5>
                <p className="mb-2"><strong>Código:</strong> {qrGenerado.codigo}</p>
                <p className="mb-2"><strong>Tipo:</strong> {qrGenerado.residuo?.tipo}</p>
                <p className="mb-2"><strong>Cantidad:</strong> {qrGenerado.residuo?.cantidad_kg} kg</p>
                <p className="mb-0"><strong>Puntos:</strong> {qrGenerado.residuo?.puntos} pts</p>
                <p className="mb-0 small text-muted mt-2">
                  Precio: {qrGenerado.residuo?.precio_por_kg} pts/kg
                </p>
              </Alert>

              <p className="text-muted small">
                El cliente debe escanear este código QR para reclamar sus puntos
              </p>

              <div className="d-grid gap-2">
                <Button variant="primary" onClick={handleDownloadQR}>
                  Descargar QR
                </Button>
                <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GenerarQR;
