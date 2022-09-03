import express from "express";
const router = express.Router();
//router
import {
  formForget,
  formLogin,
  formRegister,
  Register,
  formVerify,
} from "../controlers/usersController.js";

router.get("/login", formLogin);
router.get("/register", formRegister);
router.post("/register", Register);
router.get("/restablecer-password", formForget);
router.get("/verify/:token", formVerify);

export default router;
