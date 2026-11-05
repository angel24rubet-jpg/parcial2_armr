const API_URL = "http://localhost:3000/recintos";

// Listar todos los recintos
export async function listarRecintos() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("Error al consultar los recintos");
  }

  return await respuesta.json();
}

// Registrar un recinto
export async function registrarRecinto(recinto: any) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recinto),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json();

    throw new Error(
      Array.isArray(datos.message)
        ? datos.message.join(", ")
        : datos.message || "Error al registrar el recinto",
    );
  }
  return await respuesta.json();
}

// Modificar un recinto
export async function modificarRecinto(id: number, recinto: any) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recinto),
  });

  if (!respuesta.ok) {
    throw new Error("Error al modificar el recinto");
  }

  return await respuesta.json();
}

// Eliminar un recinto
export async function eliminarRecinto(id: number) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar el recinto");
  }

  return await respuesta.json();
}
