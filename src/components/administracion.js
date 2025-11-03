// Eliminar lista por ID
export async function eliminarLista(id_lista) {
	const res = await fetch(`http://localhost:3000/api/listas/${id_lista}`, {
		method: "DELETE"
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || data.message || "Error al eliminar lista");
	return data;
}

// Actualizar lista por ID
export async function actualizarLista(id_lista, { nombre, fecha }) {
	const res = await fetch(`http://localhost:3000/api/listas/${id_lista}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ nombre, fecha })
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || data.message || "Error al actualizar lista");
	return data;
}
// Eliminar usuario por ID
export async function eliminarUsuario(id) {
	const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
		method: "DELETE"
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || data.message || "Error al eliminar usuario");
	return data;
}

// Actualizar usuario por ID
export async function actualizarUsuario(id, { usuario, rol }) {
	const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ usuario, rol })
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || data.message || "Error al actualizar usuario");
	return data;
}
// Obtener listas registradas
export async function fetchListas() {
	const res = await fetch("http://localhost:3000/api/listas");
	if (!res.ok) throw new Error("Error al obtener listas");
	return await res.json();
}

// Crear una nueva lista
export async function crearLista({ nombre, fecha }) {
	const res = await fetch("http://localhost:3000/api/agregarlista", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ nombre, fecha }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || data.message || "Error al crear lista");
	return data;
}
// Funciones de administración para PanelAdmin

// Obtener usuarios registrados
export async function fetchUsuarios() {
	const res = await fetch("http://localhost:3000/api/usuarios");
	if (!res.ok) throw new Error("Error al obtener usuarios");
	return await res.json();
}

// Registrar un nuevo usuario
export async function registrarUsuario({ usuario, contraseña, rol }) {
	const res = await fetch("http://localhost:3000/registrar_usuario", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ usuario, contraseña, rol }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || data.message || "Error al registrar usuario");
	return data;
}
