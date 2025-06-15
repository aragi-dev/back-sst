import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";

export abstract class EntityPostgresql {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updated_at!: Date;
}
