let marcas = JSON.parse(localStorage.getItem("marcasVehiculos")) || [];
let categorias = JSON.parse(localStorage.getItem("categoriasVehiculos")) || [];
let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

let editandoMarca = null;
let editandoCategoria = null;
let editandoVehiculo = null;

function normalizarTexto(texto) {
  return texto
    .toString()
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function obtenerMarcaIdPorNombre(nombreMarca) {
  let marcaEncontrada = marcas.find(
    marca => marca.nombre.toLowerCase() === nombreMarca.toLowerCase()
  );

  if (marcaEncontrada) {
    return marcaEncontrada.idMarcaVehiculo;
  }

  const nuevaMarca = {
    idMarcaVehiculo: "MAR_" + normalizarTexto(nombreMarca),
    codigo: normalizarTexto(nombreMarca).substring(0, 3),
    nombre: nombreMarca
  };

  marcas.push(nuevaMarca);
  return nuevaMarca.idMarcaVehiculo;
}

function obtenerCategoriaAutomovil() {
  let categoriaEncontrada = categorias.find(
    categoria =>
      categoria.nombre.toLowerCase() === "automóvil" ||
      categoria.nombre.toLowerCase() === "automovil"
  );

  if (categoriaEncontrada) {
    return categoriaEncontrada.idCategoriaVehiculo;
  }

  const nuevaCategoria = {
    idCategoriaVehiculo: "CAT_AUTOMOVIL",
    codigo: "AUT",
    nombre: "Automóvil",
    valorHoraAlquiler: 25000
  };

  categorias.push(nuevaCategoria);
  return nuevaCategoria.idCategoriaVehiculo;
}

function generarCodigoVehiculo() {
  const codigosNumericos = vehiculos
    .map(vehiculo => parseInt(vehiculo.codigo))
    .filter(codigo => !isNaN(codigo));

  const ultimoCodigo = codigosNumericos.length > 0 ? Math.max(...codigosNumericos) : 0;

  return String(ultimoCodigo + 1).padStart(3, "0");
}

function obtenerTextoSelect(idSelect) {
  const select = document.getElementById(idSelect);
  return select.options[select.selectedIndex].text;
}

function sembrarVehiculosIniciales() {
  if (localStorage.getItem("catalogoVehiculosCargado") === "SI" && vehiculos.length > 0) {
    return;
  }

  if (typeof VEHICULOS_EXCEL === "undefined") {
    console.error("No se encontró el archivo catalogoVehiculos.js o la variable VEHICULOS_EXCEL.");
    return;
  }

  const idCategoriaAutomovil = obtenerCategoriaAutomovil();

  VEHICULOS_EXCEL.forEach(item => {
    const yaExiste = vehiculos.some(vehiculo => vehiculo.codigo === item.codigo);

    if (!yaExiste) {
      const idMarca = obtenerMarcaIdPorNombre(item.marca);

      const vehiculo = {
        idVehiculo: "VEH_" + item.codigo,
        codigo: item.codigo,
        placa: "CAT" + item.codigo,
        idMarcaVehiculo: idMarca,
        marca: item.marca,
        idCategoriaVehiculo: idCategoriaAutomovil,
        categoria: "Automóvil",
        modelo: item.modelo,
        snMotor: "",
        snChasis: "",
        numeroSoat: "",
        fechaVencimientoSoat: "",
        tarjetaPropiedad: "",
        capacidadPersonas: "",
        idGPS: "",
        fechaCreacion: new Date().toLocaleDateString()
      };

      vehiculos.push(vehiculo);
    }
  });

  localStorage.setItem("marcasVehiculos", JSON.stringify(marcas));
  localStorage.setItem("categoriasVehiculos", JSON.stringify(categorias));
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
  localStorage.setItem("catalogoVehiculosCargado", "SI");
}

document.getElementById("formMarca").addEventListener("submit", function (e) {
  e.preventDefault();

  const marca = {
    idMarcaVehiculo: editandoMarca !== null ? marcas[editandoMarca].idMarcaVehiculo : Date.now(),
    codigo: document.getElementById("codigoMarca").value,
    nombre: document.getElementById("nombreMarca").value
  };

  if (editandoMarca !== null) {
    marcas[editandoMarca] = marca;
    editandoMarca = null;
  } else {
    marcas.push(marca);
  }

  localStorage.setItem("marcasVehiculos", JSON.stringify(marcas));

  this.reset();
  mostrarMarcas();
  cargarSelectMarcas();
});

function mostrarMarcas() {
  const lista = document.getElementById("listaMarcas");
  lista.innerHTML = "";

  marcas.forEach((marca, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${marca.codigo} - ${marca.nombre}
      <button onclick="editarMarca(${index})">Editar</button>
      <button onclick="eliminarMarca(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}

function editarMarca(index) {
  const marca = marcas[index];

  document.getElementById("codigoMarca").value = marca.codigo;
  document.getElementById("nombreMarca").value = marca.nombre;

  editandoMarca = index;
}

function eliminarMarca(index) {
  marcas.splice(index, 1);
  localStorage.setItem("marcasVehiculos", JSON.stringify(marcas));

  mostrarMarcas();
  cargarSelectMarcas();
}

document.getElementById("formCategoria").addEventListener("submit", function (e) {
  e.preventDefault();

  const categoria = {
    idCategoriaVehiculo: editandoCategoria !== null ? categorias[editandoCategoria].idCategoriaVehiculo : Date.now(),
    codigo: document.getElementById("codigoCategoria").value,
    nombre: document.getElementById("nombreCategoria").value,
    valorHoraAlquiler: document.getElementById("valorHoraAlquiler").value
  };

  if (editandoCategoria !== null) {
    categorias[editandoCategoria] = categoria;
    editandoCategoria = null;
  } else {
    categorias.push(categoria);
  }

  localStorage.setItem("categoriasVehiculos", JSON.stringify(categorias));

  this.reset();
  mostrarCategorias();
  cargarSelectCategorias();
});

function mostrarCategorias() {
  const lista = document.getElementById("listaCategorias");
  lista.innerHTML = "";

  categorias.forEach((categoria, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${categoria.codigo} - ${categoria.nombre} - $${categoria.valorHoraAlquiler} por hora
      <button onclick="editarCategoria(${index})">Editar</button>
      <button onclick="eliminarCategoria(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}

function editarCategoria(index) {
  const categoria = categorias[index];

  document.getElementById("codigoCategoria").value = categoria.codigo;
  document.getElementById("nombreCategoria").value = categoria.nombre;
  document.getElementById("valorHoraAlquiler").value = categoria.valorHoraAlquiler;

  editandoCategoria = index;
}

function eliminarCategoria(index) {
  categorias.splice(index, 1);
  localStorage.setItem("categoriasVehiculos", JSON.stringify(categorias));

  mostrarCategorias();
  cargarSelectCategorias();
}

function cargarSelectMarcas() {
  const select = document.getElementById("marca");

  select.innerHTML = '<option value="">Seleccione Marca</option>';

  marcas.forEach(marca => {
    const option = document.createElement("option");
    option.value = marca.idMarcaVehiculo;
    option.textContent = marca.nombre;
    select.appendChild(option);
  });
}

function cargarSelectCategorias() {
  const select = document.getElementById("categoria");

  select.innerHTML = '<option value="">Seleccione Categoría</option>';

  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria.idCategoriaVehiculo;
    option.textContent = categoria.nombre;
    select.appendChild(option);
  });
}

document.getElementById("formVehiculo").addEventListener("submit", function (e) {
  e.preventDefault();

  const vehiculo = {
    idVehiculo: editandoVehiculo !== null ? vehiculos[editandoVehiculo].idVehiculo : Date.now(),
    codigo: editandoVehiculo !== null ? vehiculos[editandoVehiculo].codigo : generarCodigoVehiculo(),
    placa: document.getElementById("placa").value,
    idMarcaVehiculo: document.getElementById("marca").value,
    marca: obtenerTextoSelect("marca"),
    idCategoriaVehiculo: document.getElementById("categoria").value,
    categoria: obtenerTextoSelect("categoria"),
    modelo: document.getElementById("modelo").value,
    snMotor: document.getElementById("snMotor").value,
    snChasis: document.getElementById("snChasis").value,
    numeroSoat: document.getElementById("numeroSoat").value,
    fechaVencimientoSoat: document.getElementById("fechaVencimientoSoat").value,
    tarjetaPropiedad: document.getElementById("tarjetaPropiedad").value,
    capacidadPersonas: document.getElementById("capacidadPersonas").value,
    idGPS: document.getElementById("idGPS").value,
    fechaCreacion: editandoVehiculo !== null ? vehiculos[editandoVehiculo].fechaCreacion : new Date().toLocaleDateString()
  };

  if (editandoVehiculo !== null) {
    vehiculos[editandoVehiculo] = vehiculo;
    editandoVehiculo = null;
  } else {
    vehiculos.push(vehiculo);
  }

  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));

  this.reset();
  mostrarVehiculos();
});

function mostrarVehiculos() {
  const lista = document.getElementById("listaVehiculos");
  lista.innerHTML = "";

  vehiculos.forEach((vehiculo, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      Código: ${vehiculo.codigo} - Placa: ${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.categoria}
      <button onclick="editarVehiculo(${index})">Editar</button>
      <button onclick="eliminarVehiculo(${index})">Eliminar</button>
    `;

    lista.appendChild(li);
  });
}

function editarVehiculo(index) {
  const vehiculo = vehiculos[index];

  document.getElementById("placa").value = vehiculo.placa;
  document.getElementById("marca").value = vehiculo.idMarcaVehiculo;
  document.getElementById("categoria").value = vehiculo.idCategoriaVehiculo;
  document.getElementById("modelo").value = vehiculo.modelo;
  document.getElementById("snMotor").value = vehiculo.snMotor;
  document.getElementById("snChasis").value = vehiculo.snChasis;
  document.getElementById("numeroSoat").value = vehiculo.numeroSoat;
  document.getElementById("fechaVencimientoSoat").value = vehiculo.fechaVencimientoSoat;
  document.getElementById("tarjetaPropiedad").value = vehiculo.tarjetaPropiedad;
  document.getElementById("capacidadPersonas").value = vehiculo.capacidadPersonas;
  document.getElementById("idGPS").value = vehiculo.idGPS;

  editandoVehiculo = index;
}

function eliminarVehiculo(index) {
  vehiculos.splice(index, 1);
  localStorage.setItem("vehiculos", JSON.stringify(vehiculos));

  mostrarVehiculos();
}

sembrarVehiculosIniciales();
mostrarMarcas();
mostrarCategorias();
mostrarVehiculos();
cargarSelectMarcas();
cargarSelectCategorias();