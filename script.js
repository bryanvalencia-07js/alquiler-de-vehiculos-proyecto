let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editandoIndex = null;

function cargarDepartamentos() {
  const select = document.getElementById("departamento");

  select.innerHTML = '<option value="">Seleccione Departamento</option>';

  DEPARTAMENTOS
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .forEach(dep => {
      const option = document.createElement("option");
      option.value = dep.id;
      option.textContent = dep.nombre;
      select.appendChild(option);
    });
}

function cargarMunicipios(idDepartamento) {
  const selectMunicipio = document.getElementById("municipio");
  const selectBarrio = document.getElementById("barrio");

  selectMunicipio.innerHTML = '<option value="">Seleccione Municipio</option>';
  selectBarrio.innerHTML = '<option value="">Seleccione Barrio</option>';

  if (!idDepartamento) return;

  const municipiosFiltrados = MUNICIPIOS
    .filter(municipio => municipio.idDepartamento == idDepartamento)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  municipiosFiltrados.forEach(municipio => {
    const option = document.createElement("option");
    option.value = municipio.id;
    option.textContent = municipio.nombre;
    selectMunicipio.appendChild(option);
  });
}

function cargarBarrios(idMunicipio) {
  const selectBarrio = document.getElementById("barrio");

  selectBarrio.innerHTML = '<option value="">Seleccione Barrio</option>';

  if (!idMunicipio) return;

  const barriosFiltrados = BARRIOS
    .filter(barrio => barrio.idMunicipio == idMunicipio)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  barriosFiltrados.forEach(barrio => {
    const option = document.createElement("option");
    option.value = barrio.id;
    option.textContent = barrio.nombre;
    selectBarrio.appendChild(option);
  });
}

function obtenerTextoSelect(idSelect) {
  const select = document.getElementById(idSelect);
  return select.options[select.selectedIndex].text;
}

document.getElementById("departamento").addEventListener("change", function () {
  cargarMunicipios(this.value);
});

document.getElementById("municipio").addEventListener("change", function () {
  cargarBarrios(this.value);
});

document.getElementById("formCliente").addEventListener("submit", function (e) {
  e.preventDefault();

  const cliente = {
    idCliente: editandoIndex !== null ? clientes[editandoIndex].idCliente : Date.now(),
    cedula: document.getElementById("cedula").value,
    nombre: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,

    idDepartamento: document.getElementById("departamento").value,
    departamento: obtenerTextoSelect("departamento"),

    idCiudad: document.getElementById("municipio").value,
    ciudad: obtenerTextoSelect("municipio"),

    idBarrio: document.getElementById("barrio").value,
    barrio: obtenerTextoSelect("barrio"),

    whatsapp: document.getElementById("whatsapp").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    numeroLicenciaConduccion: document.getElementById("numeroLicenciaConduccion").value,
    categoriaLicencia: document.getElementById("categoriaLicencia").value,
    fechaVencimientoLicencia: document.getElementById("fechaVencimientoLicencia").value,
    fechaCreacion: editandoIndex !== null ? clientes[editandoIndex].fechaCreacion : new Date().toLocaleDateString()
  };

  if (editandoIndex !== null) {
    clientes[editandoIndex] = cliente;
    editandoIndex = null;
  } else {
    clientes.push(cliente);
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));

  mostrarClientes();
  this.reset();

  document.getElementById("municipio").innerHTML = '<option value="">Seleccione Municipio</option>';
  document.getElementById("barrio").innerHTML = '<option value="">Seleccione Barrio</option>';
});

function mostrarClientes() {
  const lista = document.getElementById("listaClientes");
  lista.innerHTML = "";

  clientes.forEach((cliente, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${cliente.nombre} - ${cliente.cedula} - ${cliente.ciudad}
      <button onclick="editarCliente(${index})">Editar</button>
      <button onclick="eliminarCliente(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}

function editarCliente(index) {
  const cliente = clientes[index];
  editandoIndex = index;

  document.getElementById("cedula").value = cliente.cedula;
  document.getElementById("nombre").value = cliente.nombre;
  document.getElementById("direccion").value = cliente.direccion;
  document.getElementById("whatsapp").value = cliente.whatsapp;
  document.getElementById("telefono").value = cliente.telefono;
  document.getElementById("email").value = cliente.email;
  document.getElementById("numeroLicenciaConduccion").value = cliente.numeroLicenciaConduccion;
  document.getElementById("categoriaLicencia").value = cliente.categoriaLicencia;
  document.getElementById("fechaVencimientoLicencia").value = cliente.fechaVencimientoLicencia;

  document.getElementById("departamento").value = cliente.idDepartamento;
  cargarMunicipios(cliente.idDepartamento);

  document.getElementById("municipio").value = cliente.idCiudad;
  cargarBarrios(cliente.idCiudad);

  document.getElementById("barrio").value = cliente.idBarrio;
}


function eliminarCliente(index) {
  clientes.splice(index, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}

cargarDepartamentos();
mostrarClientes();