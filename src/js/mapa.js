(function () {
  const lat = document.querySelector("#lat").value || 19.4528191;
  const lng = document.querySelector("#lng").value || -70.7511525;
  const mapa = L.map("mapa").setView([lat, lng], 12);
  let marker;

  const geocodeService = L.esri.Geocoding.geocodeService();
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);
  marker.on("moveend", function (e) {
    marker = e.target;
    const posicion = marker.getLatLng();

    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    geocodeService
      .reverse()
      //.latLng(posicion, 13)
      .run(function (error, resultado) {
        //console.log(resultado);
        //console.log(error);
      });
    document.querySelector("#lat").value = posicion.lat;
    document.querySelector("#lng").value = posicion.lng;
  });
})();
