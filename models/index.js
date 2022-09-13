import Propiedad from "./propidades.js";
import Categoria from "./categorias.js";
import Precio from "./precios.js";
import User from "./Users.js";

Precio.hasOne(Propiedad);
Categoria.hasOne(Propiedad);
User.hasOne(Propiedad);
export { Propiedad, Categoria, Precio, User };
