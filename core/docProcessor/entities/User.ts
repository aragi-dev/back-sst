import { Entity, Column, Unique } from "typeorm";
import { EntityPostgresql } from "@dbBase/EntityPostgresql";
import type { Role } from "@utils/enums/RoleEnum";

@Entity("user")
@Unique(["email"])
export class User extends EntityPostgresql {

  @Column({ name: "role", type: "varchar", length: 20, nullable: false })
  role!: Role;

  @Column({ name: "email", type: "varchar", length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ name: "mfa_secret", type: "text", nullable: false })
  mfaSecret!: string
}
