let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
let tecnomecanicas = JSON.parse(localStorage.getItem("tecnomecanicas")) || [];
let detallesTecnomecanica = JSON.parse(localStorage.getItem("detallesTecnomecanica")) || [];

let editandoTecnomecanica = null;
let editandoDetalle = null;

function cargarVehiculosTecnomecanica() {
  const select = document.getElementById("vehiculoTecnomecanica");

  select.innerHTML = '<option value="">Seleccione vehículo</option>';

  vehiculos.forEach(vehiculo => {
    const option = document.createElement("option");

    option.value = vehiculo.idVehiculo;
    option.textContent = `${vehiculo.codigo} - ${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`;

    select.appendChild(option);
  });
}

function cargarTecnomecanicasDetalle() {
  const select = document.getElementById("tecnomecanicaDetalle");

  select.innerHTML = '<option value="">Seleccione tecnomecánica</option>';

  tecnomecanicas.forEach(tecnomecanica => {
    const option = document.createElement("option");

    option.value = tecnomecanica.idTecnomecanica;
    option.textContent = `${tecnomecanica.ordenServicio} - ${tecnomecanica.vehiculo}`;

    select.appendChild(option);
  });
}

document.getElementById("formTecnomecanica").addEventListener("submit", function (e) {
  e.preventDefault();

  const selectVehiculo = document.getElementById("vehiculoTecnomecanica");
  const textoVehiculo = selectVehiculo.options[selectVehiculo.selectedIndex].text;

  const tecnomecanica = {
    idTecnomecanica: editandoTecnomecanica !== null ? tecnomecanicas[editandoTecnomecanica].idTecnomecanica : Date.now(),
    ordenServicio: document.getElementById("ordenServicio").value,
    fechaSolicitudMantenimiento: document.getElementById("fechaSolicitudMantenimiento").value,
    idVehiculo: document.getElementById("vehiculoTecnomecanica").value,
    vehiculo: textoVehiculo,
    nombreTecnico: document.getElementById("nombreTecnico").value,
    fechaMantenimiento: document.getElementById("fechaMantenimiento").value,
    estado: document.getElementById("estadoTecnomecanica").value,
    fechaCreacion: editandoTecnomecanica !== null ? tecnomecanicas[editandoTecnomecanica].fechaCreacion : new Date().toLocaleDateString()
  };

  if (editandoTecnomecanica !== null) {
    tecnomecanicas[editandoTecnomecanica] = tecnomecanica;
    editandoTecnomecanica = null;
  } else {
    tecnomecanicas.push(tecnomecanica);
  }

  localStorage.setItem("tecnomecanicas", JSON.stringify(tecnomecanicas));

  this.reset();
  mostrarTecnomecanicas();
  cargarTecnomecanicasDetalle();
});

function mostrarTecnomecanicas() {
  const lista = document.getElementById("listaTecnomecanicas");

  lista.innerHTML = "";

  tecnomecanicas.forEach((tecnomecanica, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      Orden: ${tecnomecanica.ordenServicio} - 
      Vehículo: ${tecnomecanica.vehiculo} - 
      Técnico: ${tecnomecanica.nombreTecnico} - 
      Estado: ${tecnomecanica.estado}
      <button onclick="editarTecnomecanica(${index})">Editar</button>
      <button onclick="eliminarTecnomecanica(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}

function editarTecnomecanica(index) {
  const tecnomecanica = tecnomecanicas[index];

  document.getElementById("ordenServicio").value = tecnomecanica.ordenServicio;
  document.getElementById("fechaSolicitudMantenimiento").value = tecnomecanica.fechaSolicitudMantenimiento;
  document.getElementById("vehiculoTecnomecanica").value = tecnomecanica.idVehiculo;
  document.getElementById("nombreTecnico").value = tecnomecanica.nombreTecnico;
  document.getElementById("fechaMantenimiento").value = tecnomecanica.fechaMantenimiento;
  document.getElementById("estadoTecnomecanica").value = tecnomecanica.estado;

  editandoTecnomecanica = index;
}

function eliminarTecnomecanica(index) {
  tecnomecanicas.splice(index, 1);

  localStorage.setItem("tecnomecanicas", JSON.stringify(tecnomecanicas));

  mostrarTecnomecanicas();
  cargarTecnomecanicasDetalle();
}

document.getElementById("formDetalleTecnomecanica").addEventListener("submit", function (e) {
  e.preventDefault();

  const detalle = {
    idDetalleTecnomecanica: editandoDetalle !== null ? detallesTecnomecanica[editandoDetalle].idDetalleTecnomecanica : Date.now(),
    idTecnomecanica: document.getElementById("tecnomecanicaDetalle").value,
    actividad: document.getElementById("actividad").value,
    nombreActividad: document.getElementById("nombreActividad").value,
    evaluacionAnalisis: document.getElementById("evaluacionAnalisis").value,
    fechaActividad: document.getElementById("fechaActividad").value
  };

  if (editandoDetalle !== null) {
    detallesTecnomecanica[editandoDetalle] = detalle;
    editandoDetalle = null;
  } else {
    detallesTecnomecanica.push(detalle);
  }

  localStorage.setItem("detallesTecnomecanica", JSON.stringify(detallesTecnomecanica));

  this.reset();
  mostrarDetallesTecnomecanica();
});

function mostrarDetallesTecnomecanica() {
  const lista = document.getElementById("listaDetallesTecnomecanica");

  lista.innerHTML = "";

  detallesTecnomecanica.forEach((detalle, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      Actividad: ${detalle.actividad} - 
      Nombre: ${detalle.nombreActividad} - 
      Evaluación: ${detalle.evaluacionAnalisis} - 
      Fecha: ${detalle.fechaActividad}
      <button onclick="editarDetalleTecnomecanica(${index})">Editar</button>
      <button onclick="eliminarDetalleTecnomecanica(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}

function editarDetalleTecnomecanica(index) {
  const detalle = detallesTecnomecanica[index];

  document.getElementById("tecnomecanicaDetalle").value = detalle.idTecnomecanica;
  document.getElementById("actividad").value = detalle.actividad;
  document.getElementById("nombreActividad").value = detalle.nombreActividad;
  document.getElementById("evaluacionAnalisis").value = detalle.evaluacionAnalisis;
  document.getElementById("fechaActividad").value = detalle.fechaActividad;

  editandoDetalle = index;
}

function eliminarDetalleTecnomecanica(index) {
  detallesTecnomecanica.splice(index, 1);

  localStorage.setItem("detallesTecnomecanica", JSON.stringify(detallesTecnomecanica));

  mostrarDetallesTecnomecanica();
}

cargarVehiculosTecnomecanica();
cargarTecnomecanicasDetalle();
mostrarTecnomecanicas();
mostrarDetallesTecnomecanica();