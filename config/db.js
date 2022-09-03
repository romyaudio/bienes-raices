import sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const db = new sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD ?? "",
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    define: {
      timestamps: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorAliases: false,
  }
);
export default db;
