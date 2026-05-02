// =====================
// DATOS (YA LOS TIENES EN TU ENV)
// =====================
// DEPARTAMENTOS
// MUNICIPIOS
// BARRIOS


// =====================
// VARIABLES
// =====================
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editandoIndex = null;


// =====================
// CARGAR DEPARTAMENTOS
// =====================
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


// =====================
// CARGAR MUNICIPIOS
// =====================
function cargarMunicipios(idDep) {
  const selectMunicipio = document.getElementById("municipio");
  const selectBarrio = document.getElementById("barrio");

  selectMunicipio.innerHTML = '<option value="">Seleccione Municipio</option>';
  selectBarrio.innerHTML = '<option value="">Seleccione Barrio</option>';

  if (!idDep) return;

  const filtrados = MUNICIPIOS
    .filter(m => m.idDepartamento == idDep)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  filtrados.forEach(m => {
    const option = document.createElement("option");
    option.value = m.id;
    option.textContent = m.nombre;
    selectMunicipio.appendChild(option);
  });
}


// =====================
// CARGAR BARRIOS
// =====================
function cargarBarrios(idMun) {
  const selectBarrio = document.getElementById("barrio");

  selectBarrio.innerHTML = '<option value="">Seleccione Barrio</option>';

  if (!idMun) {
    idMun = document.getElementById("municipio").value;
  }

  const barriosFiltrados = BARRIOS.filter(
    b => b.idMunicipio == idMun
  );

  barriosFiltrados.forEach(barrio => {
    const option = document.createElement("option");
    option.value = barrio.id;
    option.textContent = barrio.nombre;
    selectBarrio.appendChild(option);
  });

  // 🔥 FORZAR VISUALIZACIÓN (SOLUCIÓN CLAVE)
  if (barriosFiltrados.length > 0) {
    selectBarrio.size = Math.min(8, barriosFiltrados.length);
  } else {
    selectBarrio.size = 1;
  }
}

// =====================
// EVENTOS SELECT
// =====================
document.getElementById("departamento").addEventListener("change", function () {
  cargarMunicipios(Number(this.value));
});

document.getElementById("municipio").addEventListener("change", function () {
  cargarBarrios(this.value); // 🔥 ahora sí se usa
});


// =====================
// GUARDAR CLIENTE
// =====================
document.getElementById("formCliente").addEventListener("submit", function (e) {
  e.preventDefault();

  const cliente = {
    nombre: document.getElementById("nombre").value,
    cedula: document.getElementById("cedula").value,
    telefono: document.getElementById("telefono").value,
    correo: document.getElementById("correo").value,
    licencia: document.getElementById("licencia").value,
    tipo: document.getElementById("tipo").value,
    departamento: document.getElementById("departamento").value,
    municipio: document.getElementById("municipio").value,
    barrio: document.getElementById("barrio").value
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
});


// =====================
// MOSTRAR CLIENTES
// =====================
function mostrarClientes() {
  const lista = document.getElementById("listaClientes");
  lista.innerHTML = "";

  clientes.forEach((c, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${c.nombre} - ${c.cedula}
      <button onclick="editarCliente(${index})">Editar</button>
      <button onclick="eliminarCliente(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}


// =====================
// EDITAR CLIENTE
// =====================
function editarCliente(index) {
  const c = clientes[index];
  editandoIndex = index;

  document.getElementById("nombre").value = c.nombre;
  document.getElementById("cedula").value = c.cedula;
  document.getElementById("telefono").value = c.telefono;
  document.getElementById("correo").value = c.correo;
  document.getElementById("licencia").value = c.licencia;
  document.getElementById("tipo").value = c.tipo;

  // Departamento
  document.getElementById("departamento").value = c.departamento;
  cargarMunicipios(Number(c.departamento));

  // Municipio
  const selectMunicipio = document.getElementById("municipio");
  selectMunicipio.value = c.municipio;

  // 🔥 FORZAR CARGA DE BARRIOS (SIN depender de eventos)
  cargarBarrios(c.municipio);

  // Barrio
  document.getElementById("barrio").value = c.barrio;
}


// =====================
// ELIMINAR CLIENTE
// =====================
function eliminarCliente(index) {
  clientes.splice(index, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}


// =====================
// INICIO
// =====================
cargarDepartamentos();
mostrarClientes();