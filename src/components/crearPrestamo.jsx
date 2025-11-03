import React, { useState } from "react";
import styles from "./css_modules/crearPrestamo.module.css";
import NavBar from "./NavBar";
import { registrarPrestamo } from "../components/validaciones";
import { useParams, useNavigate } from "react-router-dom";

function CrearPrestamo({ onClose, onLogout }) {
  const { idLista } = useParams();
  const navigate = useNavigate();
  const [carros, setCarros] = useState([]); // [{carro: 'A', maquinas: ''}]

  const handleAgregarCarro = () => {
    const usados = carros.map((c) => c.carro);
    const opciones = ["A", "B", "C"];
    const disponible = opciones.find((op) => !usados.includes(op)) || "A";
    setCarros([...carros, { carro: disponible, maquinas: "" }]);
  };

  const handleCarroChange = (idx, value) => {
    const nuevos = [...carros];
    nuevos[idx].carro = value;
    setCarros(nuevos);
  };

  const handleMaquinasChange = (idx, value) => {
    const nuevos = [...carros];
    nuevos[idx].maquinas = value;
    setCarros(nuevos);
  };

  const handleEliminarCarro = (idx) => {
    setCarros(carros.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    // Validar campos obligatorios (apellido, curso, hora)
    const form = document.querySelector("form");
    const hora = form?.elements[2]?.value;
    const apellido = form?.elements[0]?.value;
    const curso = form?.elements[1]?.value;
    if (!apellido || !apellido.trim()) {
      alert("Completa el apellido del responsable");
      return false;
    }
    if (!curso || !curso.trim()) {
      alert("Completa el curso");
      return false;
    }
    if (!hora || !hora.trim()) {
      alert("Completa la hora de préstamo");
      return false;
    }
    if (carros.length === 0) {
      alert("Agrega al menos un carro y sus máquinas");
      return false;
    }
    for (const c of carros) {
      if (!c.maquinas.trim()) {
        alert("Completa los números de máquina para cada carro");
        return false;
      }
    }
    // Validar que no haya números de máquina repetidos dentro de cada carro
    // Permitir intervalos con guiones (ej: 1,2,5-8)
    const expandirIntervalos = (input) => {
      const partes = input
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m);
      let resultado = [];
      for (const parte of partes) {
        if (/^\d+-\d+$/.test(parte)) {
          // Es un intervalo
          const [ini, fin] = parte.split("-").map(Number);
          if (ini <= fin) {
            for (let n = ini; n <= fin; n++) resultado.push(String(n));
          } else {
            for (let n = ini; n >= fin; n--) resultado.push(String(n));
          }
        } else {
          resultado.push(parte);
        }
      }
      return resultado;
    };
    for (let i = 0; i < carros.length; i++) {
      const nums = expandirIntervalos(carros[i].maquinas);
      const numSet = new Set();
      for (const n of nums) {
        if (numSet.has(n)) {
          alert(
            `El número de máquina ${n} está repetido en el carro ${carros[i].carro}.`
          );
          return false;
        }
        numSet.add(n);
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const form = e.target;
    const capitalizeName = (str) =>
      str
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
        .join(" ");
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // Buscar el input de tipo time
    const horaInput = Array.from(form.elements).find((el) => el.type === "time");
    const hora = horaInput ? horaInput.value : "";
    const hora_ing = hora ? `${today} ${hora}:00` : null;
    // Construir el array de carros y máquinas, guardando el string original y calculando el total expandiendo intervalos
    const expandirIntervalos = (input) => {
      const partes = input
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m);
      let resultado = [];
      for (const parte of partes) {
        if (/^\d+-\d+$/.test(parte)) {
          // Es un intervalo
          const [ini, fin] = parte.split("-").map(Number);
          if (ini <= fin) {
            for (let n = ini; n <= fin; n++) resultado.push(n);
          } else {
            for (let n = ini; n >= fin; n--) resultado.push(n);
          }
        } else {
          resultado.push(Number(parte));
        }
      }
      return resultado;
    };
    // Guardar el string original para mostrarlo luego
    const carrosMaquinas = carros.map((c) => ({
      carro: c.carro,
      maquinas: c.maquinas, // string original, con intervalos
    }));
    // Calcular el total expandiendo intervalos
    const totalPrestadas = carros.reduce(
      (acc, c) => acc + expandirIntervalos(c.maquinas).length,
      0
    );

    // Asegurar que la primera letra del apellido (y de cada palabra) esté en mayúscula
    const apellidoFormatted = capitalizeName(form[0].value || "");
    // Actualizar el valor del input para reflejar el cambio en la UI
    if (form[0]) form[0].value = apellidoFormatted;

    const prestamoData = {
      apellido: apellidoFormatted,
      curso: form[1].value,
      numeros_maquinas: JSON.stringify(carrosMaquinas),
      total: totalPrestadas,
      hora_ing,
      hdmi: form[3].value,
      cargador: form[4].value,
      id_lista: idLista,
    };
    const exito = await registrarPrestamo(prestamoData);
    if (exito) {
      alert("Préstamo registrado con éxito");
      if (onClose) onClose();
      else navigate("/");
    } else {
      alert("Error al registrar el préstamo");
    }
  };

  return (
    <div className={styles.bg}>
      <NavBar onLogout={onLogout} />
      <div className={styles.container}>
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <label className={styles.label}>
            <b>Apellido Responsable</b>
            <input className={styles.input} type="text" defaultValue="" />
          </label>
          <label className={styles.label}>
            <b>Curso</b>
            <input className={styles.input} type="text" defaultValue="" />
          </label>
          <label className={styles.label}>
            <b>Hora de Préstamo</b>
            <input className={styles.input} type="time" />
          </label>
          <label className={styles.label}>
            HDMI
            <input className={styles.input} type="text" />
          </label>
          <label className={styles.label}>
            Cargador
            <input className={styles.input} type="text" />
          </label>
          <div className={styles.label+" "+styles.carrosContainer}>
            <b>Carros y máquinas</b>
            {carros.map((c, idx) => {
              // Carros ya seleccionados en otros selects
              const usados = carros
                .map((cc, i) => (i !== idx ? cc.carro : null))
                .filter(Boolean);
              const opciones = ["A", "B", "C"];
              return (
                <div className={styles.carro_maquinas} key={idx}>
                  <select
                    className={styles.select}
                    value={c.carro}
                    onChange={(e) => handleCarroChange(idx, e.target.value)}
                  >
                    {opciones.map((op) => (
                      <option
                        key={op}
                        value={op}
                        disabled={usados.includes(op)}
                      >
                        {op}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="(ej: 1,2,5-8)"
                    value={c.maquinas}
                    onChange={(e) => handleMaquinasChange(idx, e.target.value)}
                    className={styles.input}
                  />
                  <button
                    className={styles.eliminarBtn}
                    type="button"
                    onClick={() => handleEliminarCarro(idx)}
                  >
                    X
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={handleAgregarCarro}
              className={styles.agregarCarroBtn}
              disabled={carros.length >= 3}
            >
              + Agregar carro
            </button>
          </div>
          <button className={styles.crearBtn} type="submit">
            Crear Préstamo
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearPrestamo;
