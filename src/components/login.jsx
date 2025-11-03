import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./css_modules/login.module.css";
import { useValidar } from "./validaciones.js";

function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await useValidar(usuario, contraseña);
    if (result.ok) {
      // Puedes guardar el rol en localStorage/context si lo necesitas global
      onLoginSuccess(result.rol);
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  };

  const togglePassword = () => setShowPassword((v) => !v);

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>Iniciar Sesión</div>
        <label className={styles.loginLabel}>Usuario</label>
        <input
          className={styles.loginInput}
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value.trim())}
        />
        <label className={styles.loginLabel}>Contraseña</label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            className={styles.loginInput}
            type={showPassword ? "text" : "password"}
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value.trim())}
            style={{ paddingRight: "2.5em" }}
          />
          <button
            type="button"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            style={{
              position: "absolute",
              right: "0.7em",
              top: "35%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              margin: 0,
              height: "1.5em",
              width: "2em",
            }}
            tabIndex={-1}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              // Ojo abierto
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#222"
                  strokeWidth="2"
                  d="M1.5 12S5.5 5.5 12 5.5 22.5 12 22.5 12 18.5 18.5 12 18.5 1.5 12 1.5 12Z"
                />
                <circle cx="12" cy="12" r="3.5" stroke="#222" strokeWidth="2" />
              </svg>
            ) : (
              // Ojo cerrado
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#222"
                  strokeWidth="2"
                  d="M1.5 12S5.5 5.5 12 5.5c2.5 0 4.7.7 6.5 1.7M22.5 12S18.5 18.5 12 18.5c-2.5 0-4.7-.7-6.5-1.7"
                />
                <circle cx="12" cy="12" r="3.5" stroke="#222" strokeWidth="2" />
                <line
                  x1="4"
                  y1="20"
                  x2="20"
                  y2="4"
                  stroke="#222"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
        <NavLink
          to="#"
          className={`navlink ${styles.loginButton}`}
          onClick={handleLogin}
        >
          Siguiente
        </NavLink>
      </div>
    </div>
  );
}

export default Login;