// ==========================
// FUNCIONES DE APOYO PARA DOCUMENTOS PDF
// ==========================

// Carga el array de documentos desde localStorage
export function cargarDocumentosGuardados() {
  return JSON.parse(localStorage.getItem("cargarArchivos")) || [];
}

// Guarda el array de documentos en localStorage
export function guardarDocumentosEnLocalStorage(cargarArchivos) {
  localStorage.setItem("cargarArchivos", JSON.stringify(cargarArchivos));
}

// Valida que la identificación no esté vacía y tenga entre 8 y 10 números
export function validarIdentificacion(identificacion) {
  if (identificacion.trim() === "") {
    return "La identificación no puede estar vacía.";
  }

  if (!/^\d{8,10}$/.test(identificacion)) {
    return "La identificación debe tener entre 8 y 10 números.";
  }

  return "";
}

// Limpia el nombre del archivo quitando espacios y caracteres raros
export function limpiarNombreArchivo(nombreArchivo) {
  return nombreArchivo
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

// Valida que el archivo exista y sea PDF
export function validarArchivoPDF(archivo) {
  if (!archivo) {
    return "Debe seleccionar un archivo PDF.";
  }

  const nombreLimpio = limpiarNombreArchivo(archivo.name);

  if (nombreLimpio === "") {
    return "El nombre del archivo no puede quedar vacío.";
  }

  const extension = nombreLimpio.split(".").pop().toLowerCase();

  if (extension !== "pdf") {
    return "Solo se permiten archivos en formato PDF.";
  }

  return "";
}

// Crea el nombre final del archivo
export function crearNombreFinal(identificacion, nombreOriginal) {
  const nombreLimpio = limpiarNombreArchivo(nombreOriginal);

  return identificacion + "-" + nombreLimpio;
}

// Guarda físicamente el PDF en una carpeta llamada documentos
export async function guardarArchivoEnCarpeta(archivo, nombreFinal) {
  if (!window.showDirectoryPicker) {
    throw new Error("Tu navegador no permite guardar archivos en carpetas. Usa Google Chrome.");
  }

  // El usuario selecciona una carpeta base
  const carpetaBase = await window.showDirectoryPicker();

  // Dentro de esa carpeta se crea o se usa una carpeta llamada documentos
  const carpetaDocumentos = await carpetaBase.getDirectoryHandle("documentos", {
    create: true
  });

  // Se crea el archivo PDF dentro de la carpeta documentos
  const archivoDestino = await carpetaDocumentos.getFileHandle(nombreFinal, {
    create: true
  });

  const escritura = await archivoDestino.createWritable();

  await escritura.write(archivo);

  await escritura.close();

  return "Archivo guardado en la carpeta documentos";
}