<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  listarRecintos,
  registrarRecinto,
  modificarRecinto,
  eliminarRecinto,
} from "../services/recintosService";

const recintos = ref<any[]>([]);
const mensaje = ref("");
const error = ref("");

const nombre = ref("");
const ciudad = ref("");
const aforoMaximo = ref<number | null>(null);
const idEditar = ref<number | null>(null);
const busqueda = ref("");

// Cargar la lista de recintos
async function cargarRecintos() {
  try {
    recintos.value = await listarRecintos();
    error.value = "";
  } catch (e) {
    error.value = "No se pudieron cargar los recintos.";
    console.error(e);
  }
}

// Registrar un recinto
async function guardarRecinto() {
  try {
    error.value = "";
    mensaje.value = "";

    await registrarRecinto({
      nombre: nombre.value,
      ciudad: ciudad.value,
      aforoMaximo: aforoMaximo.value || undefined,
    });

    mensaje.value = "Recinto registrado correctamente.";

    limpiarFormulario();
    await cargarRecintos();
  } catch (e: any) {
    error.value = e.message || "No se pudo registrar el recinto.";
    console.error(e);
  }
}

// Seleccionar un recinto para modificar
function seleccionarRecinto(recinto: any) {
  idEditar.value = recinto.id;
  nombre.value = recinto.nombre;
  ciudad.value = recinto.ciudad;
  aforoMaximo.value = recinto.aforoMaximo;
  mensaje.value = "";
  error.value = "";
}

// Modificar un recinto
async function actualizarRecinto() {
  if (idEditar.value === null) {
    return;
  }

  try {
    error.value = "";
    mensaje.value = "";

    await modificarRecinto(idEditar.value, {
      nombre: nombre.value,
      ciudad: ciudad.value,
      aforoMaximo: aforoMaximo.value || undefined,
    });

    mensaje.value = "Recinto modificado correctamente.";

    limpiarFormulario();
    await cargarRecintos();
  } catch (e) {
    error.value = "No se pudo modificar el recinto.";
    console.error(e);
  }
}

// Limpiar el formulario
function limpiarFormulario() {
  idEditar.value = null;
  nombre.value = "";
  ciudad.value = "";
  aforoMaximo.value = null;
}

// Buscar recintos por nombre
const recintosFiltrados = computed(() => {
  return recintos.value.filter((recinto) =>
    recinto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  );
});

// Eliminar un recinto
async function eliminar(id: number) {
  const confirmar = confirm("¿Está seguro de eliminar este recinto?");

  if (!confirmar) {
    return;
  }

  try {
    error.value = "";
    mensaje.value = "";

    await eliminarRecinto(id);

    mensaje.value = "Recinto eliminado correctamente.";
    await cargarRecintos();
  } catch (e) {
    error.value = "No se pudo eliminar el recinto.";
    console.error(e);
  }
}

// Cargar los datos al abrir la página
onMounted(() => {
  cargarRecintos();
});
</script>

<template>
  <main>
    <h1>Administración de Recintos</h1>
    <p>Registro y gestión de los recintos culturales.</p>

    <hr />

    <h2>Registrar Recinto</h2>

    <form
      @submit.prevent="
        idEditar === null ? guardarRecinto() : actualizarRecinto()
      "
    >
      <div>
        <label>Nombre del recinto:</label>
        <input
          type="text"
          v-model="nombre"
          placeholder="Ingrese el nombre"
          required
          maxlength="100"
        />
      </div>

      <div>
        <label>Ciudad:</label>
        <input
          type="text"
          v-model="ciudad"
          placeholder="Ingrese la ciudad"
          required
          maxlength="50"
        />
      </div>

      <div>
        <label>Aforo máximo:</label>
        <input
          type="number"
          v-model.number="aforoMaximo"
          placeholder="Ingrese el aforo"
          min="1"
        />
      </div>

      <button type="submit">
        {{ idEditar === null ? "Registrar Recinto" : "Actualizar Recinto" }}
      </button>

      <button type="button" v-if="idEditar !== null" @click="limpiarFormulario">
        Cancelar
      </button>
    </form>

    <p v-if="mensaje">{{ mensaje }}</p>
    <p v-if="error">{{ error }}</p>

    <hr />

    <h2>Lista de Recintos</h2>

    <div>
      <label>Buscar recinto por nombre:</label>
      <input
        type="text"
        v-model="busqueda"
        placeholder="Escriba el nombre del recinto..."
      />
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Ciudad</th>
          <th>Aforo máximo</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="recinto in recintosFiltrados" :key="recinto.id">
          <td>{{ recinto.id }}</td>
          <td>{{ recinto.nombre }}</td>
          <td>{{ recinto.ciudad }}</td>
          <td>{{ recinto.aforoMaximo ?? "No especificado" }}</td>
          <td>
            <button type="button" @click="seleccionarRecinto(recinto)">
              Modificar
            </button>

            <button type="button" @click="eliminar(recinto.id)">
              Eliminar
            </button>
          </td>
        </tr>

        <tr v-if="recintosFiltrados.length === 0">
          <td colspan="5">No se encontraron recintos.</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main {
  padding: 30px;
}

h1 {
  color: #35495e;
  margin-bottom: 10px;
}

h2 {
  margin: 25px 0 15px;
}

table {
  width: 100%;
  min-width: 950px;
  border-collapse: collapse;
  margin-top: 15px;
  table-layout: auto;
}

th,
td {
  border: 1px solid #ddd;
  padding: 14px 12px;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
}

th {
  background-color: #42b883;
  color: white;
}

form {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 18px;
  margin-right: 5px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #369b6e;
}
</style>
