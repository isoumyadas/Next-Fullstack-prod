import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { error: "username must be atleast 2 characters" })
  .max(20, { error: "username must be no more than 20 characters" }) // message key is deprecated.
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: "username must not contain specail character",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "password must be atleast 6 characters" }),
});
