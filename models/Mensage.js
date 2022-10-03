import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Mensage = db.define("mensages", {
  mensage: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
export default Mensage;
