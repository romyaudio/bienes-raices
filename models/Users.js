import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Users = db.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: DataTypes.STRING,
  verified: DataTypes.BOOLEAN,
});
export default Users;
