import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  //enviando email
  await transport.sendMail({
    from: "bienesraices.com",
    to: email,
    subject: "Confima tu cuanta en bienes raices",
    text: "Confima tu cuanta en bienes raices",
    html: `<p>Hola: ${name} <p/>
      <p>Confima tu cunta de bienesraices.com</p>
      <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 4000
    }/auth/verify/${token}">Verifica tu cuenta ahora</a>`,
  });
};

const emailResetPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  //enviando email
  await transport.sendMail({
    from: "bienesraices.com",
    to: email,
    subject: "Solicitud de recuperacion de password en bienes raices",
    text: "Resetear tu password en bienes raices",
    html: `<p>Hola: ${name} <p/>
      <p>Sigue el enlace pare resetear tu password de bienesraices.com</p>
      <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 4000
    }/auth/restablecer-password/${token}">Crea un nuevo password</a>`,
  });
};
export { emailRegister, emailResetPassword };
