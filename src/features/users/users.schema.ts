import z from "zod";

export const usersSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export type User = z.infer<typeof usersSchema>;