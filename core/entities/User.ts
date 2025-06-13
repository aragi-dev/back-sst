import { Entity, Column, Unique } from "typeorm";
import BaseEntity from "./base/BaseEntity";
import type { Role } from "@utils/enums/RoleEnum";

@Entity("user")
@Unique(["email"])
export class User extends BaseEntity {
  @Column({ name: "name", type: "varchar", length: 100, nullable: false })
  name!: string;

  @Column({ name: "password_hash", type: "text", nullable: false })
  password_hash!: string;

  @Column({ name: "role", type: "varchar", length: 20, nullable: false })
  role!: Role;

  @Column({ name: "email", type: "varchar", length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ name: "mfa_secret", type: "text", nullable: false })
  mfaSecret!: string
}
