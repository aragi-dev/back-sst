import { z } from "zod";

export const schema = z.object({
  email: z.string().email().optional(),
  code: z.string().min(6),
});
