import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Propiedad = db.define("propiedades", {
  id: {
    type: DataTypes.UUID,
    dafaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  habitaciones: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estacionamientos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  calle: {
    type: DataTypes.STRING(60),
  },
  lat: {
    type: DataTypes.STRING,
  },
  lng: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    dafaultValue: false,
  },
});
export default Propiedad;
