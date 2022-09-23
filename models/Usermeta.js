import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usermeta = db.define("usermatas", {
  meta_key: {
    type: DataTypes.STRING(45),
  },
  meta_value: {
    type: DataTypes.TEXT,
  },
});
export default Usermeta;
