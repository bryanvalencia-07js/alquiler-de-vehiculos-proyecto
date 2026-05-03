let marcas = JSON.parse(localStorage.getItem("marcas")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

let editMarca = null;
let editCategoria = null;
let editVehiculo = null;

// ================= MARCAS =================
document.getElementById("formMarca").addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nombreMarca").value;

  if (editMarca !== null) {
    marcas[editMarca].nombre = nombre;
    editMarca = null;
  } else {
    marcas.push({ nombre });
  }

  localStorage.setItem("marcas", JSON.stringify(marcas));
  mostrarMarcas();
  e.target.reset();
});

function mostrarMarcas() {
  const lista = document.getElementById("listaMarcas");
  lista.innerHTML = "";

  marcas.forEach((m, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${m.nombre}
      <button onclick="editarMarca(${i})">Editar</button>
      <button onclick="eliminarMarca(${i})">Eliminar</button>
    `;
    lista.appendChild(li);
  });

  cargarSelects();
}

function editarMarca(i) {
  document.getElementById("nombreMarca").value = marcas[i].nombre;
  editMarca = i;
}

function eliminarMarca(i) {
  marcas.splice(i, 1);
  localStorage.setItem("marcas", JSON.stringify(marcas));
  mostrarMarcas();
}

// ================= CATEGORÍAS =================
document.getElementById("formCategoria").addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nombreCategoria").value;

  if (editCategoria !== null) {
    categorias[editCategoria].nombre = nombre;
    editCategoria = null;
  } else {
    categorias.push({ nombre });
  }

  localStorage.setItem("categorias", JSON.stringify(categorias));
  mostrarCategorias();
  e.target.reset();
});

function mostrarCategorias() {
  const lista = document.getElementById("listaCategorias");
  lista.innerHTML = "";

  categorias.forEach((c, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${c.nombre}
      <button onclick="editarCategoria(${i})">Editar</button>
      <button onclick="eliminarCategoria(${i})">Eliminar</button>
    `;
    lista.appendChild(li);
  });

  cargarSelects();
}

function editarCategoria(i) {
  document.getElementById("nombreCategoria").value = categorias[i].nombre;
  editCategoria = i;
}

function eliminarCategoria(i) {
  categorias.splice(i, 1);
  localStorage.setItem("categorias", JSON.stringify(categorias));
  mostrarCategorias();
}

// ================= VEHÍCULOS =================
document.getElementById("formVehiculo").addEventListener("submit", e => {
  e.preventDefault();

  const vehiculo = {
    placa: document.getElementById("placa").value,
    marca: document.getElementById("marca").value,
    categoria: document.getElementById("categoria").value,
    modelo: document.getElementById("modelo").value,
    anio: document.getElementById("anio").value
  };

  if (editVehiculo !== null) {
    vehiculos[editVehiculo] = vehiculo;
    editVehiculo = null;
  } else {
    vehiculos.push(vehiculo);
  }

  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
  mostrarVehiculos();
  e.target.reset();
});

function mostrarVehiculos() {
  const lista = document.getElementById("listaVehiculos");
  lista.innerHTML = "";

  vehiculos.forEach((v, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${v.placa} - ${v.marca} - ${v.categoria}
      <button onclick="editarVehiculo(${i})">Editar</button>
      <button onclick="eliminarVehiculo(${i})">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

function editarVehiculo(i) {
  const v = vehiculos[i];

  document.getElementById("placa").value = v.placa;
  document.getElementById("marca").value = v.marca;
  document.getElementById("categoria").value = v.categoria;
  document.getElementById("modelo").value = v.modelo;
  document.getElementById("anio").value = v.anio;

  editVehiculo = i;
}

function eliminarVehiculo(i) {
  vehiculos.splice(i, 1);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
  mostrarVehiculos();
}

// ================= SELECTS =================
function cargarSelects() {
  const selectMarca = document.getElementById("marca");
  const selectCategoria = document.getElementById("categoria");

  selectMarca.innerHTML = '<option value="">Marca</option>';
  selectCategoria.innerHTML = '<option value="">Categoría</option>';

  marcas.forEach(m => {
    const option = document.createElement("option");
    option.value = m.nombre;
    option.textContent = m.nombre;
    selectMarca.appendChild(option);
  });

  categorias.forEach(c => {
    const option = document.createElement("option");
    option.value = c.nombre;
    option.textContent = c.nombre;
    selectCategoria.appendChild(option);
  });
}

// ================= INIT =================
mostrarMarcas();
mostrarCategorias();
mostrarVehiculos();
cargarSelects();