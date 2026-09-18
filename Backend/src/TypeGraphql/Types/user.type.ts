import { Field, ID, ObjectType } from "type-graphql";
import { Role } from "./enums.type.js";

@ObjectType("User")
export class UserType {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  firstname: string;

  @Field(() => String)
  lastname: string;

  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: Role;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}