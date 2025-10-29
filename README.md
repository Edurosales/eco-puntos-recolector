# 🌱 Eco-Puntos Recolector

Aplicación web para recolectores de residuos reciclables del sistema Eco-Puntos.

## 📋 Características

### Autenticación
- Login exclusivo para usuarios con rol `recolector`
- Validación de credenciales con el backend Laravel
- Almacenamiento seguro del token JWT

### Dashboard
- Estadísticas en tiempo real:
  - Puntos ganados totales
  - QRs generados
  - Entregas pendientes
  - Kilogramos recogidos
- Información del punto de acopio asignado
- Historial de actividad reciente

### Generación de QR
- Formulario para registrar residuos recibidos
- Selección de tipo de residuo (plástico, papel, vidrio, etc.)
- Ingreso de cantidad en kilogramos
- Cálculo automático de puntos estimados
- Generación de código QR único
- Descarga del QR en formato PNG
- Vista previa del QR generado

### Mis QRs
- Lista completa de todos los QRs generados
- Filtrado por estado (Pendiente/Reclamado)
- Vista detallada de cada QR
- Información del tipo de residuo y cantidad
- Estado de reclamación de puntos

### Entregas Pendientes
- Lista de artículos de tienda canjeados por clientes
- Visualización de datos del cliente (DNI, nombre)
- Marcar artículos como entregados
- Confirmación antes de cambiar estado

### Residuos Recibidos
- Historial completo de todos los residuos registrados
- Estadísticas detalladas (total registros, kg, puntos)
- Filtros avanzados:
  - Rango de fechas
  - Tipo de residuo
  - Estado (Pendiente/Reclamado)
- Tabla con toda la información de cada residuo

### Perfil
- Visualización de información personal
- Edición de datos (nombre, apellido, email, teléfono, DNI)
- Cambio de contraseña
- Vista de puntos acumulados

## 🛠️ Tecnologías

- **React 18** - Framework principal
- **React Router DOM** - Navegación
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Componentes React de Bootstrap
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía
- **qrcode.react** - Generación de códigos QR
- **Context API** - Manejo de estado global

## 📁 Estructura del Proyecto

```
eco-puntos-recolector/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Barra de navegación
│   │   └── StatCard.js        # Tarjetas de estadísticas
│   ├── context/
│   │   ├── AuthContext.js     # Autenticación
│   │   ├── ThemeContext.js    # Tema claro/oscuro
│   │   └── NotificationContext.js # Notificaciones
│   ├── pages/
│   │   ├── Login.js           # Inicio de sesión
│   │   ├── Dashboard.js       # Panel principal
│   │   ├── GenerarQR.js       # Generar códigos QR
│   │   ├── MisQRs.js          # Lista de QRs
│   │   ├── CanjesPendientes.js # Entregas pendientes
│   │   ├── ResiduosRecibidos.js # Historial de residuos
│   │   └── Perfil.js          # Perfil de usuario
│   ├── services/
│   │   ├── api.js             # Configuración de Axios
│   │   └── recolectorService.js # Servicios API
│   ├── App.js                 # Componente principal
│   ├── App.css                # Estilos globales
│   └── index.js               # Punto de entrada
├── .env                        # Variables de entorno
├── package.json
└── README.md
```

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
cd eco-puntos-recolector
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Iniciar la aplicación**
```bash
npm start
```

La aplicación se abrirá en `http://localhost:3001`

## 🔐 Credenciales de Prueba

Para probar la aplicación, necesitas un usuario con rol `recolector` en el backend.

Ejemplo:
```
Email: recolector@ecopuntos.com
Password: [tu contraseña]
```

## 📡 Endpoints del Backend

El frontend consume los siguientes endpoints:

### Autenticación
- `POST /login` - Iniciar sesión

### Recolector
- `GET /recolector/puntos` - Obtener estadísticas
- `GET /recolector/qrs` - Lista de QRs generados
- `POST /recolector/generar-qr` - Generar nuevo QR
- `GET /recolector/canjes-pendientes` - Artículos para entregar
- `PUT /recolector/marcar-entregado/{id}` - Marcar artículo entregado
- `GET /recolector/residuos-recibidos` - Historial de residuos
- `GET /recolector/transacciones` - Transacciones del recolector

### Perfil
- `GET /recolector/perfil` - Datos del perfil
- `PUT /recolector/perfil` - Actualizar perfil
- `PUT /recolector/cambiar-password` - Cambiar contraseña

### Catálogos
- `GET /tipos-residuos` - Tipos de residuos
- `GET /puntos-acopio` - Puntos de acopio

## 🎨 Características de UI/UX

- **Tema Oscuro**: Diseño moderno con gradientes y efectos glassmorphism
- **Responsive**: Adaptable a dispositivos móviles, tablets y escritorio
- **Notificaciones Toast**: Feedback visual de las acciones del usuario
- **Animaciones**: Transiciones suaves y efectos hover
- **Gradientes**: Colores vibrantes para diferentes secciones
- **Icons**: Iconografía clara y descriptiva con React Icons

## 🔄 Flujo de Trabajo

1. **Login**: El recolector inicia sesión con sus credenciales
2. **Dashboard**: Ve estadísticas y actividad reciente
3. **Recibir Residuos**: 
   - Cliente llega con residuos
   - Recolector pesa y registra en "Generar QR"
   - Se genera QR con puntos estimados
   - Cliente recibe QR para reclamar puntos
4. **Gestionar Entregas**:
   - Ve canjes pendientes en "Entregas"
   - Verifica DNI del cliente
   - Entrega artículo
   - Marca como entregado en el sistema
5. **Historial**: Consulta residuos recibidos y transacciones

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Genera build de producción
- `npm test` - Ejecuta tests
- `npm eject` - Eyecta configuración de Create React App

## 🔒 Seguridad

- Validación de rol en el frontend y backend
- Token JWT almacenado en localStorage
- Interceptores Axios para autenticación automática
- Protección de rutas con ProtectedRoute
- Validación de formularios

## 🐛 Solución de Problemas

**Error de CORS**: Asegúrate que el backend Laravel tenga configurado CORS correctamente.

**Error 401**: Verifica que el token JWT sea válido y que el usuario tenga rol `recolector`.

**API no responde**: Verifica que el backend esté corriendo en `http://localhost:8000`.

## 📄 Licencia

Este proyecto es parte del sistema Eco-Puntos.

## 👥 Desarrolladores

Desarrollado para la gestión de recolectores en el sistema de reciclaje Eco-Puntos.

