export async function useValidar(usuario, contraseña) {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contraseña }),
    });
    if (response.ok) {
      const data = await response.json();
      // data.rol contiene el rol del usuario
      return { ok: true, rol: data.rol };
    }
    return { ok: false };
  } catch (error) {
    console.error("Error al validar:", error);
    return { ok: false };
  }
}

export async function registrarPrestamo(prestamoData) {
  try {
    const response = await fetch("http://localhost:3000/nuevo_prestamo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prestamoData),
    });

    return response.ok;
  } catch (error) {
    console.error("Error al registrar préstamo:", error);
    return false;
  }
}
export async function agregarListaAPI(nombre, fecha) {
  const response = await fetch("http://localhost:3000/api/agregarlista", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, fecha }),
  });
  if (!response.ok) {
    throw new Error("Error al agregar la lista");
  }
  return await response.json();
}
export async function eliminarListaAPI(id) {
  const response = await fetch(`http://localhost:3000/api/listas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la lista");
  }
  return await response.json();
}
export async function obtenerListasAPI() {
  const response = await fetch("http://localhost:3000/api/listas");
  if (!response.ok) {
    throw new Error("Error al obtener listas");
  }
  return await response.json();
}
export async function obtenerPrestamosPorLista(id_lista) {
  const response = await fetch(
    `http://localhost:3000/api/prestamos/${id_lista}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener préstamos");
  }
  return await response.json();
}

export async function eliminarPrestamoAPI(id) {
  const response = await fetch(`http://localhost:3000/api/prestamos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar préstamo");
  return await response.json();
}

export async function completarPrestamoAPI(id) {
  const response = await fetch(
    `http://localhost:3000/api/prestamos/${id}/completar`,
    { method: "PUT" }
  );
  if (!response.ok) throw new Error("Error al completar préstamo");
  return await response.json();
}

export async function updatePrestamoAPI(id, body) {
  const response = await fetch(`http://localhost:3000/api/prestamos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Error al actualizar préstamo");
  return await response.json();
}
export async function toggleDevueltoAPI(id) {
  const response = await fetch(
    `http://localhost:3000/api/prestamos/${id}/toggle_devuelto`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) throw new Error("Error al alternar devuelto");
  return await response.json();
}
