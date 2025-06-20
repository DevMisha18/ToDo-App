const { signUpSchema } = require("./src/schemas/auth.ts");
const { z } = require("zod/v4");

const obj = {
  email: "w@w.com",
  password: "pasword",
  confirmPassword: "password",
};

// console.log(signUpSchema.safeParse(obj));
const { error } = signUpSchema.safeParse(obj);
console.log(z.treeifyError(error).properties);

// console.log(z.treeifyError(result.error));
