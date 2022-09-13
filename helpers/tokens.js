import jwt from "jsonwebtoken";

const genJwt = (data) =>
  jwt.sign(
    {
      id: data.id,
      name: data.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

const generalId = () =>
  Math.random().toString(32).substring(2) + Date.now().toString(32);

export { generalId, genJwt };
