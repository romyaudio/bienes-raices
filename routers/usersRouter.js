import express from "express";
const router = express.Router();

//router
import {
  login,
  cerrarSesion,
  formForget,
  formLogin,
  formRegister,
  Register,
  formVerify,
  resetPassword,
  verityTokenPassword,
  newPassword,
} from "../controlers/usersController.js";

router.get("/login", formLogin);
router.post("/login", login);
router.post("/cerrar-sesion", cerrarSesion);
router.get("/register", formRegister);
router.post("/register", Register);
router.get("/verify/:token", formVerify);
router.get("/restablecer-password", formForget);
router.post("/restablecer-password", resetPassword);
router.get("/restablecer-password/:token", verityTokenPassword);
router.post("/restablecer-password/:token", newPassword);

export default router;
