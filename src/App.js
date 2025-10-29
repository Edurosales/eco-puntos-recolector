import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GenerarQR from './pages/GenerarQR';
import MisQRs from './pages/MisQRs';
import CanjesPendientes from './pages/CanjesPendientes';
import HistorialEntregas from './pages/HistorialEntregas';
import ResiduosRecibidos from './pages/ResiduosRecibidos';
import Perfil from './pages/Perfil';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#000' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout principal con Navbar
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="main-content">
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="App">
              <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/generar-qr"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <GenerarQR />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-qrs"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <MisQRs />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/entregas"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <CanjesPendientes />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/historial-entregas"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <HistorialEntregas />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/residuos"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ResiduosRecibidos />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Perfil />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Ruta 404 - Redirigir al dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
