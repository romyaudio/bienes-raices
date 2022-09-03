import express from "express";
import usersRouter from "./routers/usersRouter.js";
import db from "./config/db.js";
//crear la app
const app = express();

//habilita letura de formulario
app.use(express.urlencoded({ extended: true }));

//conection a databese
try {
  await db.authenticate();
  db.sync();
  console.log("coneccion correta");
} catch (error) {
  console.log(error);
}
//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta publica
app.use(express.static("public"));

//router
app.use("/auth", usersRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
