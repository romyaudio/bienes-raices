import { check, validationResult } from "express-validator";

import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import { genJwt, generalId } from "../helpers/tokens.js";
import { emailRegister, emailResetPassword } from "../helpers/emails.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Inicial Sesion",
    csrfToken: req.csrfToken(),
  });
};

const login = async (req, res) => {
  await check("email").isEmail().withMessage("Email es requerido").run(req);
  await check("password")
    .notEmpty()
    .withMessage("El password es requerido")
    .run(req);

  let results = validationResult(req);

  if (!results.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Login",
      errors: results.array(),
      user: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  const exiteuse = await Users.findOne({ where: { email: req.body.email } });
  if (!exiteuse) {
    return res.render("auth/login", {
      pagina: "Login",
      errors: [{ msg: "Este Usuario no esta registrado" }],
      user: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  if (!exiteuse.verified) {
    return res.render("auth/login", {
      pagina: "Login",
      errors: [{ msg: "Tu cuenta no esta verificado" }],
      user: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  const { password } = req.body;
  const hashPassword = exiteuse.password;

  const match = await bcrypt.compare(password, hashPassword);
  if (!match) {
    return res.render("auth/login", {
      pagina: "Login",
      errors: [{ msg: "Email o password son incorrecto" }],
      user: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  const token = genJwt(exiteuse);
  return res
    .cookie("_token", token, {
      httpOnly: true,
    })
    .redirect("/dashboard");
};

const formRegister = (req, res) => {
  res.render("auth/register", {
    pagina: "Crear Cuanta",
    csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
    });
  }
  const exiteuse = await Users.findOne({ where: { email: req.body.email } });
  if (exiteuse) {
    return res.render("auth/register", {
      pagina: "Crea Cuenta",
      errors: [{ msg: "Este Usuario Ya esta registrado" }],
      user: req.body,
      csrfToken: req.csrfToken(),
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

  // verifiical si el token es valido
  const userToken = await Users.findOne({ where: { token } });
  if (!userToken) {
    return res.render("auth/confirm-account", {
      pagina: "Error al verifica tu cuanta",
      message: "Este token es invalido o tu cuanta ya esta verificada ",
      error: true,
    });
  }
  //verifica cuanta de usuario
  userToken.token = null;
  userToken.verified = true;
  await userToken.save();

  res.render("auth/confirm-account", {
    pagina: "Cuenta verificada",
    message: "Tu cuenta fue verificada con exito! ",
  });
};

const formForget = (req, res) => {
  res.render("auth/forget_password", {
    pagina: "Restablecer mi password",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("Este no ese un email").run(req);
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.render("auth/forget_password", {
      pagina: "Restablecer mi password",
      errors: results.array(),
      csrfToken: req.csrfToken(),
    });
  }
  // verificame el email este en nuestra base de dato
  const { email } = req.body;
  const exitedEmail = await Users.findOne({ where: { email } });
  if (!exitedEmail) {
    return res.render("auth/forget_password", {
      pagina: "Error al verificar el  email",
      csrfToken: req.csrfToken(),
      message: "Este email no se encuetra en nuesta base de dato",
      error: true,
    });
  }
  //generamos en nuevo token de verifivacion
  exitedEmail.token = generalId();
  await exitedEmail.save();
  emailResetPassword(exitedEmail);
  return res.render("templates/message-verificado", {
    pagina: "Email verificado con exito!",
    message:
      "Le enviamos la intruciones a si email para crea un nuevo password",
  });
};
// verificamos el token
const verityTokenPassword = async (req, res) => {
  const { token } = req.params;
  const user = await Users.findOne({ where: { token } });
  if (!user) {
    res.render("templates/message-verificado", {
      pagina: "Error al verificar emial",
      message: "Este email no existe en nuetra base de datos",
    });
  }

  res.render("auth/reset-password", {
    pagina: "Restablecer mi password",
    csrfToken: req.csrfToken(),
  });
};
//creamos nuevo password
const newPassword = async (req, res) => {
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password minimo 6 catareteres")
    .run(req);

  let results = validationResult(req);

  if (!results.isEmpty()) {
    return res.render("auth/reset-password", {
      pagina: "Restablecer mi password",
      errors: results.array(),
      user: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  const { token } = req.params;
  const { password } = req.body;
  const user = await Users.findOne({ where: { token } });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;
  await user.save();
  res.render("auth/confirm-account", {
    pagina: "Password restablecido",
    message: "Password restablecido con exito!",
  });
};

export {
  login,
  formLogin,
  formRegister,
  formForget,
  Register,
  formVerify,
  resetPassword,
  verityTokenPassword,
  newPassword,
};
