import { z } from "zod/v4";

export const signUpSchema = z
  .object({
    email: z.email("Bad email!"),
    password: z
      .string("Bad password!")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((fields) => fields.password === fields.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type signUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type signInValues = z.infer<typeof signInSchema>;
