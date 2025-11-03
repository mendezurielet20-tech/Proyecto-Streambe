import React, { useEffect, useState } from "react";
import styles from "./css_modules/prestamos.module.css";
import { NavLink } from "react-router-dom";
import Prestamos_part from "./Prestamos_part";
import { obtenerPrestamosPorLista } from "./validaciones";

function Prestamos({ nombreLista, idLista }) {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    if (!idLista) return;
    async function fetchPrestamos() {
      try {
        const data = await obtenerPrestamosPorLista(idLista);
        setPrestamos(data);
      } catch (error) {
        setPrestamos([]);
      }
    }
    fetchPrestamos();
    // Exponer la función para que child pueda refrescar cuando sea necesario
    // Nota: no cambia la referencia entre renders por simplicidad
    // pero es suficiente para llamadas directas desde Prestamos_part via prop.
  }, [idLista]);

  return (
    <div className={styles.containerPrincipal}>
      <h2>{nombreLista}</h2>

      {idLista && (
        <NavLink
          to={`/nuevo-prestamo/${idLista}`}
          className={`navlink ${styles.crearPrestamobtn}`}
        >
          Crear Préstamo
        </NavLink>
      )}

      <div className={styles.prestamos}>
        <Prestamos_part
          prestamos={prestamos}
          mostrarMensajeSinLista={!idLista}
          idLista={idLista}
          onRefresh={async () => {
            if (!idLista) return;
            try {
              const data = await obtenerPrestamosPorLista(idLista);
              setPrestamos(data);
            } catch (err) {
              setPrestamos([]);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Prestamos;
