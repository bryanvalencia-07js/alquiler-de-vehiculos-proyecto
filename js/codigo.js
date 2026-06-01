// ==========================
// IMPORTAR FUNCIONES
// ==========================

import {
  cargarDocumentosGuardados,
  guardarDocumentosEnLocalStorage,
  validarIdentificacion,
  validarArchivoPDF,
  crearNombreFinal,
  guardarArchivoEnCarpeta
} from "../Librerias/funciones.js";

// ==========================
// VARIABLES
// ==========================

let cargarArchivos = cargarDocumentosGuardados();
let archivoSeleccionado = null;

// ==========================
// ELEMENTOS DEL HTML
// ==========================

const txtCedula = document.getElementById("txtCedula");
const txtDocumento = document.getElementById("txtDocumento");
const btnSeleccionarArchivo = document.getElementById("btnSeleccionarArchivo");
const btnGuardar = document.getElementById("btnGuardar");
const mensaje = document.getElementById("mensaje");
const rutaDestino = document.getElementById("rutaDestino");
const cuerpoTabla = document.querySelector("#tblDatos tbody");

// ==========================
// MOSTRAR MENSAJES
// ==========================

function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;

  if (esError) {
    mensaje.style.color = "red";
  } else {
    mensaje.style.color = "green";
  }
}

// ==========================
// MOSTRAR TABLA
// ==========================

function mostrarTabla() {
  cuerpoTabla.innerHTML = "";

  cargarArchivos.forEach(registro => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${registro.identificacion}</td>
      <td>${registro.documento}</td>
      <td>${registro.estadoDocumento}</td>
    `;

    cuerpoTabla.appendChild(fila);
  });
}

// ==========================
// SELECCIONAR ARCHIVO PDF
// ==========================

btnSeleccionarArchivo.addEventListener("click", async function () {
  const identificacion = txtCedula.value.trim();

  const errorIdentificacion = validarIdentificacion(identificacion);

  if (errorIdentificacion !== "") {
    mostrarMensaje(errorIdentificacion, true);
    return;
  }

  try {
    if (!window.showOpenFilePicker) {
      mostrarMensaje("Tu navegador no permite seleccionar archivos con esta función. Usa Google Chrome.", true);
      return;
    }

    const opciones = {
      types: [
        {
          description: "Archivos PDF",
          accept: {
            "application/pdf": [".pdf"]
          }
        }
      ],
      multiple: false
    };

    const archivos = await window.showOpenFilePicker(opciones);

    const archivoHandle = archivos[0];

    archivoSeleccionado = await archivoHandle.getFile();

    const errorArchivo = validarArchivoPDF(archivoSeleccionado);

    if (errorArchivo !== "") {
      archivoSeleccionado = null;
      txtDocumento.value = "";
      mostrarMensaje(errorArchivo, true);
      return;
    }

    const nombreFinal = crearNombreFinal(identificacion, archivoSeleccionado.name);

    txtDocumento.value = nombreFinal;

    mostrarMensaje("Archivo PDF seleccionado correctamente.");
  } catch (error) {
    mostrarMensaje("No se seleccionó ningún archivo.", true);
  }
});

// ==========================
// GUARDAR DOCUMENTO
// ==========================

btnGuardar.addEventListener("click", async function () {
  const identificacion = txtCedula.value.trim();

  const errorIdentificacion = validarIdentificacion(identificacion);

  if (errorIdentificacion !== "") {
    mostrarMensaje(errorIdentificacion, true);
    return;
  }

  const errorArchivo = validarArchivoPDF(archivoSeleccionado);

  if (errorArchivo !== "") {
    mostrarMensaje(errorArchivo, true);
    return;
  }

  const nombreFinal = crearNombreFinal(identificacion, archivoSeleccionado.name);

  try {
    const respuesta = await guardarArchivoEnCarpeta(archivoSeleccionado, nombreFinal);

    const registro = {
      identificacion: identificacion,
      documento: nombreFinal,
      estadoDocumento: 0
    };

    cargarArchivos.push(registro);

    guardarDocumentosEnLocalStorage(cargarArchivos);

    mostrarTabla();

    txtCedula.value = "";
    txtDocumento.value = "";
    archivoSeleccionado = null;

    rutaDestino.textContent = "Carpeta destino: documentos";
    mostrarMensaje(respuesta);
  } catch (error) {
    mostrarMensaje(error.message, true);
  }
});

// ==========================
// INICIO
// ==========================

mostrarTabla();