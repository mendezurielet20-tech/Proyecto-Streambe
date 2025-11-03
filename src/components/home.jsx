import React, { useState, useEffect } from "react";
import Listas from "./listas.jsx";
import NavBar from "./NavBar.jsx";
import styles from "./css_modules/home.module.css";
import Prestamos from "./prestamos.jsx";
import { obtenerListasAPI } from "./validaciones";

function Home({ onLogout, rol}) {
  const [listas, setListas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(0);

  useEffect(() => {
    async function fetchListas() {
      try {
        const data = await obtenerListasAPI();
        setListas(data);
      } catch (error) {
        alert(error.message);
      }
    }
    fetchListas();
  }, []);

  // Mostrar solo imagen si usuario es 'anderson' y rol es 'anderson'
  if (rol=== "anderson") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <img src="/cole-palmer-if-he-was-good-v0-7kbtklyey5hd1.webp" alt="Secreto" style={{ height:"100%", width:"100%", overflow: "auto" }} />
      </div>
    );
  }

  return (
    <>
      <div >
      <NavBar onLogout={onLogout} rol={rol} />
      <div className={styles.homeGrid}>
        <Listas
          seleccionada={seleccionada}
          setSeleccionada={setSeleccionada}
          listas={listas}
          setListas={setListas}
        />
          <Prestamos
            nombreLista={listas[seleccionada]?.nombre}
            idLista={listas[seleccionada]?.id_lista}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
