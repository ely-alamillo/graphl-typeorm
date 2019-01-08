import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // sets type in db and options
  @Column("varchar", { length: 255 })
  email: string;

  // postgres allows any length for text
  // will be hashed so text is fine
  @Column("text")
  password: string;
}
