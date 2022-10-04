import {
  Categoria,
  Precio,
  Propiedad,
  Mensage,
  User,
} from "../models/index.js";
import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { esVendedor, formatiarFecha } from "../helpers/index.js";

const admin = async (req, res) => {
  const { page } = req.query;
  const exprecion = /^[1-9]$/;
  if (!exprecion.test(page)) {
    return res.redirect("/dashboard?page=1");
  }
  try {
    const { id } = req.user;

    const limit = 10;
    const offset = page * limit - limit;
    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit,
        offset,
        where: { userId: id },
        include: [
          { model: Categoria, as: "categoria" },
          { model: Precio, as: "precio" },
          { model: Mensage },
        ],
      }),
      Propiedad.count({
        where: { userId: id },
      }),
    ]);

    res.render("propiedades/dashboard", {
      pagina: "Dashboard",
      propiedades,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total / limit),
      page: Number(page),
      offset,
      limit,
      total,
    });
  } catch (error) {
    console.log(error);
  }
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
const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  const user = req.user.id.toString();
  if (propiedad.userId.toString() !== user) {
    return res.redirect("/dashboard");
  }
  propiedad.publicado = !propiedad.publicado;
  await propiedad.save();
  res.json({ resultado: true });
};
const mostrarPropiedad = async (req, res) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
  if (!propiedad || !propiedad.publicado) {
    return res.redirect("/404");
  }

  res.render("propiedades/mostrar", {
    propiedad,
    pagina: propiedad.titulo,
    csrfToken: req.csrfToken(),
    user: req.user,
    esVendedor: esVendedor(req.user?.id, propiedad.userId),
  });
};

const enviarMensage = async (req, res) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render("propiedades/mostrar", {
      propiedad,
      pagina: propiedad.titulo,
      csrfToken: req.csrfToken(),
      user: req.user,
      esVendedor: esVendedor(req.user?.id, propiedad.userId),
      errors: result.array(),
    });
  }
  const { mensage } = req.body;
  const { id: propiedadId } = req.params;
  const { id: userId } = req.user;

  await Mensage.create({
    mensage,
    propiedadId,
    userId,
  });

  return res.redirect("/");
};

const verMensage = async (req, res) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Mensage,
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      },
    ],
  });
  const user = req.user.id.toString();
  if (propiedad.userId.toString() !== user) {
    return res.redirect("/dashboard");
  }
  res.render("propiedades/mensages", {
    pagina: "Mensages",
    mensage: propiedad.mensages,
    formatiarFecha,
  });
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
  cambiarEstado,
  mostrarPropiedad,
  enviarMensage,
  verMensage,
};
