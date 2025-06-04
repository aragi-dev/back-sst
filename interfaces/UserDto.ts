import type { Role } from "@utils/enums/RoleEnum";

export interface createUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}