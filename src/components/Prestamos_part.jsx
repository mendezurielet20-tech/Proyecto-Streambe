import React from "react";
import styles from "./css_modules/prestamosPart.module.css";
import { eliminarPrestamoAPI, toggleDevueltoAPI } from "./validaciones";
import { updatePrestamoAPI } from "./validaciones";

function Prestamos_part({
  prestamos = [],
  mostrarMensajeSinLista = false,
  onRefresh,
}) {
  if (mostrarMensajeSinLista) {
    return (
      <div className={styles.prestamosContainer}>
        <div
          style={{
            textAlign: "center",
            padding: "2em",
            fontSize: "2em",
            color: "black",
          }}
        >
          Crea una lista para comenzar a registrar
        </div>
      </div>
    );
  }

  const renderCarrosMaquinas = (jsonStr) => {
    let arr;
    try {
      arr = JSON.parse(jsonStr);
      if (!Array.isArray(arr)) return "-";
    } catch {
      return jsonStr || "-";
    }
    return arr
      .map(
        (c) =>
          `${c.carro}: ${
            Array.isArray(c.maquinas) ? c.maquinas.join(", ") : c.maquinas
          }`
      )
      .join(" | ");
  };

  const formatFechaHora = (v) => {
    if (!v) return "-";
    if (/^\d{2}:\d{2}/.test(v)) return v;
    const d = new Date(v);
    if (!isNaN(d)) {
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    const m = String(v).match(/(\d{2}:\d{2})/);
    return m ? m[1] : v;
  };

  const computeTotalFromNumeros = (numStr) => {
    if (!numStr) return 0;
    try {
      const arr = JSON.parse(numStr);
      if (Array.isArray(arr)) {
        return arr.reduce((sum, c) => {
          const m = c.maquinas;
          if (Array.isArray(m)) return sum + m.length;
          if (typeof m === "string")
            return sum + (m ? m.split(",").filter(Boolean).length : 0);
          if (typeof m === "number") return sum + 1;
          return sum;
        }, 0);
      }
    } catch (e) {
      const matches = String(numStr).match(/\d+/g);
      return matches ? matches.length : 0;
    }
    return 0;
  };

  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});

  const startEdit = (p) => {
    setEditId(p.id);
    setEditForm({
      apellido: p.apellido || "",
      curso: p.curso || "",
      numeros_maquinas: p.numeros_maquinas || "",
      total: computeTotalFromNumeros(p.numeros_maquinas) || p.total || 0,
      cargador: p.cargador || "",
      hdmi: p.hdmi || "",
      hora_ing: p.hora_ing || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editForm.apellido || !editForm.apellido.trim())
      return alert("Apellido obligatorio");
    if (!String(editForm.total).match(/^\d+$/))
      return alert("Total debe ser número entero");
    if (editForm.hora_ing && !/^\d{2}:\d{2}:\d{2}$/.test(editForm.hora_ing)) {
      const d = new Date(editForm.hora_ing);
      if (!isNaN(d)) {
        const pad = (n) => String(n).padStart(2, "0");
        editForm.hora_ing = `${pad(d.getHours())}:${pad(d.getMinutes())}:)}`;
      } else return alert("Hora ingreso inválida, formato HH:MM");
    }
    try {
      await updatePrestamoAPI(editId, editForm);
      setEditId(null);
      setEditForm({});
      if (typeof onRefresh === "function") await onRefresh();
    } catch (err) {
      alert("Error al actualizar préstamo");
    }
  };

  const prestamosOrdenados = [...prestamos].sort((a, b) => {
    const da = a.devueltas === 1 || !!a.hora_dev ? 1 : 0;
    const db = b.devueltas === 1 || !!b.hora_dev ? 1 : 0;
    return da - db || b.id - a.id;
  });

  const rows = prestamosOrdenados.map((p) => {
    const devuelto = p.devueltas === 1 || !!p.hora_dev;
    const isEditing = editId === p.id;
    return (
      <tr key={p.id} className={devuelto ? styles.prestamoDevuelto : ""}>
        <td>
          {isEditing ? (
            <input
              value={editForm.apellido}
              onChange={(e) =>
                setEditForm({ ...editForm, apellido: e.target.value })
              }
            />
          ) : (
            p.apellido
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              value={editForm.curso}
              onChange={(e) =>
                setEditForm({ ...editForm, curso: e.target.value })
              }
            />
          ) : (
            p.curso
          )}
        </td>
        <td>
          {isEditing ? (
            <textarea
              rows={2}
              value={editForm.numeros_maquinas}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  numeros_maquinas: e.target.value,
                  total: computeTotalFromNumeros(e.target.value),
                })
              }
            />
          ) : (
            renderCarrosMaquinas(p.numeros_maquinas)
          )}
        </td>
        <td>{isEditing ? editForm.total : p.total}</td>
        <td>
          {isEditing ? (
            <input
              value={editForm.cargador}
              onChange={(e) =>
                setEditForm({ ...editForm, cargador: e.target.value })
              }
            />
          ) : (
            p.cargador || "No"
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              value={editForm.hdmi}
              onChange={(e) =>
                setEditForm({ ...editForm, hdmi: e.target.value })
              }
            />
          ) : (
            p.hdmi || "No"
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              value={editForm.hora_ing}
              type="time"
              onChange={(e) =>
                setEditForm({ ...editForm, hora_ing: e.target.value })
              }
            />
          ) : (
            formatFechaHora(p.hora_ing)
          )}
        </td>
        <td>{formatFechaHora(p.hora_dev)}</td>
        <td style={{ verticalAlign: "middle", padding: "5px", background: "#5da1ee" }}>
          <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
            <input
              className={styles.botonAcciones}
              type="checkbox"
              checked={!!devuelto}
              onChange={async () => {
                try {
                  await toggleDevueltoAPI(p.id);
                  if (typeof onRefresh === "function") await onRefresh();
                } catch (err) {
                  alert("Error al alternar devuelto");
                }
              }}
            />
            {isEditing ? (
              <>
                <button onClick={saveEdit} title="Guardar" className={styles.botonAcciones}>
                  💾
                </button>
                <button onClick={cancelEdit} title="Cancelar" className={styles.botonAcciones}>
                  ✖
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(p)} title="Editar" className={styles.botonAcciones}>
                  ✎
                </button>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  
                </label>
                <button
                  onClick={async () => {
                    if (!window.confirm("Eliminar este préstamo?")) return;
                    try {
                      await eliminarPrestamoAPI(p.id);
                      if (typeof onRefresh === "function") await onRefresh();
                    } catch (err) {
                      alert("Error al eliminar préstamo");
                    }
                  }}
                  className={styles.botonAcciones}
                >
                  🗑
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className={styles.prestamosContainer}>
      <table className={styles.prestamosTabla}>
        <thead>
          <tr>
            <th>Apellido</th>
            <th>Curso</th>
            <th>Carros y máquinas</th>
            <th>Total</th>
            <th>Cargador</th>
            <th>HDMI</th>
            <th>Hs Egreso</th>
            <th>Reingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                No hay préstamos para esta lista.
              </td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Prestamos_part;
