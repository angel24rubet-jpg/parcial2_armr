<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import {
  listarEventos,
  registrarEvento,
  modificarEvento,
  eliminarEvento,
} from "../services/eventosService";

import { listarRecintos } from "../services/recintosService";

const eventos = ref<any[]>([]);
const recintos = ref<any[]>([]);

const mensaje = ref("");
const error = ref("");

const idRecinto = ref<number | null>(null);
const titulo = ref("");
const artistaPrincipal = ref("");
const duracionMinutos = ref<number | null>(null);
const precioEntrada = ref<number | null>(null);
const fechaEvento = ref("");
const estado = ref("Programado");

const idEditar = ref<number | null>(null);
const busqueda = ref("");

// Cargar los eventos
async function cargarEventos() {
  try {
    eventos.value = await listarEventos();
    error.value = "";
  } catch (e) {
    error.value = "No se pudieron cargar los eventos.";
    console.error(e);
  }
}

// Cargar los recintos disponibles
async function cargarRecintos() {
  try {
    recintos.value = await listarRecintos();
  } catch (e) {
    error.value = "No se pudieron cargar los recintos.";
    console.error(e);
  }
}

// Registrar un evento
async function guardarEvento() {
  try {
    error.value = "";
    mensaje.value = "";

    await registrarEvento({
      idRecinto: idRecinto.value,
      titulo: titulo.value,
      artistaPrincipal: artistaPrincipal.value,
      duracionMinutos: duracionMinutos.value,
      precioEntrada: precioEntrada.value,
      fechaEvento: fechaEvento.value,
      estado: estado.value,
    });

    mensaje.value = "Evento registrado correctamente.";

    limpiarFormulario();
    await cargarEventos();
  } catch (e: any) {
    error.value = e.message || "No se pudo registrar el evento.";
    console.error(e);
  }
}

// Seleccionar un evento para modificar
function seleccionarEvento(evento: any) {
  idEditar.value = evento.id;
  idRecinto.value = evento.idRecinto ?? evento.recinto?.id ?? null;
  titulo.value = evento.titulo;
  artistaPrincipal.value = evento.artistaPrincipal;
  duracionMinutos.value = evento.duracionMinutos;
  precioEntrada.value = Number(evento.precioEntrada);
  fechaEvento.value = evento.fechaEvento;
  estado.value = evento.estado;

  mensaje.value = "";
  error.value = "";
}

// Modificar un evento
async function actualizarEvento() {
  if (idEditar.value === null) {
    return;
  }

  try {
    error.value = "";
    mensaje.value = "";

    await modificarEvento(idEditar.value, {
      idRecinto: idRecinto.value,
      titulo: titulo.value,
      artistaPrincipal: artistaPrincipal.value,
      duracionMinutos: duracionMinutos.value,
      precioEntrada: precioEntrada.value,
      fechaEvento: fechaEvento.value,
      estado: estado.value,
    });

    mensaje.value = "Evento modificado correctamente.";

    limpiarFormulario();
    await cargarEventos();
  } catch (e) {
    error.value = "No se pudo modificar el evento.";
    console.error(e);
  }
}

// Limpiar el formulario
function limpiarFormulario() {
  idEditar.value = null;
  idRecinto.value = null;
  titulo.value = "";
  artistaPrincipal.value = "";
  duracionMinutos.value = null;
  precioEntrada.value = null;
  fechaEvento.value = "";
  estado.value = "Programado";
}

// Buscar eventos por título
const eventosFiltrados = computed(() => {
  return eventos.value.filter((evento) =>
    evento.titulo.toLowerCase().includes(busqueda.value.toLowerCase()),
  );
});

// Eliminar un evento
async function eliminar(id: number) {
  const confirmar = confirm("¿Está seguro de eliminar este evento?");

  if (!confirmar) {
    return;
  }

  try {
    error.value = "";
    mensaje.value = "";

    await eliminarEvento(id);

    mensaje.value = "Evento eliminado correctamente.";

    await cargarEventos();
  } catch (e) {
    error.value = "No se pudo eliminar el evento.";
    console.error(e);
  }
}

// Cargar los datos al abrir la página
onMounted(() => {
  cargarEventos();
  cargarRecintos();
});

function formatearFecha(fecha: string) {
  const partes = fecha.split("T")[0].split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
</script>

<template>
  <main>
    <h1>Administración de Eventos Culturales</h1>
    <p>Registro y gestión de los eventos culturales.</p>

    <hr />

    <h2>Registrar Evento Cultural</h2>

    <form
      @submit.prevent="idEditar === null ? guardarEvento() : actualizarEvento()"
    >
      <div>
        <label>Recinto:</label>
        <select v-model.number="idRecinto" required>
          <option :value="null" disabled>Seleccione un recinto</option>
          <option
            v-for="recinto in recintos"
            :key="recinto.id"
            :value="recinto.id"
          >
            {{ recinto.nombre }} - {{ recinto.ciudad }}
          </option>
        </select>
      </div>

      <div>
        <label>Título del evento:</label>
        <input
          type="text"
          v-model="titulo"
          placeholder="Ingrese el título del evento"
          maxlength="150"
          required
        />
      </div>

      <div>
        <label>Artista principal:</label>
        <input
          type="text"
          v-model="artistaPrincipal"
          placeholder="Ingrese el artista principal"
          maxlength="100"
          required
        />
      </div>

      <div>
        <label>Duración en minutos:</label>
        <input
          type="number"
          v-model.number="duracionMinutos"
          min="1"
          placeholder="Ingrese la duración"
          required
        />
      </div>

      <div>
        <label>Precio de entrada (Bs):</label>
        <input
          type="number"
          v-model.number="precioEntrada"
          min="0"
          step="0.01"
          placeholder="Ingrese el precio"
          required
        />
      </div>

      <div>
        <label>Fecha del evento:</label>
        <input type="date" v-model="fechaEvento" required />
      </div>

      <div>
        <label>Estado:</label>
        <select v-model="estado" required>
          <option value="Programado">Programado</option>
          <option value="Agotado">Agotado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <button type="submit">
        {{ idEditar === null ? "Registrar Evento" : "Actualizar Evento" }}
      </button>

      <button type="button" v-if="idEditar !== null" @click="limpiarFormulario">
        Cancelar
      </button>
    </form>

    <p v-if="mensaje">{{ mensaje }}</p>
    <p v-if="error">{{ error }}</p>

    <hr />

    <h2>Lista de Eventos Culturales</h2>

    <div>
      <label>Buscar evento por título:</label>
      <input
        type="text"
        v-model="busqueda"
        placeholder="Escriba el título del evento..."
      />
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Artista principal</th>
          <th>Duración</th>
          <th>Precio (Bs)</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Recinto</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="evento in eventosFiltrados" :key="evento.id">
          <td>{{ evento.id }}</td>
          <td>{{ evento.titulo }}</td>
          <td>{{ evento.artistaPrincipal }}</td>
          <td>{{ evento.duracionMinutos }} min</td>
          <td>{{ evento.precioEntrada }}</td>
          <td>{{ formatearFecha(evento.fechaEvento) }}</td>
          <td>{{ evento.estado }}</td>
          <td>{{ evento.recinto?.nombre ?? "No especificado" }}</td>
          <td>
            <button type="button" @click="seleccionarEvento(evento)">
              Modificar
            </button>

            <button type="button" @click="eliminar(evento.id)">Eliminar</button>
          </td>
        </tr>

        <tr v-if="eventosFiltrados.length === 0">
          <td colspan="9">No se encontraron eventos.</td>
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

input,
select {
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
