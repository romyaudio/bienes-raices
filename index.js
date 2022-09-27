import express from "express";
import usersRouter from "./routers/usersRouter.js";
import propiedadRouter from "./routers/propiedadRouter.js";
import appRouter from "./routers/appRouter.js";
import apiRouter from "./routers/apiRouter.js";
import db from "./config/db.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";
//crear la app
const app = express();

//habilita letura de formulario
app.use(express.urlencoded({ extended: true }));

//habilitar cookie-parser
app.use(cookieParser());

//habilita csrf
app.use(csrf({ cookie: true }));

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
app.use("/", appRouter);
app.use("/auth", usersRouter);
app.use("/", propiedadRouter);
app.use("/api", apiRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
