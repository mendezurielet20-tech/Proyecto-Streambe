import { useState } from "react";
import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login.jsx";
import Home from "./components/home.jsx";
import CrearPrestamo from "./components/crearPrestamo.jsx";
import PanelAdmin from "./components/PanelAdmin.jsx";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);
  const location = useLocation();

  // Si el usuario está autenticado y está en /login, redirigir a /home
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/home" replace />;
  }

  // Si el usuario NO está autenticado y está en /home, redirigir a /login
  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRol(null);
  };

  const handleLoginSuccess = (rolUsuario) => {
    setIsAuthenticated(true);
    setRol(rolUsuario);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
      <Route path="/home" element={<Home onLogout={handleLogout} rol={rol} />} />
      <Route
        path="/nuevo-prestamo/:idLista"
        element={
          <CrearPrestamo
            onClose={() => window.history.back()}
            onLogout={handleLogout}
          />
        }
      />
      <Route
        path="/panelAdmin"
  element={isAuthenticated ? <PanelAdmin rol={rol} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

export default App;
