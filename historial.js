let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
let historialAlquiler = JSON.parse(localStorage.getItem("historialAlquiler")) || [];

let editandoHistorial = null;

function cargarVehiculosDesdeCatalogoSiEsNecesario() {
  if (vehiculos.length > 0) {
    return;
  }

  if (typeof VEHICULOS_EXCEL !== "undefined") {
    vehiculos = VEHICULOS_EXCEL.map(item => {
      return {
        idVehiculo: "VEH_" + item.codigo,
        codigo: item.codigo,
        placa: "CAT" + item.codigo,
        marca: item.marca,
        modelo: item.modelo,
        categoria: "Automóvil"
      };
    });
  }
}

function cargarClientesAlquiler() {
  const select = document.getElementById("clienteAlquiler");

  select.innerHTML = '<option value="">Seleccione cliente</option>';

  clientes.forEach(cliente => {
    const option = document.createElement("option");

    option.value = cliente.idCliente;
    option.textContent = `${cliente.cedula} - ${cliente.nombre}`;

    select.appendChild(option);
  });
}

function cargarVehiculosAlquiler() {
  const select = document.getElementById("vehiculoAlquiler");

  select.innerHTML = '<option value="">Seleccione vehículo</option>';

  vehiculos.forEach(vehiculo => {
    const option = document.createElement("option");

    option.value = vehiculo.idVehiculo;
    option.textContent = `${vehiculo.codigo} - ${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`;

    select.appendChild(option);
  });
}

function obtenerTextoSelect(idSelect) {
  const select = document.getElementById(idSelect);
  return select.options[select.selectedIndex].text;
}

document.getElementById("formHistorial").addEventListener("submit", function (e) {
  e.preventDefault();

  const historial = {
    idHistorialAlquiler: editandoHistorial !== null ? historialAlquiler[editandoHistorial].idHistorialAlquiler : Date.now(),

    numeroPedido: document.getElementById("numeroPedido").value,

    fechaEntregaVehiculo: document.getElementById("fechaEntregaVehiculo").value,
    horaEntregaVehiculo: document.getElementById("horaEntregaVehiculo").value,

    fechaDevolucionVehiculo: document.getElementById("fechaDevolucionVehiculo").value,
    horaDevolucionVehiculo: document.getElementById("horaDevolucionVehiculo").value,

    idCliente: document.getElementById("clienteAlquiler").value,
    cliente: obtenerTextoSelect("clienteAlquiler"),

    idVehiculo: document.getElementById("vehiculoAlquiler").value,
    vehiculo: obtenerTextoSelect("vehiculoAlquiler"),

    observacionesEmpresa: document.getElementById("observacionesEmpresa").value,
    observacionesEntregaCliente: document.getElementById("observacionesEntregaCliente").value,

    fechaCreacion: editandoHistorial !== null ? historialAlquiler[editandoHistorial].fechaCreacion : new Date().toLocaleDateString()
  };

  if (editandoHistorial !== null) {
    historialAlquiler[editandoHistorial] = historial;
    editandoHistorial = null;
  } else {
    historialAlquiler.push(historial);
  }

  localStorage.setItem("historialAlquiler", JSON.stringify(historialAlquiler));

  this.reset();
  mostrarHistorial();
});

function mostrarHistorial() {
  const lista = document.getElementById("listaHistorial");

  lista.innerHTML = "";

  historialAlquiler.forEach((historial, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      Pedido: ${historial.numeroPedido} - 
      Cliente: ${historial.cliente} - 
      Vehículo: ${historial.vehiculo} - 
      Entrega: ${historial.fechaEntregaVehiculo} ${historial.horaEntregaVehiculo} - 
      Devolución: ${historial.fechaDevolucionVehiculo} ${historial.horaDevolucionVehiculo}
      <button onclick="editarHistorial(${index})">Editar</button>
      <button onclick="eliminarHistorial(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}

function editarHistorial(index) {
  const historial = historialAlquiler[index];

  document.getElementById("numeroPedido").value = historial.numeroPedido;

  document.getElementById("fechaEntregaVehiculo").value = historial.fechaEntregaVehiculo;
  document.getElementById("horaEntregaVehiculo").value = historial.horaEntregaVehiculo;

  document.getElementById("fechaDevolucionVehiculo").value = historial.fechaDevolucionVehiculo;
  document.getElementById("horaDevolucionVehiculo").value = historial.horaDevolucionVehiculo;

  document.getElementById("clienteAlquiler").value = historial.idCliente;
  document.getElementById("vehiculoAlquiler").value = historial.idVehiculo;

  document.getElementById("observacionesEmpresa").value = historial.observacionesEmpresa;
  document.getElementById("observacionesEntregaCliente").value = historial.observacionesEntregaCliente;

  editandoHistorial = index;
}

function eliminarHistorial(index) {
  historialAlquiler.splice(index, 1);

  localStorage.setItem("historialAlquiler", JSON.stringify(historialAlquiler));

  mostrarHistorial();
}

cargarVehiculosDesdeCatalogoSiEsNecesario();
cargarClientesAlquiler();
cargarVehiculosAlquiler();
mostrarHistorial();