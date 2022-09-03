import { check, validationResult } from "express-validator";

import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import { generalId } from "../helpers/tokens.js";
import { emailRegister } from "../helpers/emails.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Inicial Sesion",
  });
};

const formRegister = (req, res) => {
  res.render("auth/register", {
    pagina: "Crear Cuanta",
  });
};

const Register = async (req, res) => {
  //validacion
  await check("name").notEmpty().withMessage("El nombre es requerido").run(req);
  await check("email")
    .isEmail()
    .withMessage("Email es requerido", "Este no es un email")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password minimo 6 catareteres")
    .run(req);
  await check("confpassword")
    .equals("password")
    .withMessage("password no son iguales");

  let results = validationResult(req);

  if (!results.isEmpty()) {
    return res.render("auth/register", {
      pagina: "Crea Cuenta",
      errors: results.array(),
      user: req.body,
    });
  }
  const exiteuse = await Users.findOne({ where: { email: req.body.email } });
  console.log(exiteuse);
  if (exiteuse) {
    return res.render("auth/register", {
      pagina: "Crea Cuenta",
      errors: [{ msg: "Este Usuario Ya esta registrado" }],
      user: req.body,
    });
  }
  //registrando el usuario
  const salt = await bcrypt.genSalt(10);
  const userRegister = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
    token: generalId(),
  };
  const user = await Users.create(userRegister);

  //enviamos email de cofimacion
  emailRegister(user);

  //mostrando vista de confimacion email
  res.render("templates/message-verificado", {
    pagina: "Cuenta creada",
    message: "Casi terminamos! verifica tu email ",
  });
};
const formVerify = async (req, res) => {
  const { token } = req.params;
  res.send(token);
};

const formForget = (req, res) => {
  res.render("auth/forget_password", {
    pagina: "Restablecer mi password",
  });
};

export { formLogin, formRegister, formForget, Register, formVerify };
