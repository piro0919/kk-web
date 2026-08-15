import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email().max(254),
  message: z.string().min(1).max(10000),
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(200),
});

export type PostEmailRequestFormData = z.infer<typeof emailSchema>;
