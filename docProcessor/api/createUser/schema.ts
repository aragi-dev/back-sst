import { Role } from "@utils/enums/RoleEnum";
import { z } from "zod";

export const schema = z.object({
  email: z.string().email(),
  role: z.enum([Role.ADMIN, Role.USER,]),
});
