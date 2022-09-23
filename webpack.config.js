import path from "path";
export default {
  mode: "development",
  entry: {
    mapa: "./src/js/mapa.js",
    imagen: "./src/js/agregarImagen.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("public/js"),
  },
};
