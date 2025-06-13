import type { Role } from "@utils/enums/RoleEnum";

export interface ICreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface ILoginUserDto {
  code: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    role: string;
  };
}

export interface ICreateResponse {
  email: string;
}
