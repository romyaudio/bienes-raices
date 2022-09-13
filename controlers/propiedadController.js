import { Categoria, Precio, Propiedad } from "../models/index.js";
import { validationResult } from "express-validator";

const admin = (req, res) => {
  res.render("propiedades/dashboard", {
    pagina: "Dashboard",
    barra: true,
  });
};

const crear = async (req, res) => {
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);
  res.render("propiedades/crear", {
    pagina: "Crear una Propiedad",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  });
};

const guardar = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);
    res.render("propiedades/crear", {
      pagina: "Crear una Propiedad",
      barra: true,
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errors: results.array(),
      datos: req.body,
    });
  }
  const {
    titulo,
    descripcion,
    categoria,
    precio,
    habitaciones,
    estacionamientos,
    wc,
    calle,
    lat,
    lng,
  } = req.body;
  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      categoriaId: categoria,
      precioId: precio,
      habitaciones,
      estacionamientos,
      wc,
      calle,
      lat,
      lng,
    });
  } catch (error) {}
};
export { admin, crear, guardar };
