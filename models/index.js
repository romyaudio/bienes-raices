import Propiedad from "./propidades.js";
import Categoria from "./categorias.js";
import Precio from "./precios.js";
import User from "./Users.js";
import Usermata from "./Usermeta.js";
import Mensage from "./Mensage.js";

Propiedad.belongsTo(Precio, { foreignKey: "precioId" });
Propiedad.belongsTo(Categoria, { foreignKey: "categoriaId" });
Propiedad.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Usermata, { foreignKey: "userId" });
Propiedad.hasMany(Mensage, { foreignKey: "propiedadId" });

Mensage.belongsTo(Propiedad, { foreignKey: "propiedadId" });
Mensage.belongsTo(User, { foreignKey: "userId" });

export { Propiedad, Categoria, Precio, User, Usermata, Mensage };
