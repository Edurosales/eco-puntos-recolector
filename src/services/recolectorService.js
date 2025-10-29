import api from './api';

export const recolectorService = {
  // Autenticación
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  // Dashboard y estadísticas
  getMisPuntos: async () => {
    const response = await api.get('/recolector/puntos');
    return response.data;
  },

  // QRs generados
  getMisQRs: async (params = {}) => {
    const response = await api.get('/recolector/qrs', { params });
    return response.data;
  },

  // Generar QR (crear transacción/residuo)
  generarQR: async (data) => {
    const response = await api.post('/recolector/transacciones', data);
    return response.data;
  },

  // Canjes pendientes de entrega
  getCanjesPendientes: async () => {
    const response = await api.get('/recolector/canjes-pendientes');
    return response.data;
  },

  // Canjes completados (historial de entregas)
  getCanjesCompletados: async () => {
    const response = await api.get('/recolector/canjes-completados');
    return response.data;
  },

  // Marcar artículo como entregado
  marcarComoEntregado: async (id) => {
    const response = await api.patch(`/recolector/transacciones/${id}/entregar`);
    return response.data;
  },

  // Residuos recibidos (historial)
  getResiduosRecibidos: async (params = {}) => {
    const response = await api.get('/recolector/residuos-recibidos', { params });
    return response.data;
  },

  // Tipos de residuos disponibles
  getTiposResiduos: async () => {
    const response = await api.get('/tipos-residuos');
    return response.data;
  },

  // Puntos de acopio
  getPuntosAcopio: async () => {
    const response = await api.get('/puntos-acopio');
    return response.data;
  },

  // Perfil
  getPerfil: async () => {
    const response = await api.get('/perfil');
    return response.data;
  },

  updatePerfil: async (data) => {
    const response = await api.put('/perfil', data);
    return response.data;
  },

  cambiarPassword: async (data) => {
    const response = await api.patch('/perfil/password', data);
    return response.data;
  }
};
