import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user.entity.js";
import { Field, GraphQLISODateTime, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity("PasswordResetToken")
export class PasswordResetToken {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=>String)
  @Column({ type: "varchar", unique: true })
  tokenHash: string;

  @Field(()=>GraphQLISODateTime)
  @Column({ type: "timestamp" })
  expiresAt: Date;

  @Field(()=>GraphQLISODateTime)
  @Column({ type: "timestamp", nullable: true })
  usedAt: Date | null;

  @Field(()=>Int)
  @Index()
  @Column({ type: "integer" })
  userId: number;

  @Field(()=>User)
  @ManyToOne(() => User, (user) => user.passwordResetTokens, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(()=>GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}