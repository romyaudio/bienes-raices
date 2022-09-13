import express from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controlers/propiedadController.js";
const router = express.Router();
router.get("/dashboard", admin);
router.get("/propiedades/crear", crear);
router.post(
  "/propiedades/guardar",
  body("titulo", "El titulo es obligatorio").notEmpty(),
  body("descripcion", "La descripcion no puede estar vacia").notEmpty(),
  body("categoria", "Seleccione una categoria").isNumeric(),
  body("precio", "Seleccione un rango de precio").isNumeric(),
  body("habitaciones", "Seleccione numero de habitaciones").isNumeric(),
  body("estacionamientos", "Seleccione numero de estacionamientos").isNumeric(),
  body("wc", "Seleccione numero de banos").isNumeric(),

  guardar
);

export default router;
