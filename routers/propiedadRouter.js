import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
  enviarMensage,
  verMensage,
} from "../controlers/propiedadController.js";
import ProtegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/SubirImagen.js";
import inditificarUsuario from "../middleware/indetificarUsuario.js";
const router = express.Router();
router.get("/dashboard", ProtegerRuta, admin);
router.get("/propiedades/crear", ProtegerRuta, crear);
router.post(
  "/propiedades/guardar",
  ProtegerRuta,
  body("titulo", "El titulo es obligatorio").notEmpty(),
  body("descripcion", "La descripcion no puede estar vacia").notEmpty(),
  body("categoria", "Seleccione una categoria").isNumeric(),
  body("precio", "Seleccione un rango de precio").isNumeric(),
  body("habitaciones", "Seleccione numero de habitaciones").isNumeric(),
  body("estacionamientos", "Seleccione numero de estacionamientos").isNumeric(),
  body("wc", "Seleccione numero de banos").isNumeric(),
  guardar
);
router.get("/propiedades-agregar-imagen/:id", ProtegerRuta, agregarImagen);
router.post(
  "/propiedades-agregar-imagen/:id",
  ProtegerRuta,
  upload.single("imagen"),
  almacenarImagen
);

router.get("/propiedades-editar/:id", ProtegerRuta, editar);

router.post(
  "/propiedades-editar/:id",
  ProtegerRuta,
  body("titulo", "El titulo es obligatorio").notEmpty(),
  body("descripcion", "La descripcion no puede estar vacia").notEmpty(),
  body("categoria", "Seleccione una categoria").isNumeric(),
  body("precio", "Seleccione un rango de precio").isNumeric(),
  body("habitaciones", "Seleccione numero de habitaciones").isNumeric(),
  body("estacionamientos", "Seleccione numero de estacionamientos").isNumeric(),
  body("wc", "Seleccione numero de banos").isNumeric(),
  guardarCambios
);

router.post("/propiedades/eliminar/:id", ProtegerRuta, eliminar);

router.get("/propiedad/:id", inditificarUsuario, mostrarPropiedad);
router.post(
  "/propiedad/:id",
  inditificarUsuario,
  body("mensage", "El mensage no puede estar vacio o es muy corto").isLength(
    10
  ),
  enviarMensage
);

router.get("/mensage/:id", ProtegerRuta, verMensage);

export default router;
