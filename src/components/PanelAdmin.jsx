import React, { useState, useEffect } from 'react';
import { usePanelAdminHandlers } from './panelAdminHandler';
import styles from "./css_modules/panelAdmin.module.css";
import NavBar from './NavBar';


function PanelAdmin({ rol, onLogout }) {
  // Estados principales
  const [editandoId, setEditandoId] = useState(null);
  const [editUsuario, setEditUsuario] = useState("");
  const [editRol, setEditRol] = useState("user");
  const [listas, setListas] = useState([]);
  const [mostrarListas, setMostrarListas] = useState(false);
  const [nombreLista, setNombreLista] = useState("");
  const [fechaLista, setFechaLista] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rolNuevo, setRolNuevo] = useState("user");
  const [mensaje, setMensaje] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  // Estado para animación de salida
  const [mensajeVisible, setMensajeVisible] = useState(false);

  // Handlers centralizados
  const {
    handleFetchUsuarios,
    handleRegistro,
    handleEliminarUsuario,
    iniciarEdicion,
    cancelarEdicion,
    guardarEdicion,
    handleFetchListas,
    handleCrearLista,
    // listas
    handleEliminarLista,
    iniciarEdicionLista,
    cancelarEdicionLista,
    guardarEdicionLista,
    editandoListaId,
    editNombreLista,
    editFechaLista,
    setEditNombreLista,
    setEditFechaLista
  } = usePanelAdminHandlers({
    setUsuarios,
    setMensaje,
    setListas,
    setNombreLista,
    setFechaLista,
    setEditandoId,
    setEditUsuario,
    setEditRol,
    mostrarUsuarios,
    mostrarListas,
    usuarios,
    listas
  });



  useEffect(() => {
    if (mensaje) {
      setMensajeVisible(true);
      const hideTimeout = setTimeout(() => setMensajeVisible(false), 90000);
      const clearTimeoutMsg = setTimeout(() => setMensaje(""), 3000);
      return () => {
        clearTimeout(hideTimeout);
        clearTimeout(clearTimeoutMsg);
      };
    } else {
      setMensajeVisible(false);
    }
  }, [mensaje]);

  return (
  <div className={styles.divPrincipal}>
    <div>
      <NavBar onLogout={onLogout} rol={rol} />
          <div
            className={
              styles.mensaje +
              (mensajeVisible ? ' ' + styles.mensajeVisible : '') +
              (mensaje.startsWith('✅') ? ' ' + styles.mensajeExito : mensaje.startsWith('❌') ? ' ' + styles.mensajeError : '')
            }
            aria-live="polite"
          >
            {mensaje}
          </div>

    <div className={styles.panelAdmin}>
      
      {rol === "admin" ? (
        <div>

          <h1 className={styles.title}>Panel de Administración</h1>
          <h2>Registrar nuevo usuario</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleRegistro(usuario, contraseña, rolNuevo, setUsuario, setContraseña, setRolNuevo);
          }} style={{ display: 'flex', flexDirection: 'column', maxWidth: 300, gap: 8 }}>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              required
            />
            <select value={rolNuevo} onChange={e => setRolNuevo(e.target.value)}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <button type="submit">Registrar usuario</button>
          </form>
          <h2>Visualizar usuarios existentes</h2>
          <button
            type="button"
            onClick={() => {
              if (!mostrarUsuarios) handleFetchUsuarios();
              setMostrarUsuarios((v) => !v);
            }}
            style={{marginBottom: 12}}
          >
            {mostrarUsuarios ? 'Ocultar usuarios registrados' : 'Ver usuarios registrados'}
          </button>
          {mostrarUsuarios && (
            <div className={styles.mostrarUsuarios} style={{overflowX: 'auto'}}>
              <table style={{borderCollapse: 'collapse', width: '75%', minWidth: 320}}>
                <thead>
                  <tr>
                    <th className={styles.elementoTabla}>ID</th>
                    <th className={styles.elementoTabla}>Usuario</th>
                    <th className={styles.elementoTabla}>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr><td colSpan={3} style={{textAlign: 'center', padding: 8}}>No hay usuarios registrados.</td></tr>
                  ) : (
                    usuarios.map(u => (
                      <tr key={u.id}>
                        <td className={styles.elementoTabla}>{u.id}</td>
                        <td className={styles.elementoTabla}>
                          {editandoId === u.id ? (
                            <input
                              value={editUsuario}
                              onChange={e => setEditUsuario(e.target.value)}
                              style={{width: '90%'}}
                            />
                          ) : (
                            u.usuario
                          )}
                        </td>
                        <td className={styles.elementoTabla}>
                          {editandoId === u.id ? (
                            <select value={editRol} onChange={e => setEditRol(e.target.value)}>
                              <option value="user">Usuario</option>
                              <option value="admin">Administrador</option>
                            </select>
                          ) : (
                            u.rol
                          )}
                        </td>
                        <td className={styles.elementoTabla}>
                          {editandoId === u.id ? (
                            <>
                              <button onClick={() => guardarEdicion(u.id, editUsuario, editRol)} style={{marginRight: 4}}>💾</button>
                              <button onClick={cancelarEdicion}>✖</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => iniciarEdicion(u)} style={{marginRight: 4}}>✏️</button>
                              <button onClick={() => handleEliminarUsuario(u.id)} style={{color: 'red'}}>🗑️</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <hr style={{margin: '24px 0'}} />
          
          <h2>Crear nueva lista</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCrearLista(nombreLista, fechaLista);
          }} style={{ display: 'flex', flexDirection: 'column', maxWidth: 300, gap: 8 }}>
            <input
              type="text"
              placeholder="Nombre de la lista"
              value={nombreLista}
              onChange={e => setNombreLista(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Fecha"
              value={fechaLista}
              onChange={e => setFechaLista(e.target.value)}
              required
            />
            <button type="submit">Crear lista</button>
          </form>
          <h2>Visualizar listas existentes</h2>
          <button
            type="button"
            onClick={() => {
              if (!mostrarListas) handleFetchListas();
              setMostrarListas((v) => !v);
            }}
            style={{marginBottom: 12}}
          >
            {mostrarListas ? 'Ocultar listas registradas' : 'Ver listas registradas'}
          </button>
          {mostrarListas && (
            <div style={{overflowX: 'auto', marginBottom: 16}}>
              <table style={{borderCollapse: 'collapse', width: '75%', minWidth: 320}}>
                <thead>
                  <tr>
                    <th className={styles.elementoTabla}>ID</th>
                    <th className={styles.elementoTabla}>Nombre</th>
                    <th className={styles.elementoTabla}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {listas.length === 0 ? (
                    <tr><td colSpan={4} style={{textAlign: 'center', padding: 8}}>No hay listas registradas.</td></tr>
                  ) : (
                    listas.map(l => (
                      <tr key={l.id_lista}>
                        <td className={styles.elementoTabla}>{l.id_lista}</td>
                        <td className={styles.elementoTabla}>
                          {editandoListaId === l.id_lista ? (
                            <input
                              value={editNombreLista}
                              onChange={e => setEditNombreLista(e.target.value)}
                              style={{width: '90%'}}
                            />
                          ) : (
                            l.nombre
                          )}
                        </td>
                        <td className={styles.elementoTabla}>
                          {editandoListaId === l.id_lista ? (
                            <input
                              type="date"
                              value={editFechaLista}
                              onChange={e => setEditFechaLista(e.target.value)}
                              style={{width: '90%'}}
                            />
                          ) : (
                            l.fecha ? l.fecha.slice(0, 10) : ''
                          )}
                        </td>
                        <td className={styles.elementoTabla}>
                          {editandoListaId === l.id_lista ? (
                            <>
                              <button onClick={() => guardarEdicionLista(l.id_lista, editNombreLista, editFechaLista)} style={{marginRight: 4}}>💾</button>
                              <button onClick={cancelarEdicionLista}>✖</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => iniciarEdicionLista(l)} style={{marginRight: 4}}>✏️</button>
                              <button onClick={() => handleEliminarLista(l.id_lista)} style={{color: 'red'}}>🗑️</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1 className={styles.title}>Acceso Denegado</h1>
        </div>
      )}
      </div>
    </div>
    </div>
  );
}

export default PanelAdmin;