import React, { useState } from "react";
import styles from "./css_modules/listas.module.css";
import {
  agregarListaAPI,
  eliminarListaAPI,
  obtenerListasAPI,
} from "./validaciones";

function Listas({ seleccionada, setSeleccionada, listas, setListas }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const handleAgregarLista = async () => {
    let listasActualizadas = listas;
    try {
      listasActualizadas = await obtenerListasAPI();
    } catch (e) {}
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const fechaSQL = `${yyyy}-${mm}-${dd}`;
    const fechaMostrar = `${dd}/${mm}/${yyyy}`;
    const baseNombre = `Lista ${fechaMostrar}`;
    // Buscar sufijos usados
    const sufijosUsados = listasActualizadas
      .filter((l) => l.nombre.startsWith(baseNombre))
      .map((l) => {
        const match = l.nombre.match(/\((\d+)\)$/);
        return match ? parseInt(match[1], 10) : 0;
      });
    let nuevoNombre = baseNombre;
    if (sufijosUsados.length > 0) {
      // Usa el sufijo máximo + 1
      const maxSufijo = Math.max(...sufijosUsados);
      nuevoNombre = `${baseNombre} - (${maxSufijo + 1})`;
    }
    try {
      const res = await agregarListaAPI(nuevoNombre, fechaSQL);
      // Refresca las listas desde la base de datos
      const nuevasListas = await obtenerListasAPI();
      setListas(nuevasListas);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEliminarLista = async (id_lista) => {
    if (
      !window.confirm(
        "¿Estás seguro? Esta acción es definitiva. Se eliminarán también todos los préstamos asociados a esta lista."
      )
    )
      return;
    try {
      await eliminarListaAPI(id_lista);
      // Refresca las listas desde la base de datos
      const nuevasListas = await obtenerListasAPI();
      setListas(nuevasListas);
      // Si la lista seleccionada fue eliminada, selecciona la primera
      if (nuevasListas.length === 0) {
        setSeleccionada(0);
      } else if (
        !nuevasListas.find((l) => l.id_lista === listas[seleccionada]?.id_lista)
      ) {
        setSeleccionada(0);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.lista}>
      {listas.map((lista, idx) => (
        <div
          key={lista.id_lista}
          className={styles.listaItemWrapper}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          style={{ position: "relative" }}
        >
          {hoveredIdx === idx && (
            <button
              className={styles.eliminarBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleEliminarLista(lista.id_lista);
              }}
              title="Eliminar lista"
              style={{
                display: "flex",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              ×
            </button>
          )}
          <div
            className={`${styles.listaItem} ${
              seleccionada === idx
                ? styles.listaItemSeleccionado
                : styles.listaItemdeselecionado
            }`}
            onClick={() => setSeleccionada(idx)}
          >
            <span>{lista.nombre}</span>
          </div>
        </div>
      ))}
      <div className={styles.listaAgregar} onClick={handleAgregarLista}>
        <span className={styles.listaAgregarIcono}>+</span>
      </div>
    </div>
  );
}

export default Listas;
