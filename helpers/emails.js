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
export { emailRegister };
