const API_URL = "http://localhost:3000/eventos-culturales";

// Listar todos los eventos
export async function listarEventos() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("Error al consultar los eventos");
  }

  return await respuesta.json();
}

// Registrar un evento
export async function registrarEvento(evento: any) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json();

    throw new Error(
      Array.isArray(datos.message)
        ? datos.message.join(", ")
        : datos.message || "Error al registrar el evento",
    );
  }

  return await respuesta.json();
}

// Modificar un evento
export async function modificarEvento(id: number, evento: any) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });

  if (!respuesta.ok) {
    throw new Error("Error al modificar el evento");
  }

  return await respuesta.json();
}

// Eliminar un evento
export async function eliminarEvento(id: number) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar el evento");
  }
}
