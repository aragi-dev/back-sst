import { z } from "zod";
import { Role } from "@utils/enums/RoleEnum";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([Role.ADMIN, Role.SELLER]),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});