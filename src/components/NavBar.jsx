import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./css_modules/navBar.module.css";


function NavBar({ onLogout, rol }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/home"
        end
        className={({ isActive }) =>
          `${styles.navlinks} navlink${
            isActive ? ` ${styles.botonActivo}` : ""
          }`
        }
      >
        Inicio
      </NavLink>
      {rol === "admin" && (
        <NavLink
          to="/panelAdmin"
          className={({ isActive }) => `${styles.navlinks} navlink${isActive ? ` ${styles.botonActivo}` : ""}`}
        >
          Administrador
        </NavLink>
      )}
      <NavLink
        to="/login"
        className={({ isActive }) => `${styles.botonLogout} navlink`}
        onClick={handleLogout}
      >
        Cerrar sesión
      </NavLink>
    </nav>
  );
}

export default NavBar;
