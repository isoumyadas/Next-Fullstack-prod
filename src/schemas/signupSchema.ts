import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters")
  .max(20, "username must be no more than 20 characters") // message key is deprecated.
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain specail character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email("Invalid email address"),
  password: z.string().min(6, "password must be atleast 6 characters"),
});
