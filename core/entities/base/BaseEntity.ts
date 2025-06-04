import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";
import type { ZodUUID } from "zod/v4";

export default abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: ZodUUID;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updated_at!: Date;
}
