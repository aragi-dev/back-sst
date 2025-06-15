import type { Role } from "@utils/enums/RoleEnum";

export interface CreateUserDTO {
  email: string;
  role: Role;
}

export interface LoginUserDTO {
  email?: string;
  code: string;
}

export interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    role: string;
  };
}

export interface CreateResponseDTO {
  email: string;
  send: boolean;
}
