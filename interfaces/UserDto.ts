import type { Role } from "@utils/enums/RoleEnum";

export interface ICreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface ILoginUserDto {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}