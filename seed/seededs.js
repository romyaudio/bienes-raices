import Categorias from "./categorias.js";
import Users from "./user.js";
import Precios from "./precios.js";
import Usermatas from "./usermata.js";

import { Categoria, Precio, Usermata, User } from "../models/index.js";
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    await db.authenticate();
    await db.sync();
    await Promise.all([
      Categoria.bulkCreate(Categorias),
      Precio.bulkCreate(Precios),
      User.bulkCreate(Users),
      Usermata.bulkCreate(Usermatas),
    ]);

    console.log("Datos insectado corectamente");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    // await Promise.all([
    //   Categoria.destroy({ where: {}, truncate: true }),
    //   Precio.destroy({ where: {}, truncate: true }),
    // ]);
    await db.sync({ force: true });
    console.log("Datos eleiminado corectamente");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
if (process.argv[2] === "-i") {
  importarDatos();
}
if (process.argv[2] === "-e") {
  eliminarDatos();
}
