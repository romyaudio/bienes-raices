(function () {
  const lat = 19.4528191;
  const lng = -70.7511525;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 9);
  let markers = new L.featureGroup().addTo(mapa);
  let propiedades = [];
  const filtros = {
    categoria: "",
    precio: "",
  };

  const selectCategoria = document.querySelector("#categorias");
  const selectPrecio = document.querySelector("#precios");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  selectCategoria.addEventListener("change", (e) => {
    filtros.categoria = +e.target.value;
    filtrarPropiedades();
  });

  selectPrecio.addEventListener("change", (e) => {
    filtros.precio = +e.target.value;
    filtrarPropiedades();
  });

  const obtenerPropiedades = async () => {
    try {
      const url = "/api/propiedades/";
      const repuesta = await fetch(url);
      propiedades = await repuesta.json();
      mostrarPropiedades(propiedades);
    } catch (error) {
      console.log(error);
    }
  };
  const mostrarPropiedades = (propiedades) => {
    markers.clearLayers();
    propiedades.forEach((propiedad) => {
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true,
      })
        .addTo(mapa)
        .bindPopup(
          `
          <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
          <h1 class="text-xl font-bold uppercase my-5">${propiedad?.titulo}</h1>
           <img src="/uploads/${propiedad?.image}" alt=${propiedad?.titulo}>
           <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
           <a href="/propiedad/${propiedad?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase ">Ver Propiedad</a>
          `
        );

      markers.addLayer(marker);
    });
  };

  const filtrarPropiedades = () => {
    const resultado = propiedades
      .filter(filtrarCategoria)
      .filter(filtrarPrecio);
    mostrarPropiedades(resultado);
  };
  const filtrarCategoria = (propiedad) =>
    filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;

  const filtrarPrecio = (propiedad) =>
    filtros.precio ? propiedad.precioId === filtros.precio : propiedad;

  obtenerPropiedades();
})();
