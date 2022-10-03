import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const inditificarUsuario = async (req, res, next) => {
  const { _token } = req.cookies;

  if (!_token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    const user = await User.scope("eliminarPassword").findByPk(decoded.id);

    if (user) {
      req.user = user;
    } else {
      return res.redirect("/auth/login");
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.clearCookie("_token").redirect("/auth/login");
  }
};
export default inditificarUsuario;
