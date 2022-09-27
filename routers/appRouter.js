import express from "express";
import {
  inicio,
  categorias,
  noEncontrado,
  buscador,
} from "../controlers/appController.js";

const router = express.Router();

router.get("/", inicio);
router.get("/categorias/:id", categorias);
router.get("/404", noEncontrado);
router.post("/buscador", buscador);

export default router;
