import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity
} from "typeorm";
import * as uuidv4 from "uuid/v4";

@Entity()
export class Users extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  // sets type in db and options
  @Column("varchar", { length: 255 })
  email: string;

  // postgres allows any length for text
  // will be hashed so text is fine
  @Column("text")
  password: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
