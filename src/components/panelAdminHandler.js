// Handlers para PanelAdmin
import React from "react";
import { 
  fetchUsuarios, 
  registrarUsuario, 
  fetchListas, 
  crearLista, 
  eliminarUsuario, 
  actualizarUsuario, 
  eliminarLista, 
  actualizarLista 
} from './administracion.js';

export function usePanelAdminHandlers({
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
}) {
  // ------------------ USUARIOS ------------------

  // Obtener usuarios registrados
  const handleFetchUsuarios = async () => {
    try {
      const data = await fetchUsuarios();
      setUsuarios(data);
    } catch (err) {
      setMensaje("❌ Error al obtener usuarios");
    }
  };

  // Registrar usuario
  const handleRegistro = async (usuario, contraseña, rolNuevo, setUsuario, setContraseña, setRolNuevo) => {
    setMensaje("");
    try {
      const data = await registrarUsuario({ usuario, contraseña, rol: rolNuevo });
      setMensaje(`✅ ${data.message || 'Usuario registrado correctamente.'}`);
      setUsuario("");
      setContraseña("");
      setRolNuevo("user");
      if (mostrarUsuarios) handleFetchUsuarios();
    } catch (err) {
      setMensaje(`❌ ${err.message || 'Error al registrar usuario.'}`);
    }
  };

  // Eliminar usuario
  const handleEliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setMensaje("✅ Usuario eliminado correctamente");
      handleFetchUsuarios();
    } catch (err) {
      setMensaje(`❌ ${err.message || 'Error al eliminar usuario.'}`);
    }
  };

  // Iniciar edición de usuario
  const iniciarEdicion = (u) => {
    setEditandoId(u.id);
    setEditUsuario(u.usuario);
    setEditRol(u.rol);
  };

  // Cancelar edición de usuario
  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditUsuario("");
    setEditRol("user");
  };

  // Guardar edición de usuario
  const guardarEdicion = async (id, editUsuarioArg, editRolArg) => {
    const usuarioVal = typeof editUsuarioArg === 'string' ? editUsuarioArg : '';
    const rolVal = typeof editRolArg === 'string' ? editRolArg : '';
    const usuarioOriginal = usuarios.find(u => u.id === id);
    if (!usuarioOriginal) return;

    const modificado = usuarioOriginal.usuario !== usuarioVal || usuarioOriginal.rol !== rolVal;
    if (modificado && (!usuarioVal.trim() || !rolVal.trim())) {
      setMensaje("❌ El usuario y el rol no pueden estar vacíos.");
      return;
    }

    try {
      if (modificado) {
        await actualizarUsuario(id, { usuario: usuarioVal, rol: rolVal });
        setMensaje("✅ Usuario actualizado correctamente");
      }
      setEditandoId(null);
      handleFetchUsuarios();
    } catch (err) {
      setMensaje(`❌ ${err.message || 'Error al actualizar usuario.'}`);
    }
  };

  // ------------------ LISTAS ------------------

  // Obtener listas
  const handleFetchListas = async () => {
    try {
      const data = await fetchListas();
      setListas(data);
    } catch (err) {
      setMensaje("❌ Error al obtener listas");
    }
  };

  // Crear nueva lista
  const handleCrearLista = async (nombreLista, fechaLista) => {
    setMensaje("");
    try {
      const data = await crearLista({ nombre: nombreLista, fecha: fechaLista });
      setMensaje(`✅ ${data.message || 'Lista creada correctamente.'}`);
      setNombreLista("");
      setFechaLista("");
      if (mostrarListas) handleFetchListas();
    } catch (err) {
      setMensaje(`❌ ${err.message || 'Error al crear lista.'}`);
    }
  };

  // Eliminar lista
  const handleEliminarLista = async (id_lista) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta lista?")) return;
    try {
      await eliminarLista(id_lista);
      setMensaje("✅ Lista eliminada correctamente");
      handleFetchListas();
    } catch (err) {
      setMensaje(`❌ ${err.message || 'Error al eliminar lista.'}`);
    }
  };

  // Estados internos para edición de lista
  const [editandoListaId, setEditandoListaId] = React.useState(null);
  const [editNombreLista, setEditNombreLista] = React.useState("");
  const [editFechaLista, setEditFechaLista] = React.useState("");

  // Iniciar edición de lista
  const iniciarEdicionLista = (l) => {
    setEditandoListaId(l.id_lista);
    setEditNombreLista(l.nombre);
    setEditFechaLista(l.fecha ? l.fecha.slice(0, 10) : "");
  };

  // Cancelar edición de lista
  const cancelarEdicionLista = () => {
    setEditandoListaId(null);
    setEditNombreLista("");
    setEditFechaLista("");
  };

  // Guardar edición de lista
  const guardarEdicionLista = async (id_lista, editNombre, editFecha) => {
    const listaOriginal = (Array.isArray(listas) ? listas : []).find(l => l.id_lista === id_lista);
    if (!listaOriginal) return;

    const modificado = listaOriginal.nombre !== editNombre || (listaOriginal.fecha ? listaOriginal.fecha.slice(0, 10) : "") !== editFecha;
    if (modificado && (!editNombre.trim() || !editFecha.trim())) {
      setMensaje("❌ El nombre y la fecha no pueden estar vacíos.");
      return;
    }

    try {
      if (modificado) {
        await actualizarLista(id_lista, { nombre: editNombre, fecha: editFecha });
        setMensaje("✅ Lista actualizada correctamente");
      }
      setEditandoListaId(null);
      handleFetchListas();
    } catch (err) {
      setMensaje(`❌ ${err.message || 'Error al actualizar lista.'}`);
    }
  };

  // ------------------ EXPORT ------------------
  return {
    // usuarios
    handleFetchUsuarios,
    handleRegistro,
    handleEliminarUsuario,
    iniciarEdicion,
    cancelarEdicion,
    guardarEdicion,

    // listas
    handleFetchListas,
    handleCrearLista,
    handleEliminarLista,
    iniciarEdicionLista,
    cancelarEdicionLista,
    guardarEdicionLista,
    editandoListaId,
    editNombreLista,
    editFechaLista,
    setEditNombreLista,
    setEditFechaLista
  };
}
