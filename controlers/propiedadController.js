import { Categoria, Precio, Propiedad } from "../models/index.js";
import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";

const admin = async (req, res) => {
  const { id } = req.user;
  const propiedades = await Propiedad.findAll({
    where: { userId: id },
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
  res.render("propiedades/dashboard", {
    pagina: "Dashboard",
    propiedades,
    csrfToken: req.csrfToken(),
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

  const { id: userId } = req.user;
  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamientos,
      wc,
      calle,
      lat,
      lng,
      image: "",
      precioId: precio,
      categoriaId: categoria,
      userId,
    });
    const { id } = propiedadGuardada;
    res.redirect(`/propiedades-agregar-imagen/${id}`);
  } catch (error) {}
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/dashboard");
  }
  if (propiedad.publicado) {
    return res.redirect("/dashboard");
  }
  if (req.user.id.toString() !== propiedad.userId.toString()) {
    return res.redirect("/dashboard");
  }
  res.render("propiedades/agregar-imagen", {
    pagina: `Agrega imagenes: ${propiedad.titulo}`,
    propiedad,
    csrfToken: req.csrfToken(),
  });
};
const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/dashboard");
  }
  if (propiedad.publicado) {
    return res.redirect("/dashboard");
  }
  if (req.user.id.toString() !== propiedad.userId.toString()) {
    return res.redirect("/dashboard");
  }
  try {
    propiedad.image = req.file.filename;
    propiedad.publicado = true;
    await propiedad.save();
    next();
  } catch (error) {
    console.log(error);
  }
};
const editar = async (req, res) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  const user = req.user.id.toString();
  if (propiedad.userId.toString() !== user) {
    return res.redirect("/dashboard");
  }
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);
  res.render("propiedades/editar", {
    pagina: `Editado la Propiedad: ${propiedad.titulo}`,
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad,
  });
};
const guardarCambios = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);
    res.render("propiedades/editar", {
      pagina: "Editar una Propiedad",
      barra: true,
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errors: results.array(),
      datos: req.body,
    });
  }
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  const user = req.user.id.toString();
  if (propiedad.userId.toString() !== user) {
    return res.redirect("/dashboard");
  }
  try {
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

    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      estacionamientos,
      wc,
      lat,
      lng,
      precioId: precio,
      categoriaId: categoria,
    });

    await propiedad.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  const user = req.user.id.toString();
  if (propiedad.userId.toString() !== user) {
    return res.redirect("/dashboard");
  }
  await unlink(`public/uploads/${propiedad.image}`);
  console.log(`se eliminaron la imagene ${propiedad.image}`);
  await propiedad.destroy();
  res.redirect("/dashboard");
};

const mostrarPropiedad = async (req, res) => {
  res.send("mostrando...");
};

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
};
