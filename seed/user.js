import bcrypt from "bcrypt";

const user = [
  {
    name: "Romy",
    email: "romyaudio@hotmail.com",
    password: bcrypt.hashSync("malone32", 10),

    verified: true,
  },
];
export default user;
